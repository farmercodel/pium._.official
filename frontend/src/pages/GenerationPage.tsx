// src/pages/PromoGeneratePage.tsx
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useGenerationPage } from "../hooks/useGenerationPage";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { HeaderSection } from "../components/generation/HeaderSection";
import { IdeasSection } from "../components/generation/IdeasSection";
import { ActionsSection } from "../components/generation/ActionsSection";

export type PromoGenerateProps = {
  ideas?: ReturnType<typeof useGenerationPage>["list"];
  onSelect?: (idea: ReturnType<typeof useGenerationPage>["list"][0]) => void;
  /** 부모가 /generate 다시 호출 후 setState로 ideas를 갱신해 내려줄 때 사용 */
  onRegenerate?: () => Promise<void> | void;
};

export const PromoGeneratePage = ({
  ideas,
  onSelect,
  onRegenerate,
}: PromoGenerateProps): JSX.Element => {
  const {
    list,
    selectedId,
    regenLoading,     // 내부 훅의 로딩
    publishingId,
    selectedIdea,
    initializeData,
    handleSelect: internalHandleSelect,
    handleRegenerate: internalHandleRegenerate,
  } = useGenerationPage(ideas);

  // 외부(onRegenerate) 경로 로딩 상태
  const [externalLoading, setExternalLoading] = useState(false);

  // 페이지 이동 시 스크롤을 맨 위로
  useScrollToTop();

  // 초기 및 props 변경 시 데이터 동기화
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

  // 다시 생성하기: 외부(onRegenerate) 우선, 없으면 내부 훅 사용
  const handleRegenerate = async () => {
    try {
      if (onRegenerate) {
        setExternalLoading(true);
        await onRegenerate();  // 부모가 /generate 호출 → setIdeas(next)
        return;                // 내부 로직/리로드 금지
      }
      await internalHandleRegenerate(); // 외부 핸들러 없을 때만 내부 훅 사용
    } catch (e) {
      console.error(e);
    } finally {
      setExternalLoading(false);
    }
  };

  return (
    <main className="font-sans">
      <section className="relative w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <HeaderSection ideaCount={list.length} />

          <IdeasSection
            ideas={list}
            selectedId={selectedId}
            publishingId={publishingId}
            onSelect={handleSelect}
          />

          <ActionsSection
            regenLoading={regenLoading || externalLoading}
            selectedIdea={selectedIdea}
            onRegenerate={handleRegenerate}
          />
        </div>
      </section>
    </main>
  );
};

export default PromoGeneratePage;
