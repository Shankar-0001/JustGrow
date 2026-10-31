import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { confirmationMessage, readEnquiryReceipt, type EnquiryReceipt } from '../lib/enquiryConfirmation';

export default function ThankYou() {
  const [receipt, setReceipt] = useState<EnquiryReceipt | null>(null);

  useEffect(() => {
    const received = readEnquiryReceipt(window.history.state);
    setReceipt(received);
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
