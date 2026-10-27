import { useEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { confirmationMessage, readEnquiryReceipt, type EnquiryReceipt } from '../lib/enquiryConfirmation';

export default function ThankYou() {
  const [receipt, setReceipt] = useState<EnquiryReceipt | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const homeLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const received = readEnquiryReceipt(window.history.state);
    setReceipt(received);
    if (received && !received.popupShown) {
      setShowPopup(true);
      window.history.replaceState({ justgrowEnquiry: { ...received, popupShown: true } }, '');
    }
  }, []);

  useEffect(() => {
    if (showPopup && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [showPopup]);

  return <>
    <section className="thank-you-page"><div className="container thank-you-content">
      <span className="eyebrow">JUSTGROW</span>
      <CheckCircle2 className="thank-you-icon" size={54} aria-hidden="true"/>
      <h1>{receipt ? 'Thank you for submitting your form.' : 'Thank you for your interest.'}</h1>
      <p>{receipt ? confirmationMessage(receipt.phoneProvided) : 'Tell us about your business and the goals you would like to achieve.'}</p>
      <div className="thank-you-actions"><a ref={homeLink} className="button" href="/">Back to Home</a>{!receipt && <a className="text-link" href="/contact/">Contact JustGrow</a>}</div>
    </div></section>
    {receipt && <dialog ref={dialog} className="thank-you-dialog" aria-labelledby="thank-you-popup-title" aria-describedby="thank-you-popup-message" onClose={() => { setShowPopup(false); homeLink.current?.focus(); }}>
      <CheckCircle2 className="thank-you-icon" size={48} aria-hidden="true"/>
      <h2 id="thank-you-popup-title">Thank you for submitting your form!</h2>
      <p id="thank-you-popup-message">{confirmationMessage(receipt.phoneProvided)}</p>
      <button type="button" className="button" autoFocus onClick={() => window.location.replace('/')}>OK</button>
    </dialog>}
  </>;
}
