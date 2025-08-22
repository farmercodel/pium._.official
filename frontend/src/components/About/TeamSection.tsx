import type { JSX } from "react";
import { motion } from "framer-motion";
import { container, fade, cardEnter } from "../../hooks/useAnimation";
import { useLiftInteractions } from "../../hooks/useAnimation";
import type { TeamMember } from "../../hooks/useAboutPage";

interface TeamSectionProps {
  teamMembers: TeamMember[];
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

// 팀 멤버 카드 (사용자 디자인)
const MemberCard = ({ m, interactions }: { 
  m: TeamMember; 
  interactions: ReturnType<typeof useLiftInteractions>; 
}) => (
  <motion.div
    role="button"
    tabIndex={0}
    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105 p-6 flex flex-col items-center border border-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
    variants={cardEnter}
    {...interactions}
  >
    <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden bg-gray-100 mb-4">
      {m.photo ? (
        <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-xl" aria-hidden>
          👤
        </span>
      )}
    </div>

    <h3 className="text-lg font-bold text-center text-gray-800">{m.name}</h3>
    <p className="text-sm text-gray-500 text-center">{m.role}</p>
    <a
      href={`mailto:${m.email}`}
      className="text-xs text-gray-400 text-center mt-1 hover:underline"
    >
      {m.email}
    </a>
    <p className="text-sm text-gray-600 text-center mt-3">{m.description}</p>
  </motion.div>
);

export const TeamSection = ({ teamMembers, inViewAnim }: TeamSectionProps) => {
  const interactions = useLiftInteractions(-6);

  return (
    <section className="bg-white">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
        variants={container}
        {...inViewAnim}
      >
        <SectionTitle>팀 소개</SectionTitle>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((m) => (
            <MemberCard key={m.email} m={m} interactions={interactions} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
