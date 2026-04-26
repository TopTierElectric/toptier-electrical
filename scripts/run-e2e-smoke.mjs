#!/usr/bin/env node
import { execSync } from 'node:child_process';

const checks = [
  'npm run check:canonical-tags',
  'npm run check:schema-graph',
  'npm run check:review-schema-policy',
  'npm run check:sitemap-robots',
];
for (const command of checks) {
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
}

console.log('E2E smoke-style checks passed.');
