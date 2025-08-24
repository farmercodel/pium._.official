// components/Modal.tsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Variant = "default" | "warning" | "danger" | "success";

interface ModalProps {
    open: boolean;
    title: string;
    desc?: string;
    confirmText?: string;
    cancelText?: string;
    onClose: () => void;
    onConfirm?: () => void;
    iconSrc?: string;          // /assets/... (옵션)
    reduceMotion?: boolean;    // true면 애니메이션 최소화
    variant?: Variant;         // 기본: success (에메랄드)
}

const stylesByVariant: Record<
    Variant,
    { grad: string; ring: string; glow: string; icon: string; chipBg: string }
> = {
    // 페이지 톤에 맞춘 에메랄드 계열
    default: {
        grad: "from-emerald-500 via-emerald-500 to-teal-500",
        ring: "ring-emerald-300",
        glow: "rgba(16,185,129,0.26), rgba(45,212,191,0.18), rgba(13,148,136,0.12)",
        icon: "text-emerald-600",
        chipBg: "from-emerald-50 via-emerald-100 to-teal-100",
    },
    success: {
    // 버튼들과 톤 통일: 에메랄드 중심, 살짝 투명도 줘서 부드럽게
    grad: "from-emerald-300/90 via-emerald-400/90 to-teal-500/90",
    // 링은 한 톤 연하게
    ring: "ring-emerald-200",
    // 글로우(그림자)도 채도·알파 낮춰 눈부심 줄이기
    glow: "rgba(16,185,129,0.18), rgba(45,212,191,0.12), rgba(6,182,212,0.10)",
    // 아이콘은 선명도 유지(화이트 배경 대비 좋음). 더 연하게 원하면 500으로.
    icon: "text-emerald-600",
    // 칩/배지 배경은 아주 연한 톤으로
    chipBg: "from-emerald-50 via-emerald-100 to-teal-50",
    },
    // 필요하면 노란 경고, 빨간 위험도 그대로 사용 가능
    warning: {
        grad: "from-amber-500 via-orange-400 to-yellow-500",
        ring: "ring-amber-300",
        glow: "rgba(245,158,11,0.30), rgba(234,179,8,0.18), rgba(132,204,22,0.10)",
        icon: "text-amber-600",
        chipBg: "from-amber-50 via-yellow-100 to-lime-100",
    },
    danger: {
        grad: "from-rose-500 via-orange-500 to-amber-500",
        ring: "ring-rose-300",
        glow: "rgba(244,63,94,0.30), rgba(249,115,22,0.18), rgba(245,158,11,0.10)",
        icon: "text-rose-600",
        chipBg: "from-rose-50 via-rose-100 to-orange-100",
    },
};

export function Modal({
    open,
    title,
    desc,
    confirmText = "다시 시도",
    cancelText = "닫기",
    onClose,
    onConfirm,
    iconSrc,
    reduceMotion = false,
    variant = "success", // ✅ 기본을 에메랄드로
}: ModalProps) {
    const { grad, ring, glow, icon, chipBg } = stylesByVariant[variant];

    // 배경 스크롤 잠금
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    // ESC 닫기
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[1000] grid place-items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}
                    aria-modal="true"
                    role="dialog"
                    aria-labelledby="pium-alert-title"
                    aria-describedby={desc ? "pium-alert-desc" : undefined}
                    onClick={onClose} // 바깥 클릭 닫기
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />

                    {/* Panel */}
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
                        transition={
                            reduceMotion
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 300, damping: 24 }
                        }
                        className={`
              relative w-[92vw] max-w-md
              p-[1px] rounded-2xl bg-gray
              shadow-[0_20px_40px_rgba(0,0,0,0.18)]
              focus:outline-none
            `}
                    >
                        <div className="rounded-2xl bg-white p-6 sm:p-7">
                            {/* Icon */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 -z-10 blur-xl opacity-70"
                                        style={{
                                            background: `radial-gradient(closest-side, ${glow})`,
                                            borderRadius: "9999px",
                                        }}
                                    />
                                    <div
                                        className={`grid h-14 w-14 place-items-center rounded-full ring-1 ${ring}
                                bg-gradient-to-br ${chipBg}`}
                                    >
                                        {iconSrc ? (
                                            <img src={iconSrc} alt="" className="h-7 w-7" aria-hidden />
                                        ) : (
                                            // 기본 아이콘 — variant에 따라 다르게
                                            variant === "success" ? (
                                                // success: 체크 아이콘
                                                <svg
                                                    className={`h-7 w-7 ${icon}`}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={1.8}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden
                                                >
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            ) : (
                                                // 기타 variant: 경고 아이콘(삼각형)
                                                <svg
                                                    className={`h-7 w-7 ${icon}`}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={1.8}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden
                                                >
                                                    <path d="M12 9v4" />
                                                    <path d="M12 17h.01" />
                                                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                </svg>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Title & Desc */}
                            <h3
                                id="pium-alert-title"
                                className="mt-5 text-center text-lg sm:text-xl font-semibold text-gray-800"
                            >
                                {title}
                            </h3>
                            {desc && (
                                <p
                                    id="pium-alert-desc"
                                    className="mt-2 text-center text-sm sm:text-base text-gray-600 leading-relaxed"
                                >
                                    {desc}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="mt-6 flex items-center justify-center gap-3">
                                {/* ✅ 다시 시도: 에메랄드 그라데이션 + 호버 이동 */}
                                <button
                                    type="button"
                                    onClick={onConfirm ?? onClose}
                                    className={`
                  relative inline-flex items-center gap-2 justify-center rounded-full px-6 py-3
                  font-semibold text-white
                  focus:outline-none focus-visible:ring-2 ${ring}
                  bg-gradient-to-r ${grad}
                  shadow-[0_8px_18px_rgba(6,182,212,0.28)]
                  hover:brightness-105 active:scale-[0.99] transition
                `}
                                >
                                    <span>{confirmText}</span>
                                </button>

                                {/* 닫기 */}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="inline-flex items-center justify-center rounded-full px-6 py-3
                                  text-gray-700 bg-white border border-gray-200
                                  hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300
                                  transition"
                                >
                                    {cancelText}
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
