import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search, X, Layers, ArrowRight, UserRound, ShieldCheck, Palette, Eye, CheckCircle2, Upload } from "lucide-react";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import { creatorSpotlights, useLibraryCollections, type LibraryArtwork } from "@/hooks/useLibraryCollections";

const CARD_VIDEO_MODE: "hover" | "autoplay" = "hover";

const quickFilters = ["전체", "최신", "추천", "STANDARD", "LOCAL"];
const creatorFilters = ["전체", "가로형", "세로형", "도시", "힐링", "리테일", "호텔"];

const curationSteps = [
  {
    step: "01",
    icon: Upload,
    title: "포트폴리오 제출",
    description: "작가가 기존 작업물과 공간 적용 의향을 포함한 포트폴리오를 제출합니다.",
  },
  {
    step: "02",
    icon: Eye,
    title: "큐레이션 검토",
    description: "영상 품질, 공간 적합도, 상업적 운영 가능성을 내부 기준으로 검토합니다.",
  },
  {
    step: "03",
    icon: ShieldCheck,
    title: "라이선스 협의",
    description: "공개 범위, 사용 권한, 수익 구조, 독점/비독점 조건을 함께 정리합니다.",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "온보딩 및 공개",
    description: "검수 통과 후 라이브러리에 공개되며, 공간 매칭 대상으로 등록됩니다.",
  },
];

function isVimeoUrl(src?: string) {
  return !!src && (src.includes("vimeo.com") || src.includes("player.vimeo.com"));
}

function CreatorArtworkCard({ artwork, onClick }: { artwork: LibraryArtwork; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const accent = artwork.accent === "gold" ? "#D4A843" : "#93C5FD";
  const effectiveVideoSrc = artwork.videoSrc || (artwork as any).embedUrl || undefined;
  const isVimeo = isVimeoUrl(effectiveVideoSrc);
  const showHoverVideo = !!effectiveVideoSrc && !isVimeo;

  const handleMouseEnter = () => {
    if (CARD_VIDEO_MODE === "hover" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (CARD_VIDEO_MODE === "hover" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="gallery-card group cursor-pointer"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden aspect-video bg-[#111]">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {showHoverVideo && (
          <video
            ref={videoRef}
            src={effectiveVideoSrc}
            loop
            muted
            playsInline
            autoPlay={CARD_VIDEO_MODE === "autoplay"}
            className={
              CARD_VIDEO_MODE === "autoplay"
                ? "absolute inset-0 w-full h-full object-cover"
                : "absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            }
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* World badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className="font-accent text-[9px] tracking-[0.18em] px-2 py-0.5 border"
            style={{ borderColor: `${accent}55`, color: accent, backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            {artwork.world === "standard" ? "STANDARD" : "LOCAL"}
          </span>
        </div>
        {/* Creator badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className="font-accent text-[9px] tracking-[0.18em] px-2 py-0.5 border border-[#93C5FD]/30 text-[#93C5FD] bg-black/50">
            CREATOR
          </span>
        </div>
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="font-accent text-[9px] tracking-[0.24em] bg-black/50 backdrop-blur-sm px-2.5 py-1 border"
            style={{ color: accent, borderColor: `${accent}33` }}
          >
            HOVER PREVIEW
          </div>
        </div>
      </div>
      <div className="px-3.5 py-3">
        <h3
          className="text-sm font-semibold text-white leading-tight line-clamp-1 mb-1 transition-colors duration-200 group-hover:text-[#93C5FD]"
        >
          {artwork.title}
        </h3>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-block font-accent text-[10px] tracking-widest px-2 py-0.5"
            style={{ color: accent, backgroundColor: `${accent}18` }}
          >
            {artwork.category}
          </span>
          <span className="text-[10px] text-gray-600 tracking-wider">
            {artwork.displayType === "Vertical" ? "Vertical" : "Horizontal"}
          </span>
        </div>
        {artwork.description && (
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-1">
            {artwork.description}
          </p>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[#0a0a0a] animate-pulse">
      <div className="aspect-video bg-[#111]" />
      <div className="px-3.5 py-3 space-y-2">
        <div className="h-3.5 bg-[#111] rounded w-3/4" />
        <div className="h-3 bg-[#111] rounded w-1/3" />
      </div>
    </div>
  );
}

export default function CreatorWorksPage() {
  const [, setLocation] = useLocation();
  const { creatorWorks, featuredCreatorWorks } = useLibraryCollections();
  const [activeQuick, setActiveQuick] = useState("전체");
  const [activeFilter, setActiveFilter] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredArtworks = useMemo(() => {
    let pool = creatorWorks;

    if (activeQuick === "STANDARD") {
      pool = creatorWorks.filter((a) => a.world === "standard");
    } else if (activeQuick === "LOCAL") {
      pool = creatorWorks.filter((a) => a.world === "local");
    } else if (activeQuick === "추천") {
      pool = featuredCreatorWorks;
    }

    let result = pool.filter((artwork) => {
      const matchesFilter =
        activeFilter === "전체" ||
        (activeFilter === "가로형" && artwork.displayType === "Horizontal") ||
        (activeFilter === "세로형" && artwork.displayType === "Vertical") ||
        (artwork.tags ?? []).some((tag) => tag.includes(activeFilter));
      return matchesFilter;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q) ||
          art.description.toLowerCase().includes(q) ||
          (art.tags ?? []).some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [activeQuick, activeFilter, creatorWorks, featuredCreatorWorks, searchQuery]);

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <FloatingCTA />

      {/* --- Hero with Video Background --- */}
      <section className="relative h-[65vh] flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source src="/videos/local/geometric-journey.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-12 md:px-20 pb-16 md:pb-20">
          <p className="font-accent text-[10px] tracking-[0.6em] text-[#93C5FD] mb-5">
            CURATED CREATOR COLLECTION
          </p>
          <h1 className="text-display font-light text-[4rem] md:text-[5rem] leading-none text-[#e0e0e0] mb-5 text-shadow-strong tracking-tight">
            CREATOR
          </h1>
          <p className="text-lg text-[#aaaaaa] font-light max-w-xl text-shadow-medium tracking-wide">
            큐레이션 레이어를 거쳐 공개되는 작가 작업
          </p>
        </div>
      </section>

      {/* --- Search + Category Filters + Grid --- */}
      <section className="py-24 px-4 md:px-8">
        <div className="w-full">
          {/* Search bar */}
          <div className="relative mb-10 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="작가 작업, 무드, 공간 태그로 검색..."
              className="search-bar search-bar-local"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick filter tabs */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveQuick(filter)}
                className={`filter-pill ${activeQuick === filter ? "filter-pill-active-local" : ""}`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Space/tag filter tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            <span className="font-accent text-[10px] tracking-[0.18em] text-gray-600 self-center mr-2">
              카테고리
            </span>
            {creatorFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 border px-3 py-1.5 font-accent text-[10px] tracking-[0.14em] transition-colors ${
                  activeFilter === filter
                    ? "border-[#93C5FD]/40 bg-[#93C5FD]/10 text-[#93C5FD]"
                    : "border-white/8 text-gray-500 hover:border-white/15 hover:text-gray-300"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Result count */}
          {(searchQuery || activeQuick !== "전체" || activeFilter !== "전체") && !isLoading && (
            <p className="font-accent text-xs tracking-widest text-gray-600 mb-8">
              {filteredArtworks.length}개 작품
            </p>
          )}

          {/* Main grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredArtworks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1">
              {filteredArtworks.map((artwork) => (
                <CreatorArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onClick={() => setLocation(`/artwork/${artwork.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 rounded-full bg-[#93C5FD]/10 flex items-center justify-center mb-6">
                <Layers className="w-7 h-7 text-[#93C5FD]/50" />
              </div>
              <h3 className="text-display text-xl text-white mb-3">검색 결과 없음</h3>
              <p className="text-gray-600 text-sm mb-8 max-w-xs">
                "{searchQuery || activeFilter}"에 해당하는 작품을 찾을 수 없습니다.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveQuick("전체"); setActiveFilter("전체"); }}
                className="font-accent text-xs tracking-widest text-[#93C5FD] border border-[#93C5FD]/30 px-6 py-3 hover:bg-[#93C5FD]/10 transition-colors"
              >
                전체 작품 보기
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- Creator Spotlight (아래로 이동) --- */}
      <section className="py-20 px-12 md:px-20 bg-[#030303] border-t border-white/5 relative z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-4 flex items-center gap-2 text-[#93C5FD]">
            <UserRound className="h-4 w-4" />
            <p className="font-accent text-[11px] tracking-[0.24em]">CREATOR SPOTLIGHT</p>
          </div>
          <h2 className="text-display text-[2rem] text-white mb-10 md:text-[2.5rem]">큐레이터 그룹</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {creatorSpotlights.map((spotlight, index) => (
              <article
                key={spotlight.name}
                className="group border border-white/8 bg-[#111] p-5 transition-all hover:border-[#93C5FD]/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#93C5FD]/20 bg-[#93C5FD]/5">
                    <UserRound className="h-5 w-5 text-[#93C5FD]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{spotlight.name}</h3>
                      <span className="border border-[#93C5FD]/20 px-2 py-0.5 font-accent text-[9px] tracking-[0.18em] text-[#93C5FD]">
                        {spotlight.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{spotlight.description}</p>
                  </div>
                  <span className="shrink-0 font-accent text-3xl text-white/5">0{index + 1}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- Curation Process --- */}
      <section className="py-20 px-12 md:px-20 bg-[#030303] border-t border-white/5 relative z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-4 flex items-center gap-2 text-[#93C5FD]">
            <ShieldCheck className="h-4 w-4" />
            <p className="font-accent text-[11px] tracking-[0.24em]">CURATION PROCESS</p>
          </div>
          <h2 className="mb-4 text-display text-[2rem] text-white md:text-[2.5rem]">큐레이션 프로세스</h2>
          <p className="mb-12 max-w-2xl text-sm leading-relaxed text-gray-400">
            Creator Works의 모든 작품은 아래 검수 단계를 거쳐 라이브러리에 공개됩니다.
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {curationSteps.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.step} className="group relative border border-white/8 bg-[#111] p-6 transition-all hover:border-[#93C5FD]/20">
                  <div className="absolute right-4 top-4 font-accent text-4xl text-white/5">{item.step}</div>
                  <div className="flex h-10 w-10 items-center justify-center border border-[#93C5FD]/20 bg-[#93C5FD]/5">
                    <Icon className="h-5 w-5 text-[#93C5FD]" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.description}</p>
                  <div className="mt-5 h-px bg-gradient-to-r from-[#93C5FD]/20 to-transparent" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- Bottom CTA --- */}
      <section className="py-36 px-12 md:px-20 bg-[#030303] border-t border-white/5 relative z-10">
        <div className="max-w-3xl">
          <p className="font-accent text-[10px] tracking-[0.6em] text-[#93C5FD] mb-6">
            JOIN AS CREATOR
          </p>
          <h2 className="text-display font-light text-[3rem] md:text-[3.5rem] leading-tight text-[#e0e0e0] mb-8">
            작가로 참여하기
          </h2>
          <p className="text-lg text-[#aaaaaa] font-light mb-12 leading-[2] max-w-xl tracking-wide">
            포트폴리오 제출, 샘플 검토, 공개 범위 협의, 라이선스 정책 확인 이후 온보딩을 진행합니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setLocation("/login")} className="btn-brutalist-blue inline-flex items-center gap-2">
              <Palette className="h-3.5 w-3.5" />
              작가 참여 포털
            </button>
            <button onClick={() => setLocation("/open")} className="btn-brutalist">
              공개 컬렉션 보기
            </button>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 px-8 md:px-12 border-t border-white/5 bg-[#030303] relative z-10">
        <div className="w-full flex items-center justify-between">
          <img
            src="/assets/lumos-logo.png"
            alt="LUMOS"
            style={{ height: 32, width: "auto", objectFit: "contain" }}
          />
          <div className="text-right">
            <a
              href="https://www.thisglobal.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-[#93C5FD] transition-colors duration-200 block"
            >
              thisglobal.kr
            </a>
            <p className="text-xs text-gray-700 mt-1">&copy; 2026 THISGLOBAL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
