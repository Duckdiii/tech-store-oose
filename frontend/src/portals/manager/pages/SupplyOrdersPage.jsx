import { useMemo, useState } from 'react';
import { DataTable, EmptyState } from '../components/index';
import { sortRows, money } from '../utils';

export const SO_STATUS_LABEL = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã nhận hàng',
  CANCELLED: 'Đã hủy',
};

const SO_STATUS_TONE = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  SHIPPING: 'success',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

export function SOStatusBadge({ status }) {
  return (
    <span className={`admin-status admin-status--${SO_STATUS_TONE[status] || 'warning'}`}>
      {SO_STATUS_LABEL[status] || status}
    </span>
  );
}

export const supplyOrderTotal = (order) =>
  (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);

export function SupplyOrdersPage({ supplyOrders, onAdd, onView }) {
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => supplyOrders.map((order) => ({
    ...order,
    totalValue: supplyOrderTotal(order),
  })), [supplyOrders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((order) => `${order.supplierName || ''} ${order.id}`.toLowerCase().includes(q));
  }, [rows, search]);

  const visible = useMemo(() => sortRows(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);
  const isFiltering = search.trim() !== '';

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const columns = [
    { label: 'Nhà cung cấp', key: 'supplierName' },
    { label: 'Ngày dự kiến giao', key: 'orderDate' },
    { label: 'Tổng giá trị', key: 'totalValue' },
    { label: 'Trạng thái', key: 'status' },
    '',
  ];

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>{isFiltering ? `${visible.length}/${supplyOrders.length} đơn phù hợp` : `${supplyOrders.length} đơn nhập hàng`}</p>
          <h2>Đơn nhập hàng</h2>
        </div>
        <button className="admin-button" onClick={onAdd}>+ Tạo đơn nhập hàng</button>
      </div>

      <article className="admin-card">
        <div className="admin-filterbar" style={{ marginBottom: 12 }}>
          <input
            type="text"
            className="admin-status-select"
            placeholder="Tìm theo mã đơn hoặc nhà cung cấp"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 260 }}
          />
        </div>

        <DataTable columns={columns} sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
          {visible.length === 0 ? (
            <EmptyState
              message={isFiltering ? 'Không có đơn nhập hàng nào phù hợp' : 'Chưa có đơn nhập hàng nào'}
              hint={isFiltering ? 'Thử từ khóa khác.' : 'Tạo đơn nhập hàng đầu tiên để bắt đầu nhập kho.'}
              actionLabel={isFiltering ? undefined : '+ Tạo đơn nhập hàng'}
              onAction={isFiltering ? undefined : onAdd}
            />
          ) : visible.map((order) => (
            <tr key={order.id} onClick={() => onView(order)} style={{ cursor: 'pointer' }}>
              <td><b>{order.supplierName}</b></td>
              <td>{order.orderDate || '—'}</td>
              <td>{money(order.totalValue)}</td>
              <td><SOStatusBadge status={order.status} /></td>
              <td>
                <div className="admin-row-actions">
                  <button className="admin-row-action" onClick={(e) => { e.stopPropagation(); onView(order); }}>Xem / Cập nhật</button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      </article>
    </>
  );
}
