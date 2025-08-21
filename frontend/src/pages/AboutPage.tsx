import type { JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MotionProps, Transition, Variants } from "framer-motion";

/** ===== Variants ===== */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const flyUp: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.99, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/** spring 인터랙션(접근성 고려: reduceMotion 시 비활성) */
const useLiftInteractions = (): MotionProps => {
  const reduce = useReducedMotion();
  if (reduce) return {};
  const springLift: Transition = { type: "spring", stiffness: 300, damping: 20 };
  return {
    whileHover: { y: -6, scale: 1.01 },
    whileTap: { scale: 0.98, y: -1 },
    transition: springLift,
  };
};

// 팀 데이터 타입
export type TeamMember = {
  name: string;
  role: string;
  description: string;
  email: string;
  photo?: string; // 선택
};

// 기본 팀 데이터
export const defaultTeamMembers: TeamMember[] = [
  {
    name: "오인화",
    role: "Backend, King",
    description: "아무것도 잘 풀리지 않지만 허공을 향해 따봉을 날리는 따봉도치",
    email: "givemehome@kakao.com",
    photo: "TeamMember/Inwha.jpg",
  },
  {
    name: "이영수",
    role: "Frontend, 채채주인",
    email: "leeys4903@naver.com",
    description: "텅장 시간부자 vs 통장 시간거지",
  },
  {
    name: "김태연",
    role: "Frontend, OTAKU",
    description: "듀 가나디 듀 가나디 듀 가나디",
    email: "kty20040308@gmail.com",
    photo: "TeamMember/Teayeon.jpg",
  },
  {
    name: "김다빈",
    role: "Backend, 한교동",
    description: "커피와 코드로 세상을 디버깅하는 개발자",
    email: "fkdl4862@naver.com",
    photo: "TeamMember/dabin.png",
  },
  {
    name: "정상원",
    role: "Backend, 신참",
    email: "tkddnjs11122@naver.com",
    description: "안녕하세요! 백엔드, 유니티를 공부하고있는 정상원입니다",
    photo: "TeamMember/sangwon.jpg",
  },
  {
    name: "정시연",
    role: "Design, 멋쟁이 디자이너",
    email: "siyeon0473@gmail.com",
    description: "디자인전공생",
    photo: "TeamMember/siyeon.jpg",
  },
];

// 공통 컴포넌트
const SectionTitle = ({ children }: { children: JSX.Element | string }) => (
  <motion.h2
    className="text-center text-xl sm:text-2xl font-bold text-gray-800"
    variants={fade}
  >
    {children}
  </motion.h2>
);

// ---------- 프로젝트 소개 카드 (숫자 원형, 가운데 정렬) ----------
const ProjectIntroCard = ({
  index,
  title,
  desc,
  interactions,
}: {
  index: number; // 1-based
  title: string;
  desc: string;
  interactions: MotionProps;
}) => (
  <motion.div
    role="button"
    tabIndex={0}
    className="h-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transform-gpu"
    variants={card}
    {...interactions}
  >
    {/* 숫자 원형 (녹색 그라데이션) */}
    <div
      className="mx-auto mb-4 grid h-10 w-10 place-items-center rounded-full text-white shadow"
      style={{
        background:
          "linear-gradient(135deg, rgb(52 211 153) 0%, rgb(45 212 191) 50%, rgb(34 211 238) 100%)",
      }}
      aria-hidden
    >
      <span className="text-sm font-bold">{index}</span>
    </div>
    <h3 className="text-base sm:text-lg font-bold text-gray-800">{title}</h3>
    <p className="mt-2 text-sm text-gray-600 leading-6">{desc}</p>
  </motion.div>
);

// ---------- 주요 기능 카드 (아이콘, 가운데 정렬) ----------
const PlaceholderIcon = () => (
  <img src="https://c.animaapp.com/OWBCfRMZ/img/div-4.svg" alt="" className="h-5 w-5" />
);

const LargeFeatureCard = ({
  title,
  bullets,
  interactions,
}: {
  title: string;
  bullets: string[];
  interactions: MotionProps;
}) => (
  <motion.div
    role="button"
    tabIndex={0}
    className="h-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transform-gpu"
    variants={card}
    {...interactions}
  >
    <div className="mx-auto mb-3 grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600 shadow">
      <PlaceholderIcon />
    </div>
    <h3 className="text-base sm:text-lg font-bold text-gray-800">{title}</h3>
    <ul className="mt-4 space-y-2 text-sm text-gray-700 text-left inline-block">
      {bullets.map((b, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-emerald-600 mt-0.5">•</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

// ---------- 팀 멤버 카드 (사용자 디자인) ----------
const MemberCard = ({ m, interactions }: { m: TeamMember; interactions: MotionProps }) => (
  <motion.div
    role="button"
    tabIndex={0}
    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105 p-6 flex flex-col items-center border border-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
    variants={card}
    {...interactions}
  >
    <div className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden bg-gray-100 mb-4">
      {m.photo ? (
        <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-xl" aria-hidden>
          👤
        </span>
      )}
    </div>

    <h3 className="text-lg font-bold text-center text-gray-800">{m.name}</h3>
    <p className="text-sm text-gray-500 text-center">{m.role}</p>
    <a
      href={`mailto:${m.email}`}
      className="text-xs text-gray-400 text-center mt-1 hover:underline"
    >
      {m.email}
    </a>
    <p className="text-sm text-gray-600 text-center mt-3">{m.description}</p>
  </motion.div>
);

export const AboutPage = ({ team = defaultTeamMembers }: { team?: TeamMember[] }): JSX.Element => {
  const interactions = useLiftInteractions();
  const reduce = useReducedMotion();

  const heroAnim = reduce ? {} : { initial: "hidden", animate: "show" };
  const inViewAnim = reduce
    ? {}
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.25 } };

  return (
    <main className="font-sans">
      {/* Hero */}
      <section className="relative w-full bg-emerald-50/60">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12"
          variants={container}
          {...heroAnim}
        >
          <div className="text-center">
            <motion.h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900"
              variants={flyUp}
            >
              프로젝트 소개
            </motion.h1>
            <motion.p
              className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
              variants={fade}
            >
              피움은 지역 소상공인의 마케팅을 돕는 AI 서비스입니다. <br />
            </motion.p>

            <motion.div className="mt-5" variants={fade}>
              <motion.a
                href="/Guide"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-full px-5 py-2.5
                  bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400
                  text-white font-semibold
                  shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200
                "
                {...interactions}
              >
                서비스 가이드 보기
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 프로젝트 소개: 숫자 배지 + 가운데 정렬 */}
      <section className="bg-white">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
          variants={container}
          {...inViewAnim}
        >
          <SectionTitle>프로젝트 소개</SectionTitle>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            <ProjectIntroCard
              index={1}
              title="문제 인식"
              desc="저렴한 가격에 질 좋은 서비스를 제공함에도 불구하고 홍보의 부족으로 알려지지 않은 우리 주변의 가게들이 존재하고, 그 중 일부는 가게의 홍보를 위해 홍보 대행 서비스를 이용하다 사기 피해를 당하기도 합니다."
              interactions={interactions}
            />
            <ProjectIntroCard
              index={2}
              title="해결 방향"
              desc="사용자가 가게에 대한 정보를 입력하면 AI가 자동으로 홍보 글, 해시태그를 생성하고, 이를 인스타그램에 자동으로 게시할 수 있도록 지원합니다."
              interactions={interactions}
            />
            <ProjectIntroCard
              index={3}
              title="기대 효과"
              desc="복잡한 마케팅 과정을 단순화해 누구나 손쉽게 홍보 마케팅을 할 수 있도록 지원해 우리 주변의 다양한 가게들을 알릴 수 있고, 기존에 존재하던 홍보 대행으로 인한 사기 피해를 줄일 수 있습니다."
              interactions={interactions}
            />
          </div>
        </motion.div>
      </section>

      {/* 주요 기능: 아이콘 + 가운데 정렬 */}
      <section className="bg-gray-50">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
          variants={container}
          {...inViewAnim}
        >
          <SectionTitle>주요 기능</SectionTitle>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            <LargeFeatureCard
              title="AI 콘텐츠 생성"
              bullets={[
                "사용자가 입력한 가게 정보 기반 홍보글 생성",
                "검색 최적화(SEO) 관점에서의 해시태그 생성",
              ]}
              interactions={interactions}
            />
            <LargeFeatureCard
              title="인스타그램 피드 자동 업로드"
              bullets={[
                "PIUM에서 제작한 템플릿을 기반으로 피드 썸네일 사진 자동 생성",
                "@pium._.official 계정과 가게 인스타그램 계정이 공동 소유자가 되어 피드 자동 업로드",
              ]}
              interactions={interactions}
            />
          </div>
        </motion.div>
      </section>

      {/* 팀 소개 */}
      <section className="bg-white">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
          variants={container}
          {...inViewAnim}
        >
          <SectionTitle>팀 소개</SectionTitle>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((m) => (
              <MemberCard key={m.email} m={m} interactions={useLiftInteractions()} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA: 링크 연결 수정 */}
      <section className="bg-gradient-to-b from-emerald-50 to-emerald-100/50">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14 text-center"
          variants={container}
          {...inViewAnim}
        >
          <motion.h2 className="text-xl sm:text-2xl font-bold text-gray-800" variants={fade}>
            지금 시작해보세요
          </motion.h2>
          <motion.p className="mt-2 text-sm sm:text-base text-gray-600" variants={fade}>
            피움과 함께 마케팅의 시작을 경험해보세요.
          </motion.p>
          <motion.div className="mt-6 flex flex-wrap items-center justify-center gap-3" variants={fade}>
            <motion.a
              href="/Survey"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-white text-sm sm:text-base font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              variants={flyUp}
              {...interactions}
            >
              무료 체험하기
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>

            <motion.a
              href="mailto:cordelia04@naver.com"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4 bg-white text-emerald-700 ring-1 ring-gray-200 hover:ring-emerald-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              variants={flyUp}
              {...interactions}
            >
              문의하기
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 10a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7A8.38 8.38 0 018 17.9L3 19l1.1-4.6A8.38 8.38 0 013 10a8.5 8.5 0 018.5-8.5A8.5 8.5 0 0120 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
};

export default AboutPage;
