import { useReducedMotion } from "framer-motion";
import type { MotionProps, Transition, Variants } from "framer-motion";

/** ===== Animation Variants ===== */
export const container: Variants = { 
  hidden: {}, 
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } 
};

export const flyUp: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.99, filter: "blur(6px)" },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)", 
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
  },
};

export const fade: Variants = { 
  hidden: { opacity: 0, y: 10 }, 
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } 
};

export const cardEnter: Variants = { 
  hidden: { opacity: 0, y: 16, scale: 0.98 }, 
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } 
};

export const useLiftInteractions = (): MotionProps => {
  const reduce = useReducedMotion();
  if (reduce) return {};
  const springLift: Transition = { type: "spring", stiffness: 300, damping: 20 };
  return { 
    whileHover: { y: -6, scale: 1.01 }, 
    whileTap: { scale: 0.98, y: -1 }, 
    transition: springLift 
  };
};

export const usePlansAnimation = () => {
  const reduce = useReducedMotion();
  
  const heroAnim = reduce ? {} : { initial: "hidden", animate: "show" };
  const inViewAnim = reduce ? {} : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.25 } };
  
  return {
    reduce,
    heroAnim,
    inViewAnim
  };
};
