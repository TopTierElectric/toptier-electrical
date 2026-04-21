#!/usr/bin/env node
import crypto from 'node:crypto';

const startUrl = process.argv[2] || 'https://codex-task-title.toptier-electrical.pages.dev/';
const maxPages = Number(process.argv[3] || 300);
const origin = new URL(startUrl).origin;

const queue = [startUrl];
const visited = new Set();
const results = [];
const failures = [];

const normalize = (url) => {
  const u = new URL(url, origin);
  u.hash = '';
  if (u.pathname !== '/' && u.pathname.endsWith('/')) u.pathname = u.pathname.slice(0, -1);
  return u.toString();
};

while (queue.length && visited.size < maxPages) {
  const current = normalize(queue.shift());
  if (visited.has(current)) continue;
  visited.add(current);

  try {
    const res = await fetch(current, { redirect: 'follow' });
    const body = await res.text();
    const bytes = Buffer.byteLength(body, 'utf8');
    const digest = crypto.createHash('sha256').update(body).digest('hex');
    const contentType = res.headers.get('content-type') || '';

    const title = (body.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
    const h1Count = (body.match(/<h1[\s>]/gi) || []).length;
    const canonical =
      body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ||
      body.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1] ||
      '';

    results.push({ url: current, status: res.status, bytes, sha256: digest, title, h1Count, canonical, contentType });

    if (!res.ok) failures.push(`HTTP ${res.status}: ${current}`);
    if (!contentType.includes('text/html')) continue;

    const links = [...body.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
    for (const href of links) {
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
      const next = normalize(new URL(href, current).toString());
      if (!next.startsWith(origin)) continue;
      if (!visited.has(next)) queue.push(next);
    }
  } catch (error) {
    failures.push(`Fetch error: ${current} (${error.message})`);
  }
}

const longTitles = results.filter((r) => r.title.length > 70).map((r) => `${r.url} (${r.title.length})`);
const missingCanonicals = results.filter((r) => r.contentType.includes('text/html') && !r.canonical).map((r) => r.url);
const missingH1 = results.filter((r) => r.contentType.includes('text/html') && r.h1Count === 0).map((r) => r.url);

console.log(
  JSON.stringify(
    {
      startUrl,
      crawled: results.length,
      failures,
      longTitles,
      missingCanonicals,
      missingH1,
      sample: results.slice(0, 10),
    },
    null,
    2
  )
);

if (failures.length) process.exitCode = 1;
