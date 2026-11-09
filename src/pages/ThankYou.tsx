import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { confirmationMessage, markEnquiryConversionTracked, readEnquiryReceipt, type EnquiryReceipt } from '../lib/enquiryConfirmation';
import { sendAnalyticsEvent } from '../lib/analytics';

export default function ThankYou() {
  const [receipt, setReceipt] = useState<EnquiryReceipt | null>(null);

  useEffect(() => {
    const received = readEnquiryReceipt(window.history.state);
    const tracked = markEnquiryConversionTracked(received);
    if (received && tracked) {
      window.history.replaceState({ ...window.history.state, justgrowEnquiry: tracked }, '', window.location.href);
      setReceipt(tracked);
      sendAnalyticsEvent({
        event: 'enquiry_confirmed',
        service_slug: received.serviceSlug || 'general',
        page_path: window.location.pathname,
      });
    } else {
      setReceipt(received);
    }
  }, []);

  return (
    <section className="thank-you-page">
      <div className="container thank-you-content">
        <span className="eyebrow">JUSTGROW</span>
        <CheckCircle2 className="thank-you-icon" size={54} aria-hidden="true"/>
        <h1>{receipt ? 'Thank you for submitting your form.' : 'Thank you for your interest.'}</h1>
        <p>{receipt ? confirmationMessage(receipt.phoneProvided) : 'Tell us about your business and the goals you would like to achieve.'}</p>
        <div className="thank-you-actions">
          <a className="button" href="/">Back to Home</a>
          {!receipt && <a className="text-link" href="/contact/">Contact JustGrow</a>}
        </div>
      </div>
    </section>
  );
}
