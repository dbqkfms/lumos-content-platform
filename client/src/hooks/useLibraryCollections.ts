import { useMemo } from "react";

import { localArtworks, type Artwork as LocalArtwork } from "@/data/localArtworks";
import { standardArtworks, type Artwork as StandardArtwork } from "@/data/standardArtworks";
import { useContentManagerArtworks } from "@/hooks/useContentManager";

type Artwork = StandardArtwork | LocalArtwork;

export type LibraryArtwork = Artwork & {
  accent: "gold" | "blue";
  collection: "originals" | "open" | "creator";
  world: "standard" | "local";
};

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function parseRuntimeSeconds(runtime: string) {
  const match = runtime.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function decorateArtwork(artwork: Artwork): LibraryArtwork {
  const world = artwork.id.startsWith("standard-") ? "standard" : "local";
  const accent = world === "standard" ? "gold" : "blue";
  const tags = (artwork.tags ?? []).join(" ").toLowerCase();
  const text = `${artwork.title} ${artwork.description} ${artwork.category} ${tags}`.toLowerCase();
  const runtimeSeconds = parseRuntimeSeconds(artwork.runtime);
  const isCreator = artwork.id.startsWith("lumos-");
  const isOpen =
    isCreator &&
    (runtimeSeconds <= 12 ||
      includesAny(text, ["sample", "open", "trial", "카페", "로비", "쇼룸", "free", "warm", "healing", "힐링"]));

  return {
    ...artwork,
    accent,
    collection: isCreator ? (isOpen ? "open" : "creator") : "originals",
    world,
  };
}

function pickFeatured<T>(items: T[], size: number) {
  return items.slice(0, size);
}

export function useLibraryCollections() {
  const { artworks: mergedStandard, loading: loadingStandard } = useContentManagerArtworks(standardArtworks, "standard");
  const { artworks: mergedLocal, loading: loadingLocal } = useContentManagerArtworks(localArtworks, "local");

  return useMemo(() => {
    const originalsStandard = mergedStandard
      .filter((artwork) => artwork.id.startsWith("standard-"))
      .map(decorateArtwork);
    const originalsLocal = mergedLocal
      .filter((artwork) => artwork.id.startsWith("local-"))
      .map(decorateArtwork);
    const creatorPool = [...mergedStandard, ...mergedLocal]
      .filter((artwork) => artwork.id.startsWith("lumos-"))
      .map(decorateArtwork);

    const openWorks = creatorPool.filter((artwork) => artwork.collection === "open");
    const creatorWorks = creatorPool.filter((artwork) => artwork.collection === "creator");
    const fallbackOpen = creatorWorks.slice(0, Math.max(0, 12 - openWorks.length));

    const all = [...originalsStandard, ...originalsLocal, ...creatorPool];
    const originals = [...originalsStandard, ...originalsLocal];

    return {
      loading: loadingStandard || loadingLocal,
      all,
      originals,
      originalsStandard,
      originalsLocal,
      openWorks: [...openWorks, ...fallbackOpen].slice(0, 12),
      creatorWorks,
      featuredOriginals: pickFeatured(originals, 6),
      featuredCreatorWorks: pickFeatured(creatorPool, 8),
      featuredOpenWorks: pickFeatured([...openWorks, ...fallbackOpen], 8),
      solutionHighlights: {
        hotel: all.filter((artwork) => includesAny((artwork.tags ?? []).join(" ").toLowerCase(), ["호텔", "로비"])).slice(0, 3),
        retail: all.filter((artwork) => includesAny((artwork.tags ?? []).join(" ").toLowerCase(), ["리테일", "쇼룸", "브랜드"])).slice(0, 3),
        fnb: all.filter((artwork) => includesAny((artwork.tags ?? []).join(" ").toLowerCase(), ["카페", "레스토랑", "f&b"])).slice(0, 3),
        office: all.filter((artwork) => includesAny((artwork.tags ?? []).join(" ").toLowerCase(), ["오피스", "라운지", "공용부"])).slice(0, 3),
        public: all.filter((artwork) => includesAny((artwork.tags ?? []).join(" ").toLowerCase(), ["전시", "공공공간", "관광", "행사"])).slice(0, 3),
      },
    };
  }, [loadingLocal, loadingStandard, mergedLocal, mergedStandard]);
}

export const creatorSpotlights = [
  {
    name: "Studio Warm Current",
    label: "Warm / Lifestyle",
    description: "카페와 F&B에 맞는 저피로 루프, 감성형 장면, 체류형 무드를 담당하는 큐레이션 그룹입니다.",
  },
  {
    name: "Frame Seoul",
    label: "City / Culture",
    description: "서울의 풍경, 도시 서사, K-culture 장면을 상업공간용으로 편집하는 로컬 비주얼 셀렉션입니다.",
  },
  {
    name: "Signal Fabric",
    label: "Abstract / Motion",
    description: "리테일 쇼룸과 브랜드 월에 맞는 모션 그래픽 기반 비주얼을 구성하는 아티스트 풀입니다.",
  },
];
