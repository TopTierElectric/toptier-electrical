# Repository Audit — Recent PRs & Current Health (2026-04-27)

## Scope and method

This audit reviewed:

- Recent first-parent merge history (focus on PR merges from 2026-04-19 through 2026-04-27).
- CI and QA scripts currently wired in `package.json` and `.github/workflows/ci.yml`.
- Local quality gates and SEO checks executed in this working copy.
- Core governance/config docs and source-of-truth routing data.

## Recent PR activity summary

Recent merged PRs show high delivery velocity with strong emphasis on SEO governance, canonical URL normalization, redirects, mobile styling, and audit automation.

### Most recent merges (first-parent)

- PR #30 (`324be23`, 2026-04-27): crawl simulation + metadata polish + homepage hero sizing and navigation checks.
- PR #35 (`606b643`, 2026-04-27): canonical URL handling + base layout canonical integration + redirect restoration.
- PR #36 (`d178e63`, 2026-04-27): added 7-step git cleanup/stabilization automation script.
- PR #29 (`b9f9bad`, 2026-04-27): SEO snippet length tuning across core/blog pages.
- PR #34 (`fdb4731`, 2026-04-26): homepage style/background contrast and rhythm updates.
- PR #33 (`ccaf83b`, 2026-04-26): mobile navigation stabilization and responsive hardening.
- PR #32 (`c39c9e2`, 2026-04-26): broad audit remediation (SEO/tracking/forms/QA gates).
- PR #27 (`59c98bd`, 2026-04-19): redirect checker hardening for loop/conflict detection.
- PR #26 (`adf22e3`, 2026-04-19): major SEO governance and redirect loop fixes.

### Churn pattern highlights (2026-04-15 onward)

Most frequently touched files include:

- `src/pages/index.astro`
- `src/layouts/TTELayout.astro`
- `src/data/site.json`
- `public/_redirects`
- `package.json`

Interpretation: changes are concentrated in homepage UX, layout-level metadata/scripts, routing/redirect governance, and pipeline gates.

## Validation and checks run in this audit

### Passed

- `npm run verify`
  - Lockfile consistency, monitoring config, site config, Astro diagnostics, ESLint, and Prettier passed.
- `npm run build`
  - Production build succeeded; 67 pages built.
- `npm run check:workflows`
  - Required command presence check passed.
- `npm run check:redirects-cloudflare`
  - Redirect rules validation passed.
- `npm run check:navigation-sim`
  - Expected route simulation passed.
- `npm run check:integrations`
  - Integration scaffolding checks passed.
- `npm run check:seo-render`
  - SEO render checks passed across generated HTML.
- `npm run check:performance-budgets`
  - Budget checks passed.

### Failing / inconsistent

1. `npm run localseo:ci` fails due route config drift:
   - `/testimonials` missing from `src/pages`.
   - `/financing` missing from `src/pages`.

2. Workflow-to-package mismatch risk:
   - CI workflow invokes scripts such as `npm run test`, `npm run test:e2e:smoke`, and multiple `check:*` commands that are not currently declared in `package.json`.
   - Manual invocation confirms at least `npm run test` and `npm run check:route-governance` are missing scripts.

## Cross-cutting findings (all aspects)

### 1) Governance maturity: improved, but not fully converged

Strengths:

- Strong script coverage for SEO, navigation, redirects, monitoring, and config validation.
- Canonical architecture and route-derived validation framework are present.

Gaps:

- Route source-of-truth (`src/data/site.json`) includes page slugs not backed by concrete pages, causing SEO CI failure.
- Workflow appears to have stricter intended gates than `package.json` currently exposes, suggesting integration drift between policy and executable scripts.

### 2) Delivery velocity: high, with concentration risk

The same critical files are modified repeatedly in a short window. This can accelerate iteration but increases:

- Merge conflict probability.
- Regression risk in layout/global scripts.
- Need for tighter contract tests around metadata/canonical behavior.

### 3) Security posture: known residual work explicitly documented

`docs/SECURITY_HEADERS_TODO.md` states CSP still uses `'unsafe-inline'` in key directives and identifies blockers and migration plan. This is good transparency, but still an open hardening gap.

### 4) Git operations risk

`scripts/git-cleanup-stabilization.sh` performs force-push rebases and branch deletion across named branches. Useful for controlled recovery, but risky if run without branch/remote preflight validation and protected-branch guardrails.

## Priority recommendations

1. **Unblock local SEO gate immediately (P0)**
   - Either add `/testimonials` and `/financing` pages, or remove those slugs from `src/data/site.json`.

2. **Reconcile CI command contract (P0)**
   - Align `.github/workflows/ci.yml` with actual `package.json` scripts.
   - Add missing scripts or remove stale workflow steps.

3. **Add a script existence gate (P1)**
   - Small preflight script: parse workflow and assert every `npm run <script>` is present in `package.json`.

4. **Stabilize high-churn files (P1)**
   - Introduce ownership/review checklist for `src/layouts/TTELayout.astro`, `src/pages/index.astro`, `public/_redirects`, and `src/data/site.json`.

5. **CSP hardening plan execution (P1/P2)**
   - Start with moving remaining inline styles/scripts to external assets and nonced scripts, then remove `'unsafe-inline'`.

6. **Guard high-risk git automation (P2)**
   - Add dry-run mode, branch protection checks, and explicit confirmation prompts/environment flags before force-push operations.

## Overall assessment

- **Engineering direction:** positive (clear governance and quality automation intent).
- **Current operational risk:** moderate, driven mainly by CI/script drift and route-config mismatch.
- **Readiness for fast iterative merges:** good once P0 issues above are resolved.
