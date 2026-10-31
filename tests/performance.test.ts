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

test('tracking loads once after rendering, or immediately on the first interaction', () => {
  const source = readFileSync('index.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)![1];
  for (const interactFirst of [false, true]) {
    const events = new Map<string, () => void>();
    const frames: (() => void)[] = [], idle: (() => void)[] = [], scripts: any[] = [];
    const window = { dataLayer: [{ event: 'queued-event' }],
      addEventListener: (name: string, fn: () => void) => events.set(name, fn),
      removeEventListener: (name: string) => events.delete(name),
      requestAnimationFrame: (fn: () => void) => frames.push(fn),
      requestIdleCallback: (fn: () => void) => idle.push(fn),
    };
    const document = { readyState: 'loading', createElement: () => ({}), head: { appendChild: (node: any) => scripts.push(node) } };
    runInNewContext(source, { window, document });
    assert.equal(scripts.length, 0);
    if (interactFirst) events.get('pointerdown')!();
    events.get('load')!();
    while (frames.length) frames.shift()!();
    if (!interactFirst) assert.equal(scripts.length, 0);
    idle.shift()!();
    assert.equal(scripts.length, 1);
    assert.equal(scripts[0].src, 'https://www.googletagmanager.com/gtm.js?id=GTM-WRZZBS6F');
    assert.equal(window.dataLayer[0].event, 'queued-event');
    assert.equal(window.dataLayer.filter(item => item.event === 'gtm.js').length, 1);
  }
});
