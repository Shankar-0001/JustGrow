import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { serviceCatalog } from '../src/data/serviceCatalog';
import { services } from '../src/data/services';
import { runInNewContext } from 'node:vm';

test('lightweight navigation catalog stays consistent with full service content', () => {
  assert.deepEqual(serviceCatalog, services.map(({ slug, group, name }) => ({ slug, group, name })));
});

test('homepage serves styled HTML without loading service-page bundles or a blocking stylesheet', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.ok(html.includes('<style data-site-styles>'));
  assert.ok(!/<link\b[^>]*rel="stylesheet"/.test(html));
  assert.ok(!/<link\b[^>]*href="[^\"]*(?:services-|seoPageContent-|SEMServicePage-)/.test(html));
  assert.ok(html.includes('rel="modulepreload"'));
});

test('worker tracking preserves the container, queued events and no-script fallback', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  const source = html.match(/<script type="text\/partytown">([\s\S]*?)<\/script>/)![1];
  const scripts: any[] = [];
  const window = { dataLayer: [{ event: 'queued-event' }] };
  const document = { createElement: () => ({}), getElementsByTagName: () => [{ parentNode: { insertBefore: (node: any) => scripts.push(node) } }] };
  runInNewContext(source, { window, document });
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, 'https://www.googletagmanager.com/gtm.js?id=GTM-WRZZBS6F');
  assert.equal(window.dataLayer[0].event, 'queued-event');
  assert.equal(window.dataLayer.filter(item => item.event === 'gtm.js').length, 1);
  assert.ok(html.includes('dataLayer.push'));
  assert.ok(html.includes('https://www.googletagmanager.com/ns.html?id=GTM-WRZZBS6F'));
  assert.ok(readFileSync('dist/~partytown/partytown-sw.js', 'utf8').length > 0);
});
