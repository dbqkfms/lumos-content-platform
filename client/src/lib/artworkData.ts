import { uniqueArtworksById } from "@/lib/catalogRules";
import type { Artwork } from "@/contexts/MarketplaceContext";

export interface ManagedArtwork extends Artwork {
  sourcePath?: string;
  sourceHash?: string;
  importedAt?: string;
}

// Asset basenames are not artwork identities: different creators may upload
// preview.mp4. Retain separate IDs; review duplicate media in an asset audit.
export function dedupeArtworks(artworks: Artwork[]): Artwork[] {
  return uniqueArtworksById(artworks);
}

export async function loadManagedArtworks(): Promise<ManagedArtwork[]> {
  try {
    const response = await fetch(`/data/managed-artworks.json?ts=${Date.now()}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as unknown;
    if (!Array.isArray(payload)) {
      return [];
    }

    return payload.filter((item): item is ManagedArtwork => Boolean(item && typeof item === "object" && "id" in item));
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
