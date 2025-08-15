import type { UserFlowSectionProps } from "../../types/mainPageSection"
import { USER_FLOW_CONTENT } from "../../constants/mainConstant"

{/** 사용자 흐름 설명 (질문지 작성 -> 마케팅 생성 및 결과 확인 -> 인스타 게시) */ }
const UserFlowSection = ({ className }: UserFlowSectionProps) => {
    return (
        <section className={`relative w-full bg-white p-4 sm:p-6 lg:p-10 lg:px-35 shadow-lg ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {USER_FLOW_CONTENT.steps.map((step, idx) => (
                    <div key={idx} className="bg-white h-50 rounded-xl p-6 shadow-lg flex flex-col items-center justify-center gap-5">
                        <div className="text-2xl font-semibold mb-2">{step.title}</div>
                        <p className="text-gray-600 text-center">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default UserFlowSection