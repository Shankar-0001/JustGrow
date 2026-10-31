import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:3100';
const phase = process.argv[2] || 'final';
const output = `.qa/audit/${phase}`;
mkdirSync(output, { recursive: true });
const manifest = JSON.parse(readFileSync('dist/build-manifest.json', 'utf8'));
const report = { date: new Date().toISOString(), origin, indexable: manifest.indexable, routes: [], redirects: [], resources: [] };
const titles = new Set(), descriptions = new Set();
for (const route of manifest.routes) {
  const pageIndexable = manifest.indexable && (manifest.indexableRoutes || manifest.routes).includes(route);
  const response = await fetch(origin + route);
  const html = await response.text();
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const robots = html.match(/name="robots" content="([^"]+)"/)?.[1];
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1]);
  assert.equal(response.status, 200, route);
  assert.equal(canonical, 'https://www.justgrow.in' + route);
  assert.ok(html.includes(`property="og:url" content="${canonical}"`));
  assert.equal(robots, pageIndexable ? 'index, follow' : 'noindex, nofollow');
  assert.equal(response.headers.get('x-robots-tag'), pageIndexable ? null : 'noindex, nofollow');
  assert.ok(title && description && !titles.has(title) && !descriptions.has(description), route + ' metadata');
  titles.add(title); descriptions.add(description);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.ok(/<main[^>]*>[\s\S]+<\/main>/.test(html));
  assert.ok(schema.every(item => item['@context'] === 'https://schema.org'));
  assert.ok(!html.includes('AggregateRating'));
  assert.ok(html.includes('property="og:image"') && html.includes('name="twitter:card"'));
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (href.startsWith('/') && !href.startsWith('/assets/') && !href.endsWith('.svg')) assert.ok(manifest.routes.includes(href.split(/[?#]/)[0]), `${route}: ${href}`);
    if (href.startsWith('#')) assert.ok(html.includes(`id="${href.slice(1)}"`), `${route}: ${href}`);
  }
  report.routes.push({ route, status: response.status, title, description, canonical, robots, xRobots: response.headers.get('x-robots-tag'), schema: schema.map(s => s['@type']), statusResult: 'PASS' });
  const query = '?utm_source=audit&service=aeo&note=a%2Fb';
  const variants = new Set([
    route.toUpperCase(), route.replaceAll('/', '//'), route + 'index.html',
    route.toUpperCase().replaceAll('/', '//') + 'INDEX.HTML/',
    ...(route === '/' ? [] : [route.slice(0, -1)]),
  ]);
  variants.delete(route);
  for (const variant of variants) {
    const redirect = await fetch(origin + variant + query, { redirect: 'manual' });
    assert.equal(redirect.status, 308);
    assert.equal(redirect.headers.get('location'), route + query);
    const destination = await fetch(origin + redirect.headers.get('location'), { redirect: 'manual' });
    assert.equal(destination.status, 200, variant + ' must redirect in one hop');
    report.redirects.push({ from: variant + query, status: 308, location: redirect.headers.get('location') });
  }
  const parameter = await fetch(origin + route + '?utm_source=audit');
  assert.ok((await parameter.text()).includes(`rel="canonical" href="https://www.justgrow.in${route}"`));
}
for (const route of ['/unknown-audit-page/', '/insights/', '/work/', '/server.cjs', '/build-manifest.json', '/.env', '/seo/missing/index.html', '/seo%2flocal-seo/', '//other.example/']) {
  const r = await fetch(origin + route, { redirect: 'manual' });
  assert.equal(r.status, 404, route);
  assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow');
  report.routes.push({ route, status: 404, canonical: null, statusResult: 'PASS (not published / not public)' });
}
const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
assert.equal((sitemap.match(/<loc>/g) || []).length, manifest.indexable ? (manifest.indexableRoutes || manifest.routes).length : 0);
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]), manifest.indexable ? manifest.indexableRoutes.map(route => 'https://www.justgrow.in' + route) : []);
const robots = await (await fetch(origin + '/robots.txt')).text();
assert.ok(robots.includes(manifest.indexable ? 'Allow: /' : 'Disallow: /'));
const home = await (await fetch(origin)).text();
for (const [, asset] of home.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) {
  const r = await fetch(origin + asset, { headers: { 'Accept-Encoding': 'br' } });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('content-encoding'), existsSync('dist' + asset + '.br') ? 'br' : null);
  assert.match(r.headers.get('cache-control'), /immutable/);
  report.resources.push({ asset, encoding: r.headers.get('content-encoding'), bytes: Number(r.headers.get('content-length')), cache: r.headers.get('cache-control') });
}
// Invalid fixture is rejected before the upstream can be called. No live lead data is sent.
const invalid = await fetch(origin + '/api/submit-lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
assert.equal(invalid.status, 400);
assert.equal((await invalid.json()).success, false);
assert.equal((await fetch(origin + '/api/submit-lead')).status, 405);
writeFileSync(`${output}/http.json`, JSON.stringify(report, null, 2));
console.log(`${manifest.routes.length} pages, redirects, parameters, metadata, structured data, robots/sitemap, compressed resources and invalid-only API checks passed. Indexable=${manifest.indexable}`);
