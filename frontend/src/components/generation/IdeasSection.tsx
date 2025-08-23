import { motion } from "framer-motion";
import { container } from "../../hooks/useAnimation";
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
  onSelect 
}: IdeasSectionProps) => {
  return (
    <motion.div 
      className="mt-8 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
      variants={container}
    >
      {ideas.map((idea, idx) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          index={idx}
          selected={selectedId === idea.id}
          onSelect={onSelect}
          ctaLoading={publishingId === idea.id}
          disabled={!!publishingId}
        />
      ))}
    </motion.div>
  );
};
