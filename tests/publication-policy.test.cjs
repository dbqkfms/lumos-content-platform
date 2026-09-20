const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const ts = require('typescript');
const source = path.resolve(__dirname, '../client/src/lib/publicationPolicy.ts');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lumos-policy-'));
const out = path.join(tmp, 'policy.cjs');
fs.writeFileSync(out, ts.transpileModule(fs.readFileSync(source, 'utf8'), {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText);
const {evaluatePublication:evaluate,matchesTrustFilter:match} = require(out);
after(()=>fs.rmSync(tmp,{recursive:true,force:true}));
const ctx={artworkId:'lumos-one',revision:'sha256:abc',now:'2026-09-20T04:00:00Z'};
const scopes={publication:'catalogue-publication',quality:'quality-review',previewRights:'public-preview',loop:'loop-review',resize:'resize-review',license:'licensing-review'};
function full(){
 const r={schemaVersion:1,artworkId:ctx.artworkId,revision:ctx.revision};
 for(const [k,scope] of Object.entries(scopes))r[k]={state:k==='resize'?'supported':'approved',evidence:{artworkId:ctx.artworkId,revision:ctx.revision,scope,referenceId:'ref-123',reviewerId:'reviewer-1',checkedAt:'2026-09-19T12:00:00Z',expiresAt:'2026-09-30T00:00:00Z'}};
 r.license.mode='exclusive-negotiable';return r;
}
test('strict TypeScript policy check with downlevel target',()=>{
 const p=ts.createProgram([source],{strict:true,noEmit:true,types:[],skipLibCheck:true,target:ts.ScriptTarget.ES5,lib:["lib.esnext.d.ts"],module:ts.ModuleKind.CommonJS});
 assert.deepEqual(ts.getPreEmitDiagnostics(p).map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')),[]);
});
for(const [name,patch] of Object.entries({missing:undefined,null:null,array:[],string:'approved',number:1,boolean:true,untrustedFlags:{id:'lumos-one',rightsReviewStatus:'verified',runtime:'120s',accessTier:'open',resizeSupport:true}}))test(`invalid ${name} grants nothing`,()=>{
 const r=evaluate(patch,ctx);assert.equal(r.publicListingAllowed,false);assert.equal(r.quality,'unknown');assert.equal(r.resize,'unknown');assert.equal(r.license,'unknown');
});
test('complete evidence permits listing, never commercial use',()=>{const r=evaluate(full(),ctx);assert.equal(r.publicListingAllowed,true);assert.equal(r.commercialUse,'separate-contract-required');});
for(const field of ['publication','quality','previewRights']){
 test(`${field} missing blocks publication`,()=>{const r=full();delete r[field];assert.equal(evaluate(r,ctx).publicListingAllowed,false);});
 test(`${field} bare approved blocks publication`,()=>{const r=full();r[field]={state:'approved'};assert.equal(evaluate(r,ctx).publicListingAllowed,false);});
 test(`${field} withdrawal overrides old approval evidence`,()=>{const r=full();r[field].state='withdrawn';assert.equal(evaluate(r,ctx).publicListingAllowed,false);});
}
for(const [label,edit] of Object.entries({wrongArtwork:e=>e.artworkId='other',wrongRevision:e=>e.revision='different',wrongScope:e=>e.scope='commercial-use',noReviewer:e=>delete e.reviewerId,noReference:e=>delete e.referenceId,blankReviewer:e=>e.reviewerId='',future:e=>e.checkedAt='2027-01-01T00:00:00Z',expired:e=>e.expiresAt=ctx.now,noTimezone:e=>e.checkedAt='2026-09-19 12:00:00',rolloverDate:e=>e.checkedAt='2026-02-30T00:00:00Z',expiryBeforeReview:e=>e.expiresAt='2026-09-18T12:00:00Z',badExpiry:e=>e.expiresAt='bad'})){
 test(`evidence ${label} fails closed`,()=>{const r=full();edit(r.previewRights.evidence);assert.equal(evaluate(r,ctx).previewRights,'unknown');assert.equal(evaluate(r,ctx).publicListingAllowed,false);});
}
test('exact expiry is not still valid',()=>{const r=full();r.loop.evidence.expiresAt=ctx.now;assert.equal(evaluate(r,ctx).loop,'unknown');});
test('expired rejection stays blocking',()=>{const r=full();r.publication.state='rejected';r.publication.evidence.expiresAt='2026-01-01T00:00:00Z';assert.equal(evaluate(r,ctx).publication,'rejected');});
test('no expiry is a permitted non-expiring record, not fabricated date',()=>{const r=full();delete r.previewRights.evidence.expiresAt;assert.equal(evaluate(r,ctx).publicListingAllowed,true);});
test('bad current clock blocks every approval',()=>assert.equal(evaluate(full(),{...ctx,now:'bad'}).publicListingAllowed,false));
test('new content version invalidates approvals',()=>assert.equal(evaluate(full(),{...ctx,revision:'sha256:new'}).publicListingAllowed,false));
test('other artwork invalidates approvals',()=>assert.equal(evaluate(full(),{...ctx,artworkId:'lumos-other'}).publicListingAllowed,false));
test('unknown schema version fails closed',()=>{const r=full();r.schemaVersion=2;assert.equal(evaluate(r,ctx).publicListingAllowed,false);});
test('loop duration never becomes approval',()=>{const r=full();r.loop={state:'approved',runtime:'20s'};assert.equal(evaluate(r,ctx).loop,'unknown');});
test('Open and Originals never imply preview rights',()=>{for(const accessTier of ['open','originals','creator']){const r=full();r.previewRights={};r.accessTier=accessTier;assert.equal(evaluate(r,ctx).publicListingAllowed,false);}});
test('resize support without evidence becomes negotiation',()=>{const r=full();r.resize={state:'supported'};assert.equal(evaluate(r,ctx).resize,'unknown');});
test('explicit unsupported resize stays unsupported',()=>{const r=full();r.resize={state:'unsupported'};assert.equal(evaluate(r,ctx).resize,'unsupported');});
test('conditional resizing is never a supported filter',()=>{const r=full();r.resize={state:'conditional'};assert.equal(match(evaluate(r,ctx),'resize-reviewed'),false);});
test('exclusive claim without evidence is never selectable',()=>{const r=full();r.license={mode:'exclusive-negotiable'};assert.equal(match(evaluate(r,ctx),'exclusive-negotiable'),false);});
test('quality approval alone is not public listing',()=>{const r=full();r.previewRights={state:'pending'};const t=evaluate(r,ctx);assert.equal(match(t,'quality-reviewed'),true);assert.equal(match(t,'public-approved'),false);});
test('all six predicates agree with the evaluated evidence',()=>{const r=evaluate(full(),ctx);for(const f of ['all','public-approved','quality-reviewed','preview-rights-reviewed','loop-reviewed','resize-reviewed','exclusive-negotiable'])assert.equal(match(r,f),true);});
test('unknown filter fails closed',()=>assert.equal(match(evaluate(full(),ctx),'other'),false));
test('sensitive fields never escape public projection',()=>{const r=full();r.email='PRIVATE_EMAIL';r.contract='PRIVATE_CONTRACT';const text=JSON.stringify(evaluate(r,ctx));for(const s of ['PRIVATE','ref-123','reviewer-1','sha256:abc'])assert.equal(text.includes(s),false);});
test('input is never mutated',()=>{const r=full();const before=JSON.stringify(r);evaluate(r,ctx);assert.equal(JSON.stringify(r),before);});
test('ID arithmetic and runtime variations cannot change unknown verdict',()=>{
 for(let i=0;i<1000;i++){const r=evaluate({id:`id-${i}`,runtime:`${i}s`,accessTier:i%2?'open':'creator'}, {...ctx,artworkId:`id-${i}`});assert.equal(r.publicListingAllowed,false);assert.equal(r.license,'unknown');assert.equal(r.loop,'unknown');}
});
