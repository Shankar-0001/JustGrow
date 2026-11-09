export type EnquiryReceipt = {
  receivedAt: number;
  phoneProvided: boolean;
  popupShown: boolean;
  serviceSlug?: string;
  conversionTracked?: boolean;
};

export const confirmationMessage = (phoneProvided: boolean) => phoneProvided
  ? "You'll receive a call from our team soon."
  : 'Our team will contact you by email soon.';

export function readEnquiryReceipt(state: unknown, now = Date.now()): EnquiryReceipt | null {
  const receipt = (state as { justgrowEnquiry?: EnquiryReceipt } | null)?.justgrowEnquiry;
  if (!receipt || !Number.isFinite(receipt.receivedAt) || typeof receipt.phoneProvided !== 'boolean' || typeof receipt.popupShown !== 'boolean') return null;
  if (receipt.serviceSlug !== undefined && typeof receipt.serviceSlug !== 'string') return null;
  if (receipt.conversionTracked !== undefined && typeof receipt.conversionTracked !== 'boolean') return null;
  const age = now - receipt.receivedAt;
  return age >= 0 && age <= 30 * 60 * 1000 ? receipt : null;
}

export function markEnquiryConversionTracked(receipt: EnquiryReceipt | null): EnquiryReceipt | null {
  return receipt && !receipt.conversionTracked ? { ...receipt, conversionTracked: true } : null;
}

export function goToThankYou(phoneProvided: boolean, serviceSlug = 'general') {
  // Only a short-lived receipt, never contact details, is carried into the page.
  // History state survives this reload even when session storage is unavailable.
  window.history.replaceState({ justgrowEnquiry: { receivedAt: Date.now(), phoneProvided, popupShown: false, serviceSlug, conversionTracked: false } }, '', '/thank-you/');
  window.location.reload();
}
