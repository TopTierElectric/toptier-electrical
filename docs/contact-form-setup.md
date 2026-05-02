# Contact form setup — Cloudflare Pages Function + Resend

The `/contact` and `/booking` forms POST to `/api/contact`, a Cloudflare Pages
Function (`functions/api/contact.ts`) that sends email via [Resend](https://resend.com).

The function runs on Cloudflare's edge for free. Resend's free tier covers
3,000 emails per month and 100 per day — well above this site's volume.

> **Why Resend instead of MailChannels?** MailChannels deprecated the free
> Cloudflare Workers tier, and Cloudflare's own Email Service requires the
> Workers Paid plan ($5/mo). Resend stays free, and Cloudflare publishes an
> [official tutorial](https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/)
> for this exact integration.

## What you need to do once before this works

### 1. Create a Resend account and verify the domain

1. Sign up at https://resend.com (free, no credit card)
2. **Domains** → **Add Domain** → enter `toptier-electrical.com`
3. Resend will display a list of DNS records — typically:
   - 1× MX record (e.g. `feedback-smtp.us-east-1.amazonses.com`)
   - 1× SPF TXT record at the apex (`v=spf1 include:amazonses.com ~all` or similar — Resend's exact value)
   - 1× DKIM TXT record (long base64 public key under `resend._domainkey`)
   - 1× DMARC TXT record (optional, recommended)
4. Add each record to **Cloudflare DNS** for `toptier-electrical.com`:
   - **DNS → Records → Add record** for each
   - Use the exact Type / Name / Content Resend gives you
   - TTL: Auto, Proxy: DNS only (gray cloud)
5. Wait for Resend dashboard to mark the domain as **Verified** (1–5 min once DNS propagates)

> **SPF merge:** Cloudflare DNS will reject a second SPF record. If
> `toptier-electrical.com` already has a `v=spf1 ...` record (e.g. for
> Microsoft 365), edit the existing record to merge Resend's include into
> the same line — for example:
> `v=spf1 include:spf.protection.outlook.com include:amazonses.com ~all`

### 2. Generate an API key

1. In Resend dashboard → **API Keys** → **Create API Key**
2. Permission: **Sending access** is enough
3. Copy the key (shown once). Format: `re_xxxxxxxxxxxxxxxxxxx`

### 3. Add the API key to Cloudflare Pages

1. https://dash.cloudflare.com → **Workers & Pages** → **toptier-electrical** project
2. **Settings** → **Environment variables**
3. Add for **both** Production and Preview:

   | Variable         | Value                        |
   | ---------------- | ---------------------------- |
   | `RESEND_API_KEY` | the `re_...` key from Resend |
   - Click **Encrypt** so the key is treated as a secret.

4. **Deployments** → top deployment → **Retry deployment** so the new env var takes effect.

### 4. (Optional) Override the recipient

If you want submissions to go to a different inbox without redeploying:

| Variable            | Default                       | Purpose                        |
| ------------------- | ----------------------------- | ------------------------------ |
| `CONTACT_RECIPIENT` | `info@toptier-electrical.com` | Override the recipient address |

## Cleanup of the old MailChannels records (optional)

These records were added during the abandoned MailChannels attempt and are
no longer needed. They're inert — leave them or remove them at your leisure:

- TXT at `_mailchannels.toptier-electrical.com` (`v=mc1 cfid=...`)
- The `include:relay.mailchannels.net` fragment in the apex SPF record (you
  can drop just that include, leaving the rest of the SPF intact)

## Local testing

Pages Functions don't run under `astro dev`. To exercise the function
locally:

```bash
npm run build
RESEND_API_KEY=re_... npx wrangler pages dev dist --compatibility-date=2025-03-30
```

Then submit `/contact` at `http://localhost:8788/contact`. Sends go to
Resend's real production API — submissions will reach the recipient inbox.
Use `CONTACT_RECIPIENT` to redirect to a test inbox if needed.
