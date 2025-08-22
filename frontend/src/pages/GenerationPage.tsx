// src/pages/PromoGeneratePage.tsx
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { MotionProps, Transition } from "framer-motion";
import { api } from "../api/api";
import useNavigation from "../hooks/useNavigation";

// 타입 가드 함수들
const isError = (obj: unknown): obj is Error => 
  obj instanceof Error;

const hasResponse = (obj: unknown): obj is { response?: { data?: { detail?: string } } } => 
  typeof obj === 'object' && obj !== null && 'response' in obj;

const hasMessage = (obj: unknown): obj is { message: string } => 
  typeof obj === 'object' && obj !== null && 'message' in obj && typeof (obj as { message: string }).message === 'string';

const hasProperty = <K extends string>(obj: unknown, key: K): obj is Record<K, unknown> => 
  typeof obj === 'object' && obj !== null && key in obj;

/** spring 인터랙션 */
const useLiftInteractions = (): MotionProps => {
  const reduce = useReducedMotion();
  if (reduce) return {};
  const springLift: Transition = { type: "spring", stiffness: 300, damping: 20 };
  return { whileHover: { y: -6, scale: 1.01 }, whileTap: { scale: 0.98, y: -1 }, transition: springLift };
};

export type PromotionIdea = { id: string; title: string; summary: string; tags: string[]; };
export type PromoGenerateProps = {
  ideas?: PromotionIdea[];
  onSelect?: (idea: PromotionIdea) => void;
  onRegenerate?: () => Promise<PromotionIdea[]> | PromotionIdea[];
};

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

const TagChip = ({ text }: { text: string }) => (
  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100">
    {text}
  </span>
);

const IdeaCard = ({
  idea, index, selected, onSelect, ctaLoading, disabled,
}: {
  idea: PromotionIdea; index: number; selected: boolean;
  onSelect: (idea: PromotionIdea) => void; ctaLoading?: boolean; disabled?: boolean;
}) => {
  const interactions = useLiftInteractions();
  return (
    <motion.div
      role="button" tabIndex={0} aria-pressed={selected}
      onClick={() => !disabled && onSelect(idea)}
      onKeyDown={(e) => !disabled && (e.key === "Enter" || e.key === " ") && onSelect(idea)}
      className={[
        "group relative h-full rounded-2xl bg-white p-6 shadow-sm transition-shadow",
        "border", selected ? "border-emerald-400 shadow-md" : "border-gray-200 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
        disabled ? "opacity-70 pointer-events-none" : "",
      ].join(" ")}
      {...interactions}
    >
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white shadow">
        <span className="text-sm font-bold">{index + 1}</span>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-gray-800">{idea.title}</h3>
      <p className="mt-2 text-sm text-gray-600 leading-6 whitespace-pre-line">{idea.summary}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {idea.tags.map((t, i) => <TagChip key={i} text={t} />)}
      </div>

      <motion.button
        type="button"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-60"
        onClick={(e) => { 
          e.stopPropagation(); 
          if (!disabled) {
            onSelect(idea);
          }
        }}
        disabled={disabled}
        {...interactions}
      >
        {ctaLoading ? "업로드 중" : "선택하기"}
        <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden
          animate={ctaLoading ? { rotate: 360 } : { rotate: 0 }}
          transition={ctaLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
        >
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </motion.button>

      {selected && <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-emerald-300/60" aria-hidden />}
    </motion.div>
  );
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
        const src = r?.images ?? (hasProperty(r, 'data') && hasProperty(r.data, 'images') ? r.data.images : []);
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

export const PromoGeneratePage = ({ ideas, onSelect, onRegenerate }: PromoGenerateProps): JSX.Element => {
  const location = useLocation();
  const [list, setList] = useState<PromotionIdea[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [regenLoading, setRegenLoading] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const { goToPreview } = useNavigation();

  // 초기 로드: props → location.state → sessionStorage (+여러 키 대응)
  useEffect(() => {
    if (ideas?.length) { setList(ideas); return; }

    const fromState = location?.state as Record<string, unknown> | undefined;
    const rawVariants =
      fromState?.variants ??
      (hasProperty(fromState, 'data') && hasProperty(fromState.data, 'variants') ? fromState.data.variants : undefined) ??
      fromState?.captions ??
      (hasProperty(fromState, 'data') && hasProperty(fromState.data, 'captions') ? fromState.data.captions : undefined) ??
      fromState?.ideas ??
      (hasProperty(fromState, 'data') && hasProperty(fromState.data, 'ideas') ? fromState.data.ideas : undefined);

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
            (hasProperty(parsed, 'data') && hasProperty(parsed.data, 'variants') ? parsed.data.variants : undefined) ??
            parsed?.captions ??
            (hasProperty(parsed, 'data') && hasProperty(parsed.data, 'captions') ? parsed.data.captions : undefined) ??
            parsed?.ideas ??
            (hasProperty(parsed, 'data') && hasProperty(parsed.data, 'ideas') ? parsed.data.ideas : undefined);
          const m2 = mapVariantsToIdeas(Array.isArray(v2) ? v2 : undefined);
          if (m2.length) setList(m2);
        }
      }
    } catch (error) {
      console.error('[useEffect] Error parsing cached result:', error);
    }
  }, [ideas, location?.state]);

  const selectedIdea = useMemo(() => list.find((i) => i.id === selectedId) || null, [list, selectedId]);

  // 선택 → 게시 API 호출
  const handleSelect = async (idea: PromotionIdea) => {
    setSelectedId(idea.id);
    onSelect?.(idea);

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
      if (hasResponse(error) && error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (hasMessage(error)) {
        errorMessage = error.message;
      } else if (isError(error)) {
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
      if (onRegenerate) {
        const next = await onRegenerate();
        if (Array.isArray(next) && next.length) { setList(next); setSelectedId(null); }
        return;
      }
      // 기본: 이전 payload로 재생성
      const raw = sessionStorage.getItem(STORAGE.payload);
      if (!raw) throw new Error("최근 생성 요청 페이로드가 없습니다.");
      
      const payload = JSON.parse(raw);
      if (typeof payload !== 'object' || payload === null) {
        throw new Error("페이로드 형식이 올바르지 않습니다.");
      }
      
      const { data } = await api.post("/api/generate", payload, { timeout: 90_000 });
      try { sessionStorage.setItem(STORAGE.result, JSON.stringify(data)); } catch (error) {
        console.error('[handleRegenerate] Error setting sessionStorage:', error);
      }
      
      const mapped = mapVariantsToIdeas(
        data?.variants ?? (hasProperty(data, 'data') && hasProperty(data.data, 'variants') ? data.data.variants : undefined) ?? 
        data?.captions ?? (hasProperty(data, 'data') && hasProperty(data.data, 'captions') ? data.data.captions : undefined)
      );
      
      if (!mapped.length) throw new Error("생성 결과가 비어있습니다.");
      setList(mapped); setSelectedId(null);
    } catch (error: unknown) {
      console.error('[handleRegenerate] Error:', error);
      
      let errorMessage = "다시 생성에 실패했습니다.";
      if (hasMessage(error)) {
        errorMessage = error.message;
      } else if (isError(error)) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally { setRegenLoading(false); }
  };

  return (
    <main className="font-sans">
      <section className="relative w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <header className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              AI가 제안한 홍보글 {Math.max(3, list.length)}개
            </h1>
          </header>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {list.map((idea, idx) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                index={idx}
                selected={selectedId === idea.id}
                onSelect={handleSelect}
                ctaLoading={publishingId === idea.id}
                disabled={!!publishingId}
              />
            ))}
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <motion.button
              type="button" disabled={regenLoading}
              onClick={handleRegenerate}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-7 sm:py-3.5 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white text-sm sm:text-base font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-70"
              whileHover={{ y: -6, scale: 1.01 }} whileTap={{ scale: 0.98, y: -1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {regenLoading ? "생성 중" : "다시 생성하기"}
              <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden
                animate={regenLoading ? { rotate: 360 } : { rotate: 0 }}
                transition={regenLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
              >
                <path d="M4.5 12a7.5 7.5 0 111.8 4.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.5 16.9V12h4.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </motion.button>

            {selectedIdea && (
              <p className="mt-3 text-sm text-emerald-700">선택됨: <span className="font-semibold">{selectedIdea.title}</span></p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default PromoGeneratePage;
