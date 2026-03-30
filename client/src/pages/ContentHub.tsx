import { ArrowRight, BadgeDollarSign, Search, UserRound } from "lucide-react";
import { useLocation } from "wouter";

import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

const topCategories = [
  {
    label: "OPEN / SAMPLE",
    title: "Open / Sample",
    body: "무료 프리뷰나 샘플을 먼저 확인하는 구간입니다. 내부 검토와 첫 미팅 전 방향 정리에 적합합니다.",
    ctaLabel: "샘플 콘텐츠 보기",
    cta: "/explore",
  },
  {
    label: "LUMOS ORIGINALS",
    title: "LUMOS Originals",
    body: "LUMOS의 핵심 콘텐츠 층위입니다. STANDARD와 LOCAL은 가격 구분이 아니라 이 안의 브랜드 세계관으로 유지됩니다.",
    ctaLabel: "Originals 보기",
    cta: "/standard",
  },
  {
    label: "CREATOR WORKS",
    title: "Creator Works",
    body: "작가 및 외부 크리에이터 기반 콘텐츠입니다. 프리뷰 접근과 실제 사용 권리를 분리해서 읽히게 해야 합니다.",
    ctaLabel: "크리에이터 보기",
    cta: "/artists",
  },
];

const originals = [
  {
    label: "STANDARD",
    title: "프리미엄, 랜드마크, 강한 첫인상",
    body: "존재감과 상징성이 중요한 공간에 맞는 축입니다.",
    href: "/standard",
  },
  {
    label: "LOCAL",
    title: "균형형, 저피로, 상업공간 친화",
    body: "장시간 운영과 무드 유지가 중요한 공간에 맞는 축입니다.",
    href: "/local",
  },
];

const utilityCards = [
  {
    label: "SEARCH",
    title: "검색은 장식이 아니라 핵심 기능이어야 합니다",
    body: "검색, 필터, 컬렉션, 빠른 칩 선택은 콘텐츠 허브의 중심에 있어야 합니다.",
  },
  {
    label: "SPACE FIT",
    title: "카드는 어디에 맞는지 바로 설명해야 합니다",
    body: "콘텐츠 카드는 소속, 추천 공간, 무드, 비율 정보를 한눈에 보여줘야 합니다.",
  },
  {
    label: "BUSINESS MODEL",
    title: "가격 논리와 브랜드 논리를 섞지 않습니다",
    body: "Open / Originals / Creator는 사업모델 축이고, STANDARD / LOCAL은 브랜드 축입니다.",
  },
];

export default function ContentHub() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <FloatingCTA />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">CONTENT HUB</p>
            <h1 className="max-w-4xl text-display text-[2.8rem] leading-[0.94] text-white md:text-[4.8rem]">
              콘텐츠를 최상위 입구로 두고
              <br />
              Originals 안에 STANDARD / LOCAL을 둡니다
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
              합의한 IA에 더 가깝게 맞춘 버전입니다. 콘텐츠가 최상위 입구가 되고, 이원화된 브랜드 구조는
              LUMOS Originals 아래로 내려가 서로 다른 역할을 분명히 가집니다.
            </p>
          </div>

          <div className="border border-white/8 bg-[#111] p-6">
            <div className="flex items-center gap-2 text-[#93C5FD]">
              <Search className="h-4 w-4" />
              <p className="font-accent text-[11px] tracking-[0.24em]">PRIMARY ACTION</p>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">여기서 바로 검색과 필터로 들어갑니다</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              콘텐츠 허브는 구조만 설명하는 페이지가 아니라, 검색 가능한 카탈로그로 즉시 이어져야 합니다.
              그래서 이 페이지는 개념 설명을 하되 탐색 진입을 전면에 둡니다.
            </p>
            <button
              onClick={() => setLocation("/explore")}
              className="mt-6 inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-sm text-white transition-colors hover:bg-white/5"
            >
              검색 가능한 카탈로그 열기
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-screen-xl gap-5 lg:grid-cols-3">
          {topCategories.map((item) => {
            const Icon = item.label === "OPEN / SAMPLE" ? Search : item.label === "LUMOS ORIGINALS" ? BadgeDollarSign : UserRound;
            return (
              <article key={item.title} className="border border-white/8 bg-[#111] p-6">
                <Icon className={`h-5 w-5 ${item.label === "LUMOS ORIGINALS" ? "text-[#93C5FD]" : item.label === "OPEN / SAMPLE" ? "text-[#D4A843]" : "text-white"}`} />
                <p className="mt-4 font-accent text-[10px] tracking-[0.22em] text-[#909090]">{item.label}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">{item.body}</p>
                <button
                  onClick={() => setLocation(item.cta)}
                  className="mt-6 inline-flex items-center gap-2 font-accent text-[10px] tracking-[0.22em] text-[#D4A843]"
                >
                  {item.ctaLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0b0b0b] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-10 max-w-3xl">
            <p className="font-accent text-xs tracking-[0.26em] text-[#93C5FD]">LUMOS ORIGINALS</p>
            <h2 className="mt-3 text-display text-[2.1rem] leading-tight text-white md:text-[3rem]">
              이원화된 브랜드 논리는 여기서 드러납니다.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {originals.map((item) => (
              <article key={item.label} className="border border-white/8 bg-[#111] p-6">
                <p className={`font-accent text-[10px] tracking-[0.22em] ${item.label === "STANDARD" ? "text-[#D4A843]" : "text-[#93C5FD]"}`}>
                  {item.label}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">{item.body}</p>
                <button
                  onClick={() => setLocation(item.href)}
                  className="mt-6 inline-flex items-center gap-2 font-accent text-[10px] tracking-[0.22em] text-white"
                >
                  {item.label} 자세히 보기
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-screen-xl gap-4 md:grid-cols-3">
          {utilityCards.map((item) => (
            <article key={item.title} className="border border-white/8 bg-[#111] p-5">
              <p className="font-accent text-[10px] tracking-[0.22em] text-[#909090]">{item.label}</p>
              <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
