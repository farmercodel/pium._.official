import { motion } from "framer-motion";
import { container, fade, flyUp } from "../../hooks/useAnimation";
import type { MotionProps } from "framer-motion";

// 타입 가드 함수
const isMotionProps = (obj: unknown): obj is MotionProps => 
  typeof obj === 'object' && obj !== null;

interface CTASectionProps {
  interactions: unknown;
}

export const CTASection = ({ interactions }: CTASectionProps) => {
  const safeInteractions = isMotionProps(interactions) ? interactions : {};

  return (
    <section className="bg-white">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 text-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 className="text-2xl sm:text-3xl font-bold text-gray-800" variants={fade}>
          지금 바로 시작해보세요
        </motion.h2>
        <motion.p className="mt-3 text-sm sm:text-lg text-gray-600" variants={fade}>
          피움과 함께 더 효과적인 마케팅 콘텐츠를 만들어보세요
        </motion.p>

        <motion.button
          type="button"
          className="
            mt-7 sm:mt-8 inline-flex items-center justify-center gap-2
            rounded-full px-5 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-4
            bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400
            text-white text-sm sm:text-base lg:text-lg font-semibold
            shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200
          "
          variants={flyUp}
          {...safeInteractions}
        >
          시작하기
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
};
