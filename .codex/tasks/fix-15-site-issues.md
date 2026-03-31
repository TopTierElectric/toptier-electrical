You are Codex operating inside the TopTierElectric/toptier-electrical repository.

Mission:
Implement, verify, and finalize all 15 site improvement issues below. Do not stop after making code edits. Continue operating in a verification/fix loop until there are zero known repo errors across the project’s own validation surface and no unresolved regressions introduced by your changes.

Non-negotiable operating rules:

1. Work autonomously. Do not ask for confirmation unless a destructive or unrecoverable action is required.
2. Do not stop at partial completion. Keep iterating until the exit criteria are met or you can prove a blocker with evidence.
3. Prefer minimal, production-grade edits over broad churn.
4. Preserve existing content, routes, metadata intent, branding, and deployment compatibility.
5. Maintain Astro/AstroWind/Cloudflare compatibility.
6. Do not fabricate success. Every claimed completion must be backed by code changes and passing verification.
7. If you discover repo-specific scripts or guardrails, treat them as source-of-truth and include them in the verification loop.
8. Keep the branch reviewable: coherent commits if committing is appropriate, clean diffs, no dead code, no temporary debug artifacts.
9. Before declaring success, achieve two consecutive clean full-suite verification passes after the final code edits.

Primary objectives to complete:

1. Consolidate CSS into Astro's build pipeline
2. Optimize image delivery (hero, favicon, responsive)
3. Remove !important overrides and unify button styles
4. Fix noindex: true default in Metadata.astro
5. Add BreadcrumbList schema to all service/location pages
6. Add Review/AggregateRating structured data
7. Unify TTELayout and AstroWind layout stacks
8. Componentize duplicate location pages (DRY)
9. Extract inline styles to utility classes
10. Add ARIA labels to all navigation elements
11. Add form validation, loading, and success/error states
12. Make sticky mobile CTA bar accessible
13. Populate blog with 5 initial SEO-targeted articles
14. Add Google Business Profile links and sameAs schema
15. Add deployment status badge and uptime monitoring

Execution strategy:
Phase 1 — Codebase discovery and verification map

- Inspect package manager files, package.json, Astro config, TS/JS config, lint config, formatter config, content collections, layouts, shared components, CI/workflows, and any scripts under tools/, scripts/, or package.json.
- Determine the canonical validation commands from the repo itself.
- Build a verification map in memory with:
  - install command
  - build command
  - lint command
  - typecheck/static analysis command
  - test command(s)
  - project-specific quality gates
  - SEO/accessibility/QA commands
  - workflow/config validation commands
- Prefer the repo’s existing commands over invented commands.
- Identify the exact files and architecture involved in each of the 15 items before editing.

Phase 2 — Plan before edits
Create a concise internal checklist that maps each objective to concrete files, components, layouts, pages, schema generators, content, config, and tests. Then execute.

Phase 3 — Implement all 15 improvements
Technical expectations:

- Consolidate stylesheet loading into Astro’s pipeline where appropriate and remove unnecessary render-blocking CSS patterns.
- Improve image handling for hero imagery, favicon handling, and responsive delivery with correct sizing and loading behavior.
- Remove unnecessary !important usage and normalize button styling through shared patterns/tokens/components.
- Correct the default indexing behavior in Metadata.astro so pages are indexable unless explicitly marked otherwise.
- Ensure BreadcrumbList schema is applied consistently across all service and location pages.
- Add valid Review and/or AggregateRating structured data only where it is appropriate, truthful, and implemented consistently.
- Reduce architectural duplication by unifying TTELayout and AstroWind layout responsibilities without breaking existing pages.
- DRY duplicate location pages through componentization or shared data-driven generation while preserving unique SEO-critical page content where needed.
- Replace inline styles with maintainable utility classes or shared styling patterns.
- Add missing ARIA labels and other semantic improvements to navigation elements and interactive controls.
- Improve forms with accessible validation, pending/loading state, and success/error state handling.
- Make the sticky mobile CTA accessible for screen readers, keyboard use, focus behavior, and touch behavior.
- Add 5 initial SEO-targeted blog articles that are on-brand, location/service aligned, and integrated into the site correctly.
- Add Google Business Profile links and sameAs schema where appropriate.
- Add deployment status badge and uptime monitoring integration in a way that fits the repo and deployment model cleanly.

Architecture and quality constraints:

- Do not create parallel layout systems. Consolidate around a single clear layout direction.
- Do not degrade Lighthouse, SEO, accessibility, or performance behavior on existing key pages.
- Do not break canonical URLs, sitemap behavior, robots behavior, metadata inheritance, or structured data validity.
- Keep components and content modular and easy to extend.
- Preserve root/src parity expectations if the repo has them.
- Respect any existing verification, audit, or QA scripts already present.

Phase 4 — Continuous verification loop
After every material batch of edits:

1. Run the fastest relevant targeted checks for the affected surface.
2. Fix every failure before moving on.
3. Re-run the targeted checks until clean.

After a major milestone and again at the end:

1. Run the full verification suite discovered from the repo.
2. Fix every error, warning that indicates a likely defect, broken build, type issue, lint issue, schema issue, accessibility issue, or script failure.
3. Re-run the full suite.
4. Continue looping until two consecutive full-suite passes are clean.

Verification policy:

- Treat non-zero exits as failures.
- Treat broken imports, failing builds, hydration issues, Astro content errors, type errors, lint errors, invalid schema output, broken internal links, accessibility regressions, and workflow/config validation failures as blockers.
- If a command is flaky or external, rerun it at least twice before downgrading it from blocker status.
- If a check cannot run due to missing external credentials/services, document the exact missing dependency and complete every other local verification path.
- Do not declare success while known failures remain.

Suggested command discovery order:

- Install dependencies using the repo’s package manager.
- Read package.json scripts and CI/workflows to identify all meaningful validation commands.
- Include project-specific commands such as build, verify, qa, SEO checks, workflow checks, navigation simulation, Astro checks, linting, type checks, and tests if they exist.
- Run the deepest meaningful local validation the repo already defines.

Change-management rules:

- Make focused edits with clear intent.
- Remove superseded code and dead styles when safe.
- Avoid unnecessary renames unless they materially improve architecture.
- Keep content additions production-ready, not placeholder text.
- Ensure new structured data is valid and not spammy.
- Ensure monitoring/badge additions are real and wired, not decorative stubs.

PR and git behavior:

- Work on the current branch unless a new working branch is required.
- If gh is available and authenticated, open or update a PR with this exact title:
  Fix all 15 site improvement issues: SEO, performance, accessibility, code quality, and content
- If PR creation is not possible, prepare .codex/PR_BODY.md containing:
  - summary
  - major file groups changed
  - verification commands run
  - final status of each of the 15 objectives
  - any residual blockers or external follow-ups

Exit criteria:
You may only declare the task complete when all of the following are true:

- All 15 objectives are implemented or explicitly documented as blocked with hard evidence.
- The repo’s full validation suite passes twice consecutively after final edits.
- No known build, type, lint, test, QA, SEO, accessibility, or workflow/config errors remain from local verification.
- The final summary includes exact commands run and their final status.
- The working tree contains only intentional changes.

Additional strict acceptance criteria (from prior reviewer notes):

- All 15 objectives are implemented with hard evidence and verification artifacts.
- Run the repo's full validation suite five consecutive times after final edits when feasible; if external blockers prevent this, document evidence and complete all local checks.

Final response format:
Return a concise but complete implementation report with these sections:

1. Completed objectives
2. Files/components/layouts/content added or changed
3. Verification commands run
4. Final verification results
5. PR link or PR body file location
6. Remaining blockers (must be empty if fully complete)
