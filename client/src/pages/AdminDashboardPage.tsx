import PortalShell from "@/components/PortalShell";

const adminLinks = [
  { href: "/portal/admin", label: "Dashboard" },
  { href: "/portal/admin/artworks", label: "Artworks" },
  { href: "/portal/admin/artists", label: "Artists" },
  { href: "/portal/admin/inquiries", label: "Inquiries" },
];

const metrics = [
  { label: "승인 대기", value: "12" },
  { label: "신규 업로드", value: "5" },
  { label: "게시 중 작품", value: "86" },
  { label: "미답변 문의", value: "7" },
];

export default function AdminDashboardPage() {
  return (
    <PortalShell
      title="Admin Portal"
      eyebrow="OPERATIONS PORTAL"
      description="운영 포털은 범용 백오피스가 아니라 콘텐츠, 작가, 문의 상태를 브랜드 톤 안에서 통합해서 보여줘야 합니다."
      accent="gold"
      links={adminLinks}
    >
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="border border-white/8 bg-[#111] p-5">
            <p className="font-accent text-[10px] tracking-[0.22em] text-[#D4A843]">{metric.label}</p>
            <p className="mt-4 text-display text-[2.4rem] text-white">{metric.value}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <article className="border border-white/8 bg-[#111] p-6">
          <h2 className="text-xl font-semibold text-white">Moderation Queue</h2>
          <div className="mt-5 space-y-4">
            {["Warm Table / 공개 범위 확인 필요", "Fragments of Seoul / 태그 정리 필요", "Quantum Forms / 리테일 추천 추가"].map((item) => (
              <div key={item} className="border border-white/8 bg-black/20 px-4 py-3 text-sm text-gray-300">
                {item}
              </div>
            ))}
          </div>
        </article>
        <article className="border border-white/8 bg-[#111] p-6">
          <h2 className="text-xl font-semibold text-white">문의 상태</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            오늘은 호텔 로비 2건, 쇼룸 3건, Creator onboarding 2건이 들어와 있습니다. 운영 포털은 카드와 테이블이 섞여도 읽기 규칙이 동일해야 합니다.
          </p>
        </article>
      </div>
    </PortalShell>
  );
}
