// src/pages/SignUpPage.tsx
import { useState } from "react";
import AuthFrame from "../components/auth/AuthFrame";
import PageLayout from "../components/common/PageLayout";
import useNavigation from "../hooks/useNavigation";
import Button from "../components/common/Button";
import { signup, login } from "../api/auth";
import { useScrollToTop } from "../hooks/useScrollToTop";

const toYMD = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" />
    <path d="M4 7l8 6 8-6" stroke="currentCol🌱or" strokeWidth="2" />
  </svg>
);
const IconReg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const IconStore = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 10l1.2-5A2 2 0 016.16 3h11.68A2 2 0 0120.8 5l1.2 5" stroke="currentColor" strokeWidth="2" />
    <path d="M4 10h16v8a3 3 0 01-3 3H7a3 3 0 01-3-3v-8z" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const SignUpPage = () => {
  const { goToMain, goToLogin } = useNavigation();
  
  // 페이지 이동 시 스크롤을 맨 위로
  useScrollToTop();

  const [email, setEmail] = useState("");
  const [pNm, setPNm] = useState(""); // p_nm
  const [brn, setBrn] = useState(""); // business_registration_number
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleLoginClick = () => {
    goToLogin();
  };

  const handleSignUp = async () => {
    setErr(null);
    if (!email || !password) return setErr("이메일/비밀번호를 입력하세요.");
    if (password !== password2) return setErr("비밀번호가 일치하지 않습니다.");
    if (!brn || !pNm) return setErr("사업자정보를 모두 입력하세요.");

    try {
      setLoading(true);
      await signup({
        email,
        password,
        business_registration_number: brn,
        p_nm: pNm,
        start_dt: toYMD(),
      });
      await login({ email, password });
      goToMain?.();
    } catch (e: unknown) {
      if (e && typeof e === "object" && "response" in e) {
        const apiError = e as { response?: { data?: { detail?: string } } };
        const errorMessage = apiError.response?.data?.detail;
        if (typeof errorMessage === "string") {
          setErr(errorMessage);
        } else {
          setErr("회원가입 실패");
        }
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
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">회원가입</p>
          <div className="mt-1 h-1 w-10 mx-auto rounded-full bg-emerald-200" />
        </div>

        {/* Card Form */}
        <form
          className="w-full max-w-md mx-auto rounded-2xl bg-white p-5 sm:p-6 shadow-[0_10px_20px_rgba(0,0,0,0.06)] border border-gray-100"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
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
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          {/* BRN */}
          <label className="block mt-3">
            <span className="sr-only">사업자등록번호</span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-gray-400">
                <IconReg />
              </span>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="00-00-00000"
                value={brn}
                onChange={(e) => setBrn(e.target.value)}
              />
            </div>
          </label>

          {/* Store name */}
          <label className="block mt-3">
            <span className="sr-only">가게명</span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-gray-400">
                <IconStore />
              </span>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="가게 이름을 입력하세요"
                value={pNm}
                onChange={(e) => setPNm(e.target.value)}
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
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>

          {/* Password Confirm */}
          <label className="block mt-3">
            <span className="sr-only">비밀번호 확인</span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-gray-400">
                <IconLock />
              </span>
              <input
                type="password"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="비밀번호를 다시 입력하세요"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
          </label>

          {/* Error */}
          {err && <div className="mt-3 text-red-500 text-sm">{err}</div>}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
          >
            {loading ? "가입 중..." : "회원가입"}
          </Button>
        </form>

        {/* Footer below card */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <div>
          이미 계정이 있으신가요?{' '}
          {/* <a href="/login" className="font-medium text-emerald-700 hover:underline">로그인</a> */}
          <span onClick={() => handleLoginClick()} className="font-medium text-emerald-700 hover:underline cursor-pointer">로그인</span>
          </div>
          <div className="mt-4 text-xs text-gray-400">© {new Date().getFullYear()} 피움</div>
        </div>
      </AuthFrame>
    </PageLayout>
  );
};

export default SignUpPage;