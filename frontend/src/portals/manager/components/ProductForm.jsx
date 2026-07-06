import { useEffect, useRef, useState } from 'react';
import { Spinner } from './index';
import { productApi } from '../../../api/productApi';

const ERR_STYLE = { color: '#ef4444', fontSize: 11, marginTop: 3, display: 'block', fontWeight: 500 };
const errInput = (hasErr) => hasErr ? { borderColor: '#ef4444', background: '#fff5f5' } : {};

const EMPTY_SPEC_OPTIONS = {
  screenSizes: [],
  screenResolutions: [],
  rearCameras: [],
  frontCameras: [],
  chipsets: [],
  batteryCapacities: [],
  simTypes: [],
  operatingSystems: [],
};

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
  images: [],
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

const CHIP_MAX_VISIBLE = 6;

function SpecCheckboxField({ label, options, value, onChange, type = 'text', placeholder, error, onBlur }) {
  const [forcedCustom, setForcedCustom] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const stringOptions = (options || []).map((option) => String(option));
  const valueMatchesOption = value !== '' && stringOptions.includes(String(value));
  const customMode = forcedCustom !== null ? forcedCustom : (value !== '' && !valueMatchesOption);

  const hasOverflow = stringOptions.length > CHIP_MAX_VISIBLE;
  let visibleOptions = stringOptions;
  if (hasOverflow && !expanded) {
    visibleOptions = valueMatchesOption && !stringOptions.slice(0, CHIP_MAX_VISIBLE).includes(value)
      ? [value, ...stringOptions.filter((option) => option !== value).slice(0, CHIP_MAX_VISIBLE - 1)]
      : stringOptions.slice(0, CHIP_MAX_VISIBLE);
  }
  const hiddenCount = stringOptions.length - visibleOptions.length;

  const selectOption = (option) => {
    setForcedCustom(false);
    onChange(value === option ? '' : option);
  };

  const toggleCustom = () => {
    const next = !customMode;
    setForcedCustom(next);
    if (!next) onChange('');
  };

  const chipStyle = (selected, dashed) => dashed
    ? {
      padding: '5px 11px', borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.4,
      border: `1.5px dashed ${selected ? '#0d1117' : '#c4c9d4'}`,
      background: selected ? '#f4f5f7' : '#fff',
      color: '#374151',
    }
    : {
      padding: '5px 11px', borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.4,
      border: `1.5px solid ${selected ? '#0d1117' : '#e9ecef'}`,
      background: selected ? '#0d1117' : '#fff',
      color: selected ? '#fff' : '#374151',
    };

  return (
    <div className="admin-field admin-field--wide">
      {label}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 2 }}>
        {visibleOptions.map((option) => (
          <button type="button" key={option} onClick={() => selectOption(option)} style={chipStyle(!customMode && value === option)}>
            {option}
          </button>
        ))}
        {hasOverflow && (
          <button type="button" onClick={() => setExpanded((prev) => !prev)} style={{ ...chipStyle(false), color: '#6b7280', fontWeight: 700 }}>
            {expanded ? '– Thu gọn' : `+${hiddenCount} khác`}
          </button>
        )}
        <button type="button" onClick={toggleCustom} style={chipStyle(customMode, true)}>
          {customMode ? '✕ Tự nhập' : '+ Khác'}
        </button>
      </div>
      {customMode && (
        <input
          type={type}
          step={type === 'number' ? '0.1' : undefined}
          min={type === 'number' ? '0' : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          style={{ marginTop: 8, ...errInput(!!error) }}
        />
      )}
      {error && <span style={ERR_STYLE}>{error}</span>}
    </div>
  );
}

function ImageDropzone({ images, onChange }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) return;
    setUploading(true);
    setUploadError('');
    try {
      const uploaded = await productApi.uploadManagerProductImages(files);
      onChange([...images, ...uploaded]);
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => onChange(images.filter((_, i) => i !== index));

  return (
    <div className="admin-field admin-field--wide">
      Hình ảnh sản phẩm
      <div
        onDragOver={(event) => { event.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => { event.preventDefault(); setDragOver(false); handleFiles(event.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#0d1117' : '#e9ecef'}`, borderRadius: 10, padding: 20,
          textAlign: 'center', cursor: 'pointer', background: dragOver ? '#f4f5f7' : '#fafbfc',
        }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => { handleFiles(event.target.files); event.target.value = ''; }}
        />
        <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
          {uploading ? 'Đang tải ảnh lên...' : 'Kéo thả ảnh vào đây, hoặc bấm để chọn ảnh từ máy'}
        </p>
      </div>
      {uploadError && <span style={ERR_STYLE}>{uploadError}</span>}
      {images.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
          {images.map((image, index) => (
            <div key={`${image.imageUrl}-${index}`} style={{ position: 'relative', width: 84, height: 84, borderRadius: 8, overflow: 'hidden', border: '1.5px solid #e9ecef' }}>
              <img src={image.imageUrl} alt={image.name || `Ảnh ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => removeImage(index)}
                style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, cursor: 'pointer', lineHeight: '20px', padding: 0 }}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
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
  const images = Array.isArray(product?.images)
    ? product.images
        .map((image) => ({ name: image.name || '', imageUrl: image.imageUrl || image.url || '' }))
        .filter((image) => image.imageUrl)
    : [];

  return {
    ...PRODUCT_DEFAULTS,
    ...(product || {}),
    screenSize: textValue(product?.screenSize),
    batteryCapacity: textValue(product?.batteryCapacity),
    nfcSupported: product?.nfcSupported === true ? 'true' : product?.nfcSupported === false ? 'false' : '',
    images,
  };
};

export function ProductForm({ product, onSave, onClose }) {
  const INIT = productToForm(product);
  const initRef = useRef(INIT);
  const [form, setForm] = useState(INIT);
  const [touched, setTouched] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [discardConfirm, setDiscardConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [specOptions, setSpecOptions] = useState(EMPTY_SPEC_OPTIONS);

  useEffect(() => {
    let active = true;
    productApi.getManagerProductSpecOptions()
      .then((data) => { if (active) setSpecOptions({ ...EMPTY_SPEC_OPTIONS, ...data }); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

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
        images: form.images,
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
              {['Điện thoại'].map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="admin-field admin-field--wide">
            Mô tả
            <textarea rows="3" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Mô tả ngắn về sản phẩm" />
          </label>
          <SpecCheckboxField
            label="Kích thước màn hình (inch)"
            options={specOptions.screenSizes}
            value={form.screenSize}
            onChange={(value) => update('screenSize', value)}
            onBlur={() => touch('screenSize')}
            type="number"
            placeholder="VD: 6.7"
            error={showErr('screenSize') && errors.screenSize}
          />
          <SpecCheckboxField
            label="Độ phân giải màn hình"
            options={specOptions.screenResolutions}
            value={form.screenResolution}
            onChange={(value) => update('screenResolution', value)}
            placeholder="VD: 1290 x 2796 pixels"
          />
          <SpecCheckboxField
            label="Camera sau"
            options={specOptions.rearCameras}
            value={form.rearCamera}
            onChange={(value) => update('rearCamera', value)}
            placeholder="VD: 48MP + 12MP + 12MP"
          />
          <SpecCheckboxField
            label="Camera trước"
            options={specOptions.frontCameras}
            value={form.frontCamera}
            onChange={(value) => update('frontCamera', value)}
            placeholder="VD: 12MP"
          />
          <SpecCheckboxField
            label="Chipset"
            options={specOptions.chipsets}
            value={form.chipset}
            onChange={(value) => update('chipset', value)}
            placeholder="VD: Apple A17 Pro"
          />
          <SpecCheckboxField
            label="Dung lượng pin (mAh)"
            options={specOptions.batteryCapacities}
            value={form.batteryCapacity}
            onChange={(value) => update('batteryCapacity', value)}
            onBlur={() => touch('batteryCapacity')}
            type="number"
            placeholder="VD: 4422"
            error={showErr('batteryCapacity') && errors.batteryCapacity}
          />
          <SpecCheckboxField
            label="SIM"
            options={specOptions.simTypes}
            value={form.simType}
            onChange={(value) => update('simType', value)}
            placeholder="VD: Nano SIM + eSIM"
          />
          <SpecCheckboxField
            label="Hệ điều hành"
            options={specOptions.operatingSystems}
            value={form.operatingSystem}
            onChange={(value) => update('operatingSystem', value)}
            placeholder="VD: iOS 17"
          />
          <label className="admin-field">
            NFC
            <select value={form.nfcSupported} onChange={(event) => update('nfcSupported', event.target.value)}>
              <option value="">Chưa cập nhật</option>
              <option value="true">Có hỗ trợ</option>
              <option value="false">Không hỗ trợ</option>
            </select>
          </label>
          <ImageDropzone images={form.images} onChange={(images) => update('images', images)} />
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
