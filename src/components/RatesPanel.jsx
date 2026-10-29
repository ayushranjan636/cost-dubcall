import { PLANS, inr, rupee } from '../data.js';

export default function RatesPanel({ details, calls, tier, rows, status, onBack, onDownload, headingRef }) {
  const plan = PLANS[tier];
  return (
    <section className="panel" aria-labelledby="p3h">
      <div className="panel-head">
        <h2 id="p3h" ref={headingRef} tabIndex={-1}>Your rates</h2>
        <p className="who">Prepared for {details.contact}, {details.company} · {details.industry}</p>
      </div>
      <div className="hero-plan">
        <div className="stat"><small>Your plan</small><strong>{plan.name}</strong></div>
        <div className="stat"><small>Monthly plan fee</small><strong className="num">{rupee(plan.fee)} / mo</strong></div>
        <div className="stat"><small>Picked-up calls / month</small><strong className="num">{calls ? inr.format(calls) : '–'}</strong></div>
      </div>
      <div className="tablebox">
        <table>
          <thead><tr><th>Use case</th><th>You pay when</th><th className="r">Rate (incl. GST)</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.u.id}>
                <td>{r.u.name}</td>
                <td>{r.u.result}</td>
                <td className="r"><b>{rupee(r.rate)}</b><small>{r.unit}</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="terms">
        <li>All prices include GST.</li>
        <li>First 100 calls are free as your pilot.</li>
        <li>Unanswered, busy and under-10-second calls: ₹0. A picked-up call over 10 seconds with no result: ₹3.</li>
        <li>A call with a result is billed at its result rate only; the ₹3 is not added on top.</li>
        <li>Sales calling is billed per connected minute: ₹7 up to 25,000 min, ₹6 up to 1 lakh, ₹5 up to 5 lakh, ₹4.5 above.</li>
        <li>Calls run on your own numbers or SIP trunk; telephony is not included.</li>
        <li>Every billed result is backed by a call recording and a record in your LMS, LOS or CRM.</li>
      </ul>
      <div className="nav">
        <button type="button" onClick={onBack}>Edit requirements</button>
        <button type="button" className="primary" onClick={onDownload}>Download rates as PDF</button>
      </div>
      <p className="status" role="status">{status}</p>
    </section>
  );
}
