import type { JSX } from "react";

export const SectionWrapper = (): JSX.Element => {
  return (
    <div className="h-[600px] top-[1191px] bg-gray-100 absolute w-[1440px] left-0 border-0 border-none">
      <div className="relative w-[1152px] h-[440px] top-20 left-36 border-0 border-none">
        <div className="w-[146px] top-0 left-[506px] text-gray-900 text-4xl text-center leading-10 absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
          주요 기능
        </div>

        <div className="absolute w-[1104px] h-[336px] top-[104px] left-6 border-0 border-none">
          <div className="absolute w-[536px] h-[336px] top-0 left-0 bg-white rounded-2xl border-2 border-solid border-[#a3d27633] shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a]">
            <img
              className="absolute w-16 h-16 top-[34px] left-[34px]"
              alt="Div"
              src="https://c.animaapp.com/3FkSn8lj/img/div-4.svg"
            />

            <div className="w-[468px] h-8 top-[122px] absolute left-[34px] border-0 border-none">
              <div className="w-[150px] -top-0.5 left-0 text-gray-900 text-2xl absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0] leading-[normal]">
                AI 콘텐츠 생성
              </div>
            </div>

            <div className="w-[468px] h-[52px] top-[170px] absolute left-[34px] border-0 border-none">
              <p className="w-[465px] top-px left-0 text-gray-600 text-base absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0] leading-[normal]">
                사업장 정보를 입력하면 AI가 자동으로 SNS 게시물, 블로그 글, 광고
                문
              </p>

              <div className="w-[135px] top-[27px] left-0 text-gray-600 text-base leading-[normal] absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
                구 등을 생성합니다.
              </div>
            </div>

            <div className="top-[246px] absolute w-[468px] h-14 left-[34px] border-0 border-none">
              <div className="top-0 absolute w-[468px] h-6 left-0 border-0 border-none">
                <img
                  className="absolute w-3.5 h-6 top-0 left-0"
                  alt="I"
                  src="https://c.animaapp.com/3FkSn8lj/img/i.svg"
                />

                <div className="w-40 top-0 left-[26px] text-gray-600 text-base leading-[normal] absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
                  개인화된 마케팅 메시지
                </div>
              </div>

              <div className="top-8 absolute w-[468px] h-6 left-0 border-0 border-none">
                <img
                  className="absolute w-3.5 h-6 top-0 left-0"
                  alt="I"
                  src="https://c.animaapp.com/3FkSn8lj/img/i-1.svg"
                />

                <div className="w-[145px] top-0 left-[26px] text-gray-600 text-base leading-[normal] absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
                  다양한 플랫폼 최적화
                </div>
              </div>
            </div>
          </div>

          <div className="absolute w-[536px] h-[336px] top-0 left-[568px] bg-white rounded-2xl border-2 border-solid border-[#a3d27633] shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a]">
            <img
              className="absolute w-16 h-16 top-[34px] left-[34px]"
              alt="Div"
              src="https://c.animaapp.com/3FkSn8lj/img/div-5.svg"
            />

            <div className="w-[468px] h-8 top-[122px] absolute left-[34px] border-0 border-none">
              <div className="w-[99px] -top-0.5 left-0 text-gray-900 text-2xl leading-[normal] absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
                성과 분석
              </div>
            </div>

            <div className="w-[468px] h-[26px] top-[170px] absolute left-[34px] border-0 border-none">
              <p className="w-[448px] top-px left-0 text-gray-600 text-base leading-[normal] absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
                마케팅 활동의 성과를 실시간으로 추적하고 개선 방안을 제안합니다.
              </p>
            </div>

            <div className="top-[220px] absolute w-[468px] h-14 left-[34px] border-0 border-none">
              <div className="top-0 absolute w-[468px] h-6 left-0 border-0 border-none">
                <img
                  className="absolute w-3.5 h-6 top-0 left-0"
                  alt="I"
                  src="https://c.animaapp.com/3FkSn8lj/img/i-2.svg"
                />

                <div className="w-[130px] top-0 left-[26px] text-gray-600 text-base leading-[normal] absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
                  실시간 데이터 분석
                </div>
              </div>

              <div className="top-8 absolute w-[468px] h-6 left-0 border-0 border-none">
                <img
                  className="absolute w-3.5 h-6 top-0 left-0"
                  alt="I"
                  src="https://c.animaapp.com/3FkSn8lj/img/i-3.svg"
                />

                <div className="w-[116px] top-0 left-[26px] text-gray-600 text-base leading-[normal] absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
                  개선 제안 시스템
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};