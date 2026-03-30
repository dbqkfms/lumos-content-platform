// Admin Inquiries — 관리자 문의 관리 (인라인 확장 + 상태 변경 + 노트 저장)
import { useState, useMemo } from "react";
import { PortalShell } from "@/components/shells/PortalShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { useArtworks } from "@/contexts/ArtworkContext";
import {
  INQUIRY_STATUS_LABELS,
  type Inquiry,
  type InquiryStatus,
} from "@/types";

// 탭 필터 타입
type TabFilter = "all" | "new" | "in_progress" | "closed";

const TABS: { key: TabFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "new", label: "신규" },
  { key: "in_progress", label: "진행 중" },
  { key: "closed", label: "종료" },
];

// 진행 중 / 종료 상태 분류
const IN_PROGRESS_STATUSES: InquiryStatus[] = [
  "contacted",
  "proposal_sent",
  "negotiating",
];

const CLOSED_STATUSES: InquiryStatus[] = [
  "closed_won",
  "closed_lost",
];

// 문의 상태 색상 매핑
const INQUIRY_STATUS_COLORS: Record<
  InquiryStatus,
  { bg: string; text: string }
> = {
  new: { bg: "bg-amber-900/30", text: "text-amber-400" },
  contacted: {
    bg: "bg-blue-900/30",
    text: "text-blue-400",
  },
  proposal_sent: {
    bg: "bg-purple-900/30",
    text: "text-purple-400",
  },
  negotiating: {
    bg: "bg-emerald-900/30",
    text: "text-emerald-400",
  },
  closed_won: {
    bg: "bg-green-900/30",
    text: "text-green-400",
  },
  closed_lost: {
    bg: "bg-gray-800",
    text: "text-gray-500",
  },
};

// 공간 유형 라벨
const SPACE_LABELS: Record<string, string> = {
  hotel: "호텔 & 리조트",
  gallery: "갤러리 & 뮤지엄",
  fnb: "F&B",
  retail: "리테일",
  office: "오피스",
  public: "퍼블릭",
};

// 리사이즈 상태 라벨
const RESIZE_STATUS_LABELS: Record<string, string> = {
  requested: "요청됨",
  in_progress: "진행 중",
  completed: "완료",
  rejected: "거절",
};

// 전체 상태 목록 (드롭다운용)
const ALL_STATUSES: InquiryStatus[] = [
  "new",
  "contacted",
  "proposal_sent",
  "negotiating",
  "closed_won",
  "closed_lost",
];

// 토스트 알림 컴포넌트
function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-900/90 border border-emerald-400/30 px-5 py-3 text-emerald-300 font-accent text-xs tracking-wide">
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

export default function Inquiries() {
  const { inquiries: contextInquiries } = useArtworks();

  // 탭 필터 상태
  const [activeTab, setActiveTab] =
    useState<TabFilter>("all");

  // 로컬 상태로 문의 데이터 관리 (상태/노트 변경 반영)
  const [inquiries, setInquiries] = useState<Inquiry[]>(
    () =>
      [...contextInquiries].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
  );

  // 현재 열린 디테일 패널 ID
  const [expandedId, setExpandedId] = useState<
    string | null
  >(null);

  // 편집 중인 노트 (문의별)
  const [editNotes, setEditNotes] = useState<
    Record<string, string>
  >({});

  // 편집 중인 상태 (문의별)
  const [editStatus, setEditStatus] = useState<
    Record<string, InquiryStatus>
  >({});

  // 토스트 메시지
  const [toast, setToast] = useState<string | null>(null);

  // 탭별 필터링
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      if (activeTab === "all") return true;
      if (activeTab === "new") return inq.status === "new";
      if (activeTab === "in_progress")
        return IN_PROGRESS_STATUSES.includes(inq.status);
      if (activeTab === "closed")
        return CLOSED_STATUSES.includes(inq.status);
      return true;
    });
  }, [activeTab, inquiries]);

  // 탭별 개수
  const counts = useMemo(() => {
    return {
      all: inquiries.length,
      new: inquiries.filter(i => i.status === "new")
        .length,
      in_progress: inquiries.filter(i =>
        IN_PROGRESS_STATUSES.includes(i.status)
      ).length,
      closed: inquiries.filter(i =>
        CLOSED_STATUSES.includes(i.status)
      ).length,
    };
  }, [inquiries]);

  // 행 클릭 → 디테일 토글
  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      // 현재 값으로 편집 상태 초기화
      const inquiry = inquiries.find(i => i.id === id);
      if (inquiry) {
        setEditNotes(prev => ({
          ...prev,
          [id]: inquiry.notes || "",
        }));
        setEditStatus(prev => ({
          ...prev,
          [id]: inquiry.status,
        }));
      }
    }
  };

  // 저장 핸들러
  const handleSave = (id: string) => {
    const newStatus = editStatus[id];
    const newNotes = editNotes[id];

    setInquiries(prev =>
      prev.map(inq => {
        if (inq.id !== id) return inq;
        return {
          ...inq,
          status: newStatus || inq.status,
          notes:
            newNotes !== undefined
              ? newNotes
              : inq.notes,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    setToast("문의 정보가 저장되었습니다.");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <PortalShell role="admin" title="Inquiries">
      {/* 탭 필터 */}
      <div className="mb-6">
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

      {/* 문의 목록 */}
      {filteredInquiries.length === 0 ? (
        <EmptyState
          icon={
            <span className="text-4xl">&#x2709;</span>
          }
          title="문의가 없습니다"
          description="해당 상태의 문의가 없습니다."
        />
      ) : (
        <div className="space-y-2">
          {filteredInquiries.map(inquiry => {
            const isExpanded = expandedId === inquiry.id;
            const colors =
              INQUIRY_STATUS_COLORS[inquiry.status];
            const createdDate = new Date(
              inquiry.createdAt
            ).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            // 메시지 미리보기 (최대 60자)
            const messagePreview =
              inquiry.message.length > 60
                ? inquiry.message.substring(0, 60) +
                  "..."
                : inquiry.message;

            return (
              <div
                key={inquiry.id}
                className={`bg-[#1a1a1a] border transition-colors ${
                  isExpanded
                    ? "border-emerald-400/30"
                    : "border-white/5 hover:border-emerald-400/20"
                }`}
              >
                {/* 카드 헤더 (클릭 가능) */}
                <button
                  onClick={() =>
                    toggleExpand(inquiry.id)
                  }
                  className="w-full text-left p-4 flex items-center gap-4"
                >
                  {/* 아이콘 */}
                  <div className="w-10 h-10 bg-[#0f0f0f] border border-white/5 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#909090] text-lg">
                      &#x2709;
                    </span>
                  </div>

                  {/* 바이어 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[#f5f5f5] text-sm">
                        {inquiry.buyerName}
                      </span>
                      {inquiry.buyerCompany && (
                        <span className="text-[#909090] text-sm">
                          &middot;{" "}
                          {inquiry.buyerCompany}
                        </span>
                      )}
                      {inquiry.resizeRequest && (
                        <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 font-accent text-[9px] tracking-wider uppercase">
                          리사이즈
                        </span>
                      )}
                    </div>
                    <div className="text-[#909090] font-accent text-[10px] mt-0.5 flex items-center gap-2">
                      {inquiry.artworkTitle && (
                        <span>
                          {inquiry.artworkTitle}
                        </span>
                      )}
                      {inquiry.spaceType && (
                        <>
                          {inquiry.artworkTitle && (
                            <span>&middot;</span>
                          )}
                          <span>
                            {SPACE_LABELS[
                              inquiry.spaceType
                            ] || inquiry.spaceType}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 상태 배지 */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 font-accent text-[10px] tracking-widest uppercase flex-shrink-0 ${colors.bg} ${colors.text}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {
                      INQUIRY_STATUS_LABELS[
                        inquiry.status
                      ]
                    }
                  </span>

                  {/* 날짜 */}
                  <div className="text-[#909090] font-accent text-[10px] w-24 text-right flex-shrink-0">
                    {createdDate}
                  </div>

                  {/* 펼침 아이콘 */}
                  <span
                    className={`text-[#909090] transition-transform flex-shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    &#x25BE;
                  </span>
                </button>

                {/* 축약 메시지 (접혀있을 때) */}
                {!isExpanded && (
                  <div className="px-4 pb-3 -mt-1">
                    <p className="text-[#909090] text-xs pl-14 truncate">
                      {messagePreview}
                    </p>
                  </div>
                )}

                {/* 확장 영역 — 상세 + 상태 변경 + 노트 */}
                {isExpanded && (
                  <div className="border-t border-white/5">
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 좌측: 문의 상세 내용 */}
                      <div className="space-y-5">
                        {/* 메시지 전문 */}
                        <div>
                          <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-2">
                            Message
                          </div>
                          <div className="text-[#e0e0e0] text-sm leading-relaxed bg-white/[0.03] p-4 border-l-2 border-white/10">
                            {inquiry.message}
                          </div>
                        </div>

                        {/* 리사이즈 요청 (있을 경우) */}
                        {inquiry.resizeRequest && (
                          <div>
                            <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-purple-400 mb-2">
                              Resize Request
                            </div>
                            <div className="bg-purple-900/10 border border-purple-400/20 p-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-[#909090]">
                                  크기
                                </span>
                                <span className="text-[#f5f5f5]">
                                  {
                                    inquiry
                                      .resizeRequest
                                      .targetWidth
                                  }{" "}
                                  &times;{" "}
                                  {
                                    inquiry
                                      .resizeRequest
                                      .targetHeight
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-[#909090]">
                                  방향
                                </span>
                                <span className="text-[#f5f5f5]">
                                  {
                                    inquiry
                                      .resizeRequest
                                      .targetOrientation
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-[#909090]">
                                  상태
                                </span>
                                <span className="text-amber-400 font-accent text-[10px] uppercase tracking-wide">
                                  {RESIZE_STATUS_LABELS[
                                    inquiry
                                      .resizeRequest
                                      .status
                                  ] ||
                                    inquiry
                                      .resizeRequest
                                      .status}
                                </span>
                              </div>
                              {inquiry.resizeRequest
                                .notes && (
                                <div className="text-[#909090] text-sm pt-2 border-t border-purple-400/10">
                                  {
                                    inquiry
                                      .resizeRequest
                                      .notes
                                  }
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 연락처 정보 */}
                        <div>
                          <div className="font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-2">
                            Contact
                          </div>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#909090]">
                                이메일
                              </span>
                              <span className="text-[#f5f5f5]">
                                {inquiry.buyerEmail}
                              </span>
                            </div>
                            {inquiry.buyerCompany && (
                              <div className="flex justify-between">
                                <span className="text-[#909090]">
                                  회사
                                </span>
                                <span className="text-[#f5f5f5]">
                                  {
                                    inquiry.buyerCompany
                                  }
                                </span>
                              </div>
                            )}
                            {inquiry.spaceType && (
                              <div className="flex justify-between">
                                <span className="text-[#909090]">
                                  공간 유형
                                </span>
                                <span className="text-[#f5f5f5]">
                                  {SPACE_LABELS[
                                    inquiry.spaceType
                                  ] ||
                                    inquiry.spaceType}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-[#909090]">
                                최종 업데이트
                              </span>
                              <span className="text-[#f5f5f5]">
                                {new Date(
                                  inquiry.updatedAt
                                ).toLocaleDateString(
                                  "ko-KR",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 우측: 상태 변경 + 노트 + 저장 */}
                      <div className="space-y-5">
                        {/* 상태 변경 드롭다운 */}
                        <div>
                          <label className="block font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-2">
                            Status
                          </label>
                          <select
                            value={
                              editStatus[
                                inquiry.id
                              ] || inquiry.status
                            }
                            onChange={e =>
                              setEditStatus(
                                prev => ({
                                  ...prev,
                                  [inquiry.id]: e
                                    .target
                                    .value as InquiryStatus,
                                })
                              )
                            }
                            className="w-full bg-[#0f0f0f] border border-white/10 px-3 py-2.5 text-sm text-[#f5f5f5] font-accent tracking-wide focus:outline-none focus:border-emerald-400/40 transition-colors appearance-none cursor-pointer"
                          >
                            {ALL_STATUSES.map(
                              status => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {
                                    INQUIRY_STATUS_LABELS[
                                      status
                                    ]
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* 노트 텍스트 영역 */}
                        <div>
                          <label className="block font-accent text-[9px] tracking-[0.6em] uppercase text-[#909090] mb-2">
                            Notes
                          </label>
                          <textarea
                            value={
                              editNotes[
                                inquiry.id
                              ] ??
                              inquiry.notes ??
                              ""
                            }
                            onChange={e =>
                              setEditNotes(
                                prev => ({
                                  ...prev,
                                  [inquiry.id]:
                                    e.target.value,
                                })
                              )
                            }
                            placeholder="내부 메모를 입력하세요..."
                            rows={5}
                            className="w-full bg-[#0f0f0f] border border-white/10 px-3 py-2 text-sm text-[#f5f5f5] placeholder-[#606060] font-accent tracking-wide focus:outline-none focus:border-emerald-400/40 transition-colors resize-none"
                          />
                        </div>

                        {/* 저장 버튼 */}
                        <button
                          onClick={() =>
                            handleSave(inquiry.id)
                          }
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 font-accent text-[10px] tracking-[0.3em] uppercase transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
