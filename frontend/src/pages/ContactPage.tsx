import type { JSX } from "react";
import { useState } from "react";
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
  const [files, setFiles] = useState<File[]>([]); // 여러 파일 상태
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { heroAnim } = useAnimationProps();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("message", message);
      files.forEach((file) => formData.append("files", file)); // 파일 여러 개 추가

      await api.post("/contact", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccess(true);
      setName(""); setMessage(""); setFiles([]);
    } catch (err) {
      console.error(err);
      alert("문의 전송 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-sans">
      <section className="relative w-full bg-[#F9FAEA]">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12"
          variants={container}
          {...heroAnim}
        >
          <div className="text-center">
            <motion.h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900"
              variants={flyUp}
            >
              문의하기
            </motion.h1>
            <motion.p
              className="mt-2 text-sm sm:text-base text-gray-600"
              variants={fade}
            >
              서비스 사용 중 어려움 혹은 문제가 발생했다면 문의해 주세요.
            </motion.p>
          </div>
        </motion.div>
      </section>
      <br />

      <section className="max-w-3xl mx-auto p-6">
        {success && <p className="text-green-600 mb-4">문의가 성공적으로 전송되었습니다!</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border px-3 py-2 rounded"
          />
          <textarea
            placeholder="문의 내용"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="border px-3 py-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[linear-gradient(90deg,#cfe89b_0%,#8fd77e_52%,#19c6d3_100%)] text-white py-2 rounded hover:bg-emerald-700"
          >
            {loading ? "전송 중..." : "문의 보내기"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ContactPage;
