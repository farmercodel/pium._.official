import type { JSX } from "react";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MotionProps, Transition } from "framer-motion";

const useLiftInteractions = (): MotionProps => {
  const reduce = useReducedMotion();
  if (reduce) return {};
  const springLift: Transition = { type: "spring", stiffness: 300, damping: 20 };
  return {
    whileHover: { y: -6, scale: 1.01 },
    whileTap: { scale: 0.98, y: -1 },
    transition: springLift,
  };
};

type Plan = {
  id: "free" | "basic" | "pro";
  title: string;
  price: string; // 통화/형식 그대로
  period?: string; // /월 등
  features: string[];
  cta: string;
  highlight?: boolean; // 인기
};

const plans: Plan[] = [
  {
    id: "free",
    title: "FREE",
    price: "₩0",
    period: "/ 월",
    features: ["기본 기능 이용", "10개 저장공간", "이메일 지원"],
    cta: "시작하기",
  },
  {
    id: "basic",
    title: "BASIC",
    price: "₩19,900",
    period: "/ 월",
    features: ["모든 기본 기능", "100개 저장공간", "이메일 + 채팅 지원", "3인 동시 도구"],
    cta: "신청하기",
    highlight: true,
  },
  {
    id: "pro",
    title: "PRO",
    price: "₩49,900",
    period: "/ 월",
    features: ["모든 프로페셔널 기능", "무제한 저장공간", "24/7 우선 지원", "고급 분석 도구"],
    cta: "업그레이드",
  },
];

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="9" stroke="currentColor" className="opacity-20" />
    <path d="M6 10.5l2.5 2.5L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrownIcon = () => (
  <img src="https://c.animaapp.com/OWBCfRMZ/img/div-4.svg" alt="" className="h-5 w-5" />
);

const PlanCard = ({ plan, selected, onSelect }: { plan: Plan; selected: boolean; onSelect: (id: Plan["id"]) => void; }) => {
  const interactions = useLiftInteractions();
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect(plan.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(plan.id)}
      className={[
        "group relative h-full rounded-2xl bg-white p-6 sm:p-7 shadow-sm transition-shadow",
        "border-2",
        selected ? "border-emerald-400 shadow-md" : "border-[#a3d276] hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
      ].join(" ")}
      {...interactions}
    >
      {/* 인기 배지 */}
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 shadow">
          인기
        </span>
      )}

      {/* 원형 아이콘 (임시 이미지) */}
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600 shadow mb-4">
        <CrownIcon />
      </div>

      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{plan.title}</h3>
        <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-600">
          {plan.price} {plan.period && <span className="text-sm font-semibold text-emerald-600/80 align-middle">{plan.period}</span>}
        </div>
      </div>

      {/* Features */}
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5"><CheckIcon /></span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.button
        type="button"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
        {...interactions}
      >
        {plan.cta}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-gray-800">{q}</span>
        <span aria-hidden className="text-gray-500">{open ? "−" : "+"}</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { type: "tween", duration: 0.2 }}
        className="overflow-hidden px-5"
      >
        <p className="pb-4 text-sm text-gray-600">{a}</p>
      </motion.div>
    </div>
  );
};

export const PricingPage = (): JSX.Element => {
  const [selected, setSelected] = useState<Plan["id"]>("basic");

  return (
    <main className="font-sans">
      {/* 배경은 연한 그린 톤으로, 레이아웃 헤더/푸터 외 본문만 구성 */}
      <section className="relative w-full bg-emerald-50/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <header className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">이용 플랜</h1>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              다양한 요구사항에 맞는 플랜을 선택하세요. 언제든지 업그레이드하거나 변경할 수 있습니다.
            </p>
          </header>

          {/* Cards */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} selected={selected === p.id} onSelect={setSelected} />
            ))}
          </div>

          {/* FAQ */}
          <section className="mt-14 sm:mt-16 lg:mt-20">
            <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-800">자주 묻는 질문</h2>
            <div className="mx-auto mt-6 max-w-3xl space-y-4">
              <FaqItem q="플랜을 언제라도 변경할 수 있나요?" a="네, 언제든지 계정 설정에서 플랜을 변경하거나 취소할 수 있습니다." />
              <FaqItem q="결제 방식은 어떻게 되나요?" a="30일 단위로 자동 갱신되는 월간 결제입니다." />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default PricingPage;