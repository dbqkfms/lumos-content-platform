/**
 * Display/export policy, not authentication. Feed only server-controlled review
 * records. Collection, ID spelling and duration never establish any permission.
 * Keep reviewer/evidence identifiers out of the public projection.
 */
export interface ReviewContext {
  artworkId: string;
  revision: string;
  now: string;
}
export type ReviewState = "unknown" | "pending" | "approved" | "rejected" | "withdrawn";
export interface PublicTrust {
  schemaVersion: 1;
  publication: ReviewState;
  quality: ReviewState;
  previewRights: ReviewState;
  loop: ReviewState;
  resize: "unknown" | "conditional" | "supported" | "unsupported";
  license: "unknown" | "non-exclusive" | "exclusive-negotiable" | "custom";
  publicListingAllowed: boolean;
  commercialUse: "separate-contract-required";
  labels: { publication: string; quality: string; previewRights: string; loop: string; resize: string; license: string };
  reasons: string[];
}

type Obj = Record<string, unknown>;
const object = (v: unknown): Obj => v !== null && typeof v === "object" && !Array.isArray(v) ? v as Obj : {};
const token = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/.test(v);
const timestamp = (v: unknown): number | null => {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(v)) return null;
  const n = Date.parse(v);
  if (!Number.isFinite(n)) return null;
  // Reject rollover dates such as 2026-02-30, not only parse errors.
  return new Date(n).toISOString().slice(0,19) === v.slice(0,19) ? n : null;
};
const states = new Set<unknown>(["unknown", "pending", "approved", "rejected", "withdrawn"]);

export function evaluatePublication(input: unknown, context: ReviewContext): PublicTrust {
  const root = object(input);
  const now = timestamp(context.now);
  const reasons: string[] = [];
  const bound = root.schemaVersion === 1 && token(context.artworkId) && token(context.revision) &&
    root.artworkId === context.artworkId && root.revision === context.revision && now !== null;
  if (!bound) reasons.push("record-missing-invalid-or-version-mismatch");

  const evidenced = (entry: Obj, scope: string): boolean => {
    if (!bound) return false;
    const e = object(entry.evidence);
    const checked = timestamp(e.checkedAt);
    const expiry = e.expiresAt === undefined ? undefined : timestamp(e.expiresAt);
    return token(e.referenceId) && token(e.reviewerId) && e.scope === scope &&
      e.artworkId === context.artworkId && e.revision === context.revision &&
      checked !== null && checked <= now! &&
      (expiry === undefined || (expiry !== null && expiry > now! && expiry > checked));
  };
  const review = (key: string, scope: string): ReviewState => {
    const entry = object(root[key]);
    if (!bound) return "unknown";
    if (!states.has(entry.state)) { reasons.push(`${key}:invalid-or-missing-state`); return "unknown"; }
    const state = entry.state as ReviewState;
    // Blocking decisions remain blocking even if their evidence is expired.
    if (state === "withdrawn" || state === "rejected" || state === "pending" || state === "unknown") return state;
    if (!evidenced(entry, scope)) { reasons.push(`${key}:approval-evidence-invalid`); return "unknown"; }
    return "approved";
  };
  const publication = review("publication", "catalogue-publication");
  const quality = review("quality", "quality-review");
  const previewRights = review("previewRights", "public-preview");
  const loop = review("loop", "loop-review");
  const resizing = object(root.resize);
  let resize: PublicTrust["resize"] = "unknown";
  if (bound && resizing.state === "unsupported") resize = "unsupported";
  else if (bound && resizing.state === "conditional") resize = "conditional";
  else if (resizing.state === "supported" && evidenced(resizing, "resize-review")) resize = "supported";
  else if (resizing.state === "supported") reasons.push("resize:approval-evidence-invalid");
  const licensing = object(root.license);
  let license: PublicTrust["license"] = "unknown";
  if (["non-exclusive", "exclusive-negotiable", "custom"].includes(String(licensing.mode)) && evidenced(licensing, "licensing-review")) {
    license = licensing.mode as PublicTrust["license"];
  } else if (licensing.mode !== undefined && licensing.mode !== "unknown") reasons.push("license:review-evidence-invalid");

  const publicListingAllowed = publication === "approved" && quality === "approved" && previewRights === "approved";
  if (!publicListingAllowed) reasons.push("publication-quality-and-preview-approval-required");
  const label = (s: ReviewState, positive: string) => s === "approved" ? positive :
    s === "rejected" || s === "withdrawn" ? "공개 보류" : s === "pending" ? "검토 중" : "확인 필요";
  return {
    schemaVersion: 1, publication, quality, previewRights, loop, resize, license,
    publicListingAllowed, commercialUse: "separate-contract-required",
    labels: {
      publication: label(publication, "공개 승인 기록 있음"),
      quality: label(quality, "품질 검수 기록 있음"),
      previewRights: label(previewRights, "공개 프리뷰 권리 확인"),
      loop: label(loop, "루프 검수 기록 있음"),
      resize: resize === "supported" ? "검토된 범위에서 대응" : resize === "unsupported" ? "리사이즈 미지원" : "리사이즈 조건 협의",
      license: license === "non-exclusive" ? "비독점 조건 협의" : license === "exclusive-negotiable" ? "독점 조건 협의" : "라이선스 조건 협의",
    },
    reasons: Array.from(new Set(reasons)),
  };
}

/** Use exactly these predicates for both badges and filter results. */
export function matchesTrustFilter(trust: PublicTrust, filter: "all" | "public-approved" | "quality-reviewed" | "preview-rights-reviewed" | "loop-reviewed" | "resize-reviewed" | "exclusive-negotiable"): boolean {
  switch (filter) {
    case "all": return true;
    case "public-approved": return trust.publicListingAllowed;
    case "quality-reviewed": return trust.quality === "approved";
    case "preview-rights-reviewed": return trust.previewRights === "approved";
    case "loop-reviewed": return trust.loop === "approved";
    case "resize-reviewed": return trust.resize === "supported";
    case "exclusive-negotiable": return trust.license === "exclusive-negotiable";
    default: return false;
  }
}
