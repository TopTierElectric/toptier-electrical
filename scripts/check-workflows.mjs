import fs from 'node:fs';
import yaml from 'js-yaml';

const ciPath = new URL('../.github/workflows/ci.yml', import.meta.url);
const raw = fs.readFileSync(ciPath, 'utf8');
const parsed = yaml.load(raw, { schema: yaml.FAILSAFE_SCHEMA }) ?? {};

const requiredOrder = [
  'npm run build',
  'npm run verify',
  'npm run check:workflows',
  'npm run check:redirects-cloudflare',
  'npm run check:navigation-sim',
  'npm run localseo:ci',
];

const errors = [];

if (!parsed.on || !('pull_request' in parsed.on)) {
  errors.push('CI workflow must run on pull_request.');
}

const jobs = parsed.jobs ?? {};
if (Object.keys(jobs).length !== 1 || !jobs['quality-gate']) {
  errors.push('CI workflow must define one authoritative job named "quality-gate".');
}

const runLines = (jobs['quality-gate']?.steps ?? []).map((step) => step?.run).filter(Boolean);

let cursor = 0;
for (const required of requiredOrder) {
  const index = runLines.indexOf(required, cursor);
  if (index === -1) {
    errors.push(`Missing required quality-gate command in order: ${required}`);
  } else {
    cursor = index + 1;
  }
}

if (errors.length) {
  console.error('CI workflow validation failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log('Workflow gate check passed.');
