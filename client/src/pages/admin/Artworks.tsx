// Admin Artworks — 관리자 작품 관리 목록
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { PortalShell } from "@/components/shells/PortalShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { useArtworks } from "@/contexts/ArtworkContext";
import type { ArtworkStatus } from "@/types";

type TabFilter =
  | "all"
  | "submitted"
  | "under_review"
  | "approved"
  | "published"
  | "changes_requested"
  | "draft"
  | "hidden"
  | "archived";

const TABS: { key: TabFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "submitted", label: "제출됨" },
  { key: "under_review", label: "검토 중" },
  { key: "changes_requested", label: "수정 요청" },
  { key: "approved", label: "승인" },
  { key: "published", label: "발행됨" },
  { key: "draft", label: "초안" },
];

const WORLD_LABELS: Record<string, string> = {
  standard: "STANDARD",
  local: "LOCAL",
};

export default function Artworks() {
  const { artworks: allArtworks } = useArtworks();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArtworks = useMemo(() => {
    return allArtworks.filter(artwork => {
      // 탭 필터
      if (activeTab !== "all" && artwork.status !== activeTab) {
        return false;
      }
      // 검색 필터 (제목)
      if (
        searchTerm &&
        !artwork.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    }).sort(
      (a, b) =>
        new Date(b.submittedAt || b.statusHistory?.[0]?.changedAt || "").getTime() -
        new Date(a.submittedAt || a.statusHistory?.[0]?.changedAt || "").getTime()
    );
  }, [activeTab, searchTerm]);

  // 각 탭별 개수 (ArtworkContext 기반)
  const counts = useMemo(() => {
    const c: Record<TabFilter, number> = {
      all: allArtworks.length,
      submitted: 0,
      under_review: 0,
      approved: 0,
      published: 0,
      changes_requested: 0,
      draft: 0,
      hidden: 0,
      archived: 0,
    };
    allArtworks.forEach(a => {
      if (a.status in c) {
        c[a.status as TabFilter]++;
      }
    });
    return c;
  }, [allArtworks]);

  return (
    <PortalShell role="admin" title="Artworks">
      {/* 검색 + 필터 */}
      <div className="mb-6">
        {/* 검색 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="작품 제목 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full max-w-md bg-[#1a1a1a] border border-white/10 px-4 py-2.5 text-sm text-[#f5f5f5] placeholder-[#909090] font-accent tracking-wide focus:outline-none focus:border-emerald-400/40 transition-colors"
          />
        </div>

        {/* 탭 필터 */}
        <div className="flex flex-wrap gap-1 border-b border-white/5 pb-px">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-accent text-[10px] tracking-[0.3em] uppercase transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "text-emerald-400 border-emerald-400"
                  : "text-[#909090] border-transparent hover:text-[#e0e0e0]"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[#909090]">
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 작품 목록 */}
      {filteredArtworks.length === 0 ? (
        <EmptyState
          icon={<span className="text-4xl">&#x25A3;</span>}
          title="작품이 없습니다"
          description={
            searchTerm
              ? `"${searchTerm}" 검색 결과가 없습니다.`
              : "해당 상태의 작품이 없습니다."
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredArtworks.map(artwork => {
            const dateStr = artwork.submittedAt
              ? new Date(artwork.submittedAt).toLocaleDateString(
                  "ko-KR",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : artwork.statusHistory?.[0]?.changedAt
                ? new Date(
                    artwork.statusHistory[0].changedAt
                  ).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "";

            return (
              <Link
                key={artwork.id}
                to={`/admin/artworks/${artwork.id}`}
              >
                <div className="flex items-center gap-4 bg-[#1a1a1a] border border-white/5 p-4 hover:border-emerald-400/20 transition-colors cursor-pointer group">
                  {/* 썸네일 */}
                  <div className="w-[120px] h-[68px] bg-[#0f0f0f] flex-shrink-0 overflow-hidden">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  </div>

                  {/* 제목 + 아티스트 */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[#f5f5f5] text-sm truncate group-hover:text-white transition-colors">
                      {artwork.title}
                    </div>
                    <div className="text-[#909090] font-accent text-[10px] mt-0.5">
                      {artwork.artist}
                    </div>
                  </div>

                  {/* World 라벨 */}
                  <div
                    className={`font-accent text-[9px] tracking-[0.4em] uppercase px-2 py-1 border ${
                      artwork.worldType === "standard"
                        ? "text-[#D4A843] border-[#D4A843]/20"
                        : "text-[#93C5FD] border-[#93C5FD]/20"
                    }`}
                  >
                    {WORLD_LABELS[artwork.worldType] ||
                      artwork.worldType}
                  </div>

                  {/* 상태 배지 */}
                  <StatusBadge status={artwork.status} />

                  {/* 날짜 */}
                  <div className="text-[#909090] font-accent text-[10px] w-24 text-right flex-shrink-0">
                    {dateStr}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PortalShell>
  );
}
