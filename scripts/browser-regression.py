"""Read-only, real-navigation regression between two loopback builds, not the live deployment."""
import asyncio
import json
import os
from pathlib import Path
from urllib.parse import urlsplit
from playwright.async_api import async_playwright

ROUTES = ["/", "/open", "/originals", "/creator-works", "/standard", "/local", "/about", "/contact", "/login", "/portal/artist", "/portal/admin"]
ORIGINS = {"baseline": "http://127.0.0.1:4174", "candidate": "http://127.0.0.1:4173"}
OUT = Path(os.environ.get("LUMOS_QA_DIR", ".qa")) / "browser"
SNAPSHOT = """() => ({
  title: document.title,
  textLength: document.body.innerText.trim().length,
  overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
  fields: Array.from(document.querySelectorAll('input,select,textarea')).map(e => ({
    tag: e.tagName, name: e.getAttribute('name'), type: e.getAttribute('type'),
    required: e.required, placeholder: e.getAttribute('placeholder'),
    autocomplete: e.getAttribute('autocomplete'), disabled: e.disabled
  })),
  navigation: Array.from(document.querySelectorAll('header a[href],nav a[href]')).map(e => e.getAttribute('href')).sort(),
  artworkLinks: Array.from(new Set(Array.from(document.querySelectorAll('a[href^="/artwork/"]')).map(e => e.getAttribute('href')))).sort(),
  mediaPaths: Array.from(document.querySelectorAll('img,video,video source')).map(e => e.getAttribute('src')).filter(Boolean).sort(),
  failedImages: Array.from(document.images).filter(e=>e.complete && e.naturalWidth===0).map(e=>e.getAttribute('src'))
})"""

async def capture(browser, name, width):
    blocked = {"writes": 0, "externalReads": 0}
    context = await browser.new_context(viewport={"width": width, "height": 900 if width > 700 else 844},
                                        reduced_motion="reduce", service_workers="block", color_scheme="dark")
    async def guard(route):
        req = route.request
        if req.method not in {"GET", "HEAD"}:
            blocked["writes"] += 1
            await route.abort()
        elif urlsplit(req.url).hostname not in {"127.0.0.1", "localhost"}:
            blocked["externalReads"] += 1
            await route.abort()
        else:
            await route.continue_()
    await context.route("**/*", guard)
    async def block_socket(socket):
        await socket.close()
    await context.route_web_socket("**/*", block_socket)
    pages = {}
    try:
        for route in ROUTES:
            page = await context.new_page()
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            try:
                response = await page.goto(ORIGINS[name] + route, wait_until="domcontentloaded", timeout=20000)
                await page.wait_for_function("document.querySelector('#root')?.innerText.trim().length > 30", timeout=15000)
                await page.wait_for_timeout(1200)
                await page.add_style_tag(content="*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}")
                await page.evaluate("document.querySelectorAll('video').forEach(v=>v.pause())")
                item = await page.evaluate(SNAPSHOT)
                item.update({"status": response.status if response else None, "pageErrors": errors})
                if route in {"/", "/contact"}:
                    slug = route.strip("/") or "home"
                    await page.screenshot(path=str(OUT / f"{name}-{width}-{slug}.png"), full_page=True, animations="disabled")
                pages[route] = item
            except Exception as error:
                pages[route] = {"error": str(error), "pageErrors": errors}
            finally:
                await page.close()
    finally:
        await context.close()
    return {"pages": pages, "blocked": blocked}

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    report = {"scope": "Real Chromium navigation of Git baseline and candidate HTTP builds on loopback only. External reads and all writes are blocked. Not live Vercel, authenticated account, video playback or inquiry-delivery verification.", "snapshots": {}, "comparisons": [], "regressions": []}
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        try:
            for width in (1440, 390):
                for name in ORIGINS:
                    report["snapshots"][f"{name}-{width}"] = await capture(browser, name, width)
                baseline = report["snapshots"][f"baseline-{width}"]["pages"]
                candidate = report["snapshots"][f"candidate-{width}"]["pages"]
                for route in ROUTES:
                    old, new = baseline[route], candidate[route]
                    checks = {"bothRendered": "error" not in old and "error" not in new and old.get("status") == 200 and new.get("status") == 200}
                    if checks["bothRendered"]:
                        checks.update({"sameFields": old["fields"] == new["fields"], "sameNavigation": old["navigation"] == new["navigation"],
                                       "sameArtworkLinks": old["artworkLinks"] == new["artworkLinks"], "sameMediaPaths": old["mediaPaths"] == new["mediaPaths"],
                                       "noAddedOverflow": new["overflow"] <= max(2, old["overflow"]),
                                       "noAddedPageErrors": not (set(new["pageErrors"]) - set(old["pageErrors"]))})
                    item = {"width": width, "route": route, "checks": checks, "passed": all(checks.values())}
                    report["comparisons"].append(item)
                    if not item["passed"]:
                        report["regressions"].append(item)
        finally:
            await browser.close()
    (OUT / "regression.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    summary = {"routeViewportPairs": len(report["comparisons"]), "passingPairs": sum(item["passed"] for item in report["comparisons"]), "regressions": report["regressions"]}
    print("BROWSER_RESULT " + json.dumps(summary, ensure_ascii=False))
    if report["regressions"]:
        raise SystemExit(1)

if __name__ == "__main__":
    asyncio.run(main())
