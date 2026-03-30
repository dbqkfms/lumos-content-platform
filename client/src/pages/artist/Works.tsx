// Artist Works — 아티스트 작품 목록
import React, { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { PortalShell } from "@/components/shells/PortalShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { useArtworks } from "@/contexts/ArtworkContext";
import type { ArtworkStatus } from "@/types";

// 탭 필터 정의
type TabFilter = "all" | "draft" | "submitted" | "published";

const TABS: { key: TabFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "draft", label: "초안" },
  { key: "submitted", label: "제출됨" },
  { key: "published", label: "발행됨" },
];

// 탭 필터에 해당하는 상태 매핑
const TAB_STATUS_MAP: Record<TabFilter, ArtworkStatus[] | null> =
  {
    all: null,
    draft: ["draft"],
    submitted: [
      "submitted",
      "under_review",
      "changes_requested",
      "approved",
    ],
    published: ["published"],
  };

export default function ArtistWorks() {
  const { user } = useAuth();
  const { getArtworksByArtist } = useArtworks();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] =
    useState<TabFilter>("all");

  // 현재 아티스트의 작품만 필터링 (ArtworkContext)
  const myArtworks = useMemo(
    () => getArtworksByArtist(user?.id ?? ""),
    [user?.id, getArtworksByArtist]
  );

  // 탭 필터 적용
  const filteredArtworks = useMemo(() => {
    const statuses = TAB_STATUS_MAP[activeTab];
    if (!statuses) return myArtworks;
    return myArtworks.filter(a => statuses.includes(a.status));
  }, [myArtworks, activeTab]);

  // 각 탭별 카운트
  const tabCounts = useMemo(() => {
    const counts: Record<TabFilter, number> = {
      all: myArtworks.length,
      draft: myArtworks.filter(a => a.status === "draft")
        .length,
      submitted: myArtworks.filter(
        a =>
          a.status === "submitted" ||
          a.status === "under_review" ||
          a.status === "changes_requested" ||
          a.status === "approved"
      ).length,
      published: myArtworks.filter(
        a => a.status === "published"
      ).length,
    };
    return counts;
  }, [myArtworks]);

  return (
    <PortalShell role="artist" title="My Works">
      {/* 상단: 제목 + 업로드 버튼 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-[#f5f5f5]">
          내 작품
        </h1>
        <Link to="/artist/upload">
          <span className="bg-[#D4A843] text-black font-accent text-[10px] tracking-[0.3em] uppercase px-6 py-2.5 hover:bg-[#F0C060] transition-colors cursor-pointer inline-block">
            새 작품 업로드
          </span>
        </Link>
      </div>

      {/* 탭 필터 */}
      <div className="flex gap-0 border-b border-white/[0.08] mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 font-accent text-[10px] tracking-[0.3em] uppercase transition-colors border-b-2 ${
              activeTab === tab.key
                ? "text-[#f5f5f5] border-[#D4A843]"
                : "text-[#909090] border-transparent hover:text-[#e0e0e0]"
            }`}
          >
            {tab.label}
            <span className="ml-2 text-[9px] text-[#909090]">
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* 작품 목록 */}
      {filteredArtworks.length === 0 ? (
        <EmptyState
          title="작품이 없습니다"
          description={
            activeTab === "all"
              ? "아직 등록된 작품이 없습니다. 새 작품을 업로드해 보세요."
              : `"${TABS.find(t => t.key === activeTab)?.label}" 상태의 작품이 없습니다.`
          }
          actionLabel={
            activeTab === "all" ? "새 작품 업로드" : undefined
          }
          onAction={
            activeTab === "all"
              ? () => setLocation("/artist/upload")
              : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredArtworks.map(work => {
            // 마지막 변경 날짜
            const lastChange =
              work.statusHistory?.[
                work.statusHistory.length - 1
              ];
            const dateStr = lastChange
              ? new Date(
                  lastChange.changedAt
                ).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "";

            return (
              <Link
                key={work.id}
                to={`/artist/works/${work.id}`}
              >
                <div className="bg-[#1a1a1a] border border-white/5 p-4 flex items-center gap-4 hover:border-white/10 transition-colors cursor-pointer group">
                  {/* 썸네일 */}
                  <div className="w-[120px] h-[68px] bg-[#0f0f0f] flex-shrink-0 overflow-hidden">
                    {work.image ? (
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#909090] text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#f5f5f5] text-sm group-hover:text-[#D4A843] transition-colors truncate">
                      {work.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-accent text-[9px] tracking-[0.4em] uppercase text-[#909090]">
                        {work.worldType === "standard"
                          ? "STANDARD"
                          : "LOCAL"}
                      </span>
                      <span className="text-[#909090] text-[9px]">
                        {work.displayType}
                      </span>
                      <span className="text-[#909090] text-[9px]">
                        {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* 상태 배지 */}
                  <StatusBadge status={work.status} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PortalShell>
  );
}
