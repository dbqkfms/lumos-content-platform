/*
  Design Philosophy: Luminous Brutalism
  - Hero: 풀스크린 영상 + 좌측 하단 텍스트 (10% 영역)
  - World Selection: Vertical Split (50/50, 중앙 1px 골드 라인)
  - Color: 블랙 배경 + 골드/블루 액센트
  - v2 이원화 영상 구조 복원 + 현재 네비게이션 유지
*/

import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <FloatingCTA />

      {/* ─── Hero Section: 풀스크린 영상 배경 ─── */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-60"
          >
            <source src="/videos/standard/diamond-drift.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        {/* 좌측 하단 텍스트 */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-2xl">
            <p className="font-accent text-[10px] tracking-[0.35em] text-[#D4A843]/80 mb-6">
              AI MEDIA ART CURATION PLATFORM
            </p>
            <h1 className="text-display text-4xl md:text-[4rem] lg:text-[5rem] leading-[1.05] mb-8 text-shadow-strong">
              빛으로 공간의 정체성을 완성하다
            </h1>
            <p className="text-base md:text-lg text-gray-300/90 max-w-lg text-shadow-soft mb-10 leading-relaxed">
              AI 아티스트의 미디어아트를 큐레이션하고,
              LED 공간의 목적에 맞게 연결합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setLocation("/open")} className="btn-brutalist px-8 py-4">
                컬렉션 둘러보기
              </button>
              <button onClick={() => setLocation("/solutions")} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
                공간별 제안 보기
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-9 border border-[#D4A843]/50 rounded-full flex justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-[#D4A843] rounded-full opacity-80" />
          </div>
        </div>
      </section>

      {/* 글로우 디바이더 */}
      <div className="glow-divider" />

      {/* ─── World Selection: STANDARD / LOCAL 50:50 Split ─── */}
      <section className="relative min-h-screen flex flex-col md:flex-row">
        {/* STANDARD — 왼쪽 50% */}
        <button
          type="button"
          onClick={() => setLocation("/standard")}
          className="group relative flex-1 min-h-[50vh] md:min-h-screen overflow-hidden text-left"
        >
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            >
              <source src="/videos/standard/crystal-burst.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/25 transition-colors duration-500" />
          </div>

          <div className="relative h-full flex flex-col justify-end p-8 md:p-16 pb-16 md:pb-20">
            <p className="font-accent text-xs tracking-[0.25em] text-[#D4A843] mb-4">
              LUMOS ORIGINALS
            </p>
            <h2 className="text-display text-5xl md:text-7xl mb-4 text-[#D4A843]">
              STANDARD
            </h2>
            <p className="text-base md:text-lg text-gray-200 max-w-sm mb-8 text-shadow-soft leading-relaxed">
              랜드마크의 첫인상을 만드는 빛
            </p>
            <span className="inline-flex items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-[#D4A843]">
              Explore STANDARD
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>

          {/* 호버 골드 오버레이 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4A843]/15 to-transparent" />
          </div>
        </button>

        {/* 중앙 1px 골드 라인 */}
        <div className="hidden md:block w-px bg-[#D4A843] shadow-[0_0_15px_rgba(212,168,67,0.3)]" />

        {/* LOCAL — 오른쪽 50% */}
        <button
          type="button"
          onClick={() => setLocation("/local")}
          className="group relative flex-1 min-h-[50vh] md:min-h-screen overflow-hidden text-left"
        >
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            >
              <source src="/videos/local/seonwon.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
          </div>

          <div className="relative h-full flex flex-col justify-end p-8 md:p-16 pb-16 md:pb-20">
            <p className="font-accent text-xs tracking-[0.25em] text-[#93C5FD] mb-4">
              LUMOS ORIGINALS
            </p>
            <h2 className="text-display text-5xl md:text-7xl mb-4 text-white">
              LOCAL
            </h2>
            <p className="text-base md:text-lg text-gray-200 max-w-sm mb-8 text-shadow-soft leading-relaxed">
              일상에 스며드는 한국적 감성의 빛
            </p>
            <span className="inline-flex items-center gap-2 font-accent text-[11px] tracking-[0.18em] text-[#93C5FD]">
              Explore LOCAL
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>

          {/* 호버 화이트 오버레이 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-bl from-white/10 to-transparent" />
          </div>
        </button>
      </section>

      {/* ─── 3대 콘텐츠 진입 섹션 ─── */}
      <section className="border-b border-white/5 bg-[#080808] px-6 py-28 md:px-10 md:py-32">
        <div className="mx-auto max-w-screen-xl">
          <p className="font-accent text-xs tracking-[0.26em] text-[#D4A843] mb-3">CONTENT LIBRARY</p>
          <h2 className="text-display text-[2.2rem] md:text-[3rem] text-white mb-4">
            아티스트의 빛을, 공간에 연결합니다
          </h2>
          <p className="text-base text-gray-400 mb-12 max-w-2xl">
            AI 아티스트가 창작한 미디어아트를 세 가지 컬렉션으로 분류하고, 공간의 목적에 맞게 큐레이션합니다.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Open / Free */}
            <button
              type="button"
              onClick={() => setLocation("/open")}
              className="group border border-white/8 bg-[#0a0a0a] text-left transition hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                <img
                  src="/thumbnails/cosmic-flow.jpg"
                  alt="Open Collection"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <p className="font-accent text-[10px] tracking-[0.22em] text-[#93C5FD]">OPEN / FREE</p>
                <h3 className="mt-3 text-xl font-semibold text-white">공개 컬렉션</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  첫 미팅 전에 무드와 공간 적합도를 빠르게 확인할 수 있는 샘플 라이브러리
                </p>
              </div>
            </button>

            {/* LUMOS Originals */}
            <button
              type="button"
              onClick={() => setLocation("/originals")}
              className="group border border-[#D4A843]/20 bg-[#0a0a0a] text-left transition hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                <img
                  src="/thumbnails/bonghwang.jpg"
                  alt="LUMOS Originals"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <p className="font-accent text-[10px] tracking-[0.22em] text-[#D4A843]">LUMOS ORIGINALS</p>
                <h3 className="mt-3 text-xl font-semibold text-white">STANDARD × LOCAL</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  브랜드의 핵심 자산. STANDARD와 LOCAL의 두 세계로 분리된 고유 라이브러리
                </p>
              </div>
            </button>

            {/* Creator Works */}
            <button
              type="button"
              onClick={() => setLocation("/creator-works")}
              className="group border border-white/8 bg-[#0a0a0a] text-left transition hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                <img
                  src="/thumbnails/crystal-burst.jpg"
                  alt="Creator Works"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <p className="font-accent text-[10px] tracking-[0.22em] text-white/60">CREATOR WORKS</p>
                <h3 className="mt-3 text-xl font-semibold text-white">큐레이션 작가 작업</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  참여는 열려 있지만, 공개와 제안은 큐레이션을 거친 작품만 연결됩니다
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Case Studies (공간 적용 사례) ─── */}
      <section className="relative py-20 px-8 bg-gradient-to-b from-[#080808] to-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="font-accent text-xs tracking-[0.26em] text-[#93C5FD] mb-3">SPACES × CONTENT</p>
            <h2 className="text-display text-4xl md:text-5xl text-white mb-4">
              공간이 콘텐츠를 만났을 때
            </h2>
            <p className="text-base text-gray-400 max-w-2xl">
              호텔, 갤러리, 카페, 오피스 — 각 공간의 목적에 맞는 AI 아트를 매칭합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Immersive Exhibition",
                title: "광화문 미디어 프로젝션",
                desc: "수묵화와 서예가 건축물 위에 펼쳐지는 대형 프로젝션 매핑.",
                img: "/assets/scenario-gwanghwamun.png",
                accent: "#D4A843",
              },
              {
                label: "Gallery Installation",
                title: "이머시브 전시 — 용과 바다",
                desc: "대형 LED 벽면 가득 채운 동양 수묵 미디어아트. 공간을 작품으로.",
                img: "/assets/scenario-dragon-ocean.png",
                accent: "#D4A843",
              },
              {
                label: "Nature Immersion",
                title: "자연 몰입 전시관",
                desc: "폭포와 야생의 에너지를 LED로 재현. 관람자를 자연 속으로.",
                img: "/assets/scenario-nature-forest.png",
                accent: "#93C5FD",
              },
              {
                label: "Gallery Media Wall",
                title: "갤러리 미디어월 설치",
                desc: "대형 LED 월에 미디어아트가 흐르는 갤러리 공간.",
                img: "/images/mockups/gallery.png",
                accent: "#D4A843",
              },
            ].map((cs) => (
              <button
                key={cs.title}
                type="button"
                onClick={() => setLocation("/solutions")}
                className="group relative overflow-hidden text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={cs.img}
                    alt={cs.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-black/85 backdrop-blur-sm p-5 border-l-2" style={{ borderColor: cs.accent }}>
                    <span className="font-accent text-[10px] uppercase tracking-[0.2em]" style={{ color: cs.accent }}>
                      {cs.label}
                    </span>
                    <h3 className="text-display text-xl mt-2 mb-2 text-white">{cs.title}</h3>
                    <p className="text-sm text-gray-400">{cs.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Platform Flow ─── */}
      <section className="border-b border-white/5 bg-[#060606] px-6 py-28 md:px-10 md:py-32">
        <div className="mx-auto max-w-screen-xl">
          <p className="font-accent text-xs tracking-[0.26em] text-[#93C5FD] mb-3">PLATFORM FLOW</p>
          <h2 className="text-display text-[2rem] md:text-[2.5rem] text-white mb-4 max-w-3xl">
            아티스트 → 큐레이션 → 공간 도입
          </h2>
          <p className="text-sm text-gray-400 mb-10 max-w-2xl">
            AI 아티스트가 창작하고, LUMOS가 큐레이션하고, 공간 운영자가 도입합니다.
          </p>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { step: "01", title: "작가 업로드", desc: "크리에이터가 작품을 제출합니다" },
              { step: "02", title: "큐레이션 검수", desc: "품질과 적합성을 검증합니다" },
              { step: "03", title: "공간별 탐색", desc: "공간 유형에 맞는 작품을 찾습니다" },
              { step: "04", title: "문의·라이선스", desc: "도입 문의부터 납품까지 연결합니다" },
            ].map((item) => (
              <article key={item.step} className="border border-white/8 bg-[#0a0a0a] p-6 group hover:border-[#D4A843]/30 transition">
                <span className="font-accent text-[10px] tracking-[0.3em] text-[#D4A843]">{item.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About / Brand Statement ─── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-30"
          >
            <source src="/videos/local/fractal-lotus-1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#060606] via-transparent to-[#060606]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-8 py-16 text-center">
          <p className="font-accent text-xs tracking-[0.3em] text-[#D4A843] mb-6">LIGHT, REDEFINED</p>
          <h2 className="text-display text-4xl md:text-6xl mb-8 text-white">
            차가운 디스플레이에<br />예술적 생명력을
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-10">
            LED를 설치한 뒤 "무엇을 틀 것인가?" — LUMOS는 이 질문에 답합니다.
            AI 아티스트의 창작물을 큐레이션하고, 공간의 목적에 맞게 연결하여
            하드웨어를 살아있는 경험으로 바꿉니다.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => setLocation("/about")} className="btn-brutalist">
              About LUMOS
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
              className="inline-flex items-center gap-2 border border-[#D4A843]/30 bg-[#D4A843]/10 px-5 py-3 text-sm text-[#E6C878] transition-colors hover:bg-[#D4A843]/18"
            >
              문의 시작
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-display text-xl mb-3 text-[#D4A843]">LUMOS</h3>
              <p className="text-xs text-gray-500">
                LED 공간을 위한<br />큐레이션 미디어아트 라이브러리
              </p>
            </div>
            <div>
              <h4 className="font-accent text-[10px] tracking-[0.2em] text-gray-400 mb-4">COLLECTIONS</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="/open" className="hover:text-[#93C5FD] transition-colors">Open / Free</a></li>
                <li><a href="/originals" className="hover:text-[#D4A843] transition-colors">LUMOS Originals</a></li>
                <li><a href="/creator-works" className="hover:text-white transition-colors">Creator Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-accent text-[10px] tracking-[0.2em] text-gray-400 mb-4">WORLDS</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="/standard" className="hover:text-[#D4A843] transition-colors">STANDARD</a></li>
                <li><a href="/local" className="hover:text-[#93C5FD] transition-colors">LOCAL</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-accent text-[10px] tracking-[0.2em] text-gray-400 mb-4">COMPANY</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="/solutions" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/platform" className="hover:text-white transition-colors">Platform</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">© 2026 LUMOS by This Global. All rights reserved.</p>
            <p className="text-xs text-gray-600">상업용 미디어아트 콘텐츠. 무단 복제 및 재배포를 금합니다.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
