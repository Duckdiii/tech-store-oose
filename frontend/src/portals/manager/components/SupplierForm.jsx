import { useState } from 'react';

export function SupplierForm({ supplier, onSave, onClose }) {
  const [form, setForm] = useState(supplier || { name: '', taxCode: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.taxCode) return;
    setLoading(true);
    try {
      await onSave(form);
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
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="admin-field admin-field--wide">
              Mã số thuế *
              <input type="text" value={form.taxCode} onChange={(e) => setForm({ ...form, taxCode: e.target.value })} required />
            </label>
          </div>
          <div className="admin-modal__actions">
            <button type="button" className="admin-button admin-button--secondary" onClick={onClose} disabled={loading}>Hủy</button>
            <button type="submit" className="admin-button" disabled={loading}>
              {loading ? 'Đang lưu...' : (supplier ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
