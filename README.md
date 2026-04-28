# Top Tier Electrical Website

Licensed & insured electrician serving West Michigan.

- Live site: https://toptier-electrical.com
- Deployment target: Cloudflare Pages (`wrangler.toml`, `wrangler.jsonc`)

## Canonical architecture

See [`docs/CANONICAL_ARCHITECTURE.md`](docs/CANONICAL_ARCHITECTURE.md).

Key point: `src/data/site.json` is the source-of-truth for business identity and SEO entity data. Route validation is derived against `src/pages/**`.

## Setup

```bash
npm ci
```

## Local development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Verification

```bash
npm run verify
npm run check:workflows
npm run check:redirects-cloudflare
npm run check:navigation-sim
npm run localseo:ci
```

## Deploy (Cloudflare Pages)

```bash
npm run build
npm run deploy
```

Preview deploy:

```bash
npm run deploy:preview
```

Deploy to the `codex-add-canonical-urls-to` branch alias (used for the corresponding `*.pages.dev` URL):

```bash
npm run deploy:main
```

## CI quality gate (pull requests)

Authoritative PR gate is `.github/workflows/ci.yml` and runs:

1. `npm run build`
2. `npm run verify`
3. `npm run check:workflows`
4. `npm run check:redirects-cloudflare`
5. `npm run check:navigation-sim`
6. `npm run localseo:ci`
