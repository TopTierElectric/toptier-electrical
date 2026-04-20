import fs from 'node:fs';
import path from 'node:path';

const redirectsPath = new URL('../public/_redirects', import.meta.url);
const content = fs.readFileSync(redirectsPath, 'utf8');
const lines = content
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((line) => !line.startsWith('#'));

const invalid = lines.filter((line) => !/^\/\S*\s+\/\S*\s+(301|302|307|308)$/.test(line));
if (invalid.length) {
  console.error('Invalid Cloudflare redirects syntax:\n- ' + invalid.join('\n- '));
  process.exit(1);
}

const edgeRules = lines.map((line) => {
  const [from, to, status] = line.split(/\s+/);
  return { from, to, status };
});

const duplicateSources = new Map();
for (const rule of edgeRules) {
  if (!duplicateSources.has(rule.from)) duplicateSources.set(rule.from, []);
  duplicateSources.get(rule.from).push(rule.to);
}
const duplicated = [...duplicateSources.entries()].filter(([, destinations]) => destinations.length > 1);
if (duplicated.length) {
  console.error('Duplicate redirect sources detected:');
  duplicated.forEach(([from, destinations]) => console.error(`- ${from} -> ${destinations.join(', ')}`));
  process.exit(1);
}

const selfRedirects = edgeRules.filter(({ from, to }) => from === to);
if (selfRedirects.length) {
  console.error('Self-redirects detected:');
  selfRedirects.forEach(({ from }) => console.error(`- ${from}`));
  process.exit(1);
}

const edgeMap = new Map(edgeRules.map(({ from, to }) => [from, to]));
const edgeCycles = [];
for (const { from, to } of edgeRules) {
  const hop2 = edgeMap.get(to);
  if (hop2 === from) edgeCycles.push(`${from} <-> ${to}`);
}
if (edgeCycles.length) {
  console.error('Two-hop redirect cycles detected in _redirects:');
  [...new Set(edgeCycles)].forEach((cycle) => console.error(`- ${cycle}`));
  process.exit(1);
}

const blogPageDir = path.resolve('src/pages/blog');
const astroRedirects = [];
if (fs.existsSync(blogPageDir)) {
  const redirectPattern = /Astro\.redirect\(\s*['"]([^'"]+)['"]\s*,\s*(301|302|307|308)\s*\)/;
  for (const filename of fs.readdirSync(blogPageDir)) {
    if (!filename.endsWith('.astro')) continue;
    const filepath = path.join(blogPageDir, filename);
    const sourcePath = `/blog/${filename.replace(/\.astro$/, '')}`;
    const content = fs.readFileSync(filepath, 'utf8');
    const match = content.match(redirectPattern);
    if (match) astroRedirects.push({ from: sourcePath, to: match[1], status: match[2] });
  }
}

const crossSystemCycles = [];
const astroMap = new Map(astroRedirects.map(({ from, to }) => [from, to]));
for (const { from: edgeFrom, to: edgeTo } of edgeRules) {
  const astroTo = astroMap.get(edgeTo);
  if (astroTo === edgeFrom) {
    crossSystemCycles.push(`${edgeFrom} -> ${edgeTo} (edge), ${edgeTo} -> ${edgeFrom} (Astro)`);
  }
}
if (crossSystemCycles.length) {
  console.error('Cross-system redirect cycles detected between _redirects and src/pages/blog/*.astro:');
  [...new Set(crossSystemCycles)].forEach((cycle) => console.error(`- ${cycle}`));
  process.exit(1);
}

console.log(
  `Cloudflare redirects check passed for ${lines.length} rules (edge rules: ${edgeRules.length}, blog Astro redirects scanned: ${astroRedirects.length}).`
);
