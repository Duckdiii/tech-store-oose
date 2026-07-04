import { useEffect, useState } from 'react';
import { DataTable, EmptyState, Spinner } from '../components/index';
import { money } from '../utils';
import { supplyOrderApi } from '../../../api/supplyOrderApi';

const PAGE_SIZE = 10;

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

export function SupplyOrdersPage({ refreshToken, onAdd, onView }) {
  const [sortKey, setSortKey] = useState('orderDate');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const [visible, setVisible] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const isFiltering = search.trim() !== '';

  // Đổi từ khóa tìm kiếm thì quay về trang đầu.
  useEffect(() => { setPage(0); }, [search]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await supplyOrderApi.search({
          keyword: search.trim() || undefined,
          page,
          size: PAGE_SIZE,
          sort: `${sortKey},${sortDir}`,
        });
        const rows = (data.content || []).map((order) => ({
          ...order,
          totalValue: supplyOrderTotal(order),
        }));
        setVisible(rows);
        setTotalElements(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error('Failed to fetch supply orders', err);
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
    { label: 'Nhà cung cấp', key: 'supplierName' },
    { label: 'Ngày dự kiến giao', key: 'orderDate' },
    'Tổng giá trị',
    { label: 'Trạng thái', key: 'status' },
    '',
  ];

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>{totalElements} đơn nhập hàng{isFiltering ? ' phù hợp' : ''}</p>
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
          {loading ? (
            <tr>
              <td colSpan={99} style={{ padding: '48px 20px', textAlign: 'center' }}>
                <Spinner label="Đang tải đơn nhập hàng..." />
              </td>
            </tr>
          ) : visible.length === 0 ? (
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
    </>
  );
}
