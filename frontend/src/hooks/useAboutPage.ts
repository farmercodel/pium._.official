import { useReducedMotion } from "framer-motion";

// 팀 데이터 타입
export type TeamMember = {
  name: string;
  role: string;
  description: string;
  email: string;
  photo?: string; // 선택
};

// 기본 팀 데이터
export const defaultTeamMembers: TeamMember[] = [
  {
    name: "오인화",
    role: "Backend, King",
    description: "아무것도 잘 풀리지 않지만 허공을 향해 따봉을 날리는 따봉도치",
    email: "givemehome@kakao.com",
    photo: "TeamMember/Inwha.jpg",
  },
  {
    name: "이영수",
    role: "Frontend, 채채주인",
    email: "leeys4903@naver.com",
    description: "텅장 시간부자 vs 통장 시간거지",
  },
  {
    name: "김태연",
    role: "Frontend, OTAKU",
    description: "듀 가나디 듀 가나디 듀 가나디",
    email: "kty20040308@gmail.com",
    photo: "TeamMember/Teayeon.jpg",
  },
  {
    name: "김다빈",
    role: "Backend, 한교동",
    description: "커피와 코드로 세상을 디버깅하는 개발자",
    email: "fkdl4862@naver.com",
    photo: "TeamMember/dabin.png",
  },
  {
    name: "정상원",
    role: "Backend, 신참",
    email: "tkddnjs11122@naver.com",
    description: "안녕하세요! 백엔드, 유니티를 공부하고있는 정상원입니다",
    photo: "TeamMember/sangwon.jpg",
  },
  {
    name: "정시연",
    role: "Design, 멋쟁이 디자이너",
    email: "siyeon0473@gmail.com",
    description: "디자인전공생",
    photo: "TeamMember/siyeon.jpg",
  },
];

// 프로젝트 소개 데이터
export const projectIntroData = [
  {
    index: 1,
    title: "문제 인식",
    desc: "저렴한 가격에 질 좋은 서비스를 제공함에도 불구하고 홍보의 부족으로 알려지지 않은 우리 주변의 가게들이 존재하고, 그 중 일부는 가게의 홍보를 위해 홍보 대행 서비스를 이용하다 사기 피해를 당하기도 합니다.",
  },
  {
    index: 2,
    title: "해결 방향",
    desc: "사용자가 가게에 대한 정보를 입력하면 AI가 자동으로 홍보 글, 해시태그를 생성하고, 이를 인스타그램에 자동으로 게시할 수 있도록 지원합니다. 이를 통해 기존에 복잡했던 홍보 마케팅의 과정을 단순화합니다.",
  },
  {
    index: 3,
    title: "기대 효과",
    desc: "복잡한 마케팅 과정을 단순화해 누구나 손쉽게 홍보 마케팅을 할 수 있도록 지원해 우리 주변의 다양한 가게들을 알릴 수 있고, 기존에 존재하던 홍보 대행으로 인한 사기 피해를 줄일 수 있습니다.",
  },
];

// 주요 기능 데이터
export const featureData = [
  {
    title: "AI 콘텐츠 생성",
    iconSrc: "/assets/icon-copy-gen.svg",
    bullets: [
      "사용자가 입력한 가게 정보 기반 홍보글 생성",
      "검색 최적화(SEO) 관점에서의 해시태그 생성",
    ],
  },
  {
    title: "인스타그램 피드 자동 게시",
    iconSrc: "/assets/icon-auto-post.svg",
    bullets: [
      "PIUM에서 제작한 템플릿을 기반으로 피드 썸네일 사진 자동 생성",
      "@pium._.official 계정과 가게 인스타그램 계정이 공동 소유자가 되어 피드 자동 업로드",
    ],
  },
];

export const useAboutPage = (team?: TeamMember[]) => {
  const reduce = useReducedMotion();

  // 애니메이션 설정
  const heroAnim = reduce ? {} : { initial: "hidden", animate: "show" };
  const inViewAnim = reduce
    ? {}
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.25 } };

  // 팀 데이터
  const teamMembers = team || defaultTeamMembers;

  return {
    teamMembers,
    projectIntroData,
    featureData,
    heroAnim,
    inViewAnim,
  };
};
