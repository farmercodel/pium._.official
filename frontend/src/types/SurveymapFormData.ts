// src/types/SurveymapFormData.ts
import type { GenerateAdRequest, Tone } from "./SurveyTypes";

function toList(s?: string) {
  if (!s) return undefined;
  return s.split(/,|\n/).map(v => v.trim()).filter(Boolean);
}

// ✅ 어떤 입력이 와도 HH:MM:SS 로 정규화
function normTime(t?: string) {
  if (!t) return "09:00:00";
  // 09:00(:ss) 형태
  let m = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (m) {
    const hh = String(Math.min(23, Math.max(0, +m[1]))).padStart(2, "0");
    const mm = String(Math.min(59, Math.max(0, +m[2]))).padStart(2, "0");
    const ss = String(Math.min(59, Math.max(0, +(m[3] ?? "0")))).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  // 0900, 900 같은 HHMM
  m = t.match(/^(\d{1,2})(\d{2})$/);
  if (m) {
    const hh = String(Math.min(23, Math.max(0, +m[1]))).padStart(2, "0");
    const mm = String(Math.min(59, Math.max(0, +m[2]))).padStart(2, "0");
    return `${hh}:${mm}:00`;
  }
  // 9, 18 같은 HH
  m = t.match(/^(\d{1,2})$/);
  if (m) {
    const hh = String(Math.min(23, Math.max(0, +m[1]))).padStart(2, "0");
    return `${hh}:00:00`;
  }
  return "09:00:00";
}

// ✅ "09:00~18:00", "0900-1830" 등 지원
function parseTimeRange(s?: string) {
  if (!s) return { open: "09:00:00", close: "18:00:00" };
  const cleaned = s.replace(/\s/g, "");
  const m = cleaned.match(/([^~-]+)[~-]([^~-]+)/);
  const open = normTime(m?.[1]);
  const close = normTime(m?.[2]);
  return { open, close };
}

export function toGenerateAdPayload(
  formData: Record<string, string>,
  uploadedImageURLs: string[] = []
): GenerateAdRequest {
  const store_name = formData["가게명"] || "";
  const area_keywords = toList(formData["지역 위치/상권 키워드"]) ?? [];
  const address = formData["가게 주소"] || "";
  const price = formData["가격대"] || "";
  const business_hours = parseTimeRange(formData["영업 시간 정보"]);
  const category = formData["가게 업종"] || "";
  const store_intro = formData["가게 소개"] || formData["가격 소개"] || "";
  const tone = (formData["답변 톤"] as Tone) || "Casual";

  const image_urls = uploadedImageURLs.length ? uploadedImageURLs : toList(formData["이미지 파일"]);

  // ⬇ 옵션 필드들도 백엔드 스키마에 맞게 매핑(있는 값만 보냄)
  const reference_links = toList(formData["참고 링크"]);
  const product_service_keywords = toList(formData["제공 제품/서비스 키워드"]);
  const target_customers = toList(formData["타깃 고객"]);
  const instagram_id = formData["가게 인스타그램 ID"] || undefined;
  const promotions = toList(formData["진행중인 프로모션"]);

  const hashtagLabel = formData["해시태그 최대 개수"] ?? formData["해시태그 개수 상한"];
  const hashtag_limit = hashtagLabel ? Math.max(1, Math.min(30, Number(hashtagLabel))) : undefined;

  const nv = formData["생성 개수"];
  const num_variants = nv ? Math.max(1, Math.min(5, Number(nv))) : undefined;

  return {
    store_name,
    area_keywords,
    address,
    price,
    business_hours,
    category,
    store_intro,
    tone,
    image_urls,
    reference_links,
    product_service_keywords,
    target_customers,
    instagram_id,
    promotions,
    hashtag_limit,
    num_variants,
  };
}

/** 새 디자인 폼의 값 타입 */
export type SurveyFormValues = {
  storeName: string;
  regionKeyword: string;
  address: string;
  priceRange: string;
  category: string;
  hours: string;
  intro: string;
  refLink?: string;
  serviceKeywords?: string;
  target?: string;
  instagram?: string;
  promotion?: string;
};