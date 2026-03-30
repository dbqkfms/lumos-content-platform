export type SearchWorld = "standard" | "local" | "bridge";

export interface SearchableArtwork {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  videoSrc?: string;
  displayType: "Horizontal" | "Vertical";
  runtime: string;
  resolution: string;
  tags?: string[];
}

export interface DerivedArtworkMeta {
  world: SearchWorld;
  spaces: string[];
  moods: string[];
  motifs: string[];
  displayFits: string[];
  ops: string[];
}

export interface SearchSignals {
  worlds: SearchWorld[];
  spaces: string[];
  moods: string[];
  motifs: string[];
  displayFits: string[];
  ops: string[];
  keywords: string[];
  labels: string[];
}

export interface RankedArtwork<T extends SearchableArtwork> {
  artwork: T;
  score: number;
  reasons: string[];
  meta: DerivedArtworkMeta;
}

interface SearchOptions {
  keywordQuery?: string;
  situationQuery?: string;
  preferredWorld?: SearchWorld;
}

const SPACE_TERMS: Record<string, string[]> = {
  lobby: ["lobby", "atrium", "entry", "entrance", "로비", "아트리움", "입구", "웰컴홀"],
  hotel: ["hotel", "resort", "suite", "호텔", "리조트"],
  cafe: ["cafe", "coffee", "카페", "브런치"],
  retail: ["retail", "store", "shop", "showroom", "리테일", "매장", "쇼룸", "쇼윈도"],
  office: ["office", "hq", "corporate", "오피스", "사무실", "본사"],
  facade: ["facade", "building", "outdoor", "파사드", "외벽", "건물", "야외"],
  exhibition: ["exhibition", "gallery", "museum", "전시", "갤러리", "뮤지엄"],
  wellness: ["wellness", "spa", "meditation", "웰니스", "휴게", "명상", "라운지"],
};

const MOOD_TERMS: Record<string, string[]> = {
  calm: ["calm", "quiet", "soft", "차분", "고요", "은은", "저자극", "저피로"],
  premium: ["premium", "luxury", "vip", "프리미엄", "고급", "vip", "하이엔드"],
  heroic: ["hero", "heroic", "showcase", "statement", "히어로", "강한 인상", "집중도", "시그니처"],
  ambient: ["ambient", "background", "low-key", "background", "배경형", "무드형", "장시간 운영"],
  seasonal: ["seasonal", "spring", "summer", "autumn", "winter", "시즌", "계절", "꽃"],
};

const MOTIF_TERMS: Record<string, string[]> = {
  korean: ["korean", "한국적", "전통", "한옥", "창살", "해태", "용"],
  floral: ["flower", "lotus", "orchid", "꽃", "연꽃", "난초"],
  light: ["light", "glow", "beam", "빛", "광", "입자"],
  geometry: ["geometry", "geometric", "pattern", "기하", "패턴", "결정"],
  nature: ["nature", "forest", "water", "wind", "bird", "natural", "자연", "숲", "물", "바람", "새"],
  cosmic: ["cosmic", "space", "galaxy", "nebula", "우주", "코스믹", "심연"],
};

const DISPLAY_TERMS: Record<string, string[]> = {
  wall: ["wall", "wide", "horizontal", "wallscape", "가로", "와이드", "벽면"],
  portrait: ["portrait", "vertical", "세로", "버티컬"],
  facade: ["facade", "building", "파사드", "건물"],
  ribbon: ["ribbon", "band", "띠형", "리본"],
};

const OPS_TERMS: Record<string, string[]> = {
  lowFatigue: ["low-fatigue", "low fatigue", "저피로", "장시간", "은은", "저자극"],
  heroShot: ["hero", "heroic", "statement", "히어로", "강한 인상", "오프닝", "랜드마크"],
  silentSafe: ["silent", "mute", "무음", "조용", "배경형"],
  shortLoop: ["short", "quick", "짧은", "빠른 루프"],
  longLoop: ["long", "extended", "긴", "장시간 루프"],
};

const WORLD_TERMS: Record<SearchWorld, string[]> = {
  standard: ["standard", "premium", "랜드마크", "파사드", "전시", "로비", "프리미엄"],
  local: ["local", "ambient", "카페", "리테일", "오피스", "장시간 운영", "배경형"],
  bridge: ["bridge", "hybrid", "mixed", "혼합", "중간"],
};

const DISPLAY_LABELS: Record<string, string> = {
  wall: "가로형 LED",
  portrait: "세로형 LED",
  facade: "파사드형",
  ribbon: "리본형",
};

const SPACE_LABELS: Record<string, string> = {
  lobby: "로비",
  hotel: "호텔",
  cafe: "카페",
  retail: "리테일",
  office: "오피스",
  facade: "파사드",
  exhibition: "전시",
  wellness: "웰니스",
};

const MOOD_LABELS: Record<string, string> = {
  calm: "차분한 무드",
  premium: "프리미엄 인상",
  heroic: "히어로 비주얼",
  ambient: "배경형 운영",
  seasonal: "시즌성",
};

const MOTIF_LABELS: Record<string, string> = {
  korean: "한국적 모티프",
  floral: "플로럴",
  light: "빛/입자",
  geometry: "기하/패턴",
  nature: "자연 모티프",
  cosmic: "우주/심연",
};

const OPS_LABELS: Record<string, string> = {
  lowFatigue: "장시간 운영",
  heroShot: "시선 집중형",
  silentSafe: "무음 친화",
  shortLoop: "짧은 루프",
  longLoop: "긴 루프",
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[#/(),.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(normalizeText(term)));
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function runtimeSeconds(runtime: string) {
  const match = runtime.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function guessWorldFromArtwork<T extends SearchableArtwork>(artwork: T, preferredWorld?: SearchWorld): SearchWorld {
  if (artwork.id.startsWith("standard-")) return "standard";
  if (artwork.id.startsWith("local-")) return "local";
  return preferredWorld ?? "bridge";
}

export function deriveArtworkMeta<T extends SearchableArtwork>(
  artwork: T,
  preferredWorld?: SearchWorld,
): DerivedArtworkMeta {
  const world = guessWorldFromArtwork(artwork, preferredWorld);
  const haystack = normalizeText(
    [artwork.title, artwork.description, artwork.category, ...(artwork.tags ?? [])].join(" "),
  );

  const spaces = world === "standard" ? ["lobby", "hotel", "exhibition", "facade"] : ["cafe", "retail", "office", "wellness"];
  const moods = world === "standard" ? ["premium", "heroic"] : ["ambient", "calm"];
  const motifs: string[] = [];
  const displayFits = artwork.displayType === "Vertical" ? ["portrait"] : ["wall"];
  const ops: string[] = [];

  for (const key of Object.keys(SPACE_TERMS)) {
    if (includesAny(haystack, SPACE_TERMS[key])) spaces.push(key);
  }

  for (const key of Object.keys(MOOD_TERMS)) {
    if (includesAny(haystack, MOOD_TERMS[key])) moods.push(key);
  }

  for (const key of Object.keys(MOTIF_TERMS)) {
    if (includesAny(haystack, MOTIF_TERMS[key])) motifs.push(key);
  }

  for (const key of Object.keys(DISPLAY_TERMS)) {
    if (includesAny(haystack, DISPLAY_TERMS[key])) displayFits.push(key);
  }

  const seconds = runtimeSeconds(artwork.runtime);
  if (world === "local") ops.push("lowFatigue", "silentSafe");
  if (world === "standard") ops.push("heroShot");
  if (seconds > 0 && seconds <= 10) ops.push("shortLoop");
  if (seconds >= 15) ops.push("longLoop");

  for (const key of Object.keys(OPS_TERMS)) {
    if (includesAny(haystack, OPS_TERMS[key])) ops.push(key);
  }

  if (!motifs.length) {
    if (world === "standard") motifs.push("korean", "light");
    if (world === "local") motifs.push("nature");
  }

  return {
    world,
    spaces: unique(spaces),
    moods: unique(moods),
    motifs: unique(motifs),
    displayFits: unique(displayFits),
    ops: unique(ops),
  };
}

export function parseSearchSignals(query: string): SearchSignals {
  const normalized = normalizeText(query);
  const keywords = tokenize(query);

  const worlds = (Object.entries(WORLD_TERMS) as Array<[SearchWorld, string[]]>)
    .filter(([, terms]) => includesAny(normalized, terms))
    .map(([world]) => world);

  const spaces = Object.entries(SPACE_TERMS)
    .filter(([, terms]) => includesAny(normalized, terms))
    .map(([space]) => space);

  const moods = Object.entries(MOOD_TERMS)
    .filter(([, terms]) => includesAny(normalized, terms))
    .map(([mood]) => mood);

  const motifs = Object.entries(MOTIF_TERMS)
    .filter(([, terms]) => includesAny(normalized, terms))
    .map(([motif]) => motif);

  const displayFits = Object.entries(DISPLAY_TERMS)
    .filter(([, terms]) => includesAny(normalized, terms))
    .map(([fit]) => fit);

  const ops = Object.entries(OPS_TERMS)
    .filter(([, terms]) => includesAny(normalized, terms))
    .map(([op]) => op);

  const labels = unique([
    ...spaces.map((key) => SPACE_LABELS[key] ?? key),
    ...moods.map((key) => MOOD_LABELS[key] ?? key),
    ...motifs.map((key) => MOTIF_LABELS[key] ?? key),
    ...displayFits.map((key) => DISPLAY_LABELS[key] ?? key),
    ...ops.map((key) => OPS_LABELS[key] ?? key),
    ...worlds.map((world) => world.toUpperCase()),
  ]);

  return { worlds, spaces, moods, motifs, displayFits, ops, keywords, labels };
}

function scoreMatches<T extends SearchableArtwork>(artwork: T, meta: DerivedArtworkMeta, signals: SearchSignals) {
  const searchableText = normalizeText(
    [
      artwork.title,
      artwork.description,
      artwork.category,
      artwork.displayType,
      artwork.runtime,
      artwork.resolution,
      ...(artwork.tags ?? []),
      meta.world,
      ...meta.spaces,
      ...meta.moods,
      ...meta.motifs,
      ...meta.displayFits,
      ...meta.ops,
    ].join(" "),
  );

  let score = 0;
  const reasons: string[] = [];

  for (const keyword of signals.keywords) {
    if (searchableText.includes(keyword)) {
      score += keyword.length >= 3 ? 6 : 3;
    }
  }

  for (const world of signals.worlds) {
    if (world === meta.world) {
      score += 14;
      reasons.push(world.toUpperCase());
    }
  }

  for (const space of signals.spaces) {
    if (meta.spaces.includes(space)) {
      score += 14;
      reasons.push(SPACE_LABELS[space] ?? space);
    }
  }

  for (const mood of signals.moods) {
    if (meta.moods.includes(mood)) {
      score += 12;
      reasons.push(MOOD_LABELS[mood] ?? mood);
    }
  }

  for (const motif of signals.motifs) {
    if (meta.motifs.includes(motif)) {
      score += 10;
      reasons.push(MOTIF_LABELS[motif] ?? motif);
    }
  }

  for (const displayFit of signals.displayFits) {
    if (meta.displayFits.includes(displayFit)) {
      score += 10;
      reasons.push(DISPLAY_LABELS[displayFit] ?? displayFit);
    }
  }

  for (const op of signals.ops) {
    if (meta.ops.includes(op)) {
      score += 8;
      reasons.push(OPS_LABELS[op] ?? op);
    }
  }

  return { score, reasons: unique(reasons).slice(0, 4) };
}

export function rankArtworks<T extends SearchableArtwork>(
  artworks: T[],
  { keywordQuery = "", situationQuery = "", preferredWorld }: SearchOptions = {},
): { results: RankedArtwork<T>[]; signals: SearchSignals } {
  const combinedQuery = [keywordQuery, situationQuery].filter(Boolean).join(" ");
  const signals = parseSearchSignals(combinedQuery);
  const hasActiveSearch = combinedQuery.trim().length > 0;

  const results = artworks
    .map((artwork, index) => {
      const meta = deriveArtworkMeta(artwork, preferredWorld);
      const { score, reasons } = scoreMatches(artwork, meta, signals);

      return {
        artwork,
        score,
        reasons,
        meta,
        index,
      };
    })
    .filter((entry) => !hasActiveSearch || entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.index - right.index;
    })
    .map(({ index, ...entry }) => entry);

  if (!hasActiveSearch) {
    return {
      results: artworks.map((artwork) => ({
        artwork,
        score: 0,
        reasons: [],
        meta: deriveArtworkMeta(artwork, preferredWorld),
      })),
      signals,
    };
  }

  return { results, signals };
}
