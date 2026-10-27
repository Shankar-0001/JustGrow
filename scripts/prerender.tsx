import React from 'react';
import { config } from 'dotenv';
config({ path: '.env.local', quiet: true });
config({ quiet: true });
import { renderToString } from 'react-dom/server';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import App from '../src/App';
import { business } from '../src/data/site';
import { metadataFor, publicRoutes, allRoutes } from '../src/data/metadata';
import { structuredDataFor } from '../src/data/structuredData';
import { isSiteIndexable } from '../api/indexing';

const template = readFileSync('dist/index.html', 'utf8').replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta name="description"[^>]*>/, '');
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const indexable = isSiteIndexable();
for (const route of [...allRoutes, '/404/']) {
  const meta = metadataFor(route);
  const canonical = business.origin + route;
  const schema = structuredDataFor(route);
  const head = `<title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}"/><meta name="robots" content="${indexable && meta.indexable ? 'index, follow' : 'noindex, nofollow'}"/>${meta.found ? `<link rel="canonical" href="${canonical}"/>` : ''}<meta property="og:type" content="website"/><meta property="og:site_name" content="JustGrow"/><meta property="og:title" content="${escape(meta.title)}"/><meta property="og:description" content="${escape(meta.description)}"/><meta property="og:url" content="${canonical}"/><meta property="og:image" content="${business.origin}/share-card.png"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:alt" content="JustGrow — Reach the right customers. Turn interest into enquiries."/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${escape(meta.title)}"/><meta name="twitter:description" content="${escape(meta.description)}"/><meta name="twitter:image" content="${business.origin}/share-card.png"/><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
  const html = template.replace('<!--page-meta-->', head).replace('<div id="root"></div>', `<div id="root">${renderToString(<App path={route}/>)}</div>`);
  const file = route === '/404/' ? 'dist/404.html' : path.join('dist', route, 'index.html');
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html);
}
writeFileSync('dist/build-manifest.json', JSON.stringify({ indexable, routes: allRoutes, indexableRoutes: publicRoutes }, null, 2));
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${(indexable ? publicRoutes : []).map(route => `<url><loc>${business.origin}${route}</loc></url>`).join('')}</urlset>`);
writeFileSync('dist/robots.txt', indexable ? `User-agent: *\nAllow: /\nSitemap: ${business.origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
console.log(`Generated ${allRoutes.length} pages (${publicRoutes.length} eligible for indexing) and a 404. Indexable: ${indexable}.`);
