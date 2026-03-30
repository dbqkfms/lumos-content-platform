import { Search } from "lucide-react";

import Header from "@/components/Header";

const filters = ["Recommended", "Latest", "By Space", "By Mood"];

export default function OpenFree() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">OPEN / FREE</p>
          <h1 className="max-w-4xl text-display text-[2.8rem] leading-[0.94] text-white md:text-[4.8rem]">
            진입 장벽을 낮추는
            <br />
            공개형 샘플 카탈로그
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
            무료 또는 샘플 성격의 프리뷰를 먼저 보여주는 페이지입니다. 내부 검토, 첫 미팅 전 방향 확인, 빠른 브라우징에
            적합한 구간으로 설계해야 합니다.
          </p>
        </div>
      </section>

      <section className="bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-8 flex items-center gap-2 text-[#93C5FD]">
            <Search className="h-4 w-4" />
            <p className="font-accent text-[11px] tracking-[0.24em]">SEARCH & FILTER</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {filters.map((item) => (
              <div key={item} className="border border-white/8 bg-[#111] p-5 text-sm text-gray-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
