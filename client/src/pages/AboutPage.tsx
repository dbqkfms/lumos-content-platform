/*
  AboutPage — Premium Brand Identity
  Design: variant.com + niio.com inspired
  Generous whitespace, Cormorant Garamond serif, Luminous Brutalism
*/

import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useRef, useEffect } from "react";

import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export default function AboutPage() {
  const [, setLocation] = useLocation();
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const stdVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    [heroVideoRef, stdVideoRef, localVideoRef].forEach((ref) => {
      ref.current?.play().catch(() => {});
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <FloatingCTA />

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Section 1 — Hero (full viewport)                          */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video background */}
        <div className="absolute inset-0">
          <video
            ref={heroVideoRef}
            src="/videos/standard/majestic-bloom.mp4"
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            style={{ transform: "scale(1.15)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-[#050505]/30 to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 via-transparent to-transparent" />
        </div>

        {/* Hero text — 좌측 하단 정렬 */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 pb-24 md:pb-28">
          <div className="mx-auto max-w-screen-xl">
            <p className="font-accent text-[10px] tracking-[0.35em] text-[#D4A843]/80 mb-6">
              ABOUT LUMOS
            </p>
            <h1 className="text-display text-[2.4rem] leading-[1.08] text-white md:text-[4.5rem] md:leading-[0.96] max-w-4xl">
              LED를 켠 뒤의
              <br />
              질문에 답합니다
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300/90 md:text-lg">
              무엇을 틀 것인가 — 우리는 이 물음에서 시작합니다
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex h-9 w-5 justify-center border border-[#D4A843]/50 pt-1.5" style={{ borderRadius: "9999px" }}>
            <div className="h-2 w-0.5 bg-[#D4A843] opacity-80" style={{ borderRadius: "9999px" }} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Section 2 — Brand Story                                    */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5 px-6 py-32 md:px-10 md:py-40">
        <div className="mx-auto max-w-screen-lg">
          {/* Key statement — large serif */}
          <h2 className="text-display text-[1.8rem] leading-[1.35] text-white md:text-[3rem] md:leading-[1.25]">
            LUMOS는 빛이 단순한 조명을 넘어
            <br className="hidden md:block" />
            공간의 정체성을 정의한다고 믿습니다.
          </h2>

          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div>
              <p className="text-base leading-[1.85] text-gray-400">
                라틴어 Lumen에서 이름을 빌려, 차가운 하드웨어에 예술적 생명력을
                불어넣습니다. LED 화면은 설치하는 순간이 아니라, 무엇이 재생되는
                순간에 비로소 완성됩니다.
              </p>
            </div>
            <div>
              <p className="text-base leading-[1.85] text-gray-400">
                AI 아티스트의 창작물을 큐레이션하고, 공간의 목적에 맞게 연결하는
                플랫폼. 그것이 LUMOS가 존재하는 이유입니다.
              </p>
              <p className="mt-6 font-accent text-xs tracking-[0.22em] text-[#D4A843]">
                "Light, Redefined"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Section 3 — One Brand, Two Worlds (50/50 split)           */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5">
        {/* Section heading */}
        <div className="px-6 pt-32 pb-16 md:px-10 text-center">
          <p className="font-accent text-[10px] tracking-[0.28em] text-[#D4A843]">
            DUAL WORLD
          </p>
          <h2 className="mt-4 text-display text-[2rem] text-white md:text-[3rem]">
            One Brand, Two Worlds
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-500">
            하나의 LUMOS 안에서, 공간의 성격에 맞는 두 가지 빛을 제안합니다
          </p>
        </div>

        {/* 50/50 split — Home 패턴 반영 */}
        <div className="relative flex min-h-[70vh] flex-col md:flex-row">
          {/* STANDARD — 왼쪽 */}
          <button
            type="button"
            onClick={() => setLocation("/standard")}
            className="group relative flex-1 min-h-[45vh] md:min-h-[70vh] overflow-hidden text-left"
          >
            <div className="absolute inset-0">
              <video
                ref={stdVideoRef}
                src="/videos/standard/crystal-burst.mp4"
                muted
                loop
                playsInline
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
            </div>

            <div className="relative flex h-full flex-col justify-end p-8 md:p-14 pb-12 md:pb-16">
              <div className="mb-4 h-px w-12 bg-[#D4A843]" />
              <p className="font-accent text-[10px] tracking-[0.25em] text-[#D4A843] mb-3">
                STANDARD WORLD
              </p>
              <h3 className="text-display text-3xl md:text-5xl text-[#D4A843] mb-3">
                공간을 지배하는 빛
              </h3>
              <p className="max-w-sm text-sm text-gray-300 leading-relaxed mb-6">
                랜드마크, 미술관, 럭셔리 호텔.
                공간의 첫인상을 정의하는 상징적 콘텐츠.
              </p>
              <span className="inline-flex items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-[#D4A843] group-hover:gap-3 transition-all">
                STANDARD 보기
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Hover gold overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4A843]/15 to-transparent" />
            </div>
          </button>

          {/* 중앙 1px 골드 라인 */}
          <div className="hidden md:block w-px bg-[#D4A843] shadow-[0_0_15px_rgba(212,168,67,0.3)]" />

          {/* LOCAL — 오른쪽 */}
          <button
            type="button"
            onClick={() => setLocation("/local")}
            className="group relative flex-1 min-h-[45vh] md:min-h-[70vh] overflow-hidden text-left"
          >
            <div className="absolute inset-0">
              <video
                ref={localVideoRef}
                src="/videos/local/gwangmyeong.mp4"
                muted
                loop
                playsInline
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
            </div>

            <div className="relative flex h-full flex-col justify-end p-8 md:p-14 pb-12 md:pb-16">
              <div className="mb-4 h-px w-12 bg-[#93C5FD]" />
              <p className="font-accent text-[10px] tracking-[0.25em] text-[#93C5FD] mb-3">
                LOCAL WORLD
              </p>
              <h3 className="text-display text-3xl md:text-5xl text-white mb-3">
                공간에 스며드는 빛
              </h3>
              <p className="max-w-sm text-sm text-gray-300 leading-relaxed mb-6">
                카페, 리테일, 오피스, F&B.
                일상에 자연스럽게 녹아드는 배경 콘텐츠.
              </p>
              <span className="inline-flex items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-[#93C5FD] group-hover:gap-3 transition-all">
                LOCAL 보기
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Hover blue overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#93C5FD]/10 to-transparent" />
            </div>
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Section 4 — Platform Structure (3-column flow)            */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5 px-6 py-32 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="text-center mb-20">
            <p className="font-accent text-[10px] tracking-[0.28em] text-[#D4A843]">
              PLATFORM
            </p>
            <h2 className="mt-4 text-display text-[2rem] text-white md:text-[3rem]">
              창작에서 공간까지, 하나의 흐름
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500">
              AI 아티스트가 창작하고, LUMOS가 큐레이션하고, 공간이 경험합니다
            </p>
          </div>

          {/* 3-column flow */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Creators */}
            <div className="border border-white/8 bg-[#0a0a0a] p-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[#D4A843]/30">
                <span className="text-display text-2xl text-[#D4A843]">01</span>
              </div>
              <h3 className="text-display text-xl text-white mb-3">Creators</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                AI 아티스트와 미디어아트 작가들이
                자유롭게 작품을 업로드합니다
              </p>
            </div>

            {/* LUMOS Curation */}
            <div className="border border-[#D4A843]/20 bg-[#0a0a0a] p-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[#D4A843]/50 bg-[#D4A843]/5">
                <span className="text-display text-2xl text-[#D4A843]">02</span>
              </div>
              <h3 className="text-display text-xl text-[#D4A843] mb-3">LUMOS</h3>
              <p className="font-accent text-[10px] tracking-[0.18em] text-[#D4A843]/60 mb-3">
                CURATION
              </p>
              <p className="text-sm leading-relaxed text-gray-500">
                품질 검수, 공간 적합성 분석,
                목적 기반 큐레이션을 수행합니다
              </p>
            </div>

            {/* Spaces */}
            <div className="border border-white/8 bg-[#0a0a0a] p-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-white/10">
                <span className="text-display text-2xl text-white">03</span>
              </div>
              <h3 className="text-display text-xl text-white mb-3">Spaces</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                호텔, 미술관, 카페, 리테일 등
                공간이 콘텐츠를 경험합니다
              </p>
            </div>
          </div>

          {/* Connecting arrows (desktop) */}
          <div className="mt-8 hidden md:flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-[#D4A843]/30" />
            <span className="font-accent text-[10px] tracking-[0.2em] text-gray-600">
              UPLOAD
            </span>
            <ArrowRight className="h-3 w-3 text-gray-600" />
            <div className="h-px w-24 bg-[#D4A843]/30" />
            <ArrowRight className="h-3 w-3 text-[#D4A843]" />
            <span className="font-accent text-[10px] tracking-[0.2em] text-[#D4A843]">
              CURATE
            </span>
            <div className="h-px w-24 bg-[#D4A843]/30" />
            <ArrowRight className="h-3 w-3 text-gray-600" />
            <span className="font-accent text-[10px] tracking-[0.2em] text-gray-600">
              DELIVER
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Section 5 — Why LUMOS (4 cards)                            */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/5 bg-[#090909] px-6 py-32 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-16">
            <p className="font-accent text-[10px] tracking-[0.28em] text-[#D4A843]">
              WHY LUMOS
            </p>
            <h2 className="mt-4 text-display text-[2rem] text-white md:text-[2.8rem]">
              LUMOS만의 차별점
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Card 1 */}
            <article className="group border border-white/8 bg-[#111] p-8 md:p-10 transition-colors hover:border-[#D4A843]/20">
              <div className="mb-5 h-px w-10 bg-[#D4A843] transition-all group-hover:w-16" />
              <p className="font-accent text-[10px] tracking-[0.22em] text-[#D4A843] mb-3">01</p>
              <h3 className="text-display text-[1.3rem] text-white mb-4">
                한국적 정체성
              </h3>
              <p className="text-sm leading-[1.85] text-gray-500">
                수묵, 전통 문양, 자연의 결을 현대적으로 재해석합니다.
                글로벌 미디어아트와 차별화되는,
                한국의 감성을 담은 콘텐츠 라인업.
              </p>
            </article>

            {/* Card 2 */}
            <article className="group border border-white/8 bg-[#111] p-8 md:p-10 transition-colors hover:border-[#D4A843]/20">
              <div className="mb-5 h-px w-10 bg-[#D4A843] transition-all group-hover:w-16" />
              <p className="font-accent text-[10px] tracking-[0.22em] text-[#D4A843] mb-3">02</p>
              <h3 className="text-display text-[1.3rem] text-white mb-4">
                공간 맞춤 큐레이션
              </h3>
              <p className="text-sm leading-[1.85] text-gray-500">
                카탈로그를 나열하지 않습니다.
                공간의 크기, 목적, 분위기에 맞춰
                콘텐츠 조합을 설계하고 제안합니다.
              </p>
            </article>

            {/* Card 3 */}
            <article className="group border border-white/8 bg-[#111] p-8 md:p-10 transition-colors hover:border-[#D4A843]/20">
              <div className="mb-5 h-px w-10 bg-[#D4A843] transition-all group-hover:w-16" />
              <p className="font-accent text-[10px] tracking-[0.22em] text-[#D4A843] mb-3">03</p>
              <h3 className="text-display text-[1.3rem] text-white mb-4">
                AI 아티스트 네트워크
              </h3>
              <p className="text-sm leading-[1.85] text-gray-500">
                창작과 공간을 연결하는 구조.
                AI 아티스트의 작품이 검수를 거쳐
                실제 공간에서 재생되는 생태계를 만듭니다.
              </p>
            </article>

            {/* Card 4 */}
            <article className="group border border-white/8 bg-[#111] p-8 md:p-10 transition-colors hover:border-[#D4A843]/20">
              <div className="mb-5 h-px w-10 bg-[#D4A843] transition-all group-hover:w-16" />
              <p className="font-accent text-[10px] tracking-[0.22em] text-[#D4A843] mb-3">04</p>
              <h3 className="text-display text-[1.3rem] text-white mb-4">
                도입부터 운영까지
              </h3>
              <p className="text-sm leading-[1.85] text-gray-500">
                문의, 컨설팅, 콘텐츠 라이선싱, 설치, 유지보수.
                B2B 콘텐츠 도입의 전 과정을
                일괄 대응합니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Section 6 — Company + CTA                                  */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-32 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* 광화문 이미지 */}
            <div className="overflow-hidden border border-white/8">
              <img
                src="/assets/scenario-gwanghwamun.png"
                alt="광화문 프로젝션 시나리오"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Company info + CTA */}
            <div>
              <p className="font-accent text-[10px] tracking-[0.28em] text-[#D4A843]">
                COMPANY
              </p>
              <h2 className="mt-4 text-display text-[2rem] text-white md:text-[2.6rem]">
                This Global
              </h2>
              <p className="mt-2 font-accent text-[11px] tracking-[0.15em] text-gray-500">
                디스글로벌
              </p>

              <p className="mt-8 text-base leading-[1.85] text-gray-400">
                디스글로벌은 LED 디스플레이 솔루션과 콘텐츠 사업을 함께 운영합니다.
                하드웨어 설치 이후 마주하는 "무엇을 틀 것인가"라는 질문에서
                LUMOS가 시작되었습니다.
              </p>
              <p className="mt-4 text-base leading-[1.85] text-gray-400">
                빛으로 공간의 정체성을 완성하다 — 이것이 LUMOS의 약속입니다.
              </p>

              {/* CTA */}
              <div className="mt-12 flex flex-wrap gap-4">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
                  className="btn-brutalist px-8 py-4"
                >
                  문의하기
                </button>
                <button
                  onClick={() => setLocation("/solutions")}
                  className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-6 py-4 text-sm text-white transition-colors hover:bg-white/[0.06]"
                >
                  솔루션 보기
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
