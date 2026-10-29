// Lead capture: one row per visitor in Google Sheets, updated as they move through the steps.
// Posts to the Vercel function at /api/lead, which holds the Sheets URL and secret.

export const LEAD_ID = typeof crypto !== 'undefined' && crypto.randomUUID
  ? crypto.randomUUID()
  : 'L' + Date.now() + Math.random().toString(16).slice(2);
export const STARTED_AT = Date.now();

export function sendLead(payload) {
  try {
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: LEAD_ID, elapsedMs: Date.now() - STARTED_AT, page: location.href, ...payload }),
      keepalive: true
    })
      .then(r => { if (!r.ok) console.warn('Lead not saved', r.status); })
      .catch(e => console.warn('Lead not saved', e));
  } catch (e) {
    console.warn('Lead not saved', e);
  }
}
