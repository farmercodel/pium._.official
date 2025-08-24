import type { JSX } from "react";
import { useState, useRef, useEffect } from "react";
import { api } from "../api/api"; // axios 인스턴스
import { motion } from "framer-motion";
import { 
  useAnimationProps, 
  container, 
  flyUp, 
  fade
} from "../hooks/useAnimation";

export const ContactPage = (): JSX.Element => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { heroAnim } = useAnimationProps();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("message", message);
      files.forEach((file) => formData.append("files", file));

      await api.post("/contact", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccess(true);
      setName("");
      setMessage("");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("문의 전송 실패");
    } finally {
      setLoading(false);
    }
  };

  // 성공 메시지 3초 뒤 사라지게
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <main className="font-sans min-h-screen">
      {/* 배너 영역 */}
      <section className="w-full py-16 bg-[#F9FAEA]">
        <motion.div
          className="mx-auto max-w-3xl px-6 text-center"
          variants={container}
          {...heroAnim}
        >
          <motion.h1
            className="text-3xl sm:text-4xl font-extrabold text-gray-900"
            variants={flyUp}
          >
            문의하기
          </motion.h1>
          <motion.p
            className="mt-2 text-base sm:text-lg text-gray-700"
            variants={fade}
          >
            서비스 사용 중 어려움이나 문의사항을 보내주세요.
          </motion.p>
        </motion.div>
      </section>

      {/* 폼 영역 */}
      <section className="relative w-full py-10">
        <motion.div className="mx-auto max-w-3xl px-6" variants={container} {...heroAnim}>
          <div className="bg-white p-6 rounded-xl shadow-md border">
            {success && (
              <p className="text-green-600 mb-4">문의가 성공적으로 전송되었습니다!</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <textarea
                placeholder="문의 내용"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="border px-3 py-2 rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              {/* 버튼형 파일 선택 */}
              <div>
                <label
                  htmlFor="fileUpload"
                  className="bg-gradient-to-r from-[#cfe89b] via-[#8fd77e] to-[#19c6d3] text-white py-2 px-4 rounded cursor-pointer inline-block hover:opacity-90 transition"
                >
                  파일 선택
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="hidden"
                />
                {files.length > 0 && (
                  <p className="mt-2 text-sm text-gray-700">
                    {files.map((f) => f.name).join(", ")}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#cfe89b] via-[#8fd77e] to-[#19c6d3] text-white py-2 rounded hover:opacity-90 transition"
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
