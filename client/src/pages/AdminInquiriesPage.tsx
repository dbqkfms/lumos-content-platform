import PortalShell from "@/components/PortalShell";

const adminLinks = [
  { href: "/portal/admin", label: "Dashboard" },
  { href: "/portal/admin/artworks", label: "Artworks" },
  { href: "/portal/admin/artists", label: "Artists" },
  { href: "/portal/admin/inquiries", label: "Inquiries" },
];

const inquiries = [
  { company: "OO Hotel", type: "호텔 로비 제안", status: "답변 대기" },
  { company: "Brand Showroom", type: "쇼룸 리사이즈 문의", status: "협의 중" },
  { company: "Creator Onboarding", type: "작가 참여 신청", status: "검토 중" },
];

export default function AdminInquiriesPage() {
  return (
    <PortalShell
      title="Inquiries"
      eyebrow="OPERATIONS PORTAL"
      description="문의 화면은 buyer inquiry, resize request, creator onboarding을 한 곳에서 관리합니다."
      accent="gold"
      links={adminLinks}
    >
      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <article key={`${inquiry.company}-${inquiry.type}`} className="border border-white/8 bg-[#111] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-accent text-[10px] tracking-[0.22em] text-[#D4A843]">{inquiry.status}</p>
                <h2 className="mt-3 text-xl font-semibold text-white">{inquiry.company}</h2>
                <p className="mt-2 text-sm text-gray-400">{inquiry.type}</p>
              </div>
              <button className="border border-white/10 px-4 py-2 text-sm text-gray-300">상세 보기</button>
            </div>
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
