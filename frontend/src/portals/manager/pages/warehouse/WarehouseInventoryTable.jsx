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

function VariantRows({ variants }) {
  if (variants.length === 0) {
    return (
      <tr>
        <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
          Không có mã máy phù hợp
        </td>
      </tr>
    );
  }

  return variants.map((variant) => {
    const isAvailable = String(variant.status).toLowerCase() === 'available';
    return (
      <tr key={variant.id} style={{ borderTop: '1px solid #eee', fontSize: '12px' }}>
        <td style={{ padding: '10px 12px', fontWeight: '600', color: '#172033' }}>{variant.id}</td>
        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>{variant.ramGb} GB</td>
        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>{variant.storageGb} GB</td>
        <td style={{ padding: '10px 12px', color: '#475569' }}>{variant.color}</td>
        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#172033' }}>
          {formatMoney(variant.price)}đ
        </td>
        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
          <span className={`admin-status admin-status--${isAvailable ? 'success' : 'danger'}`}>
            {isAvailable ? 'Có sẵn' : 'Đã bán'}
          </span>
        </td>
      </tr>
    );
  });
}

function ProductVariantDetail({ product, variants, normalizedQuery }) {
  const displayedVariants = normalizedQuery
    ? variants.filter((variant) => variant.id.toLowerCase().includes(normalizedQuery))
    : variants;

  return (
    <tr style={{ animation: 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards', borderTop: '1px solid #e7e9ed' }}>
      <td colSpan="6" style={{ padding: '20px 12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: 0 }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'left' }}>Mã máy</th>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'center' }}>RAM</th>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'center' }}>Bộ nhớ</th>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'left' }}>Màu sắc</th>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'right' }}>Giá bán</th>
              <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'center' }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <VariantRows product={product} variants={displayedVariants} />
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
            <th style={{ ...tableHeaderStyle, width: '110px', padding: '10px 12px', textAlign: 'center' }}>Tổng kho</th>
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
                  <td style={{ padding: '12px', textAlign: 'center', color: '#172033', fontWeight: '700' }}>{stock}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#475569' }}>{productVariants.length}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span className={`admin-status admin-status--${productStatus.tone}`}>{productStatus.label}</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      className="admin-row-action"
                      onClick={(event) => {
                        event.stopPropagation();
                        onViewProduct();
                      }}
                    >
                      Xem sản phẩm
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <ProductVariantDetail
                    product={product}
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
