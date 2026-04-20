# GA4 Integration

## Purpose

Measure engagement quality for non-branded landing pages and organic conversion assists.

## Current Wiring

GA4 tag is present in `src/layouts/TTELayout.astro` via `gtag.js` and measurement ID.

## Recommended Events

- `lead_submit` (booking/contact submit)
- `cta_click` (call/text, request scheduling)
- `service_page_scroll_75`

## Config

Set `PUBLIC_GA4_MEASUREMENT_ID` in `.env` for environment-specific overrides.
