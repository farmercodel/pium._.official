import type { JSX } from "react";

const features = [
  {
    title: "홍보글 자동 생성",
    desc: "AI가 비즈니스에 맞는 매력적인 홍보글을 자동으로 생성합니다.",
    icon: "https://c.animaapp.com/3FkSn8lj/img/div-8.svg",
  },
  {
    title: "해시태그 제안",
    desc: "트렌드를 반영한 최적의 해시태그를 추천해 더 많은 고객에게 도달합니다.",
    icon: "https://c.animaapp.com/3FkSn8lj/img/div-9.svg",
  },
  {
    title: "인스타그램 자동 게시",
    desc: "생성한 홍보글을 자동으로 인스타그램에 게시합니다.",
    icon: "https://c.animaapp.com/3FkSn8lj/img/div-10.svg",
  },
];

export const MainPage = (): JSX.Element => {
  return (
    <>
      {/* 폰트 적용: font-sans (tailwind.config.js에서 Pretendard로 매핑) */}
      <main className="bg-white font-sans">
        {/* Hero */}
        <section
          className="
            relative w-full
            bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400
          "
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
            <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-yellow-300 via-lime-400 to-green-600 bg-clip-text text-transparent">
                PIUM
            </span>
            <br />
            <span className="text-white">소상공인 마케팅 지원 서비스</span>
            </h1>


              <p className="mt-6 text-white/90 text-base sm:text-lg lg:text-xl">
                AI를 당신의 가게를 쉽고 빠르게 홍보합니다
              </p>

              <div className="mt-10 flex justify-center">
                {/* CTA 버튼: 흰 배경 + 그린 텍스트(포인트톤) */}
                <a
                  href="/Survey"
                  className="
                    inline-flex items-center justify-center
                    rounded-full px-6 py-3 lg:px-8 lg:py-4
                    text-emerald-600 font-bold
                    bg-white
                    border border-emerald-200
                    shadow-[0_10px_15px_rgba(0,0,0,0.12)]
                    transition
                    hover:bg-emerald-50
                    active:scale-[0.98]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                  "
                >
                  시작하기
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white" id="get-started" aria-labelledby="features-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
            <div className="text-center">
              <h2
                id="features-heading"
                className="text-2xl sm:text-3xl lg:text-4xl leading-10 text-gray-800 font-semibold tracking-tight"
              >
                AI가 당신의 가게를 쉽고 빠르게 홍보합니다
              </h2>
              <p className="mt-3 text-gray-600 text-sm sm:text-base lg:text-lg">
                소상공인을 위한 스마트한 마케팅 솔루션
              </p>
            </div>

            <div
              className="
                mt-10 sm:mt-12 lg:mt-16
                grid grid-cols-1
                md:grid-cols-1
                lg:grid-cols-3
                gap-6 sm:gap-8 lg:gap-10
              "
            >
              {features.map((f) => (
                <div
                  key={f.title}
                  className="
                    rounded-2xl border border-[#e9ecef]
                    p-6 sm:p-7 lg:p-8
                    shadow-sm hover:shadow-md transition
                    bg-white
                  "
                >
                  <div className="flex justify-center">
                    <img
                      src={f.icon}
                      alt=""
                      className="h-16 w-16"
                      loading="lazy"
                      aria-hidden
                    />
                  </div>
                  <h3 className="mt-6 text-center text-lg sm:text-xl font-semibold text-gray-800">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-center text-sm sm:text-base text-gray-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default MainPage;
