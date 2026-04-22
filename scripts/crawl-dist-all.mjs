#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  console.error('dist directory not found. Run `npm run build` first.');
  process.exit(1);
}

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(distDir);

const toRoute = (file) => {
  const rel = path.relative(distDir, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/index\.html$/, '').replace(/\.html$/, '')}`.replace(/\/$/, '') || '/';
};

const routeToFile = new Map(htmlFiles.map((file) => [toRoute(file), file]));
const excludedRoutes = new Set(['/decapcms']);
const errors = [];
const warnings = [];
const summaries = [];

const normalizeInternalPath = (href) => {
  try {
    const u = new URL(href, 'https://toptier-electrical.com');
    if (u.origin !== 'https://toptier-electrical.com') return null;
    const clean = u.pathname.replace(/\/$/, '') || '/';
    return clean;
  } catch {
    return null;
  }
};

for (const file of htmlFiles) {
  const route = toRoute(file);
  if (excludedRoutes.has(route)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const bytes = Buffer.byteLength(html, 'utf8');
  const sha256 = crypto.createHash('sha256').update(html).digest('hex');

  const isRedirectShim =
    /http-equiv=["']refresh["']/i.test(html) ||
    /This page has moved|Redirecting to/i.test(html) ||
    /window\.location/i.test(html);

  const title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const canonical =
    html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ||
    html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1] ||
    '';
  const metaDescription =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1] ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i)?.[1] ||
    '';

  if (!title) errors.push(`Missing <title>: ${route}`);
  if (!isRedirectShim && h1Count === 0) errors.push(`Missing H1: ${route}`);
  if (h1Count > 1) warnings.push(`Multiple H1 (${h1Count}): ${route}`);
  if (!canonical) errors.push(`Missing canonical: ${route}`);
  if (!metaDescription && !isRedirectShim) warnings.push(`Missing meta description: ${route}`);

  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  ldBlocks.forEach((block, idx) => {
    try {
      JSON.parse(block[1]);
    } catch {
      errors.push(`Invalid JSON-LD at ${route} block ${idx + 1}`);
    }
  });

  const hrefs = [...html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
  for (const href of hrefs) {
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:')
    )
      continue;
    const internal = normalizeInternalPath(href);
    if (!internal) continue;
    if (/\.[a-z0-9]+$/i.test(internal) && !internal.endsWith('.html')) continue;
    if (!routeToFile.has(internal)) {
      warnings.push(`Internal link target not found in dist: ${route} -> ${internal}`);
    }
  }

  summaries.push({
    route,
    bytes,
    sha256,
    titleLength: title.length,
    hasCanonical: Boolean(canonical),
    h1Count,
    isRedirectShim,
  });
}

const result = {
  totalPages: summaries.length,
  redirectShims: summaries.filter((s) => s.isRedirectShim).length,
  errors,
  warnings,
  longestTitle: summaries.sort((a, b) => b.titleLength - a.titleLength)[0],
};

console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exit(1);
