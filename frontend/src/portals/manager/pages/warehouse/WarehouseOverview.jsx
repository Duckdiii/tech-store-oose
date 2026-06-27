import { useState } from 'react';
import { MetricBox } from './components';

export function WarehouseOverview({ navigate, products = [], variants = [] }) {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serialQuery, setSerialQuery] = useState('');
  const getProductVariants = (productId) => variants.filter((v) => v.productId === productId);
  const getProductStock = (productId) => getProductVariants(productId).filter((v) => v.status === 'AVAILABLE').length;
  const getInventoryStatus = (productId) => {
    const stock = getProductStock(productId);
    if (stock === 0) return { label: 'Hết hàng', tone: 'danger' };
    if (stock < 6) return { label: 'Sắp hết', tone: 'warning' };
    return { label: 'Đủ hàng', tone: 'success' };
  };
  const normalizedQuery = serialQuery.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const productVariants = getProductVariants(product.id);
    const stock = getProductStock(product.id);
    const statusMatch = statusFilter === 'ALL'
      || (statusFilter === 'AVAILABLE' && stock > 0)
      || (statusFilter === 'LOW' && stock > 0 && stock < 6)
      || (statusFilter === 'OUT' && stock === 0);
    const queryMatch = !normalizedQuery
      || product.name.toLowerCase().includes(normalizedQuery)
      || product.id.toLowerCase().includes(normalizedQuery)
      || productVariants.some((variant) => variant.id.toLowerCase().includes(normalizedQuery));
    return statusMatch && queryMatch;
  });

  const containerStyle = { padding: '20px', backgroundColor: '#fff', border: '1px solid #e7e9ed', borderRadius: '13px' };
  const tableHeaderStyle = { backgroundColor: '#f8f9fa', fontWeight: '700', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.85px' };

  return <>
    <div className="admin-page-intro"><div><p>QUẢN LÝ TỒN KHO</p><h2>Tổng quan kho hàng</h2></div><button className="admin-button admin-button--secondary" onClick={() => navigate('/manager/products')}>Quản lý sản phẩm →</button></div>
    {products.length > 0 ? (
      <><div className="admin-metrics admin-metrics--three warehouse-overview-metrics">
        <MetricBox label="Tổng tồn kho" value={variants.length} hint="Mỗi sản phẩm vật lý có một mã riêng" />
        <MetricBox label="Có thể bán" value={variants.filter((variant) => variant.status === 'AVAILABLE').length} hint="Đang còn trong kho" tone="success" />
        <MetricBox label="Cần nhập thêm" value={products.filter((product) => getProductStock(product.id) < 6).length} hint="Sắp hết hoặc hết hàng" tone="danger" />
      </div><article className="admin-card">
        <div className="warehouse-overview-controls">
          <div className="admin-filterbar">{[['ALL', 'Tất cả'], ['AVAILABLE', 'Còn hàng'], ['LOW', 'Sắp hết'], ['OUT', 'Hết hàng']].map(([key, label]) => <button key={key} className={`admin-filter ${statusFilter === key ? 'is-active' : ''}`} onClick={() => setStatusFilter(key)}>{label}</button>)}</div>
          <label className="warehouse-serial-search"><span>Tìm trong kho</span><input value={serialQuery} onChange={(event) => setSerialQuery(event.target.value)} placeholder="Nhập mã máy, mã hoặc tên sản phẩm" /></label>
        </div>
        <div style={containerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, width: '50px', padding: '10px 12px', textAlign: 'center' }}></th>
                <th style={{ ...tableHeaderStyle, padding: '10px 12px', textAlign: 'left' }}>Sản phẩm</th>
                <th style={{ ...tableHeaderStyle, width: '120px', padding: '10px 12px', textAlign: 'center' }}>Có thể bán</th>
                <th style={{ ...tableHeaderStyle, width: '110px', padding: '10px 12px', textAlign: 'center' }}>Tổng kho</th>
                <th style={{ ...tableHeaderStyle, width: '110px', padding: '10px 12px', textAlign: 'center' }}>Trạng thái</th>
                <th style={{ ...tableHeaderStyle, width: '90px', padding: '10px 12px', textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => {
                const productVariants = getProductVariants(product.id);
                const stock = getProductStock(product.id);
                const productStatus = getInventoryStatus(product.id);
                const isExpanded = expandedProduct === product.id;
                const displayedVariants = normalizedQuery ? productVariants.filter((variant) => variant.id.toLowerCase().includes(normalizedQuery)) : productVariants;
                return (
                  <>
                    <tr key={product.id} className="warehouse-product-row" style={{ borderTop: '1px solid #f0f1f3', transition: 'background-color 0.2s' }} onClick={() => setExpandedProduct(isExpanded ? null : product.id)}>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button onClick={(event) => { event.stopPropagation(); setExpandedProduct(isExpanded ? null : product.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          {isExpanded ? '⌄' : '›'}
                        </button>
                      </td>
                      <td style={{ padding: '12px', color: '#172033' }}><b style={{ display: 'block', marginBottom: '4px' }}>{product.name}</b><small style={{ color: '#94a3b8', fontSize: '10px' }}>{product.id}</small></td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#172033', fontWeight: '700' }}>{stock}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#475569' }}>{productVariants.length}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}><span className={`admin-status admin-status--${productStatus.tone}`}>{productStatus.label}</span></td>
                      <td style={{ padding: '12px', textAlign: 'right' }}><button className="admin-row-action" onClick={(event) => { event.stopPropagation(); navigate('/manager/products'); }}>Xem sản phẩm</button></td>
                    </tr>
                    {isExpanded && (
                      <tr key={`details-${product.id}`} style={{ animation: 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards', borderTop: '1px solid #e7e9ed' }}>
                        <td colSpan="6" style={{ padding: '20px 12px' }}>
                          <div style={{ overflowX: 'auto' }}>
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
                                {displayedVariants.length > 0 ? displayedVariants.map((variant) => {
                                  const isAvailable = String(variant.status).toLowerCase() === 'available';
                                  return (
                                    <tr key={variant.id} style={{ borderTop: '1px solid #eee', fontSize: '12px' }}>
                                      <td style={{ padding: '10px 12px', fontWeight: '600', color: '#172033' }}>{variant.id}</td>
                                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>{variant.ramGb} GB</td>
                                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>{variant.storageGb} GB</td>
                                      <td style={{ padding: '10px 12px', color: '#475569' }}>{variant.color}</td>
                                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#172033' }}>{variant.price.toLocaleString('vi-VN')}đ</td>
                                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                        <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', backgroundColor: isAvailable ? '#d4edda' : '#fff1f0', color: isAvailable ? '#155724' : '#9b1c1c', border: isAvailable ? '1px solid rgba(21,87,36,0.08)' : '1px solid rgba(139, 18, 18, 0.06)' }}>
                                          {isAvailable ? 'Có sẵn' : 'Đã bán'}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                }) : (
                                  <tr><td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Không có mã máy phù hợp</td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </article></>
    ) : null}
  </>;
}
