#!/usr/bin/env node
import fs from 'node:fs';
import { getSourceRoutes } from './lib/routes.mjs';
import { loadSiteConfig } from './lib/site-config.mjs';

const config = loadSiteConfig();
const sourceRoutes = getSourceRoutes();
const redirectsContent = fs.readFileSync('public/_redirects', 'utf8');

const redirectMap = new Map();
for (const line of redirectsContent.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [from, to] = trimmed.split(/\s+/);
  if (from && to) redirectMap.set(from, to);
}

const manifestRoutes = new Set([
  ...(config.routes.pages ?? []).map((slug) => (slug ? `/${slug}` : '/')),
  ...(config.routes.services ?? []).map((slug) => `/${slug}`),
]);

const excluded = new Set(['/404', '/thank-you']);
const canonicalSourceRoutes = [...sourceRoutes].filter(
  (route) => !excluded.has(route) && !route.includes('[') && !route.startsWith('/blog/')
);
const errors = [];

for (const route of canonicalSourceRoutes) {
  if (!manifestRoutes.has(route) && route.startsWith('/blog/') === false) {
    errors.push(`Canonical source route missing in site.json manifest: ${route}`);
  }
}

for (const route of manifestRoutes) {
  const hasSource = sourceRoutes.has(route);
  const hasRedirect = redirectMap.has(route);
  if (!hasSource && !hasRedirect) errors.push(`Manifest route has no source page or redirect: ${route}`);
  if (hasSource && hasRedirect && route !== '/testimonials') {
    errors.push(`Route has both a source page and redirect rule (canonical contradiction): ${route}`);
  }
}

if (sourceRoutes.has('/testimonials') && redirectMap.has('/testimonials')) {
  errors.push('/testimonials exists as both source page and redirect. It must be redirect-only.');
}

if (redirectMap.get('/reviews') && redirectMap.get('/reviews') !== '/reviews') {
  errors.push(`/reviews must not redirect away (found: ${redirectMap.get('/reviews')}).`);
}

if (errors.length) {
  console.error('Route governance check failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Route governance passed for ${canonicalSourceRoutes.length} canonical source routes, ${manifestRoutes.size} manifest routes, and ${redirectMap.size} redirects.`
);
