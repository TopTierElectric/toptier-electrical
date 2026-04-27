# Last 5 PR Regression Recheck — 2026-04-27

## Request addressed

Double-check the latest five merged PRs and confirm whether regressions remain fixed.

## PRs reviewed (first-parent merge history)

1. `324be23` — PR #30 (`codex/task-title-fp6kng`)
2. `606b643` — PR #35 (`codex/add-canonical-urls-to-all-pages`)
3. `d178e63` — PR #36 (`codex/execute-full-git-cleanup-and-stabilization`)
4. `b9f9bad` — PR #29 (`codex/task-title`)
5. `fdb4731` — PR #34 (`codex/update-website-styles-and-backgrounds`)

## What was checked

### A) Regression vectors from the latest broad content/SEO PR

- Redirect-shadowing validation against existing Astro routes.
- Route/source integrity and static-render SEO checks.
- Navigation simulation and local SEO route audit.

Result: no remaining redirect shadowing and all route/SEO checks pass.

### B) Stability of outcomes from the last 5 merge PRs

- PR #30 (redirect/navigation/crawl checks): still green via `check:redirects-cloudflare`, `check:navigation-sim`, `check:seo-render`.
- PR #35 (canonical normalization/layout metadata): no canonical-related gate failures in current QA suite.
- PR #36 (git cleanup script): script present; no runtime impact on site build path.
- PR #29 (snippet/content tuning): no lint/build/SEO render regressions detected.
- PR #34 (style updates): no build or lint regressions detected.

## Command evidence

- `git log --first-parent --merges --oneline -n 8`
- `git diff --name-only <merge>^1 <merge>` for each reviewed merge
- `npm run build`
- `npm run qa`
- `npm run check:integrations`
- `npm run check:performance-budgets`
- `npm run localseo:ci`
- Custom route-vs-redirect shadow check (zero collisions)

## Conclusion

- **Status:** The regression class previously identified (edge redirects masking live pages) remains fixed.
- **Status:** No additional regressions were surfaced across the latest five merged PR lines using current automated gates.
- **Note:** A local `main` branch ref is absent in this clone, so validation is based on first-parent merge ancestry and current branch state.
