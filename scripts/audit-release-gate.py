"""Fail-closed review gate. No deployment, source approval or rights approval.

Reads evidence produced in the SAME workflow run. A successful shell command is
not a successful UI test. DOM card observations are not a publication allowlist.
"""
from __future__ import annotations
import argparse
from collections import Counter
from datetime import datetime, timezone
import json
from pathlib import Path
import re
from urllib.parse import urlsplit

ROUTES = ('/', '/open', '/originals', '/creator-works', '/standard', '/local',
          '/solutions', '/platform', '/about', '/contact', '/login',
          '/portal/artist', '/portal/admin', '/artwork/standard-sansu', '/artwork/lumos-1ce87ca3')
WIDTHS = (1440, 390)
COMMANDS = ('test:round1', 'check', 'audit:media', 'build', 'test:round2',
            'catalog', 'python-tests', 'publication-policy')
MAX_JSON = 16 * 1024 * 1024
SHA = re.compile(r'^[a-f0-9]{40}$')


def read_json(path: Path):
    if path.stat().st_size > MAX_JSON:
        raise ValueError('evidence file exceeds size limit')
    def no_duplicates(pairs):
        result = {}
        for key, value in pairs:
            if key in result:
                raise ValueError('duplicate JSON key')
            result[key] = value
        return result
    return json.loads(path.read_text(encoding='utf-8'), object_pairs_hook=no_duplicates,
                      parse_constant=lambda _: (_ for _ in ()).throw(ValueError('non-finite JSON number')))


def utc(value):
    if not isinstance(value, str) or not value.endswith('Z'):
        return None
    try:
        return datetime.fromisoformat(value[:-1] + '+00:00')
    except ValueError:
        return None


def counted(values):
    return Counter(json.dumps(x, ensure_ascii=False, sort_keys=True) for x in values)


def compare_contract(before, after):
    """Compare only the observed DOM state, never infer all public artwork IDs."""
    def valid(c):
        return (isinstance(c, dict) and c.get('schemaVersion') == 1 and
                c.get('scope') == 'rendered-dom-initial-state' and
                isinstance(c.get('cards'), list) and
                all(isinstance(x, dict) and isinstance(x.get('title'), str) and x['title'].strip()
                    and (x.get('posterPath') is None or isinstance(x['posterPath'], str)) for x in c['cards']) and
                isinstance(c.get('navigationPaths'), list) and all(isinstance(x, str) for x in c['navigationPaths']) and
                isinstance(c.get('policyPaths'), list) and all(isinstance(x, str) for x in c['policyPaths']))
    if not valid(before) or not valid(after):
        return {'status': 'unknown', 'reason': 'missing-or-invalid-dom-contract'}
    # A stable title + literal poster path works for legacy cards without data-ID.
    # It is a presentation signature, NOT an authenticated artwork identity.
    def signature(c):
        return [{'title': x['title'].strip(), 'posterPath': x.get('posterPath')} for x in c['cards']]
    b, a = counted(signature(before)), counted(signature(after))
    added = [json.loads(x) for x in (a - b).elements()]
    removed = [json.loads(x) for x in (b - a).elements()]
    nav_lost = sorted(set(before['navigationPaths']) - set(after['navigationPaths']))
    policy_lost = sorted(set(before['policyPaths']) - set(after['policyPaths']))
    # If both render explicit IDs, additionally compare those even with equal titles.
    ids_b = [c.get('artworkId') for c in before['cards']]
    ids_a = [c.get('artworkId') for c in after['cards']]
    explicit_ids = bool(ids_b or ids_a) and all(isinstance(x, str) and x for x in ids_b + ids_a)
    id_changed = bool(explicit_ids and Counter(ids_b) != Counter(ids_a))
    return {'status': 'changed' if added or removed or nav_lost or policy_lost or id_changed else 'same-observed-state',
            'scope': 'rendered-dom-initial-state-not-full-catalogue',
            'beforeCount': len(before['cards']), 'afterCount': len(after['cards']),
            'addedCards': added, 'removedCards': removed,
            'missingNavigationPaths': nav_lost, 'missingPolicyPaths': policy_lost,
            'explicitIdsCompared': explicit_ids, 'explicitIdsChanged': id_changed}


def evaluate(root: Path, expected_revision: str, expected_run: str, now=None):
    root = Path(root)
    now = now or datetime.now(timezone.utc)
    issues, comparisons = [], []
    def issue(code, **detail):
        issues.append({'code': code, **detail})
    def load(relative):
        try:
            value = read_json(root / relative)
            if not isinstance(value, dict):
                raise ValueError('expected object')
            return value
        except (OSError, ValueError, TypeError, RecursionError) as exc:
            issue('missing-or-invalid-evidence', file=relative, error=type(exc).__name__)
            return {}

    if not SHA.fullmatch(expected_revision or '') or not str(expected_run).isdigit():
        issue('invalid-expected-run-identity')
    revision = load('revision.json')
    if revision.get('head') != expected_revision or str(revision.get('runId', '')) != str(expected_run):
        issue('revision-evidence-mismatch')

    command_codes = {}
    try:
        lines = (root / 'exit-codes.txt').read_text(encoding='utf-8').splitlines()
        for line in lines:
            matched = re.fullmatch(r'([a-z0-9:-]+)=(0|[1-9][0-9]{0,2})', line)
            if not matched:
                issue('invalid-command-result', line=line[:160]); continue
            name, code = matched[1], int(matched[2])
            if name in command_codes:
                issue('duplicate-command-result', command=name)
            command_codes[name] = code
        for name in COMMANDS:
            if name not in command_codes:
                issue('command-not-run', command=name)
            elif command_codes[name] != 0:
                issue('command-failed', command=name, exitCode=command_codes[name])
        for name in command_codes.keys() - set(COMMANDS):
            issue('unexpected-command-result', command=name)
    except OSError:
        issue('missing-command-results')

    media = load('audits/media-report.json')
    # No source media files are added or silently accepted by this gate.
    if (type(media.get('missing')) is not int or type(media.get('presentButUntracked')) is not int or type(media.get('total')) is not int or
            media['missing'] < 0 or media['presentButUntracked'] < 0 or media['total'] < 0 or
            media['missing'] + media['presentButUntracked'] > media['total']):
        issue('invalid-media-audit')
    elif media['missing'] or media['presentButUntracked']:
        issue('media-not-reproducible', missing=media['missing'], presentButUntracked=media['presentButUntracked'])
    assets = media.get('assets')
    if (not isinstance(assets,list) or len(assets) != media.get('total') or
            any(not isinstance(x,dict) or type(x.get('exists')) is not bool or x.get('tracked') not in (True,False,None) for x in (assets or []))):
        issue('invalid-media-entries')
    elif any(x.get('tracked') is None or type(x.get('tracked')) is not bool for x in assets):
        issue('media-tracking-not-verified')
    elif (sum(not x['exists'] for x in assets) != media.get('missing') or
          sum(x['exists'] and x.get('tracked') is False for x in assets) != media.get('presentButUntracked')):
        issue('media-counts-mismatch')
    build = load('build-info.json')
    if build.get('commit') != expected_revision:
        issue('built-revision-mismatch')
    if build.get('dirty') is not False:
        issue('built-working-tree-not-proven-clean')

    reports, page_maps, interactions = {}, {}, {}
    expected_states = {(r, w) for r in ROUTES for w in WIDTHS}
    for kind in ('live', 'review'):
        report = load(f'{kind}-browser/browser-report.json'); reports[kind] = report
        if report.get('schemaVersion') != 2 or report.get('auditRevision') != expected_revision or str(report.get('auditRunId','')) != str(expected_run):
            issue('browser-evidence-stale-or-unbound', target=kind)
        expected_origin = 'https://lumos-v2-preview.vercel.app' if kind == 'live' else 'http://127.0.0.1:4173'
        if report.get('origin') != expected_origin:
            issue('browser-origin-mismatch',target=kind)
        start, end = utc(report.get('startedAt')), utc(report.get('completedAt'))
        if start is None or end is None or start > end or end > now or (now - end).total_seconds() > 3600:
            issue('browser-evidence-time-invalid', target=kind)
        if report.get('requestPolicy') != {'mutations': 'blocked', 'serviceWorkers': 'blocked', 'webSockets': 'blocked'}:
            issue('readonly-browser-policy-missing', target=kind)
        pages = report.get('pages', [])
        if not isinstance(pages, list):
            issue('invalid-browser-pages', target=kind); pages=[]
        mapped = {}
        for page in pages:
            if not isinstance(page, dict):
                issue('invalid-browser-page', target=kind); continue
            route, width = page.get('route'), page.get('viewport')
            if not isinstance(route,str) or type(width) is not int:
                issue('invalid-browser-page', target=kind); continue
            key=(route,width)
            if key in mapped:
                issue('duplicate-browser-state', target=kind, route=route, viewport=width)
            mapped[key]=page
        page_maps[kind]=mapped
        for route,width in expected_states - set(mapped):
            issue('browser-state-not-tested', target=kind, route=route, viewport=width)
        for key,page in mapped.items():
            if key not in expected_states:
                issue('unexpected-browser-state', target=kind, route=key[0], viewport=key[1]); continue
            if page.get('auditError'):
                issue('browser-capture-failed', target=kind, route=key[0], viewport=key[1])
            final_url = page.get('finalUrl')
            try:
                parsed = urlsplit(final_url) if isinstance(final_url,str) else None
                allowed_paths = {key[0]}
                if key[0].startswith('/portal/'):
                    allowed_paths.update(('/login', '/sign-in', '/auth/signin'))
                correct_location = parsed is not None and parsed.scheme+'://'+parsed.netloc == expected_origin and (parsed.path.rstrip('/') or '/') in allowed_paths
            except ValueError:
                correct_location = False
            if not correct_location:
                issue('browser-final-location-mismatch',target=kind,route=key[0],viewport=key[1])
            contract = page.get('contract')
            if not isinstance(contract,dict) or contract.get('scope') != 'rendered-dom-initial-state':
                issue('browser-contract-not-captured', target=kind, route=key[0], viewport=key[1])
            # Live defects are evidence for repair, not requirements to reproduce.
            if kind == 'review':
                if type(page.get('httpStatus')) is not int or not 200 <= page['httpStatus'] < 300:
                    issue('review-route-http-failure', route=key[0], viewport=key[1], status=page.get('httpStatus'))
                if page.get('pageErrors') != []:
                    issue('review-runtime-error-or-missing-check', route=key[0], viewport=key[1])
                if page.get('horizontalOverflow') is not False:
                    issue('review-layout-overflow-or-missing-check', route=key[0], viewport=key[1])
                if page.get('failedLoadedImages') != []:
                    issue('review-image-error-or-missing-check', route=key[0], viewport=key[1])
        vals=report.get('interactions',[])
        im={}
        if not isinstance(vals,list):
            issue('invalid-interactions',target=kind);vals=[]
        for row in vals:
            if not isinstance(row,dict) or type(row.get('viewport')) is not int or not isinstance(row.get('name'),str):
                issue('invalid-interaction',target=kind);continue
            key=(row['name'],row['viewport'])
            if key in im: issue('duplicate-interaction',target=kind,name=key[0],viewport=key[1])
            im[key]=row
        interactions[kind]=im

    # Critical journeys must have run and passed, not merely emitted a JSON report.
    predicates={
      'search-empty-and-clear':lambda x:x.get('emptyResult') is True and type(x.get('restoredCards')) is int and x['restoredCards']>0,
      'card-to-detail-title':lambda x:x.get('equal') is True and bool(x.get('card')) and x.get('card')==x.get('detail'),
      'primary-detail-inquiry':lambda x:x.get('clickable') is True,
      'artwork-inquiry-prefill':lambda x:x.get('titlePresent') is True and x.get('dialogRole')==1,
      'dialog-focus-contained':lambda x:x.get('contained') is True,
      'inquiry-escape':lambda x:x.get('textareasVisible')==0,
      'synthetic-inquiry-failure-preserves-input':lambda x:x.get('synthetic') is True and x.get('retained') is True and isinstance(x.get('requests'),list) and len(x['requests'])==1,
      'nonexistent-spa-artwork':lambda x:isinstance(x.get('bodyText'),str) and '작품을 찾을 수 없습니다' in x['bodyText'],
    }
    for width in WIDTHS:
        for name,predicate in predicates.items():
            row=interactions['review'].get((name,width))
            if row is None:
                issue('journey-not-tested',name=name,viewport=width)
            elif row.get('error') or not predicate(row):
                issue('journey-failed',name=name,viewport=width)
        b=interactions['live'].get(('inquiry-form-contract',width),{})
        a=interactions['review'].get(('inquiry-form-contract',width),{})
        def valid_form(x):
            return (isinstance(x.get('fields'),list) and bool(x['fields']) and
                    all(isinstance(f,dict) and isinstance(f.get('kind'),str) and isinstance(f.get('label'),str)
                        and type(f.get('required')) is bool for f in x['fields']) and isinstance(x.get('policyPaths'),list) and all(isinstance(p,str) for p in x['policyPaths']))
        if not valid_form(a) or not valid_form(b):
            issue('inquiry-form-contract-unverified',viewport=width)
        else:
            missing=list((counted(b['fields'])-counted(a['fields'])).elements())
            lost=sorted(set(b['policyPaths'])-set(a['policyPaths']))
            if missing or lost:
                before_kinds=Counter(f['kind'] for f in b['fields'])
                after_kinds=Counter(f['kind'] for f in a['fields'])
                issue('inquiry-form-regression',viewport=width,beforeFieldCount=len(b['fields']),afterFieldCount=len(a['fields']),
                      missingFieldKinds=dict(before_kinds-after_kinds),
                      missingOrChangedFieldSignatures=[json.loads(x) for x in missing],missingPolicyPaths=lost)

    for route,width in sorted(expected_states):
        b=page_maps['live'].get((route,width),{})
        a=page_maps['review'].get((route,width),{})
        delta=compare_contract(b.get('contract'),a.get('contract'))
        if route.startswith('/portal/'):
            def access_path(page):
                try:
                    v=page.get('finalUrl');u=urlsplit(v) if isinstance(v,str) else None
                    return (u.path.rstrip('/') or '/') if u else None
                except ValueError:
                    return None
            before_path,after_path=access_path(b),access_path(a)
            delta['observedAccessFlow']={'beforePath':before_path,'afterPath':after_path,
                'scope':'unauthenticated-client-navigation-only-not-backend-authorization'}
            if before_path is None or after_path is None:
                issue('portal-access-flow-unverified',route=route,viewport=width)
            elif before_path != after_path:
                issue('portal-access-flow-regression',route=route,viewport=width,beforePath=before_path,afterPath=after_path)
        comparisons.append({'route':route,'viewport':width,**delta})
        if delta['status'] != 'same-observed-state':
            issue('deployment-ui-difference' if delta['status']=='changed' else 'deployment-ui-comparison-unknown',route=route,viewport=width)

    return {'schemaVersion':1,'auditRevision':expected_revision,'auditRunId':str(expected_run),
            'evaluatedAt':now.isoformat().replace('+00:00','Z'),
            'automatedGatePassed':not issues,'releaseApproved':False,
            'meaning':'pre-migration audit only; no source/rights/production approval',
            'unresolvedOperationalConditions':['exact deployed source must be verified','controlled publication/rights evidence must be supplied','media playback and delivery masters must be verified','owner approval required for production'],
            'commandResults':command_codes,'blockers':issues,'comparisons':comparisons}


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--evidence',required=True,type=Path)
    parser.add_argument('--revision',required=True)
    parser.add_argument('--run-id',required=True)
    parser.add_argument('--output',required=True,type=Path)
    args=parser.parse_args()
    result=evaluate(args.evidence,args.revision,args.run_id)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    by_code=Counter(x['code'] for x in result['blockers'])
    print(json.dumps({'automatedGatePassed':result['automatedGatePassed'],'releaseApproved':False,
                      'blockerCounts':dict(sorted(by_code.items())),
                      'observedCardChanges':[{k:c[k] for k in ('route','viewport','beforeCount','afterCount')}
                                            for c in result['comparisons'] if c.get('beforeCount')!=c.get('afterCount') and 'beforeCount' in c]},ensure_ascii=False,indent=2))
    return 0 if result['automatedGatePassed'] else 1

if __name__=='__main__':
    raise SystemExit(main())
