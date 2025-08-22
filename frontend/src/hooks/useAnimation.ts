import { useReducedMotion } from "framer-motion";
import type { MotionProps, Transition, Variants } from "framer-motion";

/** ===== Animation Variants ===== */
export const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const flyUp: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.99, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const cardEnter: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Preview 전용 애니메이션
export const popIn: Variants = { 
  hidden: { opacity: 0, scale: 0.98 }, 
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } } 
};

/** spring 인터랙션(접근성 고려: reduceMotion 시 비활성) */
export const useLiftInteractions = (hoverY: number = -3): MotionProps => {
  const reduce = useReducedMotion();
  if (reduce) return {};
  const springLift: Transition = { type: "spring", stiffness: 300, damping: 20 };
  return {
    whileHover: { y: hoverY, scale: 1.01 },
    whileTap: { scale: 0.98, y: -1 },
    transition: springLift,
  };
};

export const useAnimationProps = (options?: {
  hoverY?: number;        // 기본: -3, Plans/Preview: -6
  viewportAmount?: number; // 기본: 0.25, Preview: 0.2
}) => {
  const reduce = useReducedMotion();
  
  // 접근성: reduce-motion 시 애니메이션 비활성
  const heroAnim = reduce ? {} : { initial: "hidden", animate: "show" };
  const inViewAnim = reduce ? {} : { 
    initial: "hidden", 
    whileInView: "show", 
    viewport: { once: true, amount: options?.viewportAmount ?? 0.25 } 
  };
  
  return {
    reduce,
    heroAnim,
    inViewAnim
  };
};
