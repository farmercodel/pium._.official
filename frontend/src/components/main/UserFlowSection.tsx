import type { UserFlowSectionProps } from "../../types/mainPageSection"

{/** 사용자 흐름 설명 (질문지 작성 -> 마케팅 생성 및 결과 확인 -> 인스타 게시) */}
const UserFlowSection = ({ className }: UserFlowSectionProps) => {
    return (
        <section className={`relative w-full bg-white p-4 sm:p-6 lg:p-10 lg:px-35 shadow-lg ${className}`}>
            <h2>UserFlowSection</h2>
        </section>
    )
}

export default UserFlowSection