import Header from "@/components/Header";

const worlds = [
  {
    label: "STANDARD",
    title: "강하고 프리미엄한 공간 지배형 컬렉션",
    body: "랜드마크, 럭셔리, 전시, 시그니처 장면이 중요한 공간에 맞는 Originals 축입니다.",
    href: "/standard",
  },
  {
    label: "LOCAL",
    title: "부드럽고 저피로한 공간 조화형 컬렉션",
    body: "상업공간 운영, 장시간 송출, 배경 무드 유지에 적합한 Originals 축입니다.",
    href: "/local",
  },
];

export default function OriginalsHub() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">LUMOS ORIGINALS</p>
          <h1 className="max-w-4xl text-display text-[2.8rem] leading-[0.94] text-white md:text-[4.8rem]">
            STANDARD / LOCAL은 가격 구분이 아니라
            <br />
            LUMOS Originals 안의 브랜드 구조입니다
          </h1>
        </div>
      </section>

      <section className="bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-screen-xl gap-5 md:grid-cols-2">
          {worlds.map((item) => (
            <a key={item.label} href={item.href} className="border border-white/8 bg-[#111] p-6">
              <p className={`font-accent text-[10px] tracking-[0.22em] ${item.label === "STANDARD" ? "text-[#D4A843]" : "text-[#93C5FD]"}`}>
                {item.label}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">{item.body}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
