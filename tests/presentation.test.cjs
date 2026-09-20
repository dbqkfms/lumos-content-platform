const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadTs } = require('../scripts/audit-catalog.cjs');
const { selectArtworkView, newestFirst, parseInquiryIntent, inquiryDraft } = loadTs(path.join(__dirname, '../client/src/lib/catalogPresentation.ts'));
const { isVimeoUrl, vimeoEmbedUrl } = loadTs(path.join(__dirname, '../client/src/lib/videoUrls.ts'));

test('unknown item shows loading until sources finish', () => assert.equal(selectArtworkView([], 'pending', true).kind, 'loading'));
test('loaded item can display while other sources are loading', () => assert.equal(selectArtworkView([{ id:'a' }], 'a', true).kind, 'ready'));
test('navigating from a valid item to missing ID never reuses old artwork', () => {
  assert.equal(selectArtworkView([{ id:'a' }], 'a', false).kind, 'ready');
  assert.deepEqual(selectArtworkView([{ id:'a' }], 'missing', false), {kind:'not-found'});
});
test('latest sort is descending without mutating catalogue order', () => {
  const items=[{id:'a',createdAt:'2026-01-02 12:00:00'},{id:'b',createdAt:'2026-01-03T12:00:00Z'},{id:'c'}];
  assert.deepEqual(newestFirst(items).map(x=>x.id),['b','a','c']);
  assert.deepEqual(items.map(x=>x.id),['a','b','c']);
});
test('missing and invalid dates sort last in stable order', () => assert.deepEqual(newestFirst([{id:'a'},{id:'b',createdAt:'bad'},{id:'c',createdAt:'2026-02-01'}]).map(x=>x.id),['c','a','b']));
test('latest sort supports explicit timezone offsets', () => assert.equal(newestFirst([{id:'a',createdAt:'2026-02-01T10:00:00+09:00'},{id:'b',createdAt:'2026-02-01T02:00:00Z'}])[0].id,'b'));
test('inquiry accepts legacy artworkName and current prefill', () => {
  assert.equal(parseInquiryIntent({artworkName:'봉황'}).title,'봉황');
  assert.equal(parseInquiryIntent({prefill:'호텔 로비'}).title,'호텔 로비');
});
test('inquiry passes explicit artwork ID and title', () => assert.deepEqual(parseInquiryIntent({artworkId:'a',artworkTitle:'선원'}),{artworkId:'a',title:'선원'}));
test('malformed inquiry payloads are ignored', () => {for (const x of [null, [], 3, 'x']) assert.deepEqual(parseInquiryIntent(x),{});});
test('generated draft switches with selected artwork', () => {
  const first=inquiryDraft('', '', '봉황');
  assert.ok(inquiryDraft(first.message, first.generated, '선원').message.startsWith('선원'));
});
test('custom user message is never discarded on intent change', () => assert.equal(inquiryDraft('내가 직접 쓴 조건입니다','자동 문장','선원').message,'내가 직접 쓴 조건입니다'));
test('generic inquiry clears only generated draft', () => {
  const first=inquiryDraft('', '', '봉황'); assert.equal(inquiryDraft(first.message,first.generated).message,'');
});
test('Vimeo query/hash survive autoplay configuration', () => {
  const url=new URL(vimeoEmbedUrl('https://player.vimeo.com/video/123?h=secret&autoplay=0',{autoplay:true,loop:true,muted:true}));
  assert.equal(url.searchParams.get('h'),'secret');assert.deepEqual(url.searchParams.getAll('autoplay'),['1']);
  assert.equal(url.searchParams.get('muted'),'1');assert.equal(url.searchParams.get('loop'),'1');
});
test('public Vimeo page converts to player URL', () => assert.equal(vimeoEmbedUrl('https://vimeo.com/123'), 'https://player.vimeo.com/video/123'));
test('Vimeo unlisted page path hash is retained', () => assert.equal(new URL(vimeoEmbedUrl('https://vimeo.com/123/abcdef')).searchParams.get('h'),'abcdef'));
test('lookalike hosts and URLs with injected credentials are rejected', () => {
  for(const x of ['https://vimeo.com.evil.test/video/123','https://evil.test/vimeo.com/123','https://person@vimeo.com/123','javascript:alert(1)','/videos/clip.mp4']) assert.equal(isVimeoUrl(x),false);
});
test('unsupported Vimeo URL cannot become an iframe', () => assert.throws(()=>vimeoEmbedUrl('https://vimeo.com/channels/unknown'), /Unsupported/));
test('Vimeo existing parameters are not duplicated', () => assert.deepEqual(new URL(vimeoEmbedUrl('https://player.vimeo.com/video/123?loop=0&loop=1',{loop:true})).searchParams.getAll('loop'),['1']));

test('Vercel deep-link rewrite targets only artwork and portal navigation, never all resources', () => {
  const fs = require('node:fs');
  const config=JSON.parse(fs.readFileSync(path.join(__dirname,'../vercel.json'),'utf8'));
  assert.deepEqual(config.rewrites,[{source:'/artwork/:id',destination:'/index.html'},{source:'/portal/:path*',destination:'/index.html'}]);
  assert.equal(config.buildCommand,undefined); assert.equal(config.outputDirectory,undefined);
});
