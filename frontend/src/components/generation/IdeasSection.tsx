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
    const unknown = raw as unknown;
    
    // 타입가드 함수들
    const hasProperty = (obj: unknown, prop: string): obj is Record<string, unknown> => {
      return typeof obj === 'object' && obj !== null && prop in obj;
    };
    
    const isString = (value: unknown): value is string => {
      return typeof value === 'string';
    };
    
    const isArray = (value: unknown): value is unknown[] => {
      return Array.isArray(value);
    };
    
    // 안전한 값 추출
    const id = (
      hasProperty(unknown, 'id')
        ? (isString(unknown.id) ? unknown.id : typeof unknown.id === 'number' ? String(unknown.id) : undefined)
        : undefined
    ) ?? String(idx);
    
    const title = hasProperty(unknown, 'title') && isString(unknown.title)
      ? unknown.title
      : hasProperty(unknown, 'name') && isString(unknown.name)
      ? unknown.name
      : "";
    
    const summary = hasProperty(unknown, 'summary') && isString(unknown.summary)
      ? unknown.summary
      : hasProperty(unknown, 'description') && isString(unknown.description)
      ? unknown.description
      : "";
    
    const tags = hasProperty(unknown, 'tags') && isArray(unknown.tags)
      ? unknown.tags.filter((tag): tag is string => isString(tag))
      : [];
    
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
