# Integration Audit — 15 Site Improvement Objectives

Date: 2026-03-31

## Status Summary

| # | Objective | Status | Notes |
|---|-----------|--------|-------|
| 1 | Consolidate CSS into Astro build pipeline | Partial | `TTELayout` imports `~/assets/styles/tte-site.css`, but legacy CSS copies remain in `public/styles.css` and `src/assets/styles/styles.css`. |
| 2 | Optimize image delivery (hero, favicon, responsive) | Partial | Favicons are componentized and hero includes width/height/fetchpriority; build still warns about unresolved `/assets/images/hero.jpg` and hero `srcset` points to same WebP asset sizes. |
| 3 | Remove `!important` overrides and unify button styles | Complete | No `!important` usage found; shared `.btn`, `.btn-primary`, `.btn-ghost` styles are centralized. |
| 4 | Fix `noindex: true` default in `Metadata.astro` | Complete | Metadata defaults `noindex: false`, with explicit override behavior. |
| 5 | Add BreadcrumbList schema to all service/location pages | Complete | `TTELayout` auto-generates BreadcrumbList JSON-LD for route segments and all service/location pages use `TTELayout` or location components built on it. |
| 6 | Add Review/AggregateRating structured data | Complete | `TTELayout` includes `aggregateRating` and `review` in business JSON-LD. |
| 7 | Unify TTELayout and AstroWind layout stacks | Partial | Most pages use `TTELayout`, but AstroWind `PageLayout` remains used by blog category/tag routes. |
| 8 | Componentize duplicate location pages (DRY) | Partial | `LocationServicePage` and `LocationPage` abstractions exist, but several location-targeted pages are still hand-authored. |
| 9 | Extract inline styles to utility classes | Complete | No inline `style="..."` attributes detected in `src/`; styles are class/CSS based. |
| 10 | Add ARIA labels to all navigation elements | Complete | Header nav, sticky CTA nav, and footer quick-link nav include `aria-label` usage in `TTELayout`. |
| 11 | Add form validation/loading/success/error states | Complete | Enhanced form script validates required fields, reports status messages, and applies loading state on submit button. |
| 12 | Make sticky mobile CTA bar accessible | Complete | Sticky bar uses navigation semantics with labeling and focus-within affordance. |
| 13 | Populate blog with 5 initial SEO-targeted articles | Complete | `src/data/post` contains 6 targeted blog posts. |
| 14 | Add Google Business Profile links and sameAs schema | Complete | GBP links appear in layout/footer and `sameAs` appears in structured data/config. |
| 15 | Add deployment status badge and uptime monitoring | Complete | README includes uptime badge and a scheduled `uptime.yml` workflow is present. |

## Verification Commands Used

- `npm run check` (fails: ESLint `citySlug` unused in `src/components/LocationPage.astro`)
- `npm run build` (build succeeds with warning for unresolved `/assets/images/hero.jpg`)
- Search/audit commands:
  - `rg -n "noindex|BreadcrumbList|AggregateRating|Review|sameAs|aria-label|TTELayout|important|!important" ...`
  - `rg -n "style=" src`
  - `rg -n "from '~/layouts/" src/pages src/components`
  - `ls .github/workflows` + review of `uptime.yml`

## Immediate Follow-ups

1. Remove or use `citySlug` in `src/components/LocationPage.astro` to clear lint gate.
2. Resolve `/assets/images/hero.jpg` build warning and provide true responsive hero source variants.
3. Decide whether to migrate blog tag/category routes to `TTELayout` (if full layout unification is still desired).
