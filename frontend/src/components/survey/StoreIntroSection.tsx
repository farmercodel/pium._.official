import { motion } from "framer-motion";
import { fade, cardEnter, container } from "../../hooks/useAnimation";

interface StoreIntroSectionProps {
  reduce: boolean;
  selectedFiles: File[];
  previews: string[];
  dropActive: boolean;
  formatBytes: (bytes: number) => string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLLabelElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLLabelElement>) => void;
  removeFileAt: (idx: number) => void;
}

export const StoreIntroSection = ({ 
  reduce,
  selectedFiles,
  previews,
  dropActive,
  formatBytes,
  handleFileChange,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  removeFileAt
}: StoreIntroSectionProps) => {
  return (
    <motion.section
      className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 sm:p-8"
      variants={cardEnter}
      initial={reduce ? undefined : "hidden"}
      animate={reduce ? undefined : "show"}
      viewport={{ once: true, amount: 0.25 }}
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
  );
};
