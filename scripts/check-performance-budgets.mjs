import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('dist/ not found. Run `npm run build` before checking performance budgets.');
  process.exit(1);
}

const KB = 1024;

const budgets = [
  { file: 'dist/index.html', maxBytes: 180 * KB, label: 'Homepage HTML budget' },
  { file: 'dist/script.js', maxBytes: 20 * KB, label: 'Client JS bootstrap budget' },
  { file: 'dist/images/logos/TopTierElectrical_Logo_Web_600w.webp', maxBytes: 380 * KB, label: 'Primary logo budget' },
];

const cssFiles = ['dist/css/components.css', 'dist/css/design-tokens.css'];

let hasError = false;

function formatKB(bytes) {
  return `${(bytes / KB).toFixed(1)}KB`;
}

for (const budget of budgets) {
  if (!fs.existsSync(budget.file)) {
    console.error(`❌ Missing expected asset: ${budget.file}`);
    hasError = true;
    continue;
  }

  const size = fs.statSync(budget.file).size;
  if (size > budget.maxBytes) {
    console.error(
      `❌ ${budget.label} exceeded: ${budget.file} is ${formatKB(size)} (max ${formatKB(budget.maxBytes)})`
    );
    hasError = true;
    continue;
  }

  console.log(`✅ ${budget.label}: ${budget.file} is ${formatKB(size)} (max ${formatKB(budget.maxBytes)})`);
}

const existingCssFiles = cssFiles.filter((file) => fs.existsSync(file));
const combinedCssBytes = existingCssFiles.reduce((total, file) => total + fs.statSync(file).size, 0);
const combinedCssBudget = 260 * KB;

if (existingCssFiles.length === 0) {
  console.error('❌ Missing expected CSS assets in dist/css.');
  hasError = true;
} else if (combinedCssBytes > combinedCssBudget) {
  console.error(`❌ Combined CSS budget exceeded: ${formatKB(combinedCssBytes)} (max ${formatKB(combinedCssBudget)})`);
  hasError = true;
} else {
  console.log(
    `✅ Combined CSS budget: ${formatKB(combinedCssBytes)} (max ${formatKB(combinedCssBudget)}) across ${existingCssFiles.length} files`
  );
}

const astroAssetsDir = path.resolve('dist/_astro');
if (!fs.existsSync(astroAssetsDir)) {
  console.error('❌ Missing optimized image directory dist/_astro.');
  hasError = true;
} else {
  const heroWebpCandidates = fs
    .readdirSync(astroAssetsDir)
    .filter((entry) => entry.startsWith('Residential Panel.') && entry.endsWith('.webp'))
    .map((entry) => ({
      file: path.join('dist/_astro', entry),
      bytes: fs.statSync(path.join(astroAssetsDir, entry)).size,
    }))
    .sort((a, b) => a.bytes - b.bytes);

  if (heroWebpCandidates.length === 0) {
    console.error('❌ No optimized homepage hero WEBP images found in dist/_astro.');
    hasError = true;
  } else {
    const mobileCandidate = heroWebpCandidates[0];
    const desktopCandidate = heroWebpCandidates[Math.min(heroWebpCandidates.length - 1, 1)];
    const mobileMax = 90 * KB;
    const desktopMax = 190 * KB;

    if (mobileCandidate.bytes > mobileMax) {
      console.error(
        `❌ Hero mobile variant exceeded: ${mobileCandidate.file} is ${formatKB(mobileCandidate.bytes)} (max ${formatKB(mobileMax)})`
      );
      hasError = true;
    } else {
      console.log(
        `✅ Hero mobile variant: ${mobileCandidate.file} is ${formatKB(mobileCandidate.bytes)} (max ${formatKB(mobileMax)})`
      );
    }

    if (desktopCandidate.bytes > desktopMax) {
      console.error(
        `❌ Hero desktop variant exceeded: ${desktopCandidate.file} is ${formatKB(desktopCandidate.bytes)} (max ${formatKB(desktopMax)})`
      );
      hasError = true;
    } else {
      console.log(
        `✅ Hero desktop variant: ${desktopCandidate.file} is ${formatKB(desktopCandidate.bytes)} (max ${formatKB(desktopMax)})`
      );
    }
  }
}

if (hasError) {
  process.exit(1);
}
