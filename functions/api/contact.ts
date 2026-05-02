interface Env {
  MAILCHANNELS_RECIPIENT?: string;
  MAILCHANNELS_DKIM_DOMAIN?: string;
  MAILCHANNELS_DKIM_SELECTOR?: string;
  MAILCHANNELS_DKIM_PRIVATE_KEY?: string;
}

interface PagesContext<E> {
  request: Request;
  env: E;
}

const RECIPIENT_FALLBACK = 'info@toptier-electrical.com';
const SENDER_DOMAIN = 'toptier-electrical.com';
const FROM_ADDRESS = `noreply@${SENDER_DOMAIN}`;
const FROM_NAME = 'Top Tier Electrical Contact Form';

const ALLOWED_ORIGINS = new Set(['https://toptier-electrical.com', 'https://www.toptier-electrical.com']);

const PAGES_PREVIEW_RE = /^https:\/\/[a-z0-9-]+\.toptier-electrical\.pages\.dev$/i;

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
  const formName = str(data.get('form_name')) || 'Contact form';

  if (!name || !email || !message) {
    return errorResponse(request, 'Please fill in name, email, and a message.', 422);
  }
  if (!isValidEmail(email)) {
    return errorResponse(request, 'Please enter a valid email address.', 422);
  }

  const bodyLines: string[] = [`Submission: ${formName}`, ''];
  for (const [key, value] of data.entries()) {
    if (key.startsWith('_') || key === 'form_name') continue;
    bodyLines.push(`${labelize(key)}: ${String(value)}`);
  }
  bodyLines.push('', `User-Agent: ${request.headers.get('User-Agent') || 'unknown'}`, `Origin: ${origin || 'unknown'}`);

  const recipient = env.MAILCHANNELS_RECIPIENT || RECIPIENT_FALLBACK;
  const subject = `${formName} from ${name}`;

  const personalization: Record<string, unknown> = { to: [{ email: recipient }] };
  if (env.MAILCHANNELS_DKIM_DOMAIN && env.MAILCHANNELS_DKIM_SELECTOR && env.MAILCHANNELS_DKIM_PRIVATE_KEY) {
    personalization.dkim_domain = env.MAILCHANNELS_DKIM_DOMAIN;
    personalization.dkim_selector = env.MAILCHANNELS_DKIM_SELECTOR;
    personalization.dkim_private_key = env.MAILCHANNELS_DKIM_PRIVATE_KEY;
  }

  const payload = {
    personalizations: [personalization],
    from: { email: FROM_ADDRESS, name: FROM_NAME },
    reply_to: { email, name },
    subject,
    content: [{ type: 'text/plain', value: bodyLines.join('\n') }],
  };

  try {
    const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      console.error('MailChannels send rejected', resp.status, await resp.text().catch(() => ''));
      return errorResponse(request, 'Email delivery failed. Please call (616) 334-7159.', 502);
    }
  } catch (err) {
    console.error('MailChannels fetch failed', err);
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
