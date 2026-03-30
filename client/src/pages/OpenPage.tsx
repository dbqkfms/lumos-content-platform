import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search, X, Layers, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import { useLibraryCollections, type LibraryArtwork } from "@/hooks/useLibraryCollections";

const CARD_VIDEO_MODE: "hover" | "autoplay" = "hover";

const quickFilters = ["전체", "최신", "추천", "STANDARD", "LOCAL"];
const spaceFilters = ["전체", "가로형", "세로형", "카페", "로비", "쇼룸", "리테일", "호텔"];

function isVimeoUrl(src?: string) {
  return !!src && (src.includes("vimeo.com") || src.includes("player.vimeo.com"));
}

function OpenArtworkCard({ artwork, onClick }: { artwork: LibraryArtwork; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const accent = artwork.accent === "gold" ? "#D4A843" : "#93C5FD";
  const isVimeo = isVimeoUrl(artwork.videoSrc);
  const showHoverVideo = !!artwork.videoSrc && !isVimeo;

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
            src={artwork.videoSrc}
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
          className="text-sm font-semibold text-white leading-tight line-clamp-1 mb-1.5 transition-colors duration-200"
          style={{ ["--hover-color" as string]: accent }}
          onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "")}
        >
          {artwork.title}
        </h3>
        <div className="flex items-center gap-2">
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

export default function OpenPage() {
  const [, setLocation] = useLocation();
  const { openWorks, featuredOpenWorks } = useLibraryCollections();
  const [activeQuick, setActiveQuick] = useState("전체");
  const [activeFilter, setActiveFilter] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredArtworks = useMemo(() => {
    let pool = openWorks;

    if (activeQuick === "STANDARD") {
      pool = openWorks.filter((a) => a.world === "standard");
    } else if (activeQuick === "LOCAL") {
      pool = openWorks.filter((a) => a.world === "local");
    } else if (activeQuick === "추천") {
      pool = featuredOpenWorks;
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
  }, [activeQuick, activeFilter, openWorks, featuredOpenWorks, searchQuery]);

  const handleContactClick = () => {
    window.dispatchEvent(new CustomEvent("open-contact"));
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <FloatingCTA />

      {/* --- Hero with Video Background --- */}
      <section className="relative h-[65vh] flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source src="/videos/local/baekran.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-12 md:px-20 pb-16 md:pb-20">
          <p className="font-accent text-[10px] tracking-[0.6em] text-[#93C5FD] mb-5">
            OPEN / FREE COLLECTION
          </p>
          <h1 className="text-display font-light text-[4rem] md:text-[5rem] leading-none text-[#e0e0e0] mb-5 text-shadow-strong tracking-tight">
            OPEN
          </h1>
          <p className="text-lg text-[#aaaaaa] font-light max-w-xl text-shadow-medium tracking-wide">
            무드와 공간 적합도를 빠르게 확인하세요
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
              placeholder="작품명, 공간, 무드, 태그로 검색..."
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

          {/* Space filter tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            <span className="font-accent text-[10px] tracking-[0.18em] text-gray-600 self-center mr-2">
              공간별
            </span>
            {spaceFilters.map((filter) => (
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

          {/* Featured picks row */}
          {activeQuick === "전체" && !searchQuery && activeFilter === "전체" && !isLoading && featuredOpenWorks.length > 0 && (
            <div className="mb-16">
              <div className="mb-4 flex items-center gap-2 text-[#D4A843]">
                <Sparkles className="h-4 w-4" />
                <p className="font-accent text-[11px] tracking-[0.24em]">EDITOR'S PICK</p>
              </div>
              <h2 className="text-display text-[1.8rem] text-white mb-8">추천 오픈 컬렉션</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1">
                {featuredOpenWorks.slice(0, 5).map((artwork) => (
                  <OpenArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onClick={() => setLocation(`/artwork/${artwork.id}`)}
                  />
                ))}
              </div>
            </div>
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
                <OpenArtworkCard
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

      {/* --- Dual World Preview --- */}
      <section className="py-20 px-12 md:px-20 bg-[#030303] border-t border-white/5 relative z-10">
        <p className="mb-8 text-center font-accent text-[10px] tracking-[0.28em] text-gray-500">
          ORIGINALS 미리 보기
        </p>
        <div className="grid gap-4 md:grid-cols-2 max-w-screen-xl mx-auto">
          <button
            type="button"
            onClick={() => setLocation("/standard")}
            className="group relative overflow-hidden border border-[#D4A843]/15 text-left transition-all hover:border-[#D4A843]/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4A843]/8 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative grid grid-cols-3 gap-1 p-1">
              {["/thumbnails/bonghwang.jpg", "/thumbnails/cosmic-flow.jpg", "/thumbnails/hwanggwang.jpg"].map((src) => (
                <div key={src} className="aspect-[16/10] overflow-hidden bg-[#111]">
                  <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="relative p-5">
              <p className="font-accent text-[10px] tracking-[0.22em] text-[#D4A843]">STANDARD</p>
              <h3 className="mt-2 text-xl font-semibold text-white">공간을 지배하는 강렬한 임팩트</h3>
              <span className="mt-4 inline-flex items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-[#D4A843]">
                STANDARD 보기
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLocation("/local")}
            className="group relative overflow-hidden border border-[#93C5FD]/15 text-left transition-all hover:border-[#93C5FD]/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#93C5FD]/8 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative grid grid-cols-3 gap-1 p-1">
              {["/thumbnails/baekran.jpg", "/thumbnails/cheongpung.jpg", "/thumbnails/changsal.jpg"].map((src) => (
                <div key={src} className="aspect-[16/10] overflow-hidden bg-[#111]">
                  <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="relative p-5">
              <p className="font-accent text-[10px] tracking-[0.22em] text-[#93C5FD]">LOCAL</p>
              <h3 className="mt-2 text-xl font-semibold text-white">공간과 조화하는 저피로 콘텐츠</h3>
              <span className="mt-4 inline-flex items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-[#93C5FD]">
                LOCAL 보기
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* --- Contact CTA --- */}
      <section className="py-36 px-12 md:px-20 bg-[#030303] border-t border-white/5 relative z-10">
        <div className="max-w-3xl">
          <p className="font-accent text-[10px] tracking-[0.6em] text-[#93C5FD] mb-6">
            NEXT STEP
          </p>
          <h2 className="text-display font-light text-[3rem] md:text-[3.5rem] leading-tight text-[#e0e0e0] mb-8">
            전체 라이브러리를 탐색하세요
          </h2>
          <p className="text-lg text-[#aaaaaa] font-light mb-12 leading-[2] max-w-xl tracking-wide">
            오픈 컬렉션에서 감을 잡은 뒤, Originals 또는 맞춤 제안으로 넘어갑니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setLocation("/originals")} className="btn-brutalist-blue">
              Originals 보기
            </button>
            <button onClick={handleContactClick} className="btn-brutalist">
              도입 문의하기
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
