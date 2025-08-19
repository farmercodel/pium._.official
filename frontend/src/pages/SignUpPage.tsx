// src/pages/SignUpPage.tsx
import { useState } from "react";
import AuthFrame from "../components/auth/AuthFrame";
import PageLayout from "../components/common/PageLayout";
import useNavigation from "../hooks/useNavigation";
import Button from "../components/common/Button";
import { signup, login } from "../api/auth";

const toYMD = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

const SignUpPage = () => {
    const { goToMain } = useNavigation();

    const [email, setEmail] = useState("");
    const [pNm, setPNm] = useState("");      // p_nm
    const [brn, setBrn] = useState("");      // business_registration_number
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

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
            if (e && typeof e === 'object' && 'response' in e) {
                const apiError = e as { response?: { data?: { detail?: string } } };
                setErr(apiError.response?.data?.detail ?? "회원가입 실패");
            } else {
                setErr("회원가입 실패");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <AuthFrame onBackToMain={() => goToMain?.()}>
                <p className="text-2xl font-bold mb-4">
                    Sign up to <span className="text-green-500">PIUM</span>
                </p>

                <div className="flex flex-col gap-2 w-full px-5 pt-3 pb-2 md:px-7 md:px-4 md:pb-3">
                    <input className="w-full p-2 px-4 border-2 border-gray-300 rounded-md"
                        placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input className="w-full p-2 px-4 border-2 border-gray-300 rounded-md"
                        placeholder="사업자등록번호" value={brn} onChange={e => setBrn(e.target.value)} />
                    <input className="w-full p-2 px-4 border-2 border-gray-300 rounded-md"
                        placeholder="가게명" value={pNm} onChange={e => setPNm(e.target.value)} />
                    {/* ⬇ 날짜 인풋 제거 */}
                    <input className="w-full p-2 px-4 border-2 border-gray-300 rounded-md"
                        type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    <input className="w-full p-2 px-4 border-2 border-gray-300 rounded-md"
                        type="password" placeholder="Password Confirm" value={password2} onChange={e => setPassword2(e.target.value)} />

                    {err && <div className="text-red-500 text-sm">{err}</div>}

                    <Button className="w-full" onClick={handleSignUp} disabled={loading}>
                        {loading ? "가입 중..." : "Sign Up"}
                    </Button>
                </div>
            </AuthFrame>
        </PageLayout>
    );
};

export default SignUpPage;
