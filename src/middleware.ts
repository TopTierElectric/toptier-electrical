import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Any *.pages.dev host is a Cloudflare Pages preview/deployment URL and must
  // not be indexed. Only the apex (toptier-electrical.com) should be indexable.
  const host = (context.request.headers.get('host') || '').toLowerCase();
  const isPreview = host.endsWith('.pages.dev');

  const response = await next();

  if (isPreview) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
});
