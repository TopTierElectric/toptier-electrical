import { loadSiteConfig, validateSiteConfig } from './lib/site-config.mjs';
import { getSourceRoutes } from './lib/routes.mjs';

const config = loadSiteConfig();
const sourceRoutes = getSourceRoutes();
const errors = [...validateSiteConfig(config)];

for (const slug of config.routes.services ?? []) {
  const route = `/${slug}`;
  if (!sourceRoutes.has(route)) errors.push(`Service route missing in src/pages: ${route}`);
}

for (const slug of config.routes.pages ?? []) {
  const route = slug ? `/${slug}` : '/';
  if (!sourceRoutes.has(route)) errors.push(`Page route missing in src/pages: ${route}`);
}

if (errors.length) {
  console.error('Local SEO audit failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log(`Local SEO audit passed for ${sourceRoutes.size} source routes.`);
