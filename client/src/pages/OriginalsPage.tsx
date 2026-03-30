import { ArrowRight, Crown, Layers, MapPinned, Sparkles, Waves } from "lucide-react";
import { useLocation } from "wouter";

import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import LibraryArtworkCard from "@/components/LibraryArtworkCard";
import { useLibraryCollections } from "@/hooks/useLibraryCollections";

const standardShowcase = [
  { src: "/thumbnails/bonghwang.jpg", title: "봉황", mood: "압도적 존재감" },
  { src: "/thumbnails/cosmic-flow.jpg", title: "Cosmic Flow", mood: "우주적 몰입" },
  { src: "/thumbnails/hwanggwang.jpg", title: "황광", mood: "황금빛 장악력" },
  { src: "/thumbnails/quantum-forms.jpg", title: "Quantum Forms", mood: "기하학적 긴장" },
  { src: "/thumbnails/heukryong.jpg", title: "흑룡", mood: "신화적 상징" },
  { src: "/thumbnails/cosmic-sphere.jpg", title: "Cosmic Sphere", mood: "공간 지배력" },
];

const localShowcase = [
  { src: "/thumbnails/baekran.jpg", title: "백란", mood: "고요한 여백" },
  { src: "/thumbnails/cheongpung.jpg", title: "청풍", mood: "바람결 흐름" },
  { src: "/thumbnails/changsal.jpg", title: "창살", mood: "한국적 질감" },
  { src: "/thumbnails/seonwon.jpg", title: "선원", mood: "명상적 고요" },
  { src: "/thumbnails/mukhyang.jpg", title: "묵향", mood: "먹의 여운" },
  { src: "/thumbnails/sansu.jpg", title: "산수", mood: "자연 조화" },
];

export default function OriginalsPage() {
  const [, setLocation] = useLocation();
  const { originalsStandard, originalsLocal, featuredOriginals } = useLibraryCollections();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <FloatingCTA />

      {/* --- Hero --- */}
      <section className="border-b border-white/5 px-6 pb-14 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 border border-[#D4A843]/20 bg-[#D4A843]/5 px-3 py-1.5">
                <Crown className="h-3.5 w-3.5 text-[#D4A843]" />
                <span className="font-accent text-[10px] tracking-[0.24em] text-[#D4A843]">LUMOS ORIGINALS</span>
              </div>
              <h1 className="mt-6 text-display text-[2.8rem] leading-[0.94] text-white md:text-[4.8rem]">
                하나의 브랜드,
                <br />
                두 개의 세계
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
                STANDARD는 공간을 지배하는 강렬한 임팩트,
                LOCAL은 공간과 조화하는 저피로 콘텐츠.
                두 라인의 톤 차이를 레이아웃과 영상 밀도로 먼저 읽히게 만듭니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => setLocation("/standard")} className="btn-brutalist inline-flex items-center gap-2">
                  <Crown className="h-3.5 w-3.5" />
                  STANDARD 탐색
                </button>
                <button onClick={() => setLocation("/local")} className="btn-brutalist-blue inline-flex items-center gap-2">
                  <Waves className="h-3.5 w-3.5" />
                  LOCAL 탐색
                </button>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <article className="border border-[#D4A843]/20 bg-gradient-to-b from-[#D4A843]/5 to-transparent p-6">
                <Crown className="h-5 w-5 text-[#D4A843]" />
                <p className="mt-3 font-accent text-[10px] tracking-[0.22em] text-[#D4A843]">STANDARD</p>
                <h2 className="mt-3 text-display text-[1.6rem] text-white">공간을 지배하는 히어로 라인</h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  랜드마크, 입구, 프리미엄 로비, 이벤트 오프닝처럼 첫인상과 상징성이 먼저 필요한 경우에 맞습니다.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["랜드마크", "로비", "이벤트", "브랜드"].map((tag) => (
                    <span key={tag} className="border border-[#D4A843]/20 px-2 py-1 text-[10px] text-[#D4A843]/80">{tag}</span>
                  ))}
                </div>
              </article>
              <article className="border border-[#93C5FD]/20 bg-gradient-to-b from-[#93C5FD]/5 to-transparent p-6">
                <Waves className="h-5 w-5 text-[#93C5FD]" />
                <p className="mt-3 font-accent text-[10px] tracking-[0.22em] text-[#93C5FD]">LOCAL</p>
                <h2 className="mt-3 text-display text-[1.6rem] text-white">공간과 오래 조화되는 운영 라인</h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  카페, F&B, 리테일, 오피스, 호텔 공용부처럼 장시간 재생과 낮은 피로도가 중요한 경우에 맞습니다.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["카페", "리테일", "오피스", "호텔"].map((tag) => (
                    <span key={tag} className="border border-[#93C5FD]/20 px-2 py-1 text-[10px] text-[#93C5FD]/80">{tag}</span>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* --- Split Video Hero --- */}
      <section className="relative border-b border-white/5">
        <div className="grid min-h-[82vh] md:grid-cols-2">
          <button type="button" onClick={() => setLocation("/standard")} className="group relative overflow-hidden text-left">
            <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
              <source src="/videos/standard/hwamun.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/30 to-black/90" />
            <div className="relative flex min-h-[41vh] flex-col justify-end px-8 py-12 md:min-h-[82vh] md:px-12 md:py-16">
              <p className="font-accent text-xs tracking-[0.24em] text-[#D4A843]">STANDARD</p>
              <h2 className="mt-4 text-display text-[3rem] leading-none text-white md:text-[4.8rem]">One Brand, Hero First</h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-300">
                강한 첫 장면, 상징성, 공간 장악력, 랜드마크 컷이 중요한 프로젝트를 위한 Originals 라인입니다.
              </p>
              <span className="mt-8 inline-flex items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-[#D4A843]">
                Explore STANDARD
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </button>

          <button type="button" onClick={() => setLocation("/local")} className="group relative overflow-hidden text-left">
            <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
              <source src="/videos/local/cheongpung.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/30 to-black/90" />
            <div className="relative flex min-h-[41vh] flex-col justify-end px-8 py-12 md:min-h-[82vh] md:px-12 md:py-16">
              <p className="font-accent text-xs tracking-[0.24em] text-[#93C5FD]">LOCAL</p>
              <h2 className="mt-4 text-display text-[3rem] leading-none text-white md:text-[4.8rem]">One Brand, Long Stay</h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-300">
                저피로 운영, 조화로운 무드, 상업공간 친화성, 장시간 재생 적합성을 위한 Originals 라인입니다.
              </p>
              <span className="mt-8 inline-flex items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-[#93C5FD]">
                Explore LOCAL
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* --- STANDARD Showcase --- */}
      <section className="border-b border-white/5 bg-[#090909] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-4 flex items-center gap-2 text-[#D4A843]">
            <Crown className="h-4 w-4" />
            <p className="font-accent text-[11px] tracking-[0.24em]">STANDARD LINE</p>
          </div>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-display text-[2rem] text-white md:text-[3rem]">첫 장면부터 공간을 장악하다</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-400">
                강렬한 비주얼 임팩트와 상징적 메시지를 전달하는 히어로 라인 작품들입니다.
              </p>
            </div>
            <button onClick={() => setLocation("/standard")} className="hidden shrink-0 items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-[#D4A843] md:inline-flex">
              전체 보기
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {standardShowcase.map((item) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setLocation("/standard")}
                className="group overflow-hidden border border-[#D4A843]/10 bg-[#111] text-left transition-all hover:border-[#D4A843]/30"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-0.5 text-[10px] text-[#D4A843]/80">{item.mood}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- LOCAL Showcase --- */}
      <section className="border-b border-white/5 bg-[#080808] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-4 flex items-center gap-2 text-[#93C5FD]">
            <Waves className="h-4 w-4" />
            <p className="font-accent text-[11px] tracking-[0.24em]">LOCAL LINE</p>
          </div>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-display text-[2rem] text-white md:text-[3rem]">공간에 스며드는 고요한 밀도</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-400">
                장시간 재생에도 피로하지 않으면서 공간의 분위기를 완성하는 운영형 콘텐츠입니다.
              </p>
            </div>
            <button onClick={() => setLocation("/local")} className="hidden shrink-0 items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-[#93C5FD] md:inline-flex">
              전체 보기
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {localShowcase.map((item) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setLocation("/local")}
                className="group overflow-hidden border border-[#93C5FD]/10 bg-[#111] text-left transition-all hover:border-[#93C5FD]/30"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-0.5 text-[10px] text-[#93C5FD]/80">{item.mood}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- Featured Originals Cards --- */}
      <section className="border-b border-white/5 bg-[#090909] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-4 flex items-center gap-2 text-[#D4A843]">
            <Sparkles className="h-4 w-4" />
            <p className="font-accent text-[11px] tracking-[0.24em]">FEATURED ORIGINALS</p>
          </div>
          <div className="mb-10 flex items-center justify-between gap-4">
            <h2 className="text-display text-[2rem] text-white md:text-[3rem]">대표 컬렉션 미리 보기</h2>
            <button onClick={() => setLocation("/standard")} className="font-accent text-[11px] tracking-[0.18em] text-[#D4A843]">
              전체 Originals 보기
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredOriginals.map((artwork) => (
              <LibraryArtworkCard key={artwork.id} artwork={artwork} onOpen={(id) => setLocation(`/artwork/${id}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* --- Info Grid + CTA --- */}
      <section className="bg-[#050505] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          {/* Positioning Statement */}
          <div className="mb-12 border-l-2 border-[#D4A843]/30 pl-6">
            <p className="max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
              "STANDARD는 공간을 지배하는 강렬한 임팩트, LOCAL은 공간과 조화하는 저피로 콘텐츠"
            </p>
            <p className="mt-3 font-accent text-[10px] tracking-[0.22em] text-gray-500">LUMOS ORIGINALS POSITIONING</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
            <article className="border border-white/8 bg-[#111] p-6">
              <MapPinned className="h-5 w-5 text-[#D4A843]" />
              <h3 className="mt-4 text-xl font-semibold text-white">STANDARD 추천 공간</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                {originalsStandard
                  .flatMap((artwork) => artwork.tags ?? [])
                  .filter((tag, index, array) => array.indexOf(tag) === index)
                  .slice(0, 6)
                  .join(", ") || "랜드마크, 로비, 이벤트홀, 브랜드 플래그십"}
              </p>
            </article>
            <article className="border border-white/8 bg-[#111] p-6">
              <MapPinned className="h-5 w-5 text-[#93C5FD]" />
              <h3 className="mt-4 text-xl font-semibold text-white">LOCAL 추천 공간</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                {originalsLocal
                  .flatMap((artwork) => artwork.tags ?? [])
                  .filter((tag, index, array) => array.indexOf(tag) === index)
                  .slice(0, 6)
                  .join(", ") || "카페, F&B, 리테일, 오피스, 호텔 공용부"}
              </p>
            </article>
            <article className="border border-[#D4A843]/15 bg-gradient-to-b from-[#D4A843]/5 to-[#111] p-6">
              <Layers className="h-5 w-5 text-[#D4A843]" />
              <p className="mt-3 font-accent text-[10px] tracking-[0.22em] text-[#D4A843]">LICENSING</p>
              <h3 className="mt-4 text-xl font-semibold text-white">도입 전에 함께 보는 항목</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                공간 유형, 운영 시간, 화면 크기, 세로/가로 비율, 공개 프리뷰 범위, 납품 이후 수정 가능 범위를 함께 정리합니다.
              </p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
                className="mt-6 inline-flex items-center gap-2 border border-[#D4A843]/30 bg-[#D4A843]/10 px-4 py-2.5 text-sm text-[#E6C878] transition-colors hover:bg-[#D4A843]/18"
              >
                문의 시작하기
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
