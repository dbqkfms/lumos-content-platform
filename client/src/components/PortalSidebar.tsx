// PortalSidebar — 포털 사이드바 네비게이션
import React from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Image,
  Upload,
  UserCircle,
  Users,
  Mail,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

// 아티스트 포털 메뉴
const ARTIST_NAV: NavItem[] = [
  {
    label: "Dashboard",
    path: "/artist/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: "Works",
    path: "/artist/works",
    icon: <Image className="w-4 h-4" />,
  },
  {
    label: "Upload",
    path: "/artist/upload",
    icon: <Upload className="w-4 h-4" />,
  },
  {
    label: "Profile",
    path: "/artist/profile",
    icon: <UserCircle className="w-4 h-4" />,
  },
];

// 관리자 포털 메뉴
const ADMIN_NAV: NavItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: "Artworks",
    path: "/admin/artworks",
    icon: <Image className="w-4 h-4" />,
  },
  {
    label: "Artists",
    path: "/admin/artists",
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: "Inquiries",
    path: "/admin/inquiries",
    icon: <Mail className="w-4 h-4" />,
  },
];

interface PortalSidebarProps {
  portalType: "artist" | "admin";
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  portalType,
}) => {
  const [location] = useLocation();
  const nav = portalType === "admin" ? ADMIN_NAV : ARTIST_NAV;

  // 포털별 액센트 색상
  const accentColor =
    portalType === "admin" ? "#10B981" : "#D4A843";

  return (
    <aside className="w-60 bg-[#0a0a0a] border-r border-white/[0.08] min-h-screen fixed top-16 left-0 z-30 flex flex-col">
      {/* 포털 라벨 */}
      <div className="px-6 py-5 border-b border-white/[0.08]">
        <div
          className="font-accent text-[10px] tracking-[0.6em] uppercase"
          style={{ color: accentColor }}
        >
          {portalType === "admin"
            ? "Admin Portal"
            : "Artist Portal"}
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 py-4">
        {nav.map(item => {
          // 현재 경로와 일치 여부 판단
          const isDashboard =
            item.path.endsWith("/dashboard");
          const isActive = isDashboard
            ? location === item.path
            : location.startsWith(item.path);

          return (
            <Link key={item.path} to={item.path}>
              <div
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors border-l-2 ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300 border-transparent"
                }`}
                style={
                  isActive
                    ? { borderLeftColor: accentColor }
                    : undefined
                }
              >
                {/* 아이콘 — 활성 시 액센트 색상 */}
                <span
                  style={
                    isActive
                      ? { color: accentColor }
                      : undefined
                  }
                >
                  {item.icon}
                </span>

                {/* 라벨 */}
                <span className="font-accent text-xs tracking-widest uppercase">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
