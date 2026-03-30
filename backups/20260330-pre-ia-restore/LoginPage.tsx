import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

const roles = [
  {
    title: "Artist Portal",
    body: "작가 업로드, 심사 상태, 수정 요청, 승인 상태 확인용 포털.",
  },
  {
    title: "Admin",
    body: "작품 관리, 문의 관리, 승인/반려, 운영 상태 점검용 포털.",
  },
  {
    title: "Client Access",
    body: "향후 검토용 링크나 전용 제안 화면이 붙는다면 여기서 분기될 수 있는 자리.",
  },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <FloatingCTA />

      <section className="border-b border-white/5 px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-screen-xl">
          <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">LOGIN / PORTAL</p>
          <h1 className="font-content-heading max-w-4xl text-[2.6rem] text-white md:text-[4.2rem]">
            로그인 이후는
            <br />
            역할에 따라 다른 포털로 읽혀야 합니다
          </h1>
          <p className="font-content-body mt-6 max-w-3xl text-base text-gray-300 md:text-lg">
            메인 사이트 상단에는 최소한의 로그인 진입만 두고, 실제 역할별 기능은 로그인 후 포털 안에서 보여주는 게 맞습니다.
          </p>
        </div>
      </section>

      <section className="bg-[#0a0a0a] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-screen-xl gap-5 md:grid-cols-3">
          {roles.map((item) => (
            <article key={item.title} className="border border-white/8 bg-[#111] p-6">
              <h2 className="font-content-heading text-[1.3rem] text-white">{item.title}</h2>
              <p className="font-content-body mt-4 text-sm text-gray-400">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
