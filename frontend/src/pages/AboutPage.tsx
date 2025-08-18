import PageLayout from "../components/common/PageLayout"
import About from "../../public/about2.jpg"

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
    description: "텅장 시간부자 vs 통장 시간거지"
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
            className="w-[600px] lg:w-[450px] h-[500px] object-cover mt-[60px]"
          />
        </div>
        <h4 className="text-[40px] font-bold mt-20 mb-10 text-left"></h4>
        <h4 className="text-[40px] font-bold mt-20 mb-10 text-center">
          Team member introduction
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mb-20">
          {teamMember.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105 p-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden bg-gray-100 mb-4">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>

              {/* 이름 + 역할 */}
              <h2 className="text-lg font-bold text-center">{member.name}</h2>
              <p className="text-sm text-gray-500 text-center">{member.role}</p>

              {/* 이메일 */}
              <p className="text-xs text-gray-400 text-center mt-1">
                {member.email}
              </p>

              {/* 설명 */}
              <p className="text-sm text-gray-600 text-center mt-3">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export default AboutPage
