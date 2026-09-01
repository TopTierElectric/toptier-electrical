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
const ALLOWLIST = new Map([
  [
    'GHSA-jmr9-qjv8-65gv',
    'extract-zip <=2.0.1 (no patched release exists upstream). Build-time only: ' +
      'pulled by astro-icon -> @iconify/tools, whose zip handling would only run ' +
      'when downloading remote icon archives. This build loads icons exclusively ' +
      'from local @iconify-json packages; no untrusted archive is ever extracted ' +
      'in CI or at runtime (static SSG output ships no JS from this chain). ' +
      'Remove this entry when extract-zip publishes a fixed version.',
  ],
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

// Resolve each flagged package's full advisory set, following chain
// references (npm lists a parent's `via` as bare package-name strings
// when the advisory belongs to a transitive dependency). A parent is
// only as clean as every leaf it chains to; unresolvable or cyclic
// chains fail closed as before.
const vulns = data.vulnerabilities ?? {};
const resolveGhsaIds = (name, seen = new Set()) => {
  if (seen.has(name)) return { ids: [], unresolved: false };
  seen.add(name);
  const vuln = vulns[name];
  if (!vuln) return { ids: [], unresolved: true };
  let ids = [];
  let unresolved = false;
  for (const v of vuln.via ?? []) {
    if (typeof v === 'object' && v.url) {
      const id = v.url.match(/GHSA-[\w-]+/)?.[0];
      if (id) ids.push(id);
      else unresolved = true;
    } else if (typeof v === 'string') {
      const child = resolveGhsaIds(v, seen);
      ids = ids.concat(child.ids);
      unresolved = unresolved || child.unresolved;
    } else {
      unresolved = true;
    }
  }
  return { ids, unresolved };
};

for (const [name, vuln] of Object.entries(vulns)) {
  if (!BLOCKING.has(vuln.severity)) continue;
  const { ids: ghsaIds, unresolved } = resolveGhsaIds(name);

  const directIds = ghsaIds.filter((id) => !ALLOWLIST.has(id));
  if (directIds.length > 0) {
    blocking.push(`${name} (${vuln.severity}): ${directIds.join(', ')}`);
  } else if (ghsaIds.length > 0 && !unresolved) {
    allowed.push(`${name} (${vuln.severity}): ${ghsaIds.join(', ')} (via chain)`);
  } else {
    // High/critical with no GHSA id surfaced anywhere in the chain:
    // block to be safe.
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
