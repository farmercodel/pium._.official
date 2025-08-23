import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api/api";
import useNavigation from "./useNavigation";

export type PromotionIdea = { id: string; title: string; summary: string; tags: string[]; };

// API 응답 타입 정의
interface GenerateResponse {
  variants?: unknown[];
  captions?: unknown[];
  data?: {
    variants?: unknown[];
    captions?: unknown[];
  };
}

interface ApiErrorResponse {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message?: string;
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
  } catch { return ""; }
};

/** ===== 붙어온 캡션 분리 & 매핑 보강 ===== */
const splitConcatenated = (raw: string): string[] => {
  if (!raw) return [];
  // 명시 마커 우선
  let parts = raw.split(/<<<VARIANT_END>>>|<<VARIANT_END>>|<VARIANT_END>/g)
                 .map(s => s.trim()).filter(Boolean);
  if (parts.length > 1) return parts;

  // "캡션 1/2/3" 라벨
  parts = raw.split(/(?:^|\n)캡션\s*[①1]\s*|(?:^|\n)캡션\s*[②2]\s*|(?:^|\n)캡션\s*[③3]\s*/g)
             .map(s => s.trim()).filter(Boolean);
  if (parts.length > 1) return parts;

  // "1. / 2. / 3." 불릿 (라인 시작 기준)
  parts = raw.split(/(?:^|\n)[#\-*]?\s*(?:1\.|2\.|3\.)\s+/g)
             .map(s => s.trim()).filter(Boolean);

  return parts.length > 1 ? parts : [raw.trim()];
};

const normalizeTags = (tags: unknown): string[] =>
  Array.isArray(tags) ? tags.map(String).filter(Boolean).map(t => t.startsWith("#") ? t : `#${t}`) : [];

const mapVariantsToIdeas = (variants?: unknown[]): PromotionIdea[] => {
  if (!variants || !Array.isArray(variants)) return [];

  // 문자열 배열로 온 경우
  if (variants.length && typeof variants[0] === "string") {
    return (variants as string[]).flatMap((blob, i) =>
      splitConcatenated(blob).map((t, j) => ({
        id: `${i}-${j}-${t.slice(0,12)}`,
        title: `AI 제안 ${j + 1}`,
        summary: t,
        tags: [],
      }))
    );
  }

  // 객체 1개인데 내부가 blob인 경우
  if (variants.length === 1) {
    const v = variants[0] as Record<string, unknown>;
    const text = String(v.summary ?? v.text ?? v.content ?? v.copy ?? v.body ?? "");
    const parts = splitConcatenated(text);
    if (parts.length > 1) {
      const tags = normalizeTags(v.tags ?? v.hashtags ?? v.hash_tags);
      return parts.map((t, idx) => ({
        id: `${String(v.id ?? v.variant_id ?? v.uuid ?? "v0")}-${idx}`,
        title: `AI 제안 ${idx + 1}`,
        summary: t,
        tags,
      }));
    }
  }

  // 정상 객체 배열
  return variants.map((v: unknown, i: number) => {
    if (typeof v === 'object' && v !== null) {
      const obj = v as Record<string, unknown>;
      return {
        id: String(obj.id ?? obj.variant_id ?? obj.uuid ?? obj.key ?? i),
        title: String(obj.title ?? obj.headline ?? obj.name ?? `AI 제안 ${i + 1}`),
        summary: String(obj.summary ?? obj.text ?? obj.content ?? obj.copy ?? obj.body ?? ""),
        tags: normalizeTags(obj.tags ?? obj.hashtags ?? obj.hash_tags),
      };
    }
    return {
      id: String(i),
      title: `AI 제안 ${i + 1}`,
      summary: "",
      tags: [],
    };
  });
};

/** ===== 세션 컨텍스트 ===== */
const getPublishContext = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE.publishCtx);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          store_name: typeof parsed.store_name === 'string' ? parsed.store_name : '',
          area_keywords: Array.isArray(parsed.area_keywords) ? parsed.area_keywords.filter((item: unknown): item is string => typeof item === 'string') : [],
          instagram_id: typeof parsed.instagram_id === 'string' ? parsed.instagram_id : '',
        };
      }
    }
  } catch (error) {
    console.error('[getPublishContext] Error parsing publishCtx:', error);
  }
  
  try {
    const raw = sessionStorage.getItem(STORAGE.payload);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p === 'object' && p !== null) {
        const store_name = typeof p.store_name === 'string' ? p.store_name : 
                          typeof p.storeName === 'string' ? p.storeName : "";
        const instagram_id = (typeof p.instagram_id === 'string' ? p.instagram_id : 
                             typeof p.instagram === 'string' ? p.instagram : "").replace(/^@/, "");
        
        let area_keywords: string[] = [];
        if (Array.isArray(p.area_keywords)) {
          area_keywords = p.area_keywords.filter((item: unknown): item is string => typeof item === 'string');
        }
        if (!area_keywords.length && typeof p.regionKeyword === 'string') {
          area_keywords = p.regionKeyword.split(/[,/|\s]+/).map((s: string) => s.trim()).filter(Boolean);
        }
        return { store_name, area_keywords, instagram_id };
      }
    }
  } catch (error) {
    console.error('[getPublishContext] Error parsing payload:', error);
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
    console.error('[getImageKeys] Error parsing imgKeys:', error);
  }
  
  try {
    const raw = sessionStorage.getItem(STORAGE.payload);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p === 'object' && p !== null) {
        const src = p?.image_keys ?? p?.images ?? p?.uploaded ?? [];
        if (Array.isArray(src) && src.length) {
          return src
            .map((x: unknown) => {
              if (typeof x === 'object' && x !== null) {
                const obj = x as Record<string, unknown>;
                return obj?.rel ?? obj?.key ?? (typeof obj?.url === 'string' ? toRelFromUrl(obj.url) : '');
              }
              return typeof x === 'string' ? toRelFromUrl(x) : '';
            })
            .map(String)
            .filter(Boolean);
        }
      }
    }
  } catch (error) {
    console.error('[getImageKeys] Error parsing payload:', error);
  }
  
  try {
    const raw = sessionStorage.getItem(STORAGE.result);
    if (raw) {
      const r = JSON.parse(raw);
      if (typeof r === 'object' && r !== null) {
        const src = r?.images ?? [];
        if (Array.isArray(src) && src.length) {
          return src
            .map((x: unknown) => {
              if (typeof x === 'object' && x !== null) {
                const obj = x as Record<string, unknown>;
                return obj?.rel ?? obj?.key ?? (typeof obj?.url === 'string' ? toRelFromUrl(obj.url) : '');
              }
              return typeof x === 'string' ? toRelFromUrl(x) : '';
            })
            .map(String)
            .filter(Boolean);
        }
      }
    }
  } catch (error) {
    console.error('[getImageKeys] Error parsing result:', error);
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

  const selectedIdea = useMemo(() => list.find((i) => i.id === selectedId) || null, [list, selectedId]);

  // 초기 로드: props → location.state → sessionStorage (+여러 키 대응)
  const initializeData = () => {
    if (ideas?.length) { setList(ideas); return; }

    const fromState = location?.state as Record<string, unknown> | undefined;
    const rawVariants =
      fromState?.variants ??
      fromState?.captions ??
      fromState?.ideas;

    const mapped = mapVariantsToIdeas(Array.isArray(rawVariants) ? rawVariants : undefined);
    if (mapped.length) {
      setList(mapped);
      try { sessionStorage.setItem(STORAGE.result, JSON.stringify(fromState)); } catch (error) {
        console.error('[useEffect] Error setting sessionStorage:', error);
      }
      return;
    }

    // 캐시 fallback
    try {
      const cached = sessionStorage.getItem(STORAGE.result);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (typeof parsed === 'object' && parsed !== null) {
          const v2 =
            parsed?.variants ??
            parsed?.captions ??
            parsed?.ideas;
          const m2 = mapVariantsToIdeas(Array.isArray(v2) ? v2 : undefined);
          if (m2.length) setList(m2);
        }
      }
    } catch (error) {
      console.error('[useEffect] Error parsing cached result:', error);
    }
  };

  // 선택 → 게시 API 호출
  const handleSelect = async (idea: PromotionIdea) => {
    setSelectedId(idea.id);

    const token = localStorage.getItem("access_token");
    if (!token) { alert("로그인 후 이용 가능합니다."); return; }

    const { store_name, area_keywords, instagram_id } = getPublishContext();
    const image_keys = getImageKeys();
    if (!image_keys.length) {
      alert("업로드된 이미지가 없습니다. 이미지 업로드 후 다시 시도해주세요.");
      return;
    }

    const body = {
      variant_id: idea.id,
      content: idea.summary,
      image_keys,
      collaborators: instagram_id ? [instagram_id.replace(/^@/, "")] : [],
      dry_run: false,
      store_name,
      area_keywords,
    };

    try {
      setPublishingId(idea.id);
      await api.post("/api/choose-publish", body, { timeout: 120_000 }); // 여유 있는 타임아웃
      alert("인스타그램 게시 요청이 완료되었습니다.");
      goToPreview();
    } catch (error: unknown) {
      console.error('[handleSelect] Error:', error);
      
      let errorMessage = "게시 요청에 실패했습니다.";
      if (error && typeof error === 'object' && 'response' in error) {
        const errorObj = error as ApiErrorResponse;
        if (errorObj.response?.data?.detail) {
          errorMessage = errorObj.response.data.detail;
        }
      } else if (error && typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: string }).message === 'string') {
        errorMessage = (error as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
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
      if (typeof payload !== 'object' || payload === null) {
        throw new Error("페이로드 형식이 올바르지 않습니다.");
      }
      
      const response = await api.post("/api/generate", payload, { timeout: 90_000 });
      const responseData = response?.data as GenerateResponse;
      
      try { sessionStorage.setItem(STORAGE.result, JSON.stringify(responseData)); } catch (error) {
        console.error('[handleRegenerate] Error setting sessionStorage:', error);
      }
      
      const mapped = mapVariantsToIdeas(
        responseData?.variants ?? 
        responseData?.data?.variants ?? 
        responseData?.captions ?? 
        responseData?.data?.captions
      );
      
      if (!mapped.length) throw new Error("생성 결과가 비어있습니다.");
      setList(mapped); setSelectedId(null);
    } catch (error: unknown) {
      console.error('[handleRegenerate] Error:', error);
      
      let errorMessage = "다시 생성에 실패했습니다.";
      if (error && typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: string }).message === 'string') {
        errorMessage = (error as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally { setRegenLoading(false); }
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
