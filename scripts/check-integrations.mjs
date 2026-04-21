#!/usr/bin/env node
import fs from 'node:fs';

const requiredDocs = [
  'docs/integrations/google-search-console.md',
  'docs/integrations/ga4.md',
  'docs/integrations/semrush-ahrefs.md',
  'docs/integrations/content-optimization.md',
  'docs/integrations/review-platform.md',
];

const missingDocs = requiredDocs.filter((doc) => !fs.existsSync(doc));
if (missingDocs.length) {
  console.error('Missing integration docs:');
  missingDocs.forEach((doc) => console.error(`- ${doc}`));
  process.exit(1);
}

const envPath = '.env.example';
if (!fs.existsSync(envPath)) {
  console.error('Missing .env.example');
  process.exit(1);
}

const env = fs.readFileSync(envPath, 'utf8');
const requiredKeys = [
  'PUBLIC_GA4_MEASUREMENT_ID=',
  'GSC_SITE_URL=',
  'GSC_SERVICE_ACCOUNT_EMAIL=',
  'AHREFS_API_KEY=',
  'SEMRUSH_API_KEY=',
  'CONTENT_OPTIMIZATION_PROVIDER=',
  'REVIEW_PLATFORM_PROVIDER=',
];

const missingKeys = requiredKeys.filter((key) => !env.includes(key));
if (missingKeys.length) {
  console.error('Missing .env.example keys:');
  missingKeys.forEach((key) => console.error(`- ${key}`));
  process.exit(1);
}

console.log('Integration scaffold checks passed.');
