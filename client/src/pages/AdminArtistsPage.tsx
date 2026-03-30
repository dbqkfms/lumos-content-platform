import PortalShell from "@/components/PortalShell";

const adminLinks = [
  { href: "/portal/admin", label: "Dashboard" },
  { href: "/portal/admin/artworks", label: "Artworks" },
  { href: "/portal/admin/artists", label: "Artists" },
  { href: "/portal/admin/inquiries", label: "Inquiries" },
];

const artists = [
  { name: "Studio Warm Current", status: "승인", works: 12 },
  { name: "Frame Seoul", status: "검토 중", works: 4 },
  { name: "Signal Fabric", status: "수정 요청", works: 3 },
];

export default function AdminArtistsPage() {
  return (
    <PortalShell
      title="Artists"
      eyebrow="OPERATIONS PORTAL"
      description="작가 관리 화면에서는 상태, 최근 업로드, 작품 수를 빠르게 확인해야 합니다."
      accent="gold"
      links={adminLinks}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {artists.map((artist) => (
          <article key={artist.name} className="border border-white/8 bg-[#111] p-6">
            <p className="font-accent text-[10px] tracking-[0.22em] text-[#D4A843]">{artist.status}</p>
            <h2 className="mt-3 text-xl font-semibold text-white">{artist.name}</h2>
            <p className="mt-4 text-sm text-gray-400">작품 수 {artist.works}</p>
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
