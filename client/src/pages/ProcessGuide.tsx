import { ArrowRight, Building2, Hotel, Landmark, MessageSquare, Store, UtensilsCrossed } from "lucide-react";
import { useLocation } from "wouter";

import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

const spaces = [
  {
    title: "호텔 / 리조트",
    subtitle: "STANDARD + LOCAL",
    body: "첫인상과 체류 경험을 동시에 설계해야 하는 공간입니다. 메인 장면과 운영 무드를 함께 검토해야 합니다.",
    icon: Hotel,
  },
  {
    title: "리테일 / 쇼룸",
    subtitle: "STANDARD 중심",
    body: "브랜드 톤과 시선 집중이 중요한 공간입니다. 시그니처 장면과 강한 인상이 필요합니다.",
    icon: Store,
  },
  {
    title: "F&B",
    subtitle: "LOCAL 중심",
    body: "장시간 운영과 저피로 무드가 중요한 공간입니다. 배경성, 체류감, 과하지 않은 존재감이 핵심입니다.",
    icon: UtensilsCrossed,
  },
  {
    title: "오피스",
    subtitle: "LOCAL 중심",
    body: "브랜드 톤은 유지하되 과장되지 않아야 하는 공간입니다. 공용부와 대기 공간 맥락에 잘 맞습니다.",
    icon: Building2,
  },
  {
    title: "공공 / 전시",
    subtitle: "STANDARD 중심",
    body: "상징성과 설득력이 중요한 공간입니다. 스토리와 장면의 존재감이 더 강하게 읽혀야 합니다.",
    icon: Landmark,
  },
  {
    title: "맞춤 제안",
    subtitle: "문의 중심",
    body: "정형 분류에 딱 맞지 않는 프로젝트는 공간 조건과 설치 문맥부터 함께 정리하는 편이 더 효과적입니다.",
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
    body: "설치 전에도 화면 규모와 장면 밀도를 설명하는 데 쓰는 컷입니다.",
    image: "/gallery/ui_31_3d_video_room_1773146837149.png",
  },
];

export default function ProcessGuide() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <FloatingCTA />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">SPACES / SOLUTIONS</p>
          <h1 className="font-content-heading max-w-4xl text-[2.6rem] text-white md:text-[4.4rem]">
            공간별로 어디에 어떤 콘텐츠를 쓰는지,
            <br />
            목업과 함께 설명하는 페이지가 필요합니다
          </h1>
          <p className="font-content-body mt-6 max-w-3xl text-base text-gray-300 md:text-lg">
            이 페이지는 갤러리가 아니라 세일즈 페이지입니다. 공간 유형, 적용 장면, 추천 방향, 문의 흐름이 한 번에
            읽혀야 합니다.
          </p>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-10 max-w-3xl">
            <p className="font-accent text-xs tracking-[0.26em] text-[#93C5FD]">SPACE TYPES</p>
            <h2 className="font-content-heading mt-3 text-[2rem] text-white md:text-[2.6rem]">
              공간별 적합도는 이미 충분히 설명 가능한 수준입니다
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {spaces.map((space) => {
              const Icon = space.icon;
              return (
                <article key={space.title} className="border border-white/8 bg-[#111] p-6">
                  <Icon className="h-6 w-6 text-[#D4A843]" />
                  <p className="mt-4 font-accent text-[10px] tracking-[0.22em] text-[#93C5FD]">{space.subtitle}</p>
                  <h3 className="font-content-heading mt-3 text-[1.25rem] text-white">{space.title}</h3>
                  <p className="font-content-body mt-4 text-sm text-gray-400">{space.body}</p>
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
            <h2 className="font-content-heading mt-3 text-[2rem] text-white md:text-[2.6rem]">
              목업은 별도 탭보다 공간·솔루션 안에 통합하는 편이 더 자연스럽습니다
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
                  <h3 className="font-content-heading mt-2 text-[1.15rem] text-white">{item.title}</h3>
                  <p className="font-content-body mt-3 text-sm text-gray-400">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050505] px-6 py-20 md:px-10">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-6 border border-[#D4A843]/20 bg-[#D4A843]/8 p-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-content-heading text-[2rem] text-white md:text-[2.5rem]">
              공간 조건만 정리되면, 어떤 콘텐츠를 어떤 방식으로 쓰는지 바로 제안할 수 있습니다.
            </h2>
          </div>
          <button
            onClick={() => setLocation("/contact")}
            className="rounded-full border border-[#D4A843]/30 bg-[#D4A843]/10 px-6 py-3 text-sm text-[#E6C878] hover:bg-[#D4A843]/18"
          >
            도입 문의하기
          </button>
        </div>
      </section>
    </div>
  );
}
