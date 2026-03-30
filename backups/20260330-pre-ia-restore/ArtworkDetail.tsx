/*
  ArtworkDetail v4 — Immersive Dark Detail Page
  - Full dark base for both STANDARD and LOCAL
  - STANDARD accent: Gold (#D4A843)
  - LOCAL accent: Blue (#93C5FD)
  - Player tabs: [영상 보기] / [설치 시뮬레이션]
  - Showroom mode (fullscreen black)
  - LUMOS watermark (opacity 0.15)
  - Related artworks: same category, 3-4 items
  - Collapsible description
  - CTA button opens FloatingCTA with artwork name
*/

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Share2, Play, Building2, X, Maximize2, Lock, Unlock } from "lucide-react";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import { useMarketplace, Artwork } from "@/contexts/MarketplaceContext";
import { toast } from "sonner";

type PlayerTab = "video" | "simulation";

// ─── Installation Simulation v3 ─────────────────────────────────────────────
// 15개 환경 × 자동 매칭 엔진 + LED 스크린 임베딩
import { ENVIRONMENTS, matchArtworkToEnvironments, renderEnvironmentBg, getScreenRect } from "@/components/SimulationEnvironments";

function InstallationSimulation({ artwork, accentColor }: { artwork: Artwork; accentColor: string }) {
  const [hoveredScene, setHoveredScene] = useState<number | null>(null);
  const [expandedScene, setExpandedScene] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const isVertical = (artwork as any).displayType === "Vertical";
  const videoSrc = (artwork as any).videoSrc as string | undefined;

  // 작품-환경 자동 매칭
  const matchResults = useMemo(() => matchArtworkToEnvironments(artwork), [artwork]);
  const visibleResults = showAll ? matchResults : matchResults.slice(0, 6);

  const { scr, floorY } = getScreenRect("", isVertical);

  const handleMouseEnter = (idx: number) => {
    setHoveredScene(idx);
    if (videoSrc) videoRefs.current[idx]?.play().catch(() => { });
  };
  const handleMouseLeave = (idx: number) => {
    setHoveredScene(null);
    const v = videoRefs.current[idx];
    if (v) { v.pause(); v.currentTime = 0; }
  };

  // 장면 SVG 렌더 함수
  const renderScene = (envId: string, idx: number, large = false) => {
    const isHovered = hoveredScene === idx || large;
    const uid = `${envId}${idx}${large ? "L" : ""}`;
    const reflectIntensity = isHovered ? 0.7 : 0.35;

    return (
      <svg viewBox="0 0 800 450" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* 환경 배경 */}
        {renderEnvironmentBg(envId, accentColor, floorY, scr, isHovered, uid)}

        {/* 벽면 ambient 글로우 */}
        <rect x="0" y="0" width="800" height="450" fill={`url(#g${uid})`} className="sim-glow-pulse" />

        {/* LED 스크린 프레임 */}
        <rect x={scr.x - 4} y={scr.y - 4} width={scr.w + 8} height={scr.h + 8} fill="#030303" stroke={accentColor} strokeWidth="1.5" strokeOpacity={isHovered ? 0.7 : 0.35} style={{ transition: "stroke-opacity 0.5s" }} />
        <rect x={scr.fx} y={scr.fy} width={scr.fw} height={scr.fh} fill="#080808" />

        {/* 실제 작품 콘텐츠 */}
        <foreignObject x={scr.fx} y={scr.fy} width={scr.fw} height={scr.fh}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden", background: "#080808" }}>
            {(videoSrc && (isHovered || large)) ? (
              <video
                ref={el => { videoRefs.current[idx] = el; }}
                src={videoSrc}
                muted loop playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <img src={artwork.image} alt={artwork.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            )}
          </div>
        </foreignObject>

        {/* LED 스캔라인 */}
        {Array.from({ length: Math.floor(scr.fh / 4) }, (_, i) => (
          <line key={`sl${i}`} x1={scr.fx} y1={scr.fy + i * 4} x2={scr.fx + scr.fw} y2={scr.fy + i * 4} stroke="black" strokeWidth="0.5" opacity="0.08" />
        ))}

        {/* 바닥 빛 반사 */}
        <rect x={scr.x - 60} y={floorY} width={scr.w + 120} height="70" fill={`url(#r${uid})`} style={{ transition: "opacity 0.5s" }} />

        {/* 인물 실루엣 */}
        <g opacity={isHovered ? 0.9 : 0.7} style={{ transition: "opacity 0.5s" }}>
          <ellipse cx={isVertical ? 180 : 120} cy={floorY + 4} rx="16" ry="5" fill="#111" />
          <rect x={isVertical ? 172 : 112} y={floorY - 55} width="16" height="55" rx="8" fill="#151515" />
          <circle cx={isVertical ? 180 : 120} cy={floorY - 68} r="12" fill="#151515" />
          <circle cx={isVertical ? 180 : 120} cy={floorY - 68} r="13" fill="none" stroke={accentColor} strokeWidth="0.5" opacity={isHovered ? 0.3 : 0} style={{ transition: "opacity 0.5s" }} />
        </g>
        <g opacity={isHovered ? 0.9 : 0.7} style={{ transition: "opacity 0.5s" }}>
          <ellipse cx={isVertical ? 620 : 680} cy={floorY + 4} rx="16" ry="5" fill="#111" />
          <rect x={isVertical ? 612 : 672} y={floorY - 60} width="16" height="60" rx="8" fill="#151515" />
          <circle cx={isVertical ? 620 : 680} cy={floorY - 73} r="12" fill="#151515" />
          <circle cx={isVertical ? 620 : 680} cy={floorY - 73} r="13" fill="none" stroke={accentColor} strokeWidth="0.5" opacity={isHovered ? 0.3 : 0} style={{ transition: "opacity 0.5s" }} />
        </g>

        {/* LUMOS 워터마크 */}
        <text x={scr.fx + scr.fw - 8} y={scr.fy + scr.fh - 8} textAnchor="end" fill="white" fontSize="7" fontFamily="monospace" opacity="0.15">LUMOS</text>
      </svg>
    );
  };

  return (
    <>
      <style>{`
        .sim-glow-pulse { animation: simGlowPulse 4s ease-in-out infinite; }
        @keyframes simGlowPulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
        .sim-star { animation: simStarTwinkle 3s ease-in-out infinite; }
        @keyframes simStarTwinkle { 0%,100%{opacity:var(--star-base,0.3)} 50%{opacity:0.8} }
        .sim-chandelier { animation: simFlicker 3s ease-in-out infinite; }
        @keyframes simFlicker { 0%,100%{opacity:0.15} 30%{opacity:0.35} 60%{opacity:0.1} 80%{opacity:0.25} }
        .sim-card { transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
        .sim-card:hover { transform: scale(1.02); }
      `}</style>

      {/* 매칭 결과 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-accent text-[10px] tracking-widest text-gray-500 mb-1">AI 공간 매칭</p>
          <p className="text-sm text-gray-400">
            이 작품에 가장 어울리는 <span style={{ color: accentColor }}>{matchResults.filter(m => m.score > 20).length}개</span> 공간을 추천합니다
          </p>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="font-accent text-[10px] tracking-widest px-4 py-2 border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all"
        >
          {showAll ? `추천 공간만 보기` : `전체 ${ENVIRONMENTS.length}개 보기`}
        </button>
      </div>

      {/* 확대 뷰 */}
      {expandedScene !== null && (
        <div className="mb-8 relative">
          <div className="relative bg-[#080808] border border-white/10 overflow-hidden" style={{ aspectRatio: "16/9", maxHeight: "60vh" }}>
            {renderScene(visibleResults[expandedScene].env.id, expandedScene, true)}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-semibold">{artwork.title}</p>
                  <p className="font-accent text-[10px] tracking-widest text-gray-500 mt-0.5">{visibleResults[expandedScene].env.label}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-accent text-[9px] tracking-wider text-gray-500">{artwork.resolution}</span>
                  <span className="font-accent text-[9px] tracking-wider text-gray-500">{isVertical ? "세로형" : "가로형"}</span>
                  <span className="font-accent text-[9px] tracking-wider px-2 py-0.5 border" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                    매칭 {visibleResults[expandedScene].score}점
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setExpandedScene(null)}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/60 border border-white/10 text-gray-400 hover:text-white hover:bg-black/80 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 환경 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleResults.map((result, idx) => (
          <div
            key={result.env.id}
            className="sim-card relative overflow-hidden bg-transparent border cursor-pointer"
            style={{
              borderColor: hoveredScene === idx ? `${accentColor}40` : "rgba(255,255,255,0.05)",
              boxShadow: hoveredScene === idx ? `0 0 30px ${accentColor}20, 0 0 60px ${accentColor}08` : "none",
              transition: "border-color 0.4s, box-shadow 0.4s",
            }}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={() => handleMouseLeave(idx)}
            onClick={() => setExpandedScene(expandedScene === idx ? null : idx)}
          >
            <div className="aspect-video relative">
              {renderScene(result.env.id, idx)}
            </div>
            <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div>
                <p className="font-accent text-[10px] tracking-widest" style={{ color: hoveredScene === idx ? accentColor : "#6b7280", transition: "color 0.3s" }}>
                  {result.env.desc}
                </p>
                <p className="text-sm text-gray-300 mt-0.5">{result.env.label}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-accent text-[9px] tracking-wider px-2 py-0.5 border" style={{ color: accentColor, borderColor: `${accentColor}30`, opacity: 0.7 }}>
                  {result.score}점
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function ArtworkDetail() {
  const [, params] = useRoute("/artwork/:id");
  const [, setLocation] = useLocation();
  const { artworks, ownedLicenses, acquireArtwork } = useMarketplace();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [descExpanded, setDescExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<PlayerTab>("video");
  const [showroomMode, setShowroomMode] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    const found = artworks.find((art) => art.id === params.id);
    if (found) {
      setArtwork(found);
      const related = artworks
        .filter((art) => art.category === found.category && art.id !== found.id)
        .slice(0, 4);
      setRelatedArtworks(related);
    }
    setActiveTab("video");
    setDescExpanded(false);
    setShowroomMode(false);
  }, [params?.id, artworks]);

  // ESC key to exit showroom
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowroomMode(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!artwork) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-display text-3xl text-white mb-6">작품을 찾을 수 없습니다</h2>
          <button onClick={() => setLocation("/")} className="btn-brutalist">
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const isStandard = artwork.id.startsWith("standard-");
  const accentColor = isStandard ? "#D4A843" : "#93C5FD";
  const accentClass = isStandard ? "text-[#D4A843]" : "text-[#93C5FD]";
  const borderAccent = isStandard ? "border-[#D4A843]/20" : "border-[#93C5FD]/20";
  const btnClass = isStandard ? "btn-brutalist" : "btn-brutalist-blue";
  const videoSrc = (artwork as any).videoSrc as string | undefined;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: artwork.title, text: artwork.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 클립보드에 복사되었습니다.");
    }
  };

  const handleContactClick = () => {
    window.dispatchEvent(new CustomEvent("open-contact", { detail: { artworkName: artwork.title } }));
  };

  // ─── Showroom Mode ─────────────────────────────────────────────────────
  if (showroomMode) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <button
          onClick={() => setShowroomMode(false)}
          className="absolute top-6 right-6 z-10 flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
        >
          <X className="w-4 h-4" />
          <span className="font-accent text-xs tracking-widest">쇼룸 종료 (ESC)</span>
        </button>

        <div className="relative w-full h-full flex items-center justify-center">
          {videoSrc ? (
            <video
              src={videoSrc}
              className="max-w-full max-h-full object-contain"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={artwork.image}
              alt={artwork.title}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      </div>
    );
  }

  // ─── Normal View ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <FloatingCTA />

      {/* ─── Hero: Full-Height Media ─── */}
      <section className="relative" style={{ minHeight: "90vh" }}>
        {/* Media */}
        <div className="relative w-full" style={{ height: "90vh" }}>
          {videoSrc ? (
            <video
              src={videoSrc}
              className="w-full h-full object-contain bg-[#030303]"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-contain bg-transparent animate-slow-zoom"
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85 pointer-events-none" />

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="absolute top-24 left-8 z-30 flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-accent text-xs tracking-widest">뒤로</span>
          </button>

          {/* Showroom Button */}
          <button
            onClick={() => setShowroomMode(true)}
            className="absolute top-24 right-8 z-30 flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="font-accent text-xs tracking-widest">쇼룸 모드</span>
          </button>

          {/* Info Overlay — bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-8 md:px-16 pb-12">
            <div className="max-w-screen-xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                {/* Left: Title & Description */}
                <div className="md:col-span-2">
                  <span className={`font-accent text-xs tracking-widest ${accentClass} mb-3 block`}>
                    {artwork.category}
                  </span>
                  <h1
                    className="text-display font-light text-[3rem] md:text-[3.5rem] leading-none text-[#e0e0e0] mb-6 tracking-tight blur-[0.2px]"
                    style={{ textShadow: "0 2px 30px rgba(0,0,0,0.9)" }}
                  >
                    {artwork.title}
                  </h1>

                  {/* Collapsible Description */}
                  <div className="mb-8">
                    <p
                      className={`text-gray-300 leading-relaxed ${!descExpanded ? "line-clamp-2" : ""}`}
                      style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
                    >
                      {artwork.description}
                    </p>
                    <button
                      onClick={() => setDescExpanded(!descExpanded)}
                      className={`mt-3 font-accent text-xs tracking-widest ${accentClass} hover:opacity-80 transition-opacity`}
                    >
                      {descExpanded ? "접기 ↑" : "더보기 ↓"}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {ownedLicenses.find(o => o.id === artwork.id) ? (
                      <button
                        onClick={() => setLocation("/vault")}
                        className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-gray-200 text-black font-bold tracking-widest text-sm transition-colors rounded"
                      >
                        <Unlock className="w-4 h-4" />
                        GO TO VAULT
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          acquireArtwork(artwork);
                          toast.success("License acquired! Saved to your vault.");
                          setLocation("/vault");
                        }}
                        className={`flex items-center gap-2 px-8 py-3 font-bold tracking-widest text-sm transition-colors rounded ${isStandard ? 'bg-[#D4A843] hover:bg-[#F0C060] text-black' : 'bg-[#93C5FD] hover:bg-[#BFDBFE] text-black'}`}
                      >
                        <Lock className="w-4 h-4" />
                        ACQUIRE LICENSE (0.5 ETH)
                      </button>
                    )}
                    <button onClick={handleContactClick} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-gray-300 font-accent text-xs tracking-widest hover:bg-white/10 hover:text-white transition-all duration-200 rounded">
                      이 작품으로 문의하기
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-gray-300 font-accent text-xs tracking-widest hover:bg-white/10 hover:text-white transition-all duration-200 rounded"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      공유
                    </button>
                  </div>
                </div>

                {/* Right: Specs */}
                <div className={`bg-black/60 backdrop-blur-md p-6 border ${borderAccent}`}>
                  <h3 className={`font-accent text-xs tracking-widest ${accentClass} mb-5`}>
                    작품 정보
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 font-accent tracking-wider">해상도</span>
                      <span className="text-sm text-gray-200">{artwork.resolution}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 font-accent tracking-wider">재생 시간</span>
                      <span className="text-sm text-gray-200">{artwork.runtime}</span>
                    </div>
                    {(artwork as any).tags && (
                      <div className="pt-2 border-t border-white/5">
                        <span className="text-xs text-gray-600 font-accent tracking-wider block mb-2">태그</span>
                        <div className="flex flex-wrap gap-1.5">
                          {((artwork as any).tags as string[]).map((tag) => (
                            <span
                              key={tag}
                              className={`font-accent text-[10px] tracking-wider px-2 py-0.5 border ${borderAccent} ${accentClass} opacity-70`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tabs: 영상 보기 / 설치 시뮬레이션 ─── */}
      <section className="py-16 px-8 md:px-16 bg-[#0d0d0d] border-t border-white/5">
        <div className="max-w-screen-xl mx-auto">
          {/* Tab Buttons */}
          <div className="flex gap-0 mb-10 border-b border-white/10">
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-8 py-4 font-accent text-xs tracking-widest transition-all duration-200 border-b-2 -mb-px ${activeTab === "video"
                ? `${accentClass} border-current`
                : "text-gray-600 border-transparent hover:text-gray-400"
                }`}
            >
              <Play className="w-3.5 h-3.5" />
              영상 보기
            </button>
            <div className="w-px h-8 self-center bg-white/10" />
            <button
              onClick={() => setActiveTab("simulation")}
              className={`flex items-center gap-2 px-8 py-4 font-accent text-xs tracking-widest transition-all duration-200 border-b-2 -mb-px ${activeTab === "simulation"
                ? `${accentClass} border-current`
                : "text-gray-600 border-transparent hover:text-gray-400"
                }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              설치 시뮬레이션
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "video" ? (
            <div className="relative w-full bg-[#030303] flex items-center justify-center" style={{ minHeight: "60vh" }}>
              {videoSrc ? (
                <video
                  src={videoSrc}
                  className="w-full max-h-[70vh] object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full max-h-[70vh] object-contain"
                />
              )}
            </div>
          ) : (
            <InstallationSimulation artwork={artwork} accentColor={accentColor} />
          )}
        </div>
      </section>

      {/* ─── Related Artworks ─── */}
      {relatedArtworks.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-[#030303] border-t border-white/5">
          <div className="w-full">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-white/5" />
              <h2 className="font-accent text-xs tracking-[0.3em] text-gray-500 uppercase">
                관련 작품
              </h2>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1">
              {relatedArtworks.map((rel) => {
                const relVideo = (rel as any).videoSrc as string | undefined;
                return (
                  <div
                    key={rel.id}
                    className="group cursor-pointer"
                    onClick={() => setLocation(`/artwork/${rel.id}`)}
                    onMouseEnter={(event) => {
                      const video = event.currentTarget.querySelector("video");
                      if (video instanceof HTMLVideoElement) {
                        video.play().catch(() => {});
                      }
                    }}
                    onMouseLeave={(event) => {
                      const video = event.currentTarget.querySelector("video");
                      if (video instanceof HTMLVideoElement) {
                        video.pause();
                        video.currentTime = 0;
                      }
                    }}
                  >
                    <div className="relative overflow-hidden aspect-video bg-[#111] mb-3">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {relVideo ? (
                        <video
                          src={relVideo}
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {relVideo ? (
                        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div
                            className="font-accent text-[9px] tracking-[0.24em] bg-black/50 backdrop-blur-sm px-2.5 py-1 border"
                            style={{ color: accentColor, borderColor: `${accentColor}30` }}
                          >
                            HOVER PREVIEW
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <h3 className={`text-sm font-semibold text-white leading-tight line-clamp-1 group-hover:${accentClass} transition-colors duration-200`}>
                      {rel.title}
                    </h3>
                    <span className={`font-accent text-[10px] tracking-widest ${accentClass} opacity-60`}>
                      {rel.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA Footer ─── */}
      <section className={`py-20 px-8 md:px-16 border-t ${borderAccent}`} style={{ background: `${accentColor}08` }}>
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-display text-3xl md:text-5xl text-white mb-6">
            이 작품을 공간에 설치하고 싶으신가요?
          </h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            LUMOS 전문 팀이 공간 분석부터 설치까지 전 과정을 지원합니다.
          </p>
          <button onClick={handleContactClick} className={btnClass}>
            이 작품으로 문의하기
          </button>
        </div>
      </section>
    </div>
  );
}
