interface Env {
  RESEND_API_KEY?: string;
  CONTACT_RECIPIENT?: string;
  // Optional Twilio SMS alert to the owner. Active when all four are set.
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
  OWNER_PHONE?: string;
  // Optional customer auto-confirmation email. Active when truthy.
  SEND_CUSTOMER_CONFIRMATION?: string;
}

interface PagesContext<E> {
  request: Request;
  env: E;
  waitUntil: (promise: Promise<unknown>) => void;
}

const RECIPIENT_FALLBACK = 'info@toptier-electrical.com';
// Resend's domain verification covers the apex; the `send.` subdomain is
// only where Resend installed the SPF/MX records. Send-from address must
// match the verified domain that the API key is scoped to (the apex), or
// Resend rejects with 403 "API key is not authorized to send from ...".
const SENDER_DOMAIN = 'toptier-electrical.com';
const FROM_ADDRESS = `noreply@${SENDER_DOMAIN}`;
const FROM_NAME = 'Top Tier Electrical Contact Form';
const OWNER_PHONE_DISPLAY = '(616) 334-7159';
const OWNER_BUSINESS_NAME = 'Top Tier Electrical';

const ALLOWED_ORIGINS = new Set(['https://toptier-electrical.com', 'https://www.toptier-electrical.com']);

const PAGES_PREVIEW_RE = /^https:\/\/[a-z0-9-]+\.toptier-electrical\.pages\.dev$/i;

export const onRequestPost = async (context: PagesContext<Env>): Promise<Response> => {
  const { request, env, waitUntil } = context;

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

  // Fire-and-forget side effects after the primary email succeeds. Both are
  // wrapped in waitUntil so the user gets the success response immediately
  // and these run in the background. Either failing only logs — it must not
  // turn a successful lead capture into a user-facing error.
  waitUntil(sendOwnerSms(env, formName, name, email, str(data.get('phone')), service, message));
  waitUntil(sendCustomerConfirmation(env, name, email, formName, service));

  return successResponse(request, "Thanks — we'll respond within one business day.");
};

async function sendOwnerSms(
  env: Env,
  formName: string,
  name: string,
  email: string,
  phone: string,
  service: string,
  message: string
): Promise<void> {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER || !env.OWNER_PHONE) {
    return;
  }
  const lines = [
    `New ${formName.toLowerCase()}: ${name}`,
    phone ? `Phone: ${phone}` : '',
    `Email: ${email}`,
    service ? `Service: ${service}` : '',
    message ? `Note: ${truncate(message, 160)}` : '',
  ].filter(Boolean);
  const body = lines.join('\n');

  const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
  const params = new URLSearchParams();
  params.set('From', env.TWILIO_FROM_NUMBER);
  params.set('To', env.OWNER_PHONE);
  params.set('Body', body);

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    if (!resp.ok) {
      console.error('Twilio SMS rejected', resp.status, await resp.text().catch(() => ''));
    }
  } catch (err) {
    console.error('Twilio SMS fetch failed', err);
  }
}

async function sendCustomerConfirmation(
  env: Env,
  name: string,
  email: string,
  formName: string,
  service: string
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.SEND_CUSTOMER_CONFIRMATION) {
    return;
  }
  const heading = formName.toLowerCase().includes('booking') ? 'booking request' : 'message';
  const text = [
    `Hi ${name.split(/\s+/)[0] || 'there'},`,
    '',
    `Thanks for sending us your ${heading}${service ? ` about ${service}` : ''}. We typically reply within one business day with next steps.`,
    '',
    `If your situation is urgent, please call ${OWNER_PHONE_DISPLAY} — we keep the line open Monday through Friday 8 am to 6 pm and Saturday 9 am to 1 pm.`,
    '',
    'Once the work is complete we may follow up to ask for a quick Google review. Honest feedback helps us serve other West Michigan homeowners.',
    '',
    `— The ${OWNER_BUSINESS_NAME} team`,
    'MI License #6220430 · Licensed & Insured',
    `https://toptier-electrical.com`,
  ].join('\n');

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${OWNER_BUSINESS_NAME} <${FROM_ADDRESS}>`,
        to: [email],
        reply_to: env.CONTACT_RECIPIENT || RECIPIENT_FALLBACK,
        subject: `We received your ${heading} — ${OWNER_BUSINESS_NAME}`,
        text,
      }),
    });
    if (!resp.ok) {
      console.error('Customer confirmation rejected', resp.status, await resp.text().catch(() => ''));
    }
  } catch (err) {
    console.error('Customer confirmation fetch failed', err);
  }
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : '';
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function labelize(key: string): string {
  return key.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max - 1) + '…';
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
