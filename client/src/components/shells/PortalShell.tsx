// PortalShell — 포털 레이아웃 (사이드바 + 상단바 + 콘텐츠)
import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types";

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const ARTIST_NAV: NavItem[] = [
  { label: "Dashboard", path: "/artist/dashboard", icon: "◆" },
  { label: "My Works", path: "/artist/works", icon: "▣" },
  { label: "Upload", path: "/artist/upload", icon: "+" },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "◆" },
  { label: "Artworks", path: "/admin/artworks", icon: "▣" },
  { label: "Artists", path: "/admin/artists", icon: "◇" },
  { label: "Inquiries", path: "/admin/inquiries", icon: "✉" },
];

interface PortalShellProps {
  role: "artist" | "admin";
  children: React.ReactNode;
  title?: string;
}

export const PortalShell: React.FC<PortalShellProps> = ({
  role,
  children,
  title,
}) => {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const nav = role === "admin" ? ADMIN_NAV : ARTIST_NAV;
  const accentColor = role === "admin" ? "#10B981" : "#D4A843";

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      {/* 사이드바 */}
      <aside className="w-[240px] bg-[#0a0a0a] border-r border-white/[0.08] flex flex-col fixed h-full z-40">
        {/* 로고 */}
        <Link to="/">
          <div className="p-6 border-b border-white/[0.08] cursor-pointer">
            <div className="font-accent text-[10px] tracking-[0.6em] uppercase text-[#909090]">
              LUMOS
            </div>
            <div
              className="font-accent text-[9px] tracking-[0.4em] uppercase mt-1"
              style={{ color: accentColor }}
            >
              {role === "admin" ? "Admin Portal" : "Artist Portal"}
            </div>
          </div>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex-1 py-4">
          {nav.map(item => {
            const isActive = location === item.path ||
              (item.path !== "/artist/dashboard" &&
                item.path !== "/admin/dashboard" &&
                location.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-6 py-3 font-accent text-[11px] tracking-[0.15em] uppercase transition-colors cursor-pointer ${
                    isActive
                      ? "text-[#f5f5f5] border-l-2"
                      : "text-[#909090] hover:text-[#e0e0e0] border-l-2 border-transparent"
                  }`}
                  style={
                    isActive ? { borderLeftColor: accentColor } : undefined
                  }
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* 유저 정보 + 로그아웃 */}
        <div className="p-4 border-t border-white/[0.08]">
          <div className="text-[#f5f5f5] text-sm mb-1">
            {user?.name}
          </div>
          <div className="text-[#909090] font-accent text-[10px] mb-3">
            {user?.email}
          </div>
          <button
            onClick={signOut}
            className="w-full text-[#909090] hover:text-[#f5f5f5] font-accent text-[10px] tracking-[0.3em] uppercase py-2 border border-white/10 hover:border-white/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 ml-[240px]">
        {/* 상단 바 */}
        <header className="h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="font-accent text-[10px] tracking-[0.4em] uppercase text-[#e0e0e0]">
            {title || "Dashboard"}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <span className="text-[#909090] hover:text-[#f5f5f5] font-accent text-[10px] tracking-[0.2em] uppercase cursor-pointer transition-colors">
                View Site
              </span>
            </Link>
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
