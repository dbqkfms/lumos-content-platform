import { useMemo } from "react";
import { useMarketplace, type Artwork } from "@/contexts/MarketplaceContext";
import { buildLibraryCollections, type DecoratedArtwork } from "@/lib/catalogRules";

export type LibraryArtwork = DecoratedArtwork<Artwork>;

// List cards and detail pages read the same normalized catalogue.
export function useLibraryCollections() {
  const { artworks, loading } = useMarketplace();
  return useMemo(() => ({ ...buildLibraryCollections(artworks), loading }), [artworks, loading]);
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
