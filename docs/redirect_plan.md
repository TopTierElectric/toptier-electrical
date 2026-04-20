# Redirect Plan

## Implemented in code

- Blog redirect ownership is currently handled inside Astro page routes (`src/pages/blog/*.astro`).
- Cloudflare `_redirects` intentionally excludes blog-slug remaps to avoid redirect cycles with page-level redirects.
- Non-blog canonical consolidations remain in `public/_redirects` (e.g., `/code-corrections -> /electrical-repairs`, `/reviews -> /testimonials`).

## Guardrails

- Keep single-hop redirects only.
- Do not create reverse edge redirects for routes that already redirect at page level.
- Keep canonical pointing to final destination URL.
- Re-test during each release with `npm run build` and deployment smoke checks.
