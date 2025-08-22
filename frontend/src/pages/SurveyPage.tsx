import type { JSX } from "react";
import { useState } from "react";
import { motion } from "framer-motion";


import useNavigation from "../hooks/useNavigation";
import { useFileUpload } from "../hooks/useFileUpload";
import { useFormSubmission } from "../hooks/useFormSubmission";
import { useLiftInteractions, useAnimationProps, container, flyUp, fade, cardEnter } from "../hooks/useAnimation";
import AddressSelector from "../components/survey/AddressSelector";





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

export type SubmitFn = (values: SurveyFormValues, files: File[]) => Promise<void> | void;



export const SurveyPage = ({ onSubmit }: { onSubmit?: SubmitFn }): JSX.Element => {
  const interactions = useLiftInteractions();
  const { reduce, heroAnim, inViewAnim } = useAnimationProps();
  const { goToGeneration } = useNavigation();
  const [address, setAddress] = useState("");

  // 커스텀 훅 사용
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
        await onSubmit(values, selectedFiles);
      } else {
        // 기본 제출 로직
        const result = await handleFormSubmit(e, selectedFiles);
        if (result) {
          goToGeneration(result);
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
          <motion.section
            className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 sm:p-8"
            variants={cardEnter}
            {...heroAnim}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 grid place-items-center text-white text-sm font-bold shadow-md">1</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">기본 정보</h2>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <motion.div variants={fade}>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                  가게명 <span className="text-emerald-600">*</span>
                </label>
                <input
                  id="storeName"
                  name="storeName"
                  required
                  type="text"
                  placeholder="가게 이름을 입력하세요"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </motion.div>

              <motion.div variants={fade}>
                <label htmlFor="regionKeyword" className="block text-sm font-medium text-gray-700">
                  지역 키워드 <span className="text-emerald-600">*</span>
                </label>
                <input
                  id="regionKeyword"
                  name="regionKeyword"
                  required
                  type="text"
                  placeholder="예: 강남역, 홍대"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </motion.div>

              <motion.div className="md:col-span-2" variants={fade}>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  주소 <span className="text-emerald-600">*</span>
                </label>
                <AddressSelector
                  id="address"
                  name="address"
                  value={address}
                  onChange={(address) => setAddress(address)}
                  required={false}
                />
              </motion.div>

              <motion.div variants={fade}>
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
                  가격대 <span className="text-emerald-600">*</span>
                </label>
                <input
                  id="priceRange"
                  name="priceRange"
                  required
                  type="text"
                  placeholder="예: 저가 / 중가 / 고가 또는 1만원대"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </motion.div>

              <motion.div variants={fade}>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  업종 <span className="text-emerald-600">*</span>
                </label>
                <input
                  id="category"
                  name="category"
                  required
                  type="text"
                  placeholder="예: 음식점, 카페, 소매/리테일, 서비스"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </motion.div>

              <motion.div className="md:col-span-2" variants={fade}>
                <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                  영업 시간 <span className="text-emerald-600">*</span>
                </label>
                <input
                  id="hours"
                  name="hours"
                  required
                  type="text"
                  placeholder="예: 평일 09:00-22:00, 주말 10:00-23:00"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </motion.div>
            </div>
          </motion.section>

          {/* 가게 소개 */}
          <motion.section
            className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 sm:p-8"
            variants={cardEnter}
            {...inViewAnim}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 grid place-items-center text-white text-sm font-bold shadow-md">2</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">가게 소개</h2>
            </div>

            <div className="mt-6 space-y-6">
              <motion.div variants={fade}>
                <label htmlFor="intro" className="block text-sm font-medium text-gray-700">
                  가게 소개 <span className="text-emerald-600">*</span>
                </label>
                <textarea
                  id="intro"
                  name="intro"
                  required
                  rows={5}
                  placeholder="가게의 특징, 분위기, 추천 메뉴 등을 자유롭게 소개해주세요"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </motion.div>

              <motion.div variants={fade}>
                <label className="block text-sm font-medium text-gray-700">
                  이미지 업로드 <span className="text-emerald-600">*</span>
                </label>

                {/* 드롭존 + 클릭 업로드 */}
                <motion.label
                  htmlFor="images"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`mt-2 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer focus-within:border-emerald-300 ${
                    dropActive ? "border-emerald-300 bg-emerald-50" : "border-gray-300 hover:border-emerald-300"
                  }`}
                  animate={
                    reduce
                      ? {}
                      : dropActive
                      ? { scale: 1.01, boxShadow: "0 8px 24px rgba(16,185,129,0.25)" }
                      : { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }
                  }
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="text-gray-700 text-sm sm:text-base">클릭하거나 파일을 드래그해서 업로드</span>
                  <span className="text-gray-400 text-xs">JPG, PNG 파일 (파일당 최대 10MB)</span>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                  />
                </motion.label>

                {/* 선택된 파일 썸네일 + 삭제 */}
                <div className="mt-4" aria-live="polite">
                  {selectedFiles.length > 0 ? (
                    <>
                      <p className="mb-2 text-xs text-gray-600">
                        {selectedFiles.length}개 파일 선택됨
                      </p>

                      {/* 썸네일 그리드: container + item pop-in */}
                      <motion.ul
                        role="list"
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                        variants={container}
                        initial={reduce ? undefined : "hidden"}
                        animate={reduce ? undefined : "show"}
                      >
                        {selectedFiles.map((f, idx) => (
                          <motion.li
                            key={`${f.name}-${f.lastModified}`}
                            className="relative group"
                            variants={cardEnter}
                          >
                            <div className="aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                              {previews[idx] ? (
                                <img
                                  src={previews[idx]}
                                  alt={f.name}
                                  className="h-full w-full object-cover"
                                  draggable={false}
                                />
                              ) : (
                                <div className="h-full w-full grid place-items-center text-xs text-gray-400">미리보기</div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFileAt(idx)}
                              className="absolute top-1 right-1 inline-flex items-center justify-center rounded-full bg-black/60 text-white w-7 h-7 opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                              aria-label={`${f.name} 삭제`}
                              title="삭제"
                            >
                              ×
                            </button>
                            <div className="mt-1 text-[11px] text-gray-700 truncate" title={f.name}>{f.name}</div>
                            <div className="text-[10px] text-gray-500">{formatBytes(f.size)}</div>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">아직 선택된 파일이 없습니다.</p>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* 추가 정보 */}
          <motion.section
            className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 sm:p-8"
            variants={cardEnter}
            {...inViewAnim}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 grid place-items-center text-white text-sm font-bold shadow-md">3</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">추가 정보 (선택사항)</h2>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <motion.div className="md:col-span-2" variants={fade}>
                <label htmlFor="refLink" className="block text-sm font-medium text-gray-700">참고 링크</label>
                <input
                  id="refLink"
                  name="refLink"
                  type="url"
                  placeholder="홈페이지, 블로그 등의 링크"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </motion.div>

              <motion.div variants={fade}>
                <label htmlFor="serviceKeywords" className="block text-sm font-medium text-gray-700">서비스 키워드</label>
                <input
                  id="serviceKeywords"
                  name="serviceKeywords"
                  type="text"
                  placeholder="예: 와이파이, 주차가능, 반려동물"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </motion.div>

              <motion.div variants={fade}>
                <label htmlFor="target" className="block text-sm font-medium text-gray-700">타깃 고객</label>
                <input
                  id="target"
                  name="target"
                  type="text"
                  placeholder="예: 20-30대 직장인, 커플, 가족"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </motion.div>

              <motion.div variants={fade}>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">인스타그램 ID</label>
                <div className="mt-2 flex rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-emerald-300">
                  <span className="inline-flex items-center px-3 text-gray-500">@</span>
                  <input
                    id="instagram"
                    name="instagram"
                    type="text"
                    placeholder="instagram_id"
                    className="w-full rounded-r-xl bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </motion.div>

              <motion.div variants={fade}>
                <label htmlFor="promotion" className="block text-sm font-medium text-gray-700">프로모션</label>
                <input
                  id="promotion"
                  name="promotion"
                  type="text"
                  placeholder="예: 첫 방문 10% 할인, 생일 케이크 서비스"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </motion.div>
            </div>
          </motion.section>

          {/* CTA */}
          <div className="text-center">
            <motion.button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white text-sm sm:text-base lg:text-lg font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-70"
              {...interactions}
              animate={reduce ? {} : submitting ? { scale: 0.99 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {submitting ? "생성 중" : "가게 정보 등록하기"}
              <motion.svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="ml-1"
                animate={reduce ? {} : submitting ? { rotate: 360 } : { rotate: 0 }}
                transition={submitting ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
              >
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </motion.button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default SurveyPage;
