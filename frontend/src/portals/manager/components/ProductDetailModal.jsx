import { DataTable } from './index';

const detailValue = (value, fallback = 'Chưa cập nhật') => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  return value;
};

export function ProductDetailModal({ product, onClose }) {
  const imageRows = Array.isArray(product.images) ? product.images : [];
  const specs = [
    ['Mã sản phẩm', product.id],
    ['Tên sản phẩm', product.name],
    ['Thương hiệu', product.brand],
    ['Danh mục', product.category],
    ['Màn hình', product.screenSize ? `${product.screenSize} inch` : null],
    ['Độ phân giải', product.screenResolution],
    ['Camera sau', product.rearCamera],
    ['Camera trước', product.frontCamera],
    ['Chipset', product.chipset],
    ['Dung lượng pin', product.batteryCapacity ? `${product.batteryCapacity} mAh` : null],
    ['SIM', product.simType],
    ['Hệ điều hành', product.operatingSystem],
    ['NFC', product.nfcSupported],
  ];

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="admin-modal admin-modal--wide" onMouseDown={(event) => event.stopPropagation()}>
        <div className="admin-modal__head">
          <div>
            <p>THÔNG TIN SẢN PHẨM · {product.id}</p>
            <h2>{product.name}</h2>
            <span className="admin-modal__description">{product.description || 'Chưa có mô tả'}</span>
          </div>
          <button type="button" className="admin-close" onClick={onClose}>×</button>
        </div>

        <DataTable columns={['Thông tin', 'Giá trị']}>
          {specs.map(([label, value]) => (
            <tr key={label}>
              <td style={{ width: 220, color: '#64748b', fontWeight: 700 }}>{label}</td>
              <td><b>{detailValue(value)}</b></td>
            </tr>
          ))}
        </DataTable>

        <div className="admin-modal__toolbar" style={{ marginTop: 16 }}>
          <span>Hình ảnh dùng để hiển thị ở trang chi tiết sản phẩm phía khách hàng.</span>
        </div>
        <DataTable columns={['Tên ảnh', 'URL']}>
          {imageRows.length ? imageRows.map((image, index) => (
            <tr key={image.id || image.imageUrl || index}>
              <td><b>{image.name || `Ảnh ${index + 1}`}</b></td>
              <td style={{ wordBreak: 'break-all' }}>{image.imageUrl || image.url || 'Chưa cập nhật'}</td>
            </tr>
          )) : <tr><td colSpan="2" className="admin-table-empty">Chưa có hình ảnh sản phẩm.</td></tr>}
        </DataTable>
      </section>
    </div>
  );
}
