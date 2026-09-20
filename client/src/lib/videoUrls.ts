/** Validate Vimeo hostnames and keep existing unlisted-video access parameters. */
function parseVimeo(src: string | undefined): { url: URL; id: string; pathHash?: string } | null {
  if (!src) return null;
  try {
    const url = new URL(src);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    if (!['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(url.hostname.toLowerCase())) return null;
    const match = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/);
    return match ? { url, id: match[1], pathHash: match[2] } : null;
  } catch { return null; }
}

export function isVimeoUrl(src?: string): boolean {
  return parseVimeo(src) !== null;
}

export function vimeoEmbedUrl(src: string, options: { autoplay?: boolean; muted?: boolean; loop?: boolean } = {}): string {
  const parsed = parseVimeo(src);
  if (!parsed) throw new Error('Unsupported Vimeo URL');
  const result = new URL(`https://player.vimeo.com/video/${parsed.id}`);
  result.search = parsed.url.search;
  if (parsed.pathHash && !result.searchParams.has('h')) result.searchParams.set('h', parsed.pathHash);
  for (const name of ['autoplay', 'muted', 'loop'] as const) {
    if (options[name] !== undefined) result.searchParams.set(name, options[name] ? '1' : '0');
  }
  return result.href;
}
