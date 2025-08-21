import type { JSX } from "react";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MotionProps, Transition, Variants } from "framer-motion";
import type { TossPaymentsInstance, BillingAuthOptions } from "../types/toss-payments";

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;

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

/** ===== Animation Variants ===== */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const flyUp: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.99, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const cardEnter: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

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
  { id: "free",  title: "FREE",  price: "₩0",       period: "/ 월", features: ["기본 기능 이용", "10개 저장공간", "이메일 지원"],                         cta: "시작하기" },
  { id: "basic", title: "BASIC", price: "₩5,500",  period: "/ 월", features: ["모든 기본 기능", "100개 저장공간", "이메일 + 채팅 지원", "3인 동시 도구"], cta: "신청하기", highlight: true },
  { id: "pro",   title: "PRO",   price: "₩9,900",  period: "/ 월", features: ["모든 프로페셔널 기능", "무제한 저장공간", "24/7 우선 지원", "고급 분석 도구"], cta: "업그레이드" },
];

/** 결제 금액/오더명 매핑 (서버/SDK에서 사용) */
const PLAN_META: Record<Plan["id"], { amount: number; orderName: string; disabled?: boolean }> = {
  free:  { amount: 0,     orderName: "Free Plan (monthly)", disabled: true },
  basic: { amount: 5500, orderName: "Basic Plan (monthly)" },
  pro:   { amount: 9900, orderName: "Pro Plan (monthly)" },
};

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="9" stroke="currentColor" className="opacity-20" />
    <path d="M6 10.5l2.5 2.5L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrownIcon = () => (
  <img src="https://c.animaapp.com/OWBCfRMZ/img/div-4.svg" alt="" className="h-5 w-5" />
);

type PlanCardProps = {
  plan: Plan;
  selected: boolean;
  onSelect: (id: Plan["id"]) => void;
  onAction: () => void;
  ctaDisabled: boolean;
  ctaLoading: boolean;
};

const PlanCard = ({ plan, selected, onSelect, onAction, ctaDisabled, ctaLoading }: PlanCardProps) => {
  const interactions = useLiftInteractions();
  const reduce = useReducedMotion();

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

      {/* 원형 아이콘 */}
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600 shadow mb-4">
        <CrownIcon />
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
        <motion.svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden
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
  const reduce = useReducedMotion();
  return (
    <motion.div className="rounded-xl border border-gray-200 bg-white" variants={cardEnter}>
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
    </motion.div>
  );
};

export const PricingPage = (): JSX.Element => {
  const [selected, setSelected] = useState<Plan["id"]>("basic");
  const [loading, setLoading] = useState<Plan["id"] | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const tossRef = useRef<TossPaymentsInstance | null>(null);
  const reduce = useReducedMotion();

  /** URL 파라미터 처리 (billing_enrolled / error) & 정리 */
  useEffect(() => {
    let rawQuery = window.location.search;
    if (!rawQuery && window.location.hash.includes("?")) {
      rawQuery = "?" + window.location.hash.split("?")[1];
    }
    const sp = new URLSearchParams(rawQuery);

    if (sp.get("billing_enrolled") === "1") {
      alert("결제 수단 등록이 완료되었습니다!");
      sp.delete("billing_enrolled");
    }
    if (sp.get("error")) {
      const err = sp.get("error");
      const msg = sp.get("msg") || "결제에 실패했어요.";
      alert(`결제 실패: ${err}\n${msg}`);
      sp.delete("error");
      sp.delete("msg");
    }

    const qs = sp.toString();
    if (window.location.hash.startsWith("#/")) {
      const [hashPath] = window.location.hash.split("?");
      const newHash = hashPath + (qs ? `?${qs}` : "");
      if (window.location.hash !== newHash) {
        window.history.replaceState({}, "", window.location.pathname + window.location.search + newHash);
      }
    } else {
      const newUrl = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
      if (window.location.pathname + window.location.search + window.location.hash !== newUrl) {
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  /** Toss SDK 동적 로드 */
  useEffect(() => {
    const id = "tosspayments-sdk";
    const boot = () => {
      if (window.TossPayments && CLIENT_KEY) {
        tossRef.current = window.TossPayments(CLIENT_KEY);
        setSdkReady(true);
      }
    };
    const el = document.getElementById(id);
    if (el) { boot(); return; }

    const s = document.createElement("script");
    s.id = id;
    s.src = "https://js.tosspayments.com/v1";
    s.async = true;
    s.onload = boot;
    document.body.appendChild(s);
  }, []);

  /** 정기결제(빌링) 등록 */
  const startBillingEnroll = async (planId: Plan["id"]) => {
    if (PLAN_META[planId].disabled) return;

    try {
      setLoading(planId);

      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("로그인 후 이용 가능한 서비스입니다.");
        return;
      }
      if (!window.TossPayments || !CLIENT_KEY) throw new Error("Toss SDK/Key missing");
      if (!tossRef.current) tossRef.current = window.TossPayments(CLIENT_KEY);

      const amount = PLAN_META[planId].amount;
      const orderName = PLAN_META[planId].orderName;

      // 서버에 구독 시작 알림 (success/fail URL 획득)
      const customerKey = `user_${Date.now()}`;
      const sRes = await fetch("/api/payments/toss/billing/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customer_key: customerKey,
          plan: planId.toUpperCase(), // "BASIC" | "PRO"
          amount,
          orderName,
        }),
      });
      if (!sRes.ok) throw new Error(`billing/start ${sRes.status}: ${await sRes.text()}`);
      const s = await sRes.json();
      if (!s?.ok) throw new Error("billing/start payload not ok");

      // 빌링 등록 요청
      const orderId = `SUBS_${customerKey}_${Date.now()}`;
      await tossRef.current!.requestBillingAuth("CARD", {
        customerKey,
        orderId,
        successUrl: s.successUrl,
        failUrl: s.failUrl,
      } satisfies BillingAuthOptions);
    } catch (e: any) {
      console.group("[Billing Enroll Error]");
      console.error(e);
      try { console.error("as json:", JSON.stringify(e)); } catch {}
      console.groupEnd();
      alert(`정기결제 등록에 실패했어요.\n${e?.message ?? String(e)}`);
    } finally {
      setLoading(null);
    }
  };

  const heroAnim = reduce ? {} : { initial: "hidden", animate: "show" };
  const inViewAnim = reduce ? {} : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.25 } };

  return (
    <main className="font-sans">
      <section className="relative w-full bg-emerald-50/60">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
          variants={container}
          {...heroAnim}
        >
          <header className="text-center">
            <motion.h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900" variants={flyUp}>
              이용 플랜
            </motion.h1>
            <motion.p className="mt-3 text-gray-600 text-sm sm:text-base" variants={fade}>
              다양한 요구사항에 맞는 플랜을 선택하세요. 언제든지 업그레이드하거나 변경할 수 있습니다.
            </motion.p>
          </header>

          {/* Cards */}
          <motion.div
            className="mt-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
            variants={container}
            {...inViewAnim}
          >
            {plans.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                selected={selected === p.id}
                onSelect={setSelected}
                onAction={() => startBillingEnroll(p.id)}
                ctaDisabled={!!PLAN_META[p.id].disabled || loading !== null || !sdkReady}
                ctaLoading={loading === p.id}
              />
            ))}
          </motion.div>

          {/* FAQ */}
          <motion.section className="mt-14 sm:mt-16 lg:mt-20" variants={container} {...inViewAnim}>
            <motion.h2 className="text-center text-xl sm:text-2xl font-bold text-gray-800" variants={fade}>
              자주 묻는 질문
            </motion.h2>
            <motion.div className="mx-auto mt-6 max-w-3xl space-y-4" variants={container}>
              <FaqItem q="플랜을 언제라도 변경할 수 있나요?" a="네, 언제든지 계정 설정에서 플랜을 변경하거나 취소할 수 있습니다." />
              <FaqItem q="결제 방식은 어떻게 되나요?" a="30일 단위로 자동 갱신되는 월간 결제입니다." />
            </motion.div>
          </motion.section>
        </motion.div>
      </section>
    </main>
  );
};

export default PricingPage;
