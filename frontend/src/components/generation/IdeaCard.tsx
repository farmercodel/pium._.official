import { motion } from "framer-motion";
import { cardEnter } from "../../hooks/useAnimation";
import { useLiftInteractions } from "../../hooks/useAnimation";
import type { PromotionIdea } from "../../hooks/useGenerationPage";

interface IdeaCardProps {
  idea: PromotionIdea;
  index: number;
  selected: boolean;
  onSelect: (idea: PromotionIdea) => void;
  ctaLoading?: boolean;
  disabled?: boolean;
}

const TagChip = ({ text }: { text: string }) => (
  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100">
    {text}
  </span>
);

export const IdeaCard = ({
  idea, 
  index, 
  selected, 
  onSelect, 
  ctaLoading, 
  disabled
}: IdeaCardProps) => {
  const interactions = useLiftInteractions(-6);
  
  return (
    <motion.div
      role="button" 
      tabIndex={0} 
      aria-pressed={selected}
      onClick={() => !disabled && onSelect(idea)}
      onKeyDown={(e) => !disabled && (e.key === "Enter" || e.key === " ") && onSelect(idea)}
      className={[
        "group relative h-full rounded-2xl bg-white p-6 shadow-sm transition-shadow",
        "border", 
        selected ? "border-emerald-400 shadow-md" : "border-gray-200 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
        disabled ? "opacity-70 pointer-events-none" : "",
      ].join(" ")}
      variants={cardEnter}
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
        <motion.svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          aria-hidden
          animate={ctaLoading ? { rotate: 360 } : { rotate: 0 }}
          transition={ctaLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
        >
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </motion.button>

      {selected && (
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-emerald-300/60" aria-hidden />
      )}
    </motion.div>
  );
};
