import { formatMoney } from './utils';

const sameSerial = (left, right) => left.toLowerCase() === right.toLowerCase();

export function ExportProductList({
  products,
  variants,
  selectedSerials,
  expandedProduct,
  onToggleProduct,
  onToggleSerial,
}) {
  if (variants.length === 0) {
    return <div className="warehouse-export-empty">Không có sản phẩm còn hàng phù hợp bộ lọc hiện tại.</div>;
  }

  return (
    <div className="warehouse-export-grid">
      {products.map((product) => {
        const productVariants = variants.filter((variant) => variant.productId === product.id);
        const isExpanded = expandedProduct === product.id;
        if (productVariants.length === 0) return null;

        return (
          <article key={product.id} className="warehouse-export-product-card">
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                width: '100%',
                borderBottom: isExpanded ? '1px solid #edf1f5' : 'none',
              }}
              onClick={() => onToggleProduct(product.id)}
            >
              <div style={{ textAlign: 'left' }}>
                <b style={{ display: 'block', color: '#0d1117' }}>{product.name}</b>
                <small style={{ color: '#94a3b8', fontSize: '11px' }}>
                  {product.id} · {product.brand || 'Chưa cập nhật thương hiệu'}
                </small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span className="admin-status" style={{ whiteSpace: 'nowrap' }}>{productVariants.length} còn hàng</span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '900',
                  color: '#0d1117',
                  transition: 'transform 0.3s',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>
                  ⌄
                </span>
              </div>
            </button>

            {isExpanded && (
              <div className="warehouse-export-product-body">
                {productVariants.map((variant) => {
                  const checked = selectedSerials.some((serial) => sameSerial(serial, variant.id));
                  return (
                    <label key={variant.id} className="warehouse-export-serial-row">
                      <input type="checkbox" checked={checked} onChange={() => onToggleSerial(variant.id)} />
                      <div className="warehouse-export-serial-main">
                        <b>{variant.id}</b>
                        <small>{variant.ramGb} GB RAM · {variant.storageGb} GB · {variant.color}</small>
                      </div>
                      <div className="warehouse-export-serial-meta">{product.name}</div>
                      <div className="warehouse-export-serial-meta">Còn trong kho</div>
                      <div className="warehouse-export-serial-price">{formatMoney(variant.price)}đ</div>
                      <span className="admin-status admin-status--success">Có sẵn</span>
                    </label>
                  );
                })}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
