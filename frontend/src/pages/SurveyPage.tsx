// src/pages/SurveyPage.tsx
import { useState, useEffect, useRef } from "react"
import PageLayout from "../components/common/PageLayout"
import InputSection from "../components/survey/InputSection"
import PreviewCardSection from "../components/survey/PreviewCardSection"
import useNavigation from "../hooks/useNavigation"
import { toGenerateAdPayload } from "../types/SurveymapFormData"
import { api } from "../api/api"

const SurveyPage = () => {
  const [activeTab, setActiveTab] = useState<'input' | 'preview'>('input')
  const [formData, setFormData] = useState<Record<string, string>>({ "답변 톤": "Casual" })
  const [uploadedImageURLs, setUploadedImageURLs] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false) // 중복 클릭 방지(선택)

  const handleInputChange = (title: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [title]: value }
      localStorage.setItem('surveyFormData', JSON.stringify(newData))
      return newData
    })
  }

  const resetForm = () => {
    setFormData({ "답변 톤": "Casual" })
    setUploadedImageURLs([])
    localStorage.removeItem('surveyFormData')
  }

  useEffect(() => {
    localStorage.setItem('surveyFormData', JSON.stringify(formData))
  }, [formData])

  const { goToGeneration } = useNavigation()

  const handleSubmit = async () => {
    if (submitting) return;
    try {
      setSubmitting(true)
      const payload = toGenerateAdPayload(formData, uploadedImageURLs)

      const { data } = await api.post("/api/generate", payload, { timeout:60000 })

      goToGeneration(data)
      
    } catch (e: any) {
      console.error(e)
      alert(`생성 실패: ${e?.message ?? e}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout className="h-[calc(100vh-72px-132px)] overflow-hidden">
      {/* ...중략(탭 헤더 동일) */}

      {/* 데스크톱 */}
      <div className="hidden md:grid md:grid-cols-5 gap-6 w-[95%] lg:w-[80%] mx-auto h-full pt-4">
        <InputSection
          formData={formData}
          onInputChange={handleInputChange}
          onImagesUploaded={setUploadedImageURLs}
          uploadedImageURLs={uploadedImageURLs}
        />
        <PreviewCardSection
          formData={formData}
          onReset={resetForm}
          onSubmit={handleSubmit}
          uploadedImageURLs={uploadedImageURLs}
        />
      </div>

      {/* 모바일 */}
      <div className="grid grid-cols-1 md:hidden w-[90%] mx-auto h-[calc(100vh-72px-132px-60px)] pt-4">
        {activeTab === 'input' ? (
          <InputSection
            formData={formData}
            onInputChange={handleInputChange}
            onImagesUploaded={setUploadedImageURLs}
            uploadedImageURLs={uploadedImageURLs}
          />
        ) : (
          <PreviewCardSection
            formData={formData}
            onReset={resetForm}
            onSubmit={handleSubmit}
            uploadedImageURLs={uploadedImageURLs}
          />
        )}
      </div>
    </PageLayout>
  )
}

export default SurveyPage
