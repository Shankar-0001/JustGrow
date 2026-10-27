import { createHash } from 'node:crypto';

export const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXGKTxAL_ssXhFqksd2M_8Ti3UZ4PId-JSCQ5Ejpf2ogQ58HoohKCdFL-AJfQEGbYP_w/exec';
type Outcome = { status: number; body: { success: boolean; syncedToSheet: boolean; error?: string } };
const failure = (status: number, error: string): Outcome => ({ status, body: { success: false, syncedToSheet: false, error } });
const fields = ['formType', 'fullName', 'email', 'phone', 'company', 'service', 'message', 'preferredDate', 'preferredTime'] as const;
const uncertain = 'We could not confirm receipt. Please call or email us before submitting again.';

// Coalesces requests in one process. Durable, cross-instance protection lives
// at the sheet boundary in scripts/google-apps-script.gs.
export function createLeadHandler(fetcher: typeof fetch = fetch, endpoint = () => process.env.GOOGLE_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL) {
  const requests = new Map<string, { hash: string; expires: number; result: Promise<Outcome> }>();
  return async (raw: unknown): Promise<Outcome> => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return failure(400, 'Please check your enquiry details.');
    const input = raw as Record<string, unknown>;
    const id = typeof input.submissionId === 'string' ? input.submissionId : '';
    if (!/^[a-zA-Z0-9_-]{16,80}$/.test(id)) return failure(400, 'Refresh the page before sending your enquiry.');
    if (input.website) return failure(400, 'Unable to accept this enquiry.');
    const values: Record<string, string> = {};
    for (const key of fields) {
      if (input[key] !== undefined && typeof input[key] !== 'string') return failure(400, 'Please check your enquiry details.');
      values[key] = String(input[key] || '').trim();
      if (values[key].length > (key === 'message' ? 5000 : 250)) return failure(400, 'One of the fields is too long. Please shorten it.');
    }
    if (!values.fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !values.message || input.privacyAgreed !== true) return failure(400, 'Add your name, a valid email, project details and privacy acknowledgement.');
    if (values.phone && !/^\+?[\d\s().-]{7,30}$/.test(values.phone)) return failure(400, 'Please check your phone number.');
    const hash = createHash('sha256').update(JSON.stringify(values)).digest('hex');
    for (const [key, entry] of requests) if (entry.expires < Date.now()) requests.delete(key);
    const existing = requests.get(id);
    if (existing) return existing.hash === hash ? existing.result : failure(409, 'This enquiry was already sent with different details. Refresh to start a new enquiry.');
    if (requests.size >= 10000) return failure(503, 'The enquiry service is busy. Please call or email us.');
    let url: URL;
    try { url = new URL(endpoint()); } catch { return failure(503, 'Please call or email us while our enquiry form is unavailable.'); }
    if (url.protocol !== 'https:' || url.hostname !== 'script.google.com' || !/^\/macros\/s\/[\w-]+\/exec$/.test(url.pathname)) return failure(503, 'Please call or email us while our enquiry form is unavailable.');
    const payload = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, /^[=+@-]/.test(value) ? `'${value}` : value]));
    const result = (async (): Promise<Outcome> => {
      try {
        const response = await fetcher(url, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, redirect: 'follow',
          body: JSON.stringify({ ...payload, submissionId: id, timestamp: new Date().toISOString(), privacyAgreed: true }),
          signal: AbortSignal.timeout(25000),
        });
        const text = await response.text();
        let acknowledgement: Record<string, unknown>;
        try { acknowledgement = JSON.parse(text); } catch { return failure(502, uncertain); }
        if (!response.ok || !acknowledgement || !(acknowledgement.success === true || acknowledgement.result === 'success') || acknowledgement.error || acknowledgement.syncedToSheet === false) return failure(502, uncertain);
        return { status: 200, body: { success: true, syncedToSheet: true } };
      } catch { return failure(502, uncertain); }
    })();
    // Keep ambiguous outcomes too: a lost response may follow a completed write.
    requests.set(id, { hash, expires: Date.now() + 24 * 60 * 60 * 1000, result });
    return result;
  };
}
export const handleLead = createLeadHandler();
