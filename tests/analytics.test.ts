import test from 'node:test';
import assert from 'node:assert/strict';
import { sendAnalyticsEvent, type AnalyticsEvent } from '../src/lib/analytics';
import { markEnquiryConversionTracked, type EnquiryReceipt } from '../src/lib/enquiryConfirmation';

test('analytics events dispatch once and enter the dataLayer without contact details', () => {
  const pushed: unknown[] = [];
  const dispatched: CustomEvent[] = [];
  const fakeWindow = {
    dataLayer: pushed as Array<Record<string, unknown>>,
    dispatchEvent: (event: Event) => { dispatched.push(event as CustomEvent); return true; },
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: fakeWindow });

  const event: AnalyticsEvent = {
    event: 'whatsapp_click',
    page_path: '/contact/',
    service_slug: 'general',
    cta_position: 'content',
  };
  sendAnalyticsEvent(event);

  assert.deepEqual(pushed, [event]);
  assert.equal(dispatched.length, 1);
  assert.equal(dispatched[0].type, 'justgrow:analytics');
  assert.deepEqual((dispatched[0] as CustomEvent).detail, event);
  assert.equal(Object.keys(pushed[0] as object).some(key => /email|phone|name|message/i.test(key)), false);
});

test('enquiry confirmation is eligible for conversion tracking only once', () => {
  const receipt: EnquiryReceipt = {
    receivedAt: 100,
    phoneProvided: true,
    popupShown: false,
    serviceSlug: 'local-seo',
    conversionTracked: false,
  };
  const first = markEnquiryConversionTracked(receipt);
  assert.equal(first?.conversionTracked, true);
  assert.equal(first?.serviceSlug, 'local-seo');
  assert.equal(markEnquiryConversionTracked(first), null);
  assert.equal(receipt.conversionTracked, false, 'receipt is copied before it is marked');
});
