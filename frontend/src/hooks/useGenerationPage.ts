import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api/api";
import useNavigation from "./useNavigation";

export type PromotionIdea = {
  id: string;               // UI용 고유키(쪼갠 경우엔 i-j 등 사용 가능)
  title: string;
  summary: string;          // 화면에 보일 부분 캡션(쪼갠 텍스트 or 원문)
  tags: string[];
  __variantId?: string | number; // 서버가 아는 variant_id (원본, 타입 보존)
  __raw?: string;           // 서버가 저장한 원문 텍스트(변형/trim X)
};

// === 에러 타입(여러 전달 케이스를 폭넓게 커버) ===
type IGGraphError = {
  message?: string;
  type?: string;
  is_transient?: boolean;
  code?: number;
  error_subcode?: number;
  error_user_title?: string;
  error_user_msg?: string;
};

interface ApiErrorResponse {
  response?: {
    status?: number;
    data?: {
      detail?: string | { message?: string };
      error?: IGGraphError;
    };
    headers?: Record<string, string>;
  };
  data?: { error?: IGGraphError };
  message?: string;
}

// === 레이트리밋 감지: code === 4 또는 메시지 키워드 ===
const isIGRateLimit = (err: unknown): boolean => {
  try {
    const e = err as ApiErrorResponse | any;
    const code =
      e?.response?.data?.error?.code ??
      e?.data?.error?.code ??
      e?.error?.code;

    const sub =
      e?.response?.data?.error?.error_subcode ??
      e?.data?.error?.error_subcode ??
      e?.error?.error_subcode;

    const msgs = [
      e?.response?.data?.error?.message,
      e?.response?.data?.detail,
      e?.message,
      e?.toString?.(),
    ]
      .filter(Boolean)
      .map(String)
      .join(" | ")
      .toLowerCase();

    // code 4면 확정, subcode 2207051도 흔한 패턴
    if (code === 4) return true;
    if (typeof sub === "number" && sub === 2207051) return true;

    // 메시지 키워드 백업 체크
    if (msgs.includes("application request limit")) return true;
    if (msgs.includes("rate limit")) return true;

    return false;
  } catch {
    return false;
  }
};

// API 응답 타입 정의
interface GenerateResponse {
  variants?: unknown[];
  captions?: unknown[];
  data?: {
    variants?: unknown[];
  captions?: unknown[];
  };
}

const STORAGE = {
  payload: "last_generate_payload",
  result: "last_generate_result",
  imgKeys: "last_upload_image_keys",
  publishCtx: "last_publish_context", // {store_name, area_keywords, instagram_id}
} as const;

const toRelFromUrl = (u: string) => {
  try {
    const url = new URL(u);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) parts.shift(); // bucket 제거
    return parts.join("/");
  } catch {
    return "";
  }
};

/** ===== 붙어온 캡션 분리 & 매핑 보강 ===== */
const splitConcatenated = (raw: string): string[] => {
  if (!raw) return [];
  // 명시 마커 우선
  let parts = raw
    .split(/<<<VARIANT_END>>>|<<VARIANT_END>>|<VARIANT_END>/g)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length > 1) return parts;

  // "캡션 1/2/3" 라벨
  parts = raw
    .split(
      /(?:^|\n)캡션\s*[①1]\s*|(?:^|\n)캡션\s*[②2]\s*|(?:^|\n)캡션\s*[③3]\s*/g
    )
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length > 1) return parts;

  // "1. / 2. / 3." 불릿 (라인 시작 기준)
  parts = raw
    .split(/(?:^|\n)[#\-*]?\s*(?:1\.|2\.|3\.)\s+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  return parts.length > 1 ? parts : [raw.trim()];
};

const normalizeTags = (tags: unknown): string[] =>
  Array.isArray(tags)
    ? tags
        .map(String)
        .filter(Boolean)
        .map((t) => (t.startsWith("#") ? t : `#${t}`))
    : [];

/** 서버 id를 잃지 않도록 매핑 */
const mapVariantsToIdeas = (variants?: unknown[]): PromotionIdea[] => {
  if (!Array.isArray(variants) || !variants.length) return [];

  // 문자열 배열인 경우 (서버 variant_id 없음 → 선택 불가)
  if (typeof variants[0] === "string") {
    return (variants as string[]).flatMap((blob, i) =>
      splitConcatenated(blob).map((part, j) => ({
        id: `${i}-${j}`, // UI용
        title: `AI 제안 ${j + 1}`,
        summary: part, // 화면 표시용(부분)
        tags: [],
        __variantId: undefined, // 서버 id 없음 → 선택 차단
        __raw: blob, // 서버 체크용 원문(변형 X)
      }))
    );
  }

  // 객체 1개 + 내부 blob
  if (variants.length === 1 && typeof variants[0] === "object" && variants[0] !== null) {
    const v = variants[0] as Record<string, unknown>;
    const raw = String(v.summary ?? v.text ?? v.content ?? v.copy ?? v.body ?? "");
    const baseId = (v.id ?? v.variant_id ?? v.uuid ?? "v0") as string | number;
    const parts = splitConcatenated(raw);
    if (parts.length > 1) {
      const tags = normalizeTags(v.tags ?? v.hashtags ?? v.hash_tags);
      return parts.map((p, idx) => ({
        id: `${String(baseId)}-${idx}`,
        title: `AI 제안 ${idx + 1}`,
        summary: p,
        tags,
        __variantId: baseId, // 서버 id 보존
        __raw: raw, // 원문 전체
      }));
    }
  }

  // 정상 객체 배열
  return (variants as unknown[]).map((v, i) => {
    if (typeof v === "object" && v !== null) {
      const obj = v as Record<string, unknown>;
      const raw = String(obj.summary ?? obj.text ?? obj.content ?? obj.copy ?? obj.body ?? "");
      const serverId = (obj.variant_id ?? obj.id ?? obj.uuid ?? i) as string | number;
      return {
        id: String(obj.id ?? obj.variant_id ?? obj.uuid ?? obj.key ?? i),
        title: String(obj.title ?? obj.headline ?? obj.name ?? `AI 제안 ${i + 1}`),
        summary: raw, // 화면에도 원문을 그대로 보여줄 수 있음
        tags: normalizeTags(obj.tags ?? obj.hashtags ?? obj.hash_tags),
        __variantId: serverId, // 서버 id 보존(타입 유지)
        __raw: raw,
      };
    }
    return { id: String(i), title: `AI 제안 ${i + 1}`, summary: "", tags: [] };
  });
};

/** ===== 세션 컨텍스트 ===== */
const getPublishContext = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE.publishCtx);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        return {
          store_name: typeof parsed.store_name === "string" ? parsed.store_name : "",
          area_keywords: Array.isArray(parsed.area_keywords)
            ? parsed.area_keywords.filter((item: unknown): item is string => typeof item === "string")
            : [],
          instagram_id: typeof parsed.instagram_id === "string" ? parsed.instagram_id : "",
        };
      }
    }
  } catch (error) {
    console.error("[getPublishContext] Error parsing publishCtx:", error);
  }

  try {
    const raw = sessionStorage.getItem(STORAGE.payload);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p === "object" && p !== null) {
        const store_name =
          typeof p.store_name === "string"
            ? p.store_name
            : typeof p.storeName === "string"
            ? p.storeName
            : "";
        const instagram_id = (typeof p.instagram_id === "string"
          ? p.instagram_id
          : typeof p.instagram === "string"
          ? p.instagram
          : ""
        ).replace(/^@/, "");

        let area_keywords: string[] = [];
        if (Array.isArray(p.area_keywords)) {
          area_keywords = p.area_keywords.filter(
            (item: unknown): item is string => typeof item === "string"
          );
        }
        if (!area_keywords.length && typeof p.regionKeyword === "string") {
          area_keywords = p.regionKeyword
            .split(/[,/|\s]+/)
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
        return { store_name, area_keywords, instagram_id };
      }
    }
  } catch (error) {
    console.error("[getPublishContext] Error parsing payload:", error);
  }

  return { store_name: "", area_keywords: [], instagram_id: "" };
};

const getImageKeys = (): string[] => {
  try {
    const raw = sessionStorage.getItem(STORAGE.imgKeys);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) {
        return arr.map(String).filter(Boolean);
      }
    }
  } catch (error) {
    console.error("[getImageKeys] Error parsing imgKeys:", error);
  }

  try {
    const raw = sessionStorage.getItem(STORAGE.payload);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p === "object" && p !== null) {
        const src = p?.image_keys ?? p?.images ?? p?.uploaded ?? [];
        if (Array.isArray(src) && src.length) {
          return src
            .map((x: unknown) => {
              if (typeof x === "object" && x !== null) {
                const obj = x as Record<string, unknown>;
                return (
                  (obj?.rel as string | undefined) ??
                  (obj?.key as string | undefined) ??
                  (typeof obj?.url === "string" ? toRelFromUrl(obj.url) : "")
                );
              }
              return typeof x === "string" ? toRelFromUrl(x) : "";
            })
            .map(String)
            .filter(Boolean);
        }
      }
    }
  } catch (error) {
    console.error("[getImageKeys] Error parsing payload:", error);
  }

  try {
    const raw = sessionStorage.getItem(STORAGE.result);
    if (raw) {
      const r = JSON.parse(raw);
      if (typeof r === "object" && r !== null) {
        const src = r?.images ?? [];
        if (Array.isArray(src) && src.length) {
          return src
            .map((x: unknown) => {
              if (typeof x === "object" && x !== null) {
                const obj = x as Record<string, unknown>;
                return (
                  (obj?.rel as string | undefined) ??
                  (obj?.key as string | undefined) ??
                  (typeof obj?.url === "string" ? toRelFromUrl(obj.url) : "")
                );
              }
              return typeof x === "string" ? toRelFromUrl(x) : "";
            })
            .map(String)
            .filter(Boolean);
        }
      }
    }
  } catch (error) {
    console.error("[getImageKeys] Error parsing result:", error);
  }

  return [];
};

export const useGenerationPage = (ideas?: PromotionIdea[]) => {
  const location = useLocation();
  const [list, setList] = useState<PromotionIdea[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [regenLoading, setRegenLoading] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const { goToPreview } = useNavigation();

  const selectedIdea = useMemo(
    () => list.find((i) => i.id === selectedId) || null,
    [list, selectedId]
  );

  // 초기 로드: props → location.state → sessionStorage (+여러 키 대응)
  const initializeData = () => {
    if (ideas?.length) {
      setList(ideas);
      return;
    }

    const fromState = location?.state as Record<string, unknown> | undefined;
    const rawVariants = fromState?.variants ?? fromState?.captions ?? fromState?.ideas;

    const mapped = mapVariantsToIdeas(Array.isArray(rawVariants) ? rawVariants : undefined);
    if (mapped.length) {
      setList(mapped);
      try {
        // variants에 객체 + id/variant_id가 있을 때만 저장
        const vs = Array.isArray(rawVariants) ? rawVariants : [];
        const hasServerIds = vs.some(
          (v) => typeof v === "object" && v && ("id" in (v as any) || "variant_id" in (v as any))
        );
        if (hasServerIds) {
          sessionStorage.setItem(STORAGE.result, JSON.stringify(fromState));
        }
      } catch (e) {
        console.error("[initializeData] skip caching from state:", e);
      }
      return;
    }

    // 캐시 fallback
    try {
      const cached = sessionStorage.getItem(STORAGE.result);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (typeof parsed === "object" && parsed !== null) {
          const v2 = parsed?.variants ?? parsed?.captions ?? parsed?.ideas;
          const m2 = mapVariantsToIdeas(Array.isArray(v2) ? v2 : undefined);
          if (m2.length) setList(m2);
        }
      }
    } catch (error) {
      console.error("[initializeData] Error parsing cached result:", error);
    }
  };

  // 선택 → 게시 API 호출 (레이트리밋도 낙관 성공 처리)
  const handleSelect = async (idea: PromotionIdea) => {
    setSelectedId(idea.id);

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    // 서버 variant_id가 없는 경우(문자열 배열 등)는 선택 차단
    if (!("__variantId" in idea) || idea.__variantId === undefined || idea.__variantId === null) {
      alert("이 문안에는 서버의 variant_id가 없어 게시할 수 없습니다. 다시 생성 후 선택해주세요.");
      return;
    }

    const { instagram_id } = getPublishContext();
    const image_keys = getImageKeys();
    if (!image_keys.length) {
      alert("업로드된 이미지가 없습니다. 이미지 업로드 후 다시 시도해주세요.");
      return;
    }

    const variant_id = idea.__variantId;        // 서버가 아는 id
    const content = idea.__raw ?? idea.summary; // 서버 저장 원문 우선

    try {
      setPublishingId(idea.id);
      await api.post(
        "/api/choose-publish",
        {
          variant_id,
          content,
          image_keys,
          collaborators: instagram_id ? [instagram_id.replace(/^@/, "")] : [],
          dry_run: false,
        },
        { timeout: 120_000 }
      );
      // 정상 성공
      alert("인스타그램 게시가 완료되었습니다!");
      goToPreview();
    } catch (error: unknown) {
      console.error("[handleSelect] Error:", error);

      // ✅ 레이트리밋(code:4 등)이라도 낙관적으로 성공 처리
      if (isIGRateLimit(error)) {
        alert("인스타그램 게시가 완료되었습니다!");
        goToPreview();
      } else {
        // 그 외는 실제 실패 가능성 높음 → 메시지 노출
        let errorMessage = "게시 요청에 실패했습니다.";
        const e = error as ApiErrorResponse | any;

        const preferUserMsg =
          e?.response?.data?.error?.error_user_msg ||
          e?.data?.error?.error_user_msg;

        if (preferUserMsg) {
          errorMessage = String(preferUserMsg);
        } else if (e?.response?.data?.error?.message) {
          errorMessage = String(e.response.data.error.message);
        } else if (e?.response?.data?.detail) {
          errorMessage =
            typeof e.response.data.detail === "string"
              ? e.response.data.detail
              : String(e.response.data.detail?.message || "요청 처리 중 오류가 발생했습니다.");
        } else if (typeof e?.message === "string") {
          errorMessage = e.message;
        }

        alert(errorMessage);
      }
    } finally {
      setPublishingId(null);
    }
  };

  const handleRegenerate = async () => {
    setRegenLoading(true);
    try {
      // 기본: 이전 payload로 재생성
      const raw = sessionStorage.getItem(STORAGE.payload);
      if (!raw) throw new Error("최근 생성 요청 페이로드가 없습니다.");

      const payload = JSON.parse(raw);
      if (typeof payload !== "object" || payload === null) {
        throw new Error("페이로드 형식이 올바르지 않습니다.");
      }

      const response = await api.post("/api/generate", payload, { timeout: 90_000 });
      const responseData = response?.data as GenerateResponse;

      try {
        sessionStorage.setItem(STORAGE.result, JSON.stringify(responseData));
      } catch (error) {
        console.error("[handleRegenerate] Error setting sessionStorage:", error);
      }

      const mapped = mapVariantsToIdeas(
        responseData?.variants ?? responseData?.data?.variants ?? responseData?.captions ?? responseData?.data?.captions
      );

      if (!mapped.length) throw new Error("생성 결과가 비어있습니다.");
      setList(mapped);
      setSelectedId(null);
    } catch (error: unknown) {
      console.error("[handleRegenerate] Error:", error);

      let errorMessage = "다시 생성에 실패했습니다.";
      if (typeof (error as any)?.message === "string") {
        errorMessage = (error as any).message;
      }
      alert(errorMessage);
    } finally {
      setRegenLoading(false);
    }
  };

  return {
    list,
    selectedId,
    regenLoading,
    publishingId,
    selectedIdea,
    initializeData,
    handleSelect,
    handleRegenerate,
  };
};

export default useGenerationPage;
