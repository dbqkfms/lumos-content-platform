const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const ts = require('typescript');
const source = path.resolve(__dirname, '../client/src/lib/catalogRules.ts');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lumos-rules-'));
const output = path.join(tmp, 'rules.cjs');
fs.writeFileSync(output, ts.transpileModule(fs.readFileSync(source, 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText);
const { normalizeCatalogEntry: normalize, resolveWorld, resolveAccessTier,
  uniqueArtworksById, buildLibraryCollections: collections } = require(output);
after(() => fs.rmSync(tmp, { recursive:true, force:true }));
const base = { id:'lumos-test', title:'봉황', titleEn:'Phoenix', description:'원문 설명',
  image:'/poster.jpg', tags:['한국적', '호텔'], worldType:'standard', displayType:'Horizontal', runtime:'10s', resolution:'1920x1080' };
const item = (patch = {}, source = 'content-manager') => normalize({ ...base, ...patch }, source);

test('shared rules pass strict TypeScript checking', () => {
  const program = ts.createProgram([source], { strict:true, noEmit:true, types:[], skipLibCheck:true,
    target:ts.ScriptTarget.ES2022, module:ts.ModuleKind.CommonJS });
  assert.equal(ts.getPreEmitDiagnostics(program).length, 0);
});
test('Korean title is not overwritten by English', () => assert.equal(item().title, '봉황'));
test('explicit Korean title wins on Korean public site', () => assert.equal(item({title:'Phoenix', titleKo:'봉황'}).title, '봉황'));
test('original description survives', () => assert.equal(item().description, '원문 설명'));
test('original Korean tags survive', () => assert.ok(item().tags.includes('한국적')));
test('static title is not humanized from ID', () => assert.equal(item({id:'standard-golden-japanese'}, 'static').title, '봉황'));
test('lumos-prefixed STANDARD remains STANDARD', () => assert.equal(collections([item()]).all[0].world, 'standard'));
test('explicit world beats stale ID', () => assert.equal(resolveWorld({id:'standard-x',worldType:'local'}), 'local'));
test('explicit line is a supported fallback', () => assert.equal(resolveWorld({id:'lumos-x',line:'STANDARD'}), 'standard'));
test('unknown world is not silently LOCAL', () => assert.equal(resolveWorld({id:'lumos-x'}), undefined));
test('unknown world is retained for classification review', () => assert.equal(collections([item({worldType:undefined})]).unclassified.length, 1));
test('static collection remains Originals', () => assert.equal(item({},'static').accessTier,'originals'));
test('short runtime and free-like tags never grant Open', () => assert.equal(item({runtime:'5s',tags:['free','힐링','카페']}).accessTier,'creator'));
test('malformed access tier never grants Open', () => assert.equal(resolveAccessTier('free','managed'),'creator'));
test('explicit Open is respected', () => assert.equal(item({accessTier:'open'}).accessTier,'open'));
test('array order does not define access tier', () => {
  const rows = Array.from({length:20},(_,i) => item({id:`lumos-${i}`}));
  assert.equal(collections(rows).openWorks.length,0);
  assert.equal(collections(rows.reverse()).openWorks.length,0);
});
test('empty Open is not filled with Creator items', () => assert.equal(collections([item()]).openWorks.length,0));
test('Open results are not cut down to twelve', () => assert.equal(collections(Array.from({length:15},(_,i) => item({id:`lumos-${i}`,accessTier:'open'}))).openWorks.length,15));
test('Creator recommendations do not include Open', () => assert.equal(collections([item({accessTier:'open'})]).featuredCreatorWorks.length,0));
test('Vimeo embed URL survives and stays separate from videoSrc', () => {
  const a = item({videoSrc:'',embedUrl:'https://player.vimeo.com/video/123'});
  assert.equal(a.videoSrc,undefined); assert.equal(a.embedUrl,'https://player.vimeo.com/video/123');
});
test('no invented resolution', () => assert.equal(item({resolution:undefined}).resolution,'확인 필요'));
test('no invented creator attribution', () => assert.equal(item().artist,undefined));
test('missing image is rejected safely', () => assert.equal(item({image:''}),null));
test('malformed rows are rejected safely', () => { for (const x of [null,[],42,'bad']) assert.equal(normalize(x,'managed'),null); });
test('normalization does not mutate source', () => {
  const a = {...base,tags:[...base.tags]}; const b = JSON.stringify(a); normalize(a,'managed'); assert.equal(JSON.stringify(a),b);
});
test('different IDs with equal video basenames both survive', () => assert.equal(uniqueArtworksById([
  {...base,id:'a',videoSrc:'https://one.test/preview.mp4'}, {...base,id:'b',videoSrc:'https://two.test/preview.mp4'}]).length,2));
test('same ID keeps the first entry deterministically', () => assert.equal(uniqueArtworksById([{id:'a',title:'first'},{id:'a',title:'second'}])[0].title,'first'));
test('Korean space tags work for recommendations', () => assert.equal(collections([item()]).solutionHighlights.hotel.length,1));
