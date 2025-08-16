import AuthFrame from "../components/auth/AuthFrame"
import PageLayout from "../components/common/PageLayout"
import useNavigation from "../hooks/useNavigation"
import Button from "../components/common/Button"

{/** 회원가입 페이지 */}
const SignUpPage = () => {

    const { goToMain } = useNavigation()
    const navigationMap = {
        'main': goToMain,
    }

    const handleItemClick = (itemName: string) => {
        const navigationFn = navigationMap[itemName as keyof typeof navigationMap]
        if (navigationFn) {
            navigationFn()
        } else {
            console.log("Unknown navigation item:", itemName)
        }
    }

    return (
        <PageLayout>
            <AuthFrame onBackToMain={() => handleItemClick('main')}>
                <p className="text-2xl font-bold mb-4">Sign up to <span className="text-green-500">PIUM</span></p>
                <div className="flex flex-col gap-2 w-full px-5 pt-3 pb-2 md:px-7 md:px-4 md:pb-3">
                    <input type="text" placeholder="Email" className="w-full p-2 px-4 border-2 border-gray-300 rounded-md" />
                    <input type="text" placeholder="Name" className="w-full p-2 px-4 border-2 border-gray-300 rounded-md" />
                    <input type="password" placeholder="Password" className="w-full p-2 px-4 border-2 border-gray-300 rounded-md" />
                    <input type="password" placeholder="Password Confirm" className="w-full p-2 px-4 border-2 border-gray-300 rounded-md" />
                    <Button
                        className="w-full"
                        onClick={() => {}}
                    >Sign Up</Button>
                </div>
            </AuthFrame>
        </PageLayout>
    )
}

export default SignUpPage