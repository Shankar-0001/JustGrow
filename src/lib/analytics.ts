export type AnalyticsEventName =
  | 'service_cta_click'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'enquiry_confirmed';

export type AnalyticsEvent = {
  event: AnalyticsEventName;
  page_path: string;
  service_slug: string;
  cta_position?: 'header' | 'footer' | 'content';
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Keep the app event for local integrations, and forward one PII-free object
 * through Partytown's configured dataLayer.push bridge into GTM.
 */
export function sendAnalyticsEvent(detail: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  const payload = { ...detail };
  window.dispatchEvent(new CustomEvent('justgrow:analytics', { detail: payload }));
  const dataLayer = window.dataLayer || (window.dataLayer = []);
  dataLayer.push(payload);
}
