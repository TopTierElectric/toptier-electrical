const DEFAULT_CANONICAL_ORIGIN = 'https://toptier-electrical.com';

export const toApexCanonical = (input: string, fallbackPath = '/'): string => {
  const fallback = new URL(fallbackPath || '/', DEFAULT_CANONICAL_ORIGIN);

  try {
    const parsed = new URL(input, DEFAULT_CANONICAL_ORIGIN);
    const resolved = new URL(parsed.pathname, DEFAULT_CANONICAL_ORIGIN);
    return resolved.toString();
  } catch {
    return fallback.toString();
  }
};
