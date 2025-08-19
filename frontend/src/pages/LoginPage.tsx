// src/pages/LoginPage.tsx
import { useState } from "react";
import PageLayout from "../components/common/PageLayout";
import AuthFrame from "../components/auth/AuthFrame";
import useNavigation from "../hooks/useNavigation";
import Button from "../components/common/Button";
import { login } from "../api/auth";

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
                setErr(e.message)
            } else if (typeof e === 'object' && e !== null && 'responese' in e) {
                const apiError = e as { response?: { data?: { detail?: string } } }
                setErr(apiError.response?.data?.detail ?? "로그인 실패")
            } else {
                setErr("알 수 없는 오류가 발생했습니다.")
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <AuthFrame onBackToMain={() => goToMain?.()}>
                <p className="text-2xl font-bold mb-4">
                    Login to <span className="text-green-500">PIUM</span>
                </p>

                <div className="flex flex-col gap-2 w-full px-5 pt-3 pb-2 md:px-7 md:px-4 md:pb-3">
                    <input
                        type="text"
                        placeholder="Email"
                        className="w-full p-2 px-4 border-2 border-gray-300 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 px-4 border-2 border-gray-300 rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {err && <div className="text-red-500 text-sm">{err}</div>}

                    <Button className="w-full" onClick={handleLogin} disabled={loading}>
                        {loading ? "로그인 중..." : "Login"}
                    </Button>

                    <Button
                        variant="custom"
                        className="w-full text-gray-500 border border-gray-300 hover:text-gray-700 hover:bg-gray-200"
                        onClick={() => goToSignUp?.()}
                    >
                        Sign Up
                    </Button>
                </div>
            </AuthFrame>
        </PageLayout>
    );
};

export default LoginPage;
