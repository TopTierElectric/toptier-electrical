# Preview crawl audit usage

`crawl:preview` is intentionally parameterized and does **not** hardcode a Pages hostname.

Use either CLI arg or `PREVIEW_URL`:

```bash
npm run crawl:preview -- https://codex-task-title-n560vp.toptier-electrical.pages.dev/
```

or

```bash
PREVIEW_URL="https://codex-task-title-n560vp.toptier-electrical.pages.dev/" npm run crawl:preview
```
