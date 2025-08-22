import { motion } from "framer-motion";
import { container, flyUp, fade } from "../../hooks/useAnimation";

interface HeroSectionProps {
  reduce: boolean;
}

export const HeroSection = ({ reduce }: HeroSectionProps) => {
  return (
    <section
      className="
        relative w-full
        bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400
      "
    >
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28"
        variants={container}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.1 }}
      >
        <div className="text-center">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
            variants={flyUp}
          >
            {/* PIUM 텍스트: 밝게 끝나는 그라데이션 + 은은한 글로우 */}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-yellow-300 via-lime-300 to-cyan-200 bg-clip-text text-transparent">
                PIUM
              </span>

              {/* 라디얼 글로우 (배경과 분리) */}
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
            </span>

            <br />

            <motion.span className="text-white" variants={fade}>
              <span className="block lg:inline">소상공인 마케팅</span>
              <span className="block lg:inline lg:ml-2">지원 서비스</span>
            </motion.span>
          </motion.h1>

          <motion.p
            className="mt-6 text-white/90 text-base sm:text-lg lg:text-xl"
            variants={fade}
          >
            AI를 통해 당신의 가게를 쉽고 빠르게 홍보합니다
          </motion.p>

          <motion.div className="mt-10 flex justify-center" variants={flyUp}>
            {/* CTA 버튼: 흰 배경 + 그린 텍스트(포인트톤) */}
            <motion.a
              href="/Survey"
              className="
                inline-flex items-center justify-center
                rounded-full px-6 py-3 lg:px-8 lg:py-4
                text-emerald-600 font-bold
                bg-white
                border border-emerald-200
                shadow-[0_10px_15px_rgba(0,0,0,0.12)]
                transition
                hover:bg-emerald-50
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
              "
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              시작하기
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
