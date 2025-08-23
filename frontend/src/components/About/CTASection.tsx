import { motion } from "framer-motion";
import { container, fade } from "../../hooks/useAnimation";
import { useLiftInteractions } from "../../hooks/useAnimation";

interface CTASectionProps {
  inViewAnim: Record<string, unknown>;
}

export const CTASection = ({ inViewAnim }: CTASectionProps) => {
  const interactions = useLiftInteractions(-6);

  return (
    <section className="bg-[#F9FAEA]">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14 text-center"
        variants={container}
        {...inViewAnim}
      >
        <motion.h2 className="text-xl sm:text-2xl font-bold text-gray-800" variants={fade}>
          지금 시작해보세요
        </motion.h2>
        <motion.p className="mt-2 text-sm sm:text-base text-gray-600" variants={fade}>
          피움과 함께 마케팅의 시작을 경험해보세요.
        </motion.p>
        <motion.div className="mt-6 flex flex-wrap items-center justify-center gap-3" variants={fade}>
          <motion.a
            href="/Survey"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4 bg-[linear-gradient(90deg,#cfe89b_0%,#8fd77e_52%,#19c6d3_100%)] text-white text-sm sm:text-base font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
            variants={fade}
            {...interactions}
          >
            시작하기
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>

          <motion.a
            href="mailto:likelion.pium.official@gmail.com"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4 bg-white text-emerald-700 ring-1 ring-gray-200 hover:ring-emerald-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            variants={fade}
            {...interactions}
          >
            문의하기
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M21 10a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7A8.38 8.38 0 018 17.9L3 19l1.1-4.6A8.38 8.38 0 013 10a8.5 8.5 0 018.5-8.5A8.5 8.5 0 0120 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};
