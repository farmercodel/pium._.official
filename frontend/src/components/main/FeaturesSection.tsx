import { motion } from "framer-motion";
import { container, fade, cardEnter } from "../../hooks/useAnimation";
import type { Feature } from "../../hooks/useMainPage";
import type { MotionProps } from "framer-motion";

// 타입 가드 함수
const isMotionProps = (obj: unknown): obj is MotionProps => 
  typeof obj === 'object' && obj !== null;

interface FeatureCardProps {
  feature: Feature;
  interactions: unknown;
}

const FeatureCard = ({ feature, interactions }: FeatureCardProps) => {
  const safeInteractions = isMotionProps(interactions) ? interactions : {};
  
  return (
    <motion.div
      className="
        rounded-2xl border border-[#e9ecef]
        p-6 sm:p-7 lg:p-8
        shadow-sm bg-white
        transform-gpu
      "
      variants={cardEnter}
      {...safeInteractions}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <div className="flex justify-center">
        <div className="relative">
          {/* glow */}
          <span
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full blur-lg opacity-60"
            style={{
              background:
                "radial-gradient(closest-side, rgba(16,185,129,0.35), rgba(20,184,166,0.25), rgba(6,182,212,0.15))",
            }}
          />
          {/* gradient circle (64px → lg:80px) */}
          <div
            className="
            inline-flex h-16 w-16 items-center justify-center rounded-full
            ring-1 ring-white/10
            shadow-[0_8px_20px_rgba(16,185,129,0.22)]
            bg-[radial-gradient(closest-side,_rgba(110,231,183,1),_rgba(45,212,191,0.95)_60%,_rgba(34,211,238,0.9))]
            lg:h-20 lg:w-20
          "
          >
            <img
              src={feature.icon}
              alt=""
              className="h-8 w-8 lg:h-10 lg:w-10"
              loading="lazy"
              aria-hidden
            />
          </div>
        </div>
      </div>
      <h3 className="mt-6 text-center text-lg sm:text-xl font-semibold text-gray-800">
        {feature.title}
      </h3>
      <p className="mt-3 text-center text-sm sm:text-base text-gray-600 leading-relaxed">
        {feature.desc}
      </p>
    </motion.div>
  );
};

interface FeaturesSectionProps {
  features: Feature[];
  interactions: unknown;
}

export const FeaturesSection = ({ features, interactions }: FeaturesSectionProps) => {
  return (
    <section className="bg-white" id="get-started" aria-labelledby="features-heading">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="text-center">
          <motion.h2
            id="features-heading"
            className="text-2xl sm:text-3xl lg:text-4xl leading-10 text-gray-800 font-semibold tracking-tight"
            variants={fade}
          >
            AI를 통해 당신의 가게를 쉽고 빠르게 홍보합니다
          </motion.h2>
          <motion.p
            className="mt-3 text-gray-600 text-sm sm:text-base lg:text-lg"
            variants={fade}
          >
            소상공인을 위한 스마트한 마케팅 솔루션
          </motion.p>
        </div>

        <div
          className="
            mt-10 sm:mt-12 lg:mt-16
            grid grid-cols-1
            md:grid-cols-1
            lg:grid-cols-3
            gap-6 sm:gap-8 lg:gap-10
          "
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              interactions={interactions}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
