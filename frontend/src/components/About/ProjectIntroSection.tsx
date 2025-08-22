import type { JSX } from "react";
import { motion } from "framer-motion";
import { container, fade, cardEnter } from "../../hooks/useAnimation";
import { useLiftInteractions } from "../../hooks/useAnimation";

interface ProjectIntroData {
  index: number;
  title: string;
  desc: string;
}

interface ProjectIntroSectionProps {
  projectIntroData: ProjectIntroData[];
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

// 프로젝트 소개 카드 (숫자 원형, 가운데 정렬)
const ProjectIntroCard = ({
  index,
  title,
  desc,
  interactions,
}: {
  index: number; // 1-based
  title: string;
  desc: string;
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
        background:
          "linear-gradient(135deg, rgb(52 211 153) 0%, rgb(45 212 191) 50%, rgb(34 211 238) 100%)",
      }}
      aria-hidden
    >
      <span className="text-sm font-bold">{index}</span>
    </div>
    <h3 className="text-base sm:text-lg font-bold text-gray-800">{title}</h3>
    <p className="mt-2 text-sm text-gray-600 leading-6">{desc}</p>
  </motion.div>
);

export const ProjectIntroSection = ({ projectIntroData, inViewAnim }: ProjectIntroSectionProps) => {
  const interactions = useLiftInteractions(-6);

  return (
    <section className="bg-white">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
        variants={container}
        {...inViewAnim}
      >
        <SectionTitle>프로젝트 소개</SectionTitle>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {projectIntroData.map((item) => (
            <ProjectIntroCard
              key={item.index}
              index={item.index}
              title={item.title}
              desc={item.desc}
              interactions={interactions}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
