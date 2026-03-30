import { Play, Sparkles } from "lucide-react";
import { useRef } from "react";

import type { Artwork } from "@/contexts/MarketplaceContext";

type ArtworkCardProps = {
  artwork: Artwork;
  accent: "gold" | "blue" | "neutral";
  onOpen: (id: string) => void;
  metaLabel?: string;
};

const accentClassMap = {
  gold: {
    text: "text-[#E0B754]",
    border: "border-[#E0B754]/25",
    badge: "bg-[#E0B754]/12 text-[#E0B754]",
  },
  blue: {
    text: "text-[#93C5FD]",
    border: "border-[#93C5FD]/25",
    badge: "bg-[#93C5FD]/12 text-[#93C5FD]",
  },
  neutral: {
    text: "text-white",
    border: "border-white/12",
    badge: "bg-white/8 text-white/80",
  },
} as const;

export default function ArtworkCard({ artwork, accent, onOpen, metaLabel }: ArtworkCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const accentClasses = accentClassMap[accent];
  const hasLocalVideo = Boolean(artwork.videoSrc && !artwork.videoSrc.startsWith("http"));
  const hasVimeo = Boolean(artwork.embedUrl);

  return (
    <button
      type="button"
      onClick={() => onOpen(artwork.id)}
      className={`group overflow-hidden border bg-black/35 text-left transition duration-300 hover:-translate-y-1 hover:bg-black/55 ${accentClasses.border}`}
      onMouseEnter={() => {
        if (hasLocalVideo) {
          void videoRef.current?.play().catch(() => undefined);
        }
      }}
      onMouseLeave={() => {
        if (hasLocalVideo && videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#080808]">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {hasLocalVideo ? (
          <video
            ref={videoRef}
            src={artwork.videoSrc}
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-300 group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] tracking-[0.22em] uppercase ${accentClasses.badge}`}>
            {metaLabel || artwork.accessTier}
          </span>
          <span className="rounded-full bg-black/45 px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-white/72">
            {artwork.displayType}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/78">
          {hasLocalVideo ? <Play className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          <span className="text-[11px] tracking-[0.22em] uppercase">
            {hasLocalVideo ? "Hover Preview" : hasVimeo ? "Vimeo Detail" : "Image Detail"}
          </span>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="space-y-1.5">
          <p className={`text-xs tracking-[0.22em] uppercase ${accentClasses.text}`}>{artwork.category}</p>
          <h3 className="font-display text-[1.45rem] leading-none text-white">{artwork.title}</h3>
          <p className="text-sm leading-6 text-white/64">{artwork.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {artwork.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/70">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
