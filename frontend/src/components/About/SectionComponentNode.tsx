import type { JSX } from "react";

export const SectionComponentNode = (): JSX.Element => {
  return (
    <div className="h-[348px] top-[2359px] bg-[linear-gradient(90deg,rgba(163,210,118,0.1)_0%,rgba(163,210,118,0.05)_100%)] absolute w-[1440px] left-0 border-0 border-none">
      <div className="relative w-[896px] h-[188px] top-20 left-[272px] border-0 border-none">
        <div className="w-[279px] top-0 left-[311px] text-gray-900 text-4xl text-center leading-10 absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
          지금 시작해보세요
        </div>

        <p className="w-[456px] top-16 left-[223px] text-gray-700 text-xl text-center leading-7 whitespace-nowrap absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
          피움과 함께 디지털 마케팅의 새로운 시대를 열어가세요
        </p>

        <div className="absolute w-[848px] h-16 top-[124px] left-6 border-0 border-none">
          <button className="all-[unset] box-border w-[167px] h-16 top-0 left-[265px] bg-[#a3d276] border-0 border-none shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a] absolute rounded-xl">
            <div className="w-[109px] top-[19px] left-8 text-white text-lg text-center leading-[normal] absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
              무료 체험하기
            </div>
          </button>

          <button className="all-[unset] box-border w-[134px] h-16 top-0 left-[449px] border-2 border-solid border-[#a3d276] absolute rounded-xl">
            <div className="w-[72px] top-[17px] left-[34px] text-[#a3d276] text-lg text-center leading-[normal] absolute [font-family:'Noto_Sans_KR',Helvetica] font-normal tracking-[0]">
              문의하기
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
