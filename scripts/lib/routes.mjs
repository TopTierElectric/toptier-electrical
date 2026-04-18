import fs from 'node:fs';
import path from 'node:path';

export const getSourceRoutes = () => {
  const root = path.resolve('src/pages');
  const routes = new Set();

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(astro|md|mdx|ts)$/.test(entry.name)) continue;
      if (entry.name === 'rss.xml.ts' || entry.name.includes('[...')) continue;
      const rel = path.relative(root, full).replace(/\\/g, '/');
      let route = rel
        .replace(/\.(astro|md|mdx|ts)$/, '')
        .replace(/\/index$/, '')
        .replace(/^index$/, '');
      route = `/${route}`.replace(/\/+/g, '/');
      routes.add(route === '' ? '/' : route);
    }
  };

  walk(root);
  return routes;
};
