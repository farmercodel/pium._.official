// src/pages/LoginPage.tsx
import { useState } from "react";
import PageLayout from "../components/common/PageLayout";
import AuthFrame from "../components/auth/AuthFrame";
import useNavigation from "../hooks/useNavigation";
import Button from "../components/common/Button";
import { login } from "../api/auth";

// --- inline icons (presentational only) ---
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" />
    <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const LoginPage = () => {
  const { goToMain, goToSignUp } = useNavigation();

  // 입력 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleLogin = async () => {
    setErr(null);
    if (!email || !password) return setErr("이메일과 비밀번호를 입력하세요.");
    try {
      setLoading(true);
      await login({ email, password });
      goToMain?.(); // 로그인 성공 → 메인으로
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr("아이디 혹은 비밀번호가 일치하지 않습니다.");
      } else if (typeof e === "object" && e !== null && "responese" in e) {
        const apiError = e as { response?: { data?: { detail?: string } } };
        setErr(apiError.response?.data?.detail ?? "로그인 실패");
      } else {
        setErr("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <AuthFrame onBackToMain={() => goToMain?.()}>
        {/* Title */}
        <div className="text-center mb-5">
          <div className="mx-auto grid h-9 w-9 place-items-center rounded-full"
               aria-hidden>
            <img src="/assets/logo.png"></img>
          </div>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">로그인</p>
          <div className="mt-1 h-1 w-10 mx-auto rounded-full bg-emerald-200" />
        </div>

        {/* Card Form */}
        <form
          className="w-full max-w-md mx-auto rounded-2xl bg-white p-5 sm:p-6 shadow-[0_10px_20px_rgba(0,0,0,0.06)] border border-gray-100"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* Email */}
          <label className="block">
            <span className="sr-only">이메일</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-gray-400">
                <IconMail />
              </span>
              <input
                type="text"
                placeholder="example@email.com"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          {/* Password */}
          <label className="block mt-3">
            <span className="sr-only">비밀번호</span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-gray-400">
                <IconLock />
              </span>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>

          {/* Error */}
          {err && <div className="mt-3 text-red-500 text-sm">{err}</div>}

          {/* Submit */}
          <Button
            type="submit"
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "Login"}
          </Button>

          {/* Sign up link style */}
          <Button
            variant="custom"
            className="mt-2 w-full rounded-xl bg-white text-emerald-700 ring-1 ring-gray-200 hover:ring-emerald-200 shadow-sm"
            onClick={() => goToSignUp?.()}
          >
            Sign Up
          </Button>
        </form>

        {/* Footer below card */}
        <div className="text-center mt-4 text-xs text-gray-400">© {new Date().getFullYear()} 피움</div>
      </AuthFrame>
    </PageLayout>
  );
};

export default LoginPage;
