import { useState } from 'react';
import { Spinner } from './index';

const ERR_STYLE = { color: '#ef4444', fontSize: 11, marginTop: 3, display: 'block', fontWeight: 500 };
const errInput = (hasErr) => hasErr ? { borderColor: '#ef4444', background: '#fff5f5' } : {};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{8,15}$/;

const toForm = (supplier) => ({
  id: supplier?.id,
  name: supplier?.name || '',
  email: supplier?.email || '',
  phone: supplier?.phone || '',
  address: supplier?.address || '',
});

export function SupplierForm({ supplier, onSave, onClose }) {
  const [form, setForm] = useState(() => toForm(supplier));
  const [touched, setTouched] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const touch = (key) => setTouched((prev) => new Set(prev).add(key));

  const errors = {
    name: !form.name.trim() ? 'Please fill in all required fields' : '',
    email: form.email.trim() && !EMAIL_RE.test(form.email.trim()) ? 'Email không hợp lệ' : '',
    phone: form.phone.trim() && !PHONE_RE.test(form.phone.trim()) ? 'Số điện thoại không hợp lệ' : '',
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const showErr = (key) => (submitted || touched.has(key)) && errors[key];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) return;
    setLoading(true);
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__head">
          <h2>{supplier ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp mới'}</h2>
          <button className="admin-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label className="admin-field admin-field--wide">
              Tên nhà cung cấp *
              <input
                type="text"
                autoFocus
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                onBlur={() => touch('name')}
                style={errInput(showErr('name'))}
                placeholder="Công ty TNHH ABC"
              />
              {showErr('name') && <span style={ERR_STYLE}>{errors.name}</span>}
            </label>
            <label className="admin-field">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                onBlur={() => touch('email')}
                style={errInput(showErr('email'))}
                placeholder="lienhe@abc.com"
              />
              {showErr('email') && <span style={ERR_STYLE}>{errors.email}</span>}
            </label>
            <label className="admin-field">
              Số điện thoại
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                onBlur={() => touch('phone')}
                style={errInput(showErr('phone'))}
                placeholder="0901 234 567"
              />
              {showErr('phone') && <span style={ERR_STYLE}>{errors.phone}</span>}
            </label>
            <label className="admin-field admin-field--wide">
              Địa chỉ
              <input
                type="text"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
              />
            </label>
          </div>
          <div className="admin-modal__actions">
            <button type="button" className="admin-button admin-button--secondary" onClick={onClose} disabled={loading}>Hủy</button>
            <button type="submit" className="admin-button" disabled={loading}>
              {loading ? <Spinner label="Đang lưu..." /> : (supplier ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
