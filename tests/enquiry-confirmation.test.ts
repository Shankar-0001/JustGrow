import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { confirmationMessage, readEnquiryReceipt } from '../src/lib/enquiryConfirmation';
import { allRoutes, publicRoutes, metadataFor } from '../src/data/metadata';

test('confirmation receipts expire and distinguish phone from email follow-up', () => {
  const now = Date.now();
  const valid = { receivedAt: now, phoneProvided: true, popupShown: false };
  assert.deepEqual(readEnquiryReceipt({ justgrowEnquiry: valid }, now), valid);
  assert.equal(readEnquiryReceipt(null, now), null);
  assert.equal(readEnquiryReceipt({ justgrowEnquiry: { ...valid, receivedAt: now - 31 * 60 * 1000 } }, now), null);
  assert.equal(readEnquiryReceipt({ justgrowEnquiry: { ...valid, receivedAt: now + 1000 } }, now), null);
  assert.equal(readEnquiryReceipt({ justgrowEnquiry: { ...valid, phoneProvided: 'yes' } }, now), null);
  assert.match(confirmationMessage(true), /call/);
  assert.match(confirmationMessage(false), /email/);
  assert.doesNotMatch(confirmationMessage(false), /call/);
});

test('thank-you is a real route but is never eligible for indexing or sitemap inclusion', () => {
  assert.ok(allRoutes.includes('/thank-you/'));
  assert.ok(!publicRoutes.includes('/thank-you/'));
  assert.equal(metadataFor('/thank-you').found, true);
  assert.equal(metadataFor('/thank-you/').indexable, false);
  const html = readFileSync('dist/thank-you/index.html', 'utf8');
  assert.ok(html.includes('name="robots" content="noindex, nofollow"'));
  assert.ok(html.includes('Thank you for your interest.'));
  assert.ok(!html.includes('<dialog'), 'A direct visit does not claim a successful submission');
  assert.ok(!readFileSync('dist/sitemap.xml', 'utf8').includes('/thank-you/'));
});
