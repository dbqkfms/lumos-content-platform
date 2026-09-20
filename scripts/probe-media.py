"""Read-only local-path availability checks on the supplied public deployment.
Only headers are fetched; response 200 with HTML is NOT a media success.
No files or source catalogue entries are overwritten.
"""
import argparse, concurrent.futures, json, pathlib, urllib.request, urllib.parse

def probe(origin, record):
    src=record['src']
    if not src.startswith('/') or src.startswith('//') or '..' in pathlib.PurePosixPath(src).parts:
        return {'src':src,'error':'unsafe-relative-path'}
    url=origin.rstrip('/')+src
    try:
        req=urllib.request.Request(url,method='HEAD',headers={'User-Agent':'LUMOS-readonly-media-audit/1.0'})
        with urllib.request.urlopen(req,timeout=12) as r:
            ctype=r.headers.get('Content-Type','').split(';')[0].strip()
            expected='video/' if src.lower().endswith(('.mp4','.webm','.mov')) else 'image/'
            return {**record,'url':url,'finalUrl':r.url,'status':r.status,'contentType':ctype,
                    'contentLength':r.headers.get('Content-Length'),
                    'mediaResponse':r.status in [200,206] and ctype.startswith(expected),
                    'note':'headers-only; not a playback/visual-identity/rights check'}
    except Exception as e:return {**record,'url':url,'error':str(e),'mediaResponse':False}

def main():
    p=argparse.ArgumentParser();p.add_argument('--origin',required=True);p.add_argument('--report',required=True);p.add_argument('--output',required=True)
    args=p.parse_args();report=json.loads(pathlib.Path(args.report).read_text());out=pathlib.Path(args.output)
    if not args.origin.startswith('https://'):p.error('a public HTTPS origin is required')
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        records=list(pool.map(lambda x:probe(args.origin,x),report['assets']))
    result={'scope':'literal-local-reference HTTP HEAD checks; no media replaced','origin':args.origin,
            'total':len(records),'validMediaResponse':sum(x.get('mediaResponse',False) for x in records),
            'failed':sum(not x.get('mediaResponse',False) for x in records),'records':records}
    out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(result,ensure_ascii=False,indent=2))
    print(json.dumps({k:v for k,v in result.items() if k!='records'},ensure_ascii=False,indent=2))
if __name__=='__main__':main()
