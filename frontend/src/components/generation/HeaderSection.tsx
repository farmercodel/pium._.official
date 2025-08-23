import { motion } from "framer-motion";
import { fade } from "../../hooks/useAnimation";

interface HeaderSectionProps {
  ideaCount: number;
}

export const HeaderSection = ({ ideaCount }: HeaderSectionProps) => {
  return (
    <motion.header className="text-center" variants={fade}>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
        AI가 제안한 홍보 콘텐츠 {Math.max(3, ideaCount)}개
      </h1>
    </motion.header>
  );
};
