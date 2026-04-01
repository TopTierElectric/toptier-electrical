import fs from 'node:fs';

const configPath = new URL('../monitoring/uptime.config.json', import.meta.url);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const errors = [];

const isNonEmptyArray = (v) => Array.isArray(v) && v.length > 0;

if (!/^https?:\/\//.test(config.baseUrl ?? '')) {
  errors.push('baseUrl must start with http:// or https://');
}

if (!config.maintenance || typeof config.maintenance.enabled !== 'boolean') {
  errors.push('maintenance.enabled must be a boolean');
}
if (!isNonEmptyArray(config.maintenance?.expectedStatus)) {
  errors.push('maintenance.expectedStatus must be a non-empty array');
}

if (!isNonEmptyArray(config.checks)) {
  errors.push('checks must be a non-empty array');
} else {
  for (const check of config.checks) {
    if (!check.id) errors.push('check.id is required');
    if (!check.path?.startsWith('/')) errors.push(`check ${check.id ?? '(unknown)'} path must start with /`);
    if (!isNonEmptyArray(check.expectedStatus)) errors.push(`check ${check.id} expectedStatus must be non-empty`);
    if (!isNonEmptyArray(check.markers)) errors.push(`check ${check.id} markers must be non-empty`);
    if (!isNonEmptyArray(check.fallbackMarkers)) errors.push(`check ${check.id} fallbackMarkers must be non-empty`);
  }
}

if (!isNonEmptyArray(config.thirdParty)) {
  errors.push('thirdParty must be a non-empty array');
}

if (errors.length > 0) {
  console.error('Invalid monitoring/uptime.config.json:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log('Monitoring config validation passed.');
