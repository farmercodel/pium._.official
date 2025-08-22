import type { JSX } from "react";
import { useState } from "react";
import { motion } from "framer-motion";

import useNavigation from "../hooks/useNavigation";
import { useFileUpload } from "../hooks/useFileUpload";
import { useFormSubmission } from "../hooks/useFormSubmission";
import { 
  useLiftInteractions, 
  useAnimationProps, 
  container, 
  flyUp, 
  fade
} from "../hooks/useAnimation";
import { BasicInfoSection } from "../components/survey/BasicInfoSection";
import { StoreIntroSection } from "../components/survey/StoreIntroSection";
import { AdditionalInfoSection } from "../components/survey/AdditionalInfoSection";
import { SubmitButton } from "../components/survey/SubmitButton";
import type { SurveyFormValues } from "../types/SurveymapFormData";

export type SubmitFn = (values: SurveyFormValues, files: File[]) => Promise<void> | void;

export const SurveyPage = ({ onSubmit }: { onSubmit?: SubmitFn }): JSX.Element => {
  const interactions = useLiftInteractions();
  const { reduce, heroAnim, inViewAnim } = useAnimationProps();
  const { goToGeneration } = useNavigation();
  const [address, setAddress] = useState("");

  // 파일 업로드 훅 사용
  const {
    selectedFiles,
    previews,
    dropActive,
    formatBytes,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeFileAt,
  } = useFileUpload();

  const { submitting, handleFormSubmit } = useFormSubmission(onSubmit);

  // 폼 제출 핸들러
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      if (onSubmit) {
        // 사용자 정의 onSubmit이 있는 경우
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
        
        console.log('사용자 정의 onSubmit 호출 - 폼 데이터:', values);
        console.log('선택된 파일 개수:', selectedFiles.length);
        
        await onSubmit(values, selectedFiles);
      } else {
        // 기본 제출 로직 (API 호출 후 결과 페이지로 이동)
        console.log('기본 폼 제출 로직 실행 - 파일 개수:', selectedFiles.length);
        
        // 폼 데이터 미리 확인
        const form = e.currentTarget;
        const fd = new FormData(form);
        console.log('폼 데이터 확인:');
        console.log('- storeName:', fd.get("storeName"));
        console.log('- regionKeyword:', fd.get("regionKeyword"));
        console.log('- address:', fd.get("address"));
        console.log('- priceRange:', fd.get("priceRange"));
        console.log('- category:', fd.get("category"));
        console.log('- hours:', fd.get("hours"));
        console.log('- intro:', fd.get("intro"));
        console.log('- refLink:', fd.get("refLink"));
        console.log('- serviceKeywords:', fd.get("serviceKeywords"));
        console.log('- target:', fd.get("target"));
        console.log('- instagram:', fd.get("instagram"));
        console.log('- promotion:', fd.get("promotion"));
        
        const result = await handleFormSubmit(e, selectedFiles);
        if (result) {
          console.log('폼 제출 성공, 결과 페이지로 이동:', result);
          goToGeneration(result);
        } else {
          console.warn('폼 제출 결과가 없습니다.');
        }
      }
    } catch (error) {
      console.error('폼 제출 실패:', error);
      // 에러는 이미 handleFormSubmit에서 처리됨
    }
  };

  return (
    <main className="font-sans">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* 헤더: fly-up + stagger */}
        <motion.header className="text-center" variants={container} {...heroAnim}>
          <motion.h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900" variants={flyUp}>
            가게 정보 등록
          </motion.h1>
          <motion.p className="mt-3 text-gray-600 text-sm sm:text-base" variants={fade}>
            AI 홍보 콘텐츠 생성을 위해 기본 정보를 입력해 주세요.
          </motion.p>
        </motion.header>

        <form className="mt-10 space-y-10" onSubmit={onSubmitHandler}>
          {/* 기본 정보 */}
          <BasicInfoSection 
            address={address}
            setAddress={setAddress}
            heroAnim={heroAnim}
          />

          {/* 가게 소개 */}
          <StoreIntroSection 
            inViewAnim={inViewAnim}
            reduce={reduce ?? false}
            selectedFiles={selectedFiles}
            previews={previews}
            dropActive={dropActive}
            formatBytes={formatBytes}
            handleFileChange={handleFileChange}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            removeFileAt={removeFileAt}
          />

          {/* 추가 정보 */}
          <AdditionalInfoSection 
            inViewAnim={inViewAnim}
          />

          {/* CTA */}
          <SubmitButton 
            submitting={submitting}
            interactions={interactions}
            reduce={reduce ?? false}
          />
        </form>
      </section>
    </main>
  );
};

export default SurveyPage;
