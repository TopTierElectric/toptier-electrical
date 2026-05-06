#!/usr/bin/env node
// scripts/check-jsonld.mjs
//
// Walks dist/**/*.html, extracts every <script type="application/ld+json">
// block, and audits for two structured-data failure modes:
//
//   1. Unparsable structured data — any block that does not parse as JSON.
//   2. Duplicate unique property — pages with two or more top-level
//      entities that both declare the same `name` value AND lack distinct
//      `@id` properties (which is what Google's parser merges).
//
// Exits non-zero on either failure class so this can be wired into CI.

import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const SCRIPT_RE = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const htmlFiles = walk(DIST);
const unparsable = [];
const duplicateProperty = [];
let totalBlocks = 0;
let pagesAudited = 0;

for (const file of htmlFiles) {
  const rel = path.relative(DIST, file);
  const html = fs.readFileSync(file, 'utf8');
  let match;
  const blocks = [];
  while ((match = SCRIPT_RE.exec(html)) !== null) {
    blocks.push({ raw: match[1].trim(), index: match.index });
  }
  if (blocks.length === 0) continue;
  pagesAudited++;
  totalBlocks += blocks.length;

  const parsed = [];
  for (const b of blocks) {
    try {
      parsed.push(JSON.parse(b.raw));
    } catch (e) {
      unparsable.push({
        file: rel,
        snippet: b.raw.slice(0, 120) + (b.raw.length > 120 ? '…' : ''),
        message: e.message,
      });
    }
  }

  // Flatten top-level entities. Each parsed JSON-LD doc may be either
  // a single entity object, an @graph wrapping multiple, or an array.
  const entities = [];
  for (const doc of parsed) {
    if (Array.isArray(doc)) {
      for (const e of doc) entities.push(e);
    } else if (doc && typeof doc === 'object' && Array.isArray(doc['@graph'])) {
      for (const e of doc['@graph']) entities.push(e);
    } else if (doc && typeof doc === 'object') {
      entities.push(doc);
    }
  }

  // Group entities by `name`. If two entities share the same `name`
  // AND at least one lacks `@id` (or they share the same `@id`),
  // Google's parser merges them and reports duplicate name.
  const byName = new Map();
  for (const e of entities) {
    if (!e || typeof e !== 'object') continue;
    const name = e.name;
    if (typeof name !== 'string' || name.length === 0) continue;
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(e);
  }
  for (const [name, group] of byName) {
    if (group.length < 2) continue;
    // OK if every entity has a distinct @id
    const ids = group.map((e) => e['@id']).filter(Boolean);
    const distinctIds = new Set(ids).size;
    if (distinctIds === group.length) continue; // all unique @ids → safe
    duplicateProperty.push({
      file: rel,
      name,
      count: group.length,
      types: group.map((e) => e['@type']).join(', '),
      missingIds: group.length - ids.length,
    });
  }
}

console.log(`Scanned ${htmlFiles.length} HTML files; ${pagesAudited} pages with JSON-LD; ${totalBlocks} JSON-LD blocks.`);
console.log('');

let bad = false;

if (unparsable.length > 0) {
  bad = true;
  console.error(`❌ Unparsable structured data (${unparsable.length}):`);
  for (const u of unparsable) {
    console.error(`  ${u.file}: ${u.message}`);
    console.error(`    snippet: ${u.snippet}`);
  }
  console.error('');
} else {
  console.log('✅ No unparsable structured data.');
}

if (duplicateProperty.length > 0) {
  bad = true;
  console.error(`❌ Duplicate unique property risk (${duplicateProperty.length}):`);
  for (const d of duplicateProperty) {
    console.error(`  ${d.file}`);
    console.error(`    name "${d.name}" used by ${d.count} entities (${d.types}); missing @id on ${d.missingIds}`);
  }
  console.error('');
} else {
  console.log('✅ No duplicate unique property risks.');
}

if (bad) {
  process.exit(1);
}
