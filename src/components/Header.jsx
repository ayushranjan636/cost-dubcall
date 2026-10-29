const STEPS = ['Your details', 'Requirements', 'Your rates'];

export default function Header({ step }) {
  return (
    <header className="wrap top">
      <div className="brand">
        <img className="logo" alt="DubCall" width="155" height="34" src="/logo.webp" />
        <span>AI Voice Employees</span>
      </div>
      <h1>Check your AI calling rates</h1>
      <p>Pay for results, not minutes. Tell us about your business and what you need, and see your plan and price per result. Banking, NBFC and insurance are our core, and every industry below is supported.</p>
      <ol className="progress">
        {STEPS.map((label, i) => {
          const s = i + 1;
          const cls = s === step ? 'on' : s < step ? 'done' : undefined;
          return (
            <li key={s} className={cls} aria-current={s === step ? 'step' : undefined}>
              <span className="dot">{s}</span>{label}
            </li>
          );
        })}
      </ol>
    </header>
  );
}
