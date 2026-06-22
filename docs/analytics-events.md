# Analytics Events — Canonical Set

The site fires events into GA4 via the global `[data-ga-event]` dispatch in
`public/script.js` (see `tteTrack` and the click delegation around lines
124-165). This doc is the canonical list — what each event means, where it
fires from, and which should be marked as **Conversion** in the GA4 admin.

GA4 conversion declarations happen in the **Admin → Events** panel of GA4
itself (property `G-FTQKB78PLE`); flipping the "Mark as conversion" toggle
for each event below promotes it from a regular event to a Key Event.

## Lead-intent events (mark as Conversion in GA4)

| Event name             | Fires from                                                                                                        | Conversion? |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| `phone_click`          | Every `tel:+16163347159` link (sticky bar, hero CTAs, booking page, blog footer CTAs, contact info blocks)        | ✅          |
| `clear_estimate_click` | Every primary `/booking` CTA across the site (hero CTAs on hubs, bottom `.cta-section` on every page, sticky bar) | ✅          |
| `sms_click`            | Every `sms:+16163347159` link                                                                                     | ✅          |
| `email_click`          | Every `mailto:info@toptier-electrical.com` link                                                                   | ✅          |
| `form_submit`          | Auto-fires on submit of every `<form>` (booking + contact)                                                        | ✅          |

## Engagement events (do NOT mark as Conversion — too noisy)

| Event name                | Fires from                                                                                                               | Conversion?                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `cta_click`               | Generic CTA tagging via `data-cta` attribute (currently the booking-form submit button)                                  | ❌                                                 |
| `tool_open`               | `/tools` index card clicks                                                                                               | ❌                                                 |
| `tool_calculate`          | Submit button of each calculator                                                                                         | ❌                                                 |
| `tool_result`             | After a calculator computes a recommendation; payload includes the bucket (panel amperage, generator kW, payback months) | ❌ — but a great audience signal                   |
| `reviews_click`           | Hero-rating element on each service hub                                                                                  | ❌                                                 |
| `external_link_click`     | Specific outbound links (currently only the LARA license verification link)                                              | ❌                                                 |
| `spoke_to_hub_click`      | Inline blog-post links to a service hub                                                                                  | ❌                                                 |
| `spoke_to_spoke_click`    | Inline blog-post links to another blog post                                                                              | ❌                                                 |
| `spoke_to_city_click`     | Inline blog-post links to a city / service-city page                                                                     | ❌                                                 |
| `resource_download_click` | PDF download links (currently `/resources/portable-generator-homeowner-manual.pdf`)                                      | ❌ (could be ✅ if treated as a lead magnet later) |

## Label conventions

Every event also carries `event_label` (set via `data-ga-label`) and
sometimes `event_destination` (`data-ga-destination`). Labels follow the
pattern `<source>__<purpose>`, e.g.:

- `sticky-bar__phone`, `sticky-bar__estimate`
- `hub-hero__reviews`
- `booking__phone`, `booking-form__inline-phone`
- `panel-size-calculator`, `generator-sizer`, `ev-charger-payback-calculator`

When adding a new tracked element, keep the dispatch attribute-based
(`data-ga-event` + `data-ga-label`) rather than wiring an inline `gtag()`
call — the global delegator in `public/script.js` handles it.

## Recommended GA4 audiences

Once events have a week of data, build these audiences in GA4 → Audiences:

1. **Calculator-engaged visitors** — `tool_result` fired in last 30 days.
   High intent — they have specific equipment needs.
2. **High-intent non-converters** — `clear_estimate_click` OR `phone_click`
   fired but NO `form_submit`. Candidates for retargeting if/when ads run.
3. **Service-page deep-readers** — landed on a hub page with `engagement_time_msec`
   > 60s. Cheap proxy for genuine consideration.

## Funnel mapping

Recommended GA4 → Explore → Funnel exploration steps:

1. Page view of any hub (`/panel-upgrades`, `/ev-chargers`, etc.)
2. `clear_estimate_click` OR `phone_click` (lead intent)
3. Page view of `/booking`
4. `form_submit` (conversion)

Each step's drop-off rate tells you where the funnel is leakiest. After
PR #141 (Option B — this PR), expect step 1→2 to improve because of
above-fold review stars + sticky mobile call bar, and step 3→4 to
improve because the booking form now has only 2 required fields (name +
email) instead of 8.
