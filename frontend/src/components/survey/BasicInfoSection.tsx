import { motion } from "framer-motion";
import AddressSelector from "./AddressSelector";
import { fade, cardEnter } from "../../hooks/useAnimation";

interface BasicInfoSectionProps {
  address: string;
  setAddress: (address: string) => void;
  heroAnim: unknown;
}

export const BasicInfoSection = ({ address, setAddress, heroAnim }: BasicInfoSectionProps) => {
  // 타입 가드를 통한 안전한 heroAnim 처리
  const safeHeroAnim = typeof heroAnim === 'object' && heroAnim !== null ? heroAnim : {};

  return (
    <motion.section
      className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 sm:p-8"
      variants={cardEnter}
      {...safeHeroAnim}
    >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-[linear-gradient(to_bottom_right,_#cfe89b_0%,_#8fd77e_52%,_#19c6d3_100%)] grid place-items-center text-white text-sm font-bold shadow-md">1</div>
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
            placeholder="가게 이름을 입력하세요."
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
            placeholder="지역/상권명을 입력하세요. (ex) 강남역, 충주시 등"
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
            placeholder="가격대를 입력하세요."
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
            placeholder="업종을 입력하세요."
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
            placeholder="영업 시간을 입력하세요. (ex) 09:00~18:00"
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};
