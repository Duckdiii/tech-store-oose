import { useState, useMemo } from 'react';
import { DataTable, EmptyState } from '../components/index';
import { sortRows } from '../utils';

export function SuppliersPage({ suppliers, onAdd, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  const visible = useMemo(() => sortRows(suppliers, sortKey, sortDir), [suppliers, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const columns = [
    { label: 'Tên nhà cung cấp', key: 'name' },
    'Mã số thuế',
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
              <td>{supplier.taxCode}</td>
              <td><small style={{ color: '#94a3b8' }}>{supplier.id}</small></td>
              <td>
                <div className="admin-row-actions">
                  <button className="admin-row-action" onClick={() => onEdit(supplier)}>Sửa</button>
                  <button className="admin-row-action admin-row-action--danger" onClick={() => onDelete(supplier.id)}>Xóa</button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      </article>
    </>
  );
}
