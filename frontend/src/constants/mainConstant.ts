const HERO_CONTENT = {
    title: 'Why PIUM?',
    description: '복잡한 마케팅은 이제 그만. 피움은 단 몇 번의 클릭으로 홍보 글, 이미지, 해시태그까지 완성합니다.',
    featurePoints: [
        {
            icon: '✅',
            text: '지역 상권에 특화된 콘텐츠',
        },
        {
            icon: '✅',
            text: 'AI가 직접 생성하는 홍보 글 & 이미지',
        },
        {
            icon: '✅',
            text: '초보자도 쉽게, 1분 완성',
        },
    ],
    cta: '지금 시작하기',
    img: [
        {
            src: 'assets/logo.png',
            alt: 'PIUM Preview left',
        },
        {
            src: 'assets/logo.png',
            alt: 'PIUM Preview right',
        },
    ]
} as const

const USER_FLOW_CONTENT = {
    title: 'How to use PIUM',
    description: 'PIUM을 사용하는 방법을 알려드립니다.',
    steps: [
        {
            title: '질문지 작성',
            description: '사용자가 질문지를 작성합니다.',
        },
        {
            title: '마케팅 생성 및 결과 확인',
            description: '사용자가 마케팅을 생성하고 결과를 확인합니다.',
        },
        {
            title: 'SNS 게시',
            description: '결과물을 SNS에 게시합니다.',
        },
    ]
} as const

export { HERO_CONTENT, USER_FLOW_CONTENT }