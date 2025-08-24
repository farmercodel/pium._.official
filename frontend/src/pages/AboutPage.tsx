import type { JSX } from "react";
import { useAboutPage } from "../hooks/useAboutPage";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { HeroSection } from "../components/About/HeroSection";
import { ProjectIntroSection } from "../components/About/ProjectIntroSection";
import { FeaturesSection } from "../components/About/FeaturesSection";
import { TeamSection } from "../components/About/TeamSection";
import { CTASection } from "../components/About/CTASection";

export const AboutPage = ({
  team,
}: {
  team?: ReturnType<typeof useAboutPage>["teamMembers"];
}): JSX.Element => {
  // useAboutPage 훅에서 데이터와 애니메이션 불러오기
  const { teamMembers, projectIntroData, featureData, heroAnim, inViewAnim } =
    useAboutPage(team);

  // 페이지 이동 시 스크롤을 맨 위로
  useScrollToTop();

  return (
    <main className="font-sans">
      {/* Hero Section */}
      <HeroSection heroAnim={heroAnim} />

      {/* 프로젝트 소개 Section */}
      <ProjectIntroSection
        projectIntroData={projectIntroData}
        inViewAnim={inViewAnim}
      />

      {/* 주요 기능 Section */}
      <FeaturesSection featureData={featureData} inViewAnim={inViewAnim} />

      {/* 팀원 소개 Section */}
      <TeamSection teamMembers={teamMembers} inViewAnim={inViewAnim} />

      {/* CTA Section */}
      <CTASection inViewAnim={inViewAnim} />
    </main>
  );
};

export default AboutPage;
