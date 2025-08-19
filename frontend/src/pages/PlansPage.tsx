import { useEffect, useRef, useState } from "react";
import PageLayout from "../components/common/PageLayout";
import Button from "../components/common/Button";

type PlanKey = "FREE" | "BASIC" | "PRO";

const PLANS: Record<PlanKey, { amount: number; orderName: string; disabled?: boolean }> = {
  FREE:  { amount: 0,     orderName: "Free Plan (monthly)",  disabled: true },
  BASIC: { amount: 9900,     orderName: "Basic Plan (monthly)" },   // ← 데모 1원
  PRO:   { amount: 19900, orderName: "Pro Plan (monthly)" },
};

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      requestPayment: (method: string, opts: any) => Promise<void>;
      requestBillingAuth?: (opts: any) => Promise<void>;
    };
  }
}

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;


const PlansPage = () => {
  const [loading, setLoading] = useState<PlanKey | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const tossRef = useRef<ReturnType<NonNullable<typeof window.TossPayments>> | null>(null);

// ✅ PlansPage 컴포넌트 안, 맨 위 useEffect 교체
useEffect(() => {
  // 1) 일반 쿼리 먼저
  let rawQuery = window.location.search;

  // 2) HashRouter일 경우(#/plans?billing_enrolled=1) 해시에서 ? 뒤를 파싱
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

  // URL 정리 (search 또는 hash 모두 대응)
  const qs = sp.toString();

  if (window.location.hash.startsWith("#/")) {
    // HashRouter: #/plans?x=y 형태로 정리
    const [hashPath] = window.location.hash.split("?");
    const newHash = hashPath + (qs ? `?${qs}` : "");
    if (window.location.hash !== newHash) {
      window.history.replaceState({}, "", window.location.pathname + window.location.search + newHash);
    }
  } else {
    // BrowserRouter: /plans?x=y 형태로 정리
    const newUrl = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
    if (window.location.pathname + window.location.search + window.location.hash !== newUrl) {
      window.history.replaceState({}, "", newUrl);
      } 
    }
  }, []);


  // 1) SDK 동적 로드
  useEffect(() => {
    const id = "tosspayments-sdk";
    if (document.getElementById(id)) {
      if (window.TossPayments && CLIENT_KEY) {
        tossRef.current = window.TossPayments(CLIENT_KEY);
        setSdkReady(true);
      }
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://js.tosspayments.com/v1";
    s.async = true;
    s.onload = () => {
      if (window.TossPayments && CLIENT_KEY) {
        tossRef.current = window.TossPayments(CLIENT_KEY);
        setSdkReady(true);
      }
    };
    document.body.appendChild(s);
  }, []);

  // 정기결제(빌링) 등록
  const startBillingEnroll = async (plan: PlanKey) => {
    if (plan === "FREE") return;
    try {
      setLoading(plan);

      const customerKey = `user_${Date.now()}`; 
      const token = localStorage.getItem("access_token");

      // 서버에 구독 시작 알림(플랜/금액 기록 & success/fail URL 받기)
      const sRes = await fetch("/api/payments/toss/billing/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ customer_key: customerKey, plan, amount: PLANS[plan].amount }),
      });
      if (!sRes.ok) throw new Error(`billing/start ${sRes.status}: ${await sRes.text()}`);
      const s = await sRes.json();
      if (!s?.ok) throw new Error("billing/start payload not ok");

      if (!window.TossPayments || !CLIENT_KEY) throw new Error("Toss SDK/Key missing");
      if (!tossRef.current) tossRef.current = window.TossPayments(CLIENT_KEY);

    const orderId = `SUBS_${customerKey}_${Date.now()}`;
    await (tossRef.current as any).requestBillingAuth("CARD", {
      customerKey,
      orderId,
      successUrl: s.successUrl,
      failUrl: s.failUrl,
    });


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

  const Btn = ({
    plan,
    children,
    disabled,
    onClick,
  }: {
    plan: PlanKey;
    children: React.ReactNode;
    disabled?: boolean;
    onClick: () => void;
  }) => (
    <Button
      variant="primary"
      fullWidth
      className="mt-2"
      disabled={disabled || loading !== null || !sdkReady}
      onClick={onClick}
    >
      {loading === plan ? "진행중..." : children}
    </Button>
  );

  return (
    <PageLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 py-6 px-12 md:p-6 lg:p-12 lg:px-36 md:h-[calc(100vh-72px-132px)]">
        {/* Free */}
        <div className="p-6 rounded-2xl shadow-lg border flex flex-col h-full justify-center hover:scale-105 transition-all duration-300">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="text-3xl font-bold mt-2">₩0<span className="text-sm">/월</span></p>
          <div className="flex-1 my-4 lg:my-10 gap-y-2 flex flex-col">
            <p className="font-semibold">✔ 기능 A</p>
            <p className="font-semibold">✘ 기능 B</p>
            <p className="font-semibold">✘ 기능 C</p>
          </div>
          <Btn plan="FREE" disabled onClick={() => {}}>시작하기</Btn>
        </div>

        {/* Basic */}
        <div className="p-6 rounded-2xl shadow-lg border flex flex-col h-full justify-center hover:scale-105 transition-all duration-300">
          <h3 className="text-xl font-semibold">Basic</h3>
          <p className="text-3xl font-bold mt-2">₩9,900<span className="text-sm">/월</span></p>
          <div className="flex-1 my-4 lg:my-10 gap-y-2 flex flex-col">
            <p className="font-semibold">✔ 기능 A</p>
            <p className="font-semibold">✔ 기능 B</p>
            <p className="font-semibold">✘ 기능 C</p>
          </div>
          {/* 정기결제 등록 */}
          <Btn plan="BASIC" onClick={() => startBillingEnroll("BASIC")}>시작하기</Btn>
        </div>

        {/* Pro */}
        <div className="p-6 rounded-2xl shadow-lg border flex flex-col h-full justify-center hover:scale-105 transition-all duration-300">
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="text-3xl font-bold mt-2">₩19,900<span className="text-sm">/월</span></p>
          <div className="flex-1 my-4 lg:my-10 gap-y-2 flex flex-col">
            <p className="font-semibold">✔ 기능 A</p>
            <p className="font-semibold">✔ 기능 B</p>
            <p className="font-semibold">✔ 기능 C</p>
          </div>
          <Btn plan="PRO" onClick={() => startBillingEnroll("PRO")}>시작하기</Btn>
        </div>
      </div>
    </PageLayout>
  );
};

export default PlansPage;
