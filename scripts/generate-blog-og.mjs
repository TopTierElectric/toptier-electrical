#!/usr/bin/env node
// Generates 1200x630 OG images for blog posts in the established TTE style:
// dark navy background, gold left stripe, gold "TOP TIER ELECTRICAL · BLOG"
// label, large white title, footer trust line.
//
// Reads frontmatter from src/data/post/*.mdx and writes PNGs to
// public/images/og/blog/<slug>.png. Skips posts whose OG already exists
// unless --force is passed.

import { readFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const POSTS_DIR = join(ROOT, 'src/data/post');
const OG_DIR = join(ROOT, 'public/images/og/blog');
const FORCE = process.argv.includes('--force');

const WIDTH = 1200;
const HEIGHT = 630;
const STRIPE_W = 16;
const PAD_X = 80;
const NAVY = '#0e1729';
const GOLD = '#d4af37';
const WHITE = '#ffffff';
const MUTED = '#cbd5e1';

mkdirSync(OG_DIR, { recursive: true });

function parseFrontmatter(mdx) {
  const m = mdx.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    out[kv[1]] = v;
  }
  return out;
}

// Wrap title into lines of approximately maxChars chars without breaking words.
function wrapTitle(title, maxChars = 22) {
  const words = title.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) {
      cur = w;
      continue;
    }
    if ((cur + ' ' + w).length > maxChars) {
      lines.push(cur);
      cur = w;
    } else {
      cur += ' ' + w;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3); // hard cap 3 lines
}

function escXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function svgFor(title) {
  const lines = wrapTitle(title);
  // Auto-tune font size based on line count
  const fontSize = lines.length >= 3 ? 72 : 88;
  const lineHeight = fontSize * 1.12;
  // Center the block vertically around y=315 (HEIGHT/2)
  const blockHeight = lines.length * lineHeight;
  const startY = HEIGHT / 2 - blockHeight / 2 + fontSize * 0.85;
  const tspans = lines
    .map((ln, i) => `<tspan x="${PAD_X}" y="${startY + i * lineHeight}">${escXml(ln)}</tspan>`)
    .join('');
  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${NAVY}"/>
  <rect x="0" y="0" width="${STRIPE_W}" height="${HEIGHT}" fill="${GOLD}"/>
  <text x="${PAD_X}" y="92" font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif"
        font-size="28" font-weight="700" fill="${GOLD}" letter-spacing="2">
    TOP TIER ELECTRICAL  ·  BLOG
  </text>
  <text font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif"
        font-size="${fontSize}" font-weight="800" fill="${WHITE}">
    ${tspans}
  </text>
  <text x="${PAD_X}" y="${HEIGHT - 64}" font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif"
        font-size="26" font-weight="600" fill="${MUTED}">
    West Michigan  ·  Licensed &amp; Insured  ·  MI #6220430
  </text>
</svg>`;
}

const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
let created = 0;
let skipped = 0;

for (const file of files) {
  const slug = basename(file, extname(file));
  const out = join(OG_DIR, `${slug}.png`);
  if (existsSync(out) && !FORCE) {
    skipped++;
    continue;
  }
  const mdx = readFileSync(join(POSTS_DIR, file), 'utf8');
  const fm = parseFrontmatter(mdx);
  const title = fm.title || slug;
  const svg = svgFor(title);
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`og: ${slug}.png`);
  created++;
}

console.log(
  `\nGenerated ${created} new OG image${created === 1 ? '' : 's'} (${skipped} already existed, use --force to regenerate).`
);
