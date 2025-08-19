import PageLayout from "../components/common/PageLayout"
import Button from "../components/common/Button"

{/** 구독 플랜 페이지 */ }
const PlansPage = () => {
    return (
        <PageLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 p-6 lg:p-12 h-[calc(100vh-72px-132px)]">
                {/* Plan Card */}
                <div className="p-6 rounded-2xl shadow-lg border flex flex-col h-full justify-center hover:scale-105 transition-all duration-300">
                    <h3 className="text-xl font-semibold">Free</h3>
                    <p className="text-3xl font-bold mt-2">₩0<span className="text-sm">/월</span></p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                        <li>✔ 기능 A</li>
                        <li>✘ 기능 B</li>
                        <li>✘ 기능 C</li>
                    </ul>
                    <Button
                        variant="primary"
                        fullWidth
                        className="mt-auto"
                    >
                        시작하기
                    </Button>
                </div>
                <div className="p-6 rounded-2xl shadow-lg border flex flex-col h-fulljustify-center hover:scale-105 transition-all duration-300">
                    <h3 className="text-xl font-semibold">Basic</h3>
                    <p className="text-3xl font-bold mt-2">₩9,900<span className="text-sm">/월</span></p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                        <li>✔ 기능 A</li>
                        <li>✔ 기능 B</li>
                        <li>✘ 기능 C</li>
                    </ul>
                    <Button
                        variant="primary"
                        fullWidth
                        className="mt-auto"
                    >
                        시작하기
                    </Button>
                </div>
                <div className="p-6 rounded-2xl shadow-lg border flex flex-col h-full justify-center hover:scale-105 transition-all duration-300">
                    <h3 className="text-xl font-semibold">Pro</h3>
                    <p className="text-3xl font-bold mt-2">₩19,900<span className="text-sm">/월</span></p>
                    <ul className="my-4 space-y-2 text-gray-600">
                        <li>✔ 기능 A</li>
                        <li>✔ 기능 B</li>
                        <li>✔ 기능 C</li>
                    </ul>
                    <Button
                        variant="primary"
                        fullWidth
                        className="mt-auto"
                    >
                        시작하기
                    </Button>
                </div>
            </div>
        </PageLayout>
    )
}

export default PlansPage