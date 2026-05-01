import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Any *.pages.dev host is a Cloudflare Pages preview/deployment URL and must
  // not be indexed. Only the apex (toptier-electrical.com) should be indexable.
  // Read from context.url so we don't tickle Astro's "request.headers used on
  // a prerendered route" warning during static build.
  const isPreview = context.url.hostname.toLowerCase().endsWith('.pages.dev');

  const response = await next();

  if (isPreview) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
});
