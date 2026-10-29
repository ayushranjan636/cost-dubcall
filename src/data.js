// All prices and options live here. Update the wording in RatesPanel, PlansAside and pdf.js if you change cut-offs or fees.

export const GROUPS = [
  { id: 'bfsi', name: 'Banking, NBFC & insurance', core: true },
  { id: 'ecom', name: 'E-commerce & D2C' }, { id: 'health', name: 'Healthcare' }, { id: 'realty', name: 'Real estate' },
  { id: 'edu', name: 'Education' }, { id: 'travel', name: 'Travel & hospitality' }, { id: 'logistics', name: 'Logistics' },
  { id: 'hr', name: 'HR & recruitment' }, { id: 'any', name: 'Any industry' }, { id: 'sales', name: 'Sales calling' }
];

export const UC = [
  { id: 'emi', g: 'bfsi', name: 'EMI pre-due reminder', result: 'Borrower acknowledges due date or payment plan', lo: 8, hi: 10 },
  { id: 'ptp1', g: 'bfsi', name: 'Collections, 1–30 DPD', result: 'Promise-to-pay with amount and date written to LMS', lo: 45, hi: 60 },
  { id: 'ptp2', g: 'bfsi', name: 'Collections, 31–60 DPD', result: 'Promise-to-pay with amount and date written to LMS', lo: 75, hi: 110 },
  { id: 'ptp3', g: 'bfsi', name: 'Collections, 61–90 DPD', result: 'Promise-to-pay with amount and date written to LMS', lo: 120, hi: 175 },
  { id: 'paid', g: 'bfsi', name: 'Payment realised (add-on)', result: 'Payment received inside the promise-to-pay window', lo: 20, hi: 40, unit: 'per payment' },
  { id: 'kyc', g: 'bfsi', name: 'KYC / re-KYC', result: 'Verification marked complete in CBS or LOS', lo: 35, hi: 60 },
  { id: 'loan', g: 'bfsi', name: 'Loan application follow-up', result: 'Case moves a stage: documents uploaded or visit booked', lo: 40, hi: 80 },
  { id: 'insr', g: 'bfsi', name: 'Insurance renewal', result: 'Renewal commitment captured', lo: 75, hi: 120 },
  { id: 'svc', g: 'bfsi', name: 'Borrower / policyholder servicing', result: 'Query resolved or service request raised', lo: 25, hi: 75 },
  { id: 'cod', g: 'ecom', name: 'COD confirmation', result: 'Order verified or cancelled before dispatch', lo: 5, hi: 8 },
  { id: 'ndr', g: 'ecom', name: 'Failed delivery (NDR)', result: 'Re-attempt slot or address confirmed', lo: 6, hi: 10 },
  { id: 'prepaid', g: 'ecom', name: 'COD to prepaid', result: 'Customer pays online after the call', lo: 15, hi: 25 },
  { id: 'appt', g: 'health', name: 'Appointment reminder', result: 'Appointment confirmed or rescheduled', lo: 8, hi: 12 },
  { id: 'newpt', g: 'health', name: 'New patient booking', result: 'Appointment booked in your system', lo: 60, hi: 120 },
  { id: 'visit', g: 'realty', name: 'Inbound lead follow-up', result: 'Site visit booked', lo: 150, hi: 300 },
  { id: 'couns', g: 'edu', name: 'Admissions enquiry', result: 'Counselling session or demo booked', lo: 60, hi: 120 },
  { id: 'fee', g: 'edu', name: 'Fee reminder', result: 'Payment date acknowledged', lo: 6, hi: 10 },
  { id: 'book', g: 'travel', name: 'Booking reminder', result: 'Booking confirmed or modified', lo: 8, hi: 12 },
  { id: 'slot', g: 'logistics', name: 'Delivery coordination', result: 'Delivery slot confirmed', lo: 5, hi: 8 },
  { id: 'screen', g: 'hr', name: 'Candidate screening', result: 'Screened and interview scheduled', lo: 40, hi: 80 },
  { id: 't1', g: 'any', name: 'Customer support, Tier 1', result: 'Query resolved, no repeat call in 48 hours', lo: 25, hi: 40 },
  { id: 't2', g: 'any', name: 'Customer support, Tier 2', result: 'Action completed: refund, reversal or ticket closed', lo: 50, hi: 75 },
  { id: 'esc', g: 'any', name: 'Escalation to your team (add-on)', result: 'Warm handoff to a human with full context', lo: 10, hi: 10, unit: 'per handoff' },
  { id: 'survey', g: 'any', name: 'Survey / NPS / feedback', result: 'All questions answered', lo: 15, hi: 25 },
  { id: 'sales', g: 'sales', name: 'Sales and outbound lead calling', result: 'Billed per connected minute, not per result', sales: true }
];

export const INDUSTRIES = [
  { value: 'nbfc', label: 'NBFC / digital lender', group: 'bfsi' },
  { value: 'bank', label: 'Bank', group: 'bfsi' },
  { value: 'ins', label: 'Insurance', group: 'bfsi' },
  { value: 'dca', label: 'Collection agency', group: 'bfsi' },
  { value: 'mfi', label: 'Microfinance', group: 'bfsi' },
  { value: 'ecom', label: 'E-commerce & D2C', group: 'ecom' },
  { value: 'health', label: 'Healthcare', group: 'health' },
  { value: 'realty', label: 'Real estate', group: 'realty' },
  { value: 'edu', label: 'Education', group: 'edu' },
  { value: 'travel', label: 'Travel & hospitality', group: 'travel' },
  { value: 'logistics', label: 'Logistics', group: 'logistics' },
  { value: 'hr', label: 'HR & recruitment', group: 'hr' },
  { value: 'other', label: 'Other', group: 'any' }
];

export const SIZES = ['1–50 employees', '51–200 employees', '201–1,000 employees', '1,000+ employees'];
export const CRMS = ['LMS / LOS (custom, via API)', 'Salesforce', 'HubSpot', 'Zoho CRM', 'LeadSquared', 'Other CRM', 'None yet'];
export const DIRECTIONS = ['Outbound', 'Inbound', 'Both'];
export const LANGS = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Odia', 'Other'];

export const PLANS = {
  low: { name: 'Starter', fee: 4999, range: 'under 10,000 calls/month', rule: 'upper rate', blurb: 'Under 10,000 picked-up calls a month. Upper rate per result.' },
  avg: { name: 'Growth', fee: 9999, range: '10,000–50,000 calls/month', rule: 'average rate', blurb: '10,000–50,000 calls a month. Average rate per result.' },
  high: { name: 'Scale', fee: 19999, range: 'over 50,000 calls/month', rule: 'lowest rate', blurb: 'Over 50,000 calls a month. Lowest rate per result.' }
};

export const SALES_TIERS = [{ max: 25000, rate: 7 }, { max: 100000, rate: 6 }, { max: 500000, rate: 5 }, { max: Infinity, rate: 4.5 }];

export const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });
export const rupee = v => '₹' + inr.format(v);

export function n(v) { const x = Number(v); return Number.isFinite(x) && x > 0 ? x : 0; }
export function tierFor(calls) { return calls < 10000 ? 'low' : (calls <= 50000 ? 'avg' : 'high'); }
export function rateFor(u, tier) { return tier === 'low' ? u.hi : tier === 'high' ? u.lo : Math.round(u.lo + u.hi) / 2; }
export function salesRate(min) { return SALES_TIERS.find(t => min <= t.max).rate; }

/** Use-case groups shown up front for an industry; the rest go under "More industries". */
export function groupsFor(industry) {
  const primary = INDUSTRIES.find(i => i.value === industry)?.group || 'any';
  const mainIds = [...new Set([primary, ...(primary !== 'bfsi' ? ['bfsi'] : []), 'any', 'sales'])];
  return {
    main: mainIds.map(id => GROUPS.find(g => g.id === id)),
    more: GROUPS.filter(g => !mainIds.includes(g.id))
  };
}

/** Rows for the selected use cases, in catalogue order. */
export function rateRows(selected, tier, salesMin) {
  return UC.filter(u => selected.has(u.id)).map(u =>
    u.sales
      ? { u, rate: salesRate(n(salesMin)), unit: 'per connected minute' }
      : { u, rate: rateFor(u, tier || 'low'), unit: u.unit || 'per result' }
  );
}
