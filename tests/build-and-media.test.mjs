import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { writeBuildInfo } from '../scripts/write-build-info.mjs';
import { auditMedia } from '../scripts/audit-media.mjs';

function fixture(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'lumos-build-'));
  const put = (name, content='') => { const p=path.join(root,name); fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,content); };
  try { return fn(root,put); } finally { fs.rmSync(root,{recursive:true,force:true}); }
}
const html = '<!doctype html><html><head><title>LUMOS</title></head><body></body></html>';
test('missing application build is an error', () => fixture((root) => assert.throws(() => writeBuildInfo({root,env:{}}),/missing/)));
test('unknown revision is explicit; secrets are never serialized', () => fixture((root,put) => {
  put('dist/public/index.html',html); put('dist/public/assets/index-test.js','console.log(1)');
  const info = writeBuildInfo({root,env:{GMAIL_APP_PASSWORD:'NEVER_COPY_THIS'}});
  assert.equal(info.commit,null); assert.equal(info.dirty,null); assert.equal(info.revisionEvidence,'unknown');
  assert.ok(!fs.readFileSync(path.join(root,'dist/public/build-info.json'),'utf8').includes('NEVER_COPY_THIS'));
  assert.equal(Object.keys(info.bundles).length,1);
}));
test('Vercel supplied revision is labeled, not pretended clean Git', () => fixture((root,put) => {
  put('dist/public/index.html',html);
  const info=writeBuildInfo({root,env:{VERCEL_GIT_COMMIT_SHA:'a'.repeat(40),VERCEL_GIT_REPO_OWNER:'dbqkfms',VERCEL_GIT_REPO_SLUG:'lumos-content-platform'}});
  assert.equal(info.commit,'a'.repeat(40)); assert.equal(info.revisionEvidence,'vercel'); assert.equal(info.dirty,null);
}));
test('running twice never duplicates metadata', () => fixture((root,put) => {
  put('dist/public/index.html',html); writeBuildInfo({root,env:{}}); writeBuildInfo({root,env:{}});
  assert.equal(fs.readFileSync(path.join(root,'dist/public/index.html'),'utf8').match(/name="lumos:commit"/g).length,1);
}));
test('bundle fingerprint changes when compiled code changes', () => fixture((root,put) => {
  put('dist/public/index.html',html);put('dist/public/assets/main.js','one');const a=writeBuildInfo({root,env:{}});
  put('dist/public/assets/main.js','two');const b=writeBuildInfo({root,env:{}});assert.notEqual(a.bundleFingerprint,b.bundleFingerprint);
}));
test('conflicting declared and platform revisions fail closed', () => fixture((root,put) => {
  put('dist/public/index.html',html);assert.throws(()=>writeBuildInfo({root,env:{LUMOS_SOURCE_COMMIT:'b'.repeat(40),VERCEL_GIT_COMMIT_SHA:'a'.repeat(40)}}),/conflict/);
}));
test('Git revision and dirty status are measured, remote credentials stripped', () => fixture((root,put) => {
  const git=(...args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();
  git('init');git('config','user.name','LUMOS Test');git('config','user.email','test@example.invalid');
  put('.gitignore','dist/\n');put('tracked.txt','baseline');git('add','.');git('commit','-m','fixture');
  git('remote','add','origin','https://TOKEN@github.com/dbqkfms/lumos-content-platform.git');
  put('dist/public/index.html',html);const a=writeBuildInfo({root,env:{}});assert.equal(a.dirty,false);
  assert.equal(a.repository,'dbqkfms/lumos-content-platform');assert.ok(!JSON.stringify(a).includes('TOKEN'));
  put('tracked.txt','edited');assert.equal(writeBuildInfo({root,env:{}}).dirty,true);
}));
test('media audit reports missing file and deduplicates literal references', () => fixture((root,put) => {
  put('client/src/Home.tsx','const a="/videos/missing.mp4"; const b="/videos/missing.mp4"; const c="/thumbnails/good.jpg";');
  put('client/public/thumbnails/good.jpg','image');
  const r=auditMedia(root); assert.equal(r.total,2);assert.equal(r.missing,1);assert.equal(r.assets[0].tracked,null);
}));
test('media audit includes exported JSON, not external URLs or traversal', () => fixture((root,put) => {
  put('client/public/data/items.json',JSON.stringify([{image:'/generated-thumbnails/a.jpg',embedUrl:'https://player.vimeo.com/video/1'}]));
  put('client/src/Bad.tsx','const x="/../secret.mp4";const y=`/videos/${id}.mp4`;');
  const r=auditMedia(root);assert.equal(r.total,2);assert.equal(r.missing,2);assert.equal(r.scope,'literal-local-references-only');
}));
test('present but untracked media is a reproducibility failure', () => fixture((root,put) => {
  execFileSync('git',['-C',root,'init'],{stdio:'ignore'});
  put('client/src/Home.tsx','const a="/videos/local.mp4";');put('client/public/videos/local.mp4','media');
  assert.equal(auditMedia(root).presentButUntracked,1);
}));
