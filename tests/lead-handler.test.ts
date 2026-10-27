import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createLeadHandler } from '../api/lead-handler';
import { submitLeadToGoogleSheet } from '../src/lib/googleSheets';

const lead = { submissionId: 'test-enquiry-123456789', fullName: 'Test Person', email: 'test@example.com', message: 'A mocked enquiry only.', privacyAgreed: true, formType: 'Send Us a Message' };
test('three simultaneous requests and a replay produce one upstream write', async () => {
  let writes = 0;
  const handler = createLeadHandler((async () => { writes++; await new Promise(resolve => setTimeout(resolve, 20)); return Response.json({ success: true }); }) as typeof fetch);
  const results = await Promise.all([handler(lead), handler(lead), handler(lead)]);
  assert.equal(writes, 1);
  assert.ok(results.every(r => r.status === 200 && r.body.syncedToSheet));
  assert.equal((await handler(lead)).status, 200);
  assert.equal(writes, 1);
  assert.equal((await handler({ ...lead, message: 'Changed payload' })).status, 409);
  assert.equal(writes, 1);
});
test('HTML, application failure, null JSON and non-2xx responses never report success', async () => {
  for (const response of [new Response('<html>Sign in</html>'), Response.json({ success: false }), Response.json(null), Response.json({ success: true }, { status: 500 }), Response.json({ success: true, syncedToSheet: false })]) {
    const handler = createLeadHandler((async () => response) as typeof fetch);
    const result = await handler(lead);
    assert.equal(result.status, 502); assert.equal(result.body.syncedToSheet, false);
  }
});
test('lost responses are not automatically written again', async () => {
  let writes = 0;
  const handler = createLeadHandler((async () => { writes++; throw new Error('Connection lost after write'); }) as typeof fetch);
  assert.equal((await handler(lead)).status, 502);
  assert.equal((await handler(lead)).status, 502);
  assert.equal(writes, 1);
});
test('invalid fields and consent are rejected without calling Google', async () => {
  let writes = 0;
  const handler = createLeadHandler((async () => { writes++; return Response.json({ success: true }); }) as typeof fetch);
  for (const invalid of [null, [], { ...lead, submissionId: '' }, { ...lead, email: 'invalid' }, { ...lead, privacyAgreed: false }, { ...lead, website: 'bot' }, { ...lead, message: 'x'.repeat(5001) }, { ...lead, phone: 'invalid' }]) assert.equal((await handler(invalid)).status, 400);
  assert.equal(writes, 0);
});
test('sanitises sheet formulas, strips unknown fields and does not trust a client endpoint', async () => {
  let sent: any;
  let destination = '';
  const handler = createLeadHandler((async (url, init) => { destination = String(url); sent = JSON.parse(String(init?.body)); return Response.json({ result: 'success' }); }) as typeof fetch);
  assert.equal((await handler({ ...lead, fullName: '=IMPORTXML()', scriptUrl: 'https://example.com', unexpected: 'ignore' })).status, 200);
  assert.equal(sent.fullName, "'=IMPORTXML()"); assert.equal(sent.scriptUrl, undefined); assert.equal(sent.unexpected, undefined);
  assert.ok(destination.startsWith('https://script.google.com/macros/s/'));
});
test('client coalesces duplicate requests and uses only the local API', async () => {
  const original = globalThis.fetch;
  let writes = 0;
  globalThis.fetch = (async (url) => { assert.equal(url, '/api/submit-lead'); writes++; await new Promise(resolve => setTimeout(resolve, 10)); return Response.json({ success: true, syncedToSheet: true }); }) as typeof fetch;
  try { const results = await Promise.all([submitLeadToGoogleSheet(lead), submitLeadToGoogleSheet(lead), submitLeadToGoogleSheet(lead)]); assert.equal(writes, 1); assert.ok(results.every(r => r.success)); }
  finally { globalThis.fetch = original; }
});
test('Apps Script persists submission ID beside the row and rejects duplicates across calls', () => {
  const rows: string[][] = [];
  let locked = false;
  const sheet = { getLastRow: () => rows.length, getRange: () => ({ createTextFinder: (id: string) => ({ matchEntireCell: () => ({ findNext: () => rows.find(r => r[9] === id) || null }) }) }), appendRow: (row: string[]) => { assert.equal(locked, true); rows.push(row); } };
  const context = vm.createContext({ LockService: { getScriptLock: () => ({ waitLock: () => { locked = true; }, hasLock: () => locked, releaseLock: () => { locked = false; } }) }, PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'configured' }) }, SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush: () => {} }, ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (text: string) => ({ setMimeType: () => JSON.parse(text) }) } });
  vm.runInContext(readFileSync('scripts/google-apps-script.gs', 'utf8'), context);
  for (let i = 0; i < 3; i++) { context.event = { postData: { contents: JSON.stringify(lead) } }; assert.equal(vm.runInContext('doPost(event)', context).success, true); }
  assert.equal(rows.length, 1); assert.equal(rows[0][9], lead.submissionId); assert.equal(locked, false);
});
