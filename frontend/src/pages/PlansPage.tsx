import type { JSX } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import useNavigation from "../hooks/useNavigation";
import { 
  useAnimationProps, 
  useLiftInteractions, 
  container, 
  flyUp, 
  fade, 
  cardEnter 
} from "../hooks/useAnimation";
import { useTossPayments } from "../hooks/useTossPayments";
import { useUrlParams } from "../hooks/useUrlParams";
import { useScrollToTop } from "../hooks/useScrollToTop";

type Plan = {
  id: "free" | "basic" | "pro";
  title: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

const plans: Plan[] = [
  { id: "free",  title: "FREE",  price: "₩0",      period: "/ 월", features: ["월 최대 1회 서비스 지원", "템플릿 기반 썸네일 처리 기능 지원", "300자 이내 홍보글 생성"], cta: "시작하기" },
  { id: "basic", title: "BASIC", price: "₩5,500",  period: "/ 월", features: ["월 최대 10회 서비스 지원", "템플릿 기반 썸네일 처리 기능 지원", "홍보글 글자수 지정 기능 지원"], cta: "업그레이드", highlight: true },
  { id: "pro",   title: "PRO",   price: "₩9,900",  period: "/ 월", features: ["월 최대 30회 서비스 지원", "템플릿 기반 썸네일 처리 기능 지원", "홍보글 글자수 지정 기능 지원"], cta: "업그레이드" },
];

/** 결제 금액/오더명 매핑 (서버/SDK에서 사용) */
const PLAN_META: Record<Plan["id"], { amount: number; orderName: string; disabled?: boolean }> = {
  free:  { amount: 0,    orderName: "Free Plan (monthly)",  disabled: true },
  basic: { amount: 5500, orderName: "Basic Plan (monthly)" },
  pro:   { amount: 9900, orderName: "Pro Plan (monthly)" },
};

/* =========================
   White SVG icons (transparent bg)
   ========================= */
const SproutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 20V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 12c0-4.5-3.5-7-8-7 0 4.5 3.5 7 8 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 12c4.5 0 8-2.5 8-7-4.5 0-8 2.5-8 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    <path d="M19 13l.9 2.1L22 16l-2.1.9L19 19l-.9-2.1L16 16l2.1-.9L19 13Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const CrownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 8l4 3 5-6 5 6 4-3v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    <path d="M8 19h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** 아이콘 매핑 */
const PLAN_ICONS: Record<Plan["id"], JSX.Element> = {
  free:  <SproutIcon />,
  basic: <SparklesIcon />,
  pro:   <CrownIcon />,
};

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="9" stroke="currentColor" className="opacity-20" />
    <path d="M6 10.5l2.5 2.5L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type PlanCardProps = {
  plan: Plan;
  icon: JSX.Element;
  selected: boolean;
  onSelect: (id: Plan["id"]) => void;
  onAction: () => void;
  ctaDisabled: boolean;
  ctaLoading: boolean;
};

const PlanCard = ({ plan, icon, selected, onSelect, onAction, ctaDisabled, ctaLoading }: PlanCardProps) => {
  const interactions = useLiftInteractions(-6); // Plans 전용: y: -6
  const { reduce } = useAnimationProps();

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect(plan.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(plan.id)}
      className={[
        "group relative h-full rounded-2xl bg-white p-6 sm:p-7 shadow-sm transition-shadow transform-gpu",
        "border-2",
        selected ? "border-emerald-400 shadow-md" : "border-[#a3d276] hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
      ].join(" ")}
      variants={cardEnter}
      animate={
        reduce
          ? {}
          : selected
          ? { scale: 1.01, boxShadow: "0 16px 32px rgba(16,185,129,0.25)", transition: { type: "spring", stiffness: 240, damping: 22 } }
          : { scale: 1, boxShadow: "0 8px 16px rgba(0,0,0,0.06)" }
      }
      {...interactions}
    >
      {/* 인기 배지 */}
      {plan.highlight && !reduce && (
        <motion.span
          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 shadow"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          인기
        </motion.span>
      )}

      {/* 원형 아이콘 (흰색 아이콘 + 컬러 배경) */}
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-600 text-white shadow mb-4">
        {icon}
      </div>

      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{plan.title}</h3>
        <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-600">
          {plan.price}{" "}
          {plan.period && <span className="text-sm font-semibold text-emerald-600/80 align-middle">{plan.period}</span>}
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
        onClick={(e) => { e.stopPropagation(); onAction(); }}
        disabled={ctaDisabled}
        aria-busy={ctaLoading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-60"
        {...useLiftInteractions()}
      >
        {ctaLoading ? "진행중..." : plan.cta}
        <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden
          animate={ctaLoading ? { rotate: 360 } : { rotate: 0 }}
          transition={ctaLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
        >
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.button>
    </motion.div>
  );
};

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  const { reduce } = useAnimationProps();
  return (
    <motion.div className="rounded-xl border border-gray-200 bg-white" variants={cardEnter}>
      <button type="button" className="flex w-full items-center justify-between px-5 py-4 text-left" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="font-semibold text-gray-800">{q}</span>
        <span aria-hidden className="text-gray-500">{open ? "−" : "+"}</span>
      </button>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={reduce ? { duration: 0 } : { type: "tween", duration: 0.2 }} className="overflow-hidden px-5">
        <p className="pb-4 text-sm text-gray-600">{a}</p>
      </motion.div>
    </motion.div>
  );
};

export const PricingPage = (): JSX.Element => {
  const [selected, setSelected] = useState<Plan["id"]>("basic");
  const [loading, setLoading] = useState<Plan["id"] | null>(null);
  const { heroAnim, inViewAnim } = useAnimationProps();
  const { sdkReady, startBillingEnroll } = useTossPayments();
  const { goToSurvey } = useNavigation();

  // 커스텀 훅 사용
  useUrlParams();
  useScrollToTop();

  /** 정기결제(빌링) 등록 */
  const handleBillingEnroll = async (planId: Plan["id"]) => {
    if (PLAN_META[planId].disabled) return;

    console.log(`[PlansPage] 정기결제 등록 시작: ${planId}`, {
      planId,
      amount: PLAN_META[planId].amount,
      orderName: PLAN_META[planId].orderName,
      sdkReady
    });

    try {
      setLoading(planId);
      const amount = PLAN_META[planId].amount;
      const orderName = PLAN_META[planId].orderName;
      
      console.log('[PlansPage] startBillingEnroll 호출:', { planId, amount, orderName });
      await startBillingEnroll(planId, amount, orderName);
      
      console.log('[PlansPage] 정기결제 등록 성공');
    } catch (error) {
      console.error('[PlansPage] 정기결제 등록 실패:', error);
      
      // 사용자에게 에러 메시지 표시
      let errorMessage = "정기결제 등록에 실패했습니다.";
      if (error instanceof Error) {
        errorMessage += `\n${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage += `\n${error}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(null);
      console.log('[PlansPage] 로딩 상태 해제');
    }
  };

  return (
    <main className="font-sans">
      <section className="relative w-full bg-emerald-50/60">
        <motion.div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20" variants={container} {...heroAnim}>
          <header className="text-center">
            <motion.h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900" variants={flyUp}>이용 플랜</motion.h1>
            <motion.p className="mt-3 text-gray-600 text-sm sm:text-base" variants={fade}>다양한 요구사항에 맞는 플랜을 선택하세요. 언제든지 업그레이드하거나 변경할 수 있습니다.</motion.p>
          </header>

          {/* Cards */}
          <motion.div
            className="mt-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
            variants={container}
            {...inViewAnim}
          >
            {plans.map((p) => {
              const isFree = p.id === "free";
              return (
                <PlanCard
                  key={p.id}
                  plan={p}
                  icon={PLAN_ICONS[p.id]}
                  selected={selected === p.id}
                  onSelect={setSelected}
                  onAction={isFree ? goToSurvey : () => handleBillingEnroll(p.id)}
                  ctaDisabled={isFree ? false : loading !== null || !sdkReady}
                  ctaLoading={isFree ? false : loading === p.id}
                />
              );
            })}
          </motion.div>

          {/* FAQ */}
          <motion.section className="mt-14 sm:mt-16 lg:mt-20" variants={container} {...inViewAnim}>
            <motion.h2 className="text-center text-xl sm:text-2xl font-bold text-gray-800" variants={fade}>자주 묻는 질문</motion.h2>
            <motion.div className="mx-auto mt-6 max-w-3xl space-y-4" variants={container}>
              <FaqItem q="무료로 사용할 순 없나요?" a=" 본 서비스는 월 1회 무료 홍보 피드 생성 및 인스타그램 게시 기능을 지원합니다." />
              <FaqItem q="어떤 서비스를 제공 받을 수 있나요?" a=" 사용자가 가게에 대한 정보를 입력하면 AI가 자동으로 홍보글과 해시태그를 생성하고, 이를 인스타그램에 자동으로 게시할 수 있도록 지원합니다. 또한, 사용자가 게시한 첫 번째 사진 파일을 통해 템플릿 기반 썸네일 처리 기능을 제공합니다." />
              <FaqItem q="결제 방식은 어떻게 되나요?" a=" 30일 단위로 자동 갱신되는 월간 결제입니다." />
            </motion.div>
          </motion.section>
        </motion.div>
      </section>
    </main>
  );
};

export default PricingPage;
