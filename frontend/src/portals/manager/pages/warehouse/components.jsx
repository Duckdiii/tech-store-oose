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

export function MetricBox({ label, value, hint, tone = 'default', onClick, active = false }) {
  const clickable = typeof onClick === 'function';
  return (
    <article
      className={`warehouse-metric warehouse-metric--${tone}${clickable ? ' warehouse-metric--clickable' : ''}${active ? ' warehouse-metric--active' : ''}`}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  );
}
