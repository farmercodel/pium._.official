// components/generation/IdeasSection.tsx
import { IdeaCard } from "./IdeaCard";
import type { PromotionIdea } from "../../hooks/useGenerationPage";

interface IdeasSectionProps {
  ideas: PromotionIdea[];
  selectedId: string | null;
  publishingId: string | null;
  onSelect: (idea: PromotionIdea) => void;
}

export const IdeasSection = ({
  ideas,
  selectedId,
  publishingId,
  onSelect,
}: IdeasSectionProps) => {
  // 안전 렌더링을 위한 정규화 (응답 필드 누락 대비)
  const safeIdeas: PromotionIdea[] = (ideas ?? []).map((raw, idx) => {
    const any = raw as any;
    const id = String(any?.id ?? idx);
    const title = any?.title ?? any?.name ?? "";
    const summary = any?.summary ?? any?.description ?? "";
    const tags = Array.isArray(any?.tags) ? any.tags : [];
    return { ...raw, id, title, summary, tags } as PromotionIdea;
  });

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
      {safeIdeas.map((idea, idx) => (
        <IdeaCard
          key={idea.id ?? String(idx)}
          idea={idea}
          index={idx}
          selected={selectedId === idea.id}
          onSelect={onSelect}
          ctaLoading={publishingId === idea.id}
          disabled={!!publishingId}
        />
      ))}
    </div>
  );
};
