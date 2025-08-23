import type { JSX } from "react";
import { motion } from "framer-motion";
import { container, fade, cardEnter } from "../../hooks/useAnimation";
import { useLiftInteractions } from "../../hooks/useAnimation";

interface ProjectIntroData {
  index: number;
  title: string;
  /** 공통(옵션) */
  desc?: string;
  /** 기기별 버전(옵션) – 있으면 우선 사용, 없으면 desc 사용 */
  descMobile?: string;   // <640px
  descTablet?: string;   // 640px~1023px
  descDesktop?: string;  // ≥1024px
}

interface ProjectIntroSectionProps {
  projectIntroData: ProjectIntroData[];
  inViewAnim: Record<string, unknown>;
}

/** 기기별 문자열을 스위칭. 각 문자열의 \n 은 그대로 줄바꿈 처리됨 */
const ResponsiveText = ({
  all,
  mobile,
  tablet,
  desktop,
}: {
  all?: string;
  mobile?: string;
  tablet?: string;
  desktop?: string;
}) => (
  <>
    {/* 모바일 전용 */}
    <span className="sm:hidden">{mobile ?? all ?? ""}</span>
    {/* 태블릿 전용 */}
    <span className="hidden sm:inline lg:hidden">{tablet ?? all ?? ""}</span>
    {/* 데스크톱 전용 */}
    <span className="hidden lg:inline whitespace-pre-line">{desktop ?? all ?? ""}</span>
  </>
);

// 공통 컴포넌트
const SectionTitle = ({ children }: { children: JSX.Element | string }) => (
  <motion.h2 className="text-center text-xl sm:text-2xl font-bold text-gray-800" variants={fade}>
    {children}
  </motion.h2>
);

// 프로젝트 소개 카드
const ProjectIntroCard = ({
  index,
  title,
  desc,
  descMobile,
  descTablet,
  descDesktop,
  interactions,
}: {
  index: number;
  title: string;
  desc?: string;
  descMobile?: string;
  descTablet?: string;
  descDesktop?: string;
  interactions: ReturnType<typeof useLiftInteractions>;
}) => (
  <motion.div
    role="button"
    tabIndex={0}
    className="h-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transform-gpu"
    variants={cardEnter}
    {...interactions}
  >
    {/* 숫자 원형 (녹색 그라데이션) */}
    <div
      className="mx-auto mb-4 grid h-10 w-10 place-items-center rounded-full text-white shadow"
      style={{
        background: "linear-gradient(to bottom right, #cfe89b 0%, #8fd77e 52%, #19c6d3 100%)",
      }}
      aria-hidden
    >
      <span className="text-sm font-bold">{index}</span>
    </div>

    <h3 className="text-base sm:text-lg font-bold text-gray-800">{title}</h3>

    {/* ✅ 기기별 다른 \n 적용 */}
    <p className="mt-2 text-sm text-gray-600 leading-7">
      <ResponsiveText
        all={desc}
        mobile={descMobile}
        tablet={descTablet}
        desktop={descDesktop}
      />
    </p>
  </motion.div>
);

export const ProjectIntroSection = ({
  projectIntroData,
  inViewAnim,
}: ProjectIntroSectionProps) => {
  const interactions = useLiftInteractions(-6);

  return (
    <section className="bg-white">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
        variants={container}
        {...inViewAnim}
      >
        <SectionTitle>프로젝트 소개</SectionTitle>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {projectIntroData.map((item) => (
            <ProjectIntroCard
              key={item.index}
              index={item.index}
              title={item.title}
              desc={item.desc}
              descMobile={item.descMobile}
              descTablet={item.descTablet}
              descDesktop={item.descDesktop}
              interactions={interactions}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
