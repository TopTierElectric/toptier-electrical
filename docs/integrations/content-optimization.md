# Content Optimization Provider Integration

## Supported Providers

- Surfer
- Clearscope
- MarketMuse

## Purpose

Use external content scoring to prioritize refresh work without over-optimizing copy.

## Environment Keys

- `CONTENT_OPTIMIZATION_PROVIDER`
- `CONTENT_OPTIMIZATION_API_KEY`

## Workflow

1. Export target page draft.
2. Score with provider.
3. Apply factual intent gap fixes only.
4. Log outcome in `docs/content_refresh_cadence.md`.
