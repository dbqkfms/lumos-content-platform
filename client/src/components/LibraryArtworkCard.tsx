import { useRef, useState } from "react";
import { ArrowUpRight, PlayCircle, Play } from "lucide-react";

import type { LibraryArtwork } from "@/hooks/useLibraryCollections";

function isVimeoUrl(src?: string) {
  return !!src && (src.includes("vimeo.com") || src.includes("player.vimeo.com"));
}

/* Vimeo URL에 autoplay+muted+loop 파라미터 추가 */
function vimeoAutoplayUrl(src: string) {
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}autoplay=1&muted=1&loop=1&background=0&title=0&byline=0&portrait=0`;
}

export default function LibraryArtworkCard({
  artwork,
  onOpen,
}: {
  artwork: LibraryArtwork;
  onOpen: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const accent = artwork.accent === "gold" ? "#D4A843" : "#93C5FD";
  const effectiveVideoSrc = artwork.videoSrc || (artwork as any).embedUrl || undefined;
  const isVimeo = isVimeoUrl(effectiveVideoSrc);
  const hasLocalVideo = !!effectiveVideoSrc && !isVimeo;
  const [showVimeo, setShowVimeo] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpen(artwork.id)}
      onMouseEnter={() => {
        if (hasLocalVideo) videoRef.current?.play().catch(() => {});
        if (isVimeo) setShowVimeo(true);
      }}
      onMouseLeave={() => {
        if (hasLocalVideo && videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        if (isVimeo) setShowVimeo(false);
      }}
      className="group overflow-hidden border border-white/8 bg-[#111] text-left transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#080808]">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* 로컬 mp4 호버 비디오 */}
        {hasLocalVideo ? (
          <video
            ref={videoRef}
            src={effectiveVideoSrc}
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : null}

        {/* Vimeo 호버 iframe */}
        {isVimeo && showVimeo ? (
          <iframe
            src={vimeoAutoplayUrl(effectiveVideoSrc!)}
            allow="autoplay; fullscreen"
            frameBorder={0}
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ pointerEvents: "none" }}
          />
        ) : null}

        {/* Vimeo 재생 아이콘 (호버 전) */}
        {isVimeo && !showVimeo ? (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
              <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-3">
          <span
            className="border px-2 py-1 font-accent text-[10px] tracking-[0.18em]"
            style={{ borderColor: `${accent}55`, color: accent, backgroundColor: "rgba(0,0,0,0.45)" }}
          >
            {artwork.collection === "originals" ? artwork.world.toUpperCase() : artwork.collection.toUpperCase()}
          </span>
          {isVimeo ? (
            <span className="border border-white/10 bg-black/70 px-2 py-1 font-accent text-[10px] tracking-[0.18em] text-white/80">
              VIMEO
            </span>
          ) : effectiveVideoSrc ? (
            <span className="flex items-center gap-1 border border-white/10 bg-black/70 px-2 py-1 font-accent text-[10px] tracking-[0.18em] text-white/80">
              <PlayCircle className="h-3 w-3" />
              LOOP
            </span>
          ) : null}
        </div>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{artwork.title}</h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-gray-500">
              {artwork.category} · {artwork.displayType === "Vertical" ? "Vertical" : "Horizontal"}
            </p>
          </div>
          <ArrowUpRight className="mt-1 h-4 w-4 text-gray-500 transition-colors group-hover:text-white" />
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">{artwork.description}</p>
        {artwork.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {artwork.tags.slice(0, 3).map((tag) => (
              <span key={`${artwork.id}-${tag}`} className="border border-white/10 px-2 py-1 text-[11px] text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </button>
  );
}
