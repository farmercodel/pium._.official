import type { JSX } from "react";

export const Section = (): JSX.Element => {
  return (
    <div className="h-[600px] top-[65px] bg-[linear-gradient(90deg,rgba(163,210,118,0.1)_0%,rgba(163,210,118,0.05)_100%)] absolute w-[1440px] left-0 border-0 border-none">
      <div className="relative w-[866px] h-[232px] top-[184px] left-[287px] border-0 border-none">
        <div className="relative w-[818px] h-[232px] left-6 border-0 border-none">
          <p className="w-[130px] top-0 left-[354px] text-transparent text-6xl text-center leading-[60px] absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
            <span className="text-gray-900">피</span>

            <span className="text-[#a3d276]"> 움</span>
          </p>

          <p className="absolute w-[818px] top-[92px] left-0 [font-family:'Noto_Sans_KR',Helvetica] font-normal text-gray-700 text-2xl text-center tracking-[0] leading-8 whitespace-nowrap">
            피움은 지역 소상공인의 디지털 마케팅 진입 장벽을 낮추는 AI 기반 웹
            서비스입니다.
          </p>

          <button className="all-[unset] box-border w-[184px] h-[60px] top-[172px] left-[317px] bg-[#a3d276] border-0 border-none shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a] absolute rounded-xl">
            <div className="w-[125px] top-[17px] left-8 text-white text-lg text-center leading-[normal] absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
              서비스 시작하기
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
