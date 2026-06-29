import { useState, useMemo } from 'react';
import { DataTable, EmptyState } from '../components/index';
import { sortRows } from '../utils';

function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', minWidth: 360, maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0d1117', margin: '0 0 10px' }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="admin-button admin-button--secondary" onClick={onClose}>Hủy</button>
          <button
            className="admin-button"
            style={danger ? { background: '#ef4444', color: '#fff' } : {}}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SuppliersPage({ suppliers, onAdd, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const visible = useMemo(() => sortRows(suppliers, sortKey, sortDir), [suppliers, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const columns = [
    { label: 'Tên nhà cung cấp', key: 'name' },
    'ID',
    '',
  ];

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>{suppliers.length} nhà cung cấp hiển thị</p>
          <h2>Nhà cung cấp</h2>
        </div>
        <button className="admin-button" onClick={onAdd}>+ Thêm nhà cung cấp</button>
      </div>

      <article className="admin-card">
        <DataTable columns={columns} sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
          {visible.length === 0 ? (
            <EmptyState
              message="Chưa có nhà cung cấp nào"
              hint="Thêm nhà cung cấp đầu tiên để bắt đầu nhập hàng."
              actionLabel="+ Thêm nhà cung cấp"
              onAction={onAdd}
            />
          ) : visible.map((supplier) => (
            <tr key={supplier.id}>
              <td><b>{supplier.name}</b></td>
              <td><small style={{ color: '#94a3b8' }}>{supplier.id}</small></td>
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
