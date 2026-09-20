/** Pure display rules shared by pages; they do not grant publication rights. */
export type ArtworkView<T> =
  | { kind: "ready"; artwork: T }
  | { kind: "loading" }
  | { kind: "not-found" };

export function selectArtworkView<T extends { id: string }>(
  artworks: readonly T[], id: string | undefined, loading: boolean,
): ArtworkView<T> {
  const artwork = artworks.find((item) => item.id === id);
  if (artwork) return { kind: "ready", artwork };
  return loading ? { kind: "loading" } : { kind: "not-found" };
}

function timestamp(value: string | undefined): number {
  if (!value) return Number.NEGATIVE_INFINITY;
  // Legacy exports have a naive local timestamp. Use one timezone for sorting
  // these rows, without modifying or claiming the source timestamp's timezone.
  const normalized = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.test(value)
    ? value.replace(" ", "T") + "Z" : value;
  const parsed = Date.parse(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
}

export function newestFirst<T extends { createdAt?: string }>(items: readonly T[]): T[] {
  return items.map((item, index) => ({ item, index, time: timestamp(item.createdAt) }))
    .sort((left, right) => left.time === right.time ? left.index - right.index : left.time > right.time ? -1 : 1)
    .map(({ item }) => item);
}

export type InquiryIntent = { artworkId?: string; title?: string };
const cleanText = (value: unknown, limit: number) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, limit) : undefined;

export function parseInquiryIntent(value: unknown): InquiryIntent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const detail = value as Record<string, unknown>;
  return {
    artworkId: cleanText(detail.artworkId, 200),
    title: cleanText(detail.artworkTitle, 500) || cleanText(detail.artworkName, 500) || cleanText(detail.prefill, 500),
  };
}

export function inquiryDraft(current: string, previousGenerated: string, title?: string) {
  const generated = title ? `${title} 관련 적용 가능성과 라이선스 범위를 확인하고 싶습니다.` : "";
  return {
    generated,
    message: !current.trim() || current === previousGenerated ? generated : current,
  };
}
