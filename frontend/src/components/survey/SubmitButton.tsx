import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";

interface SubmitButtonProps {
  submitting: boolean;
  interactions: MotionProps;
  reduce: boolean;
}

export const SubmitButton = ({ submitting, interactions, reduce }: SubmitButtonProps) => {
  return (
    <div className="text-center">
      <motion.button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white text-sm sm:text-base lg:text-lg font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-70"
        {...interactions}
        animate={reduce ? {} : submitting ? { scale: 0.99 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {submitting ? "생성 중" : "가게 정보 등록하기"}
        <motion.svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="ml-1"
          animate={reduce ? {} : submitting ? { rotate: 360 } : { rotate: 0 }}
          transition={submitting ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
        >
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.button>
    </div>
  );
};
