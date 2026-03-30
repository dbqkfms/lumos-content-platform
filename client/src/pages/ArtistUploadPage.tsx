import PortalShell from "@/components/PortalShell";

const artistLinks = [
  { href: "/portal/artist", label: "Dashboard" },
  { href: "/portal/artist/works", label: "My Works" },
  { href: "/portal/artist/upload", label: "Upload" },
];

export default function ArtistUploadPage() {
  return (
    <PortalShell
      title="Upload New Work"
      eyebrow="CREATOR PORTAL"
      description="업로드 화면은 파일, 메타데이터, 공간 추천 태그를 한 번에 입력할 수 있어야 합니다."
      accent="blue"
      links={artistLinks}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <form className="space-y-4 border border-white/8 bg-[#111] p-6">
          <div className="border border-dashed border-[#93C5FD]/30 bg-[#93C5FD]/6 px-6 py-12 text-center text-sm text-gray-300">
            MP4 또는 프리뷰 영상 업로드 영역
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="border border-white/10 bg-black/20 px-4 py-3 text-sm text-white" placeholder="작품명" />
            <input className="border border-white/10 bg-black/20 px-4 py-3 text-sm text-white" placeholder="영문명" />
          </div>
          <textarea className="min-h-[140px] w-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white" placeholder="작품 설명" />
          <div className="grid gap-4 md:grid-cols-3">
            <select className="border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"><option>가로형</option></select>
            <select className="border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"><option>카페 / 호텔 / 리테일</option></select>
            <select className="border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"><option>공개 프리뷰 허용</option></select>
          </div>
          <button type="button" className="btn-brutalist-blue">검수 큐로 제출</button>
        </form>
        <article className="border border-white/8 bg-[#111] p-6">
          <h2 className="text-xl font-semibold text-white">업로드 체크포인트</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-400">
            <li>반복 재생 피로도</li>
            <li>가로/세로 비율</li>
            <li>공개 프리뷰 범위</li>
            <li>상업 사용 가능 여부</li>
          </ul>
        </article>
      </div>
    </PortalShell>
  );
}
