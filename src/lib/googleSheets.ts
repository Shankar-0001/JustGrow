export interface LeadSubmission {
  formType: string; fullName: string; email: string; phone?: string; company?: string;
  service?: string; message?: string; preferredDate?: string; preferredTime?: string;
  submissionId?: string; privacyAgreed?: boolean; website?: string;
}
type Result = { success: boolean; syncedToSheet: boolean; message?: string };
const inFlight = new Map<string, Promise<Result>>();
// One request path. Never retry a write through a different transport.
export function submitLeadToGoogleSheet(lead: LeadSubmission): Promise<Result> {
  const id = lead.submissionId || crypto.randomUUID();
  if (inFlight.has(id)) return inFlight.get(id)!;
  const request = (async () => {
    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, submissionId: id }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true || result.syncedToSheet !== true) {
        return { success: false, syncedToSheet: false, message: result.error || 'We could not confirm receipt. Please call or email us before submitting again.' };
      }
      return { success: true, syncedToSheet: true };
    } catch {
      return { success: false, syncedToSheet: false, message: 'We could not confirm receipt. Please call or email us before submitting again.' };
    } finally { inFlight.delete(id); }
  })();
  inFlight.set(id, request);
  return request;
}
