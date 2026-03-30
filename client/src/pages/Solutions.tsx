import { Building2, Hotel, Landmark, MessageSquare, Store, UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";

import Header from "@/components/Header";

const spaces = [
  {
    title: "호텔 / 리조트",
    subtitle: "STANDARD + LOCAL",
    description: "첫인상과 체류 경험을 함께 잡아야 하는 공간입니다. 메인 장면은 STANDARD, 운영 무드는 LOCAL이 함께 검토됩니다.",
    icon: Hotel,
  },
  {
    title: "리테일 / 쇼룸",
    subtitle: "STANDARD 중심",
    description: "브랜드 톤과 시선 집중이 중요한 공간입니다. 시그니처 비주얼과 강한 첫인상이 필요합니다.",
    icon: Store,
  },
  {
    title: "F&B",
    subtitle: "LOCAL 중심",
    description: "장시간 송출과 저피로 운영이 중요한 공간입니다. 분위기 유지와 배경성의 밸런스가 핵심입니다.",
    icon: UtensilsCrossed,
  },
  {
    title: "오피스",
    subtitle: "LOCAL 중심",
    description: "브랜드 톤을 유지하되 과하지 않아야 하는 공간입니다. 공용부, 회의 인접부, 대기 공간에 적합합니다.",
    icon: Building2,
  },
  {
    title: "공공 / 전시",
    subtitle: "STANDARD 중심",
    description: "상징성과 설득력이 중요한 공간입니다. 스토리와 장면의 존재감이 더 강하게 읽혀야 합니다.",
    icon: Landmark,
  },
  {
    title: "맞춤 제안",
    subtitle: "문의 중심",
    description: "정형 분류에 딱 맞지 않는 프로젝트는 공간 조건과 설치 문맥부터 같이 정리하는 편이 더 효과적입니다.",
    icon: MessageSquare,
  },
];

const mockups = [
  {
    label: "LOBBY HERO",
    title: "호텔 / 로비 대표 목업",
    body: "강한 첫인상과 상징성이 중요한 공간에 맞는 장면입니다.",
    image: "/assets/scenario-gwanghwamun.png",
  },
  {
    label: "SHOWROOM",
    title: "브랜드 쇼룸 목업",
    body: "브랜드 톤과 콘텐츠 톤이 함께 읽혀야 하는 제안 장면입니다.",
    image: "/assets/scenario-dragon-ocean.png",
  },
  {
    label: "IMMERSIVE",
    title: "공간 체감형 목업",
    body: "실제 설치 전에 장면 밀도와 화면 규모를 설명하는 데 쓰는 컷입니다.",
    image: "/gallery/ui_31_3d_video_room_1773146837149.png",
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">SPACES / SOLUTIONS</p>
          <h1 className="max-w-4xl text-display text-[2.8rem] leading-[0.94] text-white md:text-[4.8rem]">
            목업은 별도 탭보다
            <br />
            공간/솔루션 안에서 같이 보여주는 편이 더 자연스럽습니다
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
            이 페이지는 공간 유형, 적용 목업, 추천 방향, 문의 흐름을 한 번에 묶는 세일즈 페이지입니다.
            갤러리처럼 보이기보다 문제 해결형으로 읽히게 하는 것이 핵심입니다.
          </p>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-10 max-w-3xl">
            <p className="font-accent text-xs tracking-[0.26em] text-[#93C5FD]">SPACE TYPES</p>
            <h2 className="mt-3 text-display text-[2.1rem] leading-tight text-white md:text-[3rem]">
              공간별로 어떤 콘텐츠 축이 맞는지 먼저 설명합니다.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {spaces.map((space) => {
              const Icon = space.icon;
              return (
                <article key={space.title} className="border border-white/8 bg-[#111] p-6">
                  <Icon className="h-6 w-6 text-[#D4A843]" />
                  <p className="mt-4 font-accent text-[10px] tracking-[0.22em] text-[#93C5FD]">{space.subtitle}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{space.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-gray-400">{space.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0b0b0b] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-10 max-w-3xl">
            <p className="font-accent text-xs tracking-[0.26em] text-[#D4A843]">MOCKUPS IN CONTEXT</p>
            <h2 className="mt-3 text-display text-[2.1rem] leading-tight text-white md:text-[3rem]">
              공간 목업은 이 페이지 안에서 바로 보여주는 편이 더 설득력 있습니다.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {mockups.map((item) => (
              <article key={item.title} className="overflow-hidden border border-white/8 bg-[#111]">
                <div className="aspect-[16/11] overflow-hidden bg-[#0a0a0a]">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="font-accent text-[10px] tracking-[0.22em] text-[#93C5FD]">{item.label}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050505] px-6 py-20 md:px-10">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-6 border border-[#D4A843]/20 bg-[#D4A843]/8 p-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-display text-[2rem] leading-tight text-white md:text-[2.8rem]">
              공간 조건만 정리되면, 어떤 콘텐츠를 어떤 방식으로 쓰는지 바로 제안할 수 있습니다.
            </h2>
          </div>
          <Link to="/contact">
            <span className="inline-block border border-[#D4A843]/30 bg-[#D4A843]/10 px-6 py-3 text-sm text-[#E6C878] hover:bg-[#D4A843]/18">
              도입 문의하기
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
