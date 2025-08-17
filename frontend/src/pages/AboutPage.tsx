import PageLayout from "../components/common/PageLayout"
import About from "/dev/pium._.official-new/frontend/public/aboutpage.jpg"

const AboutPage = () => {
  return (
    <PageLayout>
      <div className="flex items-start gap-10 ml-10 mt-10 ">
        {/* 왼쪽 텍스트 */}
        <div>
          <h1 className="text-[70px] font-bold">Project</h1>
          <h2 className="text-[20px] mt-5">
            피움은 지역 소상공인 디지털 마케팅 진입 장벽을 낮추는 AI 기반 웹 서비스입니다.
          </h2>
        </div>

        {/* 오른쪽 이미지 */}
        <img
          src={About}
          alt="Photo"
          className="w-[500px] h-[500px] object-cover"
          style={{ marginRight: "-1000px" }}
        />
      </div>
    </PageLayout>
  )
}

export default AboutPage
