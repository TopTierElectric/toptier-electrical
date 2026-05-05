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

const routeByFile = new Map();
for (const file of htmlFiles) {
  const rel = path.relative(distDir, file).replace(/\\/g, '/');
  const route =
    rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/, '').replace(/\.html$/, '')}`.replace(/\/$/, '') || '/';
  routeByFile.set(file, route);
}
const validRoutes = new Set(routeByFile.values());

const hrefRegex = /<a\b[^>]*href\s*=\s*"([^"]+)"[^>]*>/gi;
const failures = [];
let linkCount = 0;

for (const [file, route] of routeByFile.entries()) {
  const html = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = hrefRegex.exec(html))) {
    const href = match[1].trim();
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;

    let target;
    try {
      target = new URL(href, 'https://www.toptier-electrical.com');
    } catch {
      failures.push(`${route}: malformed href ${href}`);
      continue;
    }

    if (target.origin !== 'https://www.toptier-electrical.com') continue;
    const pathname = target.pathname.replace(/\/+$/, '') || '/';
    if (
      !validRoutes.has(pathname) &&
      pathname !== '/rss.xml' &&
      pathname !== '/tag' &&
      pathname !== '/category' &&
      !pathname.startsWith('/images/') &&
      !pathname.startsWith('/assets/')
    ) {
      failures.push(`${route}: unresolved internal link ${pathname}`);
    }
    linkCount += 1;
  }
}

console.log(`Crawled ${htmlFiles.length} HTML files and inspected ${linkCount} internal links.`);

if (failures.length) {
  console.error('Dist crawl failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Dist crawl passed with no unresolved internal links.');
