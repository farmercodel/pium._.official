export interface Feature {
  title: string;
  desc: string;
  icon: string;
}

export const useMainPage = () => {
  const features: Feature[] = [
    {
      title: "홍보글 생성",
      desc: "AI를 통해 사용자의 비즈니스에 맞는 매력적인 홍보글을 생성합니다.",
      icon: "/assets/icon-copy-gen.svg",
    },
    {
      title: "해시태그 제안",
      desc: "검색 최적화(SEO) 관점에서의 해시태그 생성으로 더 많은 고객에게 홍보될 수 있도록 합니다.",
      icon: "/assets/icon-hashtag-suggest.svg",
    },
    {
      title: "인스타그램 자동 게시",
      desc: "생성한 홍보글을 자동으로 인스타그램에 게시하며, 모든 게시물은 인스타그램 @pium._.official 계정에서 확인 가능합니다.",
      icon: "/assets/icon-auto-post.svg",
    },
  ];

  return {
    features,
  };
};
