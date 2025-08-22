import { motion } from "framer-motion";
import { fade, cardEnter } from "../../hooks/useAnimation";

interface AdditionalInfoSectionProps {
  inViewAnim: unknown;
}

export const AdditionalInfoSection = ({ inViewAnim }: AdditionalInfoSectionProps) => {
  // 타입 가드를 통한 안전한 inViewAnim 처리
  const safeInViewAnim = typeof inViewAnim === 'object' && inViewAnim !== null ? inViewAnim : {};

  return (
    <motion.section
      className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 sm:p-8"
      variants={cardEnter}
      {...safeInViewAnim}
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
  );
};
