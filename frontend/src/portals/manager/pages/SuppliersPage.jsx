import { useState, useMemo } from 'react';
import { ConfirmDialog, DataTable, EmptyState } from '../components/index';
import { sortRows } from '../utils';

export function SuppliersPage({ suppliers, onAdd, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) =>
      `${s.name} ${s.email || ''} ${s.phone || ''}`.toLowerCase().includes(q)
    );
  }, [suppliers, search]);

  const visible = useMemo(() => sortRows(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);
  const isFiltering = search.trim() !== '';

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
          <p>{isFiltering ? `${visible.length}/${suppliers.length} nhà cung cấp phù hợp` : `${suppliers.length} nhà cung cấp hiển thị`}</p>
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
          {visible.length === 0 ? (
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
      </article>

      {deleteConfirm && (
        <ConfirmDialog
          title="Xóa nhà cung cấp?"
          message={`Bạn có chắc muốn xóa nhà cung cấp "${deleteConfirm.name}"? Hành động này không thể hoàn tác.`}
          confirmLabel="Xóa"
          danger
          onConfirm={() => onDelete(deleteConfirm.id)}
          onClose={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}
