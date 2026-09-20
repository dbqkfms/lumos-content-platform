/** Read-only evidence audit. No public export, no approvals, no catalogue write. */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const { loadTs }=require('./audit-catalog.cjs');
const { evaluatePublication }=loadTs(path.resolve(__dirname,'../client/src/lib/publicationPolicy.ts'));
function stable(v){
 if(Array.isArray(v))return v.map(stable);
 if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]));
 return v;
}
function metadataRevision(row){
 const fields=['id','title','titleKo','description','image','videoSrc','embedUrl','resolution','runtime','worldType','accessTier','tags'];
 const selected=Object.fromEntries(fields.filter(k=>row[k]!==undefined).map(k=>[k,row[k]]));
 return 'catalog-meta-v1:'+crypto.createHash('sha256').update(JSON.stringify(stable(selected))).digest('hex');
}
function auditPublication(catalog, reviews=[], now=new Date().toISOString()){
 if(!catalog||!Array.isArray(catalog.records)||!Array.isArray(catalog.rejectedRecords)||!Array.isArray(reviews))throw new Error('invalid-audit-input');
 const rows=[...catalog.records,...catalog.rejectedRecords.map(x=>({...x,image:'',rejectedReason:x.reason}))];
 const ids=new Set();for(const row of rows){if(!row.id||ids.has(row.id))throw new Error('duplicate-or-missing-catalog-id');ids.add(row.id);}
 const map=new Map();for(const review of reviews){if(!review||!ids.has(review.artworkId)||map.has(review.artworkId))throw new Error('orphan-or-duplicate-review');map.set(review.artworkId,review);}
 const records=rows.map(row=>{
  const revision=metadataRevision(row);
  const decision=evaluatePublication(map.get(row.id),{artworkId:row.id,revision,now});
  return {artworkId:row.id,title:row.title,revision,revisionEvidence:'metadata-only-not-media-bytes',
   mediaVersionVerificationRequired:true,rejectedReason:row.rejectedReason||null,
   decision,policyEligible:decision.publicListingAllowed&&!row.rejectedReason,
   reviewFieldsRequired:['publication','quality','previewRights','loop','resize','license'],
   nextAction:row.rejectedReason?'restore-correct-thumbnail-then-review':'confirm-current-media-version-and-evidence-before-approval'};
 });
 const result={schemaVersion:1,scope:'read-only-review-queue; no files published or rights granted',evaluatedAt:now,
  total:records.length,rejectedMediaRows:records.filter(r=>r.rejectedReason).length,
  suppliedReviewRecords:reviews.length,policyEligible:records.filter(r=>r.policyEligible).length,
  automaticallyPublished:0,releaseReady:false,
  releaseBlockers:['actual-deployment-source-required','authorized-review-records-required','media-version-verification-required'],records};
 return result;
}
module.exports={metadataRevision,auditPublication};
if(require.main===module){
 const args=process.argv.slice(2);const arg=k=>args[args.indexOf(k)+1];
 const input=args.includes('--catalog-report')?arg('--catalog-report'):path.resolve(__dirname,'../dist/audits/catalog-report.json');
 const reviews=args.includes('--reviews')?JSON.parse(fs.readFileSync(arg('--reviews'),'utf8')):[];
 const report=auditPublication(JSON.parse(fs.readFileSync(input,'utf8')),reviews);
 const out=path.resolve(__dirname,'../dist/audits/publication-policy-report.json');fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({...report,records:undefined},null,2));
}
