/*
  Design Philosophy: Luminous Brutalism - STANDARD World
  - Gallery: Masonry 레이아웃 (높이 불규칙, 리듬감)
  - Color: 블랙 배경 + 골드 액센트
  - Interaction: Heavy but Responsive
*/

import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";

const artworks = [
  {
    id: 1,
    title: "Cosmic Flow",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/91290999/zOmNxqqARpBQjmzb.png",
    description: "우주의 에너지가 흐르는 추상적 시각화",
    category: "Abstract",
  },
  {
    id: 2,
    title: "Liquid Emotion",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/91290999/galQiSmNivdrmiSe.png",
    description: "감정의 흐름을 표현한 유동적 형태",
    category: "Abstract",
  },
  {
    id: 3,
    title: "Material Essence",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/91290999/cAJHwHFjELrsYPio.png",
    description: "물질의 본질을 탐구하는 텍스처",
    category: "Material",
  },
  {
    id: 4,
    title: "Light Geometry",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/91290999/QHNOEFpJsHoByPLr.png",
    description: "빛과 그림자의 기하학적 패턴",
    category: "Light",
  },
  {
    id: 5,
    title: "Sacred Patterns",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/91290999/NCCsfGDIUABqfQgW.png",
    description: "신성한 기하학 패턴의 변주",
    category: "Pattern",
  },
];

export default function StandardWorld() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  const categories = ["All", "Abstract", "Cosmic", "Material", "Light", "Pattern"];
  
  const filteredArtworks = activeCategory === "All" 
    ? artworks 
    : artworks.filter(art => art.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/91290999/CsCdnLUHaWwRzGSO.png"
            alt="STANDARD World"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-8">
          <h2 className="text-display text-5xl md:text-7xl mb-6">
            프리미엄 미디어아트
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-4">
            빛으로 완성하는 공간의 정체성
          </p>
          <p className="text-base text-gray-400">
            랜드마크, 파사드, 갤러리를 위한 예술적 콘텐츠. 변주와 변화를 통해 공간에 생명을 불어넣습니다.
          </p>
        </div>
      </section>

      {/* Glowing Divider */}
      <div className="glow-divider" />

      {/* Gallery Section - Masonry Layout */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-display text-3xl md:text-4xl mb-2">Gallery</h3>
                <p className="text-gray-400">
                  AI 생성 미디어아트 컬렉션. 각 작품은 무한한 변주가 가능합니다.
                </p>
              </div>
              <button
                onClick={() => setLocation("/local")}
                className="text-accent text-sm uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              >
                Switch to LOCAL →
              </button>
            </div>
            
            {/* Category Filter Tabs */}
            <div className="flex gap-6 pb-4 border-b border-[#D4AF37]/30">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-accent text-sm uppercase tracking-wider transition-colors pb-2 ${
                    activeCategory === cat
                      ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                className={`group relative overflow-hidden light-trail ${
                  index % 3 === 0 ? "md:row-span-2" : ""
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-black/90 backdrop-blur-sm p-4 border border-[#D4AF37]/30">
                    <span className="text-accent text-xs uppercase tracking-wider text-[#D4AF37]">
                      {artwork.category}
                    </span>
                    <h4 className="text-display text-xl mt-2 mb-2">
                      {artwork.title}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {artwork.description}
                    </p>
                  </div>
                </div>

                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 border border-[#D4AF37] glow-gold-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-black to-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-display text-3xl md:text-4xl mb-12 text-center">
            STANDARD Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-[#D4AF37]/30 light-trail">
              <h4 className="text-accent text-lg uppercase tracking-wider mb-4 text-[#D4AF37]">
                Infinite Variation
              </h4>
              <p className="text-gray-400">
                AI 생성 기술로 무한한 변주 가능. 같은 콘텐츠도 매번 다른 느낌으로.
              </p>
            </div>

            <div className="p-8 border border-[#D4AF37]/30 light-trail">
              <h4 className="text-accent text-lg uppercase tracking-wider mb-4 text-[#D4AF37]">
                Premium Quality
              </h4>
              <p className="text-gray-400">
                8K 해상도 지원. LED 디스플레이 최적화. 갤러리 수준의 예술적 완성도.
              </p>
            </div>

            <div className="p-8 border border-[#D4AF37]/30 light-trail">
              <h4 className="text-accent text-lg uppercase tracking-wider mb-4 text-[#D4AF37]">
                Customizable
              </h4>
              <p className="text-gray-400">
                공간과 브랜드에 맞춘 커스터마이징. 색상, 속도, 패턴 조절 가능.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-display text-4xl md:text-5xl mb-6">
            빛으로 공간을 재정의하세요
          </h3>
          <p className="text-lg text-gray-400 mb-8">
            STANDARD 컬렉션으로 당신의 공간에 예술적 정체성을 부여하세요.
          </p>
          <button className="btn-brutalist text-lg px-8 py-4">
            Contact Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/30 bg-black">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-display text-2xl mb-4 text-[#D4AF37]">LUMOS</h3>
              <p className="text-sm text-gray-400">
                LED 디스플레이 전용<br />
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
                © 2026 LUMOS<br />
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
