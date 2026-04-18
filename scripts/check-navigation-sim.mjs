import { loadSiteConfig } from './lib/site-config.mjs';
import { getSourceRoutes } from './lib/routes.mjs';

const config = loadSiteConfig();
const routes = getSourceRoutes();
const checks = [
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
  ...config.routes.services.map((slug) => `/${slug}`),
];
const missing = checks.filter((route) => !routes.has(route));

if (missing.length) {
  console.error('Navigation simulation failed. Missing routes:\n- ' + missing.join('\n- '));
  process.exit(1);
}

console.log(`Navigation simulation passed for ${checks.length} expected routes.`);
