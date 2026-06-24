import { useState, useRef } from 'react';
import { money } from '../utils';

export function Status({ children }) {
  const key = String(children).toLowerCase();
  const tone = key.includes('hoàn') || key.includes('đang bán') || key.includes('đang giao') || key.includes('active')
    ? 'success' : key.includes('chờ') || key.includes('sắp') ? 'warning' : 'danger';
  return <span className={`admin-status admin-status--${tone}`}>{children}</span>;
}

export function Metric({ label, value, hint, tone = 'dark', delta }) {
  const hasDelta = delta !== null && delta !== undefined;
  return <article className="admin-metric">
    <div className={`admin-metric__mark admin-metric__mark--${tone}`} />
    <p>{label}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
      <strong>{value}</strong>
      {hasDelta && (
        <span style={{
          fontSize: 12, fontWeight: 700, lineHeight: 1,
          color: delta >= 0 ? '#16a34a' : '#dc2626',
        }}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
        </span>
      )}
    </div>
    <small>{hint}</small>
  </article>;
}

export function DataTable({ columns, sortKey, sortDir, onSort, children }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col, i) => {
              if (col !== null && typeof col === 'object') {
                const { label, key } = col;
                const isSortable = !!key && key !== '__check' && !!onSort;
                const isActive = sortKey === key;
                return (
                  <th key={key || i} onClick={isSortable ? () => onSort(key) : undefined}
                    style={isSortable ? { cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' } : undefined}>
                    {label}
                    {isSortable && (
                      <span style={{ marginLeft: 5, fontSize: 9, color: isActive ? '#0d1117' : '#d1d5db' }}>
                        {isActive ? (sortDir === 'asc' ? '↑' : '↓') : '⇅'}
                      </span>
                    )}
                  </th>
                );
              }
              return <th key={typeof col === 'string' ? (col || `__col_${i}`) : i}>{col}</th>;
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

const ERR_STYLE  = { color: '#ef4444', fontSize: 11, marginTop: 3, display: 'block', fontWeight: 500 };
const errInput   = (hasErr) => hasErr ? { borderColor: '#ef4444', background: '#fff5f5' } : {};
const SPIN_STYLE = { width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', display: 'inline-block', animation: 'admin-spin 0.7s linear infinite' };

export function Spinner({ label }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={SPIN_STYLE} />{label}</span>;
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

export function ProductForm({ product, onSave, onClose }) {
  const INIT = { name: '', brand: 'Apple', category: 'Điện thoại', description: '', ...(product || {}) };
  const initRef = useRef(INIT);
  const [form,           setForm]           = useState(INIT);
  const [touched,        setTouched]        = useState(new Set());
  const [submitted,      setSubmitted]      = useState(false);
  const [discardConfirm, setDiscardConfirm] = useState(false);
  const [loading,        setLoading]        = useState(false);

  const update = (key, value) => setForm((c) => ({ ...c, [key]: value }));
  const touch  = (key) => setTouched((prev) => new Set(prev).add(key));

  const isDirty = JSON.stringify(form) !== JSON.stringify(initRef.current);

  const errors = {
    name: !form.name.trim() ? 'Vui lòng nhập tên sản phẩm' : '',
  };

  const showErr = (key) => (submitted || touched.has(key)) && errors[key];

  const handleClose = () => { if (loading) return; isDirty ? setDiscardConfirm(true) : onClose(); };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.name) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    onSave({ ...form, name: form.name.trim(), description: form.description.trim() });
  };

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={handleClose}>
      <form className="admin-modal" style={{ position: 'relative' }} onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
        {discardConfirm && <DiscardOverlay onStay={() => setDiscardConfirm(false)} onDiscard={onClose} />}
        <div className="admin-modal__head">
          <div><p>Danh mục sản phẩm</p><h2>{product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2></div>
          <button type="button" className="admin-close" onClick={handleClose}>×</button>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field admin-field--wide">
            Tên sản phẩm *
            <input autoFocus value={form.name}
              onChange={(e) => update('name', e.target.value)}
              onBlur={() => touch('name')}
              style={errInput(showErr('name'))}
              placeholder="Ví dụ: iPhone 16 Pro" />
            {showErr('name') && <span style={ERR_STYLE}>{errors.name}</span>}
          </label>
          <label className="admin-field">
            Thương hiệu
            <select value={form.brand} onChange={(e) => update('brand', e.target.value)}>
              {['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo'].map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <label className="admin-field">
            Danh mục
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {['Điện thoại', 'Laptop', 'Máy tính bảng', 'Phụ kiện'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="admin-field admin-field--wide">
            Mô tả
            <textarea rows="3" value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Mô tả ngắn về Product" />
          </label>
        </div>
        <div className="admin-modal__actions">
          <button type="button" className="admin-button admin-button--secondary" onClick={handleClose} disabled={loading}>Hủy</button>
          <button className="admin-button" type="submit" disabled={loading}>
            {loading ? <Spinner label="Đang lưu..." /> : 'Lưu sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function VariantForm({ product, variant, onSave, onClose }) {
  const [form, setForm] = useState(variant || { id: '', ramGb: 8, storageGb: 128, color: '', price: '', status: 'AVAILABLE' });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.id.trim() || !form.color.trim() || !form.price) return;
    onSave({ ...form, id: form.id.trim().toUpperCase(), productId: product.id, ramGb: Number(form.ramGb), storageGb: Number(form.storageGb), price: Number(form.price) });
  };
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
    <form className="admin-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
      <div className="admin-modal__head"><div><p>PHIÊN BẢN SẢN PHẨM · {product.id}</p><h2>{variant ? 'Cập nhật phiên bản' : 'Thêm phiên bản mới'}</h2></div><button type="button" className="admin-close" onClick={onClose}>×</button></div>
      <div className="admin-form-grid">
        <label className="admin-field admin-field--wide">Serial ID<input autoFocus disabled={Boolean(variant)} value={form.id} onChange={(event) => update('id', event.target.value)} placeholder="VD: IP16PM-001" /></label>
        <label className="admin-field">RAM (GB)<input type="number" min="0" value={form.ramGb} onChange={(event) => update('ramGb', event.target.value)} /></label>
        <label className="admin-field">Bộ nhớ (GB)<input type="number" min="0" value={form.storageGb} onChange={(event) => update('storageGb', event.target.value)} /></label>
        <label className="admin-field">Màu sắc<input value={form.color} onChange={(event) => update('color', event.target.value)} placeholder="VD: Titanium Blue" /></label>
        <label className="admin-field">Giá bán<input type="number" min="1" value={form.price} onChange={(event) => update('price', event.target.value)} placeholder="0" /></label>
        <label className="admin-field">Trạng thái<select value={form.status} onChange={(event) => update('status', event.target.value)}><option value="AVAILABLE">AVAILABLE</option><option value="EXPORTED">EXPORTED</option><option value="HOLD">HOLD</option></select></label>
      </div>
      <div className="admin-modal__actions"><button type="button" className="admin-button admin-button--secondary" onClick={onClose}>Hủy</button><button className="admin-button" type="submit">Lưu phiên bản</button></div>
    </form>
  </div>;
}

export function VariantManager({ product, variants, onAdd, onEdit, onDelete, onClose }) {
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="admin-modal admin-modal--wide" onMouseDown={(event) => event.stopPropagation()}>
      <div className="admin-modal__head"><div><p>PHIÊN BẢN SẢN PHẨM · {product.id}</p><h2>{product.name}</h2><span className="admin-modal__description">{product.description || 'Chưa có mô tả'} · {variants.length} phiên bản</span></div><button type="button" className="admin-close" onClick={onClose}>×</button></div>
      <div className="admin-modal__toolbar"><span>Mỗi serial là một sản phẩm vật lý trong kho.</span><button className="admin-button" onClick={onAdd}>+ Thêm phiên bản</button></div>
      <DataTable columns={['Serial ID', 'RAM', 'Bộ nhớ', 'Màu sắc', 'Giá bán', 'Trạng thái', '']}>{variants.length ? variants.map((variant) => {
        const isAvailable = String(variant.status).toLowerCase() === 'available';
        return (<tr key={variant.id}><td><b>{variant.id}</b></td><td>{variant.ramGb} GB</td><td>{variant.storageGb} GB</td><td>{variant.color}</td><td><b>{money(variant.price)}</b></td><td><Status>{isAvailable ? 'Có sẵn' : 'Đã bán'}</Status></td><td><div className="admin-row-actions"><button className="admin-row-action" onClick={() => onEdit(variant)}>Sửa</button><button className="admin-row-action admin-row-action--danger" onClick={() => onDelete(variant.id)}>Xóa</button></div></td></tr>);
      }) : <tr><td colSpan="7" className="admin-table-empty">Chưa có phiên bản. Thêm serial để quản lý tồn kho.</td></tr>}</DataTable>
    </section>
  </div>;
}

export function StaffForm({ onSave, onClose }) {
  const INIT = { name: '', email: '', phone: '', staffCode: '', hireDate: '', initialPassword: '', role: 'Staff' };
  const initRef = useRef(INIT);
  const [form,           setForm]           = useState(INIT);
  const [touched,        setTouched]        = useState(new Set());
  const [submitted,      setSubmitted]      = useState(false);
  const [discardConfirm, setDiscardConfirm] = useState(false);
  const [loading,        setLoading]        = useState(false);

  const update = (key, value) => setForm((c) => ({ ...c, [key]: value }));
  const touch  = (key) => setTouched((prev) => new Set(prev).add(key));

  const isDirty = JSON.stringify(form) !== JSON.stringify(initRef.current);

  const errors = {
    name:            !form.name.trim()            ? 'Vui lòng nhập họ và tên' : '',
    email:           !form.email.trim()           ? 'Vui lòng nhập email'
                   : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Email không hợp lệ' : '',
    phone:           !form.phone.trim()           ? 'Vui lòng nhập số điện thoại' : '',
    staffCode:       !form.staffCode.trim()       ? 'Vui lòng nhập mã nhân viên' : '',
    hireDate:        !form.hireDate               ? 'Vui lòng chọn ngày vào làm' : '',
    initialPassword: !form.initialPassword.trim() ? 'Vui lòng nhập mật khẩu'
                   : form.initialPassword.length < 6 ? 'Mật khẩu tối thiểu 6 ký tự' : '',
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const showErr   = (key) => (submitted || touched.has(key)) && errors[key];

  const handleClose = () => { if (loading) return; isDirty ? setDiscardConfirm(true) : onClose(); };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    onSave(form);
  };

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={handleClose}>
      <form className="admin-modal" style={{ position: 'relative' }} onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
        {discardConfirm && <DiscardOverlay onStay={() => setDiscardConfirm(false)} onDiscard={onClose} />}
        <div className="admin-modal__head">
          <div><p>Nhân sự</p><h2>Thêm nhân viên mới</h2></div>
          <button type="button" className="admin-close" onClick={handleClose}>×</button>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field admin-field--wide">
            Họ và tên *
            <input autoFocus value={form.name}
              onChange={(e) => update('name', e.target.value)}
              onBlur={() => touch('name')}
              style={errInput(showErr('name'))}
              placeholder="Nguyễn Văn A" />
            {showErr('name') && <span style={ERR_STYLE}>{errors.name}</span>}
          </label>
          <label className="admin-field">
            Email công việc *
            <input type="email" value={form.email}
              onChange={(e) => update('email', e.target.value)}
              onBlur={() => touch('email')}
              style={errInput(showErr('email'))}
              placeholder="nhanvien@techstore.vn" />
            {showErr('email') && <span style={ERR_STYLE}>{errors.email}</span>}
          </label>
          <label className="admin-field">
            Số điện thoại *
            <input type="tel" value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              onBlur={() => touch('phone')}
              style={errInput(showErr('phone'))}
              placeholder="0901 234 567" />
            {showErr('phone') && <span style={ERR_STYLE}>{errors.phone}</span>}
          </label>
          <label className="admin-field">
            Mã nhân viên *
            <input value={form.staffCode}
              onChange={(e) => update('staffCode', e.target.value)}
              onBlur={() => touch('staffCode')}
              style={errInput(showErr('staffCode'))}
              placeholder="TS-STF-004" />
            {showErr('staffCode') && <span style={ERR_STYLE}>{errors.staffCode}</span>}
          </label>
          <label className="admin-field">
            Ngày vào làm *
            <input type="date" value={form.hireDate}
              onChange={(e) => update('hireDate', e.target.value)}
              onBlur={() => touch('hireDate')}
              style={errInput(showErr('hireDate'))} />
            {showErr('hireDate') && <span style={ERR_STYLE}>{errors.hireDate}</span>}
          </label>
          <label className="admin-field">
            Vai trò
            <select value={form.role} onChange={(e) => update('role', e.target.value)}>
              <option>Staff</option>
              <option>Manager</option>
            </select>
          </label>
          <label className="admin-field admin-field--wide">
            Mật khẩu khởi tạo *
            <input type="password" value={form.initialPassword}
              onChange={(e) => update('initialPassword', e.target.value)}
              onBlur={() => touch('initialPassword')}
              style={errInput(showErr('initialPassword'))}
              placeholder="Tối thiểu 6 ký tự" />
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
