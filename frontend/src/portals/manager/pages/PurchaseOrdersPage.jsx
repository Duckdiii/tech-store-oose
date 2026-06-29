import { useState, useMemo } from 'react';
import { Status, DataTable, EmptyState } from '../components/index';
import { money, sortRows } from '../utils';

export function PurchaseOrdersPage({ purchaseOrders, onAdd, onUpdateStatus }) {
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  const visible = useMemo(() => sortRows(purchaseOrders, sortKey, sortDir), [purchaseOrders, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      case 'SHIPPING': return 'warning';
      default: return '';
    }
  };

  const columns = [
    { label: 'Mã đơn', key: 'id' },
    'Nhà cung cấp',
    { label: 'Tổng tiền', key: 'total' },
    { label: 'Trạng thái', key: 'status' },
    '',
  ];

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>{purchaseOrders.length} đơn nhập hàng hiển thị</p>
          <h2>Đơn nhập hàng</h2>
        </div>
        <button className="admin-button" onClick={onAdd}>+ Tạo đơn nhập hàng</button>
      </div>

      <article className="admin-card">
        <DataTable columns={columns} sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
          {visible.length === 0 ? (
            <EmptyState
              message="Chưa có đơn nhập hàng nào"
              hint="Tạo đơn nhập hàng đầu tiên để bổ sung kho."
              actionLabel="+ Tạo đơn"
              onAction={onAdd}
            />
          ) : visible.map((po) => {
            const total = po.items ? po.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;
            return (
              <tr key={po.id}>
                <td><b>{po.id.slice(0, 8)}...</b></td>
                <td>{po.supplierName}</td>
                <td><b>{money(total)}</b></td>
                <td><Status type={getStatusColor(po.status)}>{po.status}</Status></td>
                <td>
                  <div className="admin-row-actions">
                    {po.status === 'PENDING' && <button className="admin-row-action" onClick={() => onUpdateStatus(po.id, 'CONFIRMED')}>Xác nhận</button>}
                    {po.status === 'CONFIRMED' && <button className="admin-row-action" onClick={() => onUpdateStatus(po.id, 'SHIPPING')}>Giao hàng</button>}
                    {po.status === 'SHIPPING' && <button className="admin-row-action admin-row-action--primary" onClick={() => onUpdateStatus(po.id, 'DELIVERED')}>Hoàn thành</button>}
                    {['PENDING', 'CONFIRMED'].includes(po.status) && (
                      <button className="admin-row-action admin-row-action--danger" onClick={() => onUpdateStatus(po.id, 'CANCELLED')}>Hủy</button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </DataTable>
      </article>
    </>
  );
}
