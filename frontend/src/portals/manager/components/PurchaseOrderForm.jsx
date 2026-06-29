import { useState, useMemo } from 'react';
import { money } from '../utils';

export function PurchaseOrderForm({ suppliers, products, onSave, onClose }) {
  const [form, setForm] = useState({ supplierId: '', items: [] });
  const [loading, setLoading] = useState(false);

  // Filter products that have at least one variant, or just use products directly.
  // Assuming 'products' here is an array of products, we just use their ids and names.
  
  const addItem = () => {
    setForm({ ...form, items: [...form.items, { productId: '', quantity: 1, price: 0 }] });
  };

  const updateItem = (index, key, value) => {
    const newItems = [...form.items];
    newItems[index][key] = value;
    setForm({ ...form, items: newItems });
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplierId || form.items.length === 0) return;
    setLoading(true);
    try {
      await onSave({
        supplierId: form.supplierId,
        items: form.items.map(item => ({
          productId: item.productId,
          quantity: parseInt(item.quantity, 10),
          price: parseFloat(item.price)
        }))
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = useMemo(() => {
    return form.items.reduce((acc, item) => acc + (item.quantity * item.price || 0), 0);
  }, [form.items]);

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__head">
          <h2>Tạo đơn nhập hàng</h2>
          <button className="admin-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid" style={{ marginBottom: 20 }}>
            <label className="admin-field admin-field--wide">
              Nhà cung cấp *
              <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} required>
                <option value="">-- Chọn nhà cung cấp --</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14 }}>Danh sách sản phẩm</h3>
            <button type="button" className="admin-button admin-button--secondary" style={{ padding: '5px 10px', fontSize: 11 }} onClick={addItem}>+ Thêm sản phẩm</button>
          </div>

          <div className="warehouse-item-list" style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 5 }}>
            {form.items.length === 0 ? (
              <div className="warehouse-empty" style={{ border: '1px dashed #dbe1e8', borderRadius: 8 }}>Chưa có sản phẩm nào</div>
            ) : form.items.map((item, idx) => (
              <div key={idx} className="warehouse-item" style={{ gridTemplateColumns: '1fr 100px 140px auto' }}>
                <label className="admin-field">
                  Sản phẩm
                  <select value={item.productId} onChange={(e) => updateItem(idx, 'productId', e.target.value)} required>
                    <option value="">-- Chọn SP --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </label>
                <label className="admin-field">
                  Số lượng
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} required />
                </label>
                <label className="admin-field">
                  Đơn giá
                  <input type="number" min="0" value={item.price} onChange={(e) => updateItem(idx, 'price', e.target.value)} required />
                </label>
                <button type="button" className="warehouse-remove" onClick={() => removeItem(idx)} style={{ alignSelf: 'flex-end', marginBottom: 5 }}>Xóa</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, textAlign: 'right', fontSize: 16 }}>
            Tổng tiền: <b>{money(totalAmount)}</b>
          </div>

          <div className="admin-modal__actions">
            <button type="button" className="admin-button admin-button--secondary" onClick={onClose} disabled={loading}>Hủy</button>
            <button type="submit" className="admin-button" disabled={loading || form.items.length === 0}>
              {loading ? 'Đang tạo...' : 'Tạo đơn nhập hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
