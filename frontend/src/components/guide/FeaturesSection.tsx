import { motion } from "framer-motion";
import { container, fade, cardEnter } from "../../hooks/useAnimation";
import type { MotionProps } from "framer-motion";

// 타입 가드 함수
const isMotionProps = (obj: unknown): obj is MotionProps => 
  typeof obj === 'object' && obj !== null;

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface FeatureCardProps {
  icon: string;
  title: string;
  desc: string;
  interactions: unknown;
}

const FeatureCard = ({ icon, title, desc, interactions }: FeatureCardProps) => {
  const safeInteractions = isMotionProps(interactions) ? interactions : {};
  
  return (
    <motion.div
      role="button"
      tabIndex={0}
      className="
        h-full rounded-xl bg-white p-6 text-center shadow-sm
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300
        transition-shadow transform-gpu
      "
      variants={cardEnter}
      {...safeInteractions}
    >
      {/* === 아이콘: 원형 연한 그린 배경 + 은은한 글로우 === */}
      <div className="flex justify-center">
        <div className="relative">
          {/* glow */}
          <span
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full blur-xl opacity-60"
            style={{
              background:
                "radial-gradient(closest-side, rgba(16,185,129,0.18), rgba(20,184,166,0.10), transparent)",
            }}
          />
          {/* light green circle */}
          <div
            className="
              grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-full
              bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-100
              ring-1 ring-emerald-200/60 shadow
            "
          >
            <img
              src={icon}
              alt=""
              className="h-7 w-7 sm:h-8 sm:w-8"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <h3 className="mt-5 text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </motion.div>
  );
};

interface FeaturesSectionProps {
  features: Feature[];
  interactions: unknown;
}

export const FeaturesSection = ({ features, interactions }: FeaturesSectionProps) => {
  return (
    <section className="bg-gray-50">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="text-center text-2xl sm:text-3xl font-bold text-gray-800"
          variants={fade}
        >
          피움의 특별한 기능들
        </motion.h2>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
              interactions={interactions}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
