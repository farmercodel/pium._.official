import PageLayout from "../components/common/PageLayout"
import AuthFrame from "../components/auth/AuthFrame"

import Button from "../components/common/Button"

{/** 로그인 페이지 */}
const LoginPage = () => {
    return (
        <PageLayout>
            <AuthFrame>
                <p className="text-2xl font-bold mb-4">Login</p>
                <div className="flex flex-col gap-2 px-5">
                    <input type="text" placeholder="Email" className="w-full p-2 border-2 border-gray-300 rounded-md" />
                    <input type="password" placeholder="Password" className="w-full p-2 border-2 border-gray-300 rounded-md" />
                    <Button 
                        className="w-full"
                        onClick={() => {}}
                    >
                        Login
                    </Button>
                    <Button 
                        variant="custom"
                        className="w-full text-gray-500 border-1 border-gray-300 hover:text-gray-700 hover:bg-gray-200" 
                        onClick={() => {}}
                    >
                        Sign Up
                    </Button>
                </div>
            </AuthFrame>
        </PageLayout>
    )
}

export default LoginPage