import { localArtworks } from "@/data/localArtworks";
import { standardArtworks } from "@/data/standardArtworks";
import type { Artwork } from "@/contexts/MarketplaceContext";
import type { ManagedArtwork } from "@/lib/artworkData";
import { normalizeCatalogEntry, type CatalogArtwork } from "@/lib/catalogRules";

const isArtwork = (item: CatalogArtwork | null): item is CatalogArtwork => item !== null;

export function buildStaticCatalog(): Artwork[] {
  return [
    ...standardArtworks.map((artwork) => normalizeCatalogEntry(artwork, "static", "standard")),
    ...localArtworks.map((artwork) => normalizeCatalogEntry(artwork, "static", "local")),
  ].filter(isArtwork);
}

export async function loadContentManagerCatalog(): Promise<Artwork[]> {
  try {
    const response = await fetch(`/data/content-manager-artworks.json?ts=${Date.now()}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) return [];
    return payload.map((entry) => normalizeCatalogEntry(entry, "content-manager")).filter(isArtwork);
  } catch {
    return [];
  }
}

export function normalizeManagedCatalog(items: ManagedArtwork[]): Artwork[] {
  return items.map((item) => normalizeCatalogEntry(item, "managed")).filter(isArtwork);
}

export function originalsCatalog(artworks: Artwork[]) {
  return artworks.filter((artwork) => artwork.accessTier === "originals");
}
export function openCatalog(artworks: Artwork[]) {
  return artworks.filter((artwork) => artwork.accessTier === "open");
}
export function creatorCatalog(artworks: Artwork[]) {
  return artworks.filter((artwork) => artwork.accessTier === "creator");
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
    .filter((candidate) => candidate.category === artwork.category ||
      (artwork.worldType !== undefined && candidate.worldType === artwork.worldType))
    .slice(0, limit);
}
