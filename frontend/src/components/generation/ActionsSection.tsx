import { motion } from "framer-motion";
import { fade, cardEnter } from "../../hooks/useAnimation";
import { useLiftInteractions } from "../../hooks/useAnimation";
import type { PromotionIdea } from "../../hooks/useGenerationPage";

interface ActionsSectionProps {
  regenLoading: boolean;
  selectedIdea: PromotionIdea | null;
  onRegenerate: () => void;
}

export const ActionsSection = ({ 
  regenLoading, 
  selectedIdea, 
  onRegenerate 
}: ActionsSectionProps) => {
  const interactions = useLiftInteractions(-4);

  return (
    <motion.div className="mt-8 sm:mt-10 text-center" variants={fade}>
      <motion.button
        type="button" 
        disabled={regenLoading}
        onClick={onRegenerate}
        className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-7 sm:py-3.5 bg-[linear-gradient(90deg,#cfe89b_0%,#8fd77e_52%,#19c6d3_100%)] text-white text-sm sm:text-base font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-70"
        variants={cardEnter}
        {...interactions}
      >
        {regenLoading ? "생성 중" : "다시 생성하기"}
        <motion.svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          aria-hidden
          animate={regenLoading ? { rotate: 360 } : { rotate: 0 }}
          transition={regenLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
        >
          <path d="M4.5 12a7.5 7.5 0 111.8 4.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 16.9V12h4.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.button>

      {selectedIdea && (
        <motion.p className="mt-3 text-sm text-emerald-700" variants={fade}>
          선택됨: <span className="font-semibold">{selectedIdea.title}</span>
        </motion.p>
      )}
    </motion.div>
  );
};
