import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search, X, Layers } from "lucide-react";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import { useMarketplace, Artwork } from "@/contexts/MarketplaceContext";
import { deriveCategories } from "@/lib/artworkData";

const CARD_VIDEO_MODE: "hover" | "autoplay" = "hover";

function ArtworkCard({ artwork, onClick }: { artwork: Artwork; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
      className="gallery-card gallery-card-local group cursor-pointer"
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
        {artwork.videoSrc && (
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
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="font-accent text-[9px] tracking-[0.24em] text-[#93C5FD] bg-black/50 backdrop-blur-sm px-2.5 py-1 border border-[#93C5FD]/20">
            HOVER PREVIEW
          </div>
        </div>
      </div>
      <div className="px-3.5 py-3">
        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-1 mb-2 group-hover:text-[#93C5FD] transition-colors duration-200">
          {artwork.title}
        </h3>
        <span className="inline-block font-accent text-[10px] tracking-widest text-[#93C5FD] bg-[#93C5FD]/10 px-2 py-0.5">
          {artwork.category}
        </span>
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

export default function LocalWorld() {
  const [, setLocation] = useLocation();
  const { artworks } = useMarketplace();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const localArtworks = useMemo(
    () => artworks.filter((artwork) => artwork.worldType === "local"),
    [artworks],
  );

  const localCategories = useMemo(
    () => deriveCategories(artworks, "local"),
    [artworks],
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredArtworks = useMemo(() => {
    let result = activeFilter === "All"
      ? localArtworks
      : localArtworks.filter((art) => art.category === activeFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeFilter, localArtworks, searchQuery]);

  const handleContactClick = () => {
    window.dispatchEvent(new CustomEvent("open-contact"));
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <FloatingCTA />

      <section className="relative h-[65vh] flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source src="/videos/local/yeonhwa.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-12 md:px-20 pb-16 md:pb-20">
          <p className="font-accent text-[10px] tracking-[0.6em] text-[#93C5FD] mb-5">
            KOREAN COMMERCIAL ART
          </p>
          <h1 className="text-display font-light text-[4rem] md:text-[5rem] leading-none text-[#e0e0e0] mb-5 text-shadow-strong tracking-tight">
            LOCAL
          </h1>
          <p className="text-lg text-[#aaaaaa] font-light max-w-xl text-shadow-medium tracking-wide">
            LOCAL — 공간과 조화하는 한국적 콘텐츠
          </p>
        </div>
      </section>

      <section className="py-24 px-4 md:px-8">
        <div className="w-full">
          <div className="relative mb-10 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="작품명 또는 카테고리로 검색..."
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

          <div className="flex flex-wrap gap-2.5 mb-12">
            {localCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`filter-pill ${activeFilter === category ? "filter-pill-active-local" : ""}`}
              >
                {category}
              </button>
            ))}
          </div>

          {(searchQuery || activeFilter !== "All") && !isLoading && (
            <p className="font-accent text-xs tracking-widest text-gray-600 mb-8">
              {filteredArtworks.length}개 작품
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredArtworks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1">
              {filteredArtworks.map((artwork) => (
                <ArtworkCard
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
                onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                className="font-accent text-xs tracking-widest text-[#93C5FD] border border-[#93C5FD]/30 px-6 py-3 hover:bg-[#93C5FD]/10 transition-colors"
              >
                전체 작품 보기
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-36 px-12 md:px-20 bg-[#030303] border-t border-white/5 relative z-10">
        <div className="max-w-3xl">
          <p className="font-accent text-[10px] tracking-[0.6em] text-[#93C5FD] mb-6">
            CONTACT
          </p>
          <h2 className="text-display font-light text-[3rem] md:text-[3.5rem] leading-tight text-[#e0e0e0] mb-8">
            공간에 숨결을 더하는 빛
          </h2>
          <p className="text-lg text-[#aaaaaa] font-light mb-12 leading-[2] max-w-xl tracking-wide">
            LUMOS LOCAL은 카페, 레스토랑, 호텔, 상업 공간을 위한 감성형 미디어아트 컬렉션입니다.
          </p>
          <button onClick={handleContactClick} className="btn-brutalist-blue">
            Contact Us
          </button>
        </div>
      </section>

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
            <p className="text-xs text-gray-700 mt-1">© 2026 THISGLOBAL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
