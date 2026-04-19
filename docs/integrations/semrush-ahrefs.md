# Semrush / Ahrefs Integration Scaffold

## Purpose

Support keyword movement, cannibalization review, and backlink gap execution.

## Scaffolded Keys

- `AHREFS_API_KEY`
- `SEMRUSH_API_KEY`

## Operating Model

- Pull top keyword clusters monthly.
- Map winner URL per cluster to `docs/keyword_to_url_map.md`.
- Feed deltas into `docs/cannibalization_report.md` and `docs/ctr_test_queue.md`.

No secrets are committed in repository.
