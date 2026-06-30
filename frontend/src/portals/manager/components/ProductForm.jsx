import { useRef, useState } from 'react';
import { Spinner } from './index';

const ERR_STYLE = { color: '#ef4444', fontSize: 11, marginTop: 3, display: 'block', fontWeight: 500 };
const errInput = (hasErr) => hasErr ? { borderColor: '#ef4444', background: '#fff5f5' } : {};

const PRODUCT_DEFAULTS = {
  name: '',
  brand: 'Apple',
  category: 'Điện thoại',
  description: '',
  screenSize: '',
  screenResolution: '',
  rearCamera: '',
  frontCamera: '',
  chipset: '',
  batteryCapacity: '',
  simType: '',
  operatingSystem: '',
  nfcSupported: '',
  imagesText: '',
};

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

const textValue = (value) => value === null || value === undefined ? '' : String(value);
const optionalNumber = (value) => value === '' || value === null || value === undefined ? null : Number(value);
const invalidPositiveNumber = (value) => value !== '' && (!Number.isFinite(Number(value)) || Number(value) <= 0);
const optionalText = (value) => {
  const trimmed = textValue(value).trim();
  return trimmed || null;
};

const productToForm = (product) => {
  const imagesText = product?.imagesText
    ?? (Array.isArray(product?.images)
      ? product.images.map((image) => image.imageUrl || image.url || '').filter(Boolean).join('\n')
      : '');

  return {
    ...PRODUCT_DEFAULTS,
    ...(product || {}),
    screenSize: textValue(product?.screenSize),
    batteryCapacity: textValue(product?.batteryCapacity),
    nfcSupported: product?.nfcSupported === true ? 'true' : product?.nfcSupported === false ? 'false' : '',
    imagesText,
  };
};

const imageRowsFromText = (imagesText, productId, productName) =>
  textValue(imagesText)
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean)
    .map((imageUrl, index) => ({
      id: `${productId || 'PRODUCT'}-IMG-${index + 1}`,
      name: `${productName || 'Product'} image ${index + 1}`,
      imageUrl,
    }));

export function ProductForm({ product, onSave, onClose }) {
  const INIT = productToForm(product);
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
    name: !form.name.trim() ? 'Vui lòng nhập tên sản phẩm' : '',
    screenSize: invalidPositiveNumber(form.screenSize) ? 'Kích thước màn hình phải lớn hơn 0' : '',
    batteryCapacity: invalidPositiveNumber(form.batteryCapacity) ? 'Dung lượng pin phải lớn hơn 0' : '',
  };

  const showErr = (key) => (submitted || touched.has(key)) && errors[key];

  const handleClose = () => {
    if (loading) return;
    if (isDirty) setDiscardConfirm(true);
    else onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    const productName = form.name.trim();
    try {
      await onSave({
        ...form,
        name: productName,
        description: optionalText(form.description),
        screenSize: optionalNumber(form.screenSize),
        screenResolution: optionalText(form.screenResolution),
        rearCamera: optionalText(form.rearCamera),
        frontCamera: optionalText(form.frontCamera),
        chipset: optionalText(form.chipset),
        nfcSupported: form.nfcSupported === '' ? null : form.nfcSupported === 'true',
        batteryCapacity: optionalNumber(form.batteryCapacity),
        simType: optionalText(form.simType),
        operatingSystem: optionalText(form.operatingSystem),
        images: imageRowsFromText(form.imagesText, form.id, productName),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={handleClose}>
      <form className="admin-modal admin-modal--wide" style={{ position: 'relative', maxHeight: '92vh', overflowY: 'auto' }} onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        {discardConfirm && <DiscardOverlay onStay={() => setDiscardConfirm(false)} onDiscard={onClose} />}
        <div className="admin-modal__head">
          <div><p>Danh mục sản phẩm</p><h2>{product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2></div>
          <button type="button" className="admin-close" onClick={handleClose}>×</button>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field admin-field--wide">
            Tên sản phẩm *
            <input autoFocus value={form.name} onChange={(event) => update('name', event.target.value)} onBlur={() => touch('name')} style={errInput(showErr('name'))} placeholder="Ví dụ: iPhone 16 Pro" />
            {showErr('name') && <span style={ERR_STYLE}>{errors.name}</span>}
          </label>
          <label className="admin-field">
            Thương hiệu
            <select value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value, brandId: null }))}>
              {['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo'].map((brand) => <option key={brand}>{brand}</option>)}
            </select>
          </label>
          <label className="admin-field">
            Danh mục
            <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value, categoryId: null }))}>
              {['Điện thoại', 'Laptop', 'Máy tính bảng', 'Phụ kiện'].map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="admin-field admin-field--wide">
            Mô tả
            <textarea rows="3" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Mô tả ngắn về sản phẩm" />
          </label>
          <label className="admin-field">
            Kích thước màn hình (inch)
            <input type="number" min="0" step="0.1" value={form.screenSize} onChange={(event) => update('screenSize', event.target.value)} onBlur={() => touch('screenSize')} style={errInput(showErr('screenSize'))} placeholder="VD: 6.7" />
            {showErr('screenSize') && <span style={ERR_STYLE}>{errors.screenSize}</span>}
          </label>
          <label className="admin-field">
            Độ phân giải màn hình
            <input value={form.screenResolution} onChange={(event) => update('screenResolution', event.target.value)} placeholder="VD: 1290 x 2796 pixels" />
          </label>
          <label className="admin-field">
            Camera sau
            <input value={form.rearCamera} onChange={(event) => update('rearCamera', event.target.value)} placeholder="VD: 48MP + 12MP + 12MP" />
          </label>
          <label className="admin-field">
            Camera trước
            <input value={form.frontCamera} onChange={(event) => update('frontCamera', event.target.value)} placeholder="VD: 12MP" />
          </label>
          <label className="admin-field">
            Chipset
            <input value={form.chipset} onChange={(event) => update('chipset', event.target.value)} placeholder="VD: Apple A17 Pro" />
          </label>
          <label className="admin-field">
            Dung lượng pin (mAh)
            <input type="number" min="0" value={form.batteryCapacity} onChange={(event) => update('batteryCapacity', event.target.value)} onBlur={() => touch('batteryCapacity')} style={errInput(showErr('batteryCapacity'))} placeholder="VD: 4422" />
            {showErr('batteryCapacity') && <span style={ERR_STYLE}>{errors.batteryCapacity}</span>}
          </label>
          <label className="admin-field">
            SIM
            <input value={form.simType} onChange={(event) => update('simType', event.target.value)} placeholder="VD: Nano SIM + eSIM" />
          </label>
          <label className="admin-field">
            Hệ điều hành
            <input value={form.operatingSystem} onChange={(event) => update('operatingSystem', event.target.value)} placeholder="VD: iOS 17" />
          </label>
          <label className="admin-field">
            NFC
            <select value={form.nfcSupported} onChange={(event) => update('nfcSupported', event.target.value)}>
              <option value="">Chưa cập nhật</option>
              <option value="true">Có hỗ trợ</option>
              <option value="false">Không hỗ trợ</option>
            </select>
          </label>
          <label className="admin-field admin-field--wide">
            Hình ảnh sản phẩm
            <textarea rows="3" value={form.imagesText} onChange={(event) => update('imagesText', event.target.value)} placeholder="Mỗi dòng một image URL, dùng để hiển thị ở trang chi tiết sản phẩm" />
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
