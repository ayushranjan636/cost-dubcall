import { UC, CRMS, DIRECTIONS, LANGS, groupsFor } from '../data.js';

function UseCaseGroup({ group, selected, onToggle }) {
  return (
    <fieldset className="group">
      <legend>{group.name}{group.core && <span className="core">Core focus</span>}</legend>
      <div className="uc-grid">
        {UC.filter(u => u.g === group.id).map(u => (
          <label key={u.id} className="uc">
            <input type="checkbox" id={'uc-' + u.id} checked={selected.has(u.id)} onChange={() => onToggle(u.id)} />
            <span className="uc-body">
              <span className="uc-name">{u.name}</span>
              <span className="uc-res">{u.result}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function RequirementsForm({
  industry, selected, onToggleUseCase, calls, onCalls, salesMin, onSalesMin,
  dir, onDir, crm, onCrm, langs, onToggleLang, errors, onBack, onSubmit, headingRef
}) {
  const { main, more } = groupsFor(industry);
  const groupProps = { selected, onToggle: onToggleUseCase };

  return (
    <form className="panel" noValidate onSubmit={e => { e.preventDefault(); onSubmit(); }}>
      <div className="panel-head">
        <h2 ref={headingRef} tabIndex={-1}>Your requirements</h2>
        <p className="hint">Pick every use case you need. Your plan and rates depend on your total picked-up calls a month.</p>
      </div>
      <div className="groups">{main.map(g => <UseCaseGroup key={g.id} group={g} {...groupProps} />)}</div>
      <details className="more">
        <summary>More industries</summary>
        <div className="groups">{more.map(g => <UseCaseGroup key={g.id} group={g} {...groupProps} />)}</div>
      </details>
      <span className="err">{errors.uc}</span>
      <hr className="divider" />
      <div className="grid2">
        <label className="field"><span>Expected picked-up calls per month <span className="req">*</span></span>
          <input type="number" id="calls" min="0" step="500" placeholder="e.g. 20000" value={calls}
            aria-invalid={errors.calls ? 'true' : undefined} onChange={e => onCalls(e.target.value)} />
          <span className="err">{errors.calls}</span>
        </label>
        {selected.has('sales') && (
          <label className="field"><span>Sales calling: connected minutes per month</span>
            <input type="number" id="salesMin" min="0" step="1000" placeholder="e.g. 30000" value={salesMin} onChange={e => onSalesMin(e.target.value)} />
          </label>
        )}
        <div className="field"><span className="q" id="dirQ">Call direction</span>
          <div className="pills" role="radiogroup" aria-labelledby="dirQ">
            {DIRECTIONS.map(d => (
              <label key={d} className="pill">
                <input type="radio" name="dir" value={d} checked={dir === d} onChange={() => onDir(d)} /><span>{d}</span>
              </label>
            ))}
          </div>
        </div>
        <label className="field"><span>System to connect</span>
          <select id="crm" value={crm} onChange={e => onCrm(e.target.value)}>{CRMS.map(c => <option key={c}>{c}</option>)}</select>
        </label>
      </div>
      <div className="field">
        <span className="q" id="langQ">Languages your customers speak <span className="hint">(same price for every language)</span></span>
        <div className="pills" aria-labelledby="langQ">
          {LANGS.map(l => (
            <label key={l} className="pill">
              <input type="checkbox" id={'lang-' + l.toLowerCase()} checked={langs.has(l)} onChange={() => onToggleLang(l)} /><span>{l}</span>
            </label>
          ))}
        </div>
      </div>
      <p className="hint">You call from your own phone numbers or SIP trunk; telephony is not part of DubCall pricing.</p>
      <div className="nav"><button type="button" onClick={onBack}>Back</button><button type="submit" className="primary">See my rates</button></div>
    </form>
  );
}
