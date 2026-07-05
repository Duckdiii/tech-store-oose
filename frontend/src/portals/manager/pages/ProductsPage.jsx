import { useEffect, useState } from 'react';
import { ConfirmDialog, Status, DataTable, EmptyState, SkeletonTableRows } from '../components/index';
import { productApi } from '../../../api/productApi';

const FILTERS = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'ACTIVE', label: 'Đang bán' },
  { key: 'LOW', label: 'Sắp hết' },
  { key: 'HIDDEN', label: 'Tạm ẩn' },
];

const PAGE_SIZE = 10;

const getStock = (product) => Number(product.stock || 0);

const statusLabel = (product) => {
  const stock = getStock(product);
  return stock === 0 ? 'Tạm ẩn' : stock < 6 ? 'Sắp hết hàng' : 'Đang bán';
};

export function ProductsPage({ searchQuery = '', refreshToken, onAdd, onEdit, onViewDetails, onDelete }) {
  const [filterKey, setFilterKey] = useState('ALL');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [products, setProducts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterCounts, setFilterCounts] = useState({ ALL: 0, ACTIVE: 0, LOW: 0, HIDDEN: 0 });

  // Reset to first page whenever the active filter or search term changes.
  useEffect(() => {
    setPage(0);
  }, [filterKey, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await productApi.searchManagerCatalog({
          keyword: searchQuery || undefined,
          status: filterKey === 'ALL' ? undefined : filterKey,
          page,
          size: PAGE_SIZE,
          sort: `${sortKey},${sortDir}`,
        });
        setProducts(data.content || []);
        setTotalElements(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error('Failed to fetch manager product catalog', err);
        setProducts([]);
        setTotalElements(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [filterKey, searchQuery, page, sortKey, sortDir, refreshToken]);

  useEffect(() => {
    productApi.getManagerCatalogStatusCounts(searchQuery || undefined)
      .then((counts) => setFilterCounts({
        ALL: counts.all ?? 0,
        ACTIVE: counts.active ?? 0,
        LOW: counts.low ?? 0,
        HIDDEN: counts.hidden ?? 0,
      }))
      .catch((err) => console.error('Failed to fetch product status counts', err));
  }, [searchQuery, refreshToken]);

  const currentFilter = FILTERS.find((item) => item.key === filterKey) || FILTERS[0];
  const isFiltering = filterKey !== 'ALL';

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const columns = [
    { label: 'Sản phẩm', key: 'name' },
    { label: 'Thương hiệu', key: 'brand' },
    { label: 'Danh mục', key: 'category' },
    { label: 'Tồn kho', key: 'stock' },
    { label: 'Trạng thái', key: 'status' },
    '',
  ];

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>{totalElements} sản phẩm{isFiltering ? ` (đã lọc "${currentFilter.label}")` : ''}</p>
          <h2>Danh mục sản phẩm</h2>
        </div>
        <button className="admin-button" onClick={onAdd}>+ Thêm sản phẩm</button>
      </div>

      <article className="admin-card">
        <div className="admin-filterbar">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              className={`admin-filter ${filterKey === item.key ? 'is-active' : ''}`}
              onClick={() => setFilterKey(item.key)}
            >
              {item.label} ({filterCounts[item.key] ?? 0})
            </button>
          ))}
        </div>

        <DataTable columns={columns} sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
          {loading ? (
            <SkeletonTableRows columns={columns.length} />
          ) : products.length === 0 ? (
            <EmptyState
              message={isFiltering || searchQuery ? `Không có sản phẩm nào trong bộ lọc "${currentFilter.label}"` : 'Chưa có sản phẩm nào'}
              hint={isFiltering || searchQuery ? 'Thử chọn bộ lọc khác hoặc xem tất cả sản phẩm.' : 'Thêm sản phẩm đầu tiên để bắt đầu quản lý danh mục.'}
              actionLabel={isFiltering ? 'Xem tất cả' : '+ Thêm sản phẩm'}
              onAction={isFiltering ? () => setFilterKey('ALL') : onAdd}
            />
          ) : products.map((product) => {
            const thumbnailUrl = product.images?.[0]?.imageUrl || product.images?.[0]?.url;
            return (
              <tr key={product.id}>
                <td>
                  <div className="admin-product">
                    <span style={{ overflow: 'hidden', padding: 0 }}>
                      {thumbnailUrl
                        ? <img src={thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : (product.brand || product.name || '?').slice(0, 1)}
                    </span>
                    <div>
                      <b>{product.name}</b>
                      <small>{product.description ? 'Có mô tả sản phẩm' : 'Chưa có mô tả'}</small>
                    </div>
                  </div>
                </td>
                <td>{product.brand || '—'}</td>
                <td>{product.category || 'Chưa phân loại'}</td>
                <td className={getStock(product) < 6 ? 'admin-low-stock' : ''}>{getStock(product)}</td>
                <td><Status>{statusLabel(product)}</Status></td>
                <td>
                  <div className="admin-row-actions">
                    <button className="admin-row-action admin-row-action--primary" onClick={() => onViewDetails(product)}>
                      Chi tiết
                    </button>
                    <button className="admin-row-action" onClick={() => onEdit(product)}>Sửa</button>
                    <button className="admin-row-action admin-row-action--danger" onClick={() => setDeleteConfirm(product)}>Xóa</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </DataTable>

        {!loading && totalPages > 1 && (
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

      {deleteConfirm && (
        <ConfirmDialog
          title="Xóa sản phẩm?"
          message={`Bạn có chắc muốn xóa sản phẩm "${deleteConfirm.name}"? Hành động này không thể hoàn tác.`}
          confirmLabel="Xóa"
          danger
          onConfirm={() => onDelete(deleteConfirm.id)}
          onClose={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}
