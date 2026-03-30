// Admin Dashboard — 관리자 대시보드
import { useState } from "react";
import { Link } from "wouter";
import { PortalShell } from "@/components/shells/PortalShell";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MOCK_USERS } from "@/data/mockData";
import { useArtworks } from "@/contexts/ArtworkContext";
import { INQUIRY_STATUS_LABELS, type InquiryStatus } from "@/types";

const INQUIRY_STATUS_COLORS: Record<
  InquiryStatus,
  { bg: string; text: string }
> = {
  new: { bg: "bg-amber-900/30", text: "text-amber-400" },
  contacted: { bg: "bg-blue-900/30", text: "text-blue-400" },
  proposal_sent: { bg: "bg-purple-900/30", text: "text-purple-400" },
  negotiating: { bg: "bg-emerald-900/30", text: "text-emerald-400" },
  closed_won: { bg: "bg-green-900/30", text: "text-green-400" },
  closed_lost: { bg: "bg-gray-800", text: "text-gray-500" },
};

export default function Dashboard() {
  const { artworks, inquiries } = useArtworks();

  // 지표 계산
  const totalArtworks = artworks.length;
  const pendingReview = artworks.filter(
    a => a.status === "submitted" || a.status === "under_review"
  ).length;
  const totalInquiries = inquiries.length;
  const registeredArtists = MOCK_USERS.filter(
    u => u.role === "artist"
  ).length;

  // 최근 제출/검토 중 작품 (최신 3개)
  const recentSubmissions = artworks
    .filter(
      a => a.status === "submitted" || a.status === "under_review"
    )
    .sort(
      (a, b) =>
        new Date(b.submittedAt || "").getTime() -
        new Date(a.submittedAt || "").getTime()
    )
    .slice(0, 3);

  // 최근 문의 (최신 3개)
  const recentInquiries = [...inquiries]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <PortalShell role="admin" title="Dashboard">
      {/* 지표 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard
          label="전체 작품"
          value={totalArtworks}
          change="등록된 전체 작품 수"
          changeType="neutral"
        />
        <MetricCard
          label="검토 대기"
          value={pendingReview}
          change={
            pendingReview > 0
              ? `${pendingReview}건 검토 필요`
              : "대기 없음"
          }
          changeType={pendingReview > 0 ? "negative" : "positive"}
        />
        <MetricCard
          label="총 문의"
          value={totalInquiries}
          change="누적 문의 건수"
          changeType="neutral"
        />
        <MetricCard
          label="등록 아티스트"
          value={registeredArtists}
          change="활동 중인 아티스트"
          changeType="positive"
        />
      </div>

      {/* 최근 제출 작품 */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-accent text-[10px] tracking-[0.6em] uppercase text-[#909090]">
            최근 제출 작품
          </h2>
          <Link to="/admin/artworks">
            <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors">
              전체 보기
            </span>
          </Link>
        </div>
        <div className="space-y-2">
          {recentSubmissions.length === 0 ? (
            <div className="text-[#909090] font-accent text-xs py-8 text-center">
              검토 대기 중인 작품이 없습니다.
            </div>
          ) : (
            recentSubmissions.map(artwork => {
              const submittedDate = artwork.submittedAt
                ? new Date(artwork.submittedAt).toLocaleDateString(
                    "ko-KR",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )
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
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    </div>
                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[#f5f5f5] text-sm truncate">
                        {artwork.title}
                      </div>
                      <div className="text-[#909090] font-accent text-[10px] mt-0.5">
                        {artwork.artist} &middot; {submittedDate}
                      </div>
                    </div>
                    {/* 상태 배지 */}
                    <StatusBadge status={artwork.status} />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* 최근 문의 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-accent text-[10px] tracking-[0.6em] uppercase text-[#909090]">
            최근 문의
          </h2>
          <Link to="/admin/inquiries">
            <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors">
              전체 보기
            </span>
          </Link>
        </div>
        <div className="space-y-2">
          {recentInquiries.length === 0 ? (
            <div className="text-[#909090] font-accent text-xs py-8 text-center">
              문의가 없습니다.
            </div>
          ) : (
            recentInquiries.map(inquiry => {
              const createdDate = new Date(
                inquiry.createdAt
              ).toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
              });
              const colors =
                INQUIRY_STATUS_COLORS[inquiry.status];
              return (
                <Link
                  key={inquiry.id}
                  to="/admin/inquiries"
                >
                  <div className="flex items-center gap-4 bg-[#1a1a1a] border border-white/5 p-4 hover:border-emerald-400/20 transition-colors cursor-pointer">
                    {/* 아이콘 */}
                    <div className="w-10 h-10 bg-[#0f0f0f] border border-white/5 flex items-center justify-center text-[#909090] flex-shrink-0">
                      <span className="text-lg">&#x2709;</span>
                    </div>
                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[#f5f5f5] text-sm truncate">
                        {inquiry.buyerName}
                        {inquiry.buyerCompany && (
                          <span className="text-[#909090]">
                            {" "}
                            &middot; {inquiry.buyerCompany}
                          </span>
                        )}
                      </div>
                      <div className="text-[#909090] font-accent text-[10px] mt-0.5 truncate">
                        {inquiry.artworkTitle ||
                          "일반 문의"}{" "}
                        &middot; {createdDate}
                      </div>
                    </div>
                    {/* 상태 */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 font-accent text-[10px] tracking-widest uppercase ${colors.bg} ${colors.text}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {INQUIRY_STATUS_LABELS[inquiry.status]}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </PortalShell>
  );
}
