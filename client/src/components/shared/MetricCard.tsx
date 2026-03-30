// MetricCard — 대시보드 지표 카드 (아이콘 + 변화량 포함)
import React from "react";

interface MetricCardProps {
  label: string;
  value: number | string;
  /** 새 형식: 객체로 변화량 표시 */
  change?: { value: number; period: string } | string;
  /** 레거시 호환: 변화 유형 직접 지정 */
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  changeType,
  icon,
}) => {
  // 변화량 렌더링 로직
  let changeText: string | null = null;
  let changeColor = "text-gray-500";

  if (typeof change === "object" && change !== null) {
    // 새 형식: { value, period }
    const prefix = change.value > 0 ? "+" : "";
    changeText = `${prefix}${change.value}% ${change.period}`;
    changeColor =
      change.value > 0
        ? "text-emerald-400"
        : change.value < 0
          ? "text-red-400"
          : "text-gray-500";
  } else if (typeof change === "string") {
    // 레거시 형식: 문자열 직접 표시
    changeText = change;
    changeColor =
      changeType === "positive"
        ? "text-emerald-400"
        : changeType === "negative"
          ? "text-red-400"
          : "text-gray-500";
  }

  return (
    <div className="bg-[#1a1a1a] border border-white/5 p-6">
      {/* 상단: 라벨 + 아이콘 */}
      <div className="flex items-start justify-between mb-3">
        <div className="font-accent text-[10px] tracking-widest uppercase text-gray-500">
          {label}
        </div>
        {icon && (
          <div className="text-gray-600">{icon}</div>
        )}
      </div>

      {/* 값 */}
      <div className="font-display text-3xl text-white">{value}</div>

      {/* 변화량 */}
      {changeText && (
        <div className={`font-accent text-xs mt-2 ${changeColor}`}>
          {changeText}
        </div>
      )}
    </div>
  );
};
