/** Read-only audit of actual catalogue records; does not assign usage rights. */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function loadTs(file, dependencies = {}, appended = '') {
  const content = fs.readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(content, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled + '\n' + appended)(
    (name) => {
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      throw new Error(`Audit module dependency not allowed: ${name}`);
    }, module, module.exports,
  );
  return module.exports;
}
function readRecords(file) {
  const value = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(value)) throw new Error(`Expected an array: ${file}`);
  return value;
}
function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = key === undefined ? item : typeof key === 'function' ? key(item) : item[key];
    counts[value ?? 'unknown'] = (counts[value ?? 'unknown'] || 0) + 1;
    return counts;
  }, {});
}
function duplicates(items, key) {
  const groups = new Map();
  for (const item of items) {
    const value = key(item);
    if (!value) continue;
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(item.id);
  }
  return [...groups].filter(([, ids]) => ids.length > 1).map(([value, ids]) => ({ value, ids }));
}
function mediaKey(item) {
  const value = item.embedUrl || item.videoSrc;
  if (!value) return null;
  try {
    const u = new URL(value, 'https://local.invalid');
    if (['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(u.hostname)) {
      const id = u.pathname.match(/(?:^|\/)(\d+)(?:\/|$)/)?.[1];
      if (id) return `vimeo:${id}`;
    }
    return u.origin + u.pathname;
  } catch { return value; }
}
function reviewFlags(item) {
  const flags = [];
  if (!['open','creator','originals'].includes(item.accessTier)) flags.push('collection-not-explicit');
  const m = String(item.resolution || '').match(/(\d+)\s*[x×]\s*(\d+)/i);
  if (!m) flags.push('resolution-unverified');
  else {
    const [width,height] = [Number(m[1]),Number(m[2])];
    if (Math.max(width,height) < 1920 || Math.min(width,height) < 1080) flags.push('declared-below-fhd');
    if ((item.displayType === 'Vertical' && width >= height) || (item.displayType === 'Horizontal' && width < height)) flags.push('orientation-conflict');
  }
  if (/^(test|테스트|untitled)$/i.test(item.title || '')) flags.push('placeholder-title');
  if (/투두리스트|애플리케이션의 기능 시연|작업 생성, 관리/.test(item.description || '')) flags.push('possible-non-art-demo-review');
  return flags;
}
function auditCatalog(root, liveRecords) {
  root = path.resolve(root);
  const rules = loadTs(path.join(root, 'client/src/lib/catalogRules.ts'));
  const standard = loadTs(path.join(root, 'client/src/data/standardArtworks.ts')).standardArtworks;
  const local = loadTs(path.join(root, 'client/src/data/localArtworks.ts')).localArtworks;
  const managed = readRecords(path.join(root, 'client/public/data/managed-artworks.json'));
  const cm = readRecords(path.join(root, 'client/public/data/content-manager-artworks.json'));
  const sources = [
    ...managed.map((raw) => ({ raw, source: 'managed' })),
    ...cm.map((raw) => ({ raw, source: 'content-manager' })),
    ...standard.map((raw) => ({ raw, source: 'static', world: 'standard' })),
    ...local.map((raw) => ({ raw, source: 'static', world: 'local' })),
  ];
  const normalized = sources.map(({raw, source, world}) => rules.normalizeCatalogEntry(raw, source, world));
  const valid = normalized.filter(Boolean);
  const all = rules.uniqueArtworksById(valid);
  const collections = rules.buildLibraryCollections(all);
  const failures = [];
  for (const { raw, source, world } of sources) {
    const a = rules.normalizeCatalogEntry(raw, source, world);
    if (!a) continue;
    if (raw.description?.trim() && a.description !== raw.description.trim()) failures.push({ id:raw.id,field:'description' });
    if ((raw.tags || []).some((t) => typeof t === 'string' && t.trim() && !a.tags.includes(t.trim()))) failures.push({ id:raw.id,field:'tags' });
    if (raw.worldType && a.worldType !== raw.worldType) failures.push({ id:raw.id,field:'worldType' });
    if (a.accessTier === 'open' && raw.accessTier !== 'open') failures.push({ id:raw.id,field:'implicitOpen' });
    if (raw.titleKo?.trim() && a.title !== raw.titleKo.trim()) failures.push({ id:raw.id,field:'titleKo' });
    for (const field of ['image','videoSrc','embedUrl']) {
      if (raw[field]?.trim() && a[field] !== raw[field].trim()) failures.push({ id:raw.id,field });
    }
  }
  const expectedIds = new Set(valid.map((a) => a.id));
  const actualIds = new Set([...collections.all,...collections.unclassified].map((a) => a.id));
  for (const id of expectedIds) if (!actualIds.has(id)) failures.push({id,field:'missingId'});
  const review = sources.filter((a) => a.source !== 'static').map(({ raw, source }) => ({
    id:raw.id,title:raw.title,titleKo:raw.titleKo,source,worldType:raw.worldType,
    resolution:raw.resolution,runtime:raw.runtime,image:raw.image,videoSrc:raw.videoSrc,embedUrl:raw.embedUrl,
    currentAccessTier:raw.accessTier ?? null,
    proposedAccessTier:null,reviewer:null,evidence:null,
    flags:reviewFlags(raw),
  }));
  let liveComparison = null;
  if (liveRecords) {
    const byId = new Map(cm.map((a) => [a.id,a]));
    const liveById = new Map(liveRecords.map((a) => [a.id,a]));
    const changed = [];
    for (const [id,a] of liveById) {
      const before = byId.get(id); if (!before) continue;
      const fields = {};
      for (const key of new Set([...Object.keys(before),...Object.keys(a)])) {
        if (JSON.stringify(before[key]) !== JSON.stringify(a[key])) fields[key] = { source: before[key], live: a[key] };
      }
      if (Object.keys(fields).length) changed.push({id, fields});
    }
    liveComparison = {
      sourceCount:cm.length,liveCount:liveRecords.length,
      newIds:[...liveById.keys()].filter((id)=>!byId.has(id)),
      missingIds:[...byId.keys()].filter((id)=>!liveById.has(id)),changed,
      liveFlags:liveRecords.filter((a)=>reviewFlags(a).some((f)=>['placeholder-title','possible-non-art-demo-review','orientation-conflict'].includes(f))).map((a)=>({id:a.id,title:a.title,flags:reviewFlags(a)})),
    };
  }
  return {
    schemaVersion:1,
    scope:'repository-catalogue-not-proof-of-production-source-or-usage-rights',
    inputs:{standard:standard.length,local:local.length,managed:managed.length,contentManager:cm.length},
    validRows:valid.length,rejectedRows:normalized.length-valid.length,uniqueIds:all.length,
    rejectedRecords:sources.filter((_,i)=>!normalized[i]).map(({raw,source})=>({id:raw.id,title:raw.title,source,reason:!raw.image?'missing-thumbnail':'invalid-record',embedUrl:raw.embedUrl})),
    collectionCounts:{originals:collections.originals.length,open:collections.openWorks.length,creator:collections.creatorWorks.length,unclassified:collections.unclassified.length},
    worldCounts:countBy(all,'worldType'),
    metadataFailures:failures,
    duplicateIds:duplicates(valid,(a)=>a.id),
    duplicateMedia:duplicates(all,mediaKey),
    rawFlagCounts:countBy(review.flatMap((a)=>a.flags)),
    reviewQueue:review,
    records:all,
    liveComparison,
    assertionsPassed:failures.length===0,
    releaseReady:false,
    releaseBlockers:['deployment-source-unconfirmed','explicit-publication-and-usage-review-required','media-playback-and-source-metadata-review-required'],
  };
}
module.exports = { auditCatalog, loadTs, reviewFlags, mediaKey };
if (require.main === module) {
  const root=path.resolve(__dirname,'..');
  const livePath=process.env.LUMOS_LIVE_CATALOG;
  const live=livePath && fs.existsSync(livePath) ? readRecords(livePath) : undefined;
  const result=auditCatalog(root,live);
  const out=path.join(root,'dist/audits'); fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'catalog-report.json'),JSON.stringify(result,null,2)+'\n');
  fs.writeFileSync(path.join(out,'publication-review.json'),JSON.stringify({notice:'Review only. No usage permission is granted. proposedAccessTier must be decided by the responsible reviewer.',records:result.reviewQueue},null,2)+'\n');
  console.log(JSON.stringify({...result,records:undefined,reviewQueue:undefined},null,2));
  if (!result.assertionsPassed) process.exitCode=1;
}
