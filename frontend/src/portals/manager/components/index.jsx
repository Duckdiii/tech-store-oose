import { useRef, useState } from 'react';

export function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', minWidth: 360, maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0d1117', margin: '0 0 10px' }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="admin-button admin-button--secondary" onClick={onClose}>Hủy</button>
          <button
            className="admin-button"
            style={danger ? { background: '#ef4444', color: '#fff' } : {}}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Status({ children }) {
  const key = String(children).toLowerCase();
  const tone = key.includes('hoàn') || key.includes('đang bán') || key.includes('đang giao') || key.includes('active')
    ? 'success'
    : key.includes('chờ') || key.includes('sắp')
      ? 'warning'
      : 'danger';
  return <span className={`admin-status admin-status--${tone}`}>{children}</span>;
}

export function Metric({ label, value, hint, tone = 'dark', delta, deltaTooltip }) {
  const hasDelta = delta !== null && delta !== undefined;
  return (
    <article className="admin-metric">
      <div className={`admin-metric__mark admin-metric__mark--${tone}`} />
      <p>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <strong>{value}</strong>
        {hasDelta && (
          <span
            title={deltaTooltip}
            style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, color: delta >= 0 ? '#16a34a' : '#dc2626', cursor: deltaTooltip ? 'help' : 'default' }}
          >
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
          </span>
        )}
      </div>
      <small>{hint}</small>
    </article>
  );
}

export function DataTable({ columns, sortKey, sortDir, onSort, children }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col, index) => {
              if (col !== null && typeof col === 'object') {
                const { label, key } = col;
                const isSortable = !!key && key !== '__check' && !!onSort;
                const isActive = sortKey === key;
                return (
                  <th
                    key={key || index}
                    onClick={isSortable ? () => onSort(key) : undefined}
                    style={isSortable ? { cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' } : undefined}
                  >
                    {label}
                    {isSortable && (
                      <span style={{ marginLeft: 5, fontSize: 9, color: isActive ? '#0d1117' : '#d1d5db' }}>
                        {isActive ? (sortDir === 'asc' ? '↑' : '↓') : '⇅'}
                      </span>
                    )}
                  </th>
                );
              }
              return <th key={typeof col === 'string' ? (col || `__col_${index}`) : index}>{col}</th>;
            })}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function EmptyState({ message, hint, actionLabel, onAction }) {
  return (
    <tr>
      <td colSpan={99} style={{ padding: '48px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>{message}</p>
        {hint && <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 14px' }}>{hint}</p>}
        {actionLabel && onAction && (
          <button className="admin-button admin-button--secondary" style={{ fontSize: 12 }} onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </td>
    </tr>
  );
}

const ERR_STYLE = { color: '#ef4444', fontSize: 11, marginTop: 3, display: 'block', fontWeight: 500 };
const errInput = (hasErr) => hasErr ? { borderColor: '#ef4444', background: '#fff5f5' } : {};
const SPIN_STYLE = { width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', display: 'inline-block', animation: 'admin-spin 0.7s linear infinite' };

export function Spinner({ label }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={SPIN_STYLE} />{label}</span>;
}

export function Skeleton({ width = '100%', height = 13, radius = 6, style }) {
  return <span className="admin-skeleton" style={{ width, height, borderRadius: radius, ...style }} />;
}

// Placeholder <tr> rows for a table body while its data is still loading.
// Bar widths vary slightly per row/column so the block doesn't look like a flat grid.
export function SkeletonTableRows({ columns = 5, rows = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} aria-hidden="true">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex}>
              <Skeleton width={colIndex === 0 ? '75%' : `${45 + ((rowIndex + colIndex) % 4) * 12}%`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function SkeletonMetricCard({ tone = 'dark' }) {
  return (
    <article className="admin-metric" aria-hidden="true">
      <div className={`admin-metric__mark admin-metric__mark--${tone}`} />
      <Skeleton width={92} height={11} style={{ marginBottom: 11 }} />
      <Skeleton width={72} height={22} style={{ marginBottom: 10 }} />
      <Skeleton width={120} height={10} />
    </article>
  );
}

const CHART_SKELETON_HEIGHTS = [55, 78, 40, 88, 62, 48, 72, 36, 66, 52, 82, 45];

export function SkeletonChart() {
  return (
    <div className="admin-chart" aria-hidden="true">
      {CHART_SKELETON_HEIGHTS.map((height, i) => (
        <div key={i} className="admin-chart__item">
          <Skeleton width="100%" height={`${height}%`} radius={4} style={{ maxWidth: 28 }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDonut() {
  return (
    <div aria-hidden="true">
      <Skeleton width={145} height={145} radius="50%" style={{ margin: '9px auto 18px' }} />
      <div style={{ display: 'grid', gap: 9 }}>
        {[1, 2, 3].map((i) => <Skeleton key={i} width={`${80 - i * 12}%`} height={11} />)}
      </div>
    </div>
  );
}

// Generic vertical stack of shimmer bars, used for list/card content whose exact
// shape doesn't need a dedicated skeleton (rankings, breakdowns, recovery points...).
export function SkeletonLines({ count = 3 }) {
  return (
    <div aria-hidden="true" style={{ display: 'grid', gap: 12, padding: '4px 0' }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} width={`${88 - (i % 4) * 10}%`} height={13} />
      ))}
    </div>
  );
}

function DiscardOverlay({ onStay, onDiscard }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.97)', borderRadius: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10, textAlign: 'center' }}>
      <span style={{ fontSize: 32 }}>⚠</span>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0d1117', margin: 0 }}>Có thay đổi chưa lưu</h3>
      <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Nếu thoát bây giờ, dữ liệu bạn đã nhập sẽ bị mất.</p>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="admin-button admin-button--secondary" onClick={onStay}>Tiếp tục chỉnh sửa</button>
        <button className="admin-button" style={{ background: '#ef4444', color: '#fff' }} onClick={onDiscard}>Thoát và hủy</button>
      </div>
    </div>
  );
}

export function StaffForm({ onSave, onClose }) {
  const INIT = { name: '', email: '', phone: '', staffCode: '', hireDate: '', initialPassword: '' };
  const initRef = useRef(INIT);
  const [form, setForm] = useState(INIT);
  const [touched, setTouched] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [discardConfirm, setDiscardConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const touch = (key) => setTouched((prev) => new Set(prev).add(key));

  const isDirty = JSON.stringify(form) !== JSON.stringify(initRef.current);

  const errors = {
    name: !form.name.trim() ? 'Vui lòng nhập họ và tên' : '',
    email: !form.email.trim()
      ? 'Vui lòng nhập email'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ? 'Email không hợp lệ'
        : '',
    phone: !form.phone.trim()
      ? 'Vui lòng nhập số điện thoại'
      : !/^(0|\+84)[0-9]{9,10}$/.test(form.phone.trim())
        ? 'Số điện thoại không hợp lệ (vd: 0901234567)'
        : '',
    staffCode: !form.staffCode.trim() ? 'Vui lòng nhập mã nhân viên' : '',
    hireDate: !form.hireDate ? 'Vui lòng chọn ngày vào làm' : '',
    initialPassword: !form.initialPassword.trim()
      ? 'Vui lòng nhập mật khẩu'
      : form.initialPassword.length < 8
        ? 'Mật khẩu tối thiểu 8 ký tự'
        : '',
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const showErr = (key) => (submitted || touched.has(key)) && errors[key];

  const handleClose = () => {
    if (loading) return;
    if (isDirty) setDiscardConfirm(true);
    else onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors) return;
    setLoading(true);
    try {
      await onSave(form);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={handleClose}>
      <form className="admin-modal" style={{ position: 'relative' }} onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        {discardConfirm && <DiscardOverlay onStay={() => setDiscardConfirm(false)} onDiscard={onClose} />}
        <div className="admin-modal__head">
          <div><p>Nhân sự</p><h2>Thêm nhân viên mới</h2></div>
          <button type="button" className="admin-close" onClick={handleClose}>×</button>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field admin-field--wide">
            Họ và tên *
            <input autoFocus value={form.name} onChange={(event) => update('name', event.target.value)} onBlur={() => touch('name')} style={errInput(showErr('name'))} placeholder="Nguyễn Văn A" />
            {showErr('name') && <span style={ERR_STYLE}>{errors.name}</span>}
          </label>
          <label className="admin-field">
            Email công việc *
            <input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} onBlur={() => touch('email')} style={errInput(showErr('email'))} placeholder="nhanvien@techstore.vn" />
            {showErr('email') && <span style={ERR_STYLE}>{errors.email}</span>}
          </label>
          <label className="admin-field">
            Số điện thoại *
            <input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} onBlur={() => touch('phone')} style={errInput(showErr('phone'))} placeholder="0901 234 567" />
            {showErr('phone') && <span style={ERR_STYLE}>{errors.phone}</span>}
          </label>
          <label className="admin-field">
            Mã nhân viên *
            <input value={form.staffCode} onChange={(event) => update('staffCode', event.target.value)} onBlur={() => touch('staffCode')} style={errInput(showErr('staffCode'))} placeholder="TS-STF-004" />
            {showErr('staffCode') && <span style={ERR_STYLE}>{errors.staffCode}</span>}
          </label>
          <label className="admin-field">
            Ngày vào làm *
            <input type="date" value={form.hireDate} onChange={(event) => update('hireDate', event.target.value)} onBlur={() => touch('hireDate')} style={errInput(showErr('hireDate'))} />
            {showErr('hireDate') && <span style={ERR_STYLE}>{errors.hireDate}</span>}
          </label>
          <label className="admin-field admin-field--wide">
            Mật khẩu khởi tạo *
            <input type="password" value={form.initialPassword} onChange={(event) => update('initialPassword', event.target.value)} onBlur={() => touch('initialPassword')} style={errInput(showErr('initialPassword'))} placeholder="Tối thiểu 8 ký tự" />
            {showErr('initialPassword') && <span style={ERR_STYLE}>{errors.initialPassword}</span>}
          </label>
        </div>
        <div className="admin-modal__actions">
          <button type="button" className="admin-button admin-button--secondary" onClick={handleClose} disabled={loading}>Hủy</button>
          <button className="admin-button" type="submit" disabled={loading}>
            {loading ? <Spinner label="Đang lưu..." /> : 'Tạo nhân viên'}
          </button>
        </div>
      </form>
    </div>
  );
}
