import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { publicRoutes, allRoutes, metadataFor } from '../src/data/metadata';
import { services } from '../src/data/services';
import { servicePath } from '../src/data/site';

test('every public route contains meaningful HTML and unique metadata', () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const route of allRoutes) {
    const html = readFileSync(path.join('dist', route, 'index.html'), 'utf8');
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, route);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/name="description" content="([^"]*)"/)?.[1];
    assert.ok(title && description, route);
    assert.ok(!titles.has(title), 'Unique title: ' + route); titles.add(title);
    assert.ok(!descriptions.has(description), 'Unique description: ' + route); descriptions.add(description);
    assert.ok(html.includes(`rel="canonical" href="https://www.justgrow.in${route}"`), route);
    assert.ok(!/forms\.gle|docs\.google\.com\/forms|href="\/insights\//.test(html));
    assert.ok(html.includes('tel:+918252553686'));
    assert.ok(html.includes('mailto:marketing@justgrow.in'));
    const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
    assert.ok(Array.isArray(JSON.parse(json!)), 'Valid structured-data JSON');
    for (const [, href] of html.matchAll(/href="([^"]*)"/g)) {
      if (href.startsWith('/') && !href.startsWith('/assets/') && !href.endsWith('.svg')) {
        const destination = href.split(/[?#]/)[0];
        assert.ok(allRoutes.includes(destination), `${route} -> ${destination}`);
      }
      if (href.startsWith('#')) assert.ok(html.includes(`id="${href.slice(1)}"`), `${route} missing anchor ${href}`);
    }
  }
  assert.equal(titles.size, allRoutes.length);
});
test('all twelve services contain independent buyer content and at least five FAQs', () => {
  assert.equal(services.length, 12);
  for (const service of services) {
    assert.ok(service.faqs.length >= 5, service.slug);
    assert.ok(service.scope.length >= 4, service.slug);
    assert.ok(service.process.length >= 4, service.slug);
    assert.ok(service.inputs && service.measures && service.timing && service.problem && service.definition, service.slug);
    assert.equal(metadataFor(servicePath(service)).service?.slug, service.slug);
    for (const slug of service.related) assert.ok(services.some(s => s.slug === slug));
  }
});
test('sitemap excludes unrequested editorial routes and errors', () => {
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  const manifest = JSON.parse(readFileSync('dist/build-manifest.json', 'utf8'));
  assert.deepEqual(manifest.routes, allRoutes);
  assert.deepEqual(manifest.indexableRoutes, publicRoutes);
  assert.equal((sitemap.match(/<loc>/g) || []).length, manifest.indexable ? publicRoutes.length : 0);
  assert.ok(!/insights|thank-you|404|\/work\//.test(sitemap));
  const error = readFileSync('dist/404.html', 'utf8');
  assert.ok(error.includes('noindex, nofollow'));
  assert.ok(!error.includes('rel="canonical"'));
});
