import { useEffect, useRef, useState, type FormEvent } from 'react';
import { services } from '../data/services';
import { submitLeadToGoogleSheet } from '../lib/googleSheets';
import { goToThankYou } from '../lib/enquiryConfirmation';

export function EnquiryForm({ initialService = 'general', eyebrow = 'YOUR PROJECT STARTS HERE', heading = 'Tell us a little about it.', note }: { initialService?: string; eyebrow?: string; heading?: string; note?: string }) {
  const [service, setService] = useState(initialService);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const sending = useRef(false);
  const submissionId = useRef('');
  const notice = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('service');
    if (services.some(s => s.slug === slug)) setService(slug!);
    // Always assign a fresh submission ID for each page visit
    submissionId.current = crypto.randomUUID();
    try { sessionStorage.removeItem('jg-enquiry-id'); } catch {}
    try { localStorage.removeItem('justgrow_leads_backup'); } catch { /* legacy PII cleanup */ }
  }, []);
  useEffect(() => { if (status === 'success' || status === 'error') notice.current?.focus(); }, [status]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || status === 'success') return;
    const data = new FormData(event.currentTarget);
    const phone = String(data.get('phone') || '').trim();
    sending.current = true;
    setStatus('sending'); setError('');
    const result = await submitLeadToGoogleSheet({
      submissionId: submissionId.current || (submissionId.current = crypto.randomUUID()),
      formType: 'Send Us a Message', fullName: String(data.get('fullName') || ''), email: String(data.get('email') || ''),
      phone, company: String(data.get('company') || ''),
      service: services.find(s => s.slug === service)?.name || 'General enquiry', message: String(data.get('message') || ''),
      privacyAgreed: data.get('privacy') === 'on', website: String(data.get('website') || ''),
    });
    if (result.success && result.syncedToSheet) {
      setStatus('success');
      try { sessionStorage.removeItem('jg-enquiry-id'); } catch { /* optional storage */ }
      window.dispatchEvent(new CustomEvent('justgrow:analytics', { detail: { event: 'enquiry_confirmed', service_slug: service, page_path: window.location.pathname } }));
      try { goToThankYou(Boolean(phone)); } catch { /* Keep the confirmed inline receipt if navigation is unavailable. */ }
    } else {
      sending.current = false;
      setStatus('error');
      // Reset submission ID so any subsequent attempt or corrected details never trigger 409 Conflict
      submissionId.current = crypto.randomUUID();
      try { sessionStorage.removeItem('jg-enquiry-id'); } catch {}
      setError(result.message || 'We could not confirm receipt. Please call or email us.');
    }
  }
  return <div className="contact-form-panel">{status === 'success' ? <div className="success-message" role="status" ref={notice} tabIndex={-1}><span className="success-icon">✓</span><h2>Enquiry received.</h2><p>Thank you for getting in touch. Your project details have been received by JustGrow.</p><a className="button" href="/">Back to JustGrow </a></div> : <form onSubmit={submit} aria-busy={status === 'sending'}><span className="eyebrow">{eyebrow}</span><h2>{heading}</h2><p className="form-note">Fields marked * are required.</p>{error && <div className="form-error" role="alert" ref={notice} tabIndex={-1}>{error}</div>}<fieldset disabled={status === 'sending'}><div className="form-row"><label htmlFor="fullName">Full name *<input id="fullName" name="fullName" autoComplete="name" required maxLength={250} placeholder="Your name"/></label><label htmlFor="email">Email address *<input id="email" name="email" type="email" autoComplete="email" required maxLength={250} placeholder="you@company.com"/></label></div><div className="form-row"><label htmlFor="phone">Phone <span>(optional)</span><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} pattern={String.raw`[+0-9 \(\)\.\-]{7,30}`} placeholder="Include your country code"/></label><label htmlFor="company">Company / website <span>(optional)</span><input id="company" name="company" autoComplete="organization" maxLength={250} placeholder="Your business"/></label></div><label htmlFor="service">What can we help with?<select id="service" name="service" value={service} onChange={e => setService(e.target.value)}><option value="general">Help me choose a service</option>{services.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select></label><label htmlFor="message">Your project goals *<textarea id="message" name="message" required minLength={1} maxLength={5000} rows={5} placeholder="What would you like to improve? Tell us about your goals, audience and any project requirements."/></label><div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div><label className="checkbox-label"><input type="checkbox" name="privacy" required/><span>I have read the <a href="/privacy-policy/">Privacy Policy</a> and agree to JustGrow using these details to respond to my enquiry. *</span></label><button className="button submit-button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending your enquiry…' : 'Send Project Enquiry'}</button></fieldset><p className="form-note">{note || <>Your details are sent to JustGrow’s Google Sheets enquiry record. Please don’t include passwords or sensitive information.</>}</p><noscript><p>This form needs JavaScript. Please use the phone or email links to contact us.</p></noscript></form>}</div>;
}
