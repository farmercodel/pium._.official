import { PREVIEW_CARD_SECTION_CONTENT } from "../../constants/surveyConstant"

const PreviewCardSection = () => {
    return (
        <div className="hidden md:block md:col-span-2 p-6 bg-green-500 w-full h-full">
            {PREVIEW_CARD_SECTION_CONTENT.title}
        </div>
    )
}

export default PreviewCardSection