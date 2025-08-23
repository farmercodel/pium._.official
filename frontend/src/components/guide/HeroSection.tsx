import { motion } from "framer-motion";
import { container, flyUp, fade } from "../../hooks/useAnimation";

interface HeroSectionProps {
  reduce: boolean;
}

export const HeroSection = ({ reduce }: HeroSectionProps) => {
  return (
    <section
      className="relative w-full bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/assets/피움 바탕.svg')" }}
    >
      {/* 메인과 동일: 가독성을 위한 오버레이 */}
      <div className="absolute inset-0 bg-white/55" />

      <motion.div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="text-center">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
            variants={flyUp}
          >
            <span className="relative inline-block">
              {/* 메인과 동일: 화이트 강조(halo) */}
              {!reduce && (
                <>
                  <motion.span
                    aria-hidden
                    className="absolute -inset-6 rounded-[48px] bg-white/90 blur-[42px] -z-10"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 0.95, scale: 1.02 }}
                    transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 blur-[90px] -z-10"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.25) 75%, transparent 100%)",
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.9, scale: 1.06 }}
                    transition={{ duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  />
                </>
              )}

              {/* PIUM 그라데이션 (요청 컬러) */}
              <span
                className="
                  bg-[linear-gradient(90deg,#7cdb3e_0%,#d5ed7e_45%,#c0d663_100%)]
                  bg-clip-text text-transparent
                  [text-shadow:0_0_10px_rgba(255,255,255,0.55)]
                "
              >
                PIUM
              </span>
            </span>
            <br />
            {/* 메인과 동일한 톤 */}
            <motion.span variants={fade} className="text-gray-600">
              사용 가이드
            </motion.span>
          </motion.h1>

          <motion.p
            className="mt-6 text-gray-600/90 text-base sm:text-lg lg:text-xl"
            variants={fade}
          >
            AI 기술로 당신의 비즈니스를 성장시키는 3단계 프로세스를 알아보세요
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};
