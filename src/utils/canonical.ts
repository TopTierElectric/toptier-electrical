const DEFAULT_CANONICAL_ORIGIN = 'https://www.toptier-electrical.com';

// Normalizes any input URL/path to the canonical origin (currently the
// www subdomain). Strips the input's own host/scheme and resolves the
// path against the canonical origin, so a value like
// `https://www.toptier-electrical.com/foo` becomes
// `https://www.toptier-electrical.com/foo` and a bare path like `/foo`
// becomes `https://www.toptier-electrical.com/foo`.
//
// Originally named `toApexCanonical` when the canonical was the apex.
// Google's URL Inspection consistently picks www over apex due to
// external link signals (GBP, citations, social), so the canonical was
// switched to www to match. The function name kept its original form
// for import-stability but now produces a www result.
// Strip `.html` suffix and any single trailing slash so the canonical
// URL matches the publicly served pretty URL — not the underlying file
// path. Astro 5 with `build.format: 'file'` exposes file-style paths
// (e.g. `/tag/electrician.html`) through `Astro.url.pathname` during
// static prerender of dynamic routes, which would otherwise leak into
// `<link rel="canonical">` for tag/category pagination pages.
const normalizeCanonicalPath = (pathname: string): string => {
  let next = pathname.replace(/\.html$/i, '');
  if (next.length > 1 && next.endsWith('/')) next = next.slice(0, -1);
  return next || '/';
};

export const toCanonical = (input: string, fallbackPath = '/'): string => {
  const fallback = new URL(normalizeCanonicalPath(fallbackPath || '/'), DEFAULT_CANONICAL_ORIGIN);

  try {
    const parsed = new URL(input, DEFAULT_CANONICAL_ORIGIN);
    const resolved = new URL(normalizeCanonicalPath(parsed.pathname), DEFAULT_CANONICAL_ORIGIN);
    return resolved.toString();
  } catch {
    return fallback.toString();
  }
};

// Backwards-compatible alias for callers that imported the old name.
// Removing in a follow-up sweep is safe; keeping it here avoids
// touching unrelated files in this PR.
export const toApexCanonical = toCanonical;
