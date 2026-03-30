/*
  Explore Page — 통합 갤러리 브라우징
  - STANDARD + LOCAL 전체 작품을 한 곳에서 탐색
  - 월드 필터 (ALL / STANDARD / LOCAL)
  - 카테고리 필터 (선택된 월드에 따라 동적 변경)
  - 디스플레이 타입 필터 (가로/세로 — B2B LED 설치에 핵심)
  - 검색, 정렬, 통계, 스켈레톤 로딩, 빈 상태
  - 각 카드에 월드 배지로 소속 컬렉션 즉시 식별
*/

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, X, Layers, Monitor, Smartphone, ArrowUp, Grid3X3, LayoutList } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import { useMarketplace, Artwork } from "@/contexts/MarketplaceContext";
import { standardCategories } from "@/data/standardArtworks";
import { localCategories } from "@/data/localArtworks";

type WorldFilter = "all" | "standard" | "local";
type DisplayFilter = "all" | "Horizontal" | "Vertical";
type SortMode = "default" | "category" | "resolution";
type ViewMode = "grid" | "list";

/* ─── 월드별 카테고리 집합 생성 ─── */
// 기존 카테고리 배열에서 "All"을 제외한 실제 카테고리만 추출
const standardCats = standardCategories.filter(c => c !== "All");
const localCats = localCategories.filter(c => c !== "All");
const allCats = Array.from(new Set([...standardCats, ...localCats]));

function getCategoriesForWorld(world: WorldFilter): string[] {
    switch (world) {
        case "standard": return standardCats;
        case "local": return localCats;
        default: return allCats;
    }
}

/* ─── 아트워크 카드 (월드 배지 포함) ─── */
function ArtworkCard({
    artwork,
    onClick,
    viewMode,
}: {
    artwork: Artwork;
    onClick: () => void;
    viewMode: ViewMode;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isStandard = artwork.id.startsWith("standard-") || artwork.worldType === "standard";
    const accent = isStandard ? "#D4A843" : "#93C5FD";
    const worldLabel = isStandard ? "STANDARD" : "LOCAL";
    const cardClass = isStandard ? "gallery-card-standard" : "gallery-card-local";

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    if (viewMode === "list") {
        return (
            <div
                className={`gallery-card ${cardClass} group cursor-pointer flex gap-0`}
                onClick={onClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* 썸네일 */}
                <div className="relative overflow-hidden w-48 min-w-48 aspect-video bg-[#111] shrink-0">
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
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    )}
                    {/* 월드 배지 */}
                    <div
                        className="absolute top-2 left-2 font-accent text-[8px] tracking-widest px-2 py-0.5 backdrop-blur-sm"
                        style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
                    >
                        {worldLabel}
                    </div>
                </div>

                {/* 정보 */}
                <div className="flex-1 px-5 py-3 flex flex-col justify-center gap-1 min-w-0">
                    <h3
                        className="text-sm font-semibold text-white leading-tight line-clamp-1 transition-colors duration-200"
                        style={{ ["--hover-color" as string]: accent }}
                    >
                        <span className={`group-hover:text-[${accent}]`} style={{ transition: "color 0.2s" }}>
                            {artwork.title}
                        </span>
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{artwork.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                        <span
                            className="inline-block font-accent text-[10px] tracking-widest px-2 py-0.5"
                            style={{ color: accent, background: `${accent}10` }}
                        >
                            {artwork.category}
                        </span>
                        <span className="font-accent text-[9px] tracking-wider text-gray-600">
                            {artwork.displayType === "Horizontal" ? "가로" : "세로"}
                        </span>
                        <span className="font-accent text-[9px] tracking-wider text-gray-600">
                            {artwork.resolution}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`gallery-card ${cardClass} group cursor-pointer`}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative overflow-hidden aspect-video bg-[#111]">
                {/* 썸네일 */}
                <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                {/* 비디오 오버레이 */}
                {artwork.videoSrc && (
                    <video
                        ref={videoRef}
                        src={artwork.videoSrc}
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {artwork.videoSrc && (
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div
                            className="font-accent text-[9px] tracking-[0.24em] bg-black/50 backdrop-blur-sm px-2.5 py-1 border"
                            style={{ color: accent, borderColor: `${accent}30` }}
                        >
                            HOVER PREVIEW
                        </div>
                    </div>
                )}
                {/* 월드 배지 */}
                <div
                    className="absolute top-2 left-2 font-accent text-[8px] tracking-widest px-2 py-0.5 backdrop-blur-sm"
                    style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
                >
                    {worldLabel}
                </div>
                {/* 디스플레이 타입 뱃지 */}
                <div className="absolute top-2 right-2 font-accent text-[8px] tracking-wider px-1.5 py-0.5 bg-black/50 backdrop-blur-sm text-gray-400 border border-white/10">
                    {artwork.displayType === "Horizontal" ? "H" : "V"}
                </div>
            </div>
            <div className="px-3.5 py-3">
                <h3
                    className="text-sm font-semibold text-white leading-tight line-clamp-1 mb-2 transition-colors duration-200"
                    style={{ color: undefined }}
                >
                    {artwork.title}
                </h3>
                <span
                    className="inline-block font-accent text-[10px] tracking-widest px-2 py-0.5"
                    style={{ color: accent, background: `${accent}10` }}
                >
                    {artwork.category}
                </span>
            </div>
        </div>
    );
}

/* ─── 스켈레톤 카드 ─── */
function SkeletonCard() {
    return (
        <div className="bg-transparent animate-pulse">
            <div className="aspect-video bg-[#111]" />
            <div className="px-3.5 py-3 space-y-2">
                <div className="h-3.5 bg-[#111] w-3/4" />
                <div className="h-3 bg-[#111] w-1/3" />
            </div>
        </div>
    );
}

function SkeletonCardList() {
    return (
        <div className="bg-transparent animate-pulse flex gap-0">
            <div className="w-48 min-w-48 aspect-video bg-[#111] shrink-0" />
            <div className="flex-1 px-5 py-3 space-y-2">
                <div className="h-3.5 bg-[#111] w-3/4" />
                <div className="h-3 bg-[#111] w-full" />
                <div className="h-3 bg-[#111] w-1/3" />
            </div>
        </div>
    );
}

/* ─── 메인 컴포넌트 ─── */
export default function Explore() {
    const [, setLocation] = useLocation();
    const { artworks } = useMarketplace();

    // 필터 상태
    const [worldFilter, setWorldFilter] = useState<WorldFilter>("all");
    const [activeCategory, setActiveCategory] = useState("All");
    const [displayFilter, setDisplayFilter] = useState<DisplayFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortMode, setSortMode] = useState<SortMode>("default");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [isLoading, setIsLoading] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);

    // 로딩 시뮬레이션
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // 스크롤 감지 (Back to Top 버튼)
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 600);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 월드 필터 변경 시 카테고리 초기화
    const handleWorldChange = useCallback((world: WorldFilter) => {
        setWorldFilter(world);
        setActiveCategory("All");
    }, []);

    // 동적 카테고리 목록
    const availableCategories = useMemo(
        () => getCategoriesForWorld(worldFilter),
        [worldFilter]
    );

    // 필터링 & 정렬
    const filteredArtworks = useMemo(() => {
        let result = artworks;

        // 월드 필터
        if (worldFilter !== "all") {
            result = result.filter(art => {
                if (worldFilter === "standard") return art.id.startsWith("standard-") || art.worldType === "standard";
                return art.id.startsWith("local-") || art.worldType === "local";
            });
        }

        // 카테고리 필터
        if (activeCategory !== "All") {
            result = result.filter(art => art.category === activeCategory);
        }

        // 디스플레이 타입 필터
        if (displayFilter !== "all") {
            result = result.filter(art => art.displayType === displayFilter);
        }

        // 검색
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(art =>
                art.title.toLowerCase().includes(q) ||
                art.category.toLowerCase().includes(q) ||
                art.description.toLowerCase().includes(q) ||
                (art.tags && art.tags.some(tag => tag.toLowerCase().includes(q)))
            );
        }

        // 정렬
        if (sortMode === "category") {
            result = [...result].sort((a, b) => a.category.localeCompare(b.category));
        } else if (sortMode === "resolution") {
            result = [...result].sort((a, b) => {
                const getPixels = (r: string) => {
                    const match = r.match(/(\d+)\s*x\s*(\d+)/i);
                    return match ? parseInt(match[1]) * parseInt(match[2]) : 0;
                };
                return getPixels(b.resolution) - getPixels(a.resolution);
            });
        }

        return result;
    }, [artworks, worldFilter, activeCategory, displayFilter, searchQuery, sortMode]);

    // 통계
    const stats = useMemo(() => {
        const standardCount = artworks.filter(a => a.id.startsWith("standard-") || a.worldType === "standard").length;
        const localCount = artworks.filter(a => a.id.startsWith("local-") || a.worldType === "local").length;
        const horizontalCount = artworks.filter(a => a.displayType === "Horizontal").length;
        const verticalCount = artworks.filter(a => a.displayType === "Vertical").length;
        return { total: artworks.length, standard: standardCount, local: localCount, horizontal: horizontalCount, vertical: verticalCount };
    }, [artworks]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 필터 초기화
    const resetFilters = () => {
        setWorldFilter("all");
        setActiveCategory("All");
        setDisplayFilter("all");
        setSearchQuery("");
        setSortMode("default");
    };

    const hasActiveFilters = worldFilter !== "all" || activeCategory !== "All" || displayFilter !== "all" || searchQuery.trim() !== "";

    // Framer Motion 변형
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    };

    return (
        <div className="min-h-screen bg-transparent">
            <Header />
            <FloatingCTA />

            {/* ─── Cinematic Noise Overlay (Global) ─── */}
            <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />

            {/* ─── 히어로 섹션 ─── */}
            <section className="relative h-[50vh] md:h-[60vh] flex items-end overflow-hidden">
                {/* 배경: 양쪽 월드를 상징하는 그라데이션 */}
                <div className="absolute inset-0 bg-[#030303]">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4A843]/10 via-[#030303]/40 to-[#93C5FD]/10 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/50 to-[#030303]" />
                    {/* 장식 라인 */}
                    <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-[#D4A843]/20 via-transparent to-[#93C5FD]/20" />
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>

                <motion.div
                    className="relative z-10 px-12 md:px-20 pb-16 md:pb-20 w-full"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.p variants={fadeUp} className="font-accent text-xs tracking-[0.3em] text-gray-500 mb-5 flex items-center gap-4">
                        <span className="w-8 h-px bg-[#D4A843]/50" />
                        <span className="text-[#D4A843]">STANDARD</span>
                        <span className="text-gray-600">+</span>
                        <span className="text-[#93C5FD]">LOCAL</span>
                        <span className="w-8 h-px bg-[#93C5FD]/50" />
                    </motion.p>
                    <motion.h1 variants={fadeUp} className="text-display font-light text-[3.5rem] md:text-[4.5rem] leading-none text-[#e0e0e0] mb-5 tracking-tight blur-[0.2px]">
                        EXPLORE
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-lg text-[#aaaaaa] font-light max-w-xl tracking-wide">
                        LUMOS의 전체 미디어아트 컬렉션을 한 곳에서 탐색하세요
                    </motion.p>

                    {/* 컬렉션 통계 */}
                    <motion.div variants={fadeUp} className="flex items-center gap-8 mt-8">
                        <div>
                            <p className="text-display text-2xl md:text-3xl text-white">{stats.total}</p>
                            <p className="font-accent text-[10px] tracking-widest text-gray-600 mt-1">TOTAL ARTWORKS</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <p className="text-display text-2xl md:text-3xl text-[#D4A843]">{stats.standard}</p>
                            <p className="font-accent text-[10px] tracking-widest text-gray-600 mt-1">STANDARD</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <p className="text-display text-2xl md:text-3xl text-[#93C5FD]">{stats.local}</p>
                            <p className="font-accent text-[10px] tracking-widest text-gray-600 mt-1">LOCAL</p>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── 필터 & 갤러리 섹션 ─── */}
            <section className="py-16 px-4 md:px-8">
                <div className="w-full">

                    {/* 검색 바 */}
                    <div className="relative mb-8 max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="작품명, 카테고리, 태그로 검색..."
                            className="search-bar"
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

                    {/* 월드 필터 */}
                    <div className="flex flex-wrap items-center gap-6 mb-6">
                        <div className="flex items-center gap-2">
                            <span className="font-accent text-[10px] tracking-widest text-gray-600 mr-2">WORLD</span>
                            {(["all", "standard", "local"] as WorldFilter[]).map(world => {
                                const isActive = worldFilter === world;
                                const label = world === "all" ? "ALL" : world.toUpperCase();
                                let activeClass = "";
                                if (isActive) {
                                    if (world === "standard") activeClass = "filter-pill-active-standard";
                                    else if (world === "local") activeClass = "filter-pill-active-local";
                                    else activeClass = "bg-white/10 !text-white border-white/20";
                                }
                                return (
                                    <button
                                        key={world}
                                        onClick={() => handleWorldChange(world)}
                                        className={`filter-pill ${activeClass}`}
                                    >
                                        {world === "standard" && <span className="inline-block w-1.5 h-1.5 bg-[#D4A843] mr-2" />}
                                        {world === "local" && <span className="inline-block w-1.5 h-1.5 bg-[#93C5FD] mr-2" />}
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* 구분선 */}
                        <div className="hidden md:block w-px h-6 bg-white/10" />

                        {/* 디스플레이 타입 필터 */}
                        <div className="flex items-center gap-2">
                            <span className="font-accent text-[10px] tracking-widest text-gray-600 mr-2">DISPLAY</span>
                            <button
                                onClick={() => setDisplayFilter("all")}
                                className={`filter-pill ${displayFilter === "all" ? "bg-white/10 !text-white border-white/20" : ""}`}
                            >
                                ALL
                            </button>
                            <button
                                onClick={() => setDisplayFilter("Horizontal")}
                                className={`filter-pill flex items-center gap-1.5 ${displayFilter === "Horizontal" ? "bg-white/10 !text-white border-white/20" : ""}`}
                            >
                                <Monitor className="w-3 h-3" />
                                가로
                            </button>
                            <button
                                onClick={() => setDisplayFilter("Vertical")}
                                className={`filter-pill flex items-center gap-1.5 ${displayFilter === "Vertical" ? "bg-white/10 !text-white border-white/20" : ""}`}
                            >
                                <Smartphone className="w-3 h-3" />
                                세로
                            </button>
                        </div>
                    </div>

                    {/* 카테고리 필터 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setActiveCategory("All")}
                            className={`filter-pill ${activeCategory === "All"
                                ? worldFilter === "local"
                                    ? "filter-pill-active-local"
                                    : worldFilter === "standard"
                                        ? "filter-pill-active-standard"
                                        : "bg-white/10 !text-white border-white/20"
                                : ""
                                }`}
                        >
                            All
                        </button>
                        {availableCategories.map(cat => {
                            const isActive = activeCategory === cat;
                            let activeClass = "";
                            if (isActive) {
                                if (worldFilter === "local") activeClass = "filter-pill-active-local";
                                else if (worldFilter === "standard") activeClass = "filter-pill-active-standard";
                                else activeClass = "bg-white/10 !text-white border-white/20";
                            }
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`filter-pill ${activeClass}`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* 도구 바: 결과 카운트 + 정렬 + 뷰 모드 */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            {!isLoading && (
                                <p className="font-accent text-xs tracking-widest text-gray-600">
                                    {filteredArtworks.length}개 작품
                                    {hasActiveFilters && (
                                        <button
                                            onClick={resetFilters}
                                            className="ml-4 text-gray-500 hover:text-white transition-colors underline underline-offset-2"
                                        >
                                            필터 초기화
                                        </button>
                                    )}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {/* 정렬 */}
                            <select
                                value={sortMode}
                                onChange={e => setSortMode(e.target.value as SortMode)}
                                className="font-accent text-[10px] tracking-widest text-gray-500 bg-transparent border border-white/10 px-3 py-2 focus:outline-none focus:border-white/20 cursor-pointer appearance-none"
                                style={{ minWidth: 120 }}
                            >
                                <option value="default">기본 순서</option>
                                <option value="category">카테고리순</option>
                                <option value="resolution">해상도순</option>
                            </select>

                            {/* 뷰 모드 토글 */}
                            <div className="flex border border-white/10">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-gray-600 hover:text-gray-400"}`}
                                    title="그리드 보기"
                                >
                                    <Grid3X3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-gray-600 hover:text-gray-400"}`}
                                    title="리스트 보기"
                                >
                                    <LayoutList className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ─── 갤러리 그리드 ─── */}
                    {isLoading ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <SkeletonCardList key={i} />
                                ))}
                            </div>
                        )
                    ) : filteredArtworks.length > 0 ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1">
                                {filteredArtworks.map(artwork => (
                                    <ArtworkCard
                                        key={artwork.id}
                                        artwork={artwork}
                                        onClick={() => setLocation(`/artwork/${artwork.id}`)}
                                        viewMode="grid"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {filteredArtworks.map(artwork => (
                                    <ArtworkCard
                                        key={artwork.id}
                                        artwork={artwork}
                                        onClick={() => setLocation(`/artwork/${artwork.id}`)}
                                        viewMode="list"
                                    />
                                ))}
                            </div>
                        )
                    ) : (
                        /* 빈 상태 */
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-16 h-16 bg-white/5 flex items-center justify-center mb-6">
                                <Layers className="w-7 h-7 text-gray-600" />
                            </div>
                            <h3 className="text-display text-xl text-white mb-3">검색 결과 없음</h3>
                            <p className="text-gray-600 text-sm mb-8 max-w-xs">
                                현재 필터 조건에 해당하는 작품을 찾을 수 없습니다.
                            </p>
                            <button
                                onClick={resetFilters}
                                className="font-accent text-xs tracking-widest text-white border border-white/20 px-6 py-3 hover:bg-white/5 transition-colors"
                            >
                                전체 작품 보기
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ─── 월드 안내 배너 ─── */}
            <section className="py-24 bg-[#030303] border-t border-white/5 relative z-10 px-4">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* STANDARD 배너 */}
                    <div
                        className="group relative overflow-hidden cursor-pointer border border-white/5 hover:border-[#D4A843]/30 transition-all duration-500"
                        onClick={() => setLocation("/standard")}
                    >
                        <div className="p-10 md:p-14">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-2 bg-[#D4A843]" />
                                <span className="font-accent text-[10px] tracking-[0.3em] text-[#D4A843]">PREMIUM MEDIA ART</span>
                            </div>
                            <h3 className="text-display text-3xl md:text-4xl text-white mb-4 group-hover:text-[#D4A843] transition-colors duration-300">
                                STANDARD
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-8">
                                갤러리, 미술관, 럭셔리 공간을 위한 글로벌 스탠다드 콘텐츠.
                                보편적 아름다움으로 공간의 품격을 완성합니다.
                            </p>
                            <span className="font-accent text-xs tracking-widest text-[#D4A843] group-hover:tracking-[0.3em] transition-all duration-300">
                                VIEW COLLECTION →
                            </span>
                        </div>
                        {/* 호버 배경 글로우 */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4A843]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>

                    {/* LOCAL 배너 */}
                    <div
                        className="group relative overflow-hidden cursor-pointer border border-white/5 hover:border-[#93C5FD]/30 transition-all duration-500"
                        onClick={() => setLocation("/local")}
                    >
                        <div className="p-10 md:p-14">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-2 bg-[#93C5FD]" />
                                <span className="font-accent text-[10px] tracking-[0.3em] text-[#93C5FD]">KOREAN COMMERCIAL ART</span>
                            </div>
                            <h3 className="text-display text-3xl md:text-4xl text-white mb-4 group-hover:text-[#93C5FD] transition-colors duration-300">
                                LOCAL
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-8">
                                한국의 전통미와 자연을 담은 콘텐츠. 카페, 레스토랑, 호텔 등
                                일상 공간에 한국적 정서를 더합니다.
                            </p>
                            <span className="font-accent text-xs tracking-widest text-[#93C5FD] group-hover:tracking-[0.3em] transition-all duration-300">
                                VIEW COLLECTION →
                            </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#93C5FD]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                </div>
            </section>

            {/* ─── CTA 섹션 ─── */}
            <section className="py-24 px-12 md:px-20 bg-[#030303] border-t border-white/5 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="font-accent text-[10px] tracking-[0.6em] text-gray-500 mb-6">
                        CONTACT
                    </p>
                    <h2 className="text-display font-light text-[2.5rem] md:text-[3.5rem] leading-tight text-[#e0e0e0] mb-6">
                        공간에 어울리는 작품을 찾으셨나요?
                    </h2>
                    <p className="text-base md:text-lg text-[#aaaaaa] mb-12 leading-[2] font-light max-w-xl mx-auto tracking-wide">
                        LUMOS 전문 팀이 공간 분석부터 콘텐츠 선정, 설치까지 전 과정을 지원합니다.
                    </p>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
                        className="btn-brutalist"
                    >
                        Contact Us
                    </button>
                </div>
            </section>

            {/* ─── 푸터 ─── */}
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
                            className="text-sm text-gray-500 hover:text-[#D4A843] transition-colors duration-200 block"
                        >
                            thisglobal.kr
                        </a>
                        <p className="text-xs text-gray-700 mt-1">© 2023 디스글로벌. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* ─── Back to Top 버튼 ─── */}
            {showBackToTop && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-24 right-8 z-40 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
                    title="맨 위로"
                >
                    <ArrowUp className="w-4 h-4" />
                </motion.button>
            )}
        </div>
    );
}
