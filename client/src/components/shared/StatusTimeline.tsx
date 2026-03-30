// StatusTimeline — 상태 변경 이력 수직 타임라인
import React from "react";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  type StatusHistoryEntry,
} from "@/types";

interface StatusTimelineProps {
  entries: StatusHistoryEntry[];
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  entries,
}) => {
  // 이력이 없는 경우
  if (!entries || entries.length === 0) {
    return (
      <div className="text-gray-500 font-accent text-xs">
        상태 변경 이력이 없습니다.
      </div>
    );
  }

  // 최신순 정렬
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  return (
    <div className="space-y-0">
      {sorted.map((entry, i) => {
        const colors = STATUS_COLORS[entry.status];
        const date = new Date(entry.changedAt);
        const dateStr = date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const timeStr = date.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={i} className="flex gap-4">
            {/* 수직 타임라인 도트 + 라인 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-2.5 h-2.5 ${colors.bg} border-2 border-current ${colors.text}`}
              />
              {i < sorted.length - 1 && (
                <div className="w-px flex-1 bg-white/10 min-h-[40px]" />
              )}
            </div>

            {/* 내용 영역 */}
            <div className="pb-4 -mt-0.5">
              {/* 상태 뱃지 */}
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`font-accent text-[10px] tracking-widest uppercase ${colors.bg} ${colors.text} px-2 py-0.5`}
                >
                  {STATUS_LABELS[entry.status]}
                </span>
              </div>

              {/* 날짜 */}
              <div className="text-gray-500 font-accent text-[10px] mt-1">
                {dateStr} {timeStr}
              </div>

              {/* 변경자 */}
              {entry.changedBy && (
                <div className="text-gray-600 font-accent text-[10px] mt-0.5">
                  by {entry.changedBy}
                </div>
              )}

              {/* 메모 */}
              {entry.note && (
                <div className="text-gray-300 text-sm mt-2 bg-white/5 p-2 border-l-2 border-white/10">
                  {entry.note}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
