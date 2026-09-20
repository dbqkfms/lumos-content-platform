import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const validSha = (value) => /^[a-f0-9]{40}$/i.test(value || '') ? value.toLowerCase() : null;
const git = (root, args) => {
  try { return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return null; }
};
const cleanRepository = (value) => {
  const match = String(value || '').match(/(?:github\.com[/:])([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
  return match ? `${match[1]}/${match[2]}` : null;
};
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);

export function writeBuildInfo({ root, env = process.env, now = new Date() }) {
  root = path.resolve(root);
  const out = path.join(root, 'dist', 'public');
  const htmlPath = path.join(out, 'index.html');
  if (!fs.existsSync(htmlPath)) throw new Error('dist/public/index.html is missing; build the application first.');
  let html = fs.readFileSync(htmlPath, 'utf8');
  if (!/<\/head\s*>/i.test(html)) throw new Error('Built HTML has no closing head tag.');
  const localSha = validSha(git(root, ['rev-parse', 'HEAD']));
  const vercelSha = validSha(env.VERCEL_GIT_COMMIT_SHA);
  const explicitSha = validSha(env.LUMOS_SOURCE_COMMIT);
  if (env.LUMOS_SOURCE_COMMIT && !explicitSha) throw new Error('LUMOS_SOURCE_COMMIT must be a full commit SHA.');
  if (localSha && ((vercelSha && localSha !== vercelSha) || (explicitSha && localSha !== explicitSha))) {
    throw new Error('Source revision conflict; refusing to publish misleading build information.');
  }
  if (explicitSha && vercelSha && explicitSha !== vercelSha) throw new Error('Declared revision conflicts with Vercel revision.');
  const commit = localSha || vercelSha || explicitSha;
  const status = git(root, ['status', '--porcelain', '--untracked-files=normal']);
  const owner = env.VERCEL_GIT_REPO_OWNER;
  const slug = env.VERCEL_GIT_REPO_SLUG;
  const platformRepo = owner && slug && /^[\w.-]+$/.test(owner) && /^[\w.-]+$/.test(slug) ? `${owner}/${slug}` : null;
  const repository = cleanRepository(git(root, ['config', '--get', 'remote.origin.url'])) || platformRepo;
  const info = {
    schemaVersion: 1, repository, commit,
    branch: git(root, ['branch', '--show-current']) || env.VERCEL_GIT_COMMIT_REF || null,
    revisionEvidence: localSha ? 'git' : vercelSha ? 'vercel' : explicitSha ? 'declared' : 'unknown',
    dirty: status === null ? null : status.length > 0,
    builtAt: now.toISOString(),
    bundles: {},
  };
  // Only public build metadata is serialized, never credentials or all env vars.
  const assetRoot = path.join(out, 'assets');
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, item.name);
      if (item.isDirectory()) walk(file);
      else if (item.isFile() && /\.(js|css)$/.test(item.name)) {
        info.bundles[path.relative(out, file).split(path.sep).join('/')] = sha256(fs.readFileSync(file));
      }
    }
  };
  walk(assetRoot);
  info.bundleFingerprint = sha256(JSON.stringify(info.bundles));
  html = html.replace(/\s*<meta\b[^>]*name=["']lumos:(?:commit|bundle|dirty)["'][^>]*>/gi, '');
  const tags = [
    ['commit', info.commit || 'unknown'],
    ['bundle', info.bundleFingerprint],
    ['dirty', info.dirty === null ? 'unknown' : String(info.dirty)],
  ].map(([name,value]) => `    <meta name="lumos:${name}" content="${escape(value)}" />`).join('\n');
  html = html.replace(/<\/head\s*>/i, `${tags}\n  </head>`);
  fs.writeFileSync(htmlPath, html);
  info.indexSha256 = sha256(html);
  fs.writeFileSync(path.join(out, 'build-info.json'), JSON.stringify(info, null, 2) + '\n');
  return info;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const info = writeBuildInfo({ root });
    console.log(`[LUMOS] build-info written; commit=${info.commit || 'unknown'}; dirty=${info.dirty}`);
  } catch (error) {
    console.error(`[LUMOS] ${error.message}`);
    process.exitCode = 1;
  }
}
