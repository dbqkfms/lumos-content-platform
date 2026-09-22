"""Restrict this review branch to the explicitly reviewed catalogue patch. No writes to Git."""
import hashlib
import json
import os
from pathlib import Path
import subprocess

BASE = "30c8316d929d58b56f9127bf1da4f6a9ea6cf159"
ALLOWED = {
    "client/src/lib/fetchJsonArray.ts", "client/src/lib/catalogPresentation.ts",
    "client/src/lib/artworkData.ts", "client/src/lib/catalog.ts",
    "client/src/hooks/useContentManager.ts", "tests/catalogue-resilience.cjs",
    "scripts/verify-preservation.py", "scripts/browser-regression.py", ".github/workflows/lumos-edit-verify.yml",
    "docs/루모스_원본보존_작업기록_20260922.md",
}
root = Path(__file__).resolve().parents[1]
def git(*args):
    return subprocess.check_output(["git", *args], cwd=root)

def main():
    head = git("rev-parse", "HEAD").decode().strip()
    subprocess.run(["git", "merge-base", "--is-ancestor", BASE, head], cwd=root, check=True)
    entries = git("diff", "--name-status", "--no-renames", "-z", BASE, head).decode().split("\0")
    changes = []
    for i in range(0, len(entries) - 1, 2):
        status, name = entries[i:i+2]
        if status not in {"A", "M"} or name not in ALLOWED:
            raise RuntimeError(f"Unreviewed change: {status} {name}")
        data = (root / name).read_bytes()
        changes.append({"path": name, "status": status, "sha256": hashlib.sha256(data).hexdigest()})
    if not changes:
        raise RuntimeError("Expected the reviewed patch, not an unchanged baseline")
    original_paths = set(git("ls-tree", "-r", "--name-only", "-z", BASE).decode().split("\0")) - {""}
    protected = original_paths - ALLOWED
    report = {"base": BASE, "head": head, "changed": changes, "unchanged_original_paths": len(protected),
              "scope": "Git-tree preservation, not live source identity, rendered UI, auth, delivery or rights verification."}
    out = Path(os.environ.get("LUMOS_QA_DIR", root / ".qa"))
    out.mkdir(parents=True, exist_ok=True)
    (out / "preservation.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"PRESERVATION_PASS: {len(changes)} reviewed changes; {len(protected)} original paths unchanged")

if __name__ == "__main__":
    main()
