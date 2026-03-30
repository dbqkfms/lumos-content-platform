// EmptyState — 빈 상태 표시 컴포넌트
import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** 새 형식: 객체로 액션 지정 */
  action?: { label: string; onClick: () => void };
  /** 레거시 호환: 별도 props */
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
}) => {
  // 새 형식 또는 레거시 형식에서 액션 추출
  const resolvedLabel = action?.label || actionLabel;
  const resolvedOnClick = action?.onClick || onAction;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* 아이콘 */}
      {icon && (
        <div className="text-gray-600 w-16 h-16 mb-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </div>
      )}

      {/* 제목 */}
      <h3 className="font-display text-xl text-white mb-2">
        {title}
      </h3>

      {/* 설명 */}
      {description && (
        <p className="text-sm text-gray-500 max-w-md text-center mb-6">
          {description}
        </p>
      )}

      {/* 액션 버튼 */}
      {resolvedLabel && resolvedOnClick && (
        <button
          onClick={resolvedOnClick}
          className="bg-[#D4A843] text-black font-accent text-[10px] tracking-[0.3em] uppercase px-8 py-3 hover:bg-[#F0C060] transition-colors"
        >
          {resolvedLabel}
        </button>
      )}
    </div>
  );
};
