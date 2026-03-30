import { localArtworks } from "@/data/localArtworks";
import { standardArtworks } from "@/data/standardArtworks";
import type { Artwork } from "@/contexts/MarketplaceContext";
import type { ManagedArtwork } from "@/lib/artworkData";

type ContentManagerEntry = {
  id: string;
  title?: string;
  titleEn?: string;
  titleKo?: string;
  description?: string;
  category?: string;
  image?: string;
  videoSrc?: string;
  embedUrl?: string;
  displayType?: "Horizontal" | "Vertical";
  runtime?: string;
  resolution?: string;
  tags?: string[];
  worldType?: "standard" | "local";
  styleCode?: string;
  vimeoId?: string;
  createdAt?: string;
};

const OPEN_SAMPLE_LIMIT = 12;

function titleCase(value: string) {
  return value
    .split(/[\s\-_]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function humanizeArtworkId(id: string) {
  return titleCase(id.replace(/^(standard|local|lumos)-/, ""));
}

function normalizeTags(category: string, line: "STANDARD" | "LOCAL", displayType: Artwork["displayType"], styleCode?: string) {
  const tags = [category, line === "STANDARD" ? "Immersive" : "Ambient", displayType];
  if (styleCode) tags.push(styleCode.replace(/-/g, " "));
  return tags;
}

function buildDescription(title: string, category: string, line: "STANDARD" | "LOCAL", sourceType: Artwork["sourceType"]) {
  if (sourceType === "content-manager") {
    return `${title}는 ${category} 톤을 기반으로 한 컬렉션 작품입니다. 공개 샘플과 크리에이터 라이브러리 흐름에서 바로 검토할 수 있도록 정리했습니다.`;
  }

  if (line === "STANDARD") {
    return `${title}는 ${category} 계열의 프리미엄 미디어 아트입니다. 로비, 시그니처 월, 전시 공간처럼 존재감이 필요한 환경을 기준으로 큐레이션했습니다.`;
  }

  return `${title}는 ${category} 계열의 공간 친화형 미디어 아트입니다. 카페, 리테일, F&B처럼 체류감과 분위기 조성이 중요한 공간을 염두에 두고 정리했습니다.`;
}

function mapStaticArtwork(
  artwork: Artwork,
  line: "STANDARD" | "LOCAL",
): Artwork {
  const title = humanizeArtworkId(artwork.id);
  return {
    ...artwork,
    title,
    titleEn: title,
    titleKo: title,
    description: buildDescription(title, artwork.category, line, "static"),
    worldType: line === "STANDARD" ? "standard" : "local",
    line,
    sourceType: "static",
    accessTier: "originals",
    artist: "LUMOS Originals",
    tags: normalizeTags(artwork.category, line, artwork.displayType),
  };
}

function mapManagedArtwork(artwork: ManagedArtwork): Artwork {
  const line = artwork.worldType === "standard" ? "STANDARD" : "LOCAL";
  const title = artwork.titleEn || artwork.titleKo || artwork.title || humanizeArtworkId(artwork.id);

  return {
    ...artwork,
    title,
    titleEn: artwork.titleEn || title,
    titleKo: artwork.titleKo || title,
    description: buildDescription(title, artwork.category || "Featured", line, "managed"),
    line,
    sourceType: "managed",
    accessTier: "creator",
    artist: artwork.artist || "Featured Creator",
    tags: normalizeTags(artwork.category || "Featured", line, artwork.displayType, artwork.styleCode),
  };
}

function mapContentManagerArtwork(entry: ContentManagerEntry, index: number): Artwork | null {
  if (!entry.image) return null;

  const worldType = entry.worldType === "standard" ? "standard" : "local";
  const line = worldType === "standard" ? "STANDARD" : "LOCAL";
  const title = entry.titleEn || entry.titleKo || entry.title || humanizeArtworkId(entry.id);
  const accessTier: Artwork["accessTier"] = index < OPEN_SAMPLE_LIMIT ? "open" : "creator";

  return {
    id: entry.id,
    title,
    titleEn: entry.titleEn || title,
    titleKo: entry.titleKo || title,
    description: buildDescription(title, entry.category || "Featured", line, "content-manager"),
    category: entry.category || "Featured",
    image: entry.image,
    videoSrc: entry.videoSrc || undefined,
    embedUrl: entry.embedUrl || undefined,
    displayType: entry.displayType || "Horizontal",
    runtime: entry.runtime || "Loop",
    resolution: entry.resolution || "1920x1080",
    tags: normalizeTags(entry.category || "Featured", line, entry.displayType || "Horizontal", entry.styleCode),
    worldType,
    line,
    sourceType: "content-manager",
    accessTier,
    artist: accessTier === "open" ? "Open Sample" : "Featured Creator",
    styleCode: entry.styleCode,
    vimeoId: entry.vimeoId,
    createdAt: entry.createdAt,
  };
}

export function buildStaticCatalog() {
  const standard = standardArtworks.map((artwork) => mapStaticArtwork(artwork as Artwork, "STANDARD"));
  const local = localArtworks.map((artwork) => mapStaticArtwork(artwork as Artwork, "LOCAL"));
  return [...standard, ...local];
}

export async function loadContentManagerCatalog() {
  try {
    const response = await fetch(`/data/content-manager-artworks.json?ts=${Date.now()}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as unknown;
    if (!Array.isArray(payload)) return [];

    return payload
      .map((entry, index) => mapContentManagerArtwork(entry as ContentManagerEntry, index))
      .filter((entry): entry is Artwork => Boolean(entry));
  } catch {
    return [];
  }
}

export function normalizeManagedCatalog(items: ManagedArtwork[]) {
  return items.map((item) => mapManagedArtwork(item));
}

export function originalsCatalog(artworks: Artwork[]) {
  return artworks.filter((artwork) => artwork.accessTier === "originals");
}

export function openCatalog(artworks: Artwork[]) {
  return artworks.filter((artwork) => artwork.accessTier === "open");
}

export function creatorCatalog(artworks: Artwork[]) {
  return artworks.filter(
    (artwork) => artwork.accessTier === "creator" || artwork.sourceType === "content-manager",
  );
}

export function lineCatalog(artworks: Artwork[], worldType: "standard" | "local") {
  return artworks.filter((artwork) => artwork.worldType === worldType && artwork.accessTier === "originals");
}

export function featuredCatalog(artworks: Artwork[], accessTier: Artwork["accessTier"], limit = 6) {
  return artworks.filter((artwork) => artwork.accessTier === accessTier).slice(0, limit);
}

export function relatedCatalog(artworks: Artwork[], artwork: Artwork, limit = 4) {
  return artworks
    .filter((candidate) => candidate.id !== artwork.id)
    .filter((candidate) => candidate.category === artwork.category || candidate.worldType === artwork.worldType)
    .slice(0, limit);
}
