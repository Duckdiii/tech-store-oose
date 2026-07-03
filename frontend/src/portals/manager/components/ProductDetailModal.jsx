import { useState } from 'react';
import { DataTable, Status } from './index';
import { money } from '../utils';

const detailValue = (value, fallback = 'Chưa cập nhật') => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  return value;
};

const SPEC_GROUPS = [
  ['Màn hình', [
    ['Kích thước', (p) => (p.screenSize ? `${p.screenSize} inch` : null)],
    ['Độ phân giải', (p) => p.screenResolution],
  ]],
  ['Camera', [
    ['Camera sau', (p) => p.rearCamera],
    ['Camera trước', (p) => p.frontCamera],
  ]],
  ['Hiệu năng & pin', [
    ['Chipset', (p) => p.chipset],
    ['Dung lượng pin', (p) => (p.batteryCapacity ? `${p.batteryCapacity} mAh` : null)],
    ['Hệ điều hành', (p) => p.operatingSystem],
  ]],
  ['Kết nối', [
    ['SIM', (p) => p.simType],
    ['NFC', (p) => p.nfcSupported],
  ]],
];

function groupVariants(variants) {
  const groups = new Map();
  variants.forEach((variant) => {
    const key = [variant.ramGb, variant.storageGb, variant.color, variant.price].join('|');
    if (!groups.has(key)) {
      groups.set(key, { key, ramGb: variant.ramGb, storageGb: variant.storageGb, color: variant.color, price: variant.price, quantity: 0 });
    }
    if (String(variant.status).toLowerCase() === 'available') {
      groups.get(key).quantity += 1;
    }
  });
  return Array.from(groups.values());
}

function variantGroupStatus(quantity) {
  if (quantity === 0) return { label: 'Hết hàng', tone: 'danger' };
  if (quantity <= 5) return { label: 'Sắp hết', tone: 'warning' };
  return { label: 'Còn hàng', tone: 'success' };
}

export function ProductDetailModal({ product, variants = [], onClose, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const imageRows = Array.isArray(product.images) ? product.images : [];
  const variantGroups = groupVariants(variants);
  const coverImage = imageRows[0]?.imageUrl || imageRows[0]?.url;

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(product.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable (e.g. insecure context) — silently ignore
    }
  };

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="admin-modal admin-modal--wide" onMouseDown={(event) => event.stopPropagation()}>
        <div className="admin-modal__head">
          <div style={{ display: 'flex', gap: 14 }}>
            {coverImage && (
              <img
                src={coverImage}
                alt=""
                style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0, background: '#f1f5f9' }}
              />
            )}
            <div>
              <p>THÔNG TIN SẢN PHẨM</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2>{product.name}</h2>
                {product.status && <Status>{product.status}</Status>}
              </div>
              <button type="button" onClick={copyId} className="admin-id-copy">
                {product.id} <span aria-hidden="true">⧉</span>{copied ? ' Đã sao chép' : ''}
              </button>
              <span className="admin-modal__description">{product.description || 'Chưa có mô tả'}</span>
            </div>
          </div>
          <button type="button" className="admin-close" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          {product.brand && <span className="admin-tier">{product.brand}</span>}
          {product.category && <span className="admin-tier">{product.category}</span>}
        </div>

        <div className="admin-spec-groups">
          {SPEC_GROUPS.map(([title, fields]) => (
            <div key={title} className="admin-spec-group">
              <p>{title}</p>
              <div>
                {fields.map(([label, getter]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <b>{detailValue(getter(product))}</b>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="admin-modal__toolbar">
          <span>Biến thể ({variantGroups.length})</span>
        </div>
        <DataTable columns={['RAM', 'Bộ nhớ', 'Màu', 'Giá', 'Tồn kho', 'Trạng thái']}>
          {variantGroups.length ? variantGroups.map((group) => {
            const status = variantGroupStatus(group.quantity);
            return (
              <tr key={group.key}>
                <td>{group.ramGb ? `${group.ramGb} GB` : '—'}</td>
                <td>{group.storageGb ? `${group.storageGb} GB` : '—'}</td>
                <td>{group.color || '—'}</td>
                <td><b>{money(group.price || 0)}</b></td>
                <td>{group.quantity}</td>
                <td><span className={`admin-status admin-status--${status.tone}`}>{status.label}</span></td>
              </tr>
            );
          }) : <tr><td colSpan="6" className="admin-table-empty">Chưa có biến thể nào.</td></tr>}
        </DataTable>

        <div className="admin-modal__toolbar" style={{ marginTop: 18 }}>
          <span>Hình ảnh ({imageRows.length}){imageRows.length ? ' · Nhấn vào ảnh để xem lớn hơn' : ''}</span>
        </div>
        {imageRows.length ? (
          <div className="admin-image-grid">
            {imageRows.map((image, index) => {
              const url = image.imageUrl || image.url;
              return (
                <button
                  key={image.id || url || index}
                  type="button"
                  className="admin-image-thumb"
                  disabled={!url}
                  onClick={() => url && setLightboxImage({ url, name: image.name || `Ảnh ${index + 1}` })}
                >
                  {url
                    ? <img src={url} alt="" />
                    : <div className="admin-image-thumb__placeholder" />}
                  <p>{image.name || `Ảnh ${index + 1}`}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="admin-table-empty">Chưa có hình ảnh sản phẩm.</p>
        )}

        <div className="admin-modal__actions">
          {onDelete && <button type="button" className="admin-button admin-button--danger" onClick={onDelete}>Xóa</button>}
          {onEdit && <button type="button" className="admin-button admin-button--secondary" onClick={onEdit}>Sửa</button>}
          <button type="button" className="admin-button" onClick={onClose}>Đóng</button>
        </div>
      </section>

      {lightboxImage && (
        <div
          className="admin-lightbox"
          role="presentation"
          onMouseDown={(event) => { event.stopPropagation(); setLightboxImage(null); }}
        >
          <button type="button" className="admin-close admin-lightbox__close" onClick={() => setLightboxImage(null)}>×</button>
          <figure onMouseDown={(event) => event.stopPropagation()}>
            <img src={lightboxImage.url} alt={lightboxImage.name} />
            <figcaption>{lightboxImage.name}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
