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

Exit criteria:
You may only declare the task complete when all of the following are true:
- All 15 objectives are implemented or explicitly documented as blocked with hard evidence.
- The repo’s full validation suite passes twice consecutively after final edits.
- No known build, type, lint, test, QA, SEO, accessibility, or workflow/config errors remain from local verification.
- The final summary includes exact commands run and their final status.
- The working tree contains only intentional changes.
