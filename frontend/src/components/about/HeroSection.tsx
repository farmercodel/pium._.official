import { motion } from "framer-motion";
import { container, fade } from "../../hooks/useAnimation";
import { useLiftInteractions } from "../../hooks/useAnimation";

interface HeroSectionProps {
  heroAnim: Record<string, unknown>;
}

export const HeroSection = ({ heroAnim }: HeroSectionProps) => {
  const interactions = useLiftInteractions(-6);

  return (
    <section className="relative w-full bg-[#F9FAEA]">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12"
        variants={container}
        {...heroAnim}
      >
        <div className="text-center">
          <motion.h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900" variants={fade}>
            프로젝트 소개
          </motion.h1>
          <motion.p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto" variants={fade}>
            PIUM은 지역 소상공인의 마케팅을 돕는 AI 서비스입니다. <br />
          </motion.p>

          <motion.div className="mt-5" variants={fade}>
            <motion.a
              href="/Guide"
              className="
                inline-flex items-center justify-center gap-2
                rounded-full px-5 py-2.5
                bg-[linear-gradient(90deg,#cfe89b_0%,#8fd77e_52%,#19c6d3_100%)]
                text-white font-semibold
                shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200
              "
              {...interactions}
            >
              서비스 가이드 보기
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};