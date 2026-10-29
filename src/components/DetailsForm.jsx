import { INDUSTRIES, SIZES } from '../data.js';

/** Returns an error message per required field ('' when valid), in on-screen order. */
export function validateDetails(v) {
  const phone = v.phone.replace(/\D/g, '');
  return {
    contact: v.contact.trim() ? '' : 'Enter your name.',
    company: v.company.trim() ? '' : 'Enter your company name.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()) ? '' : 'Enter a valid email, like name@company.com.',
    phone: phone.length >= 10 ? '' : 'Enter a phone number with at least 10 digits.',
    industry: v.industry ? '' : 'Select your industry.'
  };
}

export default function DetailsForm({ values, errors, onChange, onSubmit, headingRef, fieldRefs }) {
  const bind = key => ({
    id: key,
    value: values[key],
    ref: el => { fieldRefs.current[key] = el; },
    'aria-invalid': errors[key] ? 'true' : undefined,
    onChange: e => onChange(key, e.target.value)
  });
  const err = key => <span className="err">{errors[key]}</span>;
  const star = <span className="req">*</span>;

  return (
    <form className="panel" noValidate onSubmit={e => { e.preventDefault(); onSubmit(); }}>
      <div className="panel-head">
        <h2 ref={headingRef} tabIndex={-1}>Your details</h2>
        <p className="hint">We use these to prepare your rate sheet. Fields marked * are required.</p>
      </div>
      <div className="grid2">
        <label className="field"><span>Full name {star}</span><input type="text" autoComplete="name" {...bind('contact')} />{err('contact')}</label>
        <label className="field"><span>Company name {star}</span><input type="text" autoComplete="organization" {...bind('company')} />{err('company')}</label>
        <label className="field"><span>Work email {star}</span><input type="email" autoComplete="email" placeholder="name@company.com" {...bind('email')} />{err('email')}</label>
        <label className="field"><span>Phone {star}</span><input type="tel" autoComplete="tel" placeholder="+91 98xxx xxxxx" {...bind('phone')} />{err('phone')}</label>
        <label className="field"><span>Designation</span><input type="text" placeholder="e.g. Head of Collections" {...bind('role')} /></label>
        <label className="field"><span>City</span><input type="text" autoComplete="address-level2" {...bind('city')} /></label>
        <label className="field"><span>Industry {star}</span>
          <select {...bind('industry')}>
            <option value="">Select your industry</option>
            {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>{err('industry')}
        </label>
        <label className="field"><span>Company size</span>
          <select {...bind('size')}>{SIZES.map(s => <option key={s}>{s}</option>)}</select>
        </label>
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={e => onChange('website', e.target.value)} />
      </div>
      <p className="consent">By continuing, you agree that DubCall may contact you about this enquiry.</p>
      <div className="nav"><span></span><button type="submit" className="primary">Next: requirements</button></div>
    </form>
  );
}
