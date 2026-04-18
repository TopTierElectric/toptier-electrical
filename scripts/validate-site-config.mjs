import { loadSiteConfig, validateSiteConfig } from './lib/site-config.mjs';

const config = loadSiteConfig();
const errors = validateSiteConfig(config);

if (errors.length) {
  console.error('Invalid src/data/site.json:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log('Site config validation passed.');
