// WorkDetail -- 아티스트 작품 상세 페이지
import React, { useMemo, useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { PortalShell } from "@/components/shells/PortalShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatusTimeline } from "@/components/shared/StatusTimeline";
import { useAuth } from "@/contexts/AuthContext";
import { useArtworks } from "@/contexts/ArtworkContext";
import { VALID_TRANSITIONS } from "@/data/mockData";

export default function WorkDetail() {
  const { user } = useAuth();
  const { getArtwork, updateArtworkStatus } = useArtworks();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/artist/works/:id");
  const [actionDone, setActionDone] = useState(false);

  // 작품 조회 (ArtworkContext에서 실시간)
  const artwork = useMemo(() => {
    if (!params?.id) return null;
    return getArtwork(params.id) ?? null;
  }, [params?.id, getArtwork]);

  // 소유권 확인
  const isOwner =
    artwork && user && artwork.artistId === user.id;

  // 라우트 매치 실패 또는 작품 없음
  if (!match || !artwork) {
    return (
      <PortalShell role="artist" title="Work Detail">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-[#909090] text-4xl mb-4">
            404
          </div>
          <h2 className="font-display text-xl text-[#f5f5f5] mb-2">
            작품을 찾을 수 없습니다
          </h2>
          <p className="text-[#909090] text-sm mb-6">
            요청한 작품이 존재하지 않거나 삭제되었습니다.
          </p>
          <Link to="/artist/works">
            <span className="bg-[#D4A843] text-black font-accent text-[10px] tracking-[0.3em] uppercase px-6 py-2.5 hover:bg-[#F0C060] transition-colors cursor-pointer inline-block">
              목록으로 돌아가기
            </span>
          </Link>
        </div>
      </PortalShell>
    );
  }

  // 소유자가 아닌 경우
  if (!isOwner) {
    return (
      <PortalShell role="artist" title="Work Detail">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-[#909090] text-4xl mb-4">
            403
          </div>
          <h2 className="font-display text-xl text-[#f5f5f5] mb-2">
            접근 권한이 없습니다
          </h2>
          <p className="text-[#909090] text-sm mb-6">
            이 작품은 다른 아티스트의 작품입니다.
          </p>
          <Link to="/artist/works">
            <span className="bg-[#D4A843] text-black font-accent text-[10px] tracking-[0.3em] uppercase px-6 py-2.5 hover:bg-[#F0C060] transition-colors cursor-pointer inline-block">
              내 작품 목록
            </span>
          </Link>
        </div>
      </PortalShell>
    );
  }

  // 상태 전이 가능 여부 확인
  const canSubmit =
    artwork.status === "draft" ||
    artwork.status === "changes_requested";
  const validNext = VALID_TRANSITIONS[artwork.status];

  // 제출/재제출 액션 핸들러 (ArtworkContext에서 실제 상태 변경)
  const handleSubmitAction = () => {
    if (!artwork || !user) return;
    const success = updateArtworkStatus(
      artwork.id,
      "submitted",
      user.id,
      artwork.status === "changes_requested"
        ? "수정 완료 후 재제출합니다"
        : undefined
    );
    if (success) {
      setActionDone(true);
      setTimeout(() => {
        setLocation("/artist/works");
      }, 2000);
    }
  };

  // 액션 완료 메시지
  if (actionDone) {
    return (
      <PortalShell role="artist" title="Work Detail">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-emerald-400 text-4xl mb-4">
            ✓
          </div>
          <h2 className="font-display text-xl text-[#f5f5f5] mb-2">
            {artwork.status === "draft"
              ? "작품이 제출되었습니다"
              : "작품이 재제출되었습니다"}
          </h2>
          <p className="text-[#909090] text-sm">
            관리자 검토 후 결과를 알려드립니다.
          </p>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell role="artist" title={artwork.title}>
      {/* 뒤로가기 */}
      <div className="mb-6">
        <Link to="/artist/works">
          <span className="text-[#909090] hover:text-[#f5f5f5] font-accent text-[10px] tracking-[0.2em] uppercase cursor-pointer transition-colors">
            &larr; 작품 목록
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 좌측: 작품 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 썸네일 */}
          <div className="bg-[#0f0f0f] border border-white/5 overflow-hidden">
            {artwork.image ? (
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-auto max-h-[400px] object-contain"
              />
            ) : (
              <div className="w-full h-[300px] flex items-center justify-center text-[#909090] text-sm">
                이미지 없음
              </div>
            )}
          </div>

          {/* 제목 + 상태 */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl text-[#f5f5f5] mb-2">
                {artwork.title}
              </h1>
              <p className="text-[#909090] text-sm leading-relaxed">
                {artwork.description}
              </p>
            </div>
            <StatusBadge status={artwork.status} />
          </div>

          {/* 메타데이터 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* 카테고리 */}
            <div className="bg-[#1a1a1a] border border-white/5 p-4">
              <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                Category
              </div>
              <div className="text-[#f5f5f5] text-sm">
                {artwork.category}
              </div>
            </div>

            {/* World Type */}
            <div className="bg-[#1a1a1a] border border-white/5 p-4">
              <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                World Type
              </div>
              <div
                className={
                  "text-sm font-accent tracking-[0.2em] uppercase " +
                  (artwork.worldType === "standard"
                    ? "text-[#D4A843]"
                    : "text-[#93C5FD]")
                }
              >
                {artwork.worldType === "standard"
                  ? "STANDARD"
                  : "LOCAL"}
              </div>
            </div>

            {/* Display Type */}
            <div className="bg-[#1a1a1a] border border-white/5 p-4">
              <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                Display Type
              </div>
              <div className="text-[#f5f5f5] text-sm">
                {artwork.displayType}
              </div>
            </div>

            {/* 해상도 */}
            <div className="bg-[#1a1a1a] border border-white/5 p-4">
              <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                Resolution
              </div>
              <div className="text-[#f5f5f5] text-sm">
                {artwork.resolution}
              </div>
            </div>

            {/* 재생시간 */}
            <div className="bg-[#1a1a1a] border border-white/5 p-4">
              <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                Runtime
              </div>
              <div className="text-[#f5f5f5] text-sm">
                {artwork.runtime}초
              </div>
            </div>

            {/* 아티스트 */}
            <div className="bg-[#1a1a1a] border border-white/5 p-4">
              <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                Artist
              </div>
              <div className="text-[#f5f5f5] text-sm">
                {artwork.artist}
              </div>
            </div>
          </div>

          {/* 태그 */}
          {artwork.tags && artwork.tags.length > 0 && (
            <div>
              <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-3">
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-white/5 text-[#e0e0e0] font-accent text-[10px] tracking-[0.15em] px-3 py-1.5 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 우측: 상태 + 타임라인 + 액션 */}
        <div className="space-y-6">
          {/* 현재 상태 카드 */}
          <div className="bg-[#1a1a1a] border border-white/5 p-6">
            <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-3">
              현재 상태
            </div>
            <StatusBadge
              status={artwork.status}
              className="mb-4"
            />

            {/* 수정 요청 노트 */}
            {artwork.status === "changes_requested" &&
              artwork.reviewNotes && (
                <div className="mt-4">
                  <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-red-400 mb-2">
                    Review Notes
                  </div>
                  <div className="bg-red-900/10 border border-red-900/20 p-3 text-[#e0e0e0] text-sm leading-relaxed">
                    {artwork.reviewNotes}
                  </div>
                </div>
              )}

            {/* 액션 버튼 */}
            {canSubmit &&
              validNext.includes("submitted") && (
                <button
                  onClick={handleSubmitAction}
                  className="w-full mt-4 bg-[#D4A843] text-black font-accent text-[10px] tracking-[0.3em] uppercase py-3 hover:bg-[#F0C060] transition-colors"
                >
                  {artwork.status === "draft"
                    ? "Submit for Review"
                    : "Resubmit"}
                </button>
              )}
          </div>

          {/* 상태 타임라인 */}
          <div className="bg-[#1a1a1a] border border-white/5 p-6">
            <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-4">
              상태 이력
            </div>
            <StatusTimeline
              entries={artwork.statusHistory ?? []}
            />
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
