import { ArrowRight, Eye } from "lucide-react";
import { useLocation } from "wouter";

import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

const mockupCards = [
  {
    label: "MAIN HERO",
    title: "메인에서 바로 보여줄 대표 목업",
    body: "첫 화면에서 구조 설명과 함께 보여주는 장면입니다. 사용자가 공간 적용 이미지를 빠르게 이해하게 합니다.",
    image: "/gallery/ui_37_high_end_gallery_1773146949176.png",
  },
  {
    label: "SHOWROOM",
    title: "브랜드 쇼룸 제안 장면",
    body: "브랜드 톤과 콘텐츠 톤이 함께 읽혀야 하는 상업용 장면입니다.",
    image: "/assets/scenario-dragon-ocean.png",
  },
  {
    label: "IMMERSIVE",
    title: "공간 체감형 설치 장면",
    body: "실제 설치 전에도 화면 규모와 장면 밀도를 설명하는 데 쓰는 컷입니다.",
    image: "/gallery/ui_31_3d_video_room_1773146837149.png",
  },
];

const notes = [
  "목업은 예쁜 참고 이미지가 아니라 제안을 설득하는 장면이어야 합니다.",
  "메인에서는 대표 장면 1~2개만 먼저 보여주고, 공간·솔루션 페이지에서 더 자세히 설명하는 편이 좋습니다.",
  "콘텐츠 상세와 목업을 억지로 섞지 말고, 목업은 세일즈 맥락으로 분리해 두는 게 좋습니다.",
];

export default function MockupGallery() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <FloatingCTA />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#93C5FD]">MOCKUP PAGE</p>
          <h1 className="font-content-heading max-w-4xl text-[2.6rem] text-white md:text-[4.2rem]">
            목업은 참고 이미지가 아니라
            <br />
            공간 적용을 설득하는 장면 모음이어야 합니다
          </h1>
          <p className="font-content-body mt-6 max-w-3xl text-base text-gray-300 md:text-lg">
            이 페이지는 메인과 공간·솔루션 페이지를 보조하는 용도입니다. 장면이 어떤 제안 맥락에 쓰이는지 짧고 명확하게
            설명하는 게 중요합니다.
          </p>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-10 flex items-center gap-2 text-[#93C5FD]">
            <Eye className="h-4 w-4" />
            <div>
              <p className="font-accent text-[11px] tracking-[0.24em]">SELECTED MOCKUPS</p>
              <h2 className="font-content-heading mt-2 text-[2rem] text-white md:text-[2.6rem]">
                지금 구조에서 먼저 보여줄 대표 장면들
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {mockupCards.map((item) => (
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

      <section className="bg-[#0a0a0a] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid gap-4 md:grid-cols-3">
            {notes.map((item) => (
              <div key={item} className="border border-white/8 bg-[#111] p-5">
                <p className="font-content-body text-sm text-gray-300">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setLocation("/spaces")} className="btn-brutalist inline-flex items-center gap-3">
              공간·솔루션 보기
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => setLocation("/contact")} className="btn-brutalist-blue inline-flex items-center gap-3">
              목업 기준 문의
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
