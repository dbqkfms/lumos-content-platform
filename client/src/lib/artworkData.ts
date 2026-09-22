import { fetchJsonArray, isCatalogueRecord } from "@/lib/fetchJsonArray";
import type { Artwork } from "@/contexts/MarketplaceContext";

export interface ManagedArtwork extends Artwork {
  sourcePath?: string;
  sourceHash?: string;
  importedAt?: string;
}

const normalizeText = (value: string | undefined) => (value ?? "").trim().toLowerCase();
const normalizeVideoName = (value: string | undefined) => {
  const raw = normalizeText(value);
  if (!raw) return "";
  const [pathname] = raw.split("?");
  const segments = pathname.split("/").filter(Boolean);
  return segments.at(-1) ?? pathname;
};

const artworkKey = (artwork: Artwork) => {
  if (artwork.videoSrc) {
    return `video:${normalizeVideoName(artwork.videoSrc)}`;
  }
  return `fallback:${normalizeText(artwork.title)}:${normalizeText(artwork.image)}`;
};

export function dedupeArtworks(artworks: Artwork[]): Artwork[] {
  const seen = new Set<string>();
  const deduped: Artwork[] = [];

  for (const artwork of artworks) {
    const key = artworkKey(artwork);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(artwork);
  }

  return deduped;
}

export async function loadManagedArtworks(): Promise<ManagedArtwork[]> {
  try {
    const payload = await fetchJsonArray(`/data/managed-artworks.json?ts=${Date.now()}`);
    return payload.filter((item): item is ManagedArtwork => isCatalogueRecord(item));
  } catch {
    return [];
  }
}

export function deriveCategories(artworks: Artwork[], worldType: "standard" | "local") {
  const categories = Array.from(
    new Set(
      artworks
        .filter((artwork) => artwork.worldType === worldType)
        .map((artwork) => artwork.category)
        .filter(Boolean),
    ),
  ).sort((left, right) => left.localeCompare(right));

  return ["All", ...categories];
}
