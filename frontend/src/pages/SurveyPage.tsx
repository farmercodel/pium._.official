import PageLayout from "../components/common/PageLayout"
import InputSection from "../components/survey/InputSection"
import PreviewCardSection from "../components/survey/PreviewCardSection"

{/** 질문지 답변 입력 페이지 */}
const SurveyPage = () => {
    return (
        <PageLayout className="h-[calc(100vh-72px-132px)] overflow-hidden">
            <div className="grid grid-cols-5 gap-6 w-[80%] mx-auto h-full pt-4">
                <InputSection />
                <PreviewCardSection />
            </div>
        </PageLayout>
    )
}

export default SurveyPage