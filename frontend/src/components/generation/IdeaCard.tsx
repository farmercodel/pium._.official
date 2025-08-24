import { motion } from "framer-motion";
import { cardEnter } from "../../hooks/useAnimation";
import { useLiftInteractions } from "../../hooks/useAnimation";
import type { PromotionIdea } from "../../hooks/useGenerationPage";
import { useAnimationProps } from "../../hooks/useAnimation";

interface IdeaCardProps {
    idea: PromotionIdea;
    index: number;
    selected: boolean;
    onSelect: (idea: PromotionIdea) => void;
    ctaLoading?: boolean;
    disabled?: boolean;
}

const TagChip = ({ text }: { text: string }) => (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100">
        {text}
    </span>
);

export const IdeaCard = ({
    idea,
    index,
    selected,
    onSelect,
    ctaLoading,
    disabled,
}: IdeaCardProps) => {
    const interactions = useLiftInteractions(-6);

    const { reduce } = useAnimationProps();
    return (
        <motion.div
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            onClick={() => !disabled && onSelect(idea)}
            onKeyDown={(e) => !disabled && (e.key === "Enter" || e.key === " ") && onSelect(idea)}
            className={[
                "group relative h-full rounded-2xl bg-white p-6 shadow-sm transition-shadow",
                "border flex flex-col", // ✅ 세로 플렉스: 버튼을 하단으로 보낼 수 있게
                selected ? "border-emerald-400 shadow-md" : "border-gray-200 hover:shadow-md",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
                disabled ? "opacity-70 pointer-events-none" : "",
            ].join(" ")}
            variants={cardEnter}
            {...interactions}
        >
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(to_bottom_right,_#cfe89b_0%,_#8fd77e_52%,_#19c6d3_100%)] text-white shadow">
                <span className="text-sm font-bold">{index + 1}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-gray-800">{idea.title}</h3>

            <p className="mt-2 text-sm text-gray-600 leading-6 whitespace-pre-line">
                {idea.summary}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                {idea.tags.map((t, i) => (
                    <TagChip key={i} text={t} />
                ))}
            </div>

            {/* ✅ mt-auto 로 버튼을 카드 맨 아래로 */}
            <motion.button
                type="button"
                className="mt-auto pt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5
                   bg-[linear-gradient(90deg,#cfe89b_0%,#8fd77e_52%,#19c6d3_100%)]
                   text-white font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-60"
                onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) onSelect(idea);
                }}
                disabled={disabled}
                {...interactions}
            >
                {ctaLoading ? "업로드 중" : "선택하기"}
                {/* 로딩 중일 때: 점 3개가 순차적으로 나타나는 스피너 */}
                {ctaLoading ? (
                    <div className="flex items-center gap-1 ml-1">
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                className="w-1.5 h-1.5 bg-white rounded-full"
                                animate={reduce ? {} : {
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: index * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    /* 기본 상태: 화살표 */
                    <motion.svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                        className="ml-1"
                        animate={reduce ? {} : { rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                        <path
                            d="M5 12h14M13 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </motion.svg>
                )}
            </motion.button>

            {selected && (
                <span
                    className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-emerald-300/60"
                    aria-hidden
                />
            )}
        </motion.div>
    );
};
