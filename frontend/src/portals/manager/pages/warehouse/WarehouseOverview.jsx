import { useState } from 'react';
import { MetricBox } from './components';
import { WarehouseInventoryTable } from './WarehouseInventoryTable';

const filterOptions = [
  ['ALL', 'Tất cả'],
  ['AVAILABLE', 'Còn hàng'],
  ['LOW', 'Sắp hết'],
  ['OUT', 'Hết hàng'],
];

function WarehouseOverviewMetrics({ products, variants, getProductStock }) {
  const availableCount = variants.filter((variant) => variant.status === 'AVAILABLE').length;
  const needRestockCount = products.filter((product) => getProductStock(product.id) < 6).length;

  return (
    <div className="admin-metrics admin-metrics--three warehouse-overview-metrics">
      <MetricBox label="Tổng tồn kho" value={variants.length} hint="Mỗi sản phẩm vật lý có một mã riêng" />
      <MetricBox label="Có thể bán" value={availableCount} hint="Đang còn trong kho" tone="success" />
      <MetricBox label="Cần nhập thêm" value={needRestockCount} hint="Sắp hết hoặc hết hàng" tone="warning" />
    </div>
  );
}

export function WarehouseOverview({ navigate, products = [], variants = [] }) {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serialQuery, setSerialQuery] = useState('');

  const getProductVariants = (productId) => variants.filter((variant) => variant.productId === productId);
  const getProductStock = (productId) =>
    getProductVariants(productId).filter((variant) => variant.status === 'AVAILABLE').length;
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

  const toggleProduct = (productId) => {
    setExpandedProduct((current) => current === productId ? null : productId);
  };

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>QUẢN LÝ TỒN KHO</p>
          <h2>Tổng quan kho hàng</h2>
        </div>
        <button className="admin-button admin-button--secondary" onClick={() => navigate('/manager/products')}>
          Quản lý sản phẩm →
        </button>
      </div>

      {products.length > 0 && (
        <>
          <WarehouseOverviewMetrics
            products={products}
            variants={variants}
            getProductStock={getProductStock}
          />

          <article className="admin-card">
            <div className="warehouse-overview-controls">
              <div className="admin-filterbar">
                {filterOptions.map(([key, label]) => (
                  <button
                    key={key}
                    className={`admin-filter ${statusFilter === key ? 'is-active' : ''}`}
                    onClick={() => setStatusFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="warehouse-serial-search">
                <span>Tìm trong kho</span>
                <input
                  value={serialQuery}
                  onChange={(event) => setSerialQuery(event.target.value)}
                  placeholder="Nhập mã máy, mã hoặc tên sản phẩm"
                />
              </label>
            </div>

            <WarehouseInventoryTable
              products={visibleProducts}
              expandedProduct={expandedProduct}
              normalizedQuery={normalizedQuery}
              getProductVariants={getProductVariants}
              getProductStock={getProductStock}
              getInventoryStatus={getInventoryStatus}
              onToggleProduct={toggleProduct}
              onViewProduct={() => navigate('/manager/products')}
            />
          </article>
        </>
      )}
    </>
  );
}
