import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
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
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      // Exclude noindex pages from the sitemap so we don't waste crawl
      // budget advertising pages we don't want indexed.
      filter: (page) => {
        if (page.endsWith('/thank-you')) return false;
        if (page.includes('/tag/')) return false; // noindex by design
        if (page.endsWith('/decapcms') || page.includes('/decapcms/')) return false;
        return true;
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
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
