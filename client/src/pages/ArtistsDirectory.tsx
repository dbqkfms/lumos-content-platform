// ArtistsDirectory — 아티스트 디렉토리
import React from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import { MOCK_USERS, MOCK_PORTAL_ARTWORKS } from "@/data/mockData";

export default function ArtistsDirectory() {
  const artists = MOCK_USERS.filter(u => u.role === "artist");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="font-accent text-[10px] tracking-[0.6em] uppercase text-[#D4A843] mb-3">
            Artists
          </div>
          <h1 className="font-display text-4xl text-[#f5f5f5] mb-4">
            아티스트 디렉토리
          </h1>
          <p className="text-[#909090] text-sm">
            LUMOS와 함께하는 미디어아트 아티스트를 소개합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map(artist => {
            const works = MOCK_PORTAL_ARTWORKS.filter(
              a => a.artistId === artist.id && a.status === "published"
            );
            return (
              <div
                key={artist.id}
                className="border border-white/5 hover:border-white/15 transition-colors p-6 group"
              >
                {/* 아바타 */}
                <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center mb-4">
                  <span className="font-display text-xl text-[#D4A843]">
                    {artist.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-display text-lg text-[#f5f5f5] mb-1">
                  {artist.name}
                </h3>
                {artist.bio && (
                  <p className="text-[#909090] text-sm mb-3 line-clamp-2">
                    {artist.bio}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-[#909090]">
                    {works.length} published works
                  </span>
                  {artist.portfolio && (
                    <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-[#D4A843]">
                      Portfolio →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Apply CTA */}
        <div className="mt-16 border border-white/5 p-8 text-center">
          <div className="font-accent text-[10px] tracking-[0.6em] uppercase text-[#D4A843] mb-3">
            Join Us
          </div>
          <h2 className="font-display text-2xl text-[#f5f5f5] mb-4">
            LUMOS 아티스트로 참여하세요
          </h2>
          <p className="text-[#909090] text-sm mb-6 max-w-lg mx-auto">
            LED/디지털 디스플레이를 위한 미디어아트를 제작하는 아티스트라면
            누구나 지원할 수 있습니다.
          </p>
          <Link to="/contact">
            <span className="inline-block bg-[#D4A843] text-black font-accent text-[10px] tracking-[0.3em] uppercase px-10 py-3 hover:bg-[#F0C060] transition-colors cursor-pointer">
              Apply Now
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
