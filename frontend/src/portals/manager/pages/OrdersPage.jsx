import { useState, useMemo, useRef, useEffect } from 'react';
import { Status, DataTable, EmptyState } from '../components/index';
import { money, sortRows } from '../utils';

const ORDER_STATUSES = ['Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'];

const PAYMENT_LOG_STATUSES = ['Tất cả', 'Success', 'Failed', 'Pending', 'Cancelled'];
const PAYMENT_METHODS      = ['Tất cả', 'VNPay', 'MoMo', 'COD'];

const MOCK_PAYMENT_LOGS = [
  { txId: 'TXN-001', orderId: 'TS20250615001', customer: 'Nguyễn Thị Hoa',  amount: 34990000, method: 'VNPay', status: 'Success',   time: '15/06/2025 10:32', failReason: '' },
  { txId: 'TXN-002', orderId: 'TS20250615002', customer: 'Trần Văn Minh',   amount: 28990000, method: 'COD',   status: 'Pending',   time: '15/06/2025 11:08', failReason: '' },
  { txId: 'TXN-003', orderId: 'TS20250614017', customer: 'Lê Thị Lan',      amount: 7490000,  method: 'MoMo',  status: 'Success',   time: '14/06/2025 09:14', failReason: '' },
  { txId: 'TXN-004', orderId: 'TS20250614016', customer: 'Phạm Quốc Bảo',  amount: 19990000, method: 'VNPay', status: 'Cancelled', time: '14/06/2025 08:55', failReason: 'Người dùng hủy giao dịch' },
  { txId: 'TXN-005', orderId: 'TS20250613009', customer: 'Hoàng Minh Tú',   amount: 22990000, method: 'MoMo',  status: 'Failed',    time: '13/06/2025 16:41', failReason: 'Số dư ví không đủ' },
  { txId: 'TXN-006', orderId: 'TS20250613008', customer: 'Đặng Thu Hương',  amount: 39990000, method: 'VNPay', status: 'Success',   time: '13/06/2025 14:22', failReason: '' },
];

const STATUS_STYLE = {
  Success:   { label: 'Success',   cls: 'Hoàn thành' },
  Pending:   { label: 'Pending',   cls: 'Chờ xác nhận' },
  Cancelled: { label: 'Cancelled', cls: 'Đã hủy' },
  Failed:    { label: 'Failed',    cls: 'Đã hủy' },
};

function PaymentLogTab({ onExport }) {
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterMethod, setFilterMethod] = useState('Tất cả');
  const [filterDate,   setFilterDate]   = useState('');
  const [detail,       setDetail]       = useState(null);

  const rows = MOCK_PAYMENT_LOGS.filter((tx) => {
    if (filterStatus !== 'Tất cả' && tx.status  !== filterStatus) return false;
    if (filterMethod !== 'Tất cả' && tx.method  !== filterMethod) return false;
    if (filterDate   && !tx.time.startsWith(filterDate.split('-').reverse().join('/'))) return false;
    return true;
  });

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>Lịch sử giao dịch thanh toán</p>
          <h2>Nhật ký thanh toán</h2>
        </div>
        <button className="admin-button admin-button--secondary" onClick={onExport}>
          Xuất nhật ký
        </button>
      </div>

      <article className="admin-card">
        <div className="admin-filterbar" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary, #64748b)' }}>
            Trạng thái
            <select
              className="admin-status-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {PAYMENT_LOG_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary, #64748b)' }}>
            Phương thức
            <select
              className="admin-status-select"
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
            >
              {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary, #64748b)' }}>
            Ngày
            <input
              type="date"
              className="admin-status-select"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </label>
          {(filterStatus !== 'Tất cả' || filterMethod !== 'Tất cả' || filterDate) && (
            <button
              className="admin-row-action"
              onClick={() => { setFilterStatus('Tất cả'); setFilterMethod('Tất cả'); setFilterDate(''); }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        <DataTable columns={['Mã giao dịch', 'Mã đơn', 'Khách hàng', 'Số tiền', 'Phương thức', 'Trạng thái', 'Thời gian', '']}>
          {rows.length === 0 ? (
            <tr><td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '28px 0' }}>Không có giao dịch phù hợp</td></tr>
          ) : rows.map((tx) => (
            <tr key={tx.txId}>
              <td><b>{tx.txId}</b></td>
              <td>{tx.orderId}</td>
              <td>{tx.customer}</td>
              <td><b>{money(tx.amount)}</b></td>
              <td>{tx.method}</td>
              <td><Status>{STATUS_STYLE[tx.status]?.cls || tx.status}</Status></td>
              <td style={{ color: '#64748b', fontSize: 12 }}>{tx.time}</td>
              <td>
                <button className="admin-row-action admin-row-action--primary" onClick={() => setDetail(tx)}>
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      </article>

      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setDetail(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', minWidth: 400, maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0d1117', margin: 0 }}>Chi tiết giao dịch</h3>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#9ca3af', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Mã giao dịch',    detail.txId],
                ['Mã đơn hàng',     detail.orderId],
                ['Khách hàng',      detail.customer],
                ['Số tiền',         money(detail.amount)],
                ['Phương thức',     detail.method],
                ['Trạng thái',      detail.status],
                ['Thời gian',       detail.time],
                ...(detail.failReason ? [['Lý do thất bại', detail.failReason]] : []),
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13.5 }}>
                  <span style={{ color: '#6b7280', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#0d1117', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
            <button
              className="admin-button"
              style={{ width: '100%', marginTop: 24 }}
              onClick={() => setDetail(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function OrdersPage({ orders, onStatus, onExport, onExportPaymentLog }) {
  const [tab,        setTab]        = useState('orders');
  const [sortKey,    setSortKey]    = useState('');
  const [sortDir,    setSortDir]    = useState('asc');
  const [selected,   setSelected]   = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('Hoàn thành');

  const selectAllRef = useRef(null);

  const visibleOrders = useMemo(() => sortRows(orders, sortKey, sortDir), [orders, sortKey, sortDir]);

  const allSelected  = visibleOrders.length > 0 && visibleOrders.every((o) => selected.has(o.id));
  const someSelected = !allSelected && visibleOrders.some((o) => selected.has(o.id));

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(visibleOrders.map((o) => o.id)));
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

  const applyBulkStatus = () => {
    selected.forEach((id) => onStatus(id, bulkStatus));
    setSelected(new Set());
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid #e9ecef', marginBottom: 24 }}>
        {[['orders', 'Đơn hàng'], ['payment-log', 'Nhật ký thanh toán']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '10px 22px',
              background: 'none',
              border: 'none',
              borderBottom: `2.5px solid ${tab === key ? '#0d1117' : 'transparent'}`,
              marginBottom: -1.5,
              fontSize: 14,
              fontWeight: tab === key ? 700 : 500,
              color: tab === key ? '#0d1117' : '#6b7280',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <>
          <div className="admin-page-intro">
            <div>
              <p>Đồng bộ theo dữ liệu mock</p>
              <h2>Đơn hàng gần đây</h2>
            </div>
            <button className="admin-button admin-button--secondary" onClick={onExport}>
              Xuất danh sách
            </button>
          </div>

          <article className="admin-card">
            {selected.size > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#0d1117', color: '#fff', borderRadius: 10, marginBottom: 12, fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>{selected.size} đơn đã chọn</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Chuyển sang:</span>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: 6, border: 'none', fontSize: 12, background: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer' }}
                >
                  {ORDER_STATUSES.map((s) => <option key={s} style={{ color: '#0d1117' }}>{s}</option>)}
                </select>
                <button
                  style={{ padding: '5px 14px', borderRadius: 8, border: 'none', background: '#fff', color: '#0d1117', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  onClick={applyBulkStatus}
                >
                  Áp dụng
                </button>
                <button
                  style={{ padding: '5px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: 'transparent', color: '#fff', fontSize: 12, cursor: 'pointer' }}
                  onClick={() => setSelected(new Set())}
                >
                  Bỏ chọn
                </button>
              </div>
            )}

            <DataTable
              columns={[
                { label: <input type="checkbox" ref={selectAllRef} checked={allSelected} onChange={toggleAll} style={{ cursor: 'pointer' }} />, key: '__check' },
                { label: 'Mã đơn',   key: 'id'    },
                'Khách hàng',
                { label: 'Ngày tạo', key: 'date'  },
                'Thanh toán',
                { label: 'Tổng tiền', key: 'total' },
                'Trạng thái',
              ]}
              sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
            >
              {visibleOrders.length === 0 ? (
                <EmptyState
                  message="Không có đơn hàng nào"
                  hint="Đơn hàng sẽ xuất hiện ở đây khi khách hàng đặt mua."
                />
              ) : visibleOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ width: 40 }}>
                    <input type="checkbox" checked={selected.has(order.id)} onChange={() => toggleOne(order.id)} style={{ cursor: 'pointer' }} />
                  </td>
                  <td><b>{order.id}</b></td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.payment}</td>
                  <td><b>{money(order.total)}</b></td>
                  <td>
                    <select
                      className="admin-status-select"
                      value={order.status}
                      onChange={(e) => onStatus(order.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </DataTable>
          </article>
        </>
      )}

      {tab === 'payment-log' && (
        <PaymentLogTab onExport={onExportPaymentLog} />
      )}
    </>
  );
}
