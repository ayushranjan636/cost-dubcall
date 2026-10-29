// Vercel serverless function: receives a lead from the rate checker page
// and forwards it to the Google Apps Script web app that writes to Google Sheets.
//
// Environment variables (set in Vercel → Project → Settings → Environment Variables):
//   SHEET_WEBHOOK_URL  The Apps Script web app URL (ends in /exec)
//   SHEET_SECRET       Any long random string; must match SHARED_SECRET in Apps Script

const MAX_LEN = 500;
const ALLOWED_STAGES = new Set(['Details submitted', 'Rates viewed', 'PDF downloaded']);
const FIELDS = [
  'leadId', 'stage', 'name', 'company', 'email', 'phone', 'designation', 'city',
  'industry', 'companySize', 'callDirection', 'crm', 'languages', 'useCases',
  'callsPerMonth', 'salesMinutesPerMonth', 'plan', 'planFee', 'rates', 'page'
];

function clean(value, max = MAX_LEN) {
  if (value === undefined || value === null) return '';
  let s = String(value).replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
  // Stop spreadsheet formula injection (cells starting with = + - @)
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s.slice(0, max);
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Use POST' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return res.status(400).json({ ok: false, error: 'Invalid JSON' });
  }

  // Bots: hidden honeypot field filled in, or form completed in under 2 seconds.
  // Reply OK so they don't retry, but don't save.
  if (body.website || (Number(body.elapsedMs) > 0 && Number(body.elapsedMs) < 2000)) {
    return res.status(200).json({ ok: true });
  }

  const lead = {};
  for (const f of FIELDS) lead[f] = clean(body[f], f === 'rates' || f === 'useCases' ? 2000 : MAX_LEN);

  if (!/^[A-Za-z0-9-]{8,64}$/.test(String(body.leadId || ''))) {
    return res.status(400).json({ ok: false, error: 'Missing lead id' });
  }
  if (!ALLOWED_STAGES.has(lead.stage)) {
    return res.status(400).json({ ok: false, error: 'Unknown stage' });
  }
  if (!lead.name || !lead.company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) || lead.phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ ok: false, error: 'Name, company, a valid email and phone are required' });
  }

  const url = process.env.SHEET_WEBHOOK_URL;
  const secret = process.env.SHEET_SECRET;
  if (!url || !secret) {
    console.error('SHEET_WEBHOOK_URL or SHEET_SECRET is not set');
    return res.status(500).json({ ok: false, error: 'Lead storage is not configured' });
  }

  lead.userAgent = clean(req.headers['user-agent'], 300);
  lead.ip = clean((req.headers['x-forwarded-for'] || '').split(',')[0], 64);

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, lead }),
      redirect: 'follow'
    });
    const text = await r.text();
    let data = {};
    try { data = JSON.parse(text); } catch (e) { /* Apps Script returned HTML, usually a permissions problem */ }
    if (!r.ok || !data.ok) {
      console.error('Sheet webhook failed', r.status, text.slice(0, 300));
      return res.status(502).json({ ok: false, error: 'Could not save lead' });
    }
    return res.status(200).json({ ok: true, row: data.row });
  } catch (e) {
    console.error('Sheet webhook error', e);
    return res.status(502).json({ ok: false, error: 'Could not save lead' });
  }
}
