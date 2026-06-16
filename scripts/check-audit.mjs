#!/usr/bin/env node
// Security audit gate with a documented allowlist.
//
// Replaces a bare `npm audit --audit-level=high`. The bare command can't
// distinguish advisories that are genuinely exploitable in THIS project
// from ones that only apply to runtime modes we don't use. This site is a
// fully static, prerendered Astro SSG deployed to Cloudflare Pages — there
// is no server runtime, no SSR, no server islands, and the dev server is
// never exposed. Several astro-core advisories only apply to those modes,
// yet npm audit reports them at HIGH against the pinned astro 5.x line,
// where the only "fix" npm offers is a breaking major bump to astro 6.x.
//
// This gate fails on any HIGH or CRITICAL advisory EXCEPT the explicitly
// allowlisted GHSA IDs below, each with the reason it does not apply here.
// Anything not on the list — including any newly disclosed HIGH in any
// other package — still fails the build. Re-evaluate the allowlist when
// astro is upgraded to 6.x (tracked separately); these entries should be
// removable then.

import { execSync } from 'node:child_process';

// GHSA IDs that are non-applicable to this static SSG build. Keep the
// reason current — if a runtime assumption changes, remove the entry.
const ALLOWLIST = new Map([
  ['GHSA-j687-52p2-xcff', 'astro define:vars XSS — only static config values are passed to define:vars; no user input'],
  ['GHSA-xr5h-phrj-8vxv', 'astro server-island encrypted-param replay — no server islands; fully static build'],
  ['GHSA-8hv8-536x-4wqp', 'astro reflected XSS via slot name — no SSR and no user-controlled slot names'],
  ['GHSA-jrpj-wcv7-9fh9', 'astro XSS via spread-props attribute names — no user-controlled spread attribute names'],
  ['GHSA-2pvr-wf23-7pc7', 'astro host-header SSRF in prerendered error-page fetch — no server runtime to fetch'],
]);

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
