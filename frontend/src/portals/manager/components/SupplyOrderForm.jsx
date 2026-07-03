import { useState } from 'react';
import { Spinner } from './index';

const ERR_STYLE = { color: '#ef4444', fontSize: 11, marginTop: 3, display: 'block', fontWeight: 500 };
const errInput = (hasErr) => hasErr ? { borderColor: '#ef4444', background: '#fff5f5' } : {};

const REQUIRED_FIELDS_MSG = 'Please fill in all required fields';
const NO_ITEMS_MSG = 'Please add at least one product to the order';
const INVALID_QTY_PRICE_MSG = 'Quantity and unit price must be greater than zero';
const INVALID_DATE_MSG = 'Expected delivery date must be in the future';

const blankItem = () => ({ productId: '', productVariantId: '', quantity: '', unitPrice: '' });

const todayIso = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const variantLabel = (variant) =>
  [variant.ramGb ? `${variant.ramGb}GB RAM` : '', variant.storageGb ? `${variant.storageGb}GB` : '', variant.color || '']
    .filter(Boolean).join(' / ') || variant.id;

export function SupplyOrderForm({ suppliers = [], products = [], variants = [], onSave, onClose }) {
  const [supplierId, setSupplierId] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([blankItem()]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const updateItem = (index, patch) => {
    setItems((current) => current.map((item, i) => i === index ? { ...item, ...patch } : item));
  };

  const addItem = () => setItems((current) => [...current, blankItem()]);
  const removeItem = (index) => setItems((current) => current.filter((_, i) => i !== index));

  const itemErrors = items.map((item) => {
    if (!item.productVariantId) return REQUIRED_FIELDS_MSG;
    if (Number(item.quantity) <= 0 || Number(item.unitPrice) <= 0) return INVALID_QTY_PRICE_MSG;
    return '';
  });

  const errors = {
    supplierId: !supplierId ? REQUIRED_FIELDS_MSG : '',
    orderDate: !orderDate ? REQUIRED_FIELDS_MSG : (orderDate <= todayIso() ? INVALID_DATE_MSG : ''),
    items: items.length === 0 ? NO_ITEMS_MSG : (itemErrors.find(Boolean) || ''),
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError('');
    if (hasErrors) {
      setFormError(errors.items || errors.supplierId || errors.orderDate);
      return;
    }
    setLoading(true);
    try {
      await onSave({
        supplierId,
        orderDate,
        notes: notes.trim() || null,
        items: items.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__head">
          <h2>Tạo đơn nhập hàng</h2>
          <button className="admin-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label className="admin-field">
              Nhà cung cấp *
              <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} style={errInput(submitted && errors.supplierId)}>
                <option value="">Chọn nhà cung cấp</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
              {submitted && errors.supplierId && <span style={ERR_STYLE}>{errors.supplierId}</span>}
            </label>
            <label className="admin-field">
              Ngày dự kiến giao *
              <input
                type="date"
                value={orderDate}
                min={todayIso()}
                onChange={(e) => setOrderDate(e.target.value)}
                style={errInput(submitted && errors.orderDate)}
              />
              {submitted && errors.orderDate && <span style={ERR_STYLE}>{errors.orderDate}</span>}
            </label>
            <label className="admin-field admin-field--wide">
              Ghi chú
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ghi chú cho đơn nhập hàng" />
            </label>
          </div>

          <div className="admin-modal__actions" style={{ justifyContent: 'space-between', marginTop: 4, marginBottom: 8 }}>
            <b>Danh sách sản phẩm</b>
            <button type="button" className="admin-button admin-button--secondary" onClick={addItem}>+ Thêm sản phẩm</button>
          </div>

          {items.map((item, index) => {
            const productVariants = variants.filter((v) => v.productId === item.productId);
            return (
              <div key={index} className="admin-form-grid" style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                <label className="admin-field">
                  Sản phẩm
                  <select
                    value={item.productId}
                    onChange={(e) => updateItem(index, { productId: e.target.value, productVariantId: '' })}
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </label>
                <label className="admin-field">
                  Phiên bản *
                  <select
                    value={item.productVariantId}
                    onChange={(e) => updateItem(index, { productVariantId: e.target.value })}
                    disabled={!item.productId}
                    style={errInput(submitted && !item.productVariantId)}
                  >
                    <option value="">Chọn phiên bản</option>
                    {productVariants.map((variant) => (
                      <option key={variant.id} value={variant.id}>{variantLabel(variant)}</option>
                    ))}
                  </select>
                </label>
                <label className="admin-field">
                  Số lượng *
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, { quantity: e.target.value })}
                    style={errInput(submitted && Number(item.quantity) <= 0)}
                  />
                </label>
                <label className="admin-field">
                  Đơn giá (VND) *
                  <input
                    type="number"
                    min="1"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, { unitPrice: e.target.value })}
                    style={errInput(submitted && Number(item.unitPrice) <= 0)}
                  />
                </label>
                {items.length > 1 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
                    <button type="button" className="admin-row-action admin-row-action--danger" onClick={() => removeItem(index)}>Xóa dòng</button>
                  </div>
                )}
              </div>
            );
          })}

          {submitted && formError && (
            <p style={{ ...ERR_STYLE, fontSize: 13, marginBottom: 10 }}>{formError}</p>
          )}

          <div className="admin-modal__actions">
            <button type="button" className="admin-button admin-button--secondary" onClick={onClose} disabled={loading}>Hủy</button>
            <button type="submit" className="admin-button" disabled={loading}>
              {loading ? <Spinner label="Đang tạo..." /> : 'Tạo đơn nhập hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
