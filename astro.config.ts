import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import compress from 'astro-compress';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',
  site: 'https://www.toptier-electrical.com',
  build: {
    // Inline all CSS as <style> tags to eliminate render-blocking CSS
    // requests. The single ~36 KB CSS bundle (~10 KB gzipped) is small
    // enough that inlining beats the round-trip on first paint, which
    // Lighthouse repeatedly flags as render-blocking.
    inlineStylesheets: 'always',
    // Emit one .html file per route (dist/faq.html) instead of the
    // default directory pattern (dist/faq/index.html). The directory
    // pattern made BOTH /faq and /faq/ serve identical content, and
    // Google's URL canonicalization algorithm was choosing the
    // trailing-slash variant as canonical even though every page's
    // <link rel="canonical"> and the sitemap declare the no-slash
    // form. Result: GSC was flagging /faq, /panel-upgrades, etc. as
    // "Page with redirect" and refusing to index them. With format:
    // 'file', /faq.html is the only file emitted — /faq/ returns 404,
    // so only one URL form exists and Google must respect the
    // declared canonical.
    format: 'file',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  },
  integrations: [
    sitemap({
      // Exclude noindex pages from the sitemap so we don't waste crawl
      // budget advertising pages we don't want indexed.
      filter: (page) => {
        if (page.endsWith('/thank-you')) return false;
        if (page.includes('/tag/')) return false; // noindex by design
        if (page.includes('/category/')) return false; // noindex — thin auto-listings that compete with hubs
        if (page.endsWith('/decapcms') || page.includes('/decapcms/')) return false;
        return true;
      },
      // Stamp every entry with a build-time lastmod. Without lastmod,
      // Google has no freshness signal and falls back to its own crawl
      // heuristics — slowing re-indexing after content updates. The
      // build-time approach refreshes lastmod on every deploy (when
      // content actually changes), which is a meaningful improvement
      // over no signal at all. Per-URL granular dates would require
      // reading each blog post's publishDate; that can come later.
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: true,
      JavaScript: true,
      SVG: true,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
