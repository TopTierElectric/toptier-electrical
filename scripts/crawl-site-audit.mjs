#!/usr/bin/env node

const startUrl = process.argv[2] || process.env.PREVIEW_URL;

if (!startUrl) {
  throw new Error(
    'Missing preview URL. Pass argv[2] or set PREVIEW_URL, e.g. PREVIEW_URL="https://codex-task-title-n560vp.toptier-electrical.pages.dev/" npm run crawl:preview'
  );
}

const parsedStartUrl = new URL(startUrl);
if (!['http:', 'https:'].includes(parsedStartUrl.protocol)) {
  throw new Error(`Unsupported protocol for preview crawl: ${parsedStartUrl.protocol}`);
}

const normalizePath = (pathname) => pathname.replace(/\/+$/, '') || '/';
const normalizeUrl = (url) => {
  const cloned = new URL(url.toString());
  cloned.hash = '';
  cloned.search = '';
  cloned.pathname = normalizePath(cloned.pathname);
  return cloned.toString();
};

const extractLinks = (html, base) => {
  const links = [];
  const linkRegex = /<a\b[^>]*href\s*=\s*"([^"]+)"[^>]*>/gi;
  let match;
  while ((match = linkRegex.exec(html))) {
    const href = match[1].trim();
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    try {
      const candidate = new URL(href, base);
      if (candidate.origin !== base.origin) continue;
      links.push(normalizeUrl(candidate));
    } catch {
      // ignore malformed URLs
    }
  }
  return links;
};

const queue = [normalizeUrl(parsedStartUrl)];
const seen = new Set();
const failures = [];
const MAX_PAGES = Number.parseInt(process.env.CRAWL_MAX_PAGES || '120', 10);

while (queue.length > 0 && seen.size < MAX_PAGES) {
  const current = queue.shift();
  if (seen.has(current)) continue;
  seen.add(current);

  let response;
  try {
    response = await fetch(current, { redirect: 'follow' });
  } catch (error) {
    failures.push(`${current} -> network error: ${error.message}`);
    continue;
  }

  if (!response.ok) {
    failures.push(`${current} -> HTTP ${response.status}`);
    continue;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) continue;

  const html = await response.text();
  const discovered = extractLinks(html, parsedStartUrl);
  for (const link of discovered) {
    if (!seen.has(link)) queue.push(link);
  }
}

console.log(`Preview crawl target: ${normalizeUrl(parsedStartUrl)} | visited ${seen.size} pages`);

if (failures.length) {
  console.error('Preview crawl found failures:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Preview crawl completed with no HTTP/network failures.');
