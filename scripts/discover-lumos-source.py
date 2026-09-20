"""Bounded read-only source discovery. No secrets, logins, installs or uploads.
Run with explicit workspace roots, not an entire disk. Matching built bytes is
not proof of a Git deployment. This tool never selects/edits a candidate for you.
"""
import argparse
import hashlib
import json
import os
import pathlib
import re
import subprocess
import zipfile

MARKERS = ('BuyerProofSummary.tsx', 'PreviewPlayer.tsx', 'PrivacyPage.tsx',
           'TermsPage.tsx', 'WebpImage.tsx', 'BackToTop.tsx', 'Footer.tsx',
           'StatCounter.tsx', 'VimeoEmbed.tsx', 'PressPage.tsx')
SKIP = {'.git', 'node_modules', '.pnpm-store', '.next', '.cache', '.venv', 'venv',
        '__pycache__', '.codex', '.claude', 'dist', 'build', '.vercel', '.idea'}
FINGERPRINTS = {'js': 'f7c8a2a0e2c8d93907f44d2145c928474c96caaebae47fc2186061ed728dc4b3',
                'css': 'd1fe15ee3bb296a58870a8199ae5f9c489a81f546beb17392d55e06b0839abcd'}
CODE_SUFFIXES = {'.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.html', '.json', '.yaml', '.yml', '.patch'}
SECRET = re.compile(r'(?:\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,})|-----BEGIN [A-Z ]*PRIVATE KEY-----|["\']?(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)["\']?\s*[:=]\s*["\'][^"\'\s]{12,}["\'])', re.I)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def git(root, *args):
    try:
        return subprocess.check_output(['git', '-C', str(root), *args],
            stderr=subprocess.DEVNULL, text=True, timeout=8).strip()
    except (OSError, subprocess.SubprocessError):
        return None


def inside_without_links(path, root):
    try:
        path.relative_to(root)
        return path.resolve().is_relative_to(root.resolve()) and not any(
            p.is_symlink() for p in (path, *path.parents) if p == root or root in p.parents)
    except (ValueError, OSError):
        return False


def safe_read(path, limit=2 * 1024 * 1024):
    if path.is_symlink() or not path.is_file() or path.stat().st_size > limit:
        return None
    data = path.read_bytes()
    if b'\0' in data:
        return None
    try:
        data.decode('utf-8')
    except UnicodeDecodeError:
        return None
    return data


def candidate(root):
    src = root / 'client' / 'src'
    hits = []
    for folder in ('components', 'pages'):
        for name in MARKERS:
            f = src / folder / name
            if not inside_without_links(f, root):
                continue
            data = safe_read(f)
            if data is not None:
                hits.append({'path': f.relative_to(root).as_posix(), 'sha256': sha(data)})
    revision = git(root, 'rev-parse', 'HEAD')
    status = git(root, 'status', '--porcelain', '--untracked-files=normal')
    project = {'status': 'missing'}
    f = root / '.vercel' / 'project.json'
    if f.exists():
        data = safe_read(f, 16 * 1024) if inside_without_links(f, root) else None
        try:
            value = json.loads(data) if data is not None else None
            if not isinstance(value, dict):
                raise ValueError()
            ids = {k: v for k, v in value.items() if k in ('projectId', 'orgId') and
                   isinstance(v, str) and re.fullmatch(r'[A-Za-z0-9_-]{3,160}', v)}
            project = {'status': 'valid-ids' if len(ids) == 2 else 'incomplete', **ids}
        except (ValueError, TypeError):
            project = {'status': 'invalid-or-binary'}
    matches = []
    for prefix in ('dist/public/assets', 'dist/assets', 'build/assets'):
        folder = root / prefix
        if not inside_without_links(folder, root) or not folder.is_dir():
            continue
        for f in sorted(folder.iterdir())[:2000]:
            typ = f.suffix.lstrip('.')
            if typ not in FINGERPRINTS:
                continue
            data = safe_read(f, 8 * 1024 * 1024) if inside_without_links(f, root) else None
            if data is not None and sha(data) == FINGERPRINTS[typ]:
                matches.append({'type': typ, 'path': f.relative_to(root).as_posix(), 'sha256': sha(data)})
    return {'root': str(root), 'markerCount': len(hits), 'markers': hits,
            'gitSha': revision, 'branch': git(root, 'branch', '--show-current'),
            'dirty': None if status is None else bool(status), 'vercel': project,
            'builtMatches': matches, 'compiledPairMatchesReference': {'js','css'} <= {m['type'] for m in matches},
            'deploymentGitLinkConfirmed': False}


def discover(roots, max_depth=6, max_dirs=15000):
    found = {}; warnings = []; visited = 0
    for raw in roots:
        raw = pathlib.Path(raw).expanduser()
        if raw.is_symlink():
            warnings.append({'root': str(raw), 'reason': 'symlink-root-skipped'}); continue
        if not raw.is_dir():
            warnings.append({'root': str(raw), 'reason': 'root-not-found'}); continue
        root = raw.resolve()
        if root == pathlib.Path(root.anchor):
            warnings.append({'root': str(root), 'reason': 'whole-disk-root-refused'}); continue
        for directory, names, _ in os.walk(root, followlinks=False):
            visited += 1
            if visited > max_dirs:
                warnings.append({'root': str(root), 'reason': 'directory-budget-exhausted'}); break
            d = pathlib.Path(directory)
            names[:] = [n for n in names if n not in SKIP and not (d/n).is_symlink()]
            depth = len(d.relative_to(root).parts)
            if depth >= max_depth:
                if names: warnings.append({'root': str(d), 'reason': 'depth-limit'})
                names[:] = []
            if (d/'package.json').is_file() and (d/'client'/'src').is_dir() and not (d/'client').is_symlink():
                # Check ancestors to avoid traversing a src symlink through a parent.
                if (d/'client'/'src').is_symlink(): continue
                found[str(d)] = candidate(d)
    return {'schemaVersion': 1, 'scope': 'explicit-root-readonly-search',
            'candidates': sorted(found.values(), key=lambda r: (-r['markerCount'], r['root'])),
            'warnings': warnings, 'scannedDirectories': visited, 'automaticSelection': None}


def bundle_candidate(root, destination):
    """Explicit local export only. Refuse overwrite, symlinks and common secrets.
    Review this archive locally before sharing: scanning is not a secrecy proof.
    """
    root = pathlib.Path(root).resolve(); destination = pathlib.Path(destination).resolve()
    if destination.exists(): raise ValueError('destination-exists')
    if root in destination.parents: raise ValueError('export-must-be-outside-candidate')
    if not (root/'client'/'src').is_dir(): raise ValueError('candidate-source-missing')
    files = []; blocked = []; total = 0
    for start in ('client/src', 'server', 'shared', 'patches'):
        base = root/start
        if not inside_without_links(base, root) or not base.is_dir(): continue
        for directory, names, entries in os.walk(base, followlinks=False):
            d = pathlib.Path(directory)
            names[:] = [n for n in names if not n.startswith('.') and n not in SKIP and not (d/n).is_symlink()]
            for name in entries:
                f = d/name
                if name.startswith('.') or f.suffix not in CODE_SUFFIXES: continue
                files.append(f)
    files += [root/n for n in ('package.json', 'pnpm-lock.yaml', 'tsconfig.json', 'vite.config.ts', 'vercel.json') if (root/n).is_file()]
    ready = []
    for f in sorted(set(files)):
        data = safe_read(f) if inside_without_links(f, root) else None
        if data is None: blocked.append({'path': f.relative_to(root).as_posix(), 'reason': 'symlink-binary-or-size'}); continue
        if SECRET.search(data.decode('utf-8')): blocked.append({'path': f.relative_to(root).as_posix(), 'reason': 'possible-credential'}); continue
        total += len(data)
        if total > 30*1024*1024: raise ValueError('source-export-size-budget')
        ready.append((f.relative_to(root).as_posix(), data))
    if blocked: return {'exported': False, 'blockedFiles': blocked}
    manifest = {'scope':'selected-source-only-not-deployment-proof', 'files':[{'path':n,'sha256':sha(b)} for n,b in ready],
                'reviewBeforeSharing':True, 'includesFonts':False, 'includesEnvironmentFiles':False}
    destination.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(destination, 'x', zipfile.ZIP_DEFLATED) as z:
        for name, data in ready: z.writestr(name, data)
        z.writestr('수집파일지문.json', json.dumps(manifest, ensure_ascii=False, indent=2))
    return {'exported':True,'fileCount':len(ready),'bytes':total,'destination':str(destination)}


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--root', action='append', required=True); p.add_argument('--output', required=True)
    p.add_argument('--max-depth',type=int,default=6);p.add_argument('--candidate');p.add_argument('--bundle')
    a=p.parse_args()
    if not 1 <= a.max_depth <= 10: p.error('max-depth must be 1..10')
    out=pathlib.Path(a.output)
    if out.exists(): p.error('output exists; choose a new filename')
    r=discover(a.root,a.max_depth)
    if a.bundle:
        if not a.candidate or str(pathlib.Path(a.candidate).resolve()) not in {c['root'] for c in r['candidates']}:p.error('select an actually discovered candidate')
        r['bundle']=bundle_candidate(a.candidate,a.bundle)
    out.parent.mkdir(parents=True,exist_ok=True)
    with out.open('x',encoding='utf-8') as f:json.dump(r,f,ensure_ascii=False,indent=2)
    print(json.dumps({'candidateCount':len(r['candidates']),'warnings':len(r['warnings']),'output':str(out)},ensure_ascii=False))

if __name__=='__main__':main()
