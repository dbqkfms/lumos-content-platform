import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

const points = [
  "LUMOS는 미디어아트 감상 사이트가 아니라, 공간에 맞는 콘텐츠를 고르고 제안하는 플랫폼형 라이브러리다.",
  "이원화의 핵심은 STANDARD / LOCAL 두 축을 유지하되, 이를 콘텐츠 구조 안에서 더 명확하게 읽히게 하는 것이다.",
  "THISGLOBAL의 설치/하드웨어 맥락과 LUMOS의 콘텐츠 제안 맥락이 하나의 도입 흐름처럼 이어져야 한다.",
  "전략 문서는 설계 기준이 아니라 배경 논리로만 활용하고, 현재 UI 구조는 최신 대화 요구사항을 기준으로 잡는다.",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <FloatingCTA />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">ABOUT</p>
          <h1 className="font-content-heading max-w-4xl text-[2.6rem] text-white md:text-[4.2rem]">
            LUMOS는 작품을 모아두는 곳이 아니라,
            <br />
            공간에 맞는 콘텐츠 구조를 제안하는 플랫폼입니다
          </h1>
          <p className="font-content-body mt-6 max-w-3xl text-base text-gray-300 md:text-lg">
            이 페이지는 브랜드 설명용입니다. 무엇을 파는지보다, 왜 이 구조가 필요한지와 어떻게 공간 도입 흐름으로
            이어지는지를 짧고 명확하게 설명해야 합니다.
          </p>
        </div>
      </section>

      <section className="bg-[#0a0a0a] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-screen-xl gap-4 md:grid-cols-2">
          {points.map((item) => (
            <div key={item} className="border border-white/8 bg-[#111] p-6">
              <p className="font-content-body text-sm text-gray-300">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
