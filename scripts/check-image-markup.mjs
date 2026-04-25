#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/pages');
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && /\.(astro|md|mdx)$/.test(full)) files.push(full);
  }
};
walk(root);

const failures = [];
let highPriorityCount = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/<img\b([^>]*?)>/g)];
  for (const match of matches) {
    const attrs = match[1];
    const rel = path.relative(process.cwd(), file);
    if (!/\balt\s*=/.test(attrs)) failures.push(`${rel}: img missing alt attribute`);
    const decorative = /\balt\s*=\s*["']\s*["']/.test(attrs);
    if (!decorative && (!/\bwidth\s*=/.test(attrs) || !/\bheight\s*=/.test(attrs))) {
      failures.push(`${rel}: non-decorative img missing width or height`);
    }
    const isHighPriority = /\bfetchpriority\s*=\s*["']high["']/i.test(attrs);
    if (isHighPriority) {
      highPriorityCount += 1;
      if (!/index\.astro$/.test(rel)) {
        failures.push(`${rel}: fetchpriority=\"high\" should be restricted to the true LCP image.`);
      }
    }
    if (!isHighPriority && !decorative && !/\bloading\s*=/.test(attrs)) {
      failures.push(`${rel}: non-decorative img missing loading attribute`);
    }
    if (!/\bdecoding\s*=/.test(attrs)) {
      failures.push(`${rel}: img missing decoding attribute`);
    }
  }
}

if (highPriorityCount > 1) {
  failures.push(`Found ${highPriorityCount} images with fetchpriority="high". Expected at most 1.`);
}

if (failures.length) {
  console.error('Image markup check failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Image markup check passed across ${files.length} Astro files.`);
