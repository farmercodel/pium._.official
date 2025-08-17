// import { PREVIEW_CARD_SECTION_CONTENT } from "../../constants/surveyConstant"
import Button from "../common/Button"

const PreviewCardSection = () => {
    return (
        <div className="row-span-2 md:row-span-5 md:col-span-2 lg:col-span-2 p-6 bg-white border border-gray-200 rounded-lg w-full h-full flex flex-col overflow-y-auto">
            {/* 상단: 프리뷰 영역 */}
            <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">프리뷰</h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200 min-h-[300px] flex items-center justify-center">
                    <p className="text-gray-500 text-center">여기에 프리뷰 내용이 표시됩니다</p>
                </div>
            </div>

            {/* 하단: 완료 버튼 영역 */}
            <div className="flex flex-col gap-3">
                <Button 
                    variant="primary"
                    fullWidth={true}
                >
                    완료
                </Button>
                <p className="text-xs text-gray-500 text-center">
                    모든 필수 항목을 입력한 후 완료 버튼을 눌러주세요
                </p>
            </div>
        </div>
    )
}

export default PreviewCardSection