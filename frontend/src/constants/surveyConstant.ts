{/** 
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
*/}

const INPUT_SECTION_CONTENT = [
  { title: '가게명', placeholder: '상호명', required: true },
  { title: '지역 위치/상권 키워드', placeholder: '청주시, 강남역, 역삼역 등', required: true },
  { title: '가게 주소', placeholder: '도로명 주소', required: true },
  { title: '가격대', placeholder: '답변을 입력하세요', required: true },
  { title: '영업 시간 정보', placeholder: '(ex) 09:00 ~ 18:00', required: true },
  { title: '가게 업종', placeholder: '카페, 식당, 칵테일 바 등', required: true },
  { title: '가게 소개', placeholder: '가게 특징/소개', required: true },
  { title: '답변 톤', placeholder: 'Casual / professional / Witty / emotional / urgent / luxury', required: true },
  { title: '이미지 URL(들)', placeholder: '', required: true },
  { title: '참고 링크', placeholder: '', required: false },
  { title: '제공 제품/서비스 키워드', placeholder: '(ex) 원두, 라떼아트', required: false },
  { title: '타깃 고객', placeholder: '(ex) 직장인, 대학생', required: false },
  { title: '가게 인스타그램 ID', placeholder: '(ex) pium._.official', required: false },
  { title: '진행중인 프로모션', placeholder: '네이버 영수증 리뷰 작성 시 천 원 할인', required: false },

] as const

const PREVIEW_CARD_SECTION_CONTENT ={
        title: '프리뷰 카드',
} as const

export { INPUT_SECTION_CONTENT, PREVIEW_CARD_SECTION_CONTENT }