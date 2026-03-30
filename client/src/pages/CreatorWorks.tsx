import Header from "@/components/Header";

export default function CreatorWorks() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">CREATOR WORKS</p>
          <h1 className="max-w-4xl text-display text-[2.8rem] leading-[0.94] text-white md:text-[4.8rem]">
            플랫폼 성격을 보여주는
            <br />
            작가 및 크리에이터 콘텐츠 레이어
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
            Creator Works는 외부 참여를 보여주는 구간입니다. 다만 공개는 열려 있어도, 큐레이션과 검수 레이어가 함께
            보일 때 비로소 상업용 플랫폼으로 신뢰를 얻을 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
