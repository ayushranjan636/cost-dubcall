import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PLANS, inr } from './data.js';

const rs = v => 'Rs. ' + inr.format(v);

/** Recolours the logo white for the dark PDF header. Returns a PNG data URL, or null. */
export async function makeWhiteLogo(src) {
  try {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas'); c.width = 400; c.height = 88;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0, 400, 88);
    x.globalCompositeOperation = 'source-in'; x.fillStyle = '#ffffff'; x.fillRect(0, 0, 400, 88);
    return c.toDataURL('image/png');
  } catch {
    return null;
  }
}

/**
 * @param {object} p
 * @param {object} p.details  form values from page 1 + page 2 (with industry label)
 * @param {number} p.calls    picked-up calls per month
 * @param {string} p.tier     'low' | 'avg' | 'high'
 * @param {Array}  p.rows     rate rows from rateRows()
 * @param {string|null} p.whiteLogo
 */
export function buildPdf({ details: d, calls, tier, rows, whiteLogo }) {
  const plan = PLANS[tier];
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth(), M = 40;
  const dark = [11, 11, 11], ink = [11, 11, 11], muted = [94, 94, 94];
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const lastY = () => doc.lastAutoTable.finalY;

  doc.setFillColor(...dark); doc.rect(0, 0, W, 72, 'F');
  doc.setTextColor(255, 255, 255);
  if (whiteLogo) doc.addImage(whiteLogo, 'PNG', M, 16, 110, 24);
  else { doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.text('DubCall', M, 34); }
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.text('Rate sheet: pay for results, not minutes', M, 58);
  doc.text(dateStr, W - M, 34, { align: 'right' }); doc.text('All prices include GST', W - M, 54, { align: 'right' });

  autoTable(doc, {
    startY: 90, margin: { left: M, right: M }, theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3, textColor: ink },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 95 }, 2: { fontStyle: 'bold', cellWidth: 105 } },
    body: [
      ['Prepared for', d.contact + (d.role ? ', ' + d.role : ''), 'Industry', d.industry],
      ['Company', d.company, 'Company size', d.size],
      ['Email', d.email, 'Call direction', d.dir],
      ['Phone', d.phone, 'System to connect', d.crm],
      ['City', d.city || '-', 'Languages', d.langs]
    ]
  });

  let y = lastY() + 16;
  doc.setFillColor(236, 236, 236); doc.roundedRect(M, y, W - 2 * M, 58, 4, 4, 'F');
  const col = (W - 2 * M) / 3;
  [['YOUR PLAN', plan.name], ['MONTHLY PLAN FEE', rs(plan.fee)], ['PICKED-UP CALLS / MONTH', calls ? inr.format(calls) : '-']].forEach(([k, v], i) => {
    const x = M + 14 + i * col;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...muted); doc.text(k, x, y + 20);
    doc.setFontSize(16); doc.setTextColor(...ink); doc.text(v, x, y + 44);
  });

  y += 76;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(...ink); doc.text('Your rates', M, y);
  autoTable(doc, {
    startY: y + 8, margin: { left: M, right: M },
    head: [['Use case', 'You pay when', 'Rate (incl. GST)']],
    body: rows.map(r => [r.u.name, r.u.result, rs(r.rate) + '\n' + r.unit]),
    styles: { fontSize: 9.5, cellPadding: 6, textColor: ink, lineColor: [220, 220, 220], lineWidth: 0.5, valign: 'top' },
    headStyles: { fillColor: dark, textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 160, fontStyle: 'bold' }, 2: { halign: 'right', cellWidth: 110 } },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  autoTable(doc, {
    startY: lastY() + 16, margin: { left: M, right: M }, theme: 'plain',
    head: [['Plans (incl. GST)', 'Monthly fee', 'Picked-up calls a month', 'Rate applied']],
    body: Object.entries(PLANS).map(([k, p]) => [p.name + (k === tier ? '  (your plan)' : ''), rs(p.fee), p.range.replace(' calls/month', ''), p.rule]),
    styles: { fontSize: 9.5, cellPadding: 4, textColor: ink },
    headStyles: { fontStyle: 'bold', textColor: muted, fontSize: 9 },
    didParseCell: data => { if (data.section === 'body' && Object.keys(PLANS)[data.row.index] === tier) data.cell.styles.fontStyle = 'bold'; }
  });

  const terms = [
    'All prices include GST.',
    'First 100 calls are free as your pilot.',
    'Unanswered, busy and under-10-second calls: Rs. 0. A picked-up call over 10 seconds with no result: Rs. 3.',
    'A call with a result is billed at its result rate only; the Rs. 3 is not added on top.',
    'Sales calling is billed per connected minute: Rs. 7 up to 25,000 min, Rs. 6 up to 1 lakh, Rs. 5 up to 5 lakh, Rs. 4.5 above.',
    'Calls run on your own numbers or SIP trunk; telephony is not included.',
    'Every billed result is backed by a call recording and a record in your LMS, LOS or CRM. Statements are monthly.',
    'Indicative rates based on the volume you entered; final rates are confirmed after the pilot.'
  ];
  autoTable(doc, {
    startY: lastY() + 14, margin: { left: M, right: M }, theme: 'plain',
    head: [['How billing works']], headStyles: { fontStyle: 'bold', fontSize: 12, textColor: ink },
    styles: { fontSize: 9, cellPadding: { top: 2, bottom: 2, left: 0, right: 0 }, textColor: muted },
    body: terms.map((t, i) => [(i + 1) + '. ' + t])
  });

  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p); doc.setFontSize(8); doc.setTextColor(...muted);
    const H = doc.internal.pageSize.getHeight();
    doc.text('DubCall by NextSens Global Pvt. Ltd. · dubcall.com · support@dubcall.com', M, H - 20);
    doc.text(`Page ${p} of ${pages}`, W - M, H - 20, { align: 'right' });
  }
  const slug = d.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'rates';
  return { blob: doc.output('blob'), filename: `DubCall-rates-${slug}-${today.toISOString().slice(0, 10)}.pdf` };
}

export function downloadBlob({ blob, filename }) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
