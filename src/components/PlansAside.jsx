import { PLANS, rupee } from '../data.js';

export default function PlansAside({ tier }) {
  return (
    <aside className="plans" aria-label="Plans">
      <div className="plans-head">Plans · prices incl. GST</div>
      {Object.entries(PLANS).map(([key, p]) => {
        const on = key === tier;
        return (
          <div key={key} className={'plan' + (on ? ' on' : '')}>
            <div className="plan-top"><h3>{p.name}</h3><span className="tag">{on ? 'Your plan' : ''}</span></div>
            <div className="fee">{rupee(p.fee)}<small> / month</small></div>
            <p>{p.blurb}</p>
          </div>
        );
      })}
      <p className="plans-note">Every plan: first 100 calls free, ₹0 for unanswered calls, ₹3 for a picked-up call over 10 seconds with no result.</p>
    </aside>
  );
}
