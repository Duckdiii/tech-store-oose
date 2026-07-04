import { useEffect, useState } from 'react';
import { MetricBox } from './components';
import { WarehouseInventoryTable } from './WarehouseInventoryTable';
import { searchWarehouseOverview } from '../../../../api/warehouseApi';

const PAGE_SIZE = 10;

const filterOptions = [
  ['ALL', 'Tất cả'],
  ['AVAILABLE', 'Còn hàng'],
  ['LOW', 'Sắp hết'],
  ['OUT', 'Hết hàng'],
];

function WarehouseOverviewMetrics({ products, variants, getProductStock, statusFilter, onFilterClick }) {
  const availableCount = variants.filter((variant) => variant.status === 'AVAILABLE').length;
  const outOfStockCount = products.filter((product) => getProductStock(product.id) === 0).length;
  const lowStockCount = products.filter((product) => {
    const stock = getProductStock(product.id);
    return stock > 0 && stock < 6;
  }).length;

  return (
    <div className="admin-metrics admin-metrics--three warehouse-overview-metrics">
      <MetricBox label="Tổng tồn kho" value={availableCount} hint="Số máy còn hàng, sẵn sàng bán" tone="success" />
      <MetricBox
        label="Cảnh báo"
        value={outOfStockCount}
        hint="Sản phẩm đã hết hàng"
        tone="danger"
        onClick={() => onFilterClick('OUT')}
        active={statusFilter === 'OUT'}
      />
      <MetricBox
        label="Cần nhập thêm"
        value={lowStockCount}
        hint="Sản phẩm sắp hết hàng"
        tone="warning"
        onClick={() => onFilterClick('LOW')}
        active={statusFilter === 'LOW'}
      />
    </div>
  );
}

export function WarehouseOverview({ navigate, products = [], variants = [], onOpenProduct }) {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serialQuery, setSerialQuery] = useState('');
  const [page, setPage] = useState(0);

  const [pageProducts, setPageProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [overviewLoading, setOverviewLoading] = useState(false);

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

  // Đổi bộ lọc/tìm kiếm thì quay lại trang đầu.
  useEffect(() => { setPage(0); }, [statusFilter, serialQuery]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setOverviewLoading(true);
      try {
        const data = await searchWarehouseOverview({
          keyword: serialQuery.trim() || undefined,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          page,
          size: PAGE_SIZE,
        });
        setPageProducts(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error('Failed to fetch warehouse overview', error);
        setPageProducts([]);
        setTotalPages(0);
      } finally {
        setOverviewLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, serialQuery, page]);

  const toggleProduct = (productId) => {
    setExpandedProduct((current) => current === productId ? null : productId);
  };

  const toggleStatusFilter = (key) => {
    setStatusFilter((current) => (current === key ? 'ALL' : key));
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
            statusFilter={statusFilter}
            onFilterClick={toggleStatusFilter}
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

            {overviewLoading ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '28px 0' }}>Đang tải danh sách kho...</p>
            ) : (
              <WarehouseInventoryTable
                products={pageProducts}
                expandedProduct={expandedProduct}
                normalizedQuery={normalizedQuery}
                getProductVariants={getProductVariants}
                getProductStock={getProductStock}
                getInventoryStatus={getInventoryStatus}
                onToggleProduct={toggleProduct}
                onViewProduct={(product) => (onOpenProduct ? onOpenProduct(product) : navigate('/manager/products'))}
              />
            )}

            {!overviewLoading && totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  className="admin-button admin-button--secondary"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  ‹ Trước
                </button>
                <span>Trang {page + 1} / {totalPages}</span>
                <button
                  className="admin-button admin-button--secondary"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Sau ›
                </button>
              </div>
            )}
          </article>
        </>
      )}
    </>
  );
}
