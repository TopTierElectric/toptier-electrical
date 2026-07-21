#!/usr/bin/env node
// Security audit gate with a documented allowlist.
//
// Replaces a bare `npm audit --audit-level=high`. The bare command can't
// distinguish advisories that are genuinely exploitable in THIS project
// from ones that only apply to runtime modes we don't use. This site is a
// fully static, prerendered Astro SSG deployed to Cloudflare Pages — there
// is no server runtime, no SSR, no server islands, and the dev server is
// never exposed.
//
// This gate fails on any HIGH or CRITICAL advisory EXCEPT the explicitly
// allowlisted GHSA IDs below, each with the reason it does not apply here.
// Anything not on the list — including any newly disclosed HIGH in any
// other package — still fails the build.
//
// The allowlist is currently EMPTY: the Astro 5 → 7 upgrade resolved every
// astro-core advisory that previously required an entry here, and the tree
// audits clean. Add an entry only when a real, non-applicable advisory
// appears, with the reason it does not apply to this static build.

import { execSync } from 'node:child_process';

// GHSA IDs that are non-applicable to this static SSG build. Keep the
// reason current — if a runtime assumption changes, remove the entry.
const ALLOWLIST = new Map([]);

const BLOCKING = new Set(['high', 'critical']);

let report;
try {
  // npm audit exits non-zero when vulns exist; capture stdout regardless.
  report = execSync('npm audit --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
} catch (err) {
  report = err.stdout?.toString() ?? '';
}

let data;
try {
  data = JSON.parse(report);
} catch {
  console.error('check-audit: could not parse `npm audit --json` output.');
  process.exit(1);
}

// Fail closed on an unrecognized report shape. npm v7+ audit JSON always
// carries both `vulnerabilities` (per-package detail) and a
// `metadata.vulnerabilities` count summary. If the `vulnerabilities` map is
// missing entirely, the format changed under us — do NOT pass vacuously.
if (typeof data.vulnerabilities !== 'object' || data.vulnerabilities === null) {
  console.error('check-audit: `npm audit --json` did not include a vulnerabilities map.');
  console.error('The audit JSON format may have changed. Refusing to pass without a real check.');
  process.exit(1);
}

const meta = data.metadata?.vulnerabilities ?? {};
const reportedBlocking = (meta.high ?? 0) + (meta.critical ?? 0);

const blocking = [];
const allowed = [];

for (const [name, vuln] of Object.entries(data.vulnerabilities ?? {})) {
  if (!BLOCKING.has(vuln.severity)) continue;
  // Collect the GHSA IDs backing this package's advisory chain.
  const ghsaIds = (vuln.via ?? [])
    .filter((v) => typeof v === 'object' && v.url)
    .map((v) => v.url.match(/GHSA-[\w-]+/)?.[0])
    .filter(Boolean);

  const directIds = ghsaIds.filter((id) => !ALLOWLIST.has(id));
  if (ghsaIds.length > 0 && directIds.length === 0) {
    allowed.push(`${name} (${vuln.severity}): ${ghsaIds.join(', ')}`);
  } else if (directIds.length > 0) {
    blocking.push(`${name} (${vuln.severity}): ${directIds.join(', ')}`);
  } else {
    // High/critical with no GHSA id surfaced (transitive-only): block to be safe.
    blocking.push(`${name} (${vuln.severity}): unidentified advisory — review manually`);
  }
}

// Cross-check: if npm's own summary reports high/critical advisories but our
// per-package walk classified none of them (neither blocked nor allowlisted),
// the parsing missed something — fail closed rather than pass silently.
if (reportedBlocking > 0 && blocking.length === 0 && allowed.length === 0) {
  console.error(
    `check-audit: npm reports ${reportedBlocking} high/critical advisory(ies) but none were parsed. Failing closed.`
  );
  process.exit(1);
}

if (allowed.length) {
  console.log('Allowlisted (non-applicable to this static SSG):');
  allowed.forEach((a) => console.log(`  - ${a}`));
}

if (blocking.length) {
  console.error('\nSecurity audit failed — non-allowlisted high/critical advisories:');
  blocking.forEach((b) => console.error(`  - ${b}`));
  console.error('\nIf one of these is genuinely non-applicable, add its GHSA id to the');
  console.error('ALLOWLIST in scripts/check-audit.mjs with a documented reason.');
  process.exit(1);
}

console.log('\nSecurity audit passed (no non-allowlisted high/critical advisories).');
