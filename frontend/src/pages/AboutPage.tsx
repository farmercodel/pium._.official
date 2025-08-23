import type { JSX } from "react";
import { useAboutPage } from "../hooks/useAboutPage";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { HeroSection } from "../components/about/HeroSection";
import { ProjectIntroSection } from "../components/about/ProjectIntroSection";
import { FeaturesSection } from "../components/about/FeaturesSection";
import { TeamSection } from "../components/about/TeamSection";
import { CTASection } from "../components/about/CTASection";

<<<<<<< HEAD
// 팀원 데이터
const teamMember = [
  {
    name: "오인화",
    role: "Backend, King",
    description: "아무것도 잘 풀리지 않지만 허공을 향해 따봉을 날리는 따봉도치",
    email: "givemehome@kakao.com",
    photo: "/public/TeamMember/Inwha.jpg",
  },
  {
    name: "이영수",
    role: "Frontend, 채채주인",
    email: "leeys4903@naver.com",
    description: "텅장 시간부자 vs 통장 시간거지",
    photo : "/public/TeamMember/chaechae.jpg"
  },
  {
    name: "김태연",
    role: "Frontend, OTAKU",
    description: "듀 가나디 듀 가나디 듀 가나디",
    email: "kty20040308@gmail.com",
    photo: "/public/TeamMember/Teayeon.jpg"
  },
  {
    name: "김다빈",
    role: "Backend, 한교동",
    description: "커피와 코드로 세상을 디버깅하는 개발자",
    email: "fkdl4862@naver.com",
    photo: "/public/TeamMember/dabin.png"
  },
  {
    name: "정상원",
    role: "Backend, 신참",
    email: "tkddnjs11122@naver.com",
    description: "안녕하세요! 백엔드, 유니티를 공부하고있는 정상원입니다",
    photo: "/public/TeamMember/sangwon.jpg"
  },
  {
    name: "정시연",
    role: "Design, 멋쟁이 디자이너",
    email: "siyeon0473@gmail.com",
    description: "디자인전공생",
    photo: "/public/TeamMember/siyeon.jpg"
  }
]
=======
export const AboutPage = ({ team }: { team?: ReturnType<typeof useAboutPage>['teamMembers'] }): JSX.Element => {
  const { teamMembers, projectIntroData, featureData, heroAnim, inViewAnim } = useAboutPage(team);
  
  // 페이지 이동 시 스크롤을 맨 위로
  useScrollToTop();
>>>>>>> c232118cc9cae7a25b358ad3a7d5b5a4b55eb65d

  return (
    <main className="font-sans">
      <HeroSection heroAnim={heroAnim} />
      <ProjectIntroSection projectIntroData={projectIntroData} inViewAnim={inViewAnim} />
      <FeaturesSection featureData={featureData} inViewAnim={inViewAnim} />
      <TeamSection teamMembers={teamMembers} inViewAnim={inViewAnim} />
      <CTASection inViewAnim={inViewAnim} />
    </main>
  );
};

export default AboutPage;
