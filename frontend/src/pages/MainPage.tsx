import type { JSX } from "react";
import { motion, type Variants } from "framer-motion";

const features = [
  {
    title: "홍보글 생성",
    desc: "AI를 통해 사용자의 비즈니스에 맞는 매력적인 홍보글을 생성합니다.",
    icon: "/assets/icon-copy-gen.svg",
  },
  {
    title: "해시태그 제안",
    desc: "검색 최적화(SEO) 관점에서의 해시태그 생성으로 더 많은 고객에게 홍보될 수 있도록 합니다.",
    icon: "/assets/icon-hashtag-suggest.svg",
  },
  {
    title: "인스타그램 자동 게시",
    desc: "생성한 홍보글을 자동으로 인스타그램에 게시하며, 모든 게시물은 인스타그램 @pium._.official 계정에서 확인 가능합니다.",
    icon: "/assets/icon-auto-post.svg",
  },
];

/** ====== Animation Variants ====== */
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const flyUp: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.98, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const MainPage = (): JSX.Element => {
  return (
    <>
      {/* 폰트 적용: font-sans (tailwind.config.js에서 Pretendard로 매핑) */}
      <main className="bg-white font-sans">
        {/* ====== Hero ====== */}
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
                </span>

                <br />

                <motion.span className="text-white" variants={fade}>
                  소상공인 마케팅 지원 서비스
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

        {/* ====== Features ====== */}
        <section className="bg-white" id="get-started" aria-labelledby="features-heading">
          <motion.div
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="text-center">
              <motion.h2
                id="features-heading"
                className="text-2xl sm:text-3xl lg:text-4xl leading-10 text-gray-800 font-semibold tracking-tight"
                variants={fade}
              >
                AI를 통해 당신의 가게를 쉽고 빠르게 홍보합니다
              </motion.h2>
              <motion.p
                className="mt-3 text-gray-600 text-sm sm:text-base lg:text-lg"
                variants={fade}
              >
                소상공인을 위한 스마트한 마케팅 솔루션
              </motion.p>
            </div>

            <div
              className="
                mt-10 sm:mt-12 lg:mt-16
                grid grid-cols-1
                md:grid-cols-1
                lg:grid-cols-3
                gap-6 sm:gap-8 lg:gap-10
              "
            >
              {features.map((f) => (
                <motion.div
                  key={f.title}
                  className="
                    rounded-2xl border border-[#e9ecef]
                    p-6 sm:p-7 lg:p-8
                    shadow-sm bg-white
                    transform-gpu
                  "
                  variants={card}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                <div className="flex justify-center">
                  <div className="relative">
                    {/* glow */}
                    <span
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full blur-lg opacity-60"
                      style={{
                        background:
                          "radial-gradient(closest-side, rgba(16,185,129,0.35), rgba(20,184,166,0.25), rgba(6,182,212,0.15))",
                      }}
                    />
                    {/* gradient circle (64px → lg:80px) */}
                    <div
                      className="
                        inline-flex h-16 w-16 items-center justify-center rounded-full
                        ring-1 ring-white/10
                        shadow-[0_8px_20px_rgba(16,185,129,0.22)]
                        bg-[radial-gradient(closest-side,_rgba(110,231,183,1),_rgba(45,212,191,0.95)_60%,_rgba(34,211,238,0.9))]
                        lg:h-20 lg:w-20
                      "
                    >
                      <img
                        src={f.icon}
                        alt=""
                        className="h-8 w-8 lg:h-10 lg:w-10"
                        loading="lazy"
                        aria-hidden
                      />
                    </div>
                  </div>
                </div>
                  <h3 className="mt-6 text-center text-lg sm:text-xl font-semibold text-gray-800">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-center text-sm sm:text-base text-gray-600 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
};

export default MainPage;
