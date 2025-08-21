import type { JSX } from "react";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MotionProps, Transition } from "framer-motion";

/** spring 인터랙션(접근성 고려: reduceMotion 시 비활성) */
const useLiftInteractions = (): MotionProps => {
  const reduce = useReducedMotion();
  if (reduce) return {};
  const springLift: Transition = { type: "spring", stiffness: 300, damping: 20 };
  return {
    whileHover: { y: -6, scale: 1.01 },
    whileTap: { scale: 0.98, y: -1 },
    transition: springLift,
  };
};

// ---------------- Types ----------------
export type PromotionIdea = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
};

export type PromoGenerateProps = {
  ideas?: PromotionIdea[]; // 외부에서 생성한 아이디어를 주입할 수 있음
  onSelect?: (idea: PromotionIdea) => void; // 선택 시 콜백
  onRegenerate?: () => Promise<PromotionIdea[]> | PromotionIdea[]; // 다시 생성 시 콜백(없으면 로컬 목업 사용)
};

// ---------------- Mock ----------------
const MOCK_IDEAS: PromotionIdea[] = [
  {
    id: "creative",
    title: "창의적인 홍보 전략",
    summary:
      "새로운 시각으로 접근한 이벤트 전략으로 타깃 고객의 관심을 사로잡습니다. 독특한 콘셉트와 함께 브랜드 인지도를 높입니다.",
    tags: ["#창의성", "#이벤트", "#브랜드인지도"],
  },
  {
    id: "data",
    title: "데이터 기반 마케팅",
    summary:
      "실시간 데이터 분석을 통해 고객의 니즈를 정확히 파악하고, 맞춤형 추천 문구를 생성하여 전환률을 높이는 전략 제안.",
    tags: ["#데이터분석", "#추천알고리즘", "#전환율"],
  },
  {
    id: "story",
    title: "고객 중심 스토리텔링",
    summary:
      "감성적인 스토리라인으로 고객과의 유대감을 형성합니다. 브랜드의 가치와 비전을 비쥬얼 스토리로 쉽게 전달.",
    tags: ["#스토리텔링", "#브랜드" , "#고객공감"],
  },
];

// ---------------- UI Parts ----------------
const TagChip = ({ text }: { text: string }) => (
  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100">
    {text}
  </span>
);

const IdeaCard = ({
  idea,
  index,
  selected,
  onSelect,
}: {
  idea: PromotionIdea;
  index: number; // 0-based index
  selected: boolean;
  onSelect: (idea: PromotionIdea) => void;
}) => {
  const interactions = useLiftInteractions();
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect(idea)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(idea)}
      className={[
        "group relative h-full rounded-2xl bg-white p-6 shadow-sm transition-shadow",
        "border",
        selected ? "border-emerald-400 shadow-md" : "border-gray-200 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
      ].join(" ")}
      {...interactions}
    >
      {/* 숫자 원형 (단색) */}
      <div
        className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white shadow"
        aria-hidden
      >
        <span className="text-sm font-bold">{index + 1}</span>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-gray-800">{idea.title}</h3>
      <p className="mt-2 text-sm text-gray-600 leading-6">{idea.summary}</p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {idea.tags.map((t, i) => (
          <TagChip key={i} text={t} />
        ))}
      </div>

      {/* CTA */}
      <motion.button
        type="button"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(idea);
        }}
        {...interactions}
      >
        선택하기
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      {/* 선택 테두리 강조 효과 */}
      {selected && (
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-emerald-300/60" aria-hidden />
      )}
    </motion.div>
  );
};

// ---------------- Page ----------------
export const PromoGeneratePage = ({ ideas, onSelect, onRegenerate }: PromoGenerateProps): JSX.Element => {
  const [list, setList] = useState<PromotionIdea[]>(() => ideas && ideas.length ? ideas : MOCK_IDEAS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedIdea = useMemo(() => list.find((i) => i.id === selectedId) || null, [list, selectedId]);

  const handleSelect = (idea: PromotionIdea) => {
    setSelectedId(idea.id);
    onSelect?.(idea);
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      if (onRegenerate) {
        const next = await onRegenerate();
        if (Array.isArray(next) && next.length) {
          setList(next);
          setSelectedId(null);
        }
      } else {
        // 간단한 셔플/로테이트 목업
        setList((prev) => {
          const copy = [...prev];
          const first = copy.shift();
          if (first) copy.push(first);
          return copy;
        });
        setSelectedId(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-sans">
      {/* 레이아웃(헤더/푸터) 외 본문 영역만 구성 */}
      <section className="relative w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <header className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">AI가 제안한 홍보글 3개</h1>
          </header>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {list.map((idea, idx) => (
              <IdeaCard key={idea.id} idea={idea} index={idx} selected={selectedId === idea.id} onSelect={handleSelect} />
            ))}
          </div>

          {/* 다시 생성 */}
          <div className="mt-8 sm:mt-10 text-center">
            <motion.button
              type="button"
              disabled={loading}
              onClick={handleRegenerate}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-7 sm:py-3.5 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white text-sm sm:text-base font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-70"
            >
              {loading ? "생성 중..." : "다시 생성하기"}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4.5 12a7.5 7.5 0 111.8 4.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.5 16.9V12h4.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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
