import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalPagePath } from '../api/page-routing';
import { allRoutes } from '../src/data/metadata';

const routes = new Set(allRoutes);

test('all published page variants resolve directly to their existing canonical paths', () => {
  for (const route of allRoutes) {
    for (const variant of new Set([
      route, route.toUpperCase(), route.replaceAll('/', '//'),
      route + 'index.html', route.toUpperCase() + 'INDEX.HTML/',
      ...(route === '/' ? [] : [route.slice(0, -1)]),
    ])) assert.equal(canonicalPagePath(variant, routes), route, variant);
  }
});

test('unknown or unsafe paths never become homepage redirects or filesystem targets', () => {
  for (const route of [
    '/missing/', '/seo/missing/', '/missing/index.html', '/.env', '/server.cjs',
    '/build-manifest.json', '/assets/', '/seo/../', '/%2e%2e/', '/seo%2flocal-seo/',
    '/seo\\local-seo/', '//other.example/', 'https://other.example/',
    '/seo/?next=//other.example/',
  ]) assert.equal(canonicalPagePath(route, routes), null, route);
});
