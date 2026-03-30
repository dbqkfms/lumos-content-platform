// Admin Artists — 관리자 아티스트 관리 목록
import { useMemo } from "react";
import { PortalShell } from "@/components/shells/PortalShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { MOCK_USERS } from "@/data/mockData";
import { useArtworks } from "@/contexts/ArtworkContext";

export default function Artists() {
  const { artworks: allArtworks } = useArtworks();

  // 아티스트만 필터링
  const artists = useMemo(
    () => MOCK_USERS.filter(u => u.role === "artist"),
    []
  );

  // 아티스트별 작품 통계 계산
  const artistStats = useMemo(() => {
    const stats: Record<
      string,
      { total: number; published: number }
    > = {};
    allArtworks.forEach(artwork => {
      const id = artwork.artistId;
      if (!id) return;
      if (!stats[id]) {
        stats[id] = { total: 0, published: 0 };
      }
      stats[id].total++;
      if (artwork.status === "published") {
        stats[id].published++;
      }
    });
    return stats;
  }, [allArtworks]);

  // 날짜 포맷 헬퍼
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <PortalShell role="admin" title="Artists">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-accent text-[10px] tracking-[0.6em] uppercase text-[#909090]">
            Registered Artists
          </h2>
          <div className="text-[#909090] font-accent text-[10px] mt-1">
            총 {artists.length}명의 아티스트
          </div>
        </div>
      </div>

      {/* 아티스트 목록 */}
      {artists.length === 0 ? (
        <EmptyState
          icon={<span className="text-4xl">&#x25C7;</span>}
          title="등록된 아티스트가 없습니다"
          description="아직 등록된 아티스트가 없습니다."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artists.map(artist => {
            const stats = artistStats[artist.id] || {
              total: 0,
              published: 0,
            };

            return (
              <div
                key={artist.id}
                className="bg-[#1a1a1a] border border-white/5 p-6 hover:border-emerald-400/20 transition-colors"
              >
                {/* 상단: 아바타 + 기본 정보 */}
                <div className="flex items-start gap-4 mb-4">
                  {/* 아바타 (이니셜) */}
                  <div className="w-12 h-12 bg-emerald-900/30 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-display text-lg">
                      {artist.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#f5f5f5] text-base font-display truncate">
                      {artist.name}
                    </h3>
                    <div className="text-[#909090] font-accent text-[10px] tracking-wide">
                      {artist.email}
                    </div>
                  </div>
                </div>

                {/* 바이오 */}
                {artist.bio && (
                  <p className="text-[#909090] text-sm leading-relaxed mb-4 line-clamp-2">
                    {artist.bio}
                  </p>
                )}

                {/* 포트폴리오 링크 */}
                {artist.portfolio && (
                  <div className="mb-4">
                    <a
                      href={artist.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-accent text-[10px] tracking-[0.2em] uppercase text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Portfolio &rarr;
                    </a>
                  </div>
                )}

                {/* 하단: 통계 + 가입일 */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  {/* 전체 작품 수 */}
                  <div className="flex-1">
                    <div className="font-accent text-[9px] tracking-[0.4em] uppercase text-[#909090] mb-0.5">
                      Total
                    </div>
                    <div className="text-[#f5f5f5] text-lg font-display">
                      {stats.total}
                    </div>
                  </div>

                  {/* 발행 작품 수 */}
                  <div className="flex-1">
                    <div className="font-accent text-[9px] tracking-[0.4em] uppercase text-[#909090] mb-0.5">
                      Published
                    </div>
                    <div className="text-emerald-400 text-lg font-display">
                      {stats.published}
                    </div>
                  </div>

                  {/* 가입일 */}
                  <div className="flex-1 text-right">
                    <div className="font-accent text-[9px] tracking-[0.4em] uppercase text-[#909090] mb-0.5">
                      Joined
                    </div>
                    <div className="text-[#909090] font-accent text-[10px]">
                      {formatDate(artist.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PortalShell>
  );
}
