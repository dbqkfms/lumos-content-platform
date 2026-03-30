// RoleGuard — 역할 기반 라우트 보호
import React from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types";

interface RoleGuardProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: string; // redirect 경로 (기본: /auth/signin)
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  roles,
  children,
  fallback = "/auth/signin",
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="font-accent text-[10px] tracking-[0.6em] uppercase text-[#909090]">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to={fallback} />;
  }

  if (!roles.includes(user.role)) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
};
