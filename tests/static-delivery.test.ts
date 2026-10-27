import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { once } from 'node:events';
import { get } from 'node:http';
import type { AddressInfo } from 'node:net';
import { sendStatic, assertIndexingMode } from '../api/static-delivery';

test('static delivery negotiates compression, preserves content and supports cache validation', async () => {
  const app = express();
  const file = path.resolve('dist/index.html');
  app.get('/', (req, res) => sendStatic(req, res, file));
  app.get('/asset', (req, res) => sendStatic(req, res, file, true));
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  try {
    const source = readFileSync(file, 'utf8');
    for (const encoding of ['br', 'gzip', 'identity']) {
      const response = await fetch(origin, { headers: { 'Accept-Encoding': encoding } });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('content-encoding'), encoding === 'identity' ? null : encoding);
      assert.match(response.headers.get('content-type')!, /text\/html/);
      assert.match(response.headers.get('vary')!, /Accept-Encoding/);
      assert.equal(await response.text(), source);
      if (encoding !== 'identity') assert.ok(Number(response.headers.get('content-length')) < Buffer.byteLength(source) / 2);
    }
    const first = await fetch(origin + '/asset', { headers: { 'Accept-Encoding': 'br' } });
    assert.match(first.headers.get('cache-control')!, /immutable/);
    // Node fetch adds a no-cache directive to conditional requests; use raw HTTP
    // to exercise normal browser cache revalidation without that override.
    const cachedStatus = await new Promise<number | undefined>((resolve, reject) => {
      get(origin + '/asset', { headers: { 'Accept-Encoding': 'br', 'If-None-Match': first.headers.get('etag')! } }, response => {
        response.resume(); response.on('end', () => resolve(response.statusCode));
      }).on('error', reject);
    });
    assert.equal(cachedStatus, 304);
    const head = await fetch(origin, { method: 'HEAD', headers: { 'Accept-Encoding': 'gzip' } });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
    const refused = await fetch(origin, { headers: { 'Accept-Encoding': 'identity;q=0, br;q=0, gzip;q=0' } });
    assert.equal(refused.status, 406);
  } finally { server.closeAllConnections(); server.close(); await once(server, 'close'); }
});

test('an indexing mode mismatch cannot silently start a production server', () => {
  assert.doesNotThrow(() => assertIndexingMode({ indexable: false }, false));
  assert.doesNotThrow(() => assertIndexingMode({ indexable: true }, true));
  assert.throws(() => assertIndexingMode({ indexable: false }, true), /Rebuild/);
  assert.throws(() => assertIndexingMode({ indexable: true }, false), /Rebuild/);
});
