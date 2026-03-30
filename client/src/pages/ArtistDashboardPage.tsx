import PortalShell from "@/components/PortalShell";

const artistLinks = [
  { href: "/portal/artist", label: "Dashboard" },
  { href: "/portal/artist/works", label: "My Works" },
  { href: "/portal/artist/upload", label: "Upload" },
];

const metrics = [
  { label: "등록 작품", value: "18" },
  { label: "검수 중", value: "4" },
  { label: "수정 요청", value: "2" },
  { label: "게시 중", value: "9" },
];

export default function ArtistDashboardPage() {
  return (
    <PortalShell
      title="Artist Portal"
      eyebrow="CREATOR PORTAL"
      description="작가용 대시보드는 작품 현황, 검수 상태, 최근 피드백을 한 번에 읽게 해야 합니다."
      accent="blue"
      links={artistLinks}
    >
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="border border-white/8 bg-[#111] p-5">
            <p className="font-accent text-[10px] tracking-[0.22em] text-[#93C5FD]">{metric.label}</p>
            <p className="mt-4 text-display text-[2.4rem] text-white">{metric.value}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <article className="border border-white/8 bg-[#111] p-6">
          <h2 className="text-xl font-semibold text-white">최근 활동</h2>
          <div className="mt-5 space-y-4">
            {[
              "서울의 조각들: 공개 프리뷰 승인",
              "Warm Table: 태그 수정 요청",
              "Cityscape View: 쇼룸 추천 컬렉션에 반영",
            ].map((item) => (
              <div key={item} className="border border-white/8 bg-black/20 px-4 py-3 text-sm text-gray-300">
                {item}
              </div>
            ))}
          </div>
        </article>
        <article className="border border-white/8 bg-[#111] p-6">
          <h2 className="text-xl font-semibold text-white">운영 메모</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            포털은 기본 SaaS처럼 보이면 안 됩니다. 작품 썸네일, 검수 상태, 공개 범위가 먼저 읽히는 작가 운영 화면이어야 합니다.
          </p>
        </article>
      </div>
    </PortalShell>
  );
}
