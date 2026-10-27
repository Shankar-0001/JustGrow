import test from 'node:test';
import assert from 'node:assert/strict';
import { isSiteIndexable } from '../api/indexing';

test('Vercel production generates indexable pages without an extra deployment setting', () => {
  assert.equal(isSiteIndexable({ VERCEL_ENV: 'production' }), true);
  assert.equal(isSiteIndexable({ VERCEL_TARGET_ENV: 'production' }), true);
  assert.equal(isSiteIndexable({ VERCEL_ENV: 'production', SITE_INDEXABLE: 'false' }), false);
});

test('preview, development and custom staging environments stay excluded', () => {
  for (const deployment of ['preview', 'development', 'staging']) {
    assert.equal(isSiteIndexable({ VERCEL_ENV: deployment, NODE_ENV: 'production', SITE_INDEXABLE: 'true' }), false);
    assert.equal(isSiteIndexable({ VERCEL_TARGET_ENV: deployment, VERCEL_ENV: 'production', SITE_INDEXABLE: 'true' }), false);
  }
});

test('other hosts and local builds retain the explicit indexing switch', () => {
  assert.equal(isSiteIndexable({}), false);
  assert.equal(isSiteIndexable({ NODE_ENV: 'production' }), false);
  assert.equal(isSiteIndexable({ SITE_INDEXABLE: 'true' }), true);
  assert.equal(isSiteIndexable({ SITE_INDEXABLE: 'false' }), false);
});
