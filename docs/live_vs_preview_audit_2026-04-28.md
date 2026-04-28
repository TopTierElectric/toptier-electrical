# Live vs Preview Audit (2026-04-28)

Compared:
- Live: `https://www.toptier-electrical.com`
- Preview: `https://257e24c5.toptier-electrical.pages.dev`

## Route-by-route findings

| Route | Live (`www`) | Preview (`257e24c5`) | Diff summary |
|---|---|---|---|
| `/` | Newer homepage variant with **"West Michigan Precision Electrical Contracting"** style content and `Request Scheduling` CTA. | Homepage variant with **"Clean Electrical Work. Clear Communication."** and `Get a Clear Estimate` CTA. | Major content + CTA + nav drift. |
| `/about` | Shorter positioning copy. | Long-form owner narrative ("Top Tier Standard", four-pillar process). | Major copy drift. |
| `/services` | Long-form commercial/urgent-support positioned page. | Concise "Services Overview" and "Residential vs. Commercial" blocks. | Major content structure drift. |
| `/contact` | Header/footer CTA uses `Request Scheduling`; footer year shows 2025 in captured snapshot. | CTA style follows `Get a Clear Estimate`; footer year shows 2026. | CTA language/version drift. |
| `/booking` | Uses estimate language in booking UX. | Uses estimate language in booking UX. | Mostly aligned at booking endpoint. |

## Shell/UI-level drift observed

- Primary CTA language was inconsistent across routes and layout (`Request Scheduling` vs `Get a Clear Estimate`).
- Header phone label was inconsistent with preview phrasing (`Call / Text` vs `Call`).
- Footer quick-link CTA wording drifted with header CTA wording.

## Remediation applied in this branch

To align with preview-style phrasing and remove mixed CTA language:
- Standardized CTA text to **Get a Clear Estimate** in layout + key pages.
- Standardized analytics event name to `clear_estimate_click` where CTA event previously used `request_scheduling_click`.
- Updated header phone CTA display from **Call / Text** to **Call**.

## Deployment-readiness checklist (post-fix)

- [x] Site config validation passes.
- [x] Monitoring config validation passes.
- [x] Workflow gate parity check passes.
- [x] Redirect rules check passes.
- [x] Navigation simulation passes.
- [x] No remaining `Request Scheduling` strings in `src/`.

## Residual risk / follow-up

- This audit intentionally focused on high-traffic/service routes and shell-level CTA consistency.
- If needed, run full visual regression across all routes once dependency install/build is stable in the execution environment.
