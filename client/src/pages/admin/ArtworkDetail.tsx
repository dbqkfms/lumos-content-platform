// Admin ArtworkDetail — 관리자 작품 상세 및 심사 액션 패널
import { useState, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { PortalShell } from "@/components/shells/PortalShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatusTimeline } from "@/components/shared/StatusTimeline";
import {
  MOCK_PORTAL_ARTWORKS,
  VALID_TRANSITIONS,
} from "@/data/mockData";
import {
  STATUS_LABELS,
  type Artwork,
  type ArtworkStatus,
  type StatusHistoryEntry,
} from "@/types";

// 전이 가능한 상태에 대한 액션 버튼 라벨 및 스타일 매핑
const ACTION_CONFIG: Record<
  ArtworkStatus,
  { label: string; buttonClass: string }
> = {
  under_review: {
    label: "검토 시작",
    buttonClass:
      "bg-purple-600 hover:bg-purple-500 text-white",
  },
  approved: {
    label: "승인",
    buttonClass:
      "bg-emerald-600 hover:bg-emerald-500 text-white",
  },
  changes_requested: {
    label: "수정 요청",
    buttonClass: "bg-red-600 hover:bg-red-500 text-white",
  },
  published: {
    label: "발행",
    buttonClass:
      "bg-blue-600 hover:bg-blue-500 text-white",
  },
  hidden: {
    label: "숨김",
    buttonClass:
      "bg-gray-600 hover:bg-gray-500 text-white",
  },
  submitted: {
    label: "제출",
    buttonClass:
      "bg-amber-600 hover:bg-amber-500 text-white",
  },
  draft: {
    label: "초안",
    buttonClass:
      "bg-gray-700 hover:bg-gray-600 text-white",
  },
  archived: {
    label: "보관",
    buttonClass:
      "bg-gray-700 hover:bg-gray-600 text-white",
  },
};

// 토스트 알림 컴포넌트
function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-900/90 border border-emerald-400/30 px-5 py-3 text-emerald-300 font-accent text-xs tracking-wide animate-in">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-emerald-400 hover:text-white transition-colors"
      >
        &times;
      </button>
    </div>
  );
}

export default function ArtworkDetail() {
  // 라우트 파라미터 추출
  const [match, params] = useRoute("/admin/artworks/:id");
  const artworkId = params?.id;

  // 원본 데이터에서 작품 찾기
  const originalArtwork = useMemo(
    () => MOCK_PORTAL_ARTWORKS.find(a => a.id === artworkId),
    [artworkId]
  );

  // 로컬 상태로 작품 관리 (상태 변경 반영)
  const [artwork, setArtwork] = useState<Artwork | null>(
    originalArtwork ? { ...originalArtwork } : null
  );

  // 리뷰 노트 입력
  const [reviewNote, setReviewNote] = useState("");

  // 토스트 메시지
  const [toast, setToast] = useState<string | null>(null);

  // 작품이 없을 때
  if (!artwork) {
    return (
      <PortalShell role="admin" title="Artwork Detail">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-[#909090] text-6xl mb-4">
            &#x25A3;
          </div>
          <h2 className="font-display text-xl text-[#e0e0e0] mb-2">
            작품을 찾을 수 없습니다
          </h2>
          <p className="text-[#909090] text-sm mb-6">
            ID: {artworkId}
          </p>
          <Link to="/admin/artworks">
            <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors">
              &larr; 작품 목록으로
            </span>
          </Link>
        </div>
      </PortalShell>
    );
  }

  // 현재 상태에서 전이 가능한 상태 목록
  const availableTransitions =
    VALID_TRANSITIONS[artwork.status] || [];

  // 상태 변경 핸들러
  const handleStatusChange = (newStatus: ArtworkStatus) => {
    const now = new Date().toISOString();
    const newEntry: StatusHistoryEntry = {
      status: newStatus,
      changedBy: "admin-001",
      changedAt: now,
      note: reviewNote.trim() || undefined,
    };

    setArtwork(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        status: newStatus,
        statusHistory: [
          ...(prev.statusHistory || []),
          newEntry,
        ],
        reviewNotes: reviewNote.trim() || prev.reviewNotes,
        reviewedAt:
          newStatus === "approved" ||
          newStatus === "changes_requested"
            ? now
            : prev.reviewedAt,
        publishedAt:
          newStatus === "published"
            ? now
            : prev.publishedAt,
      };
    });

    // 노트 초기화 + 토스트 표시
    setReviewNote("");
    setToast(
      `상태가 "${STATUS_LABELS[newStatus]}"(으)로 변경되었습니다.`
    );
    setTimeout(() => setToast(null), 3000);
  };

  // 날짜 포맷 헬퍼
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <PortalShell role="admin" title="Artwork Detail">
      {/* 뒤로가기 */}
      <div className="mb-6">
        <Link to="/admin/artworks">
          <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-[#909090] hover:text-emerald-400 cursor-pointer transition-colors">
            &larr; 작품 목록
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측: 작품 상세 정보 (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 썸네일 / 이미지 */}
          <div className="bg-[#1a1a1a] border border-white/5 overflow-hidden">
            <div className="aspect-video bg-[#0f0f0f] flex items-center justify-center">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-contain"
                onError={e => {
                  (e.target as HTMLImageElement).style.display =
                    "none";
                }}
              />
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="bg-[#1a1a1a] border border-white/5 p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl text-[#f5f5f5] mb-2">
                  {artwork.title}
                </h1>
                <div className="text-[#909090] font-accent text-[10px] tracking-[0.3em] uppercase">
                  by {artwork.artist}
                </div>
              </div>
              <StatusBadge status={artwork.status} />
            </div>

            <p className="text-[#e0e0e0] text-sm leading-relaxed mb-6">
              {artwork.description}
            </p>

            {/* 메타데이터 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* World */}
              <div>
                <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                  World
                </div>
                <span
                  className={`font-accent text-[10px] tracking-[0.3em] uppercase px-2 py-1 inline-block ${
                    artwork.worldType === "standard"
                      ? "bg-[#D4A843]/10 text-[#D4A843]"
                      : "bg-[#93C5FD]/10 text-[#93C5FD]"
                  }`}
                >
                  {artwork.worldType}
                </span>
              </div>

              {/* 카테고리 */}
              <div>
                <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                  Category
                </div>
                <div className="text-[#f5f5f5] text-sm">
                  {artwork.category}
                </div>
              </div>

              {/* 디스플레이 타입 */}
              <div>
                <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                  Display
                </div>
                <div className="text-[#f5f5f5] text-sm">
                  {artwork.displayType}
                </div>
              </div>

              {/* 해상도 */}
              <div>
                <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                  Resolution
                </div>
                <div className="text-[#f5f5f5] text-sm">
                  {artwork.resolution}
                </div>
              </div>

              {/* 재생 시간 */}
              <div>
                <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                  Runtime
                </div>
                <div className="text-[#f5f5f5] text-sm">
                  {artwork.runtime}s
                </div>
              </div>

              {/* 제출일 */}
              <div>
                <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-1">
                  Submitted
                </div>
                <div className="text-[#f5f5f5] text-sm">
                  {formatDate(artwork.submittedAt)}
                </div>
              </div>
            </div>

            {/* 태그 */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="mt-6">
                <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-2">
                  Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/5 text-[#909090] font-accent text-[10px] tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 리뷰 노트 (기존) */}
          {artwork.reviewNotes && (
            <div className="bg-[#1a1a1a] border border-white/5 p-6">
              <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-3">
                Review Notes
              </div>
              <div className="text-[#e0e0e0] text-sm bg-white/5 p-4 border-l-2 border-emerald-400/30">
                {artwork.reviewNotes}
              </div>
            </div>
          )}
        </div>

        {/* 우측: 액션 패널 + 상태 타임라인 (1/3) */}
        <div className="space-y-6">
          {/* 액션 패널 */}
          <div className="bg-[#1a1a1a] border border-white/5 p-6">
            <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-4">
              Actions
            </div>

            {/* 현재 상태 */}
            <div className="mb-4">
              <div className="text-[#909090] font-accent text-[10px] mb-1">
                현재 상태
              </div>
              <StatusBadge
                status={artwork.status}
                className="text-[11px]"
              />
            </div>

            {/* 전이 가능한 액션이 없으면 */}
            {availableTransitions.length === 0 ? (
              <div className="text-[#909090] font-accent text-xs py-4 text-center border border-white/5 bg-white/[0.02]">
                추가 전이가 불가능한 상태입니다.
              </div>
            ) : (
              <>
                {/* 리뷰 노트 입력 (under_review 상태일 때) */}
                {artwork.status === "under_review" && (
                  <div className="mb-4">
                    <label className="block text-[#909090] font-accent text-[10px] mb-2">
                      리뷰 메모
                    </label>
                    <textarea
                      value={reviewNote}
                      onChange={e =>
                        setReviewNote(e.target.value)
                      }
                      placeholder="승인/수정 요청 사유를 입력하세요..."
                      rows={3}
                      className="w-full bg-[#0f0f0f] border border-white/10 px-3 py-2 text-sm text-[#f5f5f5] placeholder-[#606060] font-accent tracking-wide focus:outline-none focus:border-emerald-400/40 transition-colors resize-none"
                    />
                  </div>
                )}

                {/* 액션 버튼들 */}
                <div className="space-y-2">
                  {availableTransitions.map(
                    targetStatus => {
                      const config =
                        ACTION_CONFIG[targetStatus];
                      return (
                        <button
                          key={targetStatus}
                          onClick={() =>
                            handleStatusChange(
                              targetStatus
                            )
                          }
                          className={`w-full px-4 py-2.5 font-accent text-[10px] tracking-[0.3em] uppercase transition-colors ${config.buttonClass}`}
                        >
                          {config.label}
                        </button>
                      );
                    }
                  )}
                </div>
              </>
            )}
          </div>

          {/* 상태 변경 타임라인 */}
          <div className="bg-[#1a1a1a] border border-white/5 p-6">
            <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-4">
              Status History
            </div>
            <StatusTimeline
              entries={artwork.statusHistory || []}
            />
          </div>

          {/* 추가 정보 */}
          <div className="bg-[#1a1a1a] border border-white/5 p-6">
            <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-4">
              Details
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#909090]">
                  아티스트 ID
                </span>
                <span className="text-[#f5f5f5]">
                  {artwork.artistId || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#909090]">
                  큐레이션 등급
                </span>
                <span className="text-[#f5f5f5]">
                  {artwork.curationTier || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#909090]">
                  발행일
                </span>
                <span className="text-[#f5f5f5]">
                  {artwork.publishedAt
                    ? new Date(
                        artwork.publishedAt
                      ).toLocaleDateString("ko-KR")
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#909090]">
                  포맷
                </span>
                <span className="text-[#f5f5f5]">
                  {artwork.format || "MP4"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 토스트 알림 */}
      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
        />
      )}
    </PortalShell>
  );
}
