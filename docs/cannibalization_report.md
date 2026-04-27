# Cannibalization Report

## Confirmed overlaps

1. **Cloudflare edge redirects vs Astro page redirects on blog routes**
   - Clean-slug blog routes in `src/pages/blog/*.astro` currently issue 301 redirects to `/blog/blog-*`.
   - Adding reverse edge redirects (`/blog/blog-* -> /blog/*`) creates redirect loops.
   - **Fix implemented:** removed Cloudflare blog redirects from `public/_redirects` and left blog ownership at page-level redirects only.

2. **Code corrections vs electrical repairs**
   - `/code-corrections` and `/electrical-repairs` overlap on troubleshooting/corrections intent.
   - **Status:** existing redirect retained (`/code-corrections -> /electrical-repairs`) to consolidate ownership.

3. **Reviews vs testimonials**
   - `/reviews` overlaps with `/testimonials` intent.
   - **Status:** existing redirect retained (`/reviews -> /testimonials`).

## Monitoring actions

- Validate redirect hit patterns in Cloudflare logs monthly.
- Track canonical page click consolidation in GSC once API integration is live.
