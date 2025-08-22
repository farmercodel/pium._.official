import { motion } from "framer-motion";
import { container, flyUp, fade } from "../../hooks/useAnimation";

interface HeroSectionProps {
  reduce: boolean;
}

export const HeroSection = ({ reduce }: HeroSectionProps) => {
  return (
    <section className="relative w-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="text-center">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white"
            variants={flyUp}
          >
            <span className="relative inline-block">
              <span className="bg-[linear-gradient(90deg,#E6EC2C_0%,#9FE316_45%,#00B87C_100%)] bg-clip-text text-transparent contrast-125 saturate-125 [text-shadow:0_1px_0_rgba(0,0,0,0.05)]">
                PIUM
              </span>
              {/* 라디얼 글로우 */}
              {!reduce && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(255,255,255,0.7), transparent)",
                  }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 0.6, scale: 1.05 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </span>{" "}
            <br />
            <motion.span variants={fade}>사용 가이드</motion.span>
          </motion.h1>

          <motion.p
            className="mt-3 sm:mt-4 text-white/90 text-sm sm:text-lg lg:text-xl"
            variants={fade}
          >
            AI 기술로 당신의 비즈니스를 성장시키는 3단계 프로세스를 알아보세요
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};
