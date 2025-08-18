import PageLayout from "../components/common/PageLayout"
import About from "../../public/about2.jpg"

// 팀원 데이터
const teamMember = [
  {
    name : "오인화",
    role : "Backend , King",
    description : "아무것도 잘 풀리지 않지만 허공을 향해 따봉을 날리는 따봉도치",
    email : "givemehome@kakao.com",
    photo : "/public/TeamMember/Inwha.jpg",
  },
  {
    name : "이영수",
    role : "Frontend , 채채주인",
    email : "leeys4903@naver.com",
    description: "텅장 시간부자 vs 통장 시간거지"
  },
  {
    name : "김태연",
    role : "Frontend , OTAKU",
    description : "여름 너무 더워 에어 컨을 틀어",
    email : "kty20040308@gmail.com",
    photo : "/public/TeamMember/Teayeon.jpg"
  },
  {
    name : "김다빈",
    role : "Backend , 한교동",
    description : "커피와 코드로 세상을 디버깅하는 개발자",
    email : "fkdl4862@naver.com",
    photo : "/public/TeamMember/dabin.png"
  },
  {
    name : "정상원",
    role : "Backend, 신참",
    email : "tkddnjs11122@naver.com",
    description : "안녕하세요! 백엔드, 유니티를 공부하고있는 정상원입니다",
    photo : "/public/TeamMember/sangwon.jpg"
  },
  {
    name : "정시연",
    role : "Design",
    email : "siyeon0473@gmail.com",
    description : "디자인전공생",
    photo : "/public/TeamMember/siyeon.jpg"
  }
]

const AboutPage = () => {
  return (
    <PageLayout>
      {/* Pretendard 웹폰트 적용 */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css"
      />
      {/* About 페이지 전체 폰트 적용 */}
      <div className="font-sans">
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-y-8 gap-x-14 max-w-[1100px] mx-auto">
        <div className="max-w-[500px] text-center lg:text-left h-[500px] flex flex-col justify-center">
          <h1 className="text-[50px] font-bold mb-4">Project</h1>
          <div className="mt-2"></div>
          <h3 className="text-[17px] text-gray-700 leading-relaxed">
              피움은 지역 소상공인의 디지털 마케팅 진입 장벽을 낮추는 AI 기반 웹 서비스입니다.<br />
              많은 가게가 존재하지만, 소비자는 모든 가게를 알기 어렵고, 좋은 상품과 서비스가 알려지지 않는 경우가 많습니다.<br />
              홍보 마케팅은 소상공인의 생존 전략이지만 경험 부족으로 어려움을 겪거나 사기 피해를 당하기도 합니다.<br />
              피움은 사용자가 가게 정보를 입력하면 <br />
              AI가 자동으로 홍보 글, 해시태그, 콘텐츠를 생성하고, 인스타그램 등 주요 플랫폼에 쉽게 게시할 수 있도록 지원하여 <br />
              누구나 빠르고 안전하게 가게를 홍보할 수 있게 돕습니다.
            </h3>
          </div>

          {/* 오른쪽 이미지 */}
          <img
            src={About}
            alt="Photo"
            className="w-[600px] lg:w-[450px] h-[500px] object-cove mt-[60px]"
          />
        </div>

        <div className="mt-16"></div>
        <h4 className="text-[50px] font-bold ml-10 mt-10">
          Team member introduction
        </h4>
        <div className="grid grid-cols-3 gap-4 mt-10 mb-20 place-items-center">
          {teamMember.map((member, i) => (
            <div
              key={i}
              className="w-[500px] h-[400px] bg-white rounded-2xl shadow-md flex flex-col items-center justify-center p-4
               transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={member.photo}
                alt={member.name}
                className="w-50 h-50 object-cover mb-4"
              />
              <h5 className="font-semibold text-lg">{member.name}</h5>
              <p className="text-sm text-gray-500">{member.role}</p>
              <p className="text-center text-sm mt-2">{member.email}</p>
              <p className="text-center text-sm mt-2">{member.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16"></div>
      </div>
    </PageLayout>
  )
}

export default AboutPage
