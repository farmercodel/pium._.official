import InputBox from "../common/InputBox"
import { INPUT_SECTION_CONTENT } from "../../constants/surveyConstant"

const InputSection = () => {
    return (
        <div className="col-span-5 md:col-span-3 p-6 w-full gap-2 flex flex-col overflow-y-auto">
            <p className="text-sm text-gray-500"><span className="text-red-500">*</span> 표시는 필수 항목입니다.</p>
            {INPUT_SECTION_CONTENT.filter((item) => item.required).map((item) => (
                <InputBox key={item.title} placeholder={item.placeholder} title={item.title} required={item.required} />
            ))}
            <div className="border-b border-b-3 border-gray-300 w-full my-4"></div>
            {INPUT_SECTION_CONTENT.filter((item) => !item.required).map((item) => (
                <InputBox key={item.title} placeholder={item.placeholder} title={item.title} required={item.required} />
            ))}
        </div>
    )
}

export default InputSection