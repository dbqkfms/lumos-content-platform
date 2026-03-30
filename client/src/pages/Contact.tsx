// Contact — 문의 풀페이지 (2컬럼 레이아웃)
import React, { useState } from "react";
import Header from "@/components/Header";
import { useArtworks } from "@/contexts/ArtworkContext";

const SPACE_TYPES = [
  { value: "", label: "공간 유형 선택" },
  { value: "hotel", label: "호텔 & 리조트" },
  { value: "retail", label: "리테일" },
  { value: "fnb", label: "F&B (카페, 레스토랑)" },
  { value: "office", label: "오피스" },
  { value: "public", label: "퍼블릭" },
  { value: "gallery", label: "갤러리 & 뮤지엄" },
  { value: "other", label: "기타" },
];

export default function Contact() {
  const { addInquiry } = useArtworks();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    spaceType: "",
    artworkInterest: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ArtworkContext에 문의 추가
    addInquiry({
      buyerName: form.name,
      buyerEmail: form.email,
      buyerCompany: form.name,
      spaceType: form.spaceType || undefined,
      artworkTitle: form.artworkInterest || undefined,
      message: form.message,
      status: "new",
    });
    setSubmitted(true);
  };

  const inputClass =
    "w-full bg-[#1a1a1a] border border-white/10 px-4 py-3 text-[#f5f5f5] text-sm focus:border-[#D4A843] focus:outline-none";
  const labelClass =
    "font-accent text-[10px] tracking-[0.4em] uppercase text-[#909090] block mb-2";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* 좌측: 연락처 정보 */}
          <div className="lg:col-span-2">
            <div className="font-accent text-[10px] tracking-[0.6em] uppercase text-[#D4A843] mb-3">
              Contact
            </div>
            <h1 className="font-display text-4xl text-[#f5f5f5] mb-4">
              Get in Touch
            </h1>
            <p className="text-[#909090] text-sm leading-relaxed mb-10">
              공간에 맞는 미디어아트 콘텐츠를 찾고 계신가요? 문의를
              남겨주시면 맞춤형 제안을 드리겠습니다.
            </p>

            <div className="space-y-8">
              <div>
                <div className="font-accent text-[10px] tracking-[0.4em] uppercase text-[#D4A843] mb-2">
                  Email
                </div>
                <div className="text-[#f5f5f5] text-sm">
                  contact@lumos.art
                </div>
              </div>
              <div>
                <div className="font-accent text-[10px] tracking-[0.4em] uppercase text-[#D4A843] mb-2">
                  Location
                </div>
                <div className="text-[#f5f5f5] text-sm">Seoul, Korea</div>
              </div>
              <div>
                <div className="font-accent text-[10px] tracking-[0.4em] uppercase text-[#D4A843] mb-2">
                  Response Time
                </div>
                <div className="text-[#f5f5f5] text-sm">
                  2 영업일 이내
                </div>
              </div>
            </div>
          </div>

          {/* 우측: 폼 */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="border border-emerald-900/30 bg-emerald-900/10 p-8 text-center">
                <div className="text-emerald-400 text-3xl mb-3">
                  &#10003;
                </div>
                <div className="font-display text-xl text-[#f5f5f5] mb-2">
                  문의가 접수되었습니다
                </div>
                <div className="text-[#909090] text-sm">
                  담당자가 확인 후 이메일로 연락드리겠습니다.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 이름 / 이메일 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Name / Company *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="홍길동 / 회사명"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* 전화 / 공간 유형 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="010-0000-0000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Space Type</label>
                    <select
                      name="spaceType"
                      value={form.spaceType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {SPACE_TYPES.map(t => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 관심 작품 */}
                <div>
                  <label className={labelClass}>
                    Artwork of Interest
                  </label>
                  <input
                    name="artworkInterest"
                    value={form.artworkInterest}
                    onChange={handleChange}
                    placeholder="관심 있는 작품명이나 카테고리 (선택사항)"
                    className={inputClass}
                  />
                </div>

                {/* 메시지 */}
                <div>
                  <label className={labelClass}>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    className={`${inputClass} resize-none`}
                    placeholder="설치 공간, 원하는 분위기, 디스플레이 크기 등 자유롭게 작성해주세요."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#D4A843] text-black font-accent text-[10px] tracking-[0.3em] uppercase px-10 py-3 hover:bg-[#F0C060] transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
