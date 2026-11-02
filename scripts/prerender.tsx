import React from 'react';
import { config } from 'dotenv';
config({ path: '.env.local', quiet: true });
config({ quiet: true });
import { renderToString } from 'react-dom/server';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import App from '../src/App';
import { loadPage } from '../src/loadPage';
import { business } from '../src/data/site';
import { metadataFor, publicRoutes, allRoutes } from '../src/data/metadata';
import { structuredDataFor } from '../src/data/structuredData';
import { isSiteIndexable } from '../api/indexing';
import { transformSync } from 'esbuild';
import { PurgeCSS } from 'purgecss';

const template = readFileSync('dist/index.html', 'utf8').replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta name="description"[^>]*>/, '');
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const indexable = isSiteIndexable();
const styles = ['site', 'off-page', 'seo-services', 'sem-services', 'company-pages', 'about-reference', 'home-refinements', 'discovery-pages', 'thank-you'];
const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf8'));
async function pageStyles(route: string, markup: string) {
  const selected = route === '/' ? ['site', 'home-refinements'] : route === '/thank-you/' ? ['site', 'thank-you'] : styles;
  let css = selected.map(name => readFileSync(`src/styles/${name}.css`, 'utf8')).join('\n');
  if (route === '/') {
    // Include interactive source states as well as SSR markup: menus and selected
    // goals must keep their styles even when initially closed or unselected.
    const [result] = await new PurgeCSS().purge({
      content: [{ raw: markup, extension: 'html' }, 'src/components/SiteLayout.tsx', 'src/pages/Home.tsx'],
      css: [{ raw: css }], safelist: ['html', 'body', 'is-open', 'selected', 'open'],
    });
    css = result.css;
  }
  return `<style data-site-styles>${transformSync(css, { loader: 'css', minify: true }).code}</style>`;
}
function homePreloads() {
  const files = new Set<string>();
  function visit(key: string) {
    const chunk = manifest[key];
    if (!chunk || files.has(chunk.file)) return;
    files.add(chunk.file);
    for (const dependency of chunk.imports || []) visit(dependency);
  }
  visit('src/pages/Home.tsx');
  return [...files].map(file => `<link rel="modulepreload" href="/${file}"/>`).join('');
}
for (const route of [...allRoutes, '/404/']) {
  const meta = metadataFor(route);
  const canonical = business.origin + route;
  const schema = structuredDataFor(route);
  const head = `<title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}"/><meta name="robots" content="${indexable && meta.indexable ? 'index, follow' : 'noindex, nofollow'}"/>${meta.found ? `<link rel="canonical" href="${canonical}"/>` : ''}<meta property="og:type" content="website"/><meta property="og:site_name" content="JustGrow"/><meta property="og:title" content="${escape(meta.title)}"/><meta property="og:description" content="${escape(meta.description)}"/><meta property="og:url" content="${canonical}"/><meta property="og:image" content="${business.origin}/share-card.png"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:alt" content="JustGrow — Reach the right customers. Turn interest into enquiries."/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${escape(meta.title)}"/><meta name="twitter:description" content="${escape(meta.description)}"/><meta name="twitter:image" content="${business.origin}/share-card.png"/><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
  const page = await loadPage(route);
  const markup = renderToString(<App path={route}>{page}</App>);
  const html = template.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, '')
    .replace('<!--page-meta-->', head + await pageStyles(route, markup) + (route === '/' ? homePreloads() : ''))
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  const file = route === '/404/' ? 'dist/404.html' : path.join('dist', route, 'index.html');
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html);
}
writeFileSync('dist/build-manifest.json', JSON.stringify({ indexable, routes: allRoutes, indexableRoutes: publicRoutes }, null, 2));
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${(indexable ? publicRoutes : []).map(route => `<url><loc>${business.origin}${route}</loc></url>`).join('')}</urlset>`);
writeFileSync('dist/robots.txt', indexable ? `User-agent: *\nAllow: /\nSitemap: ${business.origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
console.log(`Generated ${allRoutes.length} pages (${publicRoutes.length} eligible for indexing) and a 404. Indexable: ${indexable}.`);
