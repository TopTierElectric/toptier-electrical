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
  '/electrician-holland',
  '/electrician-grand-rapids',
  '/electrician-zeeland',
  '/electrician-hudsonville',
  '/electrician-allegan',
  '/electrician-ada',
  '/electrician-grand-haven',
  '/electrician-muskegon',
];

const checks = [...staticNavigationRoutes, ...config.routes.services.map((slug) => `/${slug}`)];

const dedupedChecks = [...new Set(checks)];
const missing = dedupedChecks.filter((route) => !routes.has(route));

if (missing.length) {
  console.error('Navigation simulation failed. Missing routes:\n- ' + missing.join('\n- '));
  process.exit(1);
}

console.log(`Navigation simulation passed for ${dedupedChecks.length} expected routes.`);
