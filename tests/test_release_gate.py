"""Mutation tests: critical missing/failed checks cannot become a green release."""
import copy
from datetime import datetime, timezone
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

FILE=Path(__file__).resolve().parents[1]/'scripts/audit-release-gate.py'
spec=importlib.util.spec_from_file_location('release_gate',FILE)
gate=importlib.util.module_from_spec(spec);spec.loader.exec_module(gate)
REV='a'*40;RUN='12345';NOW=datetime(2026,9,20,8,0,tzinfo=timezone.utc)


def contract(cards=None):
    return {'schemaVersion':1,'scope':'rendered-dom-initial-state','cards':cards or [],
            'navigationPaths':['/open','/originals','/creator-works','/solutions','/login'],
            'policyPaths':['/privacy','/terms']}


def card(title='작품',poster='/poster.jpg',artwork_id=None):
    return {'title':title,'posterPath':poster,'artworkId':artwork_id}


def browser(kind):
    origin='https://lumos-v2-preview.vercel.app' if kind=='live' else 'http://127.0.0.1:4173'
    result={'schemaVersion':2,'auditRevision':REV,'auditRunId':RUN,'origin':origin,
            'startedAt':'2026-09-20T07:50:00.000Z','completedAt':'2026-09-20T07:55:00.000Z',
            'requestPolicy':{'mutations':'blocked','serviceWorkers':'blocked','webSockets':'blocked'},
            'pages':[],'interactions':[],'blockedWrites':[]}
    for r in gate.ROUTES:
        for w in gate.WIDTHS:
            cards=[card()] if r=='/creator-works' else []
            result['pages'].append({'route':r,'viewport':w,'httpStatus':200,'pageErrors':[],
                                   'finalUrl':origin+r,'horizontalOverflow':False,'failedLoadedImages':[],
                                   'cards':len(cards),'contract':contract(cards)})
    for width in gate.WIDTHS:
        rows=[
            {'name':'search-empty-and-clear','emptyResult':True,'restoredCards':1},
            {'name':'card-to-detail-title','card':'작품','detail':'작품','equal':True},
            {'name':'primary-detail-inquiry','clickable':True},
            {'name':'artwork-inquiry-prefill','titlePresent':True,'dialogRole':1},
            {'name':'dialog-focus-contained','contained':True},
            {'name':'inquiry-escape','textareasVisible':0},
            {'name':'synthetic-inquiry-failure-preserves-input','synthetic':True,'retained':True,'requests':[{'email':'qa@example.invalid'}]},
            {'name':'nonexistent-spa-artwork','bodyText':'작품을 찾을 수 없습니다'},
            {'name':'inquiry-form-contract','fields':[{'kind':'email','label':'이메일','required':True},{'kind':'checkbox','label':'개인정보 동의','required':True}], 'policyPaths':['/privacy']},
        ]
        result['interactions'].extend({**r,'viewport':width} for r in rows)
    return result


class GateTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name)
        self.addCleanup(self.temp.cleanup)
        self.files={'revision.json':{'head':REV,'runId':RUN},
                    'audits/media-report.json':{'total':1,'missing':0,'presentButUntracked':0,'assets':[{'exists':True,'tracked':True}]},
                    'build-info.json':{'commit':REV,'dirty':False},
                    'live-browser/browser-report.json':browser('live'),
                    'review-browser/browser-report.json':browser('review')}
        self.commands='\n'.join(f'{x}=0' for x in gate.COMMANDS)+'\n'
    def evaluate(self):
        for name,obj in self.files.items():
            p=self.root/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(obj,ensure_ascii=False),encoding='utf-8')
        (self.root/'exit-codes.txt').write_text(self.commands,encoding='utf-8')
        return gate.evaluate(self.root,REV,RUN,now=NOW)
    def row(self,name,width=390,kind='review'):
        return next(x for x in self.files[f'{kind}-browser/browser-report.json']['interactions'] if x['name']==name and x['viewport']==width)
    def page(self,route='/',width=390,kind='review'):
        return next(x for x in self.files[f'{kind}-browser/browser-report.json']['pages'] if x['route']==route and x['viewport']==width)
    def blocked(self,code):
        result=self.evaluate();self.assertFalse(result['automatedGatePassed']);self.assertFalse(result['releaseApproved'])
        self.assertIn(code,[x['code'] for x in result['blockers']]);return result
    def test_complete_matching_fixture_passes_automated_checks_only(self):
        result=self.evaluate();self.assertTrue(result['automatedGatePassed'],result['blockers']);self.assertFalse(result['releaseApproved'])
        self.assertEqual(len(result['comparisons']),30)
    def test_each_command_failure_blocks(self):
        for name in gate.COMMANDS:
            with self.subTest(command=name):
                self.commands='\n'.join(f'{x}={1 if x==name else 0}' for x in gate.COMMANDS)+'\n';self.blocked('command-failed')
    def test_skipped_command_is_not_pass(self):
        self.commands=self.commands.replace('check=0\n','');self.blocked('command-not-run')
    def test_duplicate_command_cannot_replace_an_untested_step(self):
        self.commands=self.commands.replace('check=0\n','build=0\n');self.blocked('duplicate-command-result')
    def test_fail_followed_by_success_is_still_invalid(self):
        self.commands+='check=1\ncheck=0\n';self.blocked('duplicate-command-result')
    def test_invalid_exit_code_is_never_success(self):
        for x in ('-1','true','0 extra','001','9999',''):
            with self.subTest(value=x):
                self.commands='\n'.join(f'{k}={x if k=="check" else 0}' for k in gate.COMMANDS)+'\n';self.blocked('invalid-command-result')
    def test_unknown_command_does_not_count(self):
        self.commands+='made-up=0\n';self.blocked('unexpected-command-result')
    def test_other_run_revision_evidence_fails(self):
        self.files['revision.json']['runId']='999';self.blocked('revision-evidence-mismatch')
    def test_wrong_built_sha_fails(self):
        self.files['build-info.json']['commit']='b'*40;self.blocked('built-revision-mismatch')
    def test_unknown_dirty_status_is_not_clean(self):
        self.files['build-info.json']['dirty']=None;self.blocked('built-working-tree-not-proven-clean')
    def test_missing_media_is_still_blocked_even_with_fake_zero_exit(self):
        x=self.files['audits/media-report.json'];x['missing']=1;x['assets'][0]['exists']=False;self.blocked('media-not-reproducible')
    def test_untracked_media_is_blocked(self):
        x=self.files['audits/media-report.json'];x['presentButUntracked']=1;x['assets'][0]['tracked']=False;self.blocked('media-not-reproducible')
    def test_zero_totals_cannot_hide_a_missing_asset(self):
        self.files['audits/media-report.json']['assets'][0]['exists']=False;self.blocked('media-counts-mismatch')
    def test_malformed_media_counters(self):
        self.files['audits/media-report.json']['missing']=-1;self.blocked('invalid-media-audit')
    def test_browser_report_from_old_sha_is_not_reusable(self):
        self.files['review-browser/browser-report.json']['auditRevision']='b'*40;self.blocked('browser-evidence-stale-or-unbound')
    def test_browser_report_from_other_run_is_not_reusable(self):
        self.files['live-browser/browser-report.json']['auditRunId']='other';self.blocked('browser-evidence-stale-or-unbound')
    def test_missing_browser_is_unknown_not_pass(self):
        self.files.pop('review-browser/browser-report.json');self.blocked('missing-or-invalid-evidence')
    def test_unbound_old_schema_fails(self):
        self.files['review-browser/browser-report.json'].pop('schemaVersion');self.blocked('browser-evidence-stale-or-unbound')
    def test_old_or_future_or_reversed_times_fail(self):
        for start,end in [('2026-09-19T07:00:00Z','2026-09-19T07:01:00Z'),('2026-09-21T07:00:00Z','2026-09-21T07:01:00Z'),('2026-09-20T07:57:00Z','2026-09-20T07:55:00Z'),('bad','bad')]:
            with self.subTest(start=start,end=end):
                r=self.files['review-browser/browser-report.json'];r.update(startedAt=start,completedAt=end);self.blocked('browser-evidence-time-invalid')
    def test_service_worker_request_bypass_must_be_blocked(self):
        self.files['review-browser/browser-report.json']['requestPolicy']['serviceWorkers']='allow';self.blocked('readonly-browser-policy-missing')
    def test_wrong_capture_origin_fails(self):
        self.files['live-browser/browser-report.json']['origin']='http://127.0.0.1:4173';self.blocked('browser-origin-mismatch')
    def test_login_redirect_is_not_a_test_of_requested_artwork(self):
        self.page('/artwork/standard-sansu')['finalUrl']='http://127.0.0.1:4173/login';self.blocked('browser-final-location-mismatch')
    def test_missing_mobile_route_fails(self):
        self.files['review-browser/browser-report.json']['pages'].remove(self.page('/open'));self.blocked('browser-state-not-tested')
    def test_duplicate_route_does_not_satisfy_coverage(self):
        self.files['review-browser/browser-report.json']['pages'].append(copy.deepcopy(self.page()));self.blocked('duplicate-browser-state')
    def test_404_with_rendered_spa_is_not_success(self):
        self.page('/artwork/standard-sansu')['httpStatus']=404;self.blocked('review-route-http-failure')
    def test_live_404_is_not_a_requirement_to_recreate(self):
        self.page('/artwork/standard-sansu',kind='live')['httpStatus']=404;self.assertTrue(self.evaluate()['automatedGatePassed'])
    def test_runtime_error_with_successful_page_load_fails(self):
        self.page()['pageErrors']=['TypeError'];self.blocked('review-runtime-error-or-missing-check')
    def test_overflow_fails(self):
        self.page()['horizontalOverflow']=True;self.blocked('review-layout-overflow-or-missing-check')
    def test_loaded_broken_image_fails(self):
        self.page()['failedLoadedImages']=[{'src':'/broken.webp'}];self.blocked('review-image-error-or-missing-check')
    def test_capture_exception_fails_even_when_stale_fields_exist(self):
        self.page()['auditError']='timeout';self.blocked('browser-capture-failed')
    def test_null_contract_is_unknown_not_crash(self):
        self.page()['contract']=None;self.blocked('browser-contract-not-captured')
    def test_each_journey_missing_fails(self):
        saved=copy.deepcopy(self.files['review-browser/browser-report.json']['interactions'])
        for name in ('search-empty-and-clear','card-to-detail-title','primary-detail-inquiry','artwork-inquiry-prefill','dialog-focus-contained','inquiry-escape','synthetic-inquiry-failure-preserves-input','nonexistent-spa-artwork'):
            with self.subTest(journey=name):
                self.files['review-browser/browser-report.json']['interactions']=[x for x in saved if not(x['name']==name and x['viewport']==390)]
                self.blocked('journey-not-tested')
    def test_not_clickable_primary_button_fails(self):
        self.row('primary-detail-inquiry')['clickable']=False;self.blocked('journey-failed')
    def test_title_inequality_cannot_be_hidden_by_equal_flag(self):
        self.row('card-to-detail-title')['detail']='다른 작품';self.blocked('journey-failed')
    def test_prefill_failure_fails(self):
        self.row('artwork-inquiry-prefill')['titlePresent']=False;self.blocked('journey-failed')
    def test_focus_escape_fails(self):
        self.row('dialog-focus-contained')['contained']=False;self.blocked('journey-failed')
    def test_synthetic_failure_must_have_intercepted_a_request(self):
        self.row('synthetic-inquiry-failure-preserves-input')['requests']=[];self.blocked('journey-failed')
    def test_old_artwork_residue_fails(self):
        self.row('nonexistent-spa-artwork')['bodyText']='이전 작품 제목';self.blocked('journey-failed')
    def test_removing_privacy_consent_fails(self):
        self.row('inquiry-form-contract')['fields'].pop();self.blocked('inquiry-form-regression')
    def test_required_becoming_optional_fails(self):
        self.row('inquiry-form-contract')['fields'][1]['required']=False;self.blocked('inquiry-form-regression')
    def test_removing_dialog_policy_link_fails(self):
        self.row('inquiry-form-contract')['policyPaths']=[];self.blocked('inquiry-form-regression')
    def test_missing_form_capture_is_unknown(self):
        self.row('inquiry-form-contract')['fields']=[];self.blocked('inquiry-form-contract-unverified')
    def test_creator_4_to_277_fails_and_reports_precise_observation(self):
        self.page('/creator-works',kind='live')['contract']['cards']=[card(f'작품{i}',f'/{i}.jpg') for i in range(4)]
        self.page('/creator-works')['contract']['cards']=[card(f'작품{i}',f'/{i}.jpg') for i in range(277)]
        r=self.blocked('deployment-ui-difference');c=next(x for x in r['comparisons'] if x['route']=='/creator-works' and x['viewport']==390)
        self.assertEqual((c['beforeCount'],c['afterCount'],len(c['addedCards'])),(4,277,273));self.assertIn('not-full-catalogue',c['scope'])
    def test_equal_card_counts_do_not_hide_replacement(self):
        self.page('/creator-works')['contract']['cards']=[card('다른작품')];self.blocked('deployment-ui-difference')
    def test_deleting_open_cards_is_also_a_scope_change(self):
        self.page('/open',kind='live')['contract']['cards']=[card()];self.blocked('deployment-ui-difference')
    def test_portal_navigation_removed_fails(self):
        self.page()['contract']['navigationPaths'].remove('/login');self.blocked('deployment-ui-difference')
    def test_legal_links_removed_fails(self):
        self.page()['contract']['policyPaths']=[];self.blocked('deployment-ui-difference')
    def test_explicit_id_changes_are_not_hidden_by_same_visuals(self):
        b=contract([card(artwork_id='a')]);a=contract([card(artwork_id='b')]);d=gate.compare_contract(b,a)
        self.assertTrue(d['explicitIdsChanged']);self.assertEqual(d['status'],'changed')
    def test_duplicate_presentation_count_is_preserved(self):
        d=gate.compare_contract(contract([card(),card()]),contract([card()]));self.assertEqual(len(d['removedCards']),1)
    def test_card_reordering_alone_is_not_scope_change(self):
        a,b=card('a'),card('b');d=gate.compare_contract(contract([a,b]),contract([b,a]));self.assertEqual(d['status'],'same-observed-state')
    def test_legacy_dom_does_not_pretend_verified_ids(self):
        d=gate.compare_contract(contract([card()]),contract([card()]));self.assertFalse(d['explicitIdsCompared'])
    def test_missing_card_title_is_unknown(self):
        d=gate.compare_contract(contract([card('')]),contract([card()]));self.assertEqual(d['status'],'unknown')
    def test_duplicate_json_key_is_rejected(self):
        p=self.root/'duplicate.json';p.write_text('{"a":1,"a":0}');self.assertRaises(ValueError,gate.read_json,p)
    def test_non_finite_json_number_is_rejected(self):
        p=self.root/'nan.json';p.write_text('{"a":NaN}');self.assertRaises(ValueError,gate.read_json,p)
    def test_invalid_page_shapes_fail_closed(self):
        for v in (None,{},[None],[{'route':[],'viewport':390}]):
            with self.subTest(value=v):
                self.files['review-browser/browser-report.json']['pages']=v;self.assertFalse(self.evaluate()['automatedGatePassed'])

    def test_known_login_redirect_preserved_is_not_a_broken_portal(self):
        for kind,origin in [('live','https://lumos-v2-preview.vercel.app'),('review','http://127.0.0.1:4173')]:
            for route in ('/portal/artist','/portal/admin'):
                for width in gate.WIDTHS:
                    self.page(route,width,kind)['finalUrl']=origin+'/login'
        self.assertTrue(self.evaluate()['automatedGatePassed'])
    def test_login_redirect_replaced_with_open_portal_blocks_migration(self):
        self.page('/portal/admin',kind='live')['finalUrl']='https://lumos-v2-preview.vercel.app/login'
        r=self.blocked('portal-access-flow-regression')
        b=next(x for x in r['blockers'] if x['code']=='portal-access-flow-regression')
        self.assertEqual((b['beforePath'],b['afterPath']),('/login','/portal/admin'))
        self.assertNotIn('browser-final-location-mismatch',[x['code'] for x in r['blockers']])
    def test_changed_login_destination_requires_review(self):
        self.page('/portal/admin',kind='live')['finalUrl']='https://lumos-v2-preview.vercel.app/login'
        self.page('/portal/admin')['finalUrl']='http://127.0.0.1:4173/auth/signin'
        self.blocked('portal-access-flow-regression')
    def test_unknown_media_tracking_is_not_reproducibility_evidence(self):
        self.files['audits/media-report.json']['assets'][0]['tracked']=None
        self.blocked('media-tracking-not-verified')
    def test_form_kind_loss_is_distinct_from_changed_label(self):
        self.row('inquiry-form-contract')['fields']=[{'kind':'email','label':'EMAIL','required':True}]
        r=self.blocked('inquiry-form-regression');b=next(x for x in r['blockers'] if x['code']=='inquiry-form-regression')
        self.assertEqual(b['missingFieldKinds'],{'checkbox':1})
        self.assertEqual(len(b['missingOrChangedFieldSignatures']),2)
        self.assertEqual((b['beforeFieldCount'],b['afterFieldCount']),(2,1))

if __name__=='__main__':unittest.main()
