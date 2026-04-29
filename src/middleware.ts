import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  // Check if this is a .pages.dev preview deployment
  const host = context.request.headers.get('host') || '';
  const isPreview = host.includes('.pages.dev') && !host.includes('toptier-electrical.pages.dev');

  const response = next();
  
  // Add X-Robots-Tag noindex for preview deployments
  if (isPreview) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
});