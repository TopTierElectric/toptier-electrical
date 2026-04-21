# Google Search Console Integration

## Purpose

Track query/page CTR, average position, and click deltas after SEO releases.

## Setup

1. Create a service account in Google Cloud.
2. Add service account email as delegated read user in GSC property settings.
3. Store values in `.env` using `.env.example` keys.

## Data Flow

- Source: GSC Search Analytics API
- Destination: monthly CSV exports in `docs/reports/` (planned)
- Consumer: CTR test queue and refresh cadence docs

## Reporting Hook

Use `scripts/check-integrations.mjs` to validate config presence before CI checks.
