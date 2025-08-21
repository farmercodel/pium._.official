import type { JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MotionProps, Transition } from "framer-motion";

/** spring 인터랙션(접근성 고려: reduceMotion 시 비활성) */
const useLiftInteractions = (): MotionProps => {
  const reduce = useReducedMotion();
  if (reduce) return {}; // 시스템이 motion 줄이기면 효과 off

  const springLift: Transition = { type: "spring", stiffness: 300, damping: 20 };

  return {
    whileHover: { y: -6, scale: 1.01 },
    whileTap: { scale: 0.98, y: -1 },
    transition: springLift,
  };
};

/* 숫자만 쓰는 Step 카드 */
const StepCard = ({
  idx,
  title,
  desc,
  interactions,
}: {
  idx: number;
  title: string;
  desc: string;
  interactions: MotionProps;
}) => (
  <motion.button
    type="button"
    aria-label={`${idx}단계: ${title}`}
    className="
      relative w-full h-full text-left
      rounded-2xl border-2 border-[#a3d276] bg-white
      p-5 sm:p-6 md:p-7 lg:p-8
      focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300
      transition-shadow shadow-sm
    "
    {...interactions}
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
      {idx === 1 && (
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 text-emerald-600 text-sm">
          <img src="https://c.animaapp.com/OWBCfRMZ/img/i.svg" alt="" className="h-4 w-4" />
          간편한 정보 입력
        </div>
      )}
      {idx === 2 && (
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 text-emerald-600 text-sm">
          <img src="https://c.animaapp.com/OWBCfRMZ/img/i-1.svg" alt="" className="h-4 w-4" />
          AI 자동 생성
        </div>
      )}
      {idx === 3 && (
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 text-emerald-600 text-sm">
          <img src="https://c.animaapp.com/OWBCfRMZ/img/i-2.svg" alt="" className="h-4 w-4" />
          즉시 활용 가능
        </div>
      )}
    </div>
  </motion.button>
);

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
  interactions: MotionProps;
}) => (
  <motion.div
    role="button"
    tabIndex={0}
    className="
      h-full rounded-xl bg-white p-6 text-center shadow-sm
      focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300
      transition-shadow
    "
    {...interactions}
  >
    <img src={icon} alt="" className="mx-auto h-12 w-12" />
    <h3 className="mt-5 text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
    <p className="mt-2 text-sm text-gray-600">{desc}</p>
  </motion.div>
);

export const GuidePage = (): JSX.Element => {
  const interactions = useLiftInteractions();

  return (
    <main className="font-sans">
      {/* Hero */}
      <section className="relative w-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white">
                <span className="bg-gradient-to-r from-yellow-300 via-lime-300 to-cyan-200 bg-clip-text text-transparent">
                PIUM
                </span> <br />
              사용 가이드
            </h1>
            <p className="mt-3 sm:mt-4 text-white/90 text-sm sm:text-lg lg:text-xl">
              AI 기술로 당신의 비즈니스를 성장시키는 3단계 프로세스를 알아보세요
            </p>
          </div>
        </div>
      </section>

      {/* 3단계 카드 (모바일=1 / 태블릿=1 / 데스크탑=3) */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            <div className="h-full">
              <StepCard
                idx={1}
                title="가게 정보 입력"
                desc="비즈니스의 기본 정보를 입력해주세요. 업종, 위치, 특징 등을 통해 맞춤형 콘텐츠 생성의 기반을 만듭니다."
                interactions={interactions}
              />
            </div>
            <div className="h-full">
              <StepCard
                idx={2}
                title="AI 홍보 글/콘텐츠 생성"
                desc="입력된 정보를 바탕으로 AI가 다양한 홍보 콘텐츠를 자동 생성합니다. SNS, 블로그, 광고 등 다양한 용도로 활용 가능합니다."
                interactions={interactions}
              />
            </div>
            <div className="h-full">
              <StepCard
                idx={3}
                title="게시글 선택 후 활용"
                desc="생성된 다양한 콘텐츠 중 마음에 드는 것을 선택하여 바로 활용하세요. 복사, 수정, 공유가 모두 가능합니다."
                interactions={interactions}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 (모바일 1 / 태블릿 2 / 데스크탑 2) */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-800">
            피움의 특별한 기능들
          </h2>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            <FeatureCard
              icon="https://c.animaapp.com/OWBCfRMZ/img/div-4.svg"
              title="빠른 생성 속도"
              desc="몇 초 만에 고품질 콘텐츠를 생성합니다"
              interactions={interactions}
            />
            <FeatureCard
              icon="https://c.animaapp.com/OWBCfRMZ/img/div-5.svg"
              title="다양한 스타일"
              desc="업종과 목적에 맞는 다양한 톤앤매너"
              interactions={interactions}
            />
            <FeatureCard
              icon="https://c.animaapp.com/OWBCfRMZ/img/div-6.svg"
              title="모바일 최적화"
              desc="언제 어디서나 편리하게 이용 가능"
              interactions={interactions}
            />
            <FeatureCard
              icon="https://c.animaapp.com/OWBCfRMZ/img/div-7.svg"
              title="안전한 보안"
              desc="고객 정보와 데이터를 안전하게 보호"
              interactions={interactions}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">지금 바로 시작해보세요</h2>
          <p className="mt-3 text-sm sm:text-lg text-gray-600">
            피움과 함께 더 효과적인 마케팅 콘텐츠를 만들어보세요
          </p>

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
            {...interactions}
          >
            피움 시작하기
            <img
              src="https://c.animaapp.com/OWBCfRMZ/img/i-3.svg"
              alt=""
              className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] lg:h-[22px] lg:w-[22px]"
              aria-hidden
            />
          </motion.button>
        </div>
      </section>
    </main>
  );
};

export default GuidePage;
