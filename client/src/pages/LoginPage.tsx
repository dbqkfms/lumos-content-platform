import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useLocation } from "wouter";

import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

const roleCards = [
  {
    label: "ARTIST PORTAL",
    title: "작가 업로드와 상태 관리",
    body: "업로드, 검수 상태, 수정 요청, 게시 중 작품 관리 흐름을 한 화면에서 보여주는 포털입니다.",
    href: "/portal/artist",
    icon: UserRound,
    accent: "text-[#93C5FD]",
  },
  {
    label: "ADMIN PORTAL",
    title: "콘텐츠 운영과 문의 관리",
    body: "작품 분류, 공개 여부, 작가 상태, buyer inquiry를 관리하는 운영 포털입니다.",
    href: "/portal/admin",
    icon: ShieldCheck,
    accent: "text-[#D4A843]",
  },
  {
    label: "BUYER ACCESS",
    title: "도입 검토용 접근 레이어",
    body: "향후 고객 전용 제안 화면이나 비공개 컬렉션 접근이 필요할 경우 이 위치에서 분기됩니다.",
    href: "/contact",
    icon: LockKeyhole,
    accent: "text-white",
  },
];

export default function LoginPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <FloatingCTA />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="font-accent text-xs tracking-[0.28em] text-[#D4A843]">SIGN IN / PORTALS</p>
            <h1 className="mt-5 max-w-4xl text-display text-[2.9rem] leading-[0.94] text-white md:text-[4.8rem]">
              로그인은 단순한 폼이 아니라,
              <br />
              public 사이트와 포털을 연결하는 관문입니다.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              상업용 데모 기준으로는 로그인 카드만 있는 화면보다, 역할별 포털이 어떤 차이를 가지는지 먼저 보여주는 편이 더 낫습니다.
            </p>
          </div>

          <article className="border border-white/8 bg-[#111] p-6">
            <p className="font-accent text-[10px] tracking-[0.22em] text-[#D4A843]">DEMO SIGN IN</p>
            <div className="mt-5 grid gap-4">
              <input className="border border-white/10 bg-black/20 px-4 py-3 text-sm text-white" placeholder="email@lumos.io" />
              <input type="password" className="border border-white/10 bg-black/20 px-4 py-3 text-sm text-white" placeholder="password" />
              <button type="button" className="btn-brutalist">Continue</button>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#090909] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-screen-xl gap-5 md:grid-cols-3">
          {roleCards.map((card) => (
            <article key={card.label} className="border border-white/8 bg-[#111] p-6">
              <card.icon className={`h-5 w-5 ${card.accent}`} />
              <p className={`mt-4 font-accent text-[10px] tracking-[0.22em] ${card.accent}`}>{card.label}</p>
              <h2 className="mt-3 text-display text-[1.8rem] text-white">{card.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">{card.body}</p>
              <button
                onClick={() => setLocation(card.href)}
                className="mt-6 inline-flex items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-white"
              >
                포털 보기
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
