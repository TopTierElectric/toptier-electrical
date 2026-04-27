# CSP hardening TODO

Current CSP in `public/_headers` still includes `'unsafe-inline'` for `script-src` and `style-src`.

## Remaining inline blockers

1. Inline JSON-LD blocks in `src/layouts/TTELayout.astro`.
2. Inline Google Analytics bootstrap script in `src/layouts/TTELayout.astro`.
3. Inline Cloudflare beacon configuration attributes in `src/layouts/TTELayout.astro`.
4. Page-level inline `<style is:inline>` blocks in review-related markup (`src/pages/reviews.astro`).

## Why this remains

- Removing inline execution/styling in one pass risks breaking analytics and schema rendering.
- Existing scripts rely on inline output and have not yet been migrated to nonce/hash-based policy.

## Next steps to remove `unsafe-inline`

1. Move page-level inline CSS into `src/assets/styles/tte-site.css`.
2. Move inline analytics bootstrap to external script and inject config via data attributes.
3. Emit CSP nonces for allowed inline scripts/styles and update headers accordingly.
4. Replace `'unsafe-inline'` with hash/nonce directives and validate in preview + production.
