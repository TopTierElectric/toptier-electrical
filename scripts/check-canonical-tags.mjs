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

const issues = [];
for (const file of htmlFiles) {
  const rel = path.relative(distDir, file).replace(/\\/g, '/');
  const route =
    rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/, '').replace(/\.html$/, '')}`.replace(/\/$/, '') || '/';
  if (route === '/404' || route.startsWith('/decapcms')) continue;
  const expected = `https://toptier-electrical.com${route === '/' ? '/' : route}`;
  const html = fs.readFileSync(file, 'utf8');
  const canonicalMatchA = [...html.matchAll(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/gi)];
  const canonicalMatchB = [...html.matchAll(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/gi)];
  const canonicalMatches = [...canonicalMatchA, ...canonicalMatchB];
  if (canonicalMatches.length < 1) {
    issues.push(`${route}: expected exactly one canonical tag, found 0`);
    continue;
  }
  if (canonicalMatches.length > 1) {
    issues.push(`${route}: expected exactly one canonical tag, found ${canonicalMatches.length}`);
    continue;
  }
  const canonical = canonicalMatches[0][1];
  if (!canonical.startsWith('https://toptier-electrical.com')) {
    issues.push(`${route}: canonical must use https://toptier-electrical.com (found ${canonical})`);
    continue;
  }
  if (!route.startsWith('/blog/') && canonical !== expected) {
    issues.push(`${route}: canonical mismatch (expected ${expected}, found ${canonical})`);
  }
}

if (issues.length) {
  console.error('Canonical tag check failed:');
  issues.forEach((i) => console.error(`- ${i}`));
  process.exit(1);
}

console.log(`Canonical tag check passed for ${htmlFiles.length} HTML files.`);
