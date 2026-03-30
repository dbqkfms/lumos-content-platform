/*
  Design Philosophy: Luminous Brutalism
  - Hero: 풀스크린 영상 + 좌측 하단 텍스트 (10% 영역)
  - World Selection: Vertical Split (50/50, 중앙 1px 골드 라인)
  - Color: 블랙 배경 + 골드 액센트
*/

import { useLocation } from "wouter";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <FloatingCTA />
      {/* Hero Section - 풀스크린 영상 배경 */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background - Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-60"
          >
            <source src="https://files.manuscdn.com/user_upload_by_module/session_file/91290999/ndeHuHogaaKeFNpu.mp4" type="video/mp4" />
          </video>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Hero Content - 좌측 하단 10% 영역 */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-2xl">
            <h1 className="text-display text-6xl md:text-8xl mb-6 offset-text text-shadow-strong">
              LUMOS
            </h1>
            <p className="text-xl md:text-2xl font-light mb-2 text-gray-200 text-shadow-medium">
              Light, Redefined.
            </p>
            <p className="text-base md:text-lg text-gray-300 max-w-xl text-shadow-soft">
              LED 디스플레이 전용 AI 생성 미디어아트 라이브러리
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#D4AF37] rounded-full" />
          </div>
        </div>
      </section>

      {/* Glowing Divider */}
      <div className="glow-divider" />

      {/* World Selection - Vertical Split 50/50 */}
      <section className="relative min-h-screen flex flex-col md:flex-row">
        {/* STANDARD World - 왼쪽 50% */}
        <div
          onClick={() => setLocation("/standard")}
          className="group relative flex-1 min-h-[50vh] md:min-h-screen overflow-hidden cursor-pointer light-trail"
        >
          {/* Background Video */}
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            >
              <source src="https://files.manuscdn.com/user_upload_by_module/session_file/91290999/uqcXUFUnrsmScJQs.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center items-start p-8 md:p-16">
            <div className="max-w-md">
              <h2 className="text-display text-5xl md:text-7xl mb-6 text-[#D4AF37]">
                STANDARD
              </h2>
              <p className="text-lg md:text-xl mb-4 text-gray-100 text-shadow-medium">
                프리미엄 미디어아트
              </p>
              <p className="text-sm md:text-base text-gray-200 mb-8 text-shadow-soft">
                갤러리, 미술관, 럭셔리 공간을 위한 글로벌 스탠다드 콘텐츠. 보편적 아름다움으로 공간의 품격을 완성합니다.
              </p>
              <button className="btn-brutalist">
                Explore STANDARD
              </button>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent" />
          </div>
        </div>

        {/* Central Divider - 1px 골드 라인 */}
        <div className="hidden md:block w-px bg-[#D4AF37] glow-gold-sm" />

        {/* LOCAL World - 오른쪽 50% */}
        <div
          onClick={() => setLocation("/local")}
          className="group relative flex-1 min-h-[50vh] md:min-h-screen overflow-hidden cursor-pointer light-trail"
        >
          {/* Background Video */}
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            >
              <source src="https://files.manuscdn.com/user_upload_by_module/session_file/91290999/CnGsOfsCLSNXSijg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center items-start p-8 md:p-16">
            <div className="max-w-md">
              <h2 className="text-display text-5xl md:text-7xl mb-6 text-white">
                LOCAL
              </h2>
              <p className="text-lg md:text-xl mb-4 text-gray-100 text-shadow-medium">
                한국적 상업용 콘텐츠
              </p>
              <p className="text-sm md:text-base text-gray-200 mb-8 text-shadow-soft">
                한국의 전통미와 자연을 담은 콘텐츠. 카페, 레스토랑, 호텔 등 일상 공간에 한국적 정서를 더합니다.
              </p>
              <button className="btn-brutalist border-white text-white hover:bg-white hover:text-black">
                Explore LOCAL
              </button>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-bl from-white/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="relative py-20 px-8 bg-gradient-to-b from-black to-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-display text-4xl md:text-6xl mb-4">Case Studies</h2>
            <p className="text-lg text-gray-400">
              LUMOS가 빛으로 완성한 공간들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Case 1: 호텔 로비 */}
            <div className="group relative overflow-hidden light-trail">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920"
                  alt="호텔 로비 사례"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-black/90 backdrop-blur-sm p-6 border border-[#D4AF37]/30">
                  <span className="text-accent text-xs uppercase tracking-wider text-[#D4AF37]">
                    Luxury Hotel
                  </span>
                  <h3 className="text-display text-2xl mt-2 mb-3">
                    호텔 로비 LED 파사드
                  </h3>
                  <p className="text-sm text-gray-400">
                    프리미엄 미디어아트로 호텔의 정체성을 표현. 우주와 추상의 조화.
                  </p>
                </div>
              </div>
            </div>

            {/* Case 2: 갤러리 */}
            <div className="group relative overflow-hidden light-trail">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1920"
                  alt="갤러리 사례"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-black/90 backdrop-blur-sm p-6 border border-[#D4AF37]/30">
                  <span className="text-accent text-xs uppercase tracking-wider text-[#D4AF37]">
                    Art Gallery
                  </span>
                  <h3 className="text-display text-2xl mt-2 mb-3">
                    현대미술관 미디어 설치
                  </h3>
                  <p className="text-sm text-gray-400">
                    기하학적 패턴과 빛의 예술. 갤러리 공간에 생명을 불어넣다.
                  </p>
                </div>
              </div>
            </div>

            {/* Case 3: 카페 */}
            <div className="group relative overflow-hidden light-trail">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://private-us-east-1.manuscdn.com/sessionFile/OwKpbvpl0NtYLmWGBzoe20/sandbox/8sBD7cWy7fnlTevRmRk8l0-img-4_1770843165000_na1fn_bG9jYWxfc2Vhc29uYWxfMQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT3dLcGJ2cGwwTnRZTG1XR0J6b2UyMC9zYW5kYm94LzhzQkQ3Y1d5N2ZubFRldlJtUms4bDAtaW1nLTRfMTc3MDg0MzE2NTAwMF9uYTFmbl9iRzlqWVd4ZmMyVmhjMjl1WVd4Zk1RLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=RdKnBTJyGhOYhkv42XKBsLQiV0VgBAkUHZ~YxgKacEwx~cC23ULj4tKS6A7HDK5J-onS8I673RjPeJjGtK0kCkMHJ98Wpd6nUtkrefUZWm2RIBzpD7WcLWGYwMH~NAkXkWJJOs2oM4Yvzs4zJNUnvT~d-ipJKJiqNOEhaekgxsvzX~sZajs0bkL3T5UDoDx9LJwIAjp7GvWlIn21wLeEctVu3MLLxKOh1nwLdm76F3eYllPeLDbeYvnUtO~qo-bVcxozqQtMBT9Z24dkygau3R2hE9voRoCxRvm-s8BqSHg5JxhkfGZVpgns-xZAgT5q4pij0jp6fHbV4T9AkBm6kA__"
                  alt="카페 사례"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-black/90 backdrop-blur-sm p-6 border border-white/30">
                  <span className="text-accent text-xs uppercase tracking-wider text-white">
                    Cafe
                  </span>
                  <h3 className="text-display text-2xl mt-2 mb-3">
                    봄날 벚꽃 카페
                  </h3>
                  <p className="text-sm text-gray-400">
                    계절의 변화를 담은 자연 콘텐츠. 평화로운 분위기 연출.
                  </p>
                </div>
              </div>
            </div>

            {/* Case 4: 오피스 */}
            <div className="group relative overflow-hidden light-trail">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920"
                  alt="오피스 사례"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-black/90 backdrop-blur-sm p-6 border border-[#D4AF37]/30">
                  <span className="text-accent text-xs uppercase tracking-wider text-[#D4AF37]">
                    Corporate Office
                  </span>
                  <h3 className="text-display text-2xl mt-2 mb-3">
                    기업 로비 미디어월
                  </h3>
                  <p className="text-sm text-gray-400">
                    추상적 패턴으로 브랜드 정체성을 표현. 현대적이고 세련된 분위기.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Glowing Divider */}
      <div className="glow-divider" />

      {/* About Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/91290999/EstDBDiGIUjZvcAV.png"
            alt="About LUMOS"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 py-16 text-center">
          <h2 className="text-display text-4xl md:text-6xl mb-8">
            Light, Redefined.
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed">
            <p>
              LUMOS는 빛이 단순한 조명을 넘어 공간의 정체성을 정의하고, 경험을 완성하며, 감정을 전달하는 매개체라고 믿습니다.
            </p>
            <p>
              AI 생성 미디어아트를 통해 빛의 새로운 가능성을 탐구하며, LED 디스플레이를 위한 프리미엄 콘텐츠 라이브러리를 제공합니다.
            </p>
            <p className="text-[#D4AF37] text-2xl font-display mt-12">
              빛으로 공간의 정체성을 완성합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#D4AF37]/30 bg-black">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-display text-2xl mb-4 text-[#D4AF37]">LUMOS</h3>
              <p className="text-sm text-gray-400">
                LED 디스플레이 전용
                <br />
                AI 생성 미디어아트 라이브러리
              </p>
            </div>
            <div>
              <h4 className="text-accent text-sm uppercase tracking-wider mb-4">Worlds</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/standard" className="hover:text-[#D4AF37] transition-colors">
                    STANDARD - 프리미엄 미디어아트
                  </a>
                </li>
                <li>
                  <a href="/local" className="hover:text-white transition-colors">
                    LOCAL - 상업용 콘텐츠
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-accent text-sm uppercase tracking-wider mb-4">Contact</h4>
              <p className="text-sm text-gray-400">
                © 2026 LUMOS
                <br />
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
