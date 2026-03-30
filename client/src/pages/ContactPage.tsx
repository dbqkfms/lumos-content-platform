import { ArrowRight, Mail, Phone } from "lucide-react";

import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <FloatingCTA />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="font-accent text-xs tracking-[0.28em] text-[#D4A843]">CONTACT / INQUIRY</p>
          <h1 className="mt-5 max-w-4xl text-display text-[2.8rem] leading-[0.94] text-white md:text-[4.6rem]">
            작품 감상보다 도입 판단이 먼저 필요한 프로젝트라면,
            <br />
            지금 바로 문의 흐름으로 들어가면 됩니다.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
            이 페이지는 문의 모달의 역할을 설명하는 보조 입구입니다. 실제 접수는 우하단 Inquiry 버튼 또는 아래 CTA에서 바로 열립니다.
          </p>
        </div>
      </section>

      <section className="bg-[#090909] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-screen-xl gap-5 md:grid-cols-3">
          <article className="border border-white/8 bg-[#111] p-6">
            <Mail className="h-5 w-5 text-[#D4A843]" />
            <h2 className="mt-4 text-xl font-semibold text-white">이메일</h2>
            <p className="mt-4 text-sm text-gray-400">sun@thisglobal.kr</p>
          </article>
          <article className="border border-white/8 bg-[#111] p-6">
            <Phone className="h-5 w-5 text-[#D4A843]" />
            <h2 className="mt-4 text-xl font-semibold text-white">기본 흐름</h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">공간 조건 입력 → 작품/컬렉션 선택 → 라이선스 및 운영 조건 협의</p>
          </article>
          <article className="border border-white/8 bg-[#111] p-6">
            <p className="font-accent text-[10px] tracking-[0.22em] text-[#D4A843]">WHAT TO PREPARE</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              화면 크기, 위치, 세로/가로 비율, 운영 시간, 원하는 분위기, 참고 공간 사진을 함께 준비하면 빠르게 제안할 수 있습니다.
            </p>
          </article>
        </div>

        <div className="mx-auto mt-10 flex max-w-screen-xl justify-end">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
            className="inline-flex items-center gap-2 border border-[#D4A843]/30 bg-[#D4A843]/10 px-5 py-3 text-sm text-[#E6C878] transition-colors hover:bg-[#D4A843]/18"
          >
            문의 모달 열기
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
