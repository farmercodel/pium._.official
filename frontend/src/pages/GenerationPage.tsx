// src/pages/PromoGeneratePage.tsx
import type { JSX } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGenerationPage } from "../hooks/useGenerationPage";
import { useAnimationProps, container } from "../hooks/useAnimation";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { HeaderSection } from "../components/generation/HeaderSection";
import { IdeasSection } from "../components/generation/IdeasSection";
import { ActionsSection } from "../components/generation/ActionsSection";

export type PromoGenerateProps = {
  ideas?: ReturnType<typeof useGenerationPage>["list"];
  onSelect?: (idea: ReturnType<typeof useGenerationPage>["list"][0]) => void;
  onRegenerate?: () =>
    | Promise<ReturnType<typeof useGenerationPage>["list"]>
    | ReturnType<typeof useGenerationPage>["list"];
};

export const PromoGeneratePage = ({
  ideas,
  onSelect,
  onRegenerate,
}: PromoGenerateProps): JSX.Element => {
  const {
    list,
    selectedId,
    regenLoading,
    publishingId,
    selectedIdea,
    initializeData,
    handleSelect: internalHandleSelect,
    handleRegenerate: internalHandleRegenerate,
  } = useGenerationPage(ideas);

  const { inViewAnim } = useAnimationProps();

  // 페이지 이동 시 스크롤을 맨 위로
  useScrollToTop();

  // 초기 데이터 로드
  useEffect(() => {
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideas]);

  // 외부 onSelect와 내부 handleSelect 연결
  const handleSelect = (
    idea: ReturnType<typeof useGenerationPage>["list"][0]
  ) => {
    onSelect?.(idea);
    internalHandleSelect(idea);
  };

  // 외부 onRegenerate와 내부 handleRegenerate 연결 + 생성 후 1회 새로고침
  const handleRegenerate = async () => {
    try {
      if (onRegenerate) {
        const next = await onRegenerate();
        if (Array.isArray(next) && next.length) {
          // 외부에서 직접 리스트를 갱신한 경우에도 새로고침만 1번 실행 (UI 정합성 확보)
          requestAnimationFrame(() => window.location.reload());
          return;
        }
      }
      // 내부 로직 실행
      await internalHandleRegenerate();

      // ✅ 생성 완료 직후 다음 프레임에 1회 새로고침
      requestAnimationFrame(() => window.location.reload());
      // (react-router v6 이상이면 navigate(0)로도 가능)
    } catch (e) {
      // 실패 시에는 새로고침하지 않음
      console.error(e);
    }
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
