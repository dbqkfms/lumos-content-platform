// roleGuard — 역할 기반 라우트 보호 컴포넌트
import React, { type ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

/** 403 접근 거부 페이지 */
const Forbidden: React.FC = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
    <div className="font-display text-6xl text-white mb-4">403</div>
    <div className="font-accent text-[10px] tracking-[0.6em] uppercase text-gray-500 mb-8">
      접근 권한이 없습니다
    </div>
    <a
      href="/"
      className="font-accent text-[10px] tracking-[0.3em] uppercase text-[#D4A843] hover:text-[#F0C060] transition-colors border border-[#D4A843]/30 px-6 py-3"
    >
      홈으로 돌아가기
    </a>
  </div>
);

/** 로딩 스피너 */
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/10 border-t-white animate-spin" />
  </div>
);

/**
 * ProtectedRoute — 인증 + 역할 검증을 거쳐 자식 컴포넌트를 렌더링
 * - 로딩 중: 다크 스피너 표시
 * - 미인증: /auth/signin 으로 리다이렉트
 * - 역할 불일치: 403 페이지 표시
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // 로딩 중
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 미인증 → 로그인 페이지로 리다이렉트
  if (!user) {
    setLocation("/auth/signin");
    return <LoadingSpinner />;
  }

  // 역할 불일치 → 403
  if (!allowedRoles.includes(user.role)) {
    return <Forbidden />;
  }

  return <>{children}</>;
};

/**
 * RoleGuard — ProtectedRoute의 래퍼 컴포넌트
 * 단축 사용을 위한 함수형 래퍼
 */
export const RoleGuard: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => (
  <ProtectedRoute allowedRoles={allowedRoles}>
    {children}
  </ProtectedRoute>
);
