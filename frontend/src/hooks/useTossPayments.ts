import { useState, useEffect, useRef } from "react";
import type { TossPaymentsInstance, BillingAuthOptions } from "../types/toss-payments";

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;

// 타입 가드 함수들
//const isError = (error: unknown): error is Error => error instanceof Error;
//const hasMessage = (obj: unknown): obj is { message: unknown } => 
//  typeof obj === 'object' && obj !== null && 'message' in obj;
//const isString = (value: unknown): value is string => typeof value === 'string';

// 스크립트 요소의 타입 가드
const hasDataset = (script: unknown): script is { dataset?: { loaded: string } } => 
  typeof script === 'object' && script !== null && 'dataset' in script;

const hasReadyState = (script: unknown): script is { readyState: string } => 
  typeof script === 'object' && script !== null && 'readyState' in script;

export const useTossPayments = () => {
  const [sdkReady, setSdkReady] = useState(false);
  const tossRef = useRef<TossPaymentsInstance | null>(null);

  /** Toss SDK 동적 로드 (안정화 버전) */
  useEffect(() => {
    const id = "tosspayments-sdk";
    let cancelled = false;

    const boot = () => {
      if (cancelled) return;
      if (window.TossPayments && CLIENT_KEY) {
        try {
          tossRef.current = window.TossPayments(CLIENT_KEY);
          setSdkReady(true);
        } catch (e) {
          console.error("[Toss boot error]", e);
          setSdkReady(false);
        }
      }
    };

    // 이미 전역에 주입된 경우 즉시 부팅
    if (window.TossPayments) {
      boot();
      return () => { cancelled = true; };
    }

    let script = document.getElementById(id) as HTMLScriptElement | null;
    const onLoad = () => {
      // data-loaded 플래그 기록(중복 이벤트 방지용)
      try { 
        script?.setAttribute("data-loaded", "1"); 
      } catch (error) {
        console.error('data-loaded 속성 설정 실패:', error);
      }
      boot();
    };
    const onError = () => {
      if (!cancelled) {
        console.error("[Toss SDK] failed to load");
        setSdkReady(false);
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.src = "https://js.tosspayments.com/v1";
      script.async = true;
      script.addEventListener("load", onLoad);
      script.addEventListener("error", onError);
      document.body.appendChild(script);
    } else {
      // 스크립트 태그가 이미 있더라도 load 리스너를 반드시 건다
      script.addEventListener("load", onLoad);
      script.addEventListener("error", onError);
      // 이미 로드 완료 상태라면 즉시 부팅
      const ready = (hasDataset(script) && script.dataset?.loaded === "1") || 
                   (hasReadyState(script) && script.readyState === "complete");
      if (ready) onLoad();
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", onLoad);
      script?.removeEventListener("error", onError);
    };
  }, []);

  /** 정기결제(빌링) 등록 */
  const startBillingEnroll = async (planId: string, amount: number, orderName: string) => {
    console.log('[useTossPayments] startBillingEnroll 시작:', { planId, amount, orderName, sdkReady });
    
    // sdkReady 보조 가드 (버튼 disabled와 별개로 안전망)
    if (!sdkReady || !window.TossPayments || !CLIENT_KEY) {
      const error = "결제 준비중입니다. 잠시 후 다시 시도해 주세요.";
      console.error('[useTossPayments] SDK 준비 안됨:', { sdkReady, hasTossPayments: !!window.TossPayments, hasClientKey: !!CLIENT_KEY });
      throw new Error(error);
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) { 
        const error = "로그인 후 이용 가능한 서비스입니다.";
        console.error('[useTossPayments] 토큰 없음');
        throw new Error(error);
      }

      if (!tossRef.current) tossRef.current = window.TossPayments(CLIENT_KEY);

      // TODO: 실제 서비스에서는 사용자 고유 식별자를 사용하세요.
      const customerKey = `user_${Date.now()}`;

      console.log('[useTossPayments] API 호출 시작:', { customerKey, plan: planId.toUpperCase(), amount, orderName });
      
      const sRes = await fetch("/api/payments/toss/billing/start", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ customer_key: customerKey, plan: planId.toUpperCase(), amount, orderName }),
      });

      if (!sRes.ok) {
        const errorText = await sRes.text();
        const error = `billing/start ${sRes.status}: ${errorText}`;
        console.error('[useTossPayments] API 응답 오류:', { status: sRes.status, errorText });
        throw new Error(error);
      }
      
      const s = await sRes.json();
      if (!s?.ok) {
        const error = "billing/start payload not ok";
        console.error('[useTossPayments] API 응답 데이터 오류:', s);
        throw new Error(error);
      }

      console.log('[useTossPayments] API 응답 성공:', s);

      const orderId = `SUBS_${customerKey}_${Date.now()}`;
      console.log('[useTossPayments] Toss 결제 요청:', { customerKey, orderId, successUrl: s.successUrl, failUrl: s.failUrl });
      
      await tossRef.current!.requestBillingAuth("CARD", {
        customerKey,
        orderId,
        successUrl: s.successUrl,
        failUrl: s.failUrl,
      } satisfies BillingAuthOptions);
      
      console.log('[useTossPayments] Toss 결제 요청 완료');
    } catch (e: unknown) {
      console.group("[useTossPayments] Billing Enroll Error");
      console.error('정기결제 등록 실패:', e);
      try { 
        console.error("as json:", JSON.stringify(e)); 
      } catch (jsonError) {
        console.error('JSON 변환 실패:', jsonError);
      }
      console.groupEnd();
      
      // 에러를 다시 throw하여 상위 컴포넌트에서 처리할 수 있도록 함
      if (e instanceof Error) {
        throw e;
      } else if (typeof e === 'string') {
        throw new Error(e);
      } else {
        throw new Error('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return {
    sdkReady,
    startBillingEnroll
  };
};
