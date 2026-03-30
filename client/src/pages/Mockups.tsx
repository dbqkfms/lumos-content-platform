import { ArrowRight, Eye } from "lucide-react";
import { useLocation } from "wouter";

import Header from "@/components/Header";

const scenes = [
  {
    label: "LOBBY HERO",
    title: "호텔 / 로비 메인 제안 장면",
    body: "첫인상과 상징성이 중요한 공간에 들어가는 장면입니다.",
    image: "/assets/scenario-gwanghwamun.png",
  },
  {
    label: "SHOWROOM",
    title: "브랜드 쇼룸 적용 장면",
    body: "브랜드 톤과 콘텐츠 톤이 함께 읽혀야 하는 장면입니다.",
    image: "/assets/scenario-dragon-ocean.png",
  },
  {
    label: "IMMERSIVE",
    title: "공간 체감형 목업 장면",
    body: "설치 전에도 화면 규모와 장면 밀도를 설명하는 데 쓰는 컷입니다.",
    image: "/gallery/ui_31_3d_video_room_1773146837149.png",
  },
];

export default function Mockups() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#93C5FD]">MOCKUPS</p>
          <h1 className="max-w-4xl text-display text-[2.8rem] leading-[0.94] text-white md:text-[4.8rem]">
            목업은 참고 이미지가 아니라
            <br />
            제안을 설득하는 장면 모음이어야 합니다
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
            이 페이지는 메인과 콘텐츠 허브에서 설명한 구조가 실제 공간 장면으로 어떻게 이어지는지 보여주는 제안 페이지입니다.
          </p>
        </div>
      </section>

      <section className="bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-10 flex items-center gap-2 text-[#93C5FD]">
            <Eye className="h-4 w-4" />
            <div>
              <p className="font-accent text-[11px] tracking-[0.24em]">SELECTED SCENES</p>
              <h2 className="mt-2 text-display text-[2.1rem] leading-tight text-white md:text-[3rem]">
                지금 구조에서 먼저 보여줄 공간 목업
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {scenes.map((item) => (
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

          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={() => setLocation("/content")} className="inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-sm text-white">
              콘텐츠 허브 열기
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => setLocation("/spaces")} className="inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-sm text-white">
              공간 / 솔루션 열기
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
