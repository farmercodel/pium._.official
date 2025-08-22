import type { JSX } from "react";
import { useGuidePage } from "../hooks/useGuidePage";
import { useLiftInteractions } from "../hooks/useAnimation";
import { HeroSection } from "../components/guide/HeroSection";
import { StepsSection } from "../components/guide/StepsSection";
import { FeaturesSection } from "../components/guide/FeaturesSection";
import { CTASection } from "../components/guide/CTASection";

export const GuidePage = (): JSX.Element => {
  const { steps, features } = useGuidePage();
  const interactions = useLiftInteractions(-6); // Guide 전용: y: -6

  return (
    <main className="font-sans">
      {/* Hero */}
      <HeroSection reduce={false} />

      {/* 3단계 카드 */}
      <StepsSection steps={steps} interactions={interactions} />

      {/* 기능 섹션 */}
      <FeaturesSection features={features} interactions={interactions} />

      {/* CTA */}
      <CTASection interactions={interactions} />
    </main>
  );
};

export default GuidePage;
