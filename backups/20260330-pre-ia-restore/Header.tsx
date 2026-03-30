import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

function LogoMark() {
  return (
    <img
      src="/assets/lumos-logo.png"
      alt="LUMOS"
      style={{ height: 44, width: "auto", maxWidth: 180, objectFit: "contain", display: "block" }}
      onError={(event) => {
        const target = event.currentTarget;
        target.style.display = "none";
        const fallback = document.createElement("span");
        fallback.className = "font-accent text-[14px] tracking-[0.5em] uppercase text-[#D4A843]";
        fallback.textContent = "LUMOS";
        target.parentNode?.appendChild(fallback);
      }}
    />
  );
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link to={href}>
      <span
        className={`font-accent text-[11px] tracking-[0.16em] uppercase transition-colors duration-200 cursor-pointer ${
          active ? "text-[#D4A843]" : "text-gray-400 hover:text-white"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const isActive = (path: string) => location === path || location.startsWith(`${path}/`);
  const signInHref = user ? "/artist/dashboard" : "/auth/signin";
  const signInLabel = user ? "Portal" : "Sign in";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/8 bg-black/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/">
          <div className="cursor-pointer transition-opacity duration-300 hover:opacity-80">
            <LogoMark />
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavItem href="/open" label="Open / Free" active={isActive("/open")} />
          <NavItem href="/originals" label="LUMOS Originals" active={isActive("/originals") || isActive("/standard") || isActive("/local")} />
          <NavItem href="/creators" label="Creator Works" active={isActive("/creators")} />
          <NavItem href="/solutions" label="Solutions" active={isActive("/solutions")} />
          <NavItem href="/about" label="About" active={isActive("/about")} />
          <NavItem href={signInHref} label={signInLabel} active={isActive("/auth/signin") || isActive("/artist") || isActive("/admin")} />
          <Link to="/contact">
            <span className="rounded-full border border-[#D4A843]/30 bg-[#D4A843]/10 px-4 py-2 font-accent text-[10px] tracking-[0.22em] text-[#E6C878] transition-colors hover:bg-[#D4A843]/18">
              Inquiry
            </span>
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen((current) => !current)}
          className="flex items-center justify-center border border-white/10 bg-black/30 p-2 text-white md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/8 bg-black/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <NavItem href="/open" label="Open / Free" active={isActive("/open")} />
            <NavItem href="/originals" label="LUMOS Originals" active={isActive("/originals") || isActive("/standard") || isActive("/local")} />
            <NavItem href="/creators" label="Creator Works" active={isActive("/creators")} />
            <NavItem href="/solutions" label="Solutions" active={isActive("/solutions")} />
            <NavItem href="/about" label="About" active={isActive("/about")} />
            <NavItem href={signInHref} label={signInLabel} active={isActive("/auth/signin") || isActive("/artist") || isActive("/admin")} />
            <Link to="/contact">
              <span className="block rounded-full border border-[#D4A843]/30 bg-[#D4A843]/10 px-4 py-3 font-accent text-[10px] tracking-[0.22em] text-[#E6C878]">
                Inquiry
              </span>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
