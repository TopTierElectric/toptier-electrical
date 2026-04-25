#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const declared = new Set();
const referenced = new Set();
const htmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(distDir);

const collectRefs = (value) => {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach(collectRefs);
    return;
  }
  if (typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      if (key === '@id' && typeof nested === 'string') referenced.add(nested);
      collectRefs(nested);
    }
  }
};

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of ldBlocks) {
    let parsed;
    try {
      parsed = JSON.parse(block[1]);
    } catch {
      continue;
    }
    const nodes = Array.isArray(parsed?.['@graph']) ? parsed['@graph'] : Array.isArray(parsed) ? parsed : [parsed];
    for (const node of nodes) {
      if (node && typeof node === 'object' && typeof node['@id'] === 'string') declared.add(node['@id']);
      collectRefs(node);
    }
  }
}

const internalRefs = [...referenced].filter((id) => /^https:\/\/toptier-electrical\.com\/#/.test(id));
const missing = internalRefs.filter((id) => !declared.has(id));

if (missing.length) {
  console.error('Schema graph integrity check failed. Missing declared @id targets:');
  [...new Set(missing)].forEach((id) => console.error(`- ${id}`));
  process.exit(1);
}

console.log(`Schema graph integrity check passed. Declared ${declared.size} IDs, referenced ${referenced.size} IDs.`);
