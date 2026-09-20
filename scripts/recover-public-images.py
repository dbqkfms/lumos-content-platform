"""Back up missing, publicly served image bytes without changing site/catalogue.
The mutable deployment URL is a recovery source, NOT a permanent CDN decision.
"""
import argparse, concurrent.futures, hashlib, json, pathlib, urllib.request, urllib.parse


def main():
    p=argparse.ArgumentParser();p.add_argument('--report',required=True);p.add_argument('--output',required=True)
    args=p.parse_args();data=json.loads(pathlib.Path(args.report).read_text());out=pathlib.Path(args.output);out.mkdir(parents=True,exist_ok=True)
    origin=urllib.parse.urlsplit(data['origin']);candidates=[];skipped=[];budget=90*1024*1024
    for item in data['records']:
        size=int(item.get('contentLength') or 0);src=item['src']
        if item['exists'] or not item.get('mediaResponse') or not item.get('contentType','').startswith('image/'):continue
        if '..' in pathlib.PurePosixPath(src).parts or not src.startswith('/') or src.startswith('//'):continue
        if not size or size>8*1024*1024 or size>budget:
            skipped.append({'src':src,'reason':'bounded-recovery-size-limit'});continue
        budget-=size;candidates.append(item)
    def recover(item):
        src=item['src'];url=data['origin'].rstrip('/')+src
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'LUMOS-owned-site-image-recovery/1.0'}),timeout=25) as response:
                final=urllib.parse.urlsplit(response.url)
                if final.scheme!='https' or final.netloc!=origin.netloc:raise ValueError('unexpected recovery redirect')
                raw=response.read(8*1024*1024+1);mime=response.headers.get('Content-Type','').split(';')[0]
            if len(raw)>8*1024*1024 or not mime.startswith('image/'):raise ValueError('not a bounded image response')
            if not (raw.startswith(b'\xff\xd8\xff') or raw.startswith(b'\x89PNG\r\n\x1a\n') or raw[:4]==b'RIFF'):
                raise ValueError('unrecognized image signature')
            target=out/'files'/src.lstrip('/');target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
            return {'src':src,'sourceUrl':url,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'recovered':True}
        except Exception as exc:return {'src':src,'sourceUrl':url,'recovered':False,'error':str(exc)}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:records=list(pool.map(recover,candidates))
    result={'scope':'exact public-image backup only; no site mutation or new publication rights',
            'recoveryOrigin':data['origin'],'immutableHostingConfirmed':False,'videosDownloaded':0,
            'recovered':sum(x['recovered'] for x in records),'failed':sum(not x['recovered'] for x in records),
            'bytes':sum(x.get('bytes',0) for x in records),'records':records,'skipped':skipped}
    (out/'recovery-manifest.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    print(json.dumps({k:v for k,v in result.items() if k not in ['records','skipped']},ensure_ascii=False,indent=2))

if __name__=='__main__':main()
