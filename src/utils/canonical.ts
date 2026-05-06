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
export const toCanonical = (input: string, fallbackPath = '/'): string => {
  const fallback = new URL(fallbackPath || '/', DEFAULT_CANONICAL_ORIGIN);

  try {
    const parsed = new URL(input, DEFAULT_CANONICAL_ORIGIN);
    const resolved = new URL(parsed.pathname, DEFAULT_CANONICAL_ORIGIN);
    return resolved.toString();
  } catch {
    return fallback.toString();
  }
};

// Backwards-compatible alias for callers that imported the old name.
// Removing in a follow-up sweep is safe; keeping it here avoids
// touching unrelated files in this PR.
export const toApexCanonical = toCanonical;
