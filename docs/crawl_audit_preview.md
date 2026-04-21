# Crawl Audit (Preview + Local Simulation)

Date: 2026-04-21

## Remote preview crawl attempt

- Target: `https://codex-task-title.toptier-electrical.pages.dev/`
- Result: network fetch failure from this execution environment (external connectivity blocker for this host).

## Local byte-level crawl simulation

- Command used: `node scripts/crawl-site-audit.mjs http://127.0.0.1:4322/ 300`
- Pages crawled: **34**
- HTTP failures: **0**
- Missing canonicals: **0**
- Missing H1: **0**
- Long titles (>70): **0**

The crawler records response byte size and SHA-256 hash for each page to support content-change and regression detection.

## Sample validated pages

- `/` – 22,090 bytes, sha256 `3e2e544d69976ccb3b87c77e2ba3e5e5d0818d69f69dad73729f3fc102e28d5c`
- `/services` – 16,640 bytes, sha256 `45afc5f594b7d52e7321d4d7a6441927baa8a76e39ff11dd4d06da540642413d`
- `/blog` – 15,705 bytes, sha256 `49720fce54e282775e1e27f0063fc9b93e8ff114738cc0a195e1da6fbf5f38b7`
- `/about` – 18,146 bytes, sha256 `8517a32ef66adf31f9894ccd4269e224332770a1a73834387f90741dd3161b77`
- `/contact` – 17,953 bytes, sha256 `87cb4c5e9eb0d9d339397a50f777b677f47342b13f790e5b6846a51ce67fdf87`

## Notes

- Redirect simulation checks remain covered by `npm run check:redirects-cloudflare` and `npm run check:navigation-sim`.
- Render-level SEO checks remain covered by `npm run check:seo-render`.
