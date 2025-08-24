import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/api"; // axios 인스턴스
import { motion } from "framer-motion";
import { useAnimationProps, container, flyUp, fade } from "../hooks/useAnimation";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME = ["image/jpeg", "image/png"];
const ALLOWED_EXT = /\.(jpe?g|png)$/i;

type UploadedFile = {
  filename: string;
  content_type: string;
  size: number;
  url?: string | null;
  rel: string;
  backend: string;
};

export const ContactPage = (): JSX.Element => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dropActive, setDropActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { heroAnim } = useAnimationProps();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  useEffect(() => {
    const urls = files.map((f) => (f.type.startsWith("image/") ? URL.createObjectURL(f) : ""));
    setPreviews(urls);
    return () => {
      urls.forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, [files]);

  /** 파일 검증 + 누적 + 중복제거 + 타입필터(JPG/PNG만 허용) */
  const normalizeFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list);

    // 1) 타입 필터
    const disallowed = incoming.filter(
      (f) => !ALLOWED_MIME.includes(f.type) && !ALLOWED_EXT.test(f.name)
    );
    if (disallowed.length) {
      alert(
        `JPG 또는 PNG 형식만 업로드할 수 있어요.\n제외됨: ${disallowed
          .map((f) => f.name)
          .join(", ")}`
      );
    }
    const typeOk = incoming.filter(
      (f) => ALLOWED_MIME.includes(f.type) || ALLOWED_EXT.test(f.name)
    );

    // 2) 용량 필터
    const overSized = typeOk.filter((f) => f.size > MAX_FILE_SIZE);
    if (overSized.length) {
      alert(
        `파일당 최대 10MB만 업로드할 수 있어요.\n초과 파일: ${overSized
          .map((f) => f.name)
          .join(", ")}`
      );
    }
    const accepted = typeOk.filter((f) => f.size <= MAX_FILE_SIZE);

    // 3) 누적 + 중복 제거
    setFiles((prev) => {
      const merged = [...prev, ...accepted];
      const seen = new Set<string>();
      const deduped: File[] = [];
      for (const f of merged) {
        const key = `${f.name}_${f.size}_${f.lastModified}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(f);
        }
      }
      return deduped;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    normalizeFiles(e.target.files);
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDropActive(false);
    if (e.dataTransfer.files?.length) {
      normalizeFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDropActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDropActive(false);
  };
  const removeFileAt = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  /** 업로드 실패를 별도로 식별하기 위한 helper */
const explainAxiosError = (err: any, context: "upload" | "create") => {
  const res = err?.response;
  if (!res) return "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  const detail = typeof res.data?.detail === "string"
    ? res.data.detail
    : JSON.stringify(res.data?.detail ?? {});
  if (res.status === 401) return "로그인이 필요합니다.";
  if (res.status === 403) return "권한이 없습니다.";
  if (context === "upload") {
    if (res.status === 413) return "파일이 서버 제한 용량을 초과합니다.";
    if (res.status === 415) return "지원하지 않는 파일 형식입니다.";
    if (res.status >= 500) return `파일 저장 서버 오류: ${detail}`;
    return `파일 업로드 실패: ${detail}`;
  }
  if (res.status >= 500) return `서버 오류: ${detail}`;
  return `문의 저장 실패: ${detail}`;
};

  const uploadAll = async (): Promise<UploadedFile[]> => {
    if (files.length === 0) return [];
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await api.post<{ ok: boolean; files: UploadedFile[] }>(
      "/files/upload",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        params: { subdir: "inquiries" },
      }
    );
    if (!res.data?.ok) throw new Error("파일 업로드 실패");
    return res.data.files || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!message.trim() && files.length === 0) {
      alert("문의 내용 또는 파일을 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      // 1) 파일 업로드 (있을 경우)
      let uploaded: UploadedFile[] = [];
      try {
        uploaded = await uploadAll();
      } catch (err: any) {
        alert(explainAxiosError(err, "upload"));
        return; // 업로드 실패 시 문의 생성 중단
      }

      // 2) 업로드 결과를 본문 하단에 링크로 덧붙여 문의 생성
      let payload = message.trim();
      if (uploaded.length > 0) {
        const attachLines = uploaded.map((f) => {
          const urlPart = f.url ? f.url : `(presign key: ${f.rel})`;
          return `- ${urlPart} (${f.filename}, ${formatBytes(f.size)})`;
        });
        payload += `\n\n[첨부파일]\n${attachLines.join("\n")}`;
      }

      // 3) 문의 생성
      try {
        await api.post("/inquiries", { question: payload });
      } catch (err: any) {
        alert(explainAxiosError(err, "create"));
        return;
      }

      setSuccess(true);
      setMessage("");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [success]);

  return (
    <main className="font-sans min-h-screen">
      {/* 배너 */}
      <section className="w-full py-16 bg-[#F9FAEA]">
        <motion.div className="mx-auto max-w-3xl px-6 text-center" variants={container} {...heroAnim}>
          <motion.h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900" variants={flyUp}>
            문의하기
          </motion.h1>
          <motion.p className="mt-2 text-base sm:text-lg text-gray-700" variants={fade}>
            서비스 사용 중 어려움이나 문의사항을 보내주세요.
          </motion.p>
        </motion.div>
      </section>

      {/* 폼 */}
      <section className="relative w-full py-10">
        <motion.div className="mx-auto max-w-3xl px-6" variants={container} {...heroAnim}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {success && (
              <p className="text-emerald-600 mb-4" role="status" aria-live="polite">
                문의가 성공적으로 전송되었습니다!
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  문의 내용 <span className="text-emerald-600">*</span>
                </label>
                <textarea
                  id="message"
                  placeholder="문의 내용을 자세히 적어주세요."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="mt-2 w-full border border-gray-300 px-4 py-3 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                />
              </div>

              {/* 파일 드래그&드롭 존 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">이미지 업로드</label>

                <motion.label
                  htmlFor="fileUpload"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`mt-2 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition ${
                    dropActive ? "border-emerald-300 bg-emerald-50" : "border-gray-300 hover:border-emerald-300"
                  }`}
                  animate={
                    dropActive
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
                    id="fileUpload"
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </motion.label>

                {/* 선택된 파일 썸네일 */}
                <div className="mt-4" aria-live="polite">
                  {files.length > 0 ? (
                    <>
                      <p className="mb-2 text-xs text-gray-600">{files.length}개 파일 선택됨</p>
                      <motion.ul
                        role="list"
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                        variants={container}
                        initial="hidden"
                        animate="show"
                      >
                        {files.map((f, idx) => (
                          <motion.li key={`${f.name}-${f.lastModified}`} className="relative group" variants={fade}>
                            <div className="aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                              {previews[idx] ? (
                                <img src={previews[idx]} alt={f.name} className="h-full w-full object-cover" draggable={false} />
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
                            <div className="mt-1 text-[11px] text-gray-700 truncate" title={f.name}>
                              {f.name}
                            </div>
                            <div className="text-[10px] text-gray-500">{formatBytes(f.size)}</div>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">아직 선택된 파일이 없습니다.</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#cfe89b] via-[#8fd77e] to-[#19c6d3] text-white py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-70"
              >
                {loading ? "전송 중..." : "문의 보내기"}
              </button>
            </form>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default ContactPage;
