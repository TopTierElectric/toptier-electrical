#!/usr/bin/env node
import { execSync } from 'node:child_process';

const checks = [
  'npm run check:identity-drift',
  'npm run check:phone-normalization',
  'npm run check:navigation-sim',
  'npm run check:route-governance',
  'npm run check:image-markup',
];

for (const command of checks) {
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
}

console.log('Unit-style QA checks passed.');
