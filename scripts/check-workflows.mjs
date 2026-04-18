import fs from 'node:fs';

const ciPath = new URL('../.github/workflows/ci.yml', import.meta.url);
const ci = fs.readFileSync(ciPath, 'utf8');
const required = [
  'npm run build',
  'npm run verify',
  'npm run check:workflows',
  'npm run check:redirects-cloudflare',
  'npm run check:navigation-sim',
  'npm run localseo:ci',
];

const missing = required.filter((cmd) => !ci.includes(cmd));
if (missing.length) {
  console.error('CI workflow missing required PR gates:\n- ' + missing.join('\n- '));
  process.exit(1);
}

console.log('Workflow gate check passed.');
