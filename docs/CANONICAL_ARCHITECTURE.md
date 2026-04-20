# Canonical Architecture

## Canonical runtime source

The canonical runtime source for production pages and templates is:

- `src/pages/**`
- `src/partials/**` (if present)
- `src/data/site.json` (business/site source-of-truth)
- `scripts/**` (build-time validation and quality checks)
- `wrangler.toml` and `wrangler.jsonc` (Cloudflare Pages deploy config)

## Generated output paths

Generated artifacts are outputs, not source-of-truth:

- `dist/**`
- `artifacts/**`

## Non-canonical / legacy paths

These paths are not authoritative for runtime architecture decisions unless explicitly migrated:

- Legacy root HTML files
- Committed report artifacts and snapshots
- Experimental alternate framework trees
- Duplicate config layers that hardcode business identity

## Source-of-truth for business/site identity

`src/data/site.json` is the single source-of-truth for:

- business identity
- contact details
- canonical domain/origin
- SEO entity/profile links
- route lists used by local SEO validation

Any other config files must derive from this file and must not re-declare conflicting hardcoded values.

## Migration rules for future Codex work

1. Do not replace the current static build/deploy shape with a different framework architecture.
2. Add new business identity fields in `src/data/site.json` first, then expose thin adapters in `src/config/*` only when needed.
3. Route additions must be implemented in `src/pages/**` and reflected in `src/data/site.json` route lists used by validation.
4. CI gates must remain centralized in `.github/workflows/ci.yml` for pull requests.
5. Generated output (`dist`) and artifacts must never be edited as canonical source changes.
