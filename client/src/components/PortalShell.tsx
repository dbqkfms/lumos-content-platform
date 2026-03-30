import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";

type PortalLink = {
  href: string;
  label: string;
};

export default function PortalShell({
  title,
  eyebrow,
  description,
  accent,
  links,
  children,
}: {
  title: string;
  eyebrow: string;
  description: string;
  accent: "gold" | "blue";
  links: PortalLink[];
  children: ReactNode;
}) {
  const [location] = useLocation();
  const accentColor = accent === "gold" ? "#D4A843" : "#93C5FD";

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/8 bg-black/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="font-accent text-[10px] tracking-[0.24em]" style={{ color: accentColor }}>
              {eyebrow}
            </p>
            <h1 className="mt-3 text-display text-[2.2rem] text-white md:text-[2.8rem]">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">{description}</p>
          </div>
          <Link to="/">
            <span className="font-accent text-[11px] tracking-[0.2em] text-gray-500 transition-colors hover:text-white">
              PUBLIC HOME
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-screen-xl gap-8 px-6 py-10 md:grid-cols-[220px_1fr] md:px-10">
        <aside className="space-y-2">
          {links.map((link) => {
            const active = location === link.href;
            return (
              <Link key={link.href} to={link.href}>
                <span
                  className="block border px-4 py-3 text-sm transition-colors"
                  style={{
                    borderColor: active ? accentColor : "rgba(255,255,255,0.08)",
                    backgroundColor: active ? `${accentColor}12` : "#111111",
                    color: active ? "#ffffff" : "#9ca3af",
                  }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
