// Edge middleware for canonical-host enforcement.
//
// Without this, Cloudflare Pages exposes the site on the production
// .pages.dev URL (https://toptier-electrical.pages.dev) and any preview
// deploy URL (https://<hash>.toptier-electrical.pages.dev). Both serve
// identical content to the canonical https://www.toptier-electrical.com,
// which creates duplicate-content risk and leaks the deploy URL.
//
// Behavior:
//   1. Production .pages.dev URL  → 308 redirect to canonical www host.
//   2. Preview .pages.dev URL     → serve normally, but tag with
//                                   X-Robots-Tag: noindex, nofollow so
//                                   QA reviewers can view the deploy
//                                   while crawlers stay out.
//   3. /robots.txt on any .pages.dev host → return Disallow: / so any
//                                           crawler that does sneak in
//                                           can't enumerate paths.
//   4. Canonical hosts (www, apex) → pass through untouched.

const CANONICAL_ORIGIN = 'https://www.toptier-electrical.com';
const PRODUCTION_PAGES_HOST = 'toptier-electrical.pages.dev';

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();

  // Canonical hosts: serve normally.
  if (host === 'www.toptier-electrical.com' || host === 'toptier-electrical.com') {
    return next();
  }

  // .pages.dev/robots.txt: serve a Disallow-all robots regardless of
  // whether the host is the production alias or a preview deploy.
  if (host.endsWith('.pages.dev') && url.pathname === '/robots.txt') {
    return new Response('User-agent: *\nDisallow: /\n', {
      status: 200,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'public, max-age=3600',
        'x-robots-tag': 'noindex, nofollow',
      },
    });
  }

  // Production .pages.dev alias: 308 redirect to canonical, preserving
  // path and query string.
  if (host === PRODUCTION_PAGES_HOST) {
    const target = CANONICAL_ORIGIN + url.pathname + url.search;
    return new Response(null, {
      status: 308,
      headers: {
        location: target,
        'cache-control': 'public, max-age=3600',
        'x-robots-tag': 'noindex, nofollow',
      },
    });
  }

  // Preview deploy (<hash>.toptier-electrical.pages.dev): serve the
  // page so QA reviewers can verify the deploy, but block indexing.
  if (host.endsWith('.pages.dev')) {
    const response = await next();
    const headers = new Headers(response.headers);
    headers.set('x-robots-tag', 'noindex, nofollow');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // Unknown host: pass through. Shouldn't happen given the routing
  // attached to this Pages project, but failing closed could break
  // health checks from monitoring tools that hit raw IPs.
  return next();
};
