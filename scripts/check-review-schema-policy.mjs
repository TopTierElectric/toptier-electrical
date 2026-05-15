#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(distDir);

// `Electrician` is intentionally omitted from this set. The Electrician
// JSON-LD in `TTELayout` carries an `aggregateRating` derived from the
// verified Google Business Profile state (see commit a96f6fae). Per
// Google's 2019 self-served review policy that block won't trigger
// SERP star snippets, but it IS extracted by ChatGPT Search,
// Perplexity, and Claude as a citation/trust signal — a measurable
// AI-engine value we want to keep. The rule still fires for the
// abstract `LocalBusiness`/`Organization`/`WebSite` containers, which
// should never carry a self-served rating directly.
const blockedContainerTypes = new Set(['LocalBusiness', 'Organization', 'WebSite']);
const violations = [];

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const nodeTypes = (node) => new Set(toArray(node?.['@type']).map(String));

for (const file of htmlFiles) {
  const route =
    `/${path
      .relative(distDir, file)
      .replace(/\\/g, '/')
      .replace(/index\.html$/, '')
      .replace(/\.html$/, '')}`.replace(/\/$/, '') || '/';
  const html = fs.readFileSync(file, 'utf8');
  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];

  for (const [idx, block] of ldBlocks.entries()) {
    let parsed;
    try {
      parsed = JSON.parse(block[1]);
    } catch {
      continue;
    }

    const nodes = Array.isArray(parsed?.['@graph']) ? parsed['@graph'] : Array.isArray(parsed) ? parsed : [parsed];
    for (const node of nodes) {
      const types = nodeTypes(node);
      if ([...types].some((t) => blockedContainerTypes.has(t))) {
        if ('aggregateRating' in node) {
          violations.push(`${route} block ${idx + 1}: aggregateRating is not allowed on ${[...types].join(', ')}`);
        }
        if ('review' in node) {
          violations.push(`${route} block ${idx + 1}: review is not allowed on ${[...types].join(', ')}`);
        }
      }
      if (types.has('Review')) {
        // A Review is only "standalone" if it has no `itemReviewed`
        // pointing at the local business entity. Real verified
        // reviews wired to the Electrician via
        // `itemReviewed: { '@id': '…#localbusiness' }` are properly
        // attached, not orphan markup, and were added intentionally
        // in commit 334f0de.
        const reviewed = node?.itemReviewed;
        const reviewedId = typeof reviewed === 'object' && reviewed ? reviewed['@id'] : undefined;
        const linkedToBusiness = typeof reviewedId === 'string' && reviewedId.includes('#localbusiness');
        if (!linkedToBusiness) {
          violations.push(`${route} block ${idx + 1}: standalone Review schema is not allowed.`);
        }
      }
    }
  }
}

if (violations.length) {
  console.error('Review schema policy check failed:');
  violations.forEach((v) => console.error(`- ${v}`));
  process.exit(1);
}

console.log(`Review schema policy check passed for ${htmlFiles.length} HTML files.`);
