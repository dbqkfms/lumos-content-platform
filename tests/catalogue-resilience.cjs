/** Transport + editorial + lifecycle guard tests. Not a real-browser or delivery test. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const output = process.env.LUMOS_QA_DIR || path.join(root, '.qa');
fs.mkdirSync(output, {recursive:true});
const originalFetch = global.fetch;
const results = [];
const canonical = x => JSON.parse(JSON.stringify(x));
function source(rel, before) {
  if (!before) return fs.readFileSync(path.join(root, rel), 'utf8');
  if (process.env.LUMOS_BASE_DIR) return fs.readFileSync(path.join(process.env.LUMOS_BASE_DIR,rel),'utf8');
  return cp.execFileSync('git',['show',`30c8316d929d58b56f9127bf1da4f6a9ea6cf159:${rel}`],{cwd:root,encoding:'utf8'});
}
function loader(before=false, replacements={}) {
  const cache = new Map();
  function load(rel) {
    if(cache.has(rel)) return cache.get(rel).exports;
    const m={exports:{}}; cache.set(rel,m);
    const text = source(rel,before);
    const js=ts.transpileModule(text,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
    const req=id=>{
      if(Object.hasOwn(replacements,id)) return replacements[id];
      if(id.startsWith('@/')) return load('client/src/'+id.slice(2)+'.ts');
      if(id.startsWith('.')) return load(path.posix.normalize(path.posix.join(path.posix.dirname(rel),id))+'.ts');
      return require(id);
    };
    vm.runInThisContext(`(function(require,module,exports){${js}\n})`,{filename:rel})(req,m,m.exports);
    return m.exports;
  }
  return load;
}
const load=loader();
const {fetchJsonArray,isCatalogueRecord}=load('client/src/lib/fetchJsonArray.ts');
const {firstText,editorialTags}=load('client/src/lib/catalogPresentation.ts');
const catalog=load('client/src/lib/catalog.ts');
const before=loader(true)('client/src/lib/catalog.ts');
const managed=load('client/src/lib/artworkData.ts');
const jsonResponse=(data,opts={})=>new Response(JSON.stringify(data),{headers:{'content-type':'application/json'},...opts});
async function test(name,fn){
 try{await fn();results.push({name,ok:true});console.log('PASS',name);}
 catch(e){results.push({name,ok:false,error:String(e)});console.error('FAIL',name,e.stack);}
 finally{global.fetch=originalFetch;}
}
const record={id:'lumos-test',title:'Original title',titleKo:'한글 작품명',titleEn:'English title',description:'작성한 설명을 그대로 보존',category:'Nature',image:'/thumbnails/source.jpg',videoSrc:'/videos/original.mp4',displayType:'Horizontal',runtime:'18s',resolution:'1920x1080',tags:['원본 태그','Nature'],worldType:'standard'};
const codes=code=>e=>e.code===code;
(async()=>{
 await test('valid JSON is not normalized by transport',async()=>{global.fetch=async()=>jsonResponse([record]);assert.deepEqual(canonical(await fetchJsonArray('/data/catalog.json')), [record]);});
 await test('empty array remains a valid empty catalogue',async()=>{global.fetch=async()=>jsonResponse([]);assert.equal((await fetchJsonArray('/data/catalog.json')).length,0);});
 await test('legacy JSON without MIME is accepted',async()=>{global.fetch=async()=>new Response(new TextEncoder().encode('[]'));assert.deepEqual(await fetchJsonArray('/data/a.json'),[]);});
 await test('application vendor JSON MIME is accepted',async()=>{global.fetch=async()=>new Response('[]',{headers:{'content-type':'application/vnd.lumos+json; charset=utf-8'}});assert.deepEqual(await fetchJsonArray('/data/a.json'),[]);});
 for(const [body,status,mime,code] of [['[]',503,'application/json','http'],['<html>fallback</html>',200,'text/html','format'],['{}',200,'application/json','format'],['null',200,'application/json','format'],['bad',200,'application/json','format']]){
  await test(`reject ${status} ${mime} ${body.slice(0,8)}`,async()=>{global.fetch=async()=>new Response(body,{status,headers:{'content-type':mime}});await assert.rejects(fetchJsonArray('/data/a.json'),codes(code));});
 }
 await test('network rejection terminates and clears the deadline',async()=>{global.fetch=async()=>{throw new TypeError('network unavailable')};await assert.rejects(fetchJsonArray('/data/a.json'),/network unavailable/);});
 await test('stalled fetch ends even if fetch ignores AbortSignal',async()=>{global.fetch=()=>new Promise(()=>{});const start=Date.now();await assert.rejects(fetchJsonArray('/data/a.json',{timeoutMs:25}),codes('timeout'));assert(Date.now()-start<1500);});
 await test('stalled streamed response body is also bounded',async()=>{global.fetch=async()=>new Response(new ReadableStream({start(){}}),{headers:{'content-type':'application/json'}});await assert.rejects(fetchJsonArray('/data/a.json',{timeoutMs:25}),codes('timeout'));});
 await test('timeout cancels an uncooperative response stream',async()=>{let cancels=0;const stream=new ReadableStream({start(){},cancel(){cancels++}});global.fetch=async()=>new Response(stream,{headers:{'content-type':'application/json'}});await assert.rejects(fetchJsonArray('/data/a.json',{timeoutMs:25}),codes('timeout'));await new Promise(r=>setTimeout(r,0));assert.equal(cancels,1);assert.equal(stream.locked,false);});
 await test('caller abort also cancels the body and releases its lock',async()=>{let cancels=0;const stream=new ReadableStream({start(){},cancel(){cancels++}}),c=new AbortController();global.fetch=async()=>new Response(stream,{headers:{'content-type':'application/json'}});const pending=fetchJsonArray('/data/a.json',{signal:c.signal});await new Promise(r=>setTimeout(r,0));c.abort();await assert.rejects(pending,codes('aborted'));await new Promise(r=>setTimeout(r,0));assert.equal(cancels,1);assert.equal(stream.locked,false);});
 await test('declared oversize body is rejected',async()=>{global.fetch=async()=>jsonResponse([],{headers:{'content-type':'application/json','content-length':'100'}});await assert.rejects(fetchJsonArray('/data/a.json',{maxBytes:8}),codes('too-large'));});
 await test('actual streamed bytes override a false small Content-Length',async()=>{global.fetch=async()=>jsonResponse([record],{headers:{'content-type':'application/json','content-length':'2'}});await assert.rejects(fetchJsonArray('/data/a.json',{maxBytes:32}),codes('too-large'));});
 await test('size is measured in UTF-8 bytes, not string characters',async()=>{global.fetch=async()=>jsonResponse(['한글']);await assert.rejects(fetchJsonArray('/data/a.json',{maxBytes:8}),codes('too-large'));});
 await test('split UTF-8 chunks decode without corrupting Korean text',async()=>{const raw=new TextEncoder().encode('["한글"]');global.fetch=async()=>new Response(new ReadableStream({start(c){for(const b of raw)c.enqueue(new Uint8Array([b]));c.close();}}),{headers:{'content-type':'application/json'}});assert.deepEqual(await fetchJsonArray('/data/a.json'),['한글']);});
 await test('invalid UTF-8 is rejected rather than silently replacing text',async()=>{global.fetch=async()=>new Response(new Uint8Array([91,34,255,34,93]),{headers:{'content-type':'application/json'}});await assert.rejects(fetchJsonArray('/data/a.json'),codes('format'));});
 await test('array item cap is enforced',async()=>{global.fetch=async()=>jsonResponse([1,2,3]);await assert.rejects(fetchJsonArray('/data/a.json',{maxItems:2}),codes('too-large'));});
 for(const options of [{timeoutMs:0},{timeoutMs:-1},{timeoutMs:Infinity},{timeoutMs:2**31},{maxBytes:0},{maxBytes:1.5},{maxItems:0}])await test(`invalid options ${JSON.stringify(options)}`,async()=>{let called=false;global.fetch=async()=>{called=true;return jsonResponse([])};await assert.rejects(fetchJsonArray('/data/a.json',options),codes('invalid-options'));assert.equal(called,false);});
 await test('pre-aborted callers cause no network request',async()=>{let calls=0;global.fetch=async()=>{calls++;return jsonResponse([])};const c=new AbortController();c.abort();await assert.rejects(fetchJsonArray('/data/a.json',{signal:c.signal}),codes('aborted'));assert.equal(calls,0);});
 await test('caller abort terminates an uncooperative pending fetch',async()=>{const c=new AbortController();let delivered;global.fetch=async(_,opts)=>{delivered=opts.signal;return new Promise(()=>{})};const promise=fetchJsonArray('/data/a.json',{signal:c.signal});c.abort();await assert.rejects(promise,codes('aborted'));assert.equal(delivered.aborted,true);});
 await test('abort listener is removed after success',async()=>{const c=new AbortController();let adds=0,removes=0;const add=c.signal.addEventListener.bind(c.signal),remove=c.signal.removeEventListener.bind(c.signal);c.signal.addEventListener=(...a)=>{adds++;return add(...a)};c.signal.removeEventListener=(...a)=>{removes++;return remove(...a)};global.fetch=async()=>jsonResponse([]);await fetchJsonArray('/data/a.json',{signal:c.signal});assert.equal(adds,1);assert.equal(removes,1);});
 await test('transport preserves same-origin auth but does not send writes',async()=>{let opts;global.fetch=async(_,o)=>{opts=o;return jsonResponse([])};await fetchJsonArray('/data/a.json');assert.equal(opts.credentials,'same-origin');assert.equal(opts.headers.Accept,'application/json');assert.equal(opts.method,undefined);assert.equal(opts.body,undefined);});
 for(const bad of [null,[],{}, {id:1},{id:' '},{id:'x',title:{}},{id:'x',category:5},{id:'x',tags:[{}]},{id:'x',image:false}])await test('invalid row isolated '+JSON.stringify(bad),()=>assert.equal(isCatalogueRecord(bad),false));
 await test('unknown metadata survives record validation',()=>{const x={...record,licence:{status:'unverified'}};assert.equal(isCatalogueRecord(x),true);assert.equal(x.licence.status,'unverified');});
 await test('editorial fallback preserves spacing and Korean',()=>assert.equal(firstText(null,' ','  한글 원문  ','English'),'  한글 원문  '));
 await test('explicitly empty tags remain empty',()=>assert.deepEqual(editorialTags([],['fallback']),[]));
 await test('tags are copied, not mutated through shared references',()=>{const tags=['원본'];const next=editorialTags(tags,[]);next.push('추가');assert.deepEqual(tags,['원본']);});
 await test('managed rows survive malformed neighbours',async()=>{global.fetch=async()=>jsonResponse([null,{id:4},record,{...record,id:'x',title:{}},{...record,id:'second'}]);const rows=await managed.loadManagedArtworks();assert.deepEqual(rows.map(x=>x.id),['lumos-test','second']);});
 await test('managed HTTP failure retains the old empty fallback',async()=>{global.fetch=async()=>jsonResponse([],{status:503});assert.deepEqual(await managed.loadManagedArtworks(),[]);});
 await test('static titles/descriptions/tags are retained',()=>{const raw=load('client/src/data/standardArtworks.ts').standardArtworks[0];const item=catalog.buildStaticCatalog().find(x=>x.id===raw.id);assert.equal(item.title,firstText(raw.titleKo,raw.title,raw.titleEn));assert.equal(item.description,raw.description);assert.deepEqual(item.tags,raw.tags ?? before.buildStaticCatalog().find(x=>x.id===raw.id).tags);});
 const stable = rows => rows.map(({title,titleKo,titleEn,description,tags,...rest})=>rest);
 await test('static catalogue identities, classifications and media do not change',()=>assert.deepEqual(canonical(stable(catalog.buildStaticCatalog())),canonical(stable(before.buildStaticCatalog()))));
 await test('managed Korean copy and metadata are not overwritten',()=>{const item=catalog.normalizeManagedCatalog([record])[0];assert.equal(item.title,'한글 작품명');assert.equal(item.titleEn,'English title');assert.equal(item.description,record.description);assert.deepEqual(item.tags,record.tags);});
 await test('managed exposure/line/media rules do not change',()=>{const rows=[record,{...record,id:'local-x',worldType:'local'}];assert.deepEqual(canonical(stable(catalog.normalizeManagedCatalog(rows))),canonical(stable(before.normalizeManagedCatalog(rows))));});
 await test('Content Manager title, description and original tags survive',async()=>{global.fetch=async()=>jsonResponse([record]);const [item]=await catalog.loadContentManagerCatalog();assert.equal(item.title,'한글 작품명');assert.equal(item.description,record.description);assert.deepEqual(item.tags,record.tags);});
 await test('Content Manager classifications and counts stay equal for valid inputs',async()=>{const data=Array.from({length:24},(_,i)=>({...record,id:'lumos-'+i,worldType:i%2?'local':'standard'}));global.fetch=async()=>jsonResponse(data);assert.deepEqual(canonical(stable(await catalog.loadContentManagerCatalog())),canonical(stable(await before.loadContentManagerCatalog())));});
 await test('bad entries are skipped without changing later entries Open cutoff',async()=>{const data=Array.from({length:14},(_,i)=>({...record,id:'lumos-'+i}));data[0]=null;global.fetch=async()=>jsonResponse(data);const rows=await catalog.loadContentManagerCatalog();assert.equal(rows.length,13);assert.equal(rows.find(x=>x.id==='lumos-11').accessTier,'open');assert.equal(rows.find(x=>x.id==='lumos-12').accessTier,'creator');});
 await test('content hook ignores broken rows but keeps static-first merge',async()=>{let effect;const state=[];const react={useState:v=>{const i=state.length;state.push(v);return[v,x=>{state[i]=x}]},useEffect:fn=>{effect=fn}};const hook=loader(false,{react})('client/src/hooks/useContentManager.ts');global.fetch=async()=>jsonResponse([null,{id:9},record]);hook.useContentManagerArtworks([{...record,id:'static',title:'Independent static work',videoSrc:'/videos/static-original.mp4'}],'standard');effect();await new Promise(r=>setTimeout(r,20));assert.equal(state[0],false);assert.deepEqual(state[1].map(x=>x.id),['static','lumos-test']);});
 await test('content hook preserves existing static-first media deduplication',async()=>{let effect;const state=[];const react={useState:v=>{const i=state.length;state.push(v);return[v,x=>{state[i]=x}]},useEffect:fn=>{effect=fn}};const hook=loader(false,{react})('client/src/hooks/useContentManager.ts');global.fetch=async()=>jsonResponse([record]);hook.useContentManagerArtworks([{...record,id:'static'}],'standard');effect();await new Promise(r=>setTimeout(r,20));assert.equal(state[0],false);assert.deepEqual(state[1].map(x=>x.id),['static']);});
 await test('content hook does not update a disposed subscriber',async()=>{let effect,resolver,writes=0;const react={useState:v=>[v,()=>writes++],useEffect:fn=>effect=fn};const hook=loader(false,{react})('client/src/hooks/useContentManager.ts');global.fetch=()=>new Promise(r=>resolver=r);hook.useContentManagerArtworks([],'standard');const dispose=effect();dispose();resolver(jsonResponse([record]));await new Promise(r=>setTimeout(r,20));assert.equal(writes,0);});
 await test('network failure clears loading and retains static artworks',async()=>{let effect;const state=[];const react={useState:v=>{const i=state.length;state.push(v);return[v,x=>state[i]=x]},useEffect:fn=>effect=fn};const hook=loader(false,{react})('client/src/hooks/useContentManager.ts');global.fetch=async()=>{throw new Error('network')};hook.useContentManagerArtworks([record],'standard');effect();await new Promise(r=>setTimeout(r,20));assert.equal(state[0],false);assert.deepEqual(canonical(state[1]),[record]);});
 const report={scope:'Unit-level public transport, mapping invariants, and mocked hook subscribers. Not a browser, live HTTP, authentication or mail-delivery test.',base:'30c8316d929d58b56f9127bf1da4f6a9ea6cf159',total:results.length,passed:results.filter(x=>x.ok).length,tests:results};
 fs.writeFileSync(path.join(output,'catalogue-resilience.json'),JSON.stringify(report,null,2));
 console.log('LUMOS_RESULT',JSON.stringify({total:report.total,passed:report.passed}));
 if(report.passed!==report.total) process.exitCode=1;
})().catch(e=>{global.fetch=originalFetch;console.error(e);process.exitCode=1;});
