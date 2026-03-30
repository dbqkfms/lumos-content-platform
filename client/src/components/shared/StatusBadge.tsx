// StatusBadge — 상태 배지 (Luminous Brutalism)
import React from "react";
import { STATUS_COLORS, STATUS_LABELS, type ArtworkStatus } from "@/types";

interface StatusBadgeProps {
  status: ArtworkStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const colors = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 font-accent text-[10px] tracking-widest uppercase ${colors.bg} ${colors.text} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
};
