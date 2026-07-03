import { useState, useMemo } from 'react';
import { ConfirmDialog, Status, DataTable, EmptyState } from '../components/index';
import { sortRows } from '../utils';

const FILTERS = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'ACTIVE', label: 'Đang bán' },
  { key: 'LOW', label: 'Sắp hết' },
  { key: 'HIDDEN', label: 'Tạm ẩn' },
];

const getStock = (product) => Number(product.stock || 0);

function matchesFilter(product, filterKey) {
  const stock = getStock(product);

  if (filterKey === 'ALL') return true;
  if (filterKey === 'ACTIVE') return stock > 0;
  if (filterKey === 'LOW') return stock > 0 && stock < 6;
  if (filterKey === 'HIDDEN') return stock === 0 || product.status === 'Tạm ẩn';

  return true;
}

export function ProductsPage({ products, onAdd, onEdit, onViewDetails, onDelete }) {
  const [filterKey, setFilterKey] = useState('ALL');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = useMemo(
    () => products.filter((product) => matchesFilter(product, filterKey)),
    [products, filterKey]
  );

  const filterCounts = useMemo(() => {
    const counts = {};
    FILTERS.forEach((item) => {
      counts[item.key] = products.filter((product) => matchesFilter(product, item.key)).length;
    });
    return counts;
  }, [products]);

  const visible = useMemo(() => sortRows(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);
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
          <p>{products.length} sản phẩm hiển thị</p>
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
          {visible.length === 0 ? (
            <EmptyState
              message={isFiltering ? `Không có sản phẩm nào trong bộ lọc "${currentFilter.label}"` : 'Chưa có sản phẩm nào'}
              hint={isFiltering ? 'Thử chọn bộ lọc khác hoặc xem tất cả sản phẩm.' : 'Thêm sản phẩm đầu tiên để bắt đầu quản lý danh mục.'}
              actionLabel={isFiltering ? 'Xem tất cả' : '+ Thêm sản phẩm'}
              onAction={isFiltering ? () => setFilterKey('ALL') : onAdd}
            />
          ) : visible.map((product) => {
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
                <td><Status>{product.status}</Status></td>
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
