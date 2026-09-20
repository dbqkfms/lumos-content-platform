import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export function auditMedia(root) {
  root = path.resolve(root);
  const refs = new Map();
  const scan = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name);
      if (item.isDirectory()) scan(file);
      else if (item.isFile() && /\.(tsx?|jsx?|json)$/.test(item.name)) {
        const content = fs.readFileSync(file, 'utf8');
        // Literal references only: dynamic template paths require runtime testing.
        const matches = content.matchAll(/["'`](\/(?!\/)[^"'`\s?<>${}]+\.(?:mp4|webm|mov|m3u8|png|jpe?g|webp|avif|gif|svg))(?:\?[^"'`]*)?["'`]/gi);
        for (const match of matches) {
          const src = match[1];
          const from = path.relative(root, file).split(path.sep).join('/');
          if (!refs.has(src)) refs.set(src, new Set());
          refs.get(src).add(from);
        }
      }
    }
  };
  scan(path.join(root, 'client', 'src'));
  scan(path.join(root, 'client', 'public', 'data'));
  let tracked = null;
  try {
    tracked = new Set(execFileSync('git', ['-C', root, 'ls-files', '-z'], { encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }).split('\0'));
  } catch { /* Not a Git checkout: tracked state stays unknown. */ }
  const publicRoot = path.join(root, 'client', 'public');
  const assets = [...refs].sort(([a],[b]) => a.localeCompare(b)).map(([src, sources]) => {
    const resolved = path.resolve(publicRoot, '.' + src);
    const inside = resolved.startsWith(publicRoot + path.sep);
    const exists = inside && fs.existsSync(resolved) && fs.statSync(resolved).isFile();
    return { src, sources: [...sources].sort(), exists,
      tracked: tracked === null ? null : tracked.has(path.relative(root, resolved).split(path.sep).join('/')) };
  });
  return { scope: 'literal-local-references-only', assets,
    total: assets.length, missing: assets.filter((a) => !a.exists).length,
    presentButUntracked: assets.filter((a) => a.exists && a.tracked === false).length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const report = auditMedia(root);
  const out = path.join(root, 'dist', 'audits');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'media-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`[LUMOS] local media: ${report.total}, missing: ${report.missing}, present but untracked: ${report.presentButUntracked}`);
  // Do not generate unrelated placeholders to force this check to pass.
  if (report.missing || report.presentButUntracked) process.exitCode = 1;
}
