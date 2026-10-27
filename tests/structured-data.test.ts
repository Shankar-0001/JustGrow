import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { publicRoutes } from '../src/data/metadata';
import { services } from '../src/data/services';
import { business, servicePath } from '../src/data/site';

function page(route: string) {
  const html = readFileSync(path.join('dist', route, 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, route + ': one schema block');
  return { html, nodes: JSON.parse(scripts[0][1]) as Record<string, any>[] };
}

test('all service detail pages identify their own service, provider and canonical page', () => {
  const ids = new Set();
  for (const service of services) {
    const route = servicePath(service);
    const url = business.origin + route;
    const { html, nodes } = page(route);
    const matches = nodes.filter(node => node['@type'] === 'Service');
    assert.equal(matches.length, 1, route);
    const entity = matches[0];
    assert.equal(entity.url, url);
    assert.equal(entity.name, service.name);
    assert.equal(entity.serviceType, service.name);
    assert.equal(entity.description, service.intro);
    assert.equal(entity.areaServed['@type'], 'Country');
    assert.equal(entity.areaServed.name, 'India');
    assert.ok(!ids.has(entity['@id']), 'Separate service identities');
    ids.add(entity['@id']);
    const provider = nodes.find(node => node['@id'] === entity.provider['@id']);
    assert.equal(provider?.['@type'], 'Organization');
    assert.equal(provider.name, 'JustGrow');
    assert.equal(provider.telephone, business.phone);
    assert.ok(html.includes('tel:' + provider.telephone));
    const webpage = nodes.find(node => node['@id'] === entity.mainEntityOfPage['@id']);
    assert.equal(webpage?.url, url);
    assert.equal(webpage.mainEntity['@id'], entity['@id']);
    assert.ok(html.includes(`rel="canonical" href="${url}"`));
    assert.equal(entity.offers, undefined, 'No invented prices or offers');
    assert.equal(entity.aggregateRating, undefined, 'No invented reviews');
  }
  assert.equal(ids.size, 12);
});

test('overview lists include only their visible service destinations', () => {
  for (const group of ['seo', 'sem']) {
    const { html, nodes } = page('/' + group + '/');
    const collection = nodes.find(node => node['@type'] === 'CollectionPage');
    const list = nodes.find(node => node['@id'] === collection?.mainEntity['@id']);
    assert.equal(list?.['@type'], 'ItemList');
    const expected = services.filter(service => service.group === group).map(servicePath);
    assert.equal(list.numberOfItems, expected.length);
    assert.equal(list.itemListElement.length, expected.length);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)![1];
    assert.deepEqual(list.itemListElement.map((entry: any) => new URL(entry.item.url).pathname).sort(), expected.sort());
    for (const [index, entry] of list.itemListElement.entries()) {
      assert.equal(entry.position, index + 1);
      assert.ok(main.includes(`href="${new URL(entry.item.url).pathname}"`));
      const detail = page(new URL(entry.item.url).pathname).nodes.find(node => node['@type'] === 'Service');
      assert.equal(entry.item['@id'], detail?.['@id']);
      assert.equal(entry.item.name, detail?.name);
    }
  }
});

test('page graphs resolve their references and breadcrumbs match visible hierarchy', () => {
  for (const route of publicRoutes) {
    const { html, nodes } = page(route);
    const definitions = new Set<string>();
    const references: string[] = [];
    function visit(value: any) {
      if (!value || typeof value !== 'object') return;
      if (value['@id']) {
        if (value['@type']) {
          assert.ok(!definitions.has(value['@id']), route + ': duplicate entity');
          definitions.add(value['@id']);
        } else references.push(value['@id']);
      }
      Object.values(value).forEach(visit);
    }
    nodes.forEach(visit);
    references.forEach(id => assert.ok(definitions.has(id), route + ': unresolved reference ' + id));
    assert.equal(nodes.filter(node => node['@type'] === 'Organization').length, 1);
    const crumbs = nodes.find(node => node['@type'] === 'BreadcrumbList');
    if (route === '/') { assert.equal(crumbs, undefined); continue; }
    const visible = html.match(/<nav[^>]*aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/)![1];
    for (const [index, crumb] of crumbs!.itemListElement.entries()) {
      assert.equal(crumb.position, index + 1);
      assert.ok(publicRoutes.includes(new URL(crumb.item).pathname));
      assert.ok(visible.includes(crumb.name.replaceAll('&', '&amp;')), route + ': visible breadcrumb ' + crumb.name);
    }
    assert.equal(crumbs!.itemListElement.at(-1).item, business.origin + route);
  }
  const error = readFileSync('dist/404.html', 'utf8');
  assert.deepEqual(JSON.parse(error.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1]), []);
});
