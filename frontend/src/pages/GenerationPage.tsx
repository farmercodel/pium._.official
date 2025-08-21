import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { MotionProps, Transition } from "framer-motion";
import { api } from "../api/api";

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
      <p className="mt-2 text-sm text-gray-600 leading-6">{idea.summary}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {idea.tags.map((t, i) => <TagChip key={i} text={t} />)}
      </div>

      <motion.button
        type="button"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-60"
        onClick={(e) => { e.stopPropagation(); !disabled && onSelect(idea); }}
        disabled={disabled}
        {...interactions}
      >
        {ctaLoading ? "업로드 중..." : "선택하기"}
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

// --- helpers: variants → ideas 매핑(앞서 써둔 버전과 동일/간략) ---
const normalizeTags = (tags: unknown): string[] =>
  Array.isArray(tags) ? tags.map(String).filter(Boolean).map(t => t.startsWith("#") ? t : `#${t}`) : [];

const mapVariantsToIdeas = (variants?: any[]): PromotionIdea[] =>
  Array.isArray(variants) ? variants.map((v: any, i: number) => ({
    id: String(v.id ?? v.variant_id ?? v.uuid ?? v.key ?? i),
    title: v.title ?? v.headline ?? v.name ?? `AI 제안 ${i + 1}`,
    summary: v.summary ?? v.text ?? v.content ?? v.copy ?? v.body ?? "",
    tags: normalizeTags(v.tags ?? v.hashtags ?? v.hash_tags),
  })) : [];

// --- 핵심: 세션에서 게시에 필요한 컨텍스트 수집 ---
const getPublishContext = () => {
  // 1) 명시 저장된 컨텍스트
  try {
    const raw = sessionStorage.getItem(STORAGE.publishCtx);
    if (raw) return JSON.parse(raw) as { store_name?: string; area_keywords?: string[]; instagram_id?: string };
  } catch {}
  // 2) payload에서 유추
  try {
    const raw = sessionStorage.getItem(STORAGE.payload);
    if (raw) {
      const p = JSON.parse(raw);
      const store_name = p.store_name ?? p.storeName ?? "";
      const instagram_id = p.instagram_id ?? p.instagram ?? "";
      let area_keywords: string[] = [];
      if (Array.isArray(p.area_keywords)) area_keywords = p.area_keywords.filter(Boolean).map(String);
      // fallback: regionKeyword를 콤마/공백 분리
      if (!area_keywords.length && p.regionKeyword) {
        area_keywords = String(p.regionKeyword).split(/[,/|\s]+/).map((s: string) => s.trim()).filter(Boolean);
      }
      return { store_name, area_keywords, instagram_id };
    }
  } catch {}
  return { store_name: "", area_keywords: [], instagram_id: "" };
};

const getImageKeys = (): string[] => {
  // 명시 저장된 이미지 rel 목록
  try {
    const raw = sessionStorage.getItem(STORAGE.imgKeys);
    if (raw) return (JSON.parse(raw) as any[]).map(String).filter(Boolean);
  } catch {}
  // payload 내부에서 추정 (images 배열에 rel/key/url 등)
  try {
    const raw = sessionStorage.getItem(STORAGE.payload);
    if (raw) {
      const p = JSON.parse(raw);
      const src = p.image_keys ?? p.images ?? p.uploaded ?? [];
      if (Array.isArray(src)) {
        return src.map((x: any) => (x?.rel ?? x?.key ?? x?.id ?? x?.url ?? x)).map(String).filter(Boolean);
      }
    }
  } catch {}
  return [];
};

export const PromoGeneratePage = ({ ideas, onSelect, onRegenerate }: PromoGenerateProps): JSX.Element => {
  const location = useLocation() as any;
  const [list, setList] = useState<PromotionIdea[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [regenLoading, setRegenLoading] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  // 초기 로드: props → location.state → sessionStorage
  useEffect(() => {
    if (ideas?.length) { setList(ideas); return; }
    const fromState = location?.state;
    const variants = fromState?.variants ?? fromState?.data?.variants;
    const mapped = mapVariantsToIdeas(variants);
    if (mapped.length) { setList(mapped); try { sessionStorage.setItem(STORAGE.result, JSON.stringify(fromState)); } catch {} return; }
    try {
      const cached = sessionStorage.getItem(STORAGE.result);
      if (cached) {
        const parsed = JSON.parse(cached);
        const v2 = parsed?.variants ?? parsed?.data?.variants;
        const m2 = mapVariantsToIdeas(v2);
        if (m2.length) setList(m2);
      }
    } catch {}
  }, [ideas, location?.state]);

  const selectedIdea = useMemo(() => list.find((i) => i.id === selectedId) || null, [list, selectedId]);

  // 선택 → 즉시 게시 API 호출
  const handleSelect = async (idea: PromotionIdea) => {
    setSelectedId(idea.id);
    onSelect?.(idea);

    const token = localStorage.getItem("access_token");
    if (!token) { alert("로그인 후 이용 가능합니다."); return; }

    const { store_name, area_keywords, instagram_id } = getPublishContext();
    const image_keys = getImageKeys();
    if (!image_keys.length) { alert("업로드된 이미지가 없습니다. 이미지 업로드 후 다시 시도해주세요."); return; }

    const body = {
      variant_id: idea.id,
      content: idea.summary,            // 백엔드 캡션 필드
      image_keys,                       // /files/upload의 rel 들
      collaborators: instagram_id ? [instagram_id] : [],
      dry_run: false,
      store_name,
      area_keywords,
    };

    try {
      setPublishingId(idea.id);
      const res = await api.post("/api/choose-publish", body);
      // 성공 UX: 토스트/알럿/리다이렉트 등
      alert("인스타그램 게시 요청이 완료되었습니다.");
      // 필요 시: 게시 결과 페이지로 이동/갱신
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.detail ?? e?.message ?? "게시 요청에 실패했습니다.");
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
      const { data } = await api.post("/api/generate", payload, { timeout: 60_000 });
      try { sessionStorage.setItem(STORAGE.result, JSON.stringify(data)); } catch {}
      const mapped = mapVariantsToIdeas(data?.variants);
      if (!mapped.length) throw new Error("생성 결과가 비어있습니다.");
      setList(mapped); setSelectedId(null);
    } catch (e: any) {
      alert(e?.message ?? "다시 생성에 실패했습니다.");
    } finally { setRegenLoading(false); }
  };

  return (
    <main className="font-sans">
      <section className="relative w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <header className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">AI가 제안한 홍보글 {Math.max(3, list.length)}개</h1>
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
              {regenLoading ? "생성 중..." : "다시 생성하기"}
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
