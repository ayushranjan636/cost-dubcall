import { useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import DetailsForm, { validateDetails } from './components/DetailsForm.jsx';
import RequirementsForm from './components/RequirementsForm.jsx';
import RatesPanel from './components/RatesPanel.jsx';
import PlansAside from './components/PlansAside.jsx';
import { CRMS, INDUSTRIES, PLANS, SIZES, n, rateRows, tierFor } from './data.js';
import { sendLead } from './lead.js';

const EMPTY_DETAILS = { contact: '', company: '', email: '', phone: '', role: '', city: '', industry: '', size: SIZES[0], website: '' };

const toggle = (set, key) => {
  const next = new Set(set);
  next.has(key) ? next.delete(key) : next.add(key);
  return next;
};

export default function App() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState(EMPTY_DETAILS);
  const [errors, setErrors] = useState({});
  const [selected, setSelected] = useState(() => new Set());
  const [calls, setCalls] = useState('');
  const [salesMin, setSalesMin] = useState('');
  const [dir, setDir] = useState('Both');
  const [crm, setCrm] = useState(CRMS[0]);
  const [langs, setLangs] = useState(() => new Set(['Hindi', 'English']));
  const [status, setStatus] = useState('');

  const headingRef = useRef(null);
  const fieldRefs = useRef({});
  const mounted = useRef(false);

  // Move focus to the new page heading and scroll up whenever the step changes.
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; window.scrollTo(0, 0); return; }
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const callsN = n(calls);
  const tier = callsN ? tierFor(callsN) : null;
  const rows = rateRows(selected, tier, salesMin);

  const details = {
    contact: values.contact.trim(), company: values.company.trim(), email: values.email.trim(), phone: values.phone.trim(),
    role: values.role.trim(), city: values.city.trim(),
    industry: INDUSTRIES.find(i => i.value === values.industry)?.label ?? 'Select your industry',
    size: values.size, dir, crm, langs: [...langs].join(', ') || 'Not specified'
  };

  function leadPayload(stage) {
    const plan = tier ? PLANS[tier] : null;
    const r = selected.size ? rows : [];
    return {
      stage, website: values.website,
      name: details.contact, company: details.company, email: details.email, phone: details.phone,
      designation: details.role, city: details.city, industry: details.industry, companySize: details.size,
      callDirection: details.dir, crm: details.crm, languages: details.langs,
      useCases: r.map(x => x.u.name).join(', '),
      callsPerMonth: callsN || '', salesMinutesPerMonth: selected.has('sales') ? n(salesMin) || '' : '',
      plan: plan ? plan.name : '', planFee: plan ? plan.fee : '',
      rates: r.map(x => `${x.u.name}: Rs ${x.rate} ${x.unit}`).join(' | ')
    };
  }

  function changeDetail(key, value) {
    setValues(v => ({ ...v, [key]: value }));
    if (errors[key] && value) setErrors(e => ({ ...e, [key]: '' }));
  }

  function submitDetails() {
    const errs = validateDetails(values);
    setErrors(e => ({ ...e, ...errs }));
    const firstBad = Object.keys(errs).find(k => errs[k]);
    if (firstBad) { fieldRefs.current[firstBad]?.focus(); return; }
    sendLead(leadPayload('Details submitted'));
    setStep(2);
  }

  function submitRequirements() {
    const onlySales = selected.size === 1 && selected.has('sales');
    const uc = selected.size ? '' : 'Pick at least one use case.';
    const callsErr = onlySales || callsN > 0 ? '' : 'Enter your expected picked-up calls per month.';
    setErrors(e => ({ ...e, uc, calls: callsErr }));
    if (uc || callsErr) return;
    sendLead(leadPayload('Rates viewed'));
    setStep(3);
  }

  function toggleUseCase(id) {
    const next = toggle(selected, id);
    setSelected(next);
    if (next.size) setErrors(e => ({ ...e, uc: '' }));
  }

  function changeCalls(v) {
    setCalls(v);
    if (n(v)) setErrors(e => ({ ...e, calls: '' }));
  }

  async function downloadPdf() {
    let pdf;
    try {
      pdf = await import('./pdf.js'); // loaded on demand to keep the first page light
    } catch {
      setStatus('The PDF tool did not load. Check your connection and reload the page.');
      return;
    }
    try {
      const whiteLogo = await pdf.makeWhiteLogo('/logo.webp');
      pdf.downloadBlob(pdf.buildPdf({ details, calls: callsN, tier: tier || 'low', rows, whiteLogo }));
      setStatus('Rate sheet downloaded.');
      sendLead(leadPayload('PDF downloaded'));
    } catch (e) {
      console.error(e);
      setStatus('The PDF could not be built. Reload the page and try again.');
    }
  }

  return (
    <>
      <Header step={step} />
      <main className="wrap layout">
        <div>
          {step === 1 && (
            <DetailsForm values={values} errors={errors} onChange={changeDetail} onSubmit={submitDetails}
              headingRef={headingRef} fieldRefs={fieldRefs} />
          )}
          {step === 2 && (
            <RequirementsForm
              industry={values.industry} selected={selected} onToggleUseCase={toggleUseCase}
              calls={calls} onCalls={changeCalls} salesMin={salesMin} onSalesMin={setSalesMin}
              dir={dir} onDir={setDir} crm={crm} onCrm={setCrm}
              langs={langs} onToggleLang={l => setLangs(s => toggle(s, l))}
              errors={errors} onBack={() => setStep(1)} onSubmit={submitRequirements} headingRef={headingRef} />
          )}
          {step === 3 && (
            <RatesPanel details={details} calls={callsN} tier={tier || 'low'} rows={rows} status={status}
              onBack={() => setStep(2)} onDownload={downloadPdf} headingRef={headingRef} />
          )}
        </div>
        <PlansAside tier={tier} />
      </main>
    </>
  );
}
