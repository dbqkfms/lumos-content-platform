import PortalShell from "@/components/PortalShell";

const artistLinks = [
  { href: "/portal/artist", label: "Dashboard" },
  { href: "/portal/artist/works", label: "My Works" },
  { href: "/portal/artist/upload", label: "Upload" },
];

const works = [
  { title: "Fragments of Seoul", status: "게시 중", image: "/generated-thumbnails/lumos-1ce87ca3-lumos-1ce87ca3_frame_3.jpg" },
  { title: "Warm Table", status: "수정 요청", image: "/generated-thumbnails/lumos-3b6ada3f-lumos-3b6ada3f_frame_4.jpg" },
  { title: "Cityscape View", status: "검수 중", image: "/generated-thumbnails/lumos-371dc371-lumos-371dc371_frame_2.jpg" },
];

export default function ArtistWorksPage() {
  return (
    <PortalShell
      title="My Works"
      eyebrow="CREATOR PORTAL"
      description="작가 작품 목록은 카드와 상태 배지가 함께 보여야 합니다."
      accent="blue"
      links={artistLinks}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {works.map((work) => (
          <article key={work.title} className="overflow-hidden border border-white/8 bg-[#111]">
            <div className="aspect-video overflow-hidden bg-[#080808]">
              <img src={work.image} alt={work.title} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">{work.title}</h2>
                <span className="border border-[#93C5FD]/30 bg-[#93C5FD]/10 px-2 py-1 text-[11px] text-[#C9E3FF]">{work.status}</span>
              </div>
              <div className="flex gap-2">
                <button className="border border-white/10 px-3 py-2 text-sm text-gray-300">상세</button>
                <button className="border border-white/10 px-3 py-2 text-sm text-gray-300">수정</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
