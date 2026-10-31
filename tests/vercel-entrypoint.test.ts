import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { transformSync } from 'esbuild';

test('compiled serverless entrypoint loads in plain Node ESM and acknowledges one mocked write', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'justgrow-api-esm-'));
  try {
    writeFileSync(path.join(directory, 'package.json'), JSON.stringify({ type: 'module' }));
    // Keep imports intact: bundling or tsx would hide production resolution failures.
    for (const name of ['submit-lead', 'lead-handler']) {
      const source = readFileSync(path.resolve('api', name + '.ts'), 'utf8');
      writeFileSync(path.join(directory, name + '.js'), transformSync(source, {
        loader: 'ts', format: 'esm', target: 'node22',
      }).code);
    }
    execFileSync(process.execPath, ['--input-type=module', '-e', `
      import assert from 'node:assert/strict';
      let writes = 0;
      globalThis.fetch = async () => {
        writes++;
        return Response.json({ success: true, syncedToSheet: true });
      };
      const { default: handler } = await import('./submit-lead.js');
      const get = await handler(new Request('https://example.test/api/submit-lead'));
      assert.equal(get.status, 405);
      const invalid = await handler(new Request('https://example.test/api/submit-lead', {
        method: 'POST', body: '{}',
      }));
      assert.equal(invalid.status, 400);
      assert.equal(writes, 0);
      const body = { submissionId: 'esm-regression-0001', fullName: 'Test',
        email: 'test@example.test', message: 'Mocked enquiry', privacyAgreed: true };
      const res = { code: 0, setHeader() {}, status(code) { this.code = code; return this; },
        json(body) { return { status: this.code, body }; } };
      for (let attempt = 0; attempt < 2; attempt++) {
        const result = await handler({ method: 'POST', body }, res);
        assert.equal(result.status, 200);
        assert.equal(result.body.syncedToSheet, true);
      }
      assert.equal(writes, 1);
    `], { cwd: directory, env: { ...process.env, NODE_OPTIONS: '', GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/mock/exec' }, stdio: 'pipe' });
  } finally {
    assert.equal(path.dirname(directory), path.resolve(tmpdir()));
    assert.ok(path.basename(directory).startsWith('justgrow-api-esm-'));
    rmSync(directory, { recursive: true, force: true });
  }
});
