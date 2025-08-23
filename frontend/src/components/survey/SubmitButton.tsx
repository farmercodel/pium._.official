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
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4 bg-[linear-gradient(90deg,#cfe89b_0%,#8fd77e_52%,#19c6d3_100%)] text-white text-sm sm:text-base lg:text-lg font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-70 ${submitting ? "cursor-not-allowed" : "cursor-pointer"}`}
        {...(submitting ? {} : interactions)}
        animate={reduce ? {} : submitting ? { scale: 0.99 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20}}
      >
        {submitting ? "생성 중" : "가게 정보 등록하기"}
        
        {/* 로딩 중일 때: 점 3개가 순차적으로 나타나는 스피너 */}
        {submitting ? (
          <div className="flex items-center gap-1 ml-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={reduce ? {} : {
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        ) : (
          /* 기본 상태: 화살표 */
          <motion.svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="ml-1"
            animate={reduce ? {} : { rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        )}
      </motion.button>
    </div>
  );
};
