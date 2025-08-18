import PageLayout from "../components/common/PageLayout"
import About from "../../public/about2.jpg"
//팀원데이터
const teamMember = [
  {
    name : "오인화",
    role : "Backend, King",
    description : "아무것도 잘 풀리지 않지만 허공을 향해 따봉을 날리는 따봉도치",
    email : "cordelia04@gmail.com",
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
    role : "Backend",
    description : "",
  },
  {
    name : "정시연",
    role : "Design",
    description : "",
  }
]
const AboutPage = () => {
  return (
    <PageLayout>
      <div className="flex items-start gap-10 ml-10 mt-10 ">
        {/* 왼쪽 텍스트 */}
        <div>
          <h1 className="text-[70px] font-bold">Project</h1>
          <h2 className="text-[20px] font-bold mt-5">
            피움은 지역 소상공인 디지털 마케팅 진입 장벽을 낮추는 AI 기반 웹 서비스입니다.
          </h2>
          <h3 className="text-[20px font-semibold">우리 지역 속 다양한 가게들이 있습니다. <br />
          하지만, 그 수가 너무 많기 때문에 소비자들은 내 주변에 존재하는 모든 가게를 알 수 없습니다. <br />
          그렇기에 좋은 상품과 서비스를 지니고 있음에도 불구하고 알려지지 않아 찾아가지 못하는 경우가 많습니다. <br />
          아무리 좋은 상품과 서비스를 가지고 있어도, 사람들은 자신이 잘 모르고, 정보가 부족한 곳은 사람들이 많이 방문하지 않습니다.<br /> 
          이러한 상황에서 소상공인에게 홍보 마케팅은 생존을 위한 필수 전략입니다.<br />
          실제로 홍보 마케팅 하나로 매출이 수백만 원에서 수천만 원까지 오르내릴 정도로, 마케팅의 영향력은 매우 큽니다. <br />
          그러나 많은 소상공인들이 마케팅 경험이 부족해 어려움을 겪고 있으며, 때로는 홍보 대행을 맡기다 사기 피해를 당하는 사례도 증가하고 있습니다.<br />
          피움은 이러한 문제를 해결하기 위해 개발된 AI 마케팅 서비스로, 사용자가 가게 정보를 입력하면 AI가 자동으로 홍보 글, 해시태그, 콘텐츠 제안을 생성하고, 이를 인스타그램 등 주요 플랫폼에 손쉽게 게시할 수 있도록 지원하며, 복잡한 마케팅 과정을 단순화해, 누구나 무료로 빠르고 안전하게 자신만의 가게를 알릴 수 있도록 돕습니다.</h3>
        </div>

        {/* 오른쪽 이미지 */}
        <img
          src={About}
          alt="Photo"
          className="w-[700px] h-auto object-contain mr-10"
        />
      </div>
      <div className="mt-16"></div> 
        <h4 className="text-[70px] font-bold ml-10 mt-10">
          Team member introduction</h4>
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
            <p className="text-center text-sm mt-2">{member.description}</p>
            <p className="text-center text-sm mt-2">{member.email}</p>
          </div>
        ))}
      </div>
      <div className="mt-16"></div> 
    </PageLayout>
  )
}

export default AboutPage
