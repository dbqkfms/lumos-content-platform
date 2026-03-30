import type { Artwork as LocalArtwork } from "@/data/localArtworks";
import type { Artwork as StandardArtwork } from "@/data/standardArtworks";

export type CatalogArtwork = StandardArtwork | LocalArtwork;

export function pickContentBuckets(artworks: CatalogArtwork[]) {
  return {
    preview: artworks.filter((artwork) => artwork.videoSrc?.includes("vimeo.com")).slice(0, 4),
    lumos: artworks
      .filter((artwork) => artwork.id.startsWith("standard-") || artwork.id.startsWith("local-"))
      .slice(0, 4),
    creator: artworks.filter((artwork) => artwork.id.startsWith("lumos-")).slice(0, 4),
  };
}
