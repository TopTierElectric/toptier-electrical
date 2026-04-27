#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const forbidden = /[\u2010\u2011\u2012\u2013\u2014]/;
const issues = [];

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(astro|md|mdx|ts|js)$/.test(full)) {
      const text = fs.readFileSync(full, 'utf8');
      const rel = path.relative(process.cwd(), full);
      const telMatches = [...text.matchAll(/tel:[^"')\s]+/g)].map((m) => m[0]);
      for (const tel of telMatches) {
        if (tel.includes('${')) continue;
        if (tel !== 'tel:+16163347159') issues.push(`${rel}: found non-standard tel link (${tel})`);
      }

      for (const line of text.split(/\r?\n/)) {
        if (!/(616)\s*334|tel:\+16163347159/.test(line)) continue;
        if (forbidden.test(line)) {
          issues.push(`${rel}: found forbidden hyphen character in phone context`);
          break;
        }
      }
    }
  }
};
walk(root);

if (issues.length) {
  console.error('Phone normalization check failed:');
  issues.forEach((i) => console.error(`- ${i}`));
  process.exit(1);
}

console.log('Phone normalization check passed.');
