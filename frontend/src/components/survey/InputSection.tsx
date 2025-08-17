import InputBox from "../common/InputBox"

const InputSection = () => {
    return (
        <div className="col-span-5 md:col-span-3 p-6 w-full gap-2 flex flex-col overflow-y-auto">
            <p className="text-sm text-gray-500"><span className="text-red-500">*</span> 표시는 필수 항목입니다.</p>
            <InputBox placeholder="답변을 입력해주세요." title="가게명" required />
            <InputBox placeholder="답변을 입력해주세요." title="지역 위치/상권 키워드" required />
            <InputBox placeholder="답변을 입력해주세요." title="가게 주소" required />
            <InputBox placeholder="답변을 입력해주세요." title="가격대" required />
            <InputBox placeholder="답변을 입력해주세요." title="영업 시간 정보" required />
            <InputBox placeholder="답변을 입력해주세요." title="가게 업종" required />
            <InputBox placeholder="답변을 입력해주세요." title="가격 소개" required />
            <InputBox placeholder="답변을 입력해주세요." title="답변 톤" required />
            <InputBox placeholder="답변을 입력해주세요." title="이미지 파일" required />
            <div className="border-b border-b-3 border-gray-300 w-full my-4"></div>
            <InputBox placeholder="답변을 입력해주세요." title="참고 링크" />
            <InputBox placeholder="답변을 입력해주세요." title="제공 제품/서비스 키워드" />
            <InputBox placeholder="답변을 입력해주세요." title="타깃 고객" />
            <InputBox placeholder="답변을 입력해주세요." title="가게 인스타그램 ID" />
            <InputBox placeholder="답변을 입력해주세요." title="진행중인 프로모션" />
            <InputBox placeholder="답변을 입력해주세요." title="해시태그 개수 상한" />
        </div>
    )
}

export default InputSection