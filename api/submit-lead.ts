import { handleLead } from './lead-handler';

export default async function handler(req: any, res?: any) {
  // 1. Standard Node HTTP handler: handler(req, res)
  if (res && typeof res.status === 'function') {
    if (req.method !== 'POST') {
      res.setHeader?.('Allow', 'POST');
      return res.status(405).json({ success: false, syncedToSheet: false, error: 'Method not allowed.' });
    }
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const result = await handleLead(body);
      res.setHeader?.('Cache-Control', 'no-store');
      return res.status(result.status).json(result.body);
    } catch {
      return res.status(400).json({ success: false, syncedToSheet: false, error: 'Invalid enquiry.' });
    }
  }

  // 2. Fetch API handler: handler(request: Request)
  const request = req as Request;
  if (request.method !== 'POST') {
    return Response.json(
      { success: false, syncedToSheet: false, error: 'Method not allowed.' },
      { status: 405, headers: { Allow: 'POST' } }
    );
  }
  try {
    const raw = await request.text();
    if (raw.length > 20000) return Response.json({ success: false, error: 'Enquiry too large.' }, { status: 413 });
    const result = await handleLead(JSON.parse(raw));
    return Response.json(result.body, { status: result.status, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ success: false, syncedToSheet: false, error: 'Invalid enquiry.' }, { status: 400 });
  }
}

(handler as any).fetch = (request: Request) => handler(request);
