// import { PREVIEW_CARD_SECTION_CONTENT } from "../../constants/surveyConstant"
import Button from "../common/Button"

interface PreviewCardSectionProps {
    formData: Record<string, string>
}

const PreviewCardSection = ({ formData }: PreviewCardSectionProps) => {
    // 필수 항목이 모두 입력되었는지 확인
    const requiredFields = ['가게명', '지역 위치/상권 키워드', '가게 주소', '가격대', '영업 시간 정보', '가게 업종', '가격 소개', '답변 톤', '이미지 파일']
    const isFormComplete = requiredFields.every(field => formData[field] && formData[field].trim() !== '')

    return (
        <div className="col-span-1 md:col-span-2 p-6 bg-white border border-gray-200 rounded-lg w-full h-full flex flex-col overflow-y-auto">
            {/* 상단: 프리뷰 영역 */}
            <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Preview</h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200 min-h-[300px] overflow-y-auto">
                    {Object.keys(formData).length > 0 ? (
                        <div className="space-y-3">
                            {Object.entries(formData).map(([title, value]) => (
                                value && (
                                    <div key={title} className="border-b border-gray-100 pb-2">
                                        <p className="text-sm font-medium text-gray-700">{title}</p>
                                        <p className="text-sm text-gray-600">{value}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">입력된 데이터가 없습니다</p>
                    )}
                </div>
            </div>

            {/* 하단: 완료 버튼 영역 */}
            <div className="flex flex-col gap-3">
                <Button 
                    variant="primary"
                    fullWidth={true}
                    disabled={!isFormComplete}
                >
                    완료
                </Button>
                <p className="text-xs text-gray-500 text-center">
                    {isFormComplete 
                        ? '모든 필수 항목이 입력되었습니다!' 
                        : '모든 필수 항목을 입력한 후 완료 버튼을 눌러주세요'
                    }
                </p>
            </div>
        </div>
    )
}

export default PreviewCardSection