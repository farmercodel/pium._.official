import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { container, cardEnter } from "../../hooks/useAnimation";
import type { MotionProps } from "framer-motion";

// 타입 가드 함수
const isMotionProps = (obj: unknown): obj is MotionProps => 
  typeof obj === 'object' && obj !== null;

interface Step {
  idx: number;
  title: string;
  desc: string;
  label: string;
  labelIcon: string;
}

interface StepCardProps {
  idx: number;
  title: string;
  desc: string;
  label: string;
  labelIcon: string;
  interactions: unknown;
}

const StepCard = ({ idx, title, desc, label, labelIcon, interactions }: StepCardProps) => {
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
            text-white text-base sm:text-lg font-bold
            flex items-center justify-center
            shadow-md
            bg-[linear-gradient(to_bottom_right,_#cfe89b_0%,_#8fd77e_52%,_#19c6d3_100%)]
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

interface StepsSectionProps {
  steps: Step[];
  interactions: unknown;
}

export const StepsSection = ({ steps, interactions }: StepsSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // 페이지 진입 시 애니메이션 트리거
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // 약간의 지연으로 페이지 전환 완료 후 애니메이션 시작

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-white">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
        variants={container}
        initial="hidden"
        animate={isVisible ? "show" : "hidden"}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onAnimationComplete={() => {
          // 애니메이션 완료 후 상태 업데이트
          if (!isVisible) setIsVisible(true);
        }}
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
          variants={container}
        >
          {steps.map((step) => (
            <motion.div key={step.idx} className="h-full" variants={container}>
              <StepCard
                idx={step.idx}
                title={step.title}
                desc={step.desc}
                label={step.label}
                labelIcon={step.labelIcon}
                interactions={interactions}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
