import fs from 'node:fs';

const ciPath = new URL('../.github/workflows/ci.yml', import.meta.url);
const ci = fs.readFileSync(ciPath, 'utf8');
const required = [
  'npm run build',
  'npm run check:performance-budgets',
  'npm run verify',
  'npm run check:workflows',
  'npm run check:navigation-sim',
  'npm run localseo:ci',
  'npm run check:seo-render',
  'npm run check:integrations',
  'npm run check:route-governance',
  'npm run check:review-schema-policy',
  'npm run check:schema-graph',
  'npm run check:image-markup',
  'npm audit --audit-level=high',
];

const missing = required.filter((cmd) => !ci.includes(cmd));
if (missing.length) {
  console.error('CI workflow missing required PR gates:\n- ' + missing.join('\n- '));
  process.exit(1);
}

console.log('Workflow gate check passed.');
