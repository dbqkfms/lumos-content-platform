import { Menu, X, Play, Compass } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

/* 콘텐츠 네비게이션 — 클릭 시 라이브러리(영상), 호버 드롭다운에서 소개/라이브러리 선택 */
const contentNav = [
  {
    href: "/open",
    label: "Open / Free",
    introHref: "/open",
    introLabel: "컬렉션 소개",
    libraryHref: "/open",
    libraryLabel: "영상 탐색",
    introDesc: "공개 컬렉션의 구성과 활용 방법",
    libraryDesc: "LED 공간용 미디어아트 프리뷰",
  },
  {
    href: "/originals",
    label: "LUMOS Originals",
    introHref: "/originals",
    introLabel: "세계관 소개",
    libraryHref: "/originals",
    libraryLabel: "영상 탐색",
    introDesc: "STANDARD와 LOCAL, 두 세계의 철학",
    libraryDesc: "큐레이션된 오리지널 영상 갤러리",
    subLinks: [
      { href: "/standard", label: "STANDARD", desc: "공간을 지배하는 프리미엄 라인" },
      { href: "/local", label: "LOCAL", desc: "공간과 조화하는 한국적 라인" },
    ],
  },
  {
    href: "/creator-works",
    label: "Creator Works",
    introHref: "/creator-works",
    introLabel: "플랫폼 소개",
    libraryHref: "/creator-works",
    libraryLabel: "영상 탐색",
    introDesc: "AI 아티스트와 콘텐츠를 연결하는 구조",
    libraryDesc: "큐레이션을 거친 작가 작품 탐색",
  },
];

const utilityNav = [
  { href: "/solutions", label: "Solutions" },
  { href: "/about", label: "About" },
  { href: "/login", label: "Sign in" },
];

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full border border-white/12 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(255,255,255,0.12))]" />
      <div>
        <div className="font-display text-[1.95rem] leading-none text-white">LUMOS</div>
        <div className="text-[10px] uppercase tracking-[0.26em] text-white/46">Media Art Platform</div>
      </div>
    </div>
  );
}

function NavLabel({ active, children }: { active: boolean; children: string }) {
  return (
    <span
      className={`text-[11px] uppercase tracking-[0.22em] transition ${
        active ? "text-[#E0B754]" : "text-white/54 hover:text-white"
      }`}
    >
      {children}
    </span>
  );
}

/* 호버 드롭다운이 있는 네비게이션 아이템 */
function NavItemWithDropdown({
  item,
  isActive,
}: {
  item: (typeof contentNav)[0];
  isActive: boolean;
}) {
  const [, setLocation] = useLocation();

  return (
    <div className="group relative">
      {/* 기본 클릭 → 라이브러리(영상) 페이지로 직행 */}
      <Link to={item.libraryHref}>
        <NavLabel active={isActive}>{item.label}</NavLabel>
      </Link>

      {/* 호버 드롭다운 */}
      <div className="pointer-events-none absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="border border-white/10 bg-[#0c0c0c]/95 backdrop-blur-xl shadow-2xl">
          {/* 소개 페이지 */}
          <button
            type="button"
            onClick={() => setLocation(item.introHref)}
            className="flex w-full items-start gap-3 border-b border-white/5 px-5 py-4 text-left transition hover:bg-white/5"
          >
            <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4A843]" />
            <div>
              <p className="font-accent text-[10px] tracking-[0.2em] text-[#D4A843]">{item.introLabel}</p>
              <p className="mt-1 text-xs text-gray-400">{item.introDesc}</p>
            </div>
          </button>

          {/* 영상 라이브러리 */}
          <button
            type="button"
            onClick={() => setLocation(item.libraryHref)}
            className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-white/5"
          >
            <Play className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#93C5FD]" />
            <div>
              <p className="font-accent text-[10px] tracking-[0.2em] text-[#93C5FD]">{item.libraryLabel}</p>
              <p className="mt-1 text-xs text-gray-400">{item.libraryDesc}</p>
            </div>
          </button>

          {/* LUMOS Originals 서브 링크 (STANDARD / LOCAL) */}
          {item.subLinks ? (
            <div className="border-t border-white/5">
              {item.subLinks.map((sub) => (
                <button
                  key={sub.href}
                  type="button"
                  onClick={() => setLocation(sub.href)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-white/5"
                >
                  <div
                    className="h-2 w-2 shrink-0"
                    style={{
                      backgroundColor: sub.label === "STANDARD" ? "#D4A843" : "#93C5FD",
                    }}
                  />
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.15em] text-white/80">{sub.label}</p>
                    <p className="text-[10px] text-gray-500">{sub.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => location === href || location.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-black/78 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1540px] items-center justify-between px-4 py-4 md:px-8">
        <Link to="/">
          <div className="cursor-pointer transition hover:opacity-80">
            <LogoMark />
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {/* 콘텐츠 네비게이션 — 호버 드롭다운 */}
          <nav className="flex items-center gap-6">
            {contentNav.map((item) => (
              <NavItemWithDropdown
                key={item.href}
                item={item}
                isActive={isActive(item.href) || (item.subLinks?.some((s) => isActive(s.href)) ?? false)}
              />
            ))}
          </nav>

          <div className="h-6 w-px bg-white/10" />

          {/* 유틸리티 네비게이션 */}
          <nav className="flex items-center gap-5">
            {utilityNav.map((item) => (
              <Link key={item.href} to={item.href}>
                <NavLabel active={isActive(item.href)}>{item.label}</NavLabel>
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
            className="rounded-full border border-[#E0B754]/30 bg-[#E0B754]/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#E0B754] transition hover:bg-[#E0B754]/18"
          >
            Inquiry
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/5 text-white lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/8 bg-black/92 px-4 py-5 lg:hidden">
          <div className="space-y-5">
            <div className="space-y-3">
              {contentNav.map((item) => (
                <div key={item.href}>
                  <Link to={item.href}>
                    <div
                      className={`text-sm uppercase tracking-[0.22em] ${
                        isActive(item.href) ? "text-[#E0B754]" : "text-white/68"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </div>
                  </Link>
                  {/* 모바일 서브링크 */}
                  {item.subLinks ? (
                    <div className="mt-2 ml-4 space-y-2">
                      {item.subLinks.map((sub) => (
                        <Link key={sub.href} to={sub.href}>
                          <div
                            className={`text-xs uppercase tracking-[0.18em] ${
                              isActive(sub.href) ? "text-[#E0B754]" : "text-white/50"
                            }`}
                            onClick={() => setMobileOpen(false)}
                          >
                            {sub.label}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="h-px bg-white/8" />
            <div className="space-y-3">
              {utilityNav.map((item) => (
                <Link key={item.href} to={item.href}>
                  <div
                    className={`text-sm uppercase tracking-[0.22em] ${
                      isActive(item.href) ? "text-[#E0B754]" : "text-white/68"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                window.dispatchEvent(new CustomEvent("open-contact"));
              }}
              className="w-full rounded-full border border-[#E0B754]/30 bg-[#E0B754]/10 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-[#E0B754]"
            >
              Inquiry
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
