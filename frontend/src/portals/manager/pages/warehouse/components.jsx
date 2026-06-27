export function Field({ label, children, wide = false }) {
  return <label className={`admin-field ${wide ? 'admin-field--wide' : ''}`}>{label}{children}</label>;
}

export function ApiMessage({ error, success, children }) {
  if (!error && !success && !children) return null;
  return (
    <div className={`warehouse-message ${error ? 'warehouse-message--error' : 'warehouse-message--success'}`}>
      {error || success || children}
    </div>
  );
}

export function MetricBox({ label, value, hint, tone = 'default' }) {
  return (
    <article className={`warehouse-metric warehouse-metric--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  );
}
