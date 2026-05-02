# Contact form setup — Cloudflare Pages Function + MailChannels

The `/contact` and `/booking` forms POST to `/api/contact`, a Cloudflare Pages
Function (`functions/api/contact.ts`) that sends email via MailChannels.

The function runs on Cloudflare's edge, has zero monthly cost, and replaces
the previous Formspree integration. Unlike Formspree, there is no
"unauthorized domain" allowlist gotcha — the form POST is same-origin, so
the previous `Origin: null` rejection class of failure cannot occur.

## What you need to do once before this works

### 1. SPF — authorize MailChannels to send for the domain

Add (or update) a TXT record at the apex of `toptier-electrical.com`:

```
toptier-electrical.com   TXT   "v=spf1 include:relay.mailchannels.net include:_spf.mx.cloudflare.net ~all"
```

If an SPF record already exists, **merge** — keep all existing `include:` and
`a:` mechanisms, and add `include:relay.mailchannels.net`. Only one SPF
record may exist per domain.

### 2. Domain Lockdown — explicitly authorize Cloudflare Workers/Pages

MailChannels requires a Domain Lockdown TXT record before it will accept
sends from a Cloudflare Workers/Pages account. Add:

```
_mailchannels.toptier-electrical.com   TXT   "v=mc1 cfid=<your-cloudflare-account-tag>.workers.dev"
```

Replace `<your-cloudflare-account-tag>` with the value from your Cloudflare
dashboard URL (e.g. if your dashboard URL is
`https://dash.cloudflare.com/53677e867c0bc14922c99056bf5c346d`, the account
tag is `53677e867c0bc14922c99056bf5c346d`).

Without this record, MailChannels rejects all sends with `403 Forbidden`.

### 3. (Optional but recommended) DKIM — improve deliverability

Without DKIM, Gmail/Outlook may flag messages from `noreply@toptier-electrical.com`
as "unverified sender" and route them to spam.

To set up DKIM:

1. Generate an Ed25519 keypair (or RSA-2048):

   ```bash
   openssl genrsa 2048 | tee priv.pem | openssl rsa -pubout -outform der | openssl base64 -A
   ```

   Save the private key (`priv.pem`) for step 3 and copy the printed public
   key.

2. Publish the public key as a TXT record:

   ```
   mailchannels._domainkey.toptier-electrical.com   TXT   "v=DKIM1; k=rsa; p=<public-key-base64>"
   ```

3. In the Cloudflare Pages dashboard → **toptier-electrical** project →
   **Settings** → **Environment variables**, add (for both Production and
   Preview environments):

   | Variable                        | Value                                   |
   | ------------------------------- | --------------------------------------- |
   | `MAILCHANNELS_DKIM_DOMAIN`      | `toptier-electrical.com`                |
   | `MAILCHANNELS_DKIM_SELECTOR`    | `mailchannels`                          |
   | `MAILCHANNELS_DKIM_PRIVATE_KEY` | contents of `priv.pem` (paste full PEM) |

The function only attaches DKIM signatures when all three are present, so
omitting them is safe — the form still works without DKIM, just with worse
deliverability.

## Optional environment variables

| Variable                 | Default                       | Purpose                                                                               |
| ------------------------ | ----------------------------- | ------------------------------------------------------------------------------------- |
| `MAILCHANNELS_RECIPIENT` | `info@toptier-electrical.com` | Where the email goes. Override to test against a different inbox without redeploying. |

## Local testing

Pages Functions don't run under `astro dev`. To test locally with the
function:

```bash
npm run build
npx wrangler pages dev dist --compatibility-date=2025-03-30
```

Then open `http://localhost:8788/contact`. Note that local sends go to
MailChannels' real production API — submissions will arrive in the recipient
inbox. Use `MAILCHANNELS_RECIPIENT` env var to redirect to a test inbox if
needed.

## Removing Formspree

The Formspree account / form `mkovbvgj` is no longer used by this site.
Once production traffic has migrated and emails are arriving normally,
deactivate the Formspree form to stop the rate-limit/notification cruft.
