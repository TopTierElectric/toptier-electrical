interface Env {
  RESEND_API_KEY?: string;
  CONTACT_RECIPIENT?: string;
}

interface PagesContext<E> {
  request: Request;
  env: E;
}

const RECIPIENT_FALLBACK = 'info@toptier-electrical.com';
// Resend verifies the `send` subdomain (so the apex SPF/DKIM stay
// untouched and Microsoft 365 keeps working). Sender address must live
// under that verified subdomain or Resend rejects with 403.
const SENDER_DOMAIN = 'send.toptier-electrical.com';
const FROM_ADDRESS = `noreply@${SENDER_DOMAIN}`;
const FROM_NAME = 'Top Tier Electrical Contact Form';

const ALLOWED_ORIGINS = new Set(['https://toptier-electrical.com', 'https://www.toptier-electrical.com']);

const PAGES_PREVIEW_RE = /^https:\/\/[a-z0-9-]+\.toptier-electrical\.pages\.dev$/i;

// GET /api/contact returns a small diagnostic JSON so we can verify
// from a browser whether the env bindings reached the running function.
// Gated by a token query param (?key=...) so the route appears as 404
// to unauthenticated callers — no secret values are exposed but we don't
// want to leak deployment metadata either.
const DIAG_TOKEN = 'f1b378abb203800401f7cb507e03c6db';

export const onRequestGet = async (context: PagesContext<Env>): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  if (url.searchParams.get('key') !== DIAG_TOKEN) {
    return new Response('Not Found', { status: 404, headers: { 'cache-control': 'no-store' } });
  }
  const apiKey = typeof env.RESEND_API_KEY === 'string' ? env.RESEND_API_KEY.trim() : '';
  return new Response(
    JSON.stringify({
      ok: true,
      function: 'api/contact',
      bindings: {
        RESEND_API_KEY: {
          set: apiKey.length > 0,
          length: apiKey.length,
          starts_with_re: apiKey.startsWith('re_'),
        },
        CONTACT_RECIPIENT: {
          set: typeof env.CONTACT_RECIPIENT === 'string' && env.CONTACT_RECIPIENT.length > 0,
        },
      },
      env_keys: Object.keys(env || {}).sort(),
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    }
  );
};

export const onRequestPost = async (context: PagesContext<Env>): Promise<Response> => {
  const { request, env } = context;

  const origin = request.headers.get('Origin') || '';
  const isAllowedOrigin = !origin || ALLOWED_ORIGINS.has(origin) || PAGES_PREVIEW_RE.test(origin);
  if (origin && !isAllowedOrigin) {
    return errorResponse(request, 'Submission origin not allowed', 403);
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return errorResponse(request, 'Could not parse form data', 400);
  }

  if (str(data.get('_gotcha'))) {
    return successResponse(request, 'Thanks.');
  }

  const name = str(data.get('name'));
  const email = str(data.get('email'));
  const message = str(data.get('message') || data.get('notes'));
  const service = str(data.get('service') || data.get('service_type'));
  const formName = str(data.get('form_name')) || 'Contact form';

  if (!name || !email) {
    return errorResponse(request, 'Please fill in name and email.', 422);
  }
  if (!isValidEmail(email)) {
    return errorResponse(request, 'Please enter a valid email address.', 422);
  }
  if (!message && !service) {
    return errorResponse(request, 'Please tell us what you need help with.', 422);
  }

  const bodyLines: string[] = [`Submission: ${formName}`, ''];
  for (const [key, value] of data.entries()) {
    if (key.startsWith('_') || key === 'form_name') continue;
    bodyLines.push(`${labelize(key)}: ${String(value)}`);
  }
  bodyLines.push('', `User-Agent: ${request.headers.get('User-Agent') || 'unknown'}`, `Origin: ${origin || 'unknown'}`);

  const recipient = env.CONTACT_RECIPIENT || RECIPIENT_FALLBACK;
  const subject = `${formName} from ${name}`;

  if (!env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY env var is not set on this Pages environment');
    return errorResponse(request, 'Email delivery is not configured. Please call (616) 334-7159.', 502);
  }

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_ADDRESS}>`,
        to: [recipient],
        reply_to: email,
        subject,
        text: bodyLines.join('\n'),
      }),
    });
    if (!resp.ok) {
      console.error('Resend send rejected', resp.status, await resp.text().catch(() => ''));
      return errorResponse(request, 'Email delivery failed. Please call (616) 334-7159.', 502);
    }
  } catch (err) {
    console.error('Resend fetch failed', err);
    return errorResponse(request, 'Email delivery failed. Please call (616) 334-7159.', 502);
  }

  return successResponse(request, "Thanks — we'll respond within one business day.");
};

function str(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : '';
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function labelize(key: string): string {
  return key.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function wantsJson(request: Request): boolean {
  return (request.headers.get('Accept') || '').includes('application/json');
}

function successResponse(request: Request, message: string): Response {
  if (wantsJson(request)) {
    return new Response(JSON.stringify({ ok: true, message }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }
  const url = new URL(request.url);
  return Response.redirect(`${url.origin}/thank-you`, 303);
}

function errorResponse(request: Request, message: string, status: number): Response {
  if (wantsJson(request)) {
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }
  const url = new URL(request.url);
  return Response.redirect(`${url.origin}/contact?error=${encodeURIComponent(message)}`, 303);
}
