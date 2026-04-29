#!/usr/bin/env node
import fs from 'node:fs';

const robotsPath = 'public/robots.txt';
if (!fs.existsSync(robotsPath)) {
  console.error('Missing public/robots.txt');
  process.exit(1);
}

const robots = fs.readFileSync(robotsPath, 'utf8');
const acceptedSitemapDirectives = [
  'Sitemap: https://toptier-electrical.com/sitemap.xml',
  'Sitemap: https://toptier-electrical.com/sitemap-index.xml',
];
if (!acceptedSitemapDirectives.some((d) => robots.includes(d))) {
  console.error(`robots.txt must include one of:\n  - ${acceptedSitemapDirectives.join('\n  - ')}`);
  process.exit(1);
}

if (!fs.existsSync('dist/sitemap-index.xml') && !fs.existsSync('dist/sitemap.xml')) {
  console.error('Missing built sitemap file in dist/. Run `npm run build` first.');
  process.exit(1);
}

console.log('Sitemap/robots check passed.');
