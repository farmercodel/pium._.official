import { useState } from 'react';
import type { FormEvent } from 'react';
import { uploadFiles } from '../api/upload';
import { toGenerateAdPayload } from '../types/SurveymapFormData';
import { api } from '../api/api';
import type { SurveyFormValues } from '../types/SurveymapFormData';

// url → object storage 상대경로(rel) 변환
const toRelFromUrl = (u: string) => {
  try {
    const url = new URL(u);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) parts.shift(); // 첫 파트(bucket) 제거
    return parts.join("/");
  } catch (error) {
    console.error('URL 파싱 실패:', error);
    return "";
  }
};

/** "09:00~18:00", "0900-1830" 등에서 첫 구간만 안전 추출 */
const extractFirstTimeRange = (s?: string) => {
  if (!s) return "";
  const m = s.replace(/\s/g, "").match(/(\d{1,2}:?\d{2}(?::\d{2})?)[~-](\d{1,2}:?\d{2}(?::\d{2})?)/);
  return m ? `${m[1]}-${m[2]}` : s;
};

export const useFormSubmission = (onSubmit?: (values: SurveyFormValues, files: File[]) => Promise<void> | void) => {
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>, selectedFiles: File[]) => {
    e.preventDefault();
    if (submitting) return;

    console.log('useFormSubmission 시작 - 선택된 파일 개수:', selectedFiles.length);

    if (selectedFiles.length === 0) {
      alert("이미지를 최소 1장 업로드해 주세요.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    const values: SurveyFormValues = {
      storeName: String(fd.get("storeName") || ""),
      regionKeyword: String(fd.get("regionKeyword") || ""),
      address: String(fd.get("address") || ""),
      priceRange: String(fd.get("priceRange") || ""),
      category: String(fd.get("category") || ""),
      hours: String(fd.get("hours") || ""),
      intro: String(fd.get("intro") || ""),
      refLink: String(fd.get("refLink") || ""),
      serviceKeywords: String(fd.get("serviceKeywords") || ""),
      target: String(fd.get("target") || ""),
      instagram: String(fd.get("instagram") || ""),
      promotion: String(fd.get("promotion") || ""),
    };

    console.log('폼 데이터 추출 완료:', values);

    const fileArr = selectedFiles;

    if (onSubmit) {
      try {
        await onSubmit(values, fileArr);
      } catch (error) {
        console.error('사용자 정의 onSubmit 실패:', error);
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert('폼 제출 중 오류가 발생했습니다.');
        }
      }
      return;
    }

    try {
      setSubmitting(true);
      console.log('기본 제출 로직 시작 - 파일 업로드 중...');

      // 1) 파일 사이즈 제한(10MB) 및 업로드
      const validFiles = fileArr.filter(f => f.size <= 10 * 1024 * 1024);
      if (validFiles.length < fileArr.length) {
        const excluded = fileArr
          .filter(f => f.size > 10 * 1024 * 1024)
          .map(f => f.name)
          .join(", ");
        alert(`10MB를 초과하는 파일은 제외하고 업로드합니다. 제외: ${excluded}`);
      }

      console.log('유효한 파일 개수:', validFiles.length);

      // 업로드 응답 정규화(배열/객체 모두 대응)
      let uploaded: unknown = { ok: true, files: [] };
      if (validFiles.length) {
        console.log('파일 업로드 API 호출 중...');
        uploaded = await uploadFiles(validFiles, "ads/images");
        console.log('파일 업로드 완료:', uploaded);
      }
      
      // 타입 가드를 통한 안전한 처리
      let filesArr: Array<{ rel?: string; key?: string; url?: string }> = [];
      if (Array.isArray(uploaded)) {
        filesArr = uploaded;
      } else if (typeof uploaded === 'object' && uploaded !== null && 'files' in uploaded) {
        const files = (uploaded as { files: unknown }).files;
        if (Array.isArray(files)) {
          filesArr = files;
        }
      }

      console.log('처리된 파일 배열:', filesArr);

      // (A) choose-publish용 image_keys(rel) 저장
      const imageKeys: string[] = filesArr
        .map(x => x?.rel ?? x?.key ?? (x?.url ? toRelFromUrl(String(x.url)) : ""))
        .map(String)
        .filter(Boolean);
      
      if (imageKeys.length) {
        try {
          sessionStorage.setItem("last_upload_image_keys", JSON.stringify(imageKeys));
          console.log('이미지 키 저장 완료:', imageKeys);
        } catch (error) {
          console.error('이미지 키 저장 실패:', error);
        }
      } else {
        console.warn("[upload] image rel/key 추출 실패. 응답 확인:", uploaded);
      }

      // 생성 API용 URL 배열 (toGenerateAdPayload는 string[] 기대)
      const uploadedUrls: string[] = filesArr
        .map(x => String(x?.url || ""))
        .filter(Boolean);

      console.log('업로드된 URL 배열:', uploadedUrls);

      // 2) 새 폼 → 레거시 키 매핑
      const legacyForm: Record<string, string> = {
        "가게명": values.storeName,
        "지역 위치/상권 키워드": values.regionKeyword,
        "가게 주소": values.address,
        "가격대": values.priceRange,
        "영업 시간 정보": extractFirstTimeRange(values.hours),
        "가게 업종": values.category,
        "가게 소개": values.intro,
        "참고 링크": values.refLink ?? "",
        "제공 제품/서비스 키워드": values.serviceKeywords ?? "",
        "타깃 고객": values.target ?? "",
        "가게 인스타그램 ID": (values.instagram || "").replace(/^@/, ""),
        "진행중인 프로모션": values.promotion ?? "",
      };

      console.log('레거시 폼 데이터:', legacyForm);

      // 3) 기존 변환 로직 사용 (URL 배열 전달)
      const payload = toGenerateAdPayload(legacyForm, uploadedUrls);
      console.log('생성 API 페이로드:', payload);

      // (B) 게시 컨텍스트 저장: store_name / area_keywords / instagram_id
      try {
        const publishCtx = {
          store_name: payload.store_name ?? values.storeName ?? "",
          area_keywords:
            payload.area_keywords ??
            (values.regionKeyword
              ? String(values.regionKeyword).split(/[,/|\s]+/).map(s => s.trim()).filter(Boolean)
              : []),
          instagram_id: (payload.instagram_id ?? values.instagram ?? "").replace(/^@/, ""),
        };
        sessionStorage.setItem("last_publish_context", JSON.stringify(publishCtx));
        console.log('게시 컨텍스트 저장 완료:', publishCtx);
      } catch (error) {
        console.error('게시 컨텍스트 저장 실패:', error);
      }

      sessionStorage.setItem("last_generate_payload", JSON.stringify(payload));

      // 4) 생성 API 호출
      console.log('생성 API 호출 중...');
      const { data } = await api.post("/api/generate", payload, { timeout: 60_000 });
      console.log('생성 API 응답:', data);

      sessionStorage.setItem("last_generate_result", JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error('폼 제출 실패:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('생성 실패');
      }
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    handleFormSubmit
  };
};
