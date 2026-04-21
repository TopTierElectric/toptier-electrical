# Metadata Audit (After Implementation)

## Scope

Priority commercial pages and trust pages.

## Results

- Titles are unique for audited priority pages (`/`, `/services`, `/contact`, `/about`).
- Descriptions include service + location + trust cues.
- Canonical tags present on rendered pages (validated via build output checks).

## Scripted validation

Run `npm run check:seo-render` after build to catch:

- duplicate titles
- duplicate metas
- missing H1
- missing canonicals
- invalid JSON-LD
