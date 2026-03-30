import Header from "@/components/Header";

const steps = [
  "Creators upload",
  "Reviewed / curated",
  "Discover by space",
  "License / inquiry",
];

export default function PlatformFlow() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">PLATFORM / HOW IT WORKS</p>
          <h1 className="max-w-4xl text-display text-[2.8rem] leading-[0.94] text-white md:text-[4.8rem]">
            플랫폼처럼 보이게 만드는 핵심은
            <br />
            구조와 흐름이 한 화면에서 읽히는 것입니다
          </h1>
        </div>
      </section>

      <section className="bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-screen-xl gap-4 md:grid-cols-4">
          {steps.map((step) => (
            <div key={step} className="border border-white/8 bg-[#111] p-5 text-sm text-gray-300">
              {step}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
