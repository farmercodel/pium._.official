import type { JSX } from "react";
import { useAboutPage } from "../hooks/useAboutPage";
import { HeroSection } from "../components/about/HeroSection";
import { ProjectIntroSection } from "../components/about/ProjectIntroSection";
import { FeaturesSection } from "../components/about/FeaturesSection";
import { TeamSection } from "../components/about/TeamSection";
import { CTASection } from "../components/about/CTASection";

export const AboutPage = ({ team }: { team?: ReturnType<typeof useAboutPage>['teamMembers'] }): JSX.Element => {
  const { teamMembers, projectIntroData, featureData, heroAnim, inViewAnim } = useAboutPage(team);

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
