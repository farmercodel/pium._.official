import { useState } from "react";
import PageLayout from "../components/common/PageLayout";
import InstaPreview from "../components/preview/InstaPreview";
import { motion, useReducedMotion } from "framer-motion";
import type { MotionProps, Transition, Variants } from "framer-motion";

// 미리보기 대상 (기존과 동일한 POST_ID 들을 유지)
const PREVIEWS: { id: string; kind: "profile" | "post"; title: string }[] = [
  { id: "pium._.official", kind: "profile", title: "pium._.official" },
  { id: "DNWI2mUpQFE", kind: "post", title: "게시물" },
];

const useLiftInteractions = (): MotionProps => {
  const reduce = useReducedMotion();
  if (reduce) return {};
  const springLift: Transition = { type: "spring", stiffness: 300, damping: 20 };
  return {
    whileHover: { y: -6, scale: 1.01 },
    whileTap: { scale: 0.98, y: -1 },
    transition: springLift,
  };
};

/** ===== Variants ===== */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const flyUp: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.99, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardEnter: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M20 12a8 8 0 10-2.34 5.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 12v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PreviewCard = ({
  item,
  version,
}: {
  item: (typeof PREVIEWS)[number];
  version: number;
}) => {
  const interactions = useLiftInteractions();
  return (
    <motion.div
      className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 transform-gpu"
      variants={cardEnter}
      {...interactions}
    >
      {/* 헤더 */}
      <motion.div className="mb-3 flex items-center justify-between" variants={fade}>
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-600 shadow">
            <InstagramIcon />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-800">{item.title}</p>
            <p className="text-xs text-gray-500">
              {item.kind === "profile" ? "프로필" : "게시물"} 미리보기
            </p>
          </div>
        </div>
      </motion.div>

      {/* 프리뷰 박스 */}
      <motion.div
        className="rounded-xl border border-gray-200 overflow-hidden bg-white"
        variants={popIn}
        key={`wrap-${item.id}-${version}`}
      >
        {/* key에 version을 넣어 리프레시 시 재마운트 */}
        <InstaPreview POST_ID={item.id} key={`${item.id}-${version}`} />
      </motion.div>
    </motion.div>
  );
};

/** 미리보기 페이지 */
const PreviewPage = () => {
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);
  const interactions = useLiftInteractions();
  const reduce = useReducedMotion();

  const heroAnim = reduce ? {} : { initial: "hidden", animate: "show" };
  const inViewAnim = reduce
    ? {}
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.2 } };

  return (
    <PageLayout>
      <main className="font-sans">
        {/* Hero (라이트 톤) */}
        <section className="relative w-full bg-emerald-50/60">
          <motion.div
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12"
            variants={container}
            {...heroAnim}
          >
            <div className="text-center">
              <motion.h1
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900"
                variants={flyUp}
              >
                Instagram 미리보기
              </motion.h1>
              <motion.p
                className="mt-2 text-sm sm:text-base text-gray-600"
                variants={fade}
              >
                지금까지 인스타그램에 게시된 콘텐츠를 한눈에 확인하세요.
              </motion.p>
              <motion.div className="mt-5" variants={fade}>
                <motion.button
                  type="button"
                  onClick={refresh}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                  {...interactions}
                >
                  새로고침
                  {/* 아이콘 회전(탭 시 90도 회전). reduce-motion이면 정지 */}
                  {reduce ? (
                    <span><RefreshIcon /></span>
                  ) : (
                    <motion.span whileTap={{ rotate: -90 }} transition={{ duration: 0.2 }}>
                      <RefreshIcon />
                    </motion.span>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Grid */}
        <section className="bg-white">
          <motion.div
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
            variants={container}
            {...inViewAnim}
          >
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              variants={container}
            >
              {PREVIEWS.map((p) => (
                <PreviewCard key={p.id} item={p} version={version} />
              ))}
            </motion.div>
          </motion.div>
        </section>
      </main>
    </PageLayout>
  );
};

export default PreviewPage;
