import { motion } from "framer-motion";
import { container, fade, cardEnter } from "../../hooks/useAnimation";
import type { MotionProps } from "framer-motion";

// 타입 가드
const isMotionProps = (obj: unknown): obj is MotionProps =>
  typeof obj === "object" && obj !== null;

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
        h-full rounded-2xl bg-white p-6 text-center shadow-sm
        border border-[#e9ecef]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(192,214,99,0.6)]
        transition-shadow transform-gpu
      "
      variants={cardEnter}
      {...safeInteractions}
    >
      {/* === 아이콘: 기존 느낌 유지 + 포인트톤 radial === */}
      <div className="flex justify-center">
        <div className="relative">
          {/* glow – 더 밝고 얇게 */}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full blur-xl opacity-30"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(249,250,233,0.35) 0%, rgba(233,241,191,0.18) 45%, rgba(255,255,255,0) 80%)",
              }}
            />

            {/* gradient circle – 아주 밝은 라임 톤(테두리 밝게) */}
            <div
              className="
                grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-full
                ring-1 ring-[rgba(192,214,99,0.18)]
                shadow-[0_3px_8px_rgba(192,214,99,0.08)]
                bg-[linear-gradient(to_bottom_right,_#cfe89b_0%,_#8fd77e_52%,_#19c6d3_100%)]
              "
            >
            <img src={icon} alt="" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
          </div>
        </div>
      </div>

      <h3 className="mt-5 text-base sm:text-lg font-semibold text-gray-800">
        {title}
      </h3>
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
