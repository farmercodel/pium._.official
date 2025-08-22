import { useEffect } from "react";

export const useUrlParams = () => {
  /** URL 파라미터 처리 */
  useEffect(() => {
    let rawQuery = window.location.search;
    if (!rawQuery && window.location.hash.includes("?")) rawQuery = "?" + window.location.hash.split("?")[1];
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
      if (window.location.hash !== newHash) window.history.replaceState({}, "", window.location.pathname + window.location.search + newHash);
    } else {
      const newUrl = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
      if (window.location.pathname + window.location.search + window.location.hash !== newUrl) window.history.replaceState({}, "", newUrl);
    }
  }, []);
};
