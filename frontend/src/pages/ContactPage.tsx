import type { JSX } from "react";
import { useState } from "react";
import { api } from "../api/api"; // axios 인스턴스

export const ContactPage = (): JSX.Element => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", { name, email, message });
      setSuccess(true);
      setName(""); setEmail(""); setMessage("");
    } catch (err) {
      console.error(err);
      alert("문의 전송 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">문의하기</h1>
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
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
        >
          {loading ? "전송 중..." : "문의 보내기"}
        </button>
      </form>
    </main>
  );
};

export default ContactPage;
