// src/components/survey/InputSection.tsx
import InputBox from "../common/InputBox"
import ToneRadio from "../survey/ToneRadio"
import ImageUpload from "../survey/ImageUpload"
import { INPUT_SECTION_CONTENT } from "../../constants/surveyConstant"
import type { Tone } from "../../types/SurveyTypes"
import AddressSelector from "./AddressSelector"

interface InputSectionProps {
    formData: Record<string, string>
    onInputChange: (title: string, value: string) => void
    onImagesUploaded: (urls: string[]) => void
    uploadedImageURLs: string[]            // ✅ 추가: 현재 이미지 목록
}

const InputSection = ({ formData, onInputChange, onImagesUploaded, uploadedImageURLs }: InputSectionProps) => {
    const renderItem = (item: { title: string; placeholder: string; required: boolean }) => {
        if (item.title === "답변 톤") {
            return (
                <ToneRadio
                    key={item.title}
                    value={(formData["답변 톤"] as Tone) || "Casual"}
                    onChange={(v) => onInputChange("답변 톤", v)}
                    required={item.required}
                />
            )
        }

        if (item.title === "이미지 URL(들)" || item.title === "이미지 파일") {
            return (
                <div key={item.title} className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">
                        {item.title}
                        {item.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <ImageUpload
                        value={uploadedImageURLs}
                        onUploaded={(urls) => {
                            onImagesUploaded(urls)
                            onInputChange(item.title, urls.join("\n"))
                        }}
                        subdir="ads/images"
                        maxCount={10}
                    />
                </div>
            )
        }

        if (item.title === "가게 주소") {
            return (
                <div key={item.title} className="flex flex-col gap-2">
                  <label className="text-sm text-gray-700">
                    {item.title}
                    {item.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <AddressSelector
                    value={formData[item.title] || ""}
                    onChange={(value) => onInputChange(item.title, value)}
                    required={item.required}
                  />
                </div>
              )
        }


        return (
            <InputBox
                key={item.title}
                placeholder={item.placeholder}
                title={item.title}
                required={item.required}
                value={formData[item.title] || ""}
                onChange={(value) => onInputChange(item.title, value)}
            />
        )
    }

    return (
        <div className="col-span-1 md:col-span-3 p-6 w-full gap-2 flex flex-col overflow-y-auto">
            <p className="text-sm text-gray-500">
                <span className="text-red-500">*</span> 표시는 필수 항목입니다.
            </p>
            {INPUT_SECTION_CONTENT.filter(i => i.required).map(renderItem)}
            <div className="border-b border-b-3 border-gray-300 w-full my-4" />
            {INPUT_SECTION_CONTENT.filter(i => !i.required).map(renderItem)}
        </div>
    )
}

export default InputSection
