import { motion } from "framer-motion";
import { container, flyUp, fade } from "../../hooks/useAnimation";
import useNavigation from "../../hooks/useNavigation";

interface HeroSectionProps { reduce: boolean; }

export const HeroSection = ({ reduce }: HeroSectionProps) => {
  const { goToSurvey } = useNavigation();
  const handleSurveyClick = () => goToSurvey();

  return (
    <section
      className="
        relative w-full bg-[#F9FAEA]   /* ✅ 프리뷰 페이지와 동일 배경색 */
        bg-center bg-cover bg-no-repeat
      "
    >
      <motion.div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28"
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
            <span className="relative inline-block">
              <span
                className="
                  bg-[linear-gradient(90deg,#7cdb3e_0%,#d5ed7e_45%,#c0d663_100%)]
                  bg-clip-text text-transparent
                  font-extrabold
                  [-webkit-text-stroke:0.7px_rgba(213,237,126,0.55)]
                "
              >
                PIUM
              </span>

              {!reduce && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(255,255,255,0.8), transparent)",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.6, scale: 1.05 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </span>

            <br />

            <motion.span className="text-gray-600" variants={fade}>
              <span className="block lg:inline">소상공인 마케팅</span>
              <span className="block lg:inline lg:ml-2">지원 서비스</span>
            </motion.span>
          </motion.h1>

          <motion.p
            className="mt-6 text-gray-600/90 text-base sm:text-lg lg:text-xl"
            variants={fade}
          >
            AI를 통해 여러분들의 가게를 쉽고 빠르게 홍보해 보세요!
          </motion.p>

          <motion.div className="mt-10 flex justify-center" variants={flyUp}>
            {/* ✅ 프리뷰와 동일 버튼 그라데이션 */}
            <motion.button
              type="button"
              onClick={handleSurveyClick}
              className="
                inline-flex items-center justify-center
                rounded-full px-6 py-3 lg:px-8 lg:py-4
                text-white font-bold
                shadow-[0_10px_20px_rgba(25,198,211,0.28),0_4px_8px_rgba(0,0,0,0.06)]
                ring-1 ring-white/30
                transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                cursor-pointer
                bg-[linear-gradient(90deg,#cfe89b_0%,#8fd77e_52%,#19c6d3_100%)]
                hover:opacity-95 active:scale-[0.98]
              "
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              시작하기
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
