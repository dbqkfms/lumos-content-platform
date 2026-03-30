import { ArrowRight, Building2, Hotel, Landmark, Store, UtensilsCrossed, Monitor, FileCheck, Scaling } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

/* ------------------------------------------------------------------ */
/*  Space-type solution cards                                          */
/* ------------------------------------------------------------------ */

const spaceTypes = [
  {
    key: "hotel",
    title: "호텔 & 리조트",
    subtitle: "HOSPITALITY",
    icon: Hotel,
    world: "STANDARD",
    worldColor: "#D4A843",
    image: "/assets/scenario-gwanghwamun.png",
    description:
      "로비의 첫인상을 결정짓는 히어로 콘텐츠와 객실층 공용부의 운영형 콘텐츠를 함께 설계합니다. 체크인부터 체크아웃까지, 빛으로 체류 경험을 완성합니다.",
    tags: ["로비 히어로월", "엘리베이터 홀", "라운지 배경"],
  },
  {
    key: "gallery",
    title: "갤러리 & 뮤지엄",
    subtitle: "CULTURE",
    icon: Landmark,
    world: "STANDARD",
    worldColor: "#D4A843",
    image: "/assets/scenario-dragon-ocean.png",
    description:
      "전시 서사의 도입부와 마무리를 디지털 영상으로 확장합니다. 작품과 공간 사이의 전환을 자연스럽게 연결하는 상징적 콘텐츠를 제안합니다.",
    tags: ["전시 도입부", "미디어 파사드", "상설 전시"],
  },
  {
    key: "fnb",
    title: "F&B",
    subtitle: "DINING & CAFE",
    icon: UtensilsCrossed,
    world: "LOCAL",
    worldColor: "#93C5FD",
    image: "/assets/scenario-nature-forest.png",
    description:
      "장시간 체류에도 피로감 없는 배경 콘텐츠를 설계합니다. 과하지 않으면서도 공간의 무드를 유지하고, 반복 재생 안정성을 최우선으로 검토합니다.",
    tags: ["카페 배경월", "레스토랑 앰비언트", "바 무드"],
  },
  {
    key: "retail",
    title: "리테일",
    subtitle: "BRAND SPACE",
    icon: Store,
    world: "STANDARD",
    worldColor: "#D4A843",
    image: "/assets/scenario-korean-tradition.png",
    description:
      "시그니처 월과 쇼윈도에서 브랜드 정체성을 시각적으로 강화합니다. 화면이 인테리어의 일부가 되는 몰입형 브랜드 경험을 만듭니다.",
    tags: ["시그니처 월", "쇼윈도", "체험존"],
  },
  {
    key: "office",
    title: "오피스",
    subtitle: "WORKSPACE",
    icon: Building2,
    world: "LOCAL",
    worldColor: "#93C5FD",
    image: "/images/mockups/gallery.png",
    description:
      "오피스 로비와 라운지에서 브랜드 톤을 유지하면서도 절제된 분위기를 연출합니다. 방문자 임팩트와 일상 운영의 균형을 잡아드립니다.",
    tags: ["로비 월", "라운지", "회의실 앰비언트"],
  },
];

/* ------------------------------------------------------------------ */
/*  Mockup showcase thumbnails                                         */
/* ------------------------------------------------------------------ */

const mockupShowcase = [
  { src: "/assets/scenario-gwanghwamun.png", label: "광화문 미디어 프로젝션" },
  { src: "/assets/scenario-dragon-ocean.png", label: "이머시브 전시 — 용과 바다" },
  { src: "/assets/scenario-nature-forest.png", label: "자연 몰입 전시관" },
  { src: "/assets/scenario-korean-tradition.png", label: "한국 전통 리이매진드" },
  { src: "/images/mockups/gallery.png", label: "갤러리 미디어월" },
  { src: "/images/mockups/video-room.png", label: "이머시브 비디오 룸" },
];

/* ------------------------------------------------------------------ */
/*  Licensing info                                                     */
/* ------------------------------------------------------------------ */

const licensingInfo = [
  {
    icon: FileCheck,
    label: "LICENSING",
    title: "라이선스 범위",
    body: "공개 프리뷰, 상업 도입, 행사성 사용, 반복 송출 등 사용 범위에 따라 라이선스를 구분합니다. 단일 공간부터 다점포 운영까지, 필요한 조건에 맞춰 제안합니다.",
  },
  {
    icon: Scaling,
    label: "RESIZING",
    title: "화면 비율 대응",
    body: "가로형(16:9), 세로형(9:16), 파사드형(초와이드) 등 다양한 디스플레이 비율에 맞춰 리사이즈하거나 적합한 작품을 재추천합니다.",
  },
  {
    icon: Monitor,
    label: "MATCHING",
    title: "공간 매칭 제안",
    body: "LED 하드웨어 사양, 설치 환경, 공간 목적을 먼저 파악한 뒤 STANDARD와 LOCAL 조합으로 최적의 콘텐츠 구성을 설계합니다.",
  },
];

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export default function SolutionsPage() {
  const [, setLocation] = useLocation();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <FloatingCTA />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/5 px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40">
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source src="/videos/standard/crystal-chandelier.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/50 to-[#050505]" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,168,67,0.08),transparent)]" />
        <div className="relative mx-auto max-w-screen-xl">
          <p className="font-accent text-xs tracking-[0.28em] text-[#D4A843]">SOLUTIONS</p>
          <h1 className="mt-5 max-w-5xl text-display text-[2.6rem] leading-[1.02] text-white md:text-[4.5rem] md:leading-[0.94]">
            공간의 목적에 맞는
            <br />
            콘텐츠를 제안합니다
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
            LUMOS는 영상 카탈로그가 아닙니다.
            공간 유형과 운영 목적에 맞춰 콘텐츠를 선별하고, 디스플레이 환경에 최적화된 도입 방안을 함께 제안합니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
              className="btn-brutalist"
            >
              도입 문의하기
            </button>
            <button
              onClick={() => setLocation("/originals")}
              className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white transition-colors hover:bg-white/[0.06]"
            >
              라이브러리 둘러보기
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Space Type Cards (5) ── */}
      <section className="border-b border-white/5 bg-[#090909] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-12">
            <p className="font-accent text-[10px] tracking-[0.26em] text-[#D4A843]">SPACE TYPES</p>
            <h2 className="mt-3 text-display text-[2rem] text-white md:text-[2.8rem]">
              5가지 공간 유형별 솔루션
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
              각 공간에는 고유한 운영 조건과 시각적 요구가 있습니다.
              LUMOS는 STANDARD(상징성/장악력)와 LOCAL(운영 적합성/공간 조화) 두 축으로 최적의 조합을 설계합니다.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {spaceTypes.map((space) => (
              <article
                key={space.key}
                className="group cursor-pointer overflow-hidden border border-white/8 bg-[#111] transition-all duration-300 hover:border-white/16"
                onMouseEnter={() => setActiveCard(space.key)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
                  <img
                    src={space.image}
                    alt={space.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                  {/* World badge */}
                  <span
                    className="absolute right-4 top-4 border px-3 py-1 text-[10px] font-medium tracking-[0.18em]"
                    style={{
                      color: space.worldColor,
                      borderColor: `${space.worldColor}40`,
                      backgroundColor: `${space.worldColor}12`,
                    }}
                  >
                    {space.world}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <space.icon className="h-5 w-5 text-[#D4A843]" />
                    <p className="font-accent text-[10px] tracking-[0.22em]" style={{ color: space.worldColor }}>
                      {space.subtitle}
                    </p>
                  </div>
                  <h3 className="mt-3 text-display text-[1.6rem] text-white">{space.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{space.description}</p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {space.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Hover CTA */}
                  <div
                    className="mt-5 overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: activeCard === space.key ? "60px" : "0",
                      opacity: activeCard === space.key ? 1 : 0,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(
                          new CustomEvent("open-contact", {
                            detail: { prefill: `${space.title} 공간` },
                          })
                        );
                      }}
                      className="inline-flex items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-[#D4A843] transition-colors hover:text-[#e8c060]"
                    >
                      이 공간에 맞는 콘텐츠 문의
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mockup Showcase ── */}
      <section className="border-b border-white/5 bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-12">
            <p className="font-accent text-[10px] tracking-[0.26em] text-[#93C5FD]">SIMULATION</p>
            <h2 className="mt-3 text-display text-[2rem] text-white md:text-[2.8rem]">
              LED 디스플레이 적용 시뮬레이션
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
              실제 공간에 LUMOS 콘텐츠가 적용된 모습을 미리 확인할 수 있습니다.
              도입 전 시뮬레이션을 통해 공간과 콘텐츠의 조화를 검증합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
            {mockupShowcase.map((item, i) => (
              <div key={i} className="group relative overflow-hidden border border-white/8 bg-[#0a0a0a]">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Overlay label */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-10">
                  <p className="font-accent text-[11px] tracking-[0.16em] text-white/80">{item.label}</p>
                </div>
                {/* Simulated display border */}
                <div className="pointer-events-none absolute inset-0 border-[3px] border-white/[0.06]" />
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-gray-600">
            * 위 이미지는 실제 적용 예시가 아닌 시뮬레이션 참고용입니다.
          </p>
        </div>
      </section>

      {/* ── Licensing / Resizing / Matching ── */}
      <section className="border-b border-white/5 bg-[#050505] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-12 text-center">
            <p className="font-accent text-[10px] tracking-[0.26em] text-[#D4A843]">SERVICE</p>
            <h2 className="mt-3 text-display text-[2rem] text-white md:text-[2.8rem]">
              라이선싱 &middot; 리사이징 &middot; 공간 매칭
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
              콘텐츠 선택 이후의 실무까지 LUMOS가 함께합니다.
              라이선스 범위 설정부터 디스플레이 비율 대응, 공간 맞춤 큐레이션까지 원스톱으로 진행합니다.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {licensingInfo.map((item) => (
              <article key={item.label} className="border border-white/8 bg-[#111] p-8">
                <item.icon className="h-7 w-7 text-[#D4A843]" />
                <p className="mt-5 font-accent text-[10px] tracking-[0.22em] text-[#D4A843]">{item.label}</p>
                <h3 className="mt-3 text-display text-[1.5rem] text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#050505] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-screen-xl text-center">
          <div className="relative mx-auto max-w-3xl border border-[#D4A843]/20 bg-[#111] px-8 py-14 md:px-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(212,168,67,0.06),transparent)]" />
            <p className="font-accent text-[10px] tracking-[0.26em] text-[#D4A843]">GET STARTED</p>
            <h2 className="mt-4 text-display text-[2rem] text-white md:text-[2.6rem]">
              공간에 맞는 콘텐츠,
              <br />
              지금 바로 문의하세요
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
              적용 공간의 유형, 디스플레이 환경, 운영 목적을 알려주시면
              LUMOS가 최적의 콘텐츠 조합과 라이선스 조건을 제안드립니다.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
              className="btn-brutalist mt-8 inline-flex items-center gap-2"
            >
              문의 시작
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
