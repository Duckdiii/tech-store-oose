import { useEffect, useState } from 'react';
import { ConfirmDialog, DataTable, EmptyState, SkeletonTableRows } from '../components/index';
import { supplierApi } from '../../../api/supplierApi';
import { useTheme } from '../../../shared/context/ThemeContext';

const PAGE_SIZE = 10;

export function SuppliersPage({ refreshToken, onAdd, onEdit, onDelete }) {
  const { t } = useTheme();
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const [visible, setVisible] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const isFiltering = search.trim() !== '';

  // Đổi từ khóa tìm kiếm thì quay về trang đầu.
  useEffect(() => { setPage(0); }, [search]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await supplierApi.search({
          keyword: search.trim() || undefined,
          page,
          size: PAGE_SIZE,
          sort: `${sortKey},${sortDir}`,
        });
        setVisible(data.content || []);
        setTotalElements(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error('Failed to fetch suppliers', err);
        setVisible([]);
        setTotalElements(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page, sortKey, sortDir, refreshToken]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const columns = [
    { label: 'Tên nhà cung cấp', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Số điện thoại', key: 'phone' },
    'Địa chỉ',
    '',
  ];

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>{totalElements} nhà cung cấp{isFiltering ? ' phù hợp' : ''}</p>
          <h2>Nhà cung cấp</h2>
        </div>
        <button className="admin-button" onClick={onAdd}>+ Thêm nhà cung cấp</button>
      </div>

      <article className="admin-card">
        <div className="admin-filterbar" style={{ marginBottom: 12 }}>
          <input
            type="text"
            className="admin-status-select"
            placeholder="Tìm theo tên, email hoặc số điện thoại"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 260 }}
          />
        </div>

        <DataTable columns={columns} sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
          {loading ? (
            <SkeletonTableRows columns={columns.length} />
          ) : visible.length === 0 ? (
            <EmptyState
              message={isFiltering ? 'Không có nhà cung cấp nào phù hợp' : 'Chưa có nhà cung cấp nào'}
              hint={isFiltering ? 'Thử từ khóa khác.' : 'Thêm nhà cung cấp đầu tiên để bắt đầu nhập hàng.'}
              actionLabel={isFiltering ? undefined : '+ Thêm nhà cung cấp'}
              onAction={isFiltering ? undefined : onAdd}
            />
          ) : visible.map((supplier) => (
            <tr key={supplier.id}>
              <td><b>{supplier.name}</b></td>
              <td>{supplier.email || '—'}</td>
              <td>{supplier.phone || '—'}</td>
              <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={supplier.address || ''}>
                {supplier.address || '—'}
              </td>
              <td>
                <div className="admin-row-actions">
                  <button className="admin-row-action" onClick={() => onEdit(supplier)}>Sửa</button>
                  <button className="admin-row-action admin-row-action--danger" onClick={() => setDeleteConfirm(supplier)}>Xóa</button>
                </div>
              </td>
            </tr>
          ))}
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
          title={t('Xóa nhà cung cấp?')}
          message={t('Are you sure you want to remove this supplier? This action cannot be undone')}
          confirmLabel={t('Xóa')}
          danger
          onConfirm={() => onDelete(deleteConfirm.id)}
          onClose={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}
