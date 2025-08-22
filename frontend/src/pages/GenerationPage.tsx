// src/pages/PromoGeneratePage.tsx
import type { JSX } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGenerationPage } from "../hooks/useGenerationPage";
import { useAnimationProps, container } from "../hooks/useAnimation";
import { HeaderSection } from "../components/generation/HeaderSection";
import { IdeasSection } from "../components/generation/IdeasSection";
import { ActionsSection } from "../components/generation/ActionsSection";

export type PromoGenerateProps = {
  ideas?: ReturnType<typeof useGenerationPage>['list'];
  onSelect?: (idea: ReturnType<typeof useGenerationPage>['list'][0]) => void;
  onRegenerate?: () => Promise<ReturnType<typeof useGenerationPage>['list']> | ReturnType<typeof useGenerationPage>['list'];
};

export const PromoGeneratePage = ({ ideas, onSelect, onRegenerate }: PromoGenerateProps): JSX.Element => {
  const { 
    list, 
    selectedId, 
    regenLoading, 
    publishingId, 
    selectedIdea, 
    initializeData, 
    handleSelect: internalHandleSelect, 
    handleRegenerate: internalHandleRegenerate 
  } = useGenerationPage(ideas);
  
  const { inViewAnim } = useAnimationProps();

  // 초기 데이터 로드
  useEffect(() => {
    initializeData();
  }, [ideas]);

  // 외부 onSelect와 내부 handleSelect 연결
  const handleSelect = (idea: ReturnType<typeof useGenerationPage>['list'][0]) => {
    onSelect?.(idea);
    internalHandleSelect(idea);
  };

  // 외부 onRegenerate와 내부 handleRegenerate 연결
  const handleRegenerate = async () => {
    if (onRegenerate) {
      const next = await onRegenerate();
      if (Array.isArray(next) && next.length) {
        // 외부에서 제공된 데이터로 업데이트
        return;
      }
    }
    // 내부 로직 실행
    await internalHandleRegenerate();
  };

  return (
    <main className="font-sans">
      <section className="relative w-full bg-white">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
          variants={container}
          {...inViewAnim}
        >
          <HeaderSection ideaCount={list.length} />
          
          <IdeasSection
            ideas={list}
            selectedId={selectedId}
            publishingId={publishingId}
            onSelect={handleSelect}
          />
          
          <ActionsSection
            regenLoading={regenLoading}
            selectedIdea={selectedIdea}
            onRegenerate={handleRegenerate}
          />
        </motion.div>
      </section>
    </main>
  );
};

export default PromoGeneratePage;
