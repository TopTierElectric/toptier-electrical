# Cannibalization Report

## Confirmed overlaps

1. **Legacy blog slugs vs canonical blog URLs**
   - Legacy routes existed under `/blog/blog-*` and alias-style `/blog-*` while canonical intent pages are `/blog/*-guide` style.
   - Risk: diluted link equity and mixed relevance signals.
   - **Fix implemented:** added 301 redirect rules from legacy slugs to canonical blog URLs in `public/_redirects`.

2. **Code corrections vs electrical repairs**
   - `/code-corrections` and `/electrical-repairs` overlap on troubleshooting/corrections intent.
   - **Status:** existing redirect retained (`/code-corrections -> /electrical-repairs`) to consolidate ownership.

3. **Reviews vs testimonials**
   - `/reviews` overlaps with `/testimonials` intent.
   - **Status:** existing redirect retained (`/reviews -> /testimonials`).

## Monitoring actions

- Validate redirect hit patterns in Cloudflare logs monthly.
- Track canonical page click consolidation in GSC once API integration is live.
