interface Env {
  CF_PAGES_COMMIT_SHA?: string;
  CF_PAGES_BRANCH?: string;
  CF_PAGES_URL?: string;
}

interface PagesContext<E> {
  request: Request;
  env: E;
}

// GET /api/health
//
// Returns a small JSON snapshot of the running deployment so we can
// detect stale-deploy state in one fetch instead of running PSI to
// notice we're serving an old build. Cloudflare Pages injects the
// CF_PAGES_* env vars at build time; if they're missing we fall back
// to "unknown" so the endpoint never errors.
//
// No secrets are exposed. Commit SHAs and branch names are visible in
// the public Git repository anyway. The endpoint is rate-limited only
// implicitly through Cloudflare's per-IP defaults.
export const onRequestGet = async (context: PagesContext<Env>): Promise<Response> => {
  const { env } = context;
  const body = {
    ok: true,
    commit: env.CF_PAGES_COMMIT_SHA || 'unknown',
    branch: env.CF_PAGES_BRANCH || 'unknown',
    deploymentUrl: env.CF_PAGES_URL || 'unknown',
    runtime: 'cloudflare-pages',
    checkedAt: new Date().toISOString(),
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
    },
  });
};
