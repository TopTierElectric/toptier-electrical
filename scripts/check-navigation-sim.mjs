import { loadSiteConfig } from './lib/site-config.mjs';
import { getSourceRoutes } from './lib/routes.mjs';

const config = loadSiteConfig();
const routes = getSourceRoutes();

const staticNavigationRoutes = [
  '/',
  '/services',
  '/residential',
  '/commercial',
  '/service-areas',
  '/blog',
  '/gallery',
  '/about',
  '/contact',
  '/booking',
  '/faq',
  '/terms',
  '/privacy',
];

const locationRoutes = (config.routes.locations ?? []).map((slug) => `/${slug}`);

const checks = [
  ...staticNavigationRoutes,
  ...config.routes.services.map((slug) => `/${slug}`),
  ...locationRoutes,
];

const dedupedChecks = [...new Set(checks)];
const missing = dedupedChecks.filter((route) => !routes.has(route));

if (missing.length) {
  console.error('Navigation simulation failed. Missing routes:\n- ' + missing.join('\n- '));
  process.exit(1);
}

console.log(`Navigation simulation passed for ${dedupedChecks.length} expected routes.`);
