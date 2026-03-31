# ⚡ Top Tier Electrical — Business Website

Licensed & insured electrician serving West Michigan. Built with Astro + Tailwind CSS.

🌐 **Live site:** [https://toptier-electrical.com](https://toptier-electrical.com)

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat&logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)
![Site Uptime](https://github.com/TopTierElectric/toptier-electrical/actions/workflows/uptime.yml/badge.svg)

---

## ✨ Features

- **Service pages** — showcasing electrical services offered in West Michigan
- **Blog / articles** — tips, project highlights, and industry updates
- **SEO-optimized** — meta tags, OpenGraph, Twitter cards, sitemap
- **Google Analytics** — integrated for visitor insights
- **Sitemap & RSS feed** — auto-generated for search engines and subscribers
- **Responsive & dark mode** — adapts to any device or user preference
- **Image optimization** — sharp-powered image processing via Astro

---

## 📁 Project Structure

```
src/
├── pages/        # Route pages (.astro, .mdx)
├── components/   # Reusable UI components
├── content/      # Blog posts and content collections
├── assets/       # Images, fonts, and static assets
public/           # Files served as-is (favicons, robots.txt, etc.)
```

---

## 🚀 Getting Started

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview build locally
npm run check        # Check for errors (astro check + eslint + prettier)
npm run fix          # Auto-fix lint/format issues
```

---

## 🚢 Deployment

| Platform                         | Config file                         | Status    |
| -------------------------------- | ----------------------------------- | --------- |
| **Cloudflare Pages** (primary)   | `wrangler.toml`                     | ✅ Active |
| **Netlify**                      | `netlify.toml`                      | ✅ Ready  |
| **Vercel**                       | `vercel.json`                       | ✅ Ready  |
| **Docker**                       | `Dockerfile` + `docker-compose.yml` | ✅ Ready  |

Deploy to Cloudflare Pages via Wrangler:

```bash
npm run build
npm run deploy          # production
npm run deploy:preview  # preview branch
```

---

## 📄 License

MIT — see [LICENSE.md](./LICENSE.md)

---

## 🙏 Acknowledgements

Based on the [AstroWind](https://github.com/onwidget/astrowind) template.
