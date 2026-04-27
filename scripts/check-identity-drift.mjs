#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const allowed = new Set(['src/data/site.json']);
const forbiddenPatterns = [
  { pattern: /G-FTQKB78PLE/g, label: 'Hardcoded GA4 measurement ID' },
  { pattern: /share\.google\//g, label: 'Hardcoded share.google GBP URL' },
  { pattern: /#electrician/g, label: 'Legacy schema provider @id' },
];

const issues = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(astro|ts|js|json|md|mdx)$/.test(full)) {
      const rel = path.relative(process.cwd(), full).replace(/\\/g, '/');
      if (allowed.has(rel)) continue;
      const text = fs.readFileSync(full, 'utf8');
      for (const { pattern, label } of forbiddenPatterns) {
        if (pattern.test(text)) issues.push(`${rel}: ${label}`);
      }
    }
  }
};
walk(path.resolve('src'));

if (issues.length) {
  console.error('Identity drift check failed:');
  issues.forEach((i) => console.error(`- ${i}`));
  process.exit(1);
}

console.log('Identity drift check passed.');
