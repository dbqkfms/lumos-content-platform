import Header from "@/components/Header";

const pillars = [
  {
    title: "Why now",
    body: "LED screen inventory keeps expanding, but buyers still struggle to connect content selection to real space usage. LUMOS exists to close that gap.",
  },
  {
    title: "What LUMOS is",
    body: "A premium content platform that connects Open / Originals / Creator Works to real commercial use cases, not just a gallery of moving visuals.",
  },
  {
    title: "How it works",
    body: "THISGLOBAL frames hardware and installation context, while LUMOS frames content structure, curation, mockups, and inquiry flow.",
  },
];

const dualWorlds = [
  {
    label: "STANDARD",
    title: "Space-dominant, premium, landmark-oriented",
    body: "Designed for brand-defining moments, signature entrances, luxury lobbies, and exhibition-grade scenes.",
  },
  {
    label: "LOCAL",
    title: "Space-harmonizing, low-fatigue, commercially friendly",
    body: "Designed for longer-duration playback, softer mood shaping, and daily operation in hospitality, retail, and office contexts.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">ABOUT</p>
          <h1 className="max-w-4xl text-display text-[2.8rem] leading-[0.94] text-white md:text-[4.8rem]">
            LUMOS is not only a library of media art.
            <br />
            It is a commercial structure for placing the right light in the right space.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
            The goal is not to overwhelm users with abstract beauty. The goal is to help operators, buyers, and creators
            understand how content can be reviewed, matched to space, and turned into a real inquiry path.
          </p>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0d0d0d] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-screen-xl gap-5 md:grid-cols-3">
          {pillars.map((item) => (
            <article key={item.title} className="border border-white/8 bg-[#111] p-6">
              <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0a0a0a] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-10 max-w-3xl">
            <p className="font-accent text-xs tracking-[0.26em] text-[#93C5FD]">ONE BRAND, TWO WORLDS</p>
            <h2 className="mt-3 text-display text-[2.2rem] leading-tight text-white md:text-[3rem]">
              STANDARD and LOCAL are not pricing tiers.
              <br />
              They are the two brand worlds inside LUMOS Originals.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {dualWorlds.map((item) => (
              <article key={item.label} className="border border-white/8 bg-[#111] p-6">
                <p className={`font-accent text-[10px] tracking-[0.22em] ${item.label === "STANDARD" ? "text-[#D4A843]" : "text-[#93C5FD]"}`}>
                  {item.label}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
