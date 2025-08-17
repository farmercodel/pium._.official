import { useState, useEffect } from "react"
import PageLayout from "../components/common/PageLayout"
import InputSection from "../components/survey/InputSection"
import PreviewCardSection from "../components/survey/PreviewCardSection"

{/** 질문지 답변 입력 페이지 */}
const SurveyPage = () => {
    const [activeTab, setActiveTab] = useState<'input' | 'preview'>('input')
    
    // 모든 입력 데이터를 하나의 객체로 관리
    const [formData, setFormData] = useState<Record<string, string>>(() => {
        // 로컬 스토리지에서 기존 데이터 불러오기
        const saved = localStorage.getItem('surveyFormData')
        if (saved) {
            try {
                return JSON.parse(saved)
            } catch {
                return {}
            }
        }
        return {}
    })

    // 입력 데이터 변경 핸들러
    const handleInputChange = (title: string, value: string) => {
        setFormData(prev => {
            const newData = { ...prev, [title]: value }
            // 로컬 스토리지에 저장
            localStorage.setItem('surveyFormData', JSON.stringify(newData))
            return newData
        })
    }

    // 로컬 스토리지에 자동 저장
    useEffect(() => {
        localStorage.setItem('surveyFormData', JSON.stringify(formData))
    }, [formData])

    return (
        <PageLayout className="h-[calc(100vh-72px-132px)] overflow-hidden">
            {/* 모바일 탭 헤더 */}
            <div className="md:hidden flex border-b border-gray-200 bg-white sticky top-0 z-10">
                <button
                    onClick={() => setActiveTab('input')}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                        activeTab === 'input'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    질문지
                </button>
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                        activeTab === 'preview'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    프리뷰
                </button>
            </div>

            {/* 데스크톱 레이아웃 */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 w-[95%] lg:w-[80%] mx-auto h-full pt-4">
                <InputSection 
                    formData={formData}
                    onInputChange={handleInputChange}
                />
                <PreviewCardSection formData={formData} />
            </div>

            {/* 모바일 탭 콘텐츠 */}
            <div className="grid grid-cols-1 md:hidden w-[90%] mx-auto h-[calc(100vh-72px-132px-60px)] pt-4">
                {activeTab === 'input' ? (
                    <InputSection 
                        formData={formData}
                        onInputChange={handleInputChange}
                    />
                ) : (
                    <PreviewCardSection formData={formData} />
                )}
            </div>
        </PageLayout>
    )
}

export default SurveyPage