const DEFAULT_CANONICAL_ORIGIN = 'https://www.toptier-electrical.com';

// Normalizes any input URL/path to the canonical origin (currently the
// www subdomain). Strips the input's own host/scheme, removes any
// trailing .html extension, and resolves the result against the
// canonical origin. So `/foo`, `https://anything.com/foo`, and
// `/foo.html` all canonicalize to `https://www.toptier-electrical.com/foo`.
//
// The `.html` stripping is required because Astro's build.format='file'
// emits dist/foo.html and Astro.url.pathname returns '/foo.html' at
// runtime. Without stripping, canonical tags would point to the file
// path (`/foo.html`) instead of the public URL (`/foo`).
//
// Originally named `toApexCanonical` when the canonical was the apex.
// Google's URL Inspection consistently picks www over apex due to
// external link signals (GBP, citations, social), so the canonical was
// switched to www to match. The function name kept its original form
// for import-stability but now produces a www result.
export const toCanonical = (input: string, fallbackPath = '/'): string => {
  const fallback = new URL(fallbackPath || '/', DEFAULT_CANONICAL_ORIGIN);

  try {
    const parsed = new URL(input, DEFAULT_CANONICAL_ORIGIN);
    let pathname = parsed.pathname;
    if (pathname.endsWith('.html')) {
      pathname = pathname.slice(0, -5);
    }
    if (pathname === '') {
      pathname = '/';
    }
    const resolved = new URL(pathname, DEFAULT_CANONICAL_ORIGIN);
    return resolved.toString();
  } catch {
    return fallback.toString();
  }
};

// Backwards-compatible alias for callers that imported the old name.
// Removing in a follow-up sweep is safe; keeping it here avoids
// touching unrelated files in this PR.
export const toApexCanonical = toCanonical;
