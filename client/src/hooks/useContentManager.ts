/**
 * Content Manager에서 내보낸 JSON 데이터를 런타임에 불러와
 * 기존 정적 작품 데이터와 합치는 훅
 */
import { useState, useEffect } from "react";
import type { Artwork } from "@/data/standardArtworks";

const CM_JSON_PATH = "/data/content-manager-artworks.json";

interface CMEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  videoSrc: string;
  embedUrl?: string; // 구버전 export 호환
  displayType: "Horizontal" | "Vertical";
  runtime: string;
  resolution: string;
  tags: string[];
  worldType: "standard" | "local";
  styleCode: string;
  titleEn: string;
  vimeoId: string;
  createdAt: string;
}

function cmToArtwork(entry: CMEntry): Artwork | null {
  // videoSrc가 비어있으면 embedUrl 사용 (구버전 export 호환)
  // 빈 문자열은 undefined로 변환하여 <video src=""> 경고 방지
  const videoSrc = entry.videoSrc || entry.embedUrl || undefined;
  const image = entry.image || undefined;
  // 이미지가 없으면 카드 렌더링 불가 → 제외
  if (!image) return null;
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    category: entry.category,
    image,
    videoSrc,
    displayType: entry.displayType,
    runtime: entry.runtime,
    resolution: entry.resolution,
    tags: entry.tags,
  };
}

function normalizeValue(value?: string) {
  return (value || "").trim().toLowerCase();
}

function artworkKeys(artwork: Artwork) {
  const keys: string[] = [];
  const idKey = normalizeValue(artwork.id);
  const videoKey = normalizeValue(artwork.videoSrc);
  const titleKey = normalizeValue(artwork.title);
  const categoryKey = normalizeValue(artwork.category);
  const runtimeKey = normalizeValue(artwork.runtime);
  const resolutionKey = normalizeValue(artwork.resolution);

  if (idKey) keys.push(`id:${idKey}`);
  if (videoKey) keys.push(`video:${videoKey}`);
  if (titleKey) {
    keys.push(`semantic:${titleKey}|${categoryKey}|${runtimeKey}|${resolutionKey}`);
  }

  return keys;
}

function mergeUniqueArtworks(staticArtworks: Artwork[], cmArtworks: Artwork[]) {
  const seen = new Set<string>();
  const merged: Artwork[] = [];

  for (const artwork of [...staticArtworks, ...cmArtworks]) {
    const keys = artworkKeys(artwork);
    if (keys.length > 0 && keys.some((key) => seen.has(key))) {
      continue;
    }

    merged.push(artwork);
    keys.forEach((key) => seen.add(key));
  }

  return merged;
}

// Content Manager에서 가져온 작품 데이터를 캐시
let cachedStandard: Artwork[] | null = null;
let cachedLocal: Artwork[] | null = null;
let fetchPromise: Promise<void> | null = null;

async function loadCMData() {
  if (cachedStandard !== null) return;

  try {
    const resp = await fetch(CM_JSON_PATH);
    if (!resp.ok) {
      cachedStandard = [];
      cachedLocal = [];
      return;
    }
    const data: CMEntry[] = await resp.json();
    cachedStandard = data
      .filter(e => e.worldType === "standard")
      .map(cmToArtwork)
      .filter((a): a is Artwork => a !== null);
    cachedLocal = data
      .filter(e => e.worldType === "local")
      .map(cmToArtwork)
      .filter((a): a is Artwork => a !== null);
  } catch {
    cachedStandard = [];
    cachedLocal = [];
  }
}

export function useContentManagerArtworks(
  staticArtworks: Artwork[],
  worldType: "standard" | "local",
): { artworks: Artwork[]; loading: boolean } {
  const [loading, setLoading] = useState(cachedStandard === null);
  const [merged, setMerged] = useState<Artwork[]>(staticArtworks);

  useEffect(() => {
    if (cachedStandard !== null) {
      const cm = worldType === "standard" ? cachedStandard : cachedLocal!;
      setMerged(mergeUniqueArtworks(staticArtworks, cm));
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = loadCMData();
    }

    fetchPromise.then(() => {
      const cm = worldType === "standard" ? cachedStandard! : cachedLocal!;
      setMerged(mergeUniqueArtworks(staticArtworks, cm));
      setLoading(false);
    });
  }, [staticArtworks, worldType]);

  return { artworks: merged, loading };
}
