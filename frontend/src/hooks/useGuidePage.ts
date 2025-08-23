import { useState } from "react";

export const useGuidePage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      idx: 1,
      title: "가게 정보 입력",
      desc: "상단 메뉴의 마케팅 생성 버튼을 누르고, 가게의 기본 정보와 사진을 업로드하세요. 업종, 위치, 가게 소개 등 업로드한 정보를 기반으로 홍보 콘텐츠를 생성합니다.",
      label: "간편한 정보 입력",
      labelIcon: "https://c.animaapp.com/OWBCfRMZ/img/i.svg"
    },
    {
      idx: 2,
      title: "홍보 콘텐츠 선택",
      desc: "입력된 정보를 바탕으로 제안된 홍보 콘텐츠 시안 중 하나를 선택합니다. 홍보 콘텐츠가 마음에 들지 않는다면 다시 생성하기 버튼을 통해 재생성이 가능합니다.",
      label: "AI 자동 생성",
      labelIcon: "https://c.animaapp.com/OWBCfRMZ/img/i-1.svg"
    },
    {
      idx: 3,
      title: "인스타그램 피드 게시",
      desc: "홍보 콘텐츠 시안 3가지 중 마음에 드는 시안 한 가지를 선택하면 인스타그램에 자동 게시됩니다. 가게 인스타그램 계정과 공동 소유자로 인스타그램 게시글을 업로드하고 싶다면 반드시 가게 정보에 인스타그램 계정을 입력하세요.",
      label: "즉시 활용 가능",
      labelIcon: "https://c.animaapp.com/OWBCfRMZ/img/i-2.svg"
    }
  ];

  const features = [
    {
      icon: "/assets/빠른.svg",
      title: "빠른 생성 속도",
      desc: "몇 초 만에 고품질 콘텐츠를 생성합니다"
    },
    {
      icon: "/assets/스타일.svg",
      title: "다양한 스타일",
      desc: "업종과 목적에 맞는 다양한 톤앤매너"
    },
    {
      icon: "/assets/모바일.svg",
      title: "모바일 최적화",
      desc: "언제 어디서나 편리하게 이용 가능"
    },
    {
      icon: "/assets/보안.svg",
      title: "안전한 보안",
      desc: "고객 정보와 데이터를 안전하게 보호"
    }
  ];

  return {
    currentStep,
    setCurrentStep,
    steps,
    features
  };
};
