"""Read-only browser audit. POST/PUT/PATCH/DELETE are blocked, including inquiry delivery.
Run in a disposable browser: python scripts/browser-audit.py --origin URL --output PATH.
Screenshots and measured DOM are evidence, not a claim of tested licensing/backend security.
"""
from __future__ import annotations
import argparse, json, pathlib, re, subprocess
from playwright.sync_api import sync_playwright

ROUTES = ['/', '/open', '/originals', '/creator-works', '/standard', '/local',
          '/solutions', '/platform', '/about', '/contact', '/login',
          '/portal/artist', '/portal/admin', '/artwork/standard-sansu', '/artwork/lumos-1ce87ca3']
STATE_JS = """() => ({
 title:document.title,
 headings:[...document.querySelectorAll('h1,h2')].map(x=>({level:x.tagName,text:x.innerText})),
 links:[...document.querySelectorAll('a[href]')].map(x=>({text:x.innerText,href:x.getAttribute('href')})),
 buttons:[...document.querySelectorAll('button')].map(x=>({text:x.innerText,label:x.getAttribute('aria-label')})),
 width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
 overflowElements:[...document.querySelectorAll('body *')].filter(x=>{
   const r=x.getBoundingClientRect();const s=getComputedStyle(x);
   return r.width>0 && s.visibility!=='hidden' && (r.right>innerWidth+2 || r.left < -2);
 }).slice(0,12).map(x=>({tag:x.tagName,cls:x.className?.baseVal??x.className,text:x.innerText?.slice(0,100)})),
 images:[...document.images].map(x=>({src:x.currentSrc||x.src,complete:x.complete,width:x.naturalWidth,height:x.naturalHeight,lazy:x.loading})),
 videos:[...document.querySelectorAll('video')].map(x=>({src:x.currentSrc||x.src||x.querySelector('source')?.src,
   readyState:x.readyState,error:x.error?.code??null,paused:x.paused,time:x.currentTime,width:x.videoWidth,height:x.videoHeight})),
 iframes:[...document.querySelectorAll('iframe')].map(x=>({src:x.src,title:x.title})),
 metadata:[...document.head.querySelectorAll('meta[name],meta[property]')].map(x=>({key:x.name||x.getAttribute('property'),content:x.content})),
 cards:document.querySelectorAll('.gallery-card').length,
 bodyText:document.body.innerText
})"""

def run(origin: str, output: pathlib.Path, channel: str | None):
    output.mkdir(parents=True,exist_ok=True)
    report={'origin':origin, 'scope':'disposable-readonly-browser; no real inquiry delivery; no authentication bypass',
            'viewports':[1440,390], 'pages':[], 'interactions':[], 'blockedWrites':[]}
    report['fontFallback'] = subprocess.run(['fc-match','Noto Sans CJK KR'],capture_output=True,text=True).stdout.strip()
    with sync_playwright() as p:
        options={'headless':True}
        if channel: options['channel']=channel
        browser=p.chromium.launch(**options)
        report['browserVersion']=browser.version
        for width in [1440,390]:
            context=browser.new_context(viewport={'width':width,'height':900 if width==1440 else 844},
                                       device_scale_factor=1, is_mobile=width==390, has_touch=width==390)
            def guard(route):
                request=route.request
                if request.method not in ['GET','HEAD','OPTIONS']:
                    report['blockedWrites'].append({'method':request.method,'url':request.url.split('?')[0]})
                    route.abort('blockedbyclient')
                else: route.continue_()
            context.route('**/*',guard)
            for route in ROUTES:
                page=context.new_page()
                errors=[]; failed=[]; transport=[]
                page.on('pageerror',lambda error, log=errors: log.append(str(error)))
                page.on('response',lambda response, log=failed: log.append({'status':response.status,'url':response.url}) if response.status>=400 else None)
                page.on('requestfailed',lambda request,log=transport: log.append({'url':request.url,'failure':request.failure}))
                record={'route':route,'viewport':width}
                name=(route.strip('/').replace('/','_') or 'home')+f'-{width}'
                try:
                    response=page.goto(origin.rstrip('/')+route,wait_until='domcontentloaded',timeout=25000)
                    record['httpStatus']=response.status if response else None
                    page.wait_for_function("document.body && document.body.innerText.trim().length>30", timeout=15000)
                    page.evaluate('async () => { await Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,5000))]); }')
                    page.wait_for_timeout(1500)
                    record['finalUrl']=page.url
                    state=page.evaluate(STATE_JS)
                    (output/f'{name}.json').write_text(json.dumps(state,ensure_ascii=False,indent=2))
                    (output/f'{name}.txt').write_text(state['bodyText'])
                    record.update({k:state[k] for k in ['title','headings','width','scrollWidth','cards','videos','iframes']})
                    record['horizontalOverflow']=state['scrollWidth']>width+2
                    record['failedLoadedImages']=[x for x in state['images'] if x['complete'] and x['width']==0]
                    page.screenshot(path=str(output/f'{name}.png'),animations='disabled',timeout=15000)
                    if route in ['/','/solutions'] and page.evaluate('document.documentElement.scrollHeight')<18000:
                        page.screenshot(path=str(output/f'{name}-full.png'),full_page=True,animations='disabled',timeout=15000)
                except Exception as exc:
                    record['auditError']=str(exc)
                record['pageErrors']=errors
                record['httpErrors']=failed
                record['transportErrors']=transport
                report['pages'].append(record)
                page.close()
            page=context.new_page()
            try:
                page.goto(origin.rstrip('/')+'/creator-works',wait_until='domcontentloaded')
                page.wait_for_selector('.gallery-card',timeout=20000)
                search=page.locator('input[placeholder*="검색"]').first
                if search.count():
                    search.fill('의도적으로없는검색어_검증_64391')
                    page.wait_for_timeout(250)
                    empty=page.locator('.gallery-card').count()==0
                    search.fill('');page.wait_for_timeout(250)
                    report['interactions'].append({'viewport':width,'name':'search-empty-and-clear','emptyResult':empty,'restoredCards':page.locator('.gallery-card').count()})
                first=page.locator('.gallery-card').first
                card_title=first.locator('h3').inner_text()
                first.click();page.wait_for_timeout(600)
                page.screenshot(path=str(output/f'selected-detail-{width}.png'),animations='disabled')
                detail_title=page.locator('h1').first.inner_text() if page.locator('h1').count() else None
                report['interactions'].append({'viewport':width,'name':'card-to-detail-title','card':card_title,'detail':detail_title,'equal':card_title==detail_title,'url':page.url})
                inquiry=page.get_by_role('button',name=re.compile('이 작품.*문의')).first
                if inquiry.count():
                    primary_ok=True
                    try: inquiry.click(timeout=5000)
                    except Exception as exc:
                        primary_ok=False
                        report['interactions'].append({'viewport':width,'name':'primary-detail-inquiry','clickable':False,'error':str(exc)})
                        page.get_by_role('button',name=re.compile('이 작품.*문의')).last.click(timeout=5000)
                    if primary_ok:report['interactions'].append({'viewport':width,'name':'primary-detail-inquiry','clickable':True})
                    page.wait_for_timeout(300)
                    fields=[field.input_value() for field in page.locator('textarea').all()]
                    dialog=page.locator('[role=dialog]')
                    report['interactions'].append({'viewport':width,'name':'artwork-inquiry-prefill','title':detail_title,'messages':fields,'titlePresent':bool(detail_title and any(detail_title in t for t in fields)),'dialogRole':dialog.count()})
                    page.screenshot(path=str(output/f'inquiry-{width}.png'),animations='disabled')
                    if dialog.count():
                        page.keyboard.press('Tab');page.keyboard.press('Shift+Tab')
                        report['interactions'].append({'viewport':width,'name':'dialog-focus-contained','contained':page.evaluate("!!document.querySelector('[role=dialog]')?.contains(document.activeElement)")})
                    if origin.startswith('http://127.0.0.1') and dialog.count():
                        request_bodies=[]
                        def mocked_failure(route):
                            request_bodies.append(route.request.post_data_json)
                            route.fulfill(status=503,content_type='application/json',body='{"error":"synthetic-test"}')
                        context.route('https://formspree.io/f/*',mocked_failure)
                        page.get_by_placeholder('담당자 이름').fill('LUMOS 자동검증')
                        page.get_by_placeholder('name@company.com').fill('qa@example.invalid')
                        page.get_by_role('button',name='Send Inquiry').click(timeout=5000)
                        page.wait_for_timeout(600)
                        retained=page.get_by_placeholder('담당자 이름').input_value()=='LUMOS 자동검증'
                        report['interactions'].append({'viewport':width,'name':'synthetic-inquiry-failure-preserves-input','synthetic':True,'retained':retained,'requests':request_bodies})
                        context.unroute('https://formspree.io/f/*',mocked_failure)
                    page.keyboard.press('Escape');page.wait_for_timeout(300)
                    report['interactions'].append({'viewport':width,'name':'inquiry-escape','textareasVisible':page.locator('textarea:visible').count()})
                page.evaluate("history.pushState({}, '', '/artwork/audit-id-does-not-exist'); window.dispatchEvent(new PopStateEvent('popstate'));")
                page.wait_for_timeout(450)
                report['interactions'].append({'viewport':width,'name':'nonexistent-spa-artwork','bodyText':page.locator('body').inner_text()[:1000],'h1':page.locator('h1').all_inner_texts()})
            except Exception as exc:
                report['interactions'].append({'viewport':width,'name':'interaction-audit','error':str(exc)})
            page.close();context.close()
        browser.close()
    (output/'browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps({'origin':origin,'pages':len(report['pages']),'auditErrors':sum('auditError' in x for x in report['pages']),
                      'pageErrors':sum(bool(x['pageErrors']) for x in report['pages']),
                      'overflowPages':sum(x.get('horizontalOverflow',False) for x in report['pages']),
                      'interactions':report['interactions']},ensure_ascii=False,indent=2))
    return report

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--origin',required=True);parser.add_argument('--output',required=True);parser.add_argument('--channel')
    args=parser.parse_args()
    if not re.match(r'^https?://',args.origin):parser.error('origin must be an HTTP(S) URL')
    run(args.origin,pathlib.Path(args.output),args.channel)
