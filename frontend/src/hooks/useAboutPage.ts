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
    description: "아무것도 잘 된 게 없지만 허공을 향해 따봉을 날리는 따봉도치",
    email: "givemehome@kakao.com",
    photo: "TeamMember/Inwha.jpg",
  },
  {
    name: "이영수",
    role: "Frontend, 채채주인",
    email: "leeys4903@naver.com",
    description: "텅장 시간부자 vs 통장 시간거지",
    photo: "TeamMember/chaechae.jpg"
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

export const projectIntroData = [
  {
    index: 1,
    title: "문제 인식",
    descMobile:
      "홍보 마케팅 하나로 매출이 달라지기도\n할 정도로 홍보 마케팅은 중요합니다.\n그러나, 이는 진입 장벽이 높아 시작하기 어렵고\n홍보 대행을 맡긴다고 해도 많은 비용이 들어\n큰 경제적 부담을 떠안아야 합니다.",
    descTablet:
      "홍보 마케팅 하나로 매출이 달라지기도\n할 정도로 홍보 마케팅은 중요합니다.\n그러나, 이는 진입 장벽이 높아 시작하기 어렵고\n홍보 대행을 맡긴다고 해도 많은 비용이 들어\n큰 경제적 부담을 떠안아야 합니다.",
    descDesktop:
      "홍보 마케팅 하나로 매출이 달라지기도\n할 정도로 홍보 마케팅은 중요합니다.\n그러나, 이는 진입 장벽이 높아 시작하기 어렵고\n홍보 대행을 맡긴다고 해도 많은 비용이 들어\n큰 경제적 부담을 떠안아야 합니다.",
  },

    {
    index: 2,
    title: "해결 방향",
    descMobile:
      "사용자가 가게에 대한 정보를 입력하면\nAI가 자동으로 홍보 글, 해시태그를 생성하고,\n인스타그램에 자동으로 게시되도록 지원합니다.\n이를 통해 기존의 복잡한 홍보 마케팅 과정을\n단순화합니다.",
    descTablet:
      "사용자가 가게에 대한 정보를 입력하면\nAI가 자동으로 홍보 글, 해시태그를 생성하고,\n인스타그램에 자동으로 게시되도록 지원합니다.\n이를 통해 기존의 복잡한 홍보 마케팅 과정을\n단순화합니다.",
    descDesktop:
      "사용자가 가게에 대한 정보를 입력하면\nAI가 자동으로 홍보 글, 해시태그를 생성하고,\n인스타그램에 자동으로 게시되도록 지원합니다.\n이를 통해 기존의 복잡한 홍보 마케팅 과정을\n단순화합니다.",
  },

    {
    index: 3,
    title: "기대 효과",
    descMobile:
      "복잡한 마케팅 과정을 단순화해 누구나 손쉽게\n홍보 마케팅을 할 수 있도록 지원합니다.\n이를 통해 다양한 가게들을 홍보할 수 있고,\n기존 홍보 대행의 문제점이던 큰 경제적 부담 및\n사기 피해의 위험 문제를 해결할 수 있습니다.",
    descTablet:
      "복잡한 마케팅 과정을 단순화해 누구나 손쉽게\n홍보 마케팅을 할 수 있도록 지원합니다.\n이를 통해 다양한 가게들을 홍보할 수 있고,\n기존 홍보 대행의 문제점이던 큰 경제적 부담 및\n사기 피해의 위험 문제를 해결할 수 있습니다.",
    descDesktop:
      "복잡한 마케팅 과정을 단순화해 누구나 손쉽게\n홍보 마케팅을 할 수 있도록 지원합니다.\n이를 통해 다양한 가게들을 홍보할 수 있고,\n기존 홍보 대행의 문제점이던 큰 경제적 부담 및\n사기 피해의 위험 문제를 해결할 수 있습니다.",
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
    iconSrc: "/assets/instagram_white.svg",
    bullets: [
      "PIUM에서 제작한 템플릿을 기반으로 피드\n썸네일 자동 생성",
      "@pium._.official 계정과 가게 인스타그램\n계정이 공동 소유자가 되어 피드 자동 게시",
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
