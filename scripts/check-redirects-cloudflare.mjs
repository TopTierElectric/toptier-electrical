import fs from 'node:fs';

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

console.log(`Cloudflare redirects check passed for ${lines.length} rules.`);
