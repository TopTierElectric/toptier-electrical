# Redirect Plan

## Implemented in code

- `/blog/blog-electrical-safety` -> `/blog/electrical-safety-tips` (301)
- `/blog/blog-ev-charging` -> `/blog/ev-charger-installation-guide` (301)
- `/blog/blog-right-electrician` -> `/blog/how-to-choose-right-electrician` (301)
- `/blog/blog-panel-upgrade-signs` -> `/blog/signs-you-need-panel-upgrade` (301)
- `/blog/blog-surge-protection` -> `/blog/whole-home-surge-protection` (301)
- `/blog/blog-generator-readiness` -> `/blog/winter-generator-readiness` (301)
- `/blog-electrical-safety` -> `/blog/electrical-safety-tips` (301)
- `/blog-ev-charging` -> `/blog/ev-charger-installation-guide` (301)
- `/blog-right-electrician` -> `/blog/how-to-choose-right-electrician` (301)
- `/blog-panel-upgrade-signs` -> `/blog/signs-you-need-panel-upgrade` (301)
- `/blog-surge-protection` -> `/blog/whole-home-surge-protection` (301)
- `/blog-generator-readiness` -> `/blog/winter-generator-readiness` (301)

## Guardrails

- Keep single-hop redirects only.
- Keep canonical pointing to final destination URL.
- Re-test during each release with `npm run build` and deployment smoke checks.
