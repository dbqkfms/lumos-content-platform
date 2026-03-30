import { ArrowRight, BadgeDollarSign, PlayCircle, Search, UserRound } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "wouter";

import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import { localArtworks } from "@/data/localArtworks";
import { standardArtworks } from "@/data/standardArtworks";
import { useContentManagerArtworks } from "@/hooks/useContentManager";
import { pickContentBuckets, type CatalogArtwork } from "@/lib/contentBuckets";

const offerCards = [
  {
    label: "OPEN / SAMPLE",
    title: "무료 또는 샘플 성격의 진입 구간",
    icon: PlayCircle,
    tone: "text-[#D4A843]",
    body: "처음 보는 사람도 부담 없이 들어올 수 있는 층위입니다. 내부 검토, 첫 미팅 전 방향 정리, 샘플 탐색에 적합합니다.",
  },
  {
    label: "LUMOS ORIGINALS",
    title: "LUMOS가 직접 큐레이션하는 핵심 구간",
    icon: BadgeDollarSign,
    tone: "text-[#93C5FD]",
    body: "이 안에서 STANDARD와 LOCAL이 다시 분리되어 보여야 합니다. 이원화를 가장 강하게 체감시키는 자리입니다.",
  },
  {
    label: "CREATOR WORKS",
    title: "작가 및 크리에이터 기반 라이선스 구간",
    icon: UserRound,
    tone: "text-white",
    body: "외부 작가/크리에이터 작업을 보여주는 층위입니다. 프리뷰와 실제 사용 권리를 분리해 읽히게 해야 합니다.",
  },
];

const highCategories = [
  {
    label: "ARTIST",
    title: "아티스트 중심",
    body: "작가성과 세계관이 먼저 읽히는 분류입니다. Creator Works 쪽에서 특히 중요합니다.",
  },
  {
    label: "GENERAL",
    title: "일반 콘텐츠",
    body: "호텔, 로비, 카페, 리테일처럼 공간 목적이 먼저 읽히는 분류입니다.",
  },
  {
    label: "MOOD / BRAND",
    title: "무드·브랜드형",
    body: "시즌, 캠페인, 메인 비주얼처럼 제안 목적이 선명한 분류입니다.",
  },
];

function ArtworkRail({
  title,
  artworks,
  onOpen,
}: {
  title: string;
  artworks: CatalogArtwork[];
  onOpen: (id: string) => void;
}) {
  return (
    <article className="border border-white/8 bg-[#111] p-6">
      <h3 className="font-content-heading text-[1.3rem] text-white">{title}</h3>
      <div className="mt-5 grid gap-3">
        {artworks.map((artwork) => (
          <button
            key={artwork.id}
            onClick={() => onOpen(artwork.id)}
            className="flex items-center gap-3 border border-white/8 bg-black/20 p-3 text-left transition-colors hover:bg-black/35"
          >
            <img src={artwork.image} alt={artwork.title} className="h-16 w-16 object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{artwork.title}</p>
              <p className="mt-1 text-xs text-gray-400">{artwork.category}</p>
            </div>
          </button>
        ))}
      </div>
    </article>
  );
}

export default function ContentGuide() {
  const [, setLocation] = useLocation();
  const { artworks: mergedStandard } = useContentManagerArtworks(standardArtworks, "standard");
  const { artworks: mergedLocal } = useContentManagerArtworks(localArtworks, "local");
  const merged = useMemo(() => [...mergedStandard, ...mergedLocal], [mergedLocal, mergedStandard]);
  const buckets = useMemo(() => pickContentBuckets(merged), [merged]);

  return (
    <div className="content-sans min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <FloatingCTA />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">CONTENT PAGE</p>
            <h1 className="font-content-heading max-w-4xl text-[2.4rem] text-white md:text-[4rem]">
              콘텐츠는 먼저 3분류가 보이고,
              <br />
              그 안에서 다시 STANDARD / LOCAL과 Creator Works가 읽혀야 합니다
            </h1>
            <p className="font-content-body mt-6 max-w-3xl text-base text-gray-300 md:text-lg">
              이 페이지의 역할은 플랫폼 구조를 직관적으로 보여주는 것입니다. `Open / Sample`, `LUMOS Originals`,
              `Creator Works`를 먼저 보여주고, 그 다음 단계에서 분류와 탐색으로 내려가게 만드는 흐름이 맞습니다.
            </p>
          </div>

          <div className="border border-white/8 bg-[#111] p-6">
            <div className="flex items-center gap-2 text-[#93C5FD]">
              <Search className="h-4 w-4" />
              <p className="font-accent text-[11px] tracking-[0.24em]">PRIMARY ACTION</p>
            </div>
            <h2 className="font-content-heading mt-4 text-[1.4rem] text-white">검색은 장식이 아니라 핵심 기능입니다</h2>
            <p className="font-content-body mt-3 text-sm text-gray-400">
              검색창, 필터, 정렬, 추천 컬렉션, 태그 칩은 콘텐츠 허브의 중심 기능이어야 합니다. 이 페이지는 구조를 설명하되,
              실제 탐색은 상세 카탈로그로 이어져야 합니다.
            </p>
            <button
              onClick={() => setLocation("/standard")}
              className="mt-6 inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-sm text-white transition-colors hover:bg-white/5"
            >
              Originals 먼저 보기
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-screen-xl gap-5 lg:grid-cols-3">
          {offerCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="border border-white/8 bg-[#111] p-6">
                <Icon className={`h-5 w-5 ${card.tone}`} />
                <p className={`mt-4 font-accent text-[10px] tracking-[0.22em] ${card.tone}`}>{card.label}</p>
                <h3 className="font-content-heading mt-3 text-[1.35rem] text-white">{card.title}</h3>
                <p className="font-content-body mt-4 text-sm text-gray-400">{card.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0b0b0b] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-10 max-w-3xl">
            <p className="font-accent text-xs tracking-[0.26em] text-[#93C5FD]">HIGH CATEGORY</p>
            <h2 className="font-content-heading mt-3 text-[2rem] text-white md:text-[2.6rem]">
              2차 분류는 단순하고 명확해야 합니다
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {highCategories.map((item) => (
              <article key={item.title} className="border border-white/8 bg-[#111] p-6">
                <p className="font-accent text-[10px] tracking-[0.22em] text-[#93C5FD]">{item.label}</p>
                <h3 className="font-content-heading mt-3 text-[1.2rem] text-white">{item.title}</h3>
                <p className="font-content-body mt-4 text-sm text-gray-400">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0a0a0a] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-10 max-w-3xl">
            <p className="font-accent text-xs tracking-[0.26em] text-[#D4A843]">LIVE SAMPLE</p>
            <h2 className="font-content-heading mt-3 text-[2rem] text-white md:text-[2.6rem]">
              현재 연결된 샘플도 이 구조 아래에서 충분히 설명할 수 있습니다
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <ArtworkRail title="Open / Sample 예시" artworks={buckets.preview.slice(0, 2)} onOpen={(id) => setLocation(`/artwork/${id}`)} />
            <ArtworkRail title="LUMOS Originals 예시" artworks={buckets.lumos.slice(0, 2)} onOpen={(id) => setLocation(`/artwork/${id}`)} />
            <ArtworkRail title="Creator Works 예시" artworks={buckets.creator.slice(0, 2)} onOpen={(id) => setLocation(`/artwork/${id}`)} />
          </div>
        </div>
      </section>
    </div>
  );
}
