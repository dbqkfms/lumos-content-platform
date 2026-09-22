/** Public catalogue transport only. No retries or publication decisions; same-origin authentication is retained. */
export type CatalogueErrorCode = "timeout" | "aborted" | "http" | "format" | "too-large" | "invalid-options";
export class CatalogueLoadError extends Error {
  constructor(public readonly code: CatalogueErrorCode) {
    super(`catalogue-${code}`);
    this.name = "CatalogueLoadError";
  }
}
export interface CatalogueFetchOptions {
  timeoutMs?: number;
  maxBytes?: number;
  maxItems?: number;
  signal?: AbortSignal;
}

/** The deadline includes the response body; Content-Length alone is not trusted. */
export async function fetchJsonArray(
  url: string,
  options: CatalogueFetchOptions = {},
): Promise<unknown[]> {
  const { timeoutMs = 15_000, maxBytes = 8 * 1024 * 1024, maxItems = 10_000, signal } = options;
  if (![timeoutMs, maxBytes, maxItems].every(n => Number.isSafeInteger(n) && n > 0) || timeoutMs > 2_147_483_647) {
    throw new CatalogueLoadError("invalid-options");
  }
  if (signal?.aborted) throw new CatalogueLoadError("aborted");
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;
  try {
    const deadline = new Promise<never>((_, reject) => {
      const stop = (code: "timeout" | "aborted") => {
        // Reject before abort so a native AbortError cannot hide the useful cause.
        reject(new CatalogueLoadError(code));
        controller.abort();
      };
      timer = setTimeout(() => stop("timeout"), timeoutMs);
      onAbort = () => stop("aborted");
      signal?.addEventListener("abort", onAbort, { once: true });
      if (signal?.aborted) onAbort();
    });
    const request = (async () => {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        credentials: "same-origin",
        signal: controller.signal,
      });
      if (!response.ok) throw new CatalogueLoadError("http");
      const mime = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
      // Some legacy exports omit the MIME header; an HTML SPA fallback is never data.
      if (mime && mime !== "application/json" && !/^application\/[a-z0-9.+-]+\+json$/.test(mime)) {
        throw new CatalogueLoadError("format");
      }
      const declared = response.headers.get("content-length");
      if (declared && /^\d+$/.test(declared) && Number(declared) > maxBytes) {
        throw new CatalogueLoadError("too-large");
      }
      let text: string;
      if (response.body) {
        const reader = response.body.getReader();
        const cancelRead = () => { void reader.cancel().catch(() => undefined); };
        controller.signal.addEventListener("abort", cancelRead, { once: true });
        if (controller.signal.aborted) cancelRead();
        const decoder = new TextDecoder("utf-8", { fatal: true });
        const chunks: string[] = [];
        let bytes = 0;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            bytes += value.byteLength;
            if (bytes > maxBytes) throw new CatalogueLoadError("too-large");
            chunks.push(decoder.decode(value, { stream: true }));
          }
          chunks.push(decoder.decode());
          text = chunks.join("");
        } catch (error) {
          void reader.cancel().catch(() => undefined);
          if (error instanceof CatalogueLoadError || controller.signal.aborted) throw error;
          throw new CatalogueLoadError("format");
        } finally {
          controller.signal.removeEventListener("abort", cancelRead);
          reader.releaseLock();
        }
      } else {
        text = await response.text();
        if (new TextEncoder().encode(text).byteLength > maxBytes) throw new CatalogueLoadError("too-large");
      }
      let data: unknown;
      try { data = JSON.parse(text); } catch { throw new CatalogueLoadError("format"); }
      if (!Array.isArray(data)) throw new CatalogueLoadError("format");
      if (data.length > maxItems) throw new CatalogueLoadError("too-large");
      return data;
    })();
    return await Promise.race([request, deadline]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
    if (onAbort) signal?.removeEventListener("abort", onAbort);
    controller.abort();
  }
}

/** Reject broken rows, not neighbouring valid artworks. Unknown fields are retained. */
export function isCatalogueRecord(value: unknown): value is { id: string } & Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || !row.id.trim()) return false;
  const fields = ["title", "titleKo", "titleEn", "description", "category", "image", "videoSrc", "embedUrl", "displayType", "runtime", "resolution", "worldType", "styleCode", "vimeoId", "createdAt", "artist"];
  if (fields.some(key => row[key] != null && typeof row[key] !== "string")) return false;
  return row.tags == null || (Array.isArray(row.tags) && row.tags.every(tag => typeof tag === "string"));
}
