import { handleLead } from './lead-handler';
export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return Response.json({ success: false, syncedToSheet: false, error: 'Method not allowed.' }, { status: 405, headers: { Allow: 'POST' } });
    try {
      const raw = await request.text();
      if (raw.length > 20000) return Response.json({ success: false, error: 'Enquiry too large.' }, { status: 413 });
      const result = await handleLead(JSON.parse(raw));
      return Response.json(result.body, { status: result.status, headers: { 'Cache-Control': 'no-store' } });
    } catch { return Response.json({ success: false, syncedToSheet: false, error: 'Invalid enquiry.' }, { status: 400 }); }
  },
};
