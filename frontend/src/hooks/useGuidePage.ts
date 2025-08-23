import { useState } from "react";

export const useGuidePage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      idx: 1,
      title: "가게 정보 입력",
      desc: "상단 메뉴의 마케팅 생성 버튼을 누르고,\n가게의 기본 정보와 사진을 업로드하세요.\n업종, 위치, 가게 소개 등 업로드한 정보를\n기반으로 홍보 콘텐츠를 생성합니다.",
      label: "간편한 정보 입력",
      labelIcon: "/assets/check-gradient.svg"
    },
    {
      idx: 2,
      title: "홍보 콘텐츠 선택",
      desc: "입력된 정보를 바탕으로 제안된\n홍보 콘텐츠 시안 중 하나를 선택합니다.\n 홍보 콘텐츠가 마음에 들지 않는다면\n다시 생성하기를 통해 재생성이 가능합니다.",
      label: "AI 자동 생성",
      labelIcon: "/assets/check-gradient.svg"
    },
    {
      idx: 3,
      title: "인스타그램 피드 게시",
      desc: "생성된 시안 중 한 가지를 선택하면\n인스타그램에 자동 게시됩니다.\n가게 인스타그램 계정과 공동 소유자로\n게시글을 업로드하고 싶다면 반드시 가게 정보에\n인스타그램 계정을 입력하세요.",
      label: "SNS 게시 자동화",
      labelIcon: "/assets/check-gradient.svg"
    }
  ];

  const features = [
    {
      icon: "/assets/feature-speed.svg",
      title: "빠른 생성 속도",
      desc: "고품질 홍보 콘텐츠를 빠른 시간 내에 생성합니다."
    },
    {
      icon: "/assets/feature-sparkles.svg",
      title: "다양한 스타일",
      desc: "업종과 목적에 맞는 다양한 홍보 콘텐츠를 제작합니다."
    },
    {
      icon: "/assets/feature-phone.svg",
      title: "멀티 디바이스 최적화",
      desc: "모바일, PC, 태블릿 등 어떤 환경에서든\n일관된 사용 경험을 제공합니다."
    },
    {
      icon: "/assets/feature-shield.svg",
      title: "공식 매장 인증",
      desc: "회원가입 시 사업자등록번호 인증을 통해\n타인의 서비스의 악용을 차단합니다."
    }
  ];

  return {
    currentStep,
    setCurrentStep,
    steps,
    features
  };
};
