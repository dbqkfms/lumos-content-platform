// Artist Dashboard — 아티스트 포털 대시보드
import React, { useMemo } from "react";
import { Link } from "wouter";
import { PortalShell } from "@/components/shells/PortalShell";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useArtworks } from "@/contexts/ArtworkContext";

export default function ArtistDashboard() {
  const { user } = useAuth();
  const { getArtworksByArtist } = useArtworks();

  // 현재 아티스트의 작품만 필터링
  const myArtworks = useMemo(
    () => getArtworksByArtist(user?.id ?? ""),
    [user?.id, getArtworksByArtist]
  );

  // 상태별 카운트
  const totalCount = myArtworks.length;
  const publishedCount = myArtworks.filter(
    a => a.status === "published"
  ).length;
  const pendingCount = myArtworks.filter(
    a => a.status === "submitted" || a.status === "under_review"
  ).length;
  const draftCount = myArtworks.filter(
    a => a.status === "draft"
  ).length;

  // 최근 작품 5개 (제출일 또는 상태 이력 기준 최신순)
  const recentWorks = useMemo(() => {
    const sorted = [...myArtworks].sort((a, b) => {
      const aDate =
        a.statusHistory?.[a.statusHistory.length - 1]
          ?.changedAt ?? "";
      const bDate =
        b.statusHistory?.[b.statusHistory.length - 1]
          ?.changedAt ?? "";
      return (
        new Date(bDate).getTime() - new Date(aDate).getTime()
      );
    });
    return sorted.slice(0, 5);
  }, [myArtworks]);

  return (
    <PortalShell role="artist" title="Dashboard">
      {/* 환영 메시지 */}
      <div className="mb-8">
        <h1 className="font-display text-2xl text-[#f5f5f5] mb-1">
          {user?.name ?? "아티스트"}님, 환영합니다
        </h1>
        <p className="text-[#909090] text-sm">
          작품 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 지표 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard label="전체 작품" value={totalCount} />
        <MetricCard
          label="발행됨"
          value={publishedCount}
          changeType="positive"
        />
        <MetricCard
          label="검토 대기"
          value={pendingCount}
          changeType="neutral"
        />
        <MetricCard label="초안" value={draftCount} />
      </div>

      {/* 최근 작품 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-accent text-[10px] tracking-[0.6em] uppercase text-[#909090]">
            최근 작품
          </h2>
          <Link to="/artist/works">
            <span className="text-[#D4A843] font-accent text-[10px] tracking-[0.3em] uppercase cursor-pointer hover:text-[#F0C060] transition-colors">
              전체 보기
            </span>
          </Link>
        </div>

        {recentWorks.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-white/5 p-8 text-center">
            <p className="text-[#909090] text-sm mb-4">
              아직 등록된 작품이 없습니다.
            </p>
            <Link to="/artist/upload">
              <span className="bg-[#D4A843] text-black font-accent text-[10px] tracking-[0.3em] uppercase px-6 py-2.5 hover:bg-[#F0C060] transition-colors cursor-pointer inline-block">
                새 작품 업로드
              </span>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentWorks.map(work => {
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
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-accent text-[9px] tracking-[0.4em] uppercase text-[#909090]">
                          {work.worldType === "standard"
                            ? "STANDARD"
                            : "LOCAL"}
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
      </section>
    </PortalShell>
  );
}
