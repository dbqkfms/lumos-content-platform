/** Shared catalogue rules. Collection placement NEVER grants a usage licence. */
export type World = "standard" | "local";
export type AccessTier = "originals" | "open" | "creator";
export type SourceType = "static" | "managed" | "content-manager";

export interface CatalogArtwork {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  displayType: "Horizontal" | "Vertical";
  runtime: string;
  resolution: string;
  tags?: string[];
  worldType?: World;
  line?: "STANDARD" | "LOCAL";
  sourceType?: SourceType;
  accessTier?: AccessTier;
  titleKo?: string;
  titleEn?: string;
  videoSrc?: string;
  embedUrl?: string;
  artist?: string;
  format?: string;
  price?: string;
  styleCode?: string;
  vimeoId?: string;
  createdAt?: string;
}

const text = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

export function resolveWorld(entry: {
  id?: unknown; worldType?: unknown; line?: unknown;
}, fallback?: World): World | undefined {
  if (entry.worldType === "standard" || entry.worldType === "local") return entry.worldType;
  if (entry.line === "STANDARD") return "standard";
  if (entry.line === "LOCAL") return "local";
  // Only known static collections may supply a fallback. lumos-* is not a world.
  if (fallback) return fallback;
  const id = text(entry.id) || "";
  if (id.startsWith("standard-")) return "standard";
  if (id.startsWith("local-")) return "local";
  return undefined;
}

export function resolveAccessTier(value: unknown, source: SourceType): AccessTier {
  if (value === "originals" || value === "open" || value === "creator") return value;
  // Preserve established catalogue provenance, but never infer Open from order,
  // duration, a title, a tag, or a desired number of sample cards.
  return source === "static" ? "originals" : "creator";
}

export function normalizeCatalogEntry(
  input: unknown, source: SourceType, fallbackWorld?: World,
): CatalogArtwork | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const entry = input as Record<string, unknown>;
  const id = text(entry.id);
  const image = text(entry.image);
  if (!id || !image) return null;
  const worldType = resolveWorld(entry, fallbackWorld);
  const title = text(entry.titleKo) || text(entry.title) || text(entry.titleEn) || id;
  const category = text(entry.category) || "미분류";
  const displayType = entry.displayType === "Vertical" ? "Vertical" : "Horizontal";
  const originalTags = Array.isArray(entry.tags)
    ? entry.tags.map(text).filter((tag): tag is string => Boolean(tag)) : [];
  const styleCode = text(entry.styleCode);
  const derivedTags = [category, displayType];
  if (worldType) derivedTags.push(worldType === "standard" ? "Immersive" : "Ambient");
  if (styleCode) derivedTags.push(styleCode.replace(/-/g, " "));

  return {
    id, title, image, category, displayType,
    titleKo: text(entry.titleKo),
    titleEn: text(entry.titleEn),
    description: text(entry.description) || "작품 상세 설명을 준비하고 있습니다.",
    runtime: text(entry.runtime) || "확인 필요",
    resolution: text(entry.resolution) || "확인 필요",
    tags: Array.from(new Set([...originalTags, ...derivedTags])),
    worldType,
    line: worldType === "standard" ? "STANDARD" : worldType === "local" ? "LOCAL" : undefined,
    sourceType: source,
    accessTier: resolveAccessTier(entry.accessTier, source),
    videoSrc: text(entry.videoSrc),
    embedUrl: text(entry.embedUrl),
    artist: text(entry.artist) || (source === "static" ? "LUMOS Originals" : undefined),
    format: text(entry.format), price: text(entry.price), styleCode,
    vimeoId: text(entry.vimeoId), createdAt: text(entry.createdAt),
  };
}

export function uniqueArtworksById<T extends { id: string }>(items: readonly T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export type DecoratedArtwork<T> = T & {
  accent: "gold" | "blue"; collection: AccessTier; world: World;
};

export function buildLibraryCollections<T extends CatalogArtwork>(artworks: readonly T[]) {
  const all: DecoratedArtwork<T>[] = [];
  const unclassified: T[] = [];
  for (const artwork of uniqueArtworksById(artworks)) {
    const world = resolveWorld(artwork);
    const tier = artwork.accessTier;
    if (!world || (tier !== "originals" && tier !== "open" && tier !== "creator")) {
      unclassified.push(artwork);
      continue;
    }
    all.push({ ...artwork, world, collection: tier, accent: world === "standard" ? "gold" : "blue" });
  }
  const originals = all.filter((a) => a.collection === "originals");
  const openWorks = all.filter((a) => a.collection === "open");
  const creatorWorks = all.filter((a) => a.collection === "creator");
  const highlight = (keywords: string[]) => all.filter((a) => {
    const tags = (a.tags || []).join(" ").toLowerCase();
    return keywords.some((keyword) => tags.includes(keyword));
  }).slice(0, 3);
  return {
    all, unclassified, originals, openWorks, creatorWorks,
    originalsStandard: originals.filter((a) => a.world === "standard"),
    originalsLocal: originals.filter((a) => a.world === "local"),
    featuredOriginals: originals.slice(0, 6),
    featuredOpenWorks: openWorks.slice(0, 8),
    featuredCreatorWorks: creatorWorks.slice(0, 8),
    solutionHighlights: {
      hotel: highlight(["호텔", "로비", "hotel", "lobby"]),
      retail: highlight(["리테일", "쇼룸", "브랜드", "retail", "showroom"]),
      fnb: highlight(["카페", "레스토랑", "f&b", "cafe", "restaurant"]),
      office: highlight(["오피스", "라운지", "공용부", "office", "lounge"]),
      public: highlight(["전시", "공공공간", "관광", "행사", "exhibition"]),
    },
  };
}
