import type { JSX } from "react";
import { useMainPage } from "../hooks/useMainPage";
import { useLiftInteractions } from "../hooks/useAnimation";
import { HeroSection } from "../components/main/HeroSection";
import { FeaturesSection } from "../components/main/FeaturesSection";

export const MainPage = (): JSX.Element => {
  const { features } = useMainPage();
  const interactions = useLiftInteractions(-4); // Main 전용: y: -4

  return (
    <>
      {/* 폰트 적용: font-sans (tailwind.config.js에서 Pretendard로 매핑) */}
      <main className="bg-white font-sans">
        {/* ====== Hero ====== */}
        <HeroSection reduce={false} />

        {/* ====== Features ====== */}
        <FeaturesSection features={features} interactions={interactions} />
      </main>
    </>
  );
};

export default MainPage;
