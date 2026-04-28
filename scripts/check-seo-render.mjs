#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  console.error('dist directory not found. Run `npm run build` first.');
  process.exit(1);
}

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(distDir);

const titleMap = new Map();
const metaMap = new Map();
const issues = [];
const warnings = [];
const excludedRoutePrefixes = ['/tag/', '/category/', '/decapcms'];
const excludedExactRoutes = ['/404'];

const getRoute = (file) => {
  const rel = path.relative(distDir, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/index\.html$/, '').replace(/\.html$/, '')}`.replace(/\/$/, '') || '/';
};

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const route = getRoute(file);
  const isExcluded =
    excludedExactRoutes.includes(route) ||
    excludedRoutePrefixes.some((prefix) => route.startsWith(prefix)) ||
    route.startsWith('/blog/blog-');
  if (isExcluded) continue;

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch?.[1]?.trim() ?? '';
  if (!title) issues.push(`Missing <title>: ${route}`);

  const metaMatch =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const meta = metaMatch?.[1]?.trim() ?? '';
  if (!meta) {
    if (route.startsWith('/blog/')) warnings.push(`Missing meta description: ${route}`);
    else issues.push(`Missing meta description: ${route}`);
  }

  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1Count === 0 && !route.startsWith('/blog/')) issues.push(`Missing H1: ${route}`);
  if (h1Count > 1) issues.push(`Multiple H1 (${h1Count}): ${route}`);

  const canonicalMatch =
    html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  if (!canonicalMatch) issues.push(`Missing canonical: ${route}`);

  if (title.length > 70) warnings.push(`Long title (${title.length}): ${route}`);
  if (meta.length > 160) warnings.push(`Long meta description (${meta.length}): ${route}`);

  if (title) {
    if (!titleMap.has(title)) titleMap.set(title, []);
    titleMap.get(title).push(route);
  }
  if (meta) {
    if (!metaMap.has(meta)) metaMap.set(meta, []);
    metaMap.get(meta).push(route);
  }

  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  ldBlocks.forEach((block, i) => {
    try {
      JSON.parse(block[1]);
    } catch {
      issues.push(`Invalid JSON-LD at ${route} block ${i + 1}`);
    }
  });
}

for (const [title, routes] of titleMap.entries()) {
  if (routes.length > 1) warnings.push(`Duplicate title "${title}": ${routes.join(', ')}`);
}
for (const [meta, routes] of metaMap.entries()) {
  if (routes.length > 1) warnings.push(`Duplicate meta description "${meta}": ${routes.join(', ')}`);
}

if (issues.length > 0) {
  console.error('SEO render checks failed:');
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn('SEO render warnings:');
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

console.log(`SEO render checks passed for ${htmlFiles.length} HTML files.`);
