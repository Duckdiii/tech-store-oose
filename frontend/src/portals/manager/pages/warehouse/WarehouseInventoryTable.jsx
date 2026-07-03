import { Fragment } from 'react';

const containerStyle = {
  padding: '20px',
  backgroundColor: '#fff',
  border: '1px solid #e7e9ed',
  borderRadius: '13px',
};

const tableHeaderStyle = {
  backgroundColor: '#f8f9fa',
  fontWeight: '700',
  color: '#64748b',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.85px',
};

const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN');

function getVariantGroupStatus(quantity) {
  if (quantity === 0) return { label: 'Hết hàng', tone: 'danger' };
  if (quantity <= 5) return { label: 'Sắp hết', tone: 'warning' };
  return { label: 'Còn hàng', tone: 'success' };
}

function groupVariants(variants) {
  const groups = new Map();
  variants.forEach((variant) => {
    const key = [variant.ramGb, variant.storageGb, variant.color, variant.price].join('|');
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        ramGb: variant.ramGb,
        storageGb: variant.storageGb,
        color: variant.color,
        price: variant.price,
        quantity: 0,
        units: [],
      });
    }
    const group = groups.get(key);
    group.units.push(variant);
    if (String(variant.status).toLowerCase() === 'available') {
      group.quantity += 1;
    }
  });
  return Array.from(groups.values());
}

function VariantGroupRows({ groups }) {
  if (groups.length === 0) {
    return (
      <tr>
        <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
          Không có biến thể phù hợp
        </td>
      </tr>
    );
  }

  return groups.map((group) => {
    const status = getVariantGroupStatus(group.quantity);
    return (
      <tr key={group.key} style={{ borderTop: '1px solid #eee', fontSize: '12px' }}>
        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>{group.ramGb} GB</td>
        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>{group.storageGb} GB</td>
        <td style={{ padding: '10px 12px', color: '#475569' }}>{group.color}</td>
        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#172033' }}>
          {formatMoney(group.price)}đ
        </td>
        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '700', color: group.quantity <= 5 ? '#dc2626' : '#172033' }}>
          {group.quantity}
        </td>
        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
          <span className={`admin-status admin-status--${status.tone}`}>{status.label}</span>
        </td>
      </tr>
    );
  });
}

function ProductVariantDetail({ variants, normalizedQuery }) {
  const groups = groupVariants(variants);
  const displayedGroups = normalizedQuery
    ? groups.filter((group) => group.units.some((unit) => unit.id.toLowerCase().includes(normalizedQuery)))
    : groups;

  return (
    <tr style={{ animation: 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards', borderTop: '1px solid #e7e9ed' }}>
      <td colSpan="6" style={{ padding: '20px 12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: 0 }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'center' }}>RAM</th>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'center' }}>Bộ nhớ</th>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'left' }}>Màu sắc</th>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'right' }}>Giá bán</th>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'center' }}>Số lượng</th>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'center' }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <VariantGroupRows groups={displayedGroups} />
          </tbody>
        </table>
      </td>
    </tr>
  );
}

export function WarehouseInventoryTable({
  products,
  expandedProduct,
  normalizedQuery,
  getProductVariants,
  getProductStock,
  getInventoryStatus,
  onToggleProduct,
  onViewProduct,
}) {
  return (
    <div style={containerStyle}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: '50px', padding: '10px 12px', textAlign: 'center' }} />
            <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'left' }}>Sản phẩm</th>
            <th style={{ ...tableHeaderStyle, width: '120px', padding: '10px 12px', textAlign: 'center' }}>Có thể bán</th>
            <th style={{ ...tableHeaderStyle, width: '110px', padding: '10px 12px', textAlign: 'center' }} title="Tổng số máy đã từng nhập kho, gồm cả đã bán">Đã nhập</th>
            <th style={{ ...tableHeaderStyle, width: '110px', padding: '10px 12px', textAlign: 'center' }}>Trạng thái</th>
            <th style={{ ...tableHeaderStyle, width: '90px', padding: '10px 12px', textAlign: 'right' }} />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const productVariants = getProductVariants(product.id);
            const stock = getProductStock(product.id);
            const productStatus = getInventoryStatus(product.id);
            const isExpanded = expandedProduct === product.id;

            return (
              <Fragment key={product.id}>
                <tr
                  className="warehouse-product-row"
                  style={{ borderTop: '1px solid #f0f1f3', transition: 'background-color 0.2s' }}
                  onClick={() => onToggleProduct(product.id)}
                >
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleProduct(product.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '4px',
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      {isExpanded ? '⌄' : '›'}
                    </button>
                  </td>
                  <td style={{ padding: '12px', color: '#172033' }}>
                    <b style={{ display: 'block', marginBottom: '4px' }}>{product.name}</b>
                    <small style={{ color: '#94a3b8', fontSize: '10px' }}>{product.id}</small>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: stock < 6 ? '#dc2626' : '#172033', fontWeight: '700' }}>{stock}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#475569' }}>{productVariants.length}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span className={`admin-status admin-status--${productStatus.tone}`}>{productStatus.label}</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      className="admin-row-action"
                      onClick={(event) => {
                        event.stopPropagation();
                        onViewProduct(product);
                      }}
                    >
                      Xem sản phẩm
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <ProductVariantDetail
                    variants={productVariants}
                    normalizedQuery={normalizedQuery}
                  />
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
