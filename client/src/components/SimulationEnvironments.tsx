/**
 * 설치 시뮬레이션 환경 목업 + 자동 매칭 엔진
 * 15개 환경 × 자동 작품 매칭
 */

import type { ReactElement } from "react";
import type { Artwork } from "@/contexts/MarketplaceContext";

// ─── 환경 정의 ──────────────────────────────────────────────────────────────

export interface Environment {
  id: string;
  label: string;
  desc: string;
  // 매칭용 메타데이터
  mood: string[];       // 분위기: luxury, calm, modern, traditional, artistic, energetic
  spaceType: string[];  // 공간 종류: hotel, cafe, gallery, office, restaurant, retail, spa, museum, outdoor, residential
  bestFor: string[];    // 어울리는 작품 카테고리
  worldAffinity: "standard" | "local" | "both";
}

export const ENVIRONMENTS: Environment[] = [
  // ─── 프리미엄 공간 ────────────────────────────────────────────────
  {
    id: "hotel-lobby",
    label: "5성급 호텔 로비",
    desc: "GRAND HOTEL LOBBY",
    mood: ["luxury", "calm"],
    spaceType: ["hotel"],
    bestFor: ["Abstract", "Cosmic", "Light", "Oriental"],
    worldAffinity: "standard",
  },
  {
    id: "hotel-suite",
    label: "호텔 스위트룸",
    desc: "LUXURY SUITE",
    mood: ["luxury", "calm"],
    spaceType: ["hotel", "residential"],
    bestFor: ["Nature", "Oriental", "Abstract", "Light"],
    worldAffinity: "both",
  },
  {
    id: "gallery-white",
    label: "갤러리 화이트큐브",
    desc: "WHITE CUBE GALLERY",
    mood: ["artistic", "modern"],
    spaceType: ["gallery", "museum"],
    bestFor: ["Abstract", "Cosmic", "Pattern", "Material"],
    worldAffinity: "standard",
  },
  {
    id: "museum-hall",
    label: "뮤지엄 메인홀",
    desc: "MUSEUM MAIN HALL",
    mood: ["artistic", "luxury"],
    spaceType: ["museum", "gallery"],
    bestFor: ["Oriental", "Nature", "Abstract", "Cosmic"],
    worldAffinity: "standard",
  },
  {
    id: "corporate-atrium",
    label: "기업 본사 아트리움",
    desc: "CORPORATE HQ ATRIUM",
    mood: ["modern", "energetic"],
    spaceType: ["office"],
    bestFor: ["Abstract", "Pattern", "Light", "Cosmic"],
    worldAffinity: "standard",
  },
  // ─── 상업 공간 ────────────────────────────────────────────────────
  {
    id: "cafe-interior",
    label: "프리미엄 카페",
    desc: "PREMIUM CAFÉ",
    mood: ["calm", "modern"],
    spaceType: ["cafe"],
    bestFor: ["Nature", "Traditional", "Oriental", "Still Life"],
    worldAffinity: "local",
  },
  {
    id: "restaurant-dining",
    label: "파인다이닝 레스토랑",
    desc: "FINE DINING RESTAURANT",
    mood: ["luxury", "calm"],
    spaceType: ["restaurant"],
    bestFor: ["Nature", "Oriental", "Abstract", "Light"],
    worldAffinity: "both",
  },
  {
    id: "bar-lounge",
    label: "루프탑 바 라운지",
    desc: "ROOFTOP BAR LOUNGE",
    mood: ["luxury", "energetic"],
    spaceType: ["restaurant", "hotel"],
    bestFor: ["Cosmic", "Abstract", "Light", "Pattern"],
    worldAffinity: "standard",
  },
  {
    id: "retail-flagship",
    label: "플래그십 매장",
    desc: "FLAGSHIP RETAIL STORE",
    mood: ["modern", "energetic"],
    spaceType: ["retail"],
    bestFor: ["Abstract", "Pattern", "Light", "Material"],
    worldAffinity: "standard",
  },
  {
    id: "spa-wellness",
    label: "스파 & 웰니스",
    desc: "SPA & WELLNESS CENTER",
    mood: ["calm", "traditional"],
    spaceType: ["spa"],
    bestFor: ["Nature", "Oriental", "Traditional", "Seasonal"],
    worldAffinity: "local",
  },
  // ─── 외부/특수 공간 ────────────────────────────────────────────────
  {
    id: "outdoor-facade",
    label: "건물 외벽 야경",
    desc: "BUILDING FACADE — NIGHT",
    mood: ["energetic", "modern"],
    spaceType: ["outdoor"],
    bestFor: ["Abstract", "Cosmic", "Light", "Pattern"],
    worldAffinity: "standard",
  },
  {
    id: "outdoor-plaza",
    label: "광장 미디어 타워",
    desc: "PLAZA MEDIA TOWER",
    mood: ["energetic", "modern"],
    spaceType: ["outdoor"],
    bestFor: ["Abstract", "Cosmic", "Light"],
    worldAffinity: "standard",
  },
  // ─── 한국 전통 공간 ───────────────────────────────────────────────
  {
    id: "hanok-tearoom",
    label: "한옥 찻집",
    desc: "HANOK TEA HOUSE",
    mood: ["traditional", "calm"],
    spaceType: ["cafe", "restaurant"],
    bestFor: ["Traditional", "Oriental", "Nature", "Seasonal"],
    worldAffinity: "local",
  },
  {
    id: "temple-meditation",
    label: "사찰 명상실",
    desc: "TEMPLE MEDITATION ROOM",
    mood: ["traditional", "calm"],
    spaceType: ["spa", "museum"],
    bestFor: ["Oriental", "Traditional", "Nature"],
    worldAffinity: "local",
  },
  {
    id: "residential-living",
    label: "고급 주거 거실",
    desc: "LUXURY RESIDENCE",
    mood: ["calm", "modern"],
    spaceType: ["residential"],
    bestFor: ["Nature", "Abstract", "Oriental", "Light"],
    worldAffinity: "both",
  },
];

// ─── 매칭 엔진 ──────────────────────────────────────────────────────────────

interface MatchResult {
  env: Environment;
  score: number;
  reasons: string[];
}

export function matchArtworkToEnvironments(artwork: Artwork): MatchResult[] {
  const isStandard = artwork.id.startsWith("standard-") || artwork.id.startsWith("gen-");
  const worldType = (artwork as any).worldType as string | undefined;
  const artWorld = worldType || (isStandard ? "standard" : "local");
  const tags = ((artwork as any).tags as string[] | undefined) || [];
  const category = artwork.category;

  return ENVIRONMENTS.map(env => {
    let score = 0;
    const reasons: string[] = [];

    // 1. 카테고리 매칭 (최대 40점)
    if (env.bestFor.includes(category)) {
      const idx = env.bestFor.indexOf(category);
      const catScore = 40 - idx * 8; // 첫 번째=40, 두 번째=32, ...
      score += catScore;
      reasons.push(`카테고리 적합`);
    }

    // 2. 월드 매칭 (최대 25점)
    if (env.worldAffinity === "both") {
      score += 15;
    } else if (env.worldAffinity === artWorld) {
      score += 25;
      reasons.push(`${artWorld === "standard" ? "프리미엄" : "커머셜"} 공간`);
    }

    // 3. 태그-분위기 매칭 (최대 20점)
    const moodTagMap: Record<string, string[]> = {
      luxury: ["luxury", "crystal", "nebula", "gold", "cosmic"],
      calm: ["zen", "nature", "garden", "moon", "peaceful", "bamboo", "tea", "ink"],
      modern: ["abstract", "geometric", "digital", "wave", "minimal", "light"],
      traditional: ["traditional", "hanok", "Korean", "oriental", "calligraphy", "ink"],
      artistic: ["fractal", "organic", "pattern", "material"],
      energetic: ["space", "gravity", "sound", "light", "cosmic"],
    };

    let moodScore = 0;
    for (const mood of env.mood) {
      const relatedTags = moodTagMap[mood] || [];
      for (const tag of tags) {
        const normalizedTag = tag.replace("#", "").toLowerCase();
        if (relatedTags.some(rt => normalizedTag.includes(rt) || rt.includes(normalizedTag))) {
          moodScore += 5;
        }
      }
    }
    score += Math.min(moodScore, 20);
    if (moodScore > 0) reasons.push(`분위기 일치`);

    // 4. 특수 매칭 보너스 (최대 15점)
    // Oriental 작품 → 한옥/사찰
    if (category === "Oriental" && ["hanok-tearoom", "temple-meditation"].includes(env.id)) {
      score += 15;
      reasons.push(`전통 공간 특별 매칭`);
    }
    // Cosmic → 야경/외벽
    if (category === "Cosmic" && env.id.startsWith("outdoor")) {
      score += 10;
      reasons.push(`야경 매칭`);
    }
    // Nature → 스파/카페
    if (category === "Nature" && ["spa-wellness", "cafe-interior"].includes(env.id)) {
      score += 10;
      reasons.push(`자연 공간 매칭`);
    }

    return { env, score, reasons };
  })
    .sort((a, b) => b.score - a.score);
}

// ─── SVG 씬 렌더러 ──────────────────────────────────────────────────────────

interface ScreenRect {
  x: number; y: number; w: number; h: number;
  fx: number; fy: number; fw: number; fh: number;
}

function getScreenRect(envId: string, isVertical: boolean): { scr: ScreenRect; floorY: number } {
  if (isVertical) {
    return {
      scr: { x: 290, y: 30, w: 220, h: 340, fx: 296, fy: 36, fw: 208, fh: 328 },
      floorY: 390,
    };
  }
  return {
    scr: { x: 150, y: 90, w: 500, h: 250, fx: 156, fy: 96, fw: 488, fh: 238 },
    floorY: 360,
  };
}

// 각 환경의 배경 SVG 요소를 렌더링하는 함수
export function renderEnvironmentBg(
  envId: string,
  accentColor: string,
  floorY: number,
  scr: ScreenRect,
  isHovered: boolean,
  uid: string, // 고유 ID (gradient 충돌 방지)
): ReactElement {
  const glowIntensity = isHovered ? 0.3 : 0.12;
  const reflectIntensity = isHovered ? 0.7 : 0.35;

  // 공통 defs
  const commonDefs = (
    <>
      <linearGradient id={`f${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
      <radialGradient id={`g${uid}`} cx="50%" cy="42%" r="55%">
        <stop offset="0%" stopColor={accentColor} stopOpacity={glowIntensity} />
        <stop offset="60%" stopColor={accentColor} stopOpacity={glowIntensity * 0.3} />
        <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`r${uid}`} x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor={accentColor} stopOpacity={reflectIntensity * 0.4} />
        <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
      </linearGradient>
    </>
  );

  switch (envId) {
    case "hotel-lobby":
      return (
        <>
          <defs>{commonDefs}</defs>
          <rect width="800" height="450" fill="#0d0d0d" />
          <rect x="0" y="0" width="800" height="3" fill="#1a1a1a" />
          <line x1="400" y1="4" x2="400" y2="30" stroke="#222" strokeWidth="1" />
          <ellipse cx="400" cy="36" rx="35" ry="8" fill="none" stroke="#222" strokeWidth="1.5" />
          {[-28, -14, 0, 14, 28].map((dx, i) => (
            <g key={i}><line x1={400 + dx} y1="44" x2={400 + dx} y2={52 + (i % 2) * 6} stroke={accentColor} strokeWidth="0.5" opacity="0.3" />
              <circle cx={400 + dx} cy={54 + (i % 2) * 6} r="2" fill={accentColor} opacity={0.15} className="sim-chandelier" style={{ animationDelay: `${i * 0.4}s` }} /></g>
          ))}
          <rect x="55" y="60" width="30" height="300" fill="#161616" />
          <rect x="715" y="60" width="30" height="300" fill="#161616" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#f${uid})`} />
          <rect x="0" y={floorY - 2} width="800" height="2" fill={accentColor} opacity="0.12" />
        </>
      );

    case "hotel-suite":
      return (
        <>
          <defs>{commonDefs}</defs>
          <rect width="800" height="450" fill="#0e0e0e" />
          {/* 베드 헤드보드 */}
          <rect x="0" y="280" width="140" height="80" fill="#141414" rx="2" />
          <rect x="0" y="272" width="145" height="12" fill="#181818" />
          {/* 사이드 테이블 */}
          <rect x="660" y="310" width="60" height="50" fill="#131313" />
          <rect x="658" y="306" width="64" height="6" fill="#171717" />
          {/* 테이블 램프 */}
          <line x1="690" y1="280" x2="690" y2="305" stroke="#1a1a1a" strokeWidth="2" />
          <ellipse cx="690" cy="278" rx="12" ry="8" fill={accentColor} opacity="0.06" />
          <circle cx="690" cy="275" r="3" fill={accentColor} opacity="0.15" className="sim-chandelier" />
          {/* 커튼 */}
          <rect x="750" y="0" width="50" height="380" fill="#111" opacity="0.5" />
          <line x1="752" y1="0" x2="752" y2="380" stroke="#1a1a1a" strokeWidth="1" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#f${uid})`} />
          <rect x="0" y={floorY - 2} width="800" height="2" fill={accentColor} opacity="0.08" />
        </>
      );

    case "gallery-white":
      return (
        <>
          <defs>{commonDefs}
            <linearGradient id={`gw${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c1c1c" />
              <stop offset="100%" stopColor="#141414" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="#151515" />
          {/* 트랙 조명 */}
          <rect x="60" y="8" width="680" height="2" fill="#1a1a1a" />
          {[scr.x + scr.w / 4, scr.x + scr.w / 2, scr.x + (scr.w * 3) / 4].map((lx, i) => (
            <g key={i}>
              <rect x={lx - 3} y="10" width="6" height="18" fill="#181818" />
              <line x1={lx} y1="28" x2={lx} y2={scr.y - 10} stroke={accentColor} strokeWidth="0.3" opacity="0.15" />
              <circle cx={lx} cy="30" r="2" fill={accentColor} opacity="0.2" className="sim-chandelier" style={{ animationDelay: `${i * 0.5}s` }} />
            </g>
          ))}
          {/* 벤치 */}
          <rect x="320" y={floorY - 15} width="160" height="12" fill="#1a1a1a" />
          <rect x="340" y={floorY - 3} width="10" height="15" fill="#181818" />
          <rect x="450" y={floorY - 3} width="10" height="15" fill="#181818" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#gw${uid})`} />
          <rect x="0" y={floorY - 1} width="800" height="1" fill="#222" />
        </>
      );

    case "museum-hall":
      return (
        <>
          <defs>{commonDefs}</defs>
          <rect width="800" height="450" fill="#0c0c0c" />
          {/* 아치 천장 */}
          <path d="M 0 80 Q 400 -20 800 80" fill="none" stroke="#1a1a1a" strokeWidth="2" />
          <path d="M 0 85 Q 400 -15 800 85" fill="none" stroke="#151515" strokeWidth="1" />
          {/* 좌우 기둥 (원형) */}
          <ellipse cx="70" cy="380" rx="20" ry="6" fill="#141414" />
          <rect x="55" y="80" width="30" height="300" fill="#131313" rx="15" />
          <ellipse cx="730" cy="380" rx="20" ry="6" fill="#141414" />
          <rect x="715" y="80" width="30" height="300" fill="#131313" rx="15" />
          {/* 스포트라이트 */}
          <circle cx={scr.x + scr.w / 2} cy="20" r="4" fill={accentColor} opacity="0.1" className="sim-chandelier" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#f${uid})`} />
          <rect x="0" y={floorY - 2} width="800" height="2" fill={accentColor} opacity="0.06" />
        </>
      );

    case "corporate-atrium":
      return (
        <>
          <defs>{commonDefs}</defs>
          <rect width="800" height="450" fill="#0d0d0d" />
          <rect x="100" y="10" width="600" height="2" fill="#1a1a1a" />
          {[200, 350, 500, 650].map((lx, i) => (
            <g key={i}><rect x={lx - 4} y="12" width="8" height="12" fill="#181818" />
              <circle cx={lx} cy="28" r="2" fill={accentColor} opacity="0.15" className="sim-chandelier" style={{ animationDelay: `${i * 0.5}s` }} /></g>
          ))}
          <line x1="40" y1="0" x2="40" y2="450" stroke="white" strokeWidth="0.5" opacity="0.03" />
          <line x1="760" y1="0" x2="760" y2="450" stroke="white" strokeWidth="0.5" opacity="0.03" />
          <rect x="580" y="340" width="160" height="30" fill="#141414" />
          <rect x="0" y={floorY + 15} width="800" height={75} fill={`url(#f${uid})`} />
          <rect x="0" y={floorY + 13} width="800" height="2" fill={accentColor} opacity="0.08" />
        </>
      );

    case "cafe-interior":
      return (
        <>
          <defs>{commonDefs}
            <linearGradient id={`cf${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1610" />
              <stop offset="100%" stopColor="#0f0d0a" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="#12100d" />
          {/* 펜던트 조명 */}
          {[250, 550].map((lx, i) => (
            <g key={i}>
              <line x1={lx} y1="0" x2={lx} y2="50" stroke="#1a1a1a" strokeWidth="1" />
              <ellipse cx={lx} cy="55" rx="18" ry="10" fill="#181510" stroke="#2a2520" strokeWidth="0.5" />
              <circle cx={lx} cy="52" r="3" fill="#e8c170" opacity="0.15" className="sim-chandelier" style={{ animationDelay: `${i}s` }} />
            </g>
          ))}
          {/* 나무 선반 */}
          <rect x="0" y="200" width="100" height="4" fill="#2a2015" />
          <rect x="700" y="180" width="100" height="4" fill="#2a2015" />
          {/* 테이블 */}
          <circle cx="120" cy={floorY + 5} r="35" fill="#1a1510" opacity="0.8" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#cf${uid})`} />
        </>
      );

    case "restaurant-dining":
      return (
        <>
          <defs>{commonDefs}</defs>
          <rect width="800" height="450" fill="#0d0b08" />
          {/* 테이블 세팅 */}
          <rect x="200" y={floorY - 20} width="400" height="3" fill="#1a1815" />
          <rect x="280" y={floorY - 17} width="8" height="30" fill="#151310" />
          <rect x="510" y={floorY - 17} width="8" height="30" fill="#151310" />
          {/* 캔들 */}
          <rect x="395" y={floorY - 35} width="10" height="15" fill="#1a1815" />
          <circle cx="400" cy={floorY - 38} r="3" fill={accentColor} opacity="0.2" className="sim-chandelier" />
          {/* 와인 글라스 실루엣 */}
          <line x1="350" y1={floorY - 30} x2="350" y2={floorY - 20} stroke="#1a1815" strokeWidth="1.5" />
          <ellipse cx="350" cy={floorY - 33} rx="6" ry="8" fill="none" stroke="#1a1815" strokeWidth="1" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#f${uid})`} />
          <rect x="0" y={floorY - 2} width="800" height="2" fill={accentColor} opacity="0.06" />
        </>
      );

    case "bar-lounge":
      return (
        <>
          <defs>{commonDefs}
            <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#080a14" />
              <stop offset="100%" stopColor="#0d0d10" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill={`url(#sky${uid})`} />
          {/* 도시 스카이라인 (먼 배경) */}
          <rect x="600" y="5" width="30" height="50" fill="#0a0a10" opacity="0.5" />
          <rect x="640" y="15" width="20" height="40" fill="#0a0a10" opacity="0.4" />
          <rect x="670" y="8" width="15" height="47" fill="#0a0a10" opacity="0.3" />
          {/* 유리 난간 */}
          <line x1="0" y1={floorY - 30} x2="150" y2={floorY - 30} stroke="white" strokeWidth="0.5" opacity="0.1" />
          <line x1="650" y1={floorY - 30} x2="800" y2={floorY - 30} stroke="white" strokeWidth="0.5" opacity="0.1" />
          {/* 바 카운터 */}
          <rect x="620" y={floorY - 50} width="180" height="55" fill="#111015" />
          <rect x="618" y={floorY - 54} width="184" height="6" fill="#151318" />
          {/* 별 */}
          {[100, 200, 320, 500, 720].map((sx, i) => (
            <circle key={i} cx={sx} cy={8 + i * 4} r={0.8} fill="white" opacity={0.3 + i * 0.1} />
          ))}
          <rect x="0" y={floorY} width="800" height={90} fill="#0a0a0f" />
        </>
      );

    case "retail-flagship":
      return (
        <>
          <defs>{commonDefs}</defs>
          <rect width="800" height="450" fill="#0e0e0e" />
          {/* LED 스트립 천장 */}
          <rect x="0" y="5" width="800" height="1" fill={accentColor} opacity="0.1" />
          {/* 제품 디스플레이 선반 */}
          <rect x="0" y="200" width="120" height="3" fill="#1a1a1a" />
          <rect x="20" y="180" width="20" height="20" fill="#141414" />
          <rect x="60" y="175" width="25" height="25" fill="#141414" />
          <rect x="680" y="220" width="120" height="3" fill="#1a1a1a" />
          {/* 마네킹 실루엣 */}
          <circle cx="720" cy="180" r="10" fill="#131313" />
          <rect x="714" y="190" width="12" height="30" fill="#131313" rx="4" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#f${uid})`} />
          <rect x="0" y={floorY - 1} width="800" height="1" fill={accentColor} opacity="0.06" />
        </>
      );

    case "spa-wellness":
      return (
        <>
          <defs>{commonDefs}
            <linearGradient id={`sp${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d100d" />
              <stop offset="100%" stopColor="#0a0d0a" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="#0c0e0c" />
          {/* 대나무 */}
          {[30, 50, 740, 760].map((bx, i) => (
            <line key={i} x1={bx} y1={floorY} x2={bx + (i % 2) * 3} y2="20" stroke="#1a2a1a" strokeWidth={2} opacity={0.4} />
          ))}
          {/* 돌 */}
          <ellipse cx="100" cy={floorY + 5} rx="30" ry="10" fill="#161816" />
          <ellipse cx="680" cy={floorY + 8} rx="25" ry="8" fill="#161816" />
          {/* 수반 */}
          <ellipse cx="400" cy={floorY + 15} rx="80" ry="8" fill="#0a0f0a" stroke="#1a2a1a" strokeWidth="0.5" opacity="0.5" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#sp${uid})`} />
        </>
      );

    case "outdoor-facade":
      return (
        <>
          <defs>{commonDefs}
            <linearGradient id={`nsky${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#05080f" />
              <stop offset="100%" stopColor="#0d0d0d" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill={`url(#nsky${uid})`} />
          {/* 별 */}
          {[80, 180, 350, 500, 650, 720].map((sx, i) => (
            <circle key={i} cx={sx} cy={15 + (i * 23) % 60} r={0.6 + (i % 3) * 0.3} fill="white" opacity={0.2 + (i % 4) * 0.12} className="sim-star" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
          {/* 좌측 건물 */}
          <rect x="0" y="180" width="90" height="270" fill="#0a0a0a" stroke="#151515" strokeWidth="1" />
          {[200, 240, 280].map((wy, i) => (
            <g key={i}><rect x="10" y={wy} width="15" height="20" fill="#111" opacity={0.3 + i * 0.1} />
              <rect x="35" y={wy} width="15" height="20" fill="#111" opacity={0.2 + i * 0.15} /></g>
          ))}
          <rect x="720" y="220" width="80" height="230" fill="#0a0a0a" stroke="#151515" strokeWidth="1" />
          {/* 메인 건물 벽면 */}
          <rect x="100" y="50" width="600" height={floorY - 50} fill="#0b0b0b" stroke="#161616" strokeWidth="1" />
          {/* 가로등 */}
          <line x1="130" y1={floorY - 80} x2="130" y2={floorY + 10} stroke="#1a1a1a" strokeWidth="3" />
          <circle cx="130" cy={floorY - 85} r="5" fill={accentColor} opacity="0.15" className="sim-chandelier" />
          <line x1="670" y1={floorY - 80} x2="670" y2={floorY + 10} stroke="#1a1a1a" strokeWidth="3" />
          <circle cx="670" cy={floorY - 85} r="5" fill={accentColor} opacity="0.15" className="sim-chandelier" />
          <rect x="0" y={floorY + 10} width="800" height={80} fill="#050505" />
          <rect x="0" y={floorY + 8} width="800" height="3" fill={accentColor} opacity="0.15" />
        </>
      );

    case "outdoor-plaza":
      return (
        <>
          <defs>{commonDefs}
            <linearGradient id={`psky${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#060810" />
              <stop offset="100%" stopColor="#0a0a0e" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill={`url(#psky${uid})`} />
          {/* 미디어 타워 구조물 */}
          <rect x={scr.x - 20} y="20" width={scr.w + 40} height={floorY - 10} fill="#0a0a0c" stroke="#1a1a20" strokeWidth="1" />
          {/* 원형 광장 바닥 */}
          <ellipse cx="400" cy={floorY + 30} rx="350" ry="40" fill="#0c0c10" stroke="#151520" strokeWidth="0.5" />
          {/* 조명 */}
          <circle cx="150" cy={floorY - 10} r="4" fill={accentColor} opacity="0.1" className="sim-chandelier" />
          <circle cx="650" cy={floorY - 10} r="4" fill={accentColor} opacity="0.1" className="sim-chandelier" />
          <rect x="0" y={floorY + 10} width="800" height={80} fill="#060608" />
        </>
      );

    case "hanok-tearoom":
      return (
        <>
          <defs>{commonDefs}
            <linearGradient id={`hf${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1510" />
              <stop offset="100%" stopColor="#0f0d0a" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="#110f0c" />
          {/* 서까래 */}
          {[100, 250, 400, 550, 700].map((rx, i) => (
            <line key={i} x1={rx - 20} y1="8" x2={rx + 20} y2="15" stroke="#2a2015" strokeWidth="3" opacity="0.6" />
          ))}
          {/* 처마 */}
          <line x1="0" y1="18" x2="800" y2="18" stroke="#2a2015" strokeWidth="3" />
          {/* 좌측 창호 */}
          <rect x="0" y="25" width="120" height={floorY - 25} fill="#181410" stroke="#2a2015" strokeWidth="1" />
          <line x1="60" y1="25" x2="60" y2={floorY} stroke="#2a2015" strokeWidth="0.5" />
          {[80, 140, 200, 260].map((gy, i) => (
            <line key={i} x1="0" y1={gy} x2="120" y2={gy} stroke="#2a2015" strokeWidth="0.5" />
          ))}
          {/* 우측 창호 */}
          <rect x="680" y="25" width="120" height={floorY - 25} fill="#181410" stroke="#2a2015" strokeWidth="1" />
          <line x1="740" y1="25" x2="740" y2={floorY} stroke="#2a2015" strokeWidth="0.5" />
          {/* 좌석 방석 */}
          <ellipse cx="200" cy={floorY - 5} rx="25" ry="6" fill="#2a2520" opacity="0.6" />
          <ellipse cx="600" cy={floorY - 5} rx="25" ry="6" fill="#2a2520" opacity="0.6" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#hf${uid})`} />
        </>
      );

    case "temple-meditation":
      return (
        <>
          <defs>{commonDefs}</defs>
          <rect width="800" height="450" fill="#0c0a08" />
          {/* 단청 패턴 (상단) */}
          <rect x="0" y="0" width="800" height="5" fill="#8B0000" opacity="0.15" />
          <rect x="0" y="5" width="800" height="3" fill="#006400" opacity="0.1" />
          <rect x="0" y="8" width="800" height="2" fill="#DAA520" opacity="0.08" />
          {/* 불상 실루엣 */}
          <ellipse cx="100" cy={floorY - 30} rx="20" ry="30" fill="#141210" opacity="0.7" />
          <circle cx="100" cy={floorY - 65} r="12" fill="#141210" opacity="0.7" />
          {/* 향로 */}
          <rect x="85" y={floorY - 5} width="30" height="10" fill="#1a1815" rx="2" />
          <line x1="100" y1={floorY - 5} x2="100" y2={floorY - 15} stroke="#888" strokeWidth="0.5" opacity="0.3" />
          {/* 목탁 */}
          <ellipse cx="700" cy={floorY - 5} rx="15" ry="8" fill="#2a2015" opacity="0.6" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#f${uid})`} />
        </>
      );

    case "residential-living":
      return (
        <>
          <defs>{commonDefs}</defs>
          <rect width="800" height="450" fill="#0e0e0e" />
          {/* 소파 */}
          <rect x="250" y={floorY - 35} width="300" height="35" fill="#161616" rx="3" />
          <rect x="240" y={floorY - 40} width="320" height="8" fill="#1a1a1a" rx="2" />
          {/* 쿠션 */}
          <rect x="270" y={floorY - 55} width="30" height="20" fill="#181818" rx="3" />
          <rect x="500" y={floorY - 55} width="30" height="20" fill="#181818" rx="3" />
          {/* 사이드 테이블 */}
          <rect x="80" y={floorY - 25} width="40" height="25" fill="#141414" />
          <rect x="78" y={floorY - 28} width="44" height="5" fill="#181818" />
          {/* 플로어 램프 */}
          <line x1="680" y1={floorY} x2="680" y2="100" stroke="#1a1a1a" strokeWidth="2" />
          <ellipse cx="680" cy="95" rx="15" ry="10" fill="#1a1a1a" />
          <circle cx="680" cy="92" r="3" fill={accentColor} opacity="0.12" className="sim-chandelier" />
          {/* 러그 */}
          <ellipse cx="400" cy={floorY + 15} rx="180" ry="12" fill="#151515" opacity="0.5" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#f${uid})`} />
        </>
      );

    default:
      return (
        <>
          <defs>{commonDefs}</defs>
          <rect width="800" height="450" fill="#0d0d0d" />
          <rect x="0" y={floorY} width="800" height={90} fill={`url(#f${uid})`} />
        </>
      );
  }
}

export { getScreenRect };
