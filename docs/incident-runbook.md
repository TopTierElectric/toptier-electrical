# Incident Runbook

## Scope

This runbook covers uptime failures, post-deploy smoke test failures, DNS/CDN outages, and third-party vendor outages.

## Triage

1. Open the failing GitHub Actions run and download `monitoring-results.json`.
2. Identify failed route(s), status code, and latency.
3. Verify whether maintenance is active (`MAINTENANCE_MODE=true`).
4. Confirm if failure is first-party (site route/static asset/conversion flow) or third-party (Formspree reachability).

## Rollback

1. If failure started after latest deploy, roll back to previous known-good deployment.
2. Re-run post-deploy smoke checks.
3. Keep rollback in place until root cause is verified and fixed.

## DNS/CDN outage handling

1. Validate DNS resolution for `toptier-electrical.com`.
2. Check CDN provider status and edge health.
3. Route emergency updates through status page and Slack incident channel.

## Vendor outage handling

1. Confirm Formspree/API reachability from workflow logs.
2. Keep embed fallback UX visible on contact/booking pages.
3. If vendor outage is confirmed, notify stakeholders and set maintenance mode when needed.

## Ownership and escalation

- Primary owner: Web Platform Engineer on-call.
- Secondary owner: Marketing Operations lead.
- Escalate to incident commander after 15 minutes unresolved.
- Escalate to executive stakeholder after 30 minutes unresolved.

## Resolution and closure

1. Confirm all uptime + smoke checks pass.
2. Remove maintenance mode if enabled.
3. Link remediation PR and workflow evidence in incident notes.
4. Schedule follow-up for SLO impact in monthly report.
