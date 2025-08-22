import type { JSX } from "react";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import { 
  useAnimationProps, 
  useLiftInteractions, 
  container, 
  flyUp, 
  fade, 
  cardEnter 
} from "../hooks/useAnimation";
import { useGuidePage } from "../hooks/useGuidePage";

// 타입 가드 함수
const isMotionProps = (obj: unknown): obj is MotionProps => 
  typeof obj === 'object' && obj !== null;

/* 숫자만 쓰는 Step 카드 */
const StepCard = ({
  idx,
  title,
  desc,
  label,
  labelIcon,
  interactions,
}: {
  idx: number;
  title: string;
  desc: string;
  label: string;
  labelIcon: string;
  interactions: unknown;
}) => {
  const safeInteractions = isMotionProps(interactions) ? interactions : {};
  
  return (
    <motion.button
      type="button"
      aria-label={`${idx}단계: ${title}`}
      className="
        relative w-full h-full text-left
        rounded-2xl border-2 border-[#a3d276] bg-white
        p-5 sm:p-6 md:p-7 lg:p-8
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300
        transition-shadow shadow-sm transform-gpu
      "
      variants={cardEnter}
      {...safeInteractions}
    >
      <div className="mx-auto flex w-full max-w-[320px] flex-col items-center">
        {/* 숫자 원형 */}
        <span
          className="
            h-10 w-10 sm:h-12 sm:w-12
            rounded-full
            bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400
            text-white text-base sm:text-lg font-bold
            flex items-center justify-center
            shadow-md
          "
        >
          {idx}
        </span>

        <h3 className="mt-5 sm:mt-6 text-center text-lg sm:text-xl md:text-2xl font-bold text-gray-800 leading-7 sm:leading-8">
          {title}
        </h3>
        <p className="mt-3 text-center text-sm md:text-base text-gray-600 leading-[24px] md:leading-[26px]">
          {desc}
        </p>

        {/* 하단 라벨 */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 text-emerald-600 text-sm">
          <img src={labelIcon} alt="" className="h-4 w-4" />
          {label}
        </div>
      </div>
    </motion.button>
  );
};

/* 기능 카드 */
const FeatureCard = ({
  icon,
  title,
  desc,
  interactions,
}: {
  icon: string;
  title: string;
  desc: string;
  interactions: unknown;
}) => {
  const safeInteractions = isMotionProps(interactions) ? interactions : {};
  
  return (
    <motion.div
      role="button"
      tabIndex={0}
      className="
        h-full rounded-xl bg-white p-6 text-center shadow-sm
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300
        transition-shadow transform-gpu
      "
      variants={cardEnter}
      {...safeInteractions}
    >
      {/* === 아이콘: 원형 연한 그린 배경 + 은은한 글로우 === */}
      <div className="flex justify-center">
        <div className="relative">
          {/* glow */}
          <span
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full blur-xl opacity-60"
            style={{
              background:
                "radial-gradient(closest-side, rgba(16,185,129,0.18), rgba(20,184,166,0.10), transparent)",
            }}
          />
          {/* light green circle */}
          <div
            className="
              grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-full
              bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-100
              ring-1 ring-emerald-200/60 shadow
            "
          >
            <img
              src={icon}
              alt=""
              className="h-7 w-7 sm:h-8 sm:w-8"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <h3 className="mt-5 text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </motion.div>
  );
};

export const GuidePage = (): JSX.Element => {
  const { steps, features } = useGuidePage();
  const { reduce, heroAnim, inViewAnim } = useAnimationProps({ 
    viewportAmount: 0.2  // PreviewPage와 동일하게 설정
  });
  const interactions = useLiftInteractions(-6); // Guide 전용: y: -6

  return (
    <main className="font-sans">
      {/* Hero */}
      <section className="relative w-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
          variants={container}
          {...heroAnim}
        >
          <div className="text-center">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white"
              variants={flyUp}
            >
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-yellow-300 via-lime-300 to-cyan-200 bg-clip-text text-transparent">
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

      {/* 3단계 카드 (모바일=1 / 태블릿=1 / 데스크탑=3) */}
      <section className="bg-white">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
          variants={container}
          {...inViewAnim}
        >
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
            variants={container}
          >
            {steps.map((step) => (
              <div key={step.idx} className="h-full">
                <StepCard
                  idx={step.idx}
                  title={step.title}
                  desc={step.desc}
                  label={step.label}
                  labelIcon={step.labelIcon}
                  interactions={interactions}
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 기능 섹션 (모바일 1 / 태블릿 2 / 데스크탑 2) */}
      <section className="bg-gray-50">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
          variants={container}
          {...inViewAnim}
        >
          <motion.h2
            className="text-center text-2xl sm:text-3xl font-bold text-gray-800"
            variants={fade}
          >
            피움의 특별한 기능들
          </motion.h2>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                desc={feature.desc}
                interactions={interactions}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 text-center"
          variants={container}
          {...inViewAnim}
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
            {...interactions}
          >
            시작하기
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </motion.div>
      </section>
    </main>
  );
};

export default GuidePage;
