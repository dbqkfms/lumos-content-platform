import PortalShell from "@/components/PortalShell";

const adminLinks = [
  { href: "/portal/admin", label: "Dashboard" },
  { href: "/portal/admin/artworks", label: "Artworks" },
  { href: "/portal/admin/artists", label: "Artists" },
  { href: "/portal/admin/inquiries", label: "Inquiries" },
];

const artworks = [
  { title: "청룡", type: "Originals / STANDARD", status: "게시 중" },
  { title: "Fragments of Seoul", type: "Creator Works", status: "검수 완료" },
  { title: "Warm Table", type: "Open / Creator", status: "수정 요청" },
];

export default function AdminArtworksPage() {
  return (
    <PortalShell
      title="Artworks"
      eyebrow="OPERATIONS PORTAL"
      description="작품 관리 화면은 분류, 상태, 공개 여부를 한 번에 조절할 수 있어야 합니다."
      accent="gold"
      links={adminLinks}
    >
      <div className="border border-white/8 bg-[#111] p-6">
        <div className="mb-3 grid gap-4 border-b border-white/8 pb-3 text-[11px] uppercase tracking-[0.18em] text-gray-500 md:grid-cols-[1.2fr_1fr_160px_120px]">
          <div>Artwork</div>
          <div>Type</div>
          <div>Status</div>
          <div>Action</div>
        </div>
        <div className="grid gap-4">
          {artworks.map((artwork) => (
            <div key={artwork.title} className="grid gap-4 border-b border-white/8 py-3 text-sm md:grid-cols-[1.2fr_1fr_160px_120px]">
              <div className="text-white">{artwork.title}</div>
              <div className="text-gray-400">{artwork.type}</div>
              <div className="text-gray-400">{artwork.status}</div>
              <div className="text-[#D4A843]">관리</div>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
