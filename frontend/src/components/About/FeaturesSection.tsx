import type { JSX } from "react";
import { motion } from "framer-motion";
import { container, fade, cardEnter } from "../../hooks/useAnimation";
import { useLiftInteractions } from "../../hooks/useAnimation";

interface FeatureData {
  title: string;
  iconSrc?: string;
  bullets: string[];
}

interface FeaturesSectionProps {
  featureData: FeatureData[];
  inViewAnim: Record<string, unknown>;
}

// 공통 컴포넌트
const SectionTitle = ({ children }: { children: JSX.Element | string }) => (
  <motion.h2
    className="text-center text-xl sm:text-2xl font-bold text-gray-800"
    variants={fade}
  >
    {children}
  </motion.h2>
);

// 아이콘 원형 (진한 초록 + 글로우)
const IconCircle = ({ iconSrc, icon }: { iconSrc?: string; icon?: JSX.Element }) => {
  return (
    <div className="relative mx-auto mb-3 h-10 w-10 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
      {/* glow */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full blur-md opacity-60"
        style={{ background: "radial-gradient(closest-side, rgba(5,150,105,0.35), rgba(16,185,129,0.25))" }} // emerald-700 → emerald-500 글로우
      />
      {/* solid/gradient circle (더 진한 초록) */}
      <div
        className="
          grid h-full w-full place-items-center rounded-full text-white
          ring-1 ring-emerald-900/30 shadow
          bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-600
        "
      >
        {icon ? (
          icon
        ) : iconSrc ? (
          <img src={iconSrc} alt="" className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden />
        ) : (
          // 기본 폴백(작은 스파클)
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 6l1.2 2.4L15.6 9.6 13.2 11 12 13.5 10.8 11 8.4 9.6l2.4-1.2L12 6z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  );
};

// 주요 기능 카드 (아이콘, 가운데 정렬)
const LargeFeatureCard = ({
  title,
  bullets,
  interactions,
  iconSrc,
  icon,
}: {
  title: string;
  bullets: string[];
  interactions: ReturnType<typeof useLiftInteractions>;
  /** 흰색 SVG 경로 */
  iconSrc?: string;
  /** 직접 JSX 아이콘 노드 전달 (예: <YourIcon className="h-5 w-5 text-white" />) */
  icon?: JSX.Element;
}) => (
  <motion.div
    role="button"
    tabIndex={0}
    className="h-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transform-gpu"
    variants={cardEnter}
    {...interactions}
  >
    <div className="flex justify-center">
      <IconCircle iconSrc={iconSrc} icon={icon} />
    </div>
    <h3 className="text-base sm:text-lg font-bold text-gray-800">{title}</h3>
    <ul className="mt-4 space-y-2 text-sm text-gray-700 text-left inline-block">
      {bullets.map((b, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-emerald-600 mt-0.5">•</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

export const FeaturesSection = ({ featureData, inViewAnim }: FeaturesSectionProps) => {
  const interactions = useLiftInteractions(-6);

  return (
    <section className="bg-gray-50">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
        variants={container}
        {...inViewAnim}
      >
        <SectionTitle>주요 기능</SectionTitle>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {featureData.map((feature) => (
            <LargeFeatureCard
              key={feature.title}
              title={feature.title}
              iconSrc={feature.iconSrc}
              bullets={feature.bullets}
              interactions={interactions}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
