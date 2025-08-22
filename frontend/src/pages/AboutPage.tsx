import type { JSX } from "react";
import { useAboutPage } from "../hooks/useAboutPage";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { HeroSection } from "../components/About/HeroSection";
import { ProjectIntroSection } from "../components/About/ProjectIntroSection";
import { FeaturesSection } from "../components/About/FeaturesSection";
import { TeamSection } from "../components/About/TeamSection";
import { CTASection } from "../components/About/CTASection";

export const AboutPage = ({ team }: { team?: ReturnType<typeof useAboutPage>['teamMembers'] }): JSX.Element => {
  const { teamMembers, projectIntroData, featureData, heroAnim, inViewAnim } = useAboutPage(team);
  
  // 페이지 이동 시 스크롤을 맨 위로
  useScrollToTop();

  return (
    <main className="font-sans">
      <HeroSection heroAnim={heroAnim} />
      <ProjectIntroSection projectIntroData={projectIntroData} inViewAnim={inViewAnim} />
      <FeaturesSection featureData={featureData} inViewAnim={inViewAnim} />
      <TeamSection teamMembers={teamMembers} inViewAnim={inViewAnim} />
      <CTASection inViewAnim={inViewAnim} />
    </main>
  );
};

export default AboutPage;
