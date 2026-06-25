import { useState, useMemo, useRef, useEffect } from 'react';
import { Status, DataTable, EmptyState } from '../components/index';
import { money, sortRows } from '../utils';

const ORDER_STATUSES = ['Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'];

export function ProductsPage({ products, onAdd, onEdit, onViewVariants, onDelete }) {
  const [filter,   setFilter]   = useState('Tất cả');
  const [sortKey,  setSortKey]  = useState('');
  const [sortDir,  setSortDir]  = useState('asc');
  const [selected, setSelected] = useState(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  const selectAllRef = useRef(null);

  const filtered = filter === 'Tất cả'
    ? products
    : products.filter((p) => p.status === filter || (filter === 'Sắp hết' && p.status === 'Sắp hết hàng'));

  const visible = useMemo(() => sortRows(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);

  const allSelected  = visible.length > 0 && visible.every((p) => selected.has(p.id));
  const someSelected = !allSelected && visible.some((p) => selected.has(p.id));

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(visible.map((p) => p.id)));
  };

  const toggleOne = (id) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const doBulkDelete = () => {
    selected.forEach((id) => onDelete(id));
    setSelected(new Set());
    setBulkDeleteConfirm(false);
  };

  const columns = [
    { label: <input type="checkbox" ref={selectAllRef} checked={allSelected} onChange={toggleAll} style={{ cursor: 'pointer' }} />, key: '__check' },
    { label: 'Sản phẩm',   key: 'name'   },
    'Mã SP',
    'Thương hiệu',
    { label: 'Giá từ',     key: 'price'  },
    { label: 'Tồn kho',    key: 'stock'  },
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
          {['Tất cả', 'Đang bán', 'Sắp hết', 'Tạm ẩn'].map((item) => (
            <button key={item} className={`admin-filter ${filter === item ? 'is-active' : ''}`} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>

        {selected.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#0d1117', color: '#fff', borderRadius: 10, marginBottom: 12, fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>{selected.size} sản phẩm đã chọn</span>
            <div style={{ flex: 1 }} />
            <button
              style={{ padding: '5px 14px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setBulkDeleteConfirm(true)}
            >
              Xóa đã chọn
            </button>
            <button
              style={{ padding: '5px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: 'transparent', color: '#fff', fontSize: 12, cursor: 'pointer' }}
              onClick={() => setSelected(new Set())}
            >
              Bỏ chọn
            </button>
          </div>
        )}

        <DataTable columns={columns} sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
          {visible.length === 0 ? (
            <EmptyState
              message={filter !== 'Tất cả' ? `Không có sản phẩm nào ở trạng thái "${filter}"` : 'Chưa có sản phẩm nào'}
              hint={filter !== 'Tất cả' ? 'Thử chọn bộ lọc khác hoặc xem tất cả sản phẩm.' : 'Thêm sản phẩm đầu tiên để bắt đầu quản lý danh mục.'}
              actionLabel={filter !== 'Tất cả' ? 'Xem tất cả' : '+ Thêm sản phẩm'}
              onAction={filter !== 'Tất cả' ? () => setFilter('Tất cả') : onAdd}
            />
          ) : visible.map((product) => (
            <tr key={product.id}>
              <td onClick={(e) => e.stopPropagation()} style={{ width: 40 }}>
                <input type="checkbox" checked={selected.has(product.id)} onChange={() => toggleOne(product.id)} style={{ cursor: 'pointer' }} />
              </td>
              <td>
                <div className="admin-product">
                  <span>{product.brand.slice(0, 1)}</span>
                  <div>
                    <b>{product.name}</b>
                    <small>{product.category || 'Chưa phân loại'} · {product.variantCount} chi tiết</small>
                  </div>
                </div>
              </td>
              <td>{product.id}</td>
              <td>{product.brand}</td>
              <td><b>{product.price ? money(product.price) : '—'}</b></td>
              <td className={product.stock < 6 ? 'admin-low-stock' : ''}>{product.stock}</td>
              <td><Status>{product.status}</Status></td>
              <td>
                <div className="admin-row-actions">
                  <button className="admin-row-action admin-row-action--primary" onClick={() => onViewVariants(product)}>
                    Chi tiết ({product.variantCount})
                  </button>
                  <button className="admin-row-action" onClick={() => onEdit(product)}>Sửa</button>
                  <button className="admin-row-action admin-row-action--danger" onClick={() => onDelete(product.id)}>Xóa</button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      </article>

      {bulkDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setBulkDeleteConfirm(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', minWidth: 360, maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0d1117', margin: '0 0 10px' }}>Xóa {selected.size} sản phẩm?</h3>
            <p style={{ fontSize: 13.5, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6 }}>
              Tất cả sản phẩm đã chọn và các serial liên quan sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="admin-button admin-button--secondary" onClick={() => setBulkDeleteConfirm(false)}>Hủy</button>
              <button className="admin-button" style={{ background: '#ef4444', color: '#fff' }} onClick={doBulkDelete}>
                Xóa {selected.size} sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
