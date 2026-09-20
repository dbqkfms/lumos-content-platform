import unittest, tempfile, pathlib, importlib.util, json, zipfile
s=pathlib.Path(__file__).resolve().parents[1]/'scripts/discover-lumos-source.py'
spec=importlib.util.spec_from_file_location('discovery',s); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
class Discovery(unittest.TestCase):
 def setUp(self):
  self.t=tempfile.TemporaryDirectory();self.root=pathlib.Path(self.t.name);self.p=self.root/'Lumos'/'work'
  self.put('package.json','{}');self.put('client/src/components/BuyerProofSummary.tsx','export default 1;')
 def tearDown(self):self.t.cleanup()
 def put(self,name,text):
  p=self.p/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text);return p
 def test_actual_candidate(self):
  r=m.discover([self.root]);self.assertEqual(len(r['candidates']),1);self.assertEqual(r['candidates'][0]['markerCount'],1);self.assertIsNone(r['automaticSelection'])
 def test_exact_source_not_proved_by_markers(self):self.assertFalse(m.discover([self.root])['candidates'][0]['deploymentGitLinkConfirmed'])
 def test_deduplicated_roots(self):self.assertEqual(len(m.discover([self.root,self.p])['candidates']),1)
 def test_missing_root_reports_warning(self):self.assertEqual(m.discover([self.root/'missing'])['warnings'][0]['reason'],'root-not-found')
 def test_whole_disk_refused(self):self.assertEqual(m.discover([self.root.anchor])['warnings'][0]['reason'],'whole-disk-root-refused')
 def test_zero_nul_project(self):
  self.put('.vercel/project.json','\0'*118);self.assertEqual(m.discover([self.root])['candidates'][0]['vercel']['status'],'invalid-or-binary')
 def test_only_ids_leave_config(self):
  self.put('.vercel/project.json',json.dumps({'projectId':'prj_one','orgId':'team_one','token':'SECRET_TOKEN','email':'PRIVATE'}))
  c=m.discover([self.root])['candidates'][0];self.assertEqual(c['vercel']['status'],'valid-ids');self.assertNotIn('PRIVATE',json.dumps(c));self.assertNotIn('SECRET_TOKEN',json.dumps(c))
 def test_node_modules_not_scanned(self):
  self.put('node_modules/foo/package.json','{}');self.put('node_modules/foo/client/src/pages/PrivacyPage.tsx','x');self.assertEqual(len(m.discover([self.root])['candidates']),1)
 def test_symlink_root_refused(self):
  link=self.root/'link';link.symlink_to(self.p,target_is_directory=True);self.assertEqual(m.discover([link])['warnings'][0]['reason'],'symlink-root-skipped')
 def test_symlink_marker_ignored(self):
  target=self.root/'secret';target.write_text('TOP_SECRET');(self.p/'client/src/components/PreviewPlayer.tsx').symlink_to(target)
  self.assertEqual(m.discover([self.root])['candidates'][0]['markerCount'],1)
 def test_directory_limit_not_silent(self):self.assertTrue(any(x['reason']=='directory-budget-exhausted' for x in m.discover([self.root],max_dirs=1)['warnings']))
 def test_depth_limit_not_silent(self):self.assertTrue(any(x['reason']=='depth-limit' for x in m.discover([self.root],max_depth=1)['warnings']))
 def test_unknown_git_not_faked(self):self.assertIsNone(m.discover([self.root])['candidates'][0]['gitSha'])
 def test_export_excludes_env_and_fonts(self):
  self.put('.env','TOKEN=SECRET');self.put('client/src/font.woff2','FONT');self.put('.vercel/project.json','{"token":"SECRET"}')
  dest=self.root/'handoff.zip';r=m.bundle_candidate(self.p,dest);self.assertTrue(r['exported'])
  with zipfile.ZipFile(dest) as z:self.assertNotIn('.env',z.namelist());self.assertNotIn('client/src/font.woff2',z.namelist());self.assertNotIn('.vercel/project.json',z.namelist())
 def test_secret_like_source_blocks_entire_export(self):
  self.put('client/src/config.ts','const api_key="DO_NOT_SHARE_THIS_CREDENTIAL";');dest=self.root/'safe.zip';r=m.bundle_candidate(self.p,dest)
  self.assertFalse(r['exported']);self.assertFalse(dest.exists());self.assertNotIn('DO_NOT_SHARE',json.dumps(r))
 def test_no_overwrite(self):
  d=self.root/'already.zip';d.write_text('keep');self.assertRaises(ValueError,m.bundle_candidate,self.p,d);self.assertEqual(d.read_text(),'keep')
 def test_no_self_export(self):self.assertRaises(ValueError,m.bundle_candidate,self.p,self.p/'copy.zip')
 def test_symlink_component_directory_is_not_read(self):
  import shutil
  shutil.rmtree(self.p/'client/src/components');outside=self.root/'outside';outside.mkdir();(outside/'BuyerProofSummary.tsx').write_text('PRIVATE')
  (self.p/'client/src/components').symlink_to(outside,target_is_directory=True)
  self.assertEqual(m.discover([self.p])['candidates'][0]['markerCount'],0)
 def test_symlink_vercel_directory_is_not_read(self):
  outside=self.root/'private';outside.mkdir();(outside/'project.json').write_text('{"projectId":"prj_secret","orgId":"team_secret"}')
  (self.p/'.vercel').symlink_to(outside,target_is_directory=True)
  c=m.discover([self.p])['candidates'][0];self.assertEqual(c['vercel']['status'],'invalid-or-binary');self.assertNotIn('prj_secret',json.dumps(c))
if __name__=='__main__':unittest.main()
