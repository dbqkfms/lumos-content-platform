import { ArrowRight, Upload, Building2, LibraryBig, Search, ShieldCheck, Eye, FileSignature, ChevronDown, Paintbrush, Users } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

/* ------------------------------------------------------------------ */
/*  3-party structure                                                  */
/* ------------------------------------------------------------------ */

const parties = [
  {
    icon: Paintbrush,
    label: "CREATORS",
    color: "#D4A843",
    title: "크리에이터",
    description: "미디어아트 작가와 영상 크리에이터가 작품을 제출합니다. 포트폴리오 업로드, 공개 범위 협의, 수정 요청 대응까지 포털에서 관리합니다.",
    detail: "참여는 열려 있고, 출판은 검수를 거칩니다.",
  },
  {
    icon: LibraryBig,
    label: "LUMOS",
    color: "#D4A843",
    title: "LUMOS 큐레이션",
    description: "LUMOS가 콘텐츠의 품질, 공간 적합도, 반복 재생 안정성, 라이선스 조건을 검토합니다. 단순 필터링이 아닌, 공간 목적에 맞는 매칭을 설계합니다.",
    detail: "플랫폼의 신뢰 기반을 만드는 핵심 레이어.",
  },
  {
    icon: Building2,
    label: "BUYERS",
    color: "#93C5FD",
    title: "바이어",
    description: "공간 운영자, 인테리어 기획사, 브랜드 담당자가 콘텐츠를 탐색하고 도입을 검토합니다. 프리뷰 이후 문의 단계에서 실제 조건을 협의합니다.",
    detail: "탐색은 자유롭고, 도입은 맞춤 제안으로.",
  },
];

/* ------------------------------------------------------------------ */
/*  Workflow steps                                                     */
/* ------------------------------------------------------------------ */

const workflowSteps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload",
    subtitle: "작품 제출",
    body: "크리에이터가 영상 샘플, 썸네일, 메타데이터, 권리 정보를 포함해 작품을 제출합니다. 포털에서 진행 상태를 실시간으로 확인할 수 있습니다.",
    color: "#D4A843",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Review",
    subtitle: "검수 및 큐레이션",
    body: "LUMOS 큐레이션 팀이 공간 적합도, 반복 재생 안정성, 공개 범위, 라이선스 조건을 검토합니다. 피드백과 수정 요청이 포털을 통해 전달됩니다.",
    color: "#D4A843",
  },
  {
    number: "03",
    icon: Eye,
    title: "Discover",
    subtitle: "탐색 및 비교",
    body: "바이어가 공개 프리뷰를 통해 콘텐츠를 탐색합니다. Originals, Creator Works, Open 라이브러리를 비교하고 공간별 추천을 받을 수 있습니다.",
    color: "#93C5FD",
  },
  {
    number: "04",
    icon: FileSignature,
    title: "License / Inquiry",
    subtitle: "도입 협의",
    body: "실제 도입을 위해 화면 비율, 운영 목적, 기간, 수정 범위를 포함한 조건을 협의합니다. 맞춤 라이선스와 리사이징 서비스를 함께 제공합니다.",
    color: "#93C5FD",
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

const faqItems = [
  {
    q: "크리에이터로 참여하려면 어떤 조건이 필요한가요?",
    a: "미디어아트, 모션그래픽, 영상 아트 등 LED 디스플레이에 적합한 작품을 제작하는 크리에이터라면 누구든 참여할 수 있습니다. 포트폴리오 제출 후 LUMOS 큐레이션 팀의 검토를 거쳐 작품 공개 여부가 결정됩니다.",
  },
  {
    q: "콘텐츠 라이선스 비용은 어떻게 책정되나요?",
    a: "라이선스는 사용 범위(단일 공간 / 다점포), 기간(단기 / 장기), 용도(상업 / 행사)에 따라 개별 협의로 진행됩니다. 프리뷰는 무료이며, 문의 단계에서 견적을 안내합니다.",
  },
  {
    q: "기존 디스플레이에 바로 적용할 수 있나요?",
    a: "네. LUMOS 콘텐츠는 다양한 해상도와 비율로 제공되며, 필요 시 리사이징 서비스도 함께 진행합니다. 설치 환경 정보를 알려주시면 최적 포맷으로 변환해 드립니다.",
  },
  {
    q: "Open / Free 콘텐츠와 Originals의 차이는 무엇인가요?",
    a: "Open / Free는 누구나 프리뷰할 수 있는 공개 콘텐츠이며, Originals는 LUMOS가 직접 큐레이션한 프리미엄 작품입니다. 상업 도입을 위해서는 Originals 또는 Creator Works 라이선스가 필요합니다.",
  },
];

/* ================================================================== */
/*  FAQ Accordion Item                                                 */
/* ================================================================== */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-sm font-medium text-white md:text-base">{q}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "200px" : "0", opacity: open ? 1 : 0 }}
      >
        <p className="pb-5 text-sm leading-relaxed text-gray-400">{a}</p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export default function PlatformPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <FloatingCTA />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/5 px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(147,197,253,0.06),transparent)]" />
        <div className="relative mx-auto max-w-screen-xl">
          <p className="font-accent text-xs tracking-[0.28em] text-[#93C5FD]">PLATFORM</p>
          <h1 className="mt-5 max-w-5xl text-display text-[2.6rem] leading-[1.02] text-white md:text-[4.5rem] md:leading-[0.94]">
            크리에이터와 바이어를
            <br />
            연결하는 큐레이션 플랫폼
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
            LUMOS는 영상 콘텐츠의 창작과 도입 사이에 검수와 큐레이션 레이어를 둡니다.
            참여는 열려 있고, 출판은 품질이 보장되며, 도입은 공간에 맞춤 제안됩니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setLocation("/login")}
              className="btn-brutalist-blue"
            >
              작가로 참여하기
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
              className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white transition-colors hover:bg-white/[0.06]"
            >
              플랫폼 문의하기
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 3-Party Structure ── */}
      <section className="border-b border-white/5 bg-[#090909] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-12 text-center">
            <p className="font-accent text-[10px] tracking-[0.26em] text-[#D4A843]">STRUCTURE</p>
            <h2 className="mt-3 text-display text-[2rem] text-white md:text-[2.8rem]">
              3자 구조
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
              크리에이터의 작품이 LUMOS의 검수를 거쳐 바이어에게 도달합니다.
              세 주체가 유기적으로 연결되어 콘텐츠의 품질과 접근성을 동시에 확보합니다.
            </p>
          </div>

          {/* Diagram-style cards */}
          <div className="grid gap-5 md:grid-cols-3">
            {parties.map((party, index) => (
              <article key={party.label} className="relative border border-white/8 bg-[#111] p-8">
                {/* Connection arrow (between cards) */}
                {index < parties.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                    <ArrowRight className="h-5 w-5 text-white/20" />
                  </div>
                )}
                <party.icon className="h-7 w-7" style={{ color: party.color }} />
                <p
                  className="mt-4 font-accent text-[10px] tracking-[0.22em]"
                  style={{ color: party.color }}
                >
                  {party.label}
                </p>
                <h3 className="mt-3 text-display text-[1.6rem] text-white">{party.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">{party.description}</p>
                <p className="mt-4 border-t border-white/5 pt-4 text-xs text-gray-500">
                  {party.detail}
                </p>
              </article>
            ))}
          </div>

          {/* Flow visual connector */}
          <div className="mt-8 hidden items-center justify-center gap-2 md:flex">
            <span className="text-xs text-gray-600">작품 제출</span>
            <div className="h-px w-20 bg-[#D4A843]/30" />
            <span className="font-accent text-[10px] tracking-[0.16em] text-[#D4A843]">검수</span>
            <div className="h-px w-20 bg-[#D4A843]/30" />
            <span className="font-accent text-[10px] tracking-[0.16em] text-[#93C5FD]">공개</span>
            <div className="h-px w-20 bg-[#93C5FD]/30" />
            <span className="text-xs text-gray-600">도입 문의</span>
          </div>
        </div>
      </section>

      {/* ── Workflow Steps ── */}
      <section className="border-b border-white/5 bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-12">
            <p className="font-accent text-[10px] tracking-[0.26em] text-[#D4A843]">WORKFLOW</p>
            <h2 className="mt-3 text-display text-[2rem] text-white md:text-[2.8rem]">
              Upload &rarr; Review &rarr; Discover &rarr; License
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
              4단계의 명확한 흐름을 통해 콘텐츠가 창작에서 도입까지 이동합니다.
              각 단계에서 LUMOS가 품질과 적합성을 보장합니다.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <article key={step.number} className="relative border border-white/8 bg-[#111] p-6">
                {/* Step number */}
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center border text-sm font-medium"
                  style={{
                    borderColor: step.color + "40",
                    color: step.color,
                    backgroundColor: step.color + "0A",
                  }}
                >
                  {step.number}
                </div>

                <step.icon className="h-5 w-5" style={{ color: step.color }} />
                <h3 className="mt-3 text-display text-[1.4rem] text-white">{step.title}</h3>
                <p
                  className="mt-1 font-accent text-[10px] tracking-[0.18em]"
                  style={{ color: step.color }}
                >
                  {step.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">{step.body}</p>

                {/* Connector */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 xl:block">
                    <ArrowRight className="h-4 w-4 text-white/15" />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open + Moderated ── */}
      <section className="border-b border-white/5 bg-[#090909] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-accent text-[10px] tracking-[0.26em] text-[#93C5FD]">OPEN PARTICIPATION</p>
              <h2 className="mt-3 text-display text-[2rem] text-white md:text-[2.6rem]">
                참여는 열려 있고,
                <br />
                출판은 검수를 거칩니다
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                누구든 크리에이터로 참여할 수 있지만, 모든 콘텐츠가 자동으로 공개되지는 않습니다.
                LUMOS의 큐레이션 팀이 공간 적합도와 품질을 검토한 뒤 공개 범위를 결정합니다.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                이 구조는 크리에이터에게는 공정한 기회를, 바이어에게는 검증된 품질을 보장합니다.
                플랫폼의 신뢰를 만드는 핵심 원칙입니다.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Upload,
                  title: "열린 참여",
                  body: "장르와 경력에 관계없이 누구든 작품을 제출할 수 있습니다.",
                  color: "#D4A843",
                },
                {
                  icon: ShieldCheck,
                  title: "검수 출판",
                  body: "품질, 적합도, 라이선스 조건을 충족한 작품만 공개됩니다.",
                  color: "#D4A843",
                },
                {
                  icon: Search,
                  title: "자유 탐색",
                  body: "바이어는 라이브러리에서 자유롭게 탐색하고 비교합니다.",
                  color: "#93C5FD",
                },
                {
                  icon: Users,
                  title: "맞춤 매칭",
                  body: "도입 단계에서는 공간 조건에 맞는 콘텐츠를 직접 제안합니다.",
                  color: "#93C5FD",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 border border-white/8 bg-[#111] p-5">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: item.color }} />
                  <div>
                    <h4 className="text-sm font-medium text-white">{item.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-b border-white/5 bg-[#050505] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="font-accent text-[10px] tracking-[0.26em] text-[#D4A843]">FAQ</p>
              <h2 className="mt-3 text-display text-[2rem] text-white md:text-[2.4rem]">
                자주 묻는 질문
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                플랫폼 참여, 콘텐츠 도입, 라이선스에 대해
                가장 많이 묻는 질문들을 모았습니다.
              </p>
            </div>

            <div>
              {faqItems.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#050505] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Creator CTA */}
            <div className="flex flex-col justify-between border border-[#D4A843]/20 bg-[#111] p-8 md:p-10">
              <div>
                <p className="font-accent text-[10px] tracking-[0.24em] text-[#D4A843]">FOR CREATORS</p>
                <h3 className="mt-3 text-display text-[1.8rem] text-white md:text-[2.2rem]">
                  작가로 참여하기
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  미디어아트, 모션그래픽, 영상 아트 크리에이터라면
                  포트폴리오를 제출하고 LUMOS 플랫폼에 참여하세요.
                </p>
              </div>
              <button
                onClick={() => setLocation("/login")}
                className="mt-8 btn-brutalist inline-flex w-fit items-center gap-2"
              >
                크리에이터 포털
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Buyer CTA */}
            <div className="flex flex-col justify-between border border-[#93C5FD]/20 bg-[#111] p-8 md:p-10">
              <div>
                <p className="font-accent text-[10px] tracking-[0.24em] text-[#93C5FD]">FOR BUYERS</p>
                <h3 className="mt-3 text-display text-[1.8rem] text-white md:text-[2.2rem]">
                  문의하기
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  공간에 맞는 콘텐츠 도입을 검토 중이시라면
                  라이브러리 탐색 후 문의를 시작하세요.
                </p>
              </div>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
                className="mt-8 inline-flex w-fit items-center gap-2 border border-[#93C5FD]/30 bg-[#93C5FD]/10 px-6 py-3 text-sm text-[#C9E3FF] transition-colors hover:bg-[#93C5FD]/18"
              >
                도입 문의
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
