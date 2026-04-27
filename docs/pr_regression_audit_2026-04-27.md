# PR Regression Audit — 2026-04-27

## Goal

Review previously committed changes and identify regressions/unintended effects introduced by the latest commit (`70b8f79`) relative to its first-parent base (`324be23`).

> Note: a local `main` branch ref is not present in this clone, so this audit uses the commit ancestry base (`324be23`) as the effective pre-PR baseline.

## Commit history context

Recent first-parent sequence around the latest PR:

- `324be23` — Merge pull request #30
- `606b643` — Merge pull request #35
- `d178e63` — Merge pull request #36
- `b9f9bad` — Merge pull request #29
- `70b8f79` — Latest commit under review

## Diff summary (`324be23..70b8f79`)

High-level changes include:

- Site-wide metadata/layout refactor (`src/layouts/TTELayout.astro`, `src/config/site.ts`).
- Location slug normalization to `*-mi` on many city pages.
- Significant blog expansion (`src/pages/blog/*`).
- Redirect/robots/header updates (`public/_redirects`, `public/robots.txt`, `public/_headers`).
- Tracking and UX updates (`public/script.js`, sticky CTA CSS).
- New QA script wiring in `package.json`.

## Regression checks and findings

### 1) Redirect shadowing regression (confirmed)

The latest PR added redirect rules for routes that still have live Astro pages in `src/pages`.
This causes edge-level 301s to override valid first-party content and can create hidden SEO/UX regressions.

Previously problematic redirect entries were:

- `/code-corrections /electrical-repairs 301`
- `/dedicated-circuits /services 301`
- `/electrician-grand-haven /service-areas 301`
- `/electrician-muskegon /service-areas 301`
- `/reviews /testimonials 301`

These have been removed in this follow-up so existing pages remain directly reachable.

### 2) Route and build integrity (verified)

- Static build succeeds.
- SEO render checks pass against generated HTML.
- Integration and performance budget checks pass.

No new runtime-breaking regressions were detected in this pass.

## Net assessment

- **Major difference from baseline:** broad SEO/content expansion and location-slug normalization.
- **Primary unseen effect fixed here:** edge redirects that unintentionally masked still-existing content routes.
- **Current status:** quality gates pass after redirect cleanup.
