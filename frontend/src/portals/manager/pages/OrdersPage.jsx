import { useState, useMemo, useRef, useEffect } from 'react';
import { Status, DataTable, EmptyState, Spinner } from '../components/index';
import { money, downloadCsv } from '../utils';
import { httpClient } from '../../../api/httpClient';
import { manageOrderApi } from '../../../api/manageOrderApi';

const ORDER_STATUSES = ['Chờ xác nhận', 'Đang xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy', 'Đã hoàn tiền'];

const PAGE_SIZE = 10;

const STATUS_TO_BACKEND = {
  'Chờ xác nhận': 'AWAITING_CONFIRMATION',
  'Đang xử lý': 'PROCESSING',
  'Đang giao': 'SHIPPING',
  'Hoàn thành': 'COMPLETED',
  'Đã hủy': 'CANCELLED',
  'Đã hoàn tiền': 'REFUNDED',
};

const STATUS_TO_FRONTEND = {
  AWAITING_CONFIRMATION: 'Chờ xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  REFUNDED: 'Đã hoàn tiền',
};

const formatDateString = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch {
    return isoString;
  }
};

// Các bước chuyển trạng thái hợp lệ, khớp đúng state machine phía backend (OrderStatus.java).
// Trạng thái không có trong map (hoặc mảng rỗng) là trạng thái cuối, không thể đổi tiếp.
const NEXT_STATUSES = {
  'Chờ xác nhận': ['Đang xử lý', 'Đã hủy'],
  'Đang xử lý': ['Đang giao', 'Đã hủy'],
  'Đang giao': ['Hoàn thành'],
  'Hoàn thành': ['Đã hoàn tiền'],
  'Đã hủy': [],
  'Đã hoàn tiền': [],
};

const PAYMENT_LOG_STATUSES = ['Tất cả', 'Success', 'Failed', 'Pending', 'Cancelled'];

const STATUS_STYLE = {
  Success:   { label: 'Success',   cls: 'Hoàn thành' },
  Pending:   { label: 'Pending',   cls: 'Chờ xác nhận' },
  Cancelled: { label: 'Cancelled', cls: 'Đã hủy' },
  Failed:    { label: 'Failed',    cls: 'Đã hủy' },
};

function PaymentLogTab() {
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterMethod, setFilterMethod] = useState('Tất cả');
  const [filterDate,   setFilterDate]   = useState('');
  const [detail,       setDetail]       = useState(null);

  const [logs, setLogs] = useState([]);
  const [availableMethods, setAvailableMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load available payment methods dynamically on mount
  useEffect(() => {
    httpClient.get('/payments/checkout/summary?customerId=1')
      .then(res => {
        setAvailableMethods(res.data.availablePaymentMethods || []);
      })
      .catch(err => console.error('Error fetching payment methods:', err));
  }, []);

  // Fetch payment logs on filter changes
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        let status = null;
        if (filterStatus !== 'Tất cả') {
          status = filterStatus.toUpperCase();
        }

        let paymentMethodId = null;
        if (filterMethod !== 'Tất cả') {
          paymentMethodId = filterMethod;
        }

        let startDate = null;
        let endDate = null;
        if (filterDate) {
          startDate = `${filterDate}T00:00:00`;
          endDate = `${filterDate}T23:59:59`;
        }

        const response = await httpClient.get('/payment-logs', {
          params: { status, paymentMethodId, startDate, endDate }
        });
        setLogs(response.data || []);
      } catch (err) {
        console.error('Error fetching payment logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [filterStatus, filterMethod, filterDate]);

  // Fetch log detail
  const handleViewDetail = async (logId) => {
    try {
      const response = await httpClient.get(`/payment-logs/${logId}`);
      setDetail(response.data);
    } catch (err) {
      console.error('Error fetching payment log detail:', err);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return isoString;
    }
  };

  const getStatusCls = (statusStr) => {
    if (!statusStr) return 'Đã hủy';
    const norm = statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase();
    return STATUS_STYLE[norm]?.cls || statusStr;
  };

  const handleExportCsv = () => {
    downloadCsv(
      'nhat-ky-thanh-toan-techstore.csv',
      ['Mã GD', 'Mã đơn', 'Khách hàng', 'Số tiền', 'Phương thức', 'Trạng thái', 'Thời gian'],
      logs.map((tx) => [
        tx.logId,
        tx.orderId,
        tx.customerName,
        tx.amount,
        tx.paymentMethod,
        tx.status,
        formatTime(tx.createdAt)
      ])
    );
  };

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>Lịch sử giao dịch thanh toán</p>
          <h2>Nhật ký thanh toán</h2>
        </div>
        <button className="admin-button admin-button--secondary" onClick={handleExportCsv}>
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
              <option value="Tất cả">Tất cả</option>
              {availableMethods.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
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
          {loading ? (
            <tr><td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '28px 0' }}>Đang tải dữ liệu...</td></tr>
          ) : logs.length === 0 ? (
            <tr><td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '28px 0' }}>Không có giao dịch phù hợp</td></tr>
          ) : logs.map((tx) => (
            <tr key={tx.logId}>
              <td><b>{tx.logId}</b></td>
              <td>{tx.orderId}</td>
              <td>{tx.customerName}</td>
              <td><b>{money(Number(tx.amount || 0))}</b></td>
              <td>{tx.paymentMethod}</td>
              <td><Status>{getStatusCls(tx.status)}</Status></td>
              <td style={{ color: '#64748b', fontSize: 12 }}>{formatTime(tx.createdAt)}</td>
              <td>
                <button className="admin-row-action admin-row-action--primary" onClick={() => handleViewDetail(tx.logId)}>
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
                ['Mã giao dịch',    detail.logId],
                ['Mã đơn hàng',     detail.orderId],
                ['Tên khách hàng',  detail.customerName],
                ['Số điện thoại',   detail.customerPhone],
                ['Email',           detail.customerEmail],
                ['Số tiền',         money(Number(detail.amount || 0))],
                ['Phương thức',     detail.paymentMethod],
                ['Trạng thái',      getStatusCls(detail.status)],
                ['Thời gian tạo',   formatTime(detail.createdAt)],
                ...(detail.paidAt ? [['Thời gian thanh toán', formatTime(detail.paidAt)]] : []),
                ...(detail.failureReason ? [['Lý do thất bại', detail.failureReason]] : []),
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13.5 }}>
                  <span style={{ color: '#6b7280', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#0d1117', textAlign: 'right' }}>{value || '-'}</span>
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

export function OrdersPage({ onStatus, onExport }) {
  const [tab,          setTab]          = useState('orders');
  const [sortKey,      setSortKey]      = useState('date');
  const [sortDir,      setSortDir]      = useState('desc');
  const [selected,     setSelected]     = useState(new Set());
  const [bulkStatus,   setBulkStatus]   = useState('');
  const [bulkResult,   setBulkResult]   = useState(null);
  const [bulkRunning,  setBulkRunning]  = useState(false);
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [search,       setSearch]       = useState('');
  const [page,         setPage]         = useState(0);
  const [refreshTick,  setRefreshTick]  = useState(0);

  const [visibleOrders, setVisibleOrders] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages,    setTotalPages]    = useState(0);
  const [loading,       setLoading]       = useState(false);

  const selectAllRef = useRef(null);

  const isFiltering = filterStatus !== 'Tất cả' || search.trim() !== '';

  // Đổi bộ lọc/tìm kiếm thì quay về trang đầu; đổi trang thì bỏ chọn để tránh
  // áp dụng đổi trạng thái hàng loạt lên đơn hàng không còn hiển thị.
  useEffect(() => { setPage(0); }, [filterStatus, search]);
  useEffect(() => { setSelected(new Set()); }, [filterStatus, search, page]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await manageOrderApi.searchOrders({
          keyword: search.trim() || undefined,
          status: filterStatus === 'Tất cả' ? undefined : STATUS_TO_BACKEND[filterStatus],
          page,
          size: PAGE_SIZE,
          sort: `${sortKey},${sortDir}`,
        });
        const mapped = (data.content || []).map((o) => ({
          id: o.orderId,
          customer: o.customerName,
          total: Number(o.totalAmount || 0),
          payment: o.paymentMethod || 'COD',
          status: STATUS_TO_FRONTEND[o.orderStatus] || o.orderStatus,
          date: formatDateString(o.orderDate),
        }));
        setVisibleOrders(mapped);
        setTotalElements(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error('Failed to fetch manager orders', err);
        setVisibleOrders([]);
        setTotalElements(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [filterStatus, search, page, sortKey, sortDir, refreshTick]);

  const allSelected  = visibleOrders.length > 0 && visibleOrders.every((o) => selected.has(o.id));
  const someSelected = !allSelected && visibleOrders.some((o) => selected.has(o.id));

  const selectedStatuses = useMemo(
    () => new Set(visibleOrders.filter((o) => selected.has(o.id)).map((o) => o.status)),
    [visibleOrders, selected]
  );
  const bulkNextOptions = useMemo(
    () => selectedStatuses.size === 1 ? (NEXT_STATUSES[[...selectedStatuses][0]] || []) : [],
    [selectedStatuses]
  );

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  useEffect(() => {
    if (bulkNextOptions.length > 0 && !bulkNextOptions.includes(bulkStatus)) {
      setBulkStatus(bulkNextOptions[0]);
    }
  }, [bulkNextOptions, bulkStatus]);

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

  const changeStatus = (id, status) =>
    onStatus(id, status).then(() => setRefreshTick((t) => t + 1));

  const applyBulkStatus = async () => {
    const ids = Array.from(selected);
    setBulkRunning(true);
    const results = await Promise.allSettled(ids.map((id) => onStatus(id, bulkStatus)));
    const failed = results.filter((r) => r.status === 'rejected').length;
    setBulkRunning(false);
    setSelected(new Set());
    setBulkResult({ total: ids.length, failed });
    setRefreshTick((t) => t + 1);
    setTimeout(() => setBulkResult(null), 5000);
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
              <p>{totalElements} đơn hàng{isFiltering ? ' phù hợp bộ lọc' : ''}</p>
              <h2>Đơn hàng gần đây</h2>
            </div>
            <button className="admin-button admin-button--secondary" onClick={onExport}>
              Xuất danh sách
            </button>
          </div>

          <article className="admin-card">
            <div className="admin-filterbar" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                Trạng thái
                <select
                  className="admin-status-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="Tất cả">Tất cả</option>
                  {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <input
                type="text"
                className="admin-status-select"
                placeholder="Tìm theo mã đơn hoặc khách hàng"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: 220 }}
              />
              {isFiltering && (
                <button
                  className="admin-row-action"
                  onClick={() => { setFilterStatus('Tất cả'); setSearch(''); }}
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {bulkResult && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: bulkResult.failed > 0 ? '#fef3c7' : '#dcfce7', color: bulkResult.failed > 0 ? '#92400e' : '#15803d', borderRadius: 10, marginBottom: 12, fontSize: 13 }}>
                <span>
                  {bulkResult.failed > 0
                    ? `Đã cập nhật ${bulkResult.total - bulkResult.failed}/${bulkResult.total} đơn. ${bulkResult.failed} đơn thất bại.`
                    : `Đã cập nhật ${bulkResult.total} đơn thành công.`}
                </span>
                <div style={{ flex: 1 }} />
                <button style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'inherit', fontSize: 16, lineHeight: 1 }} onClick={() => setBulkResult(null)}>×</button>
              </div>
            )}

            {selected.size > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#0d1117', color: '#fff', borderRadius: 10, marginBottom: 12, fontSize: 13, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600 }}>{selected.size} đơn đã chọn</span>
                <div style={{ flex: 1 }} />
                {selectedStatuses.size > 1 ? (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Chỉ áp dụng được khi các đơn đã chọn cùng trạng thái</span>
                ) : bulkNextOptions.length === 0 ? (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Các đơn đã chọn không thể chuyển trạng thái tiếp</span>
                ) : (
                  <>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Chuyển sang:</span>
                    <select
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: 6, border: 'none', fontSize: 12, background: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer' }}
                    >
                      {bulkNextOptions.map((s) => <option key={s} style={{ color: '#0d1117' }}>{s}</option>)}
                    </select>
                    <button
                      disabled={bulkRunning}
                      style={{ padding: '5px 14px', borderRadius: 8, border: 'none', background: '#fff', color: '#0d1117', fontSize: 12, fontWeight: 600, cursor: bulkRunning ? 'default' : 'pointer', opacity: bulkRunning ? 0.6 : 1 }}
                      onClick={applyBulkStatus}
                    >
                      {bulkRunning ? 'Đang áp dụng...' : 'Áp dụng'}
                    </button>
                  </>
                )}
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
                'Tổng tiền',
                'Trạng thái',
              ]}
              sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
            >
              {loading ? (
                <tr>
                  <td colSpan={99} style={{ padding: '48px 20px', textAlign: 'center' }}>
                    <Spinner label="Đang tải đơn hàng..." />
                  </td>
                </tr>
              ) : visibleOrders.length === 0 ? (
                <EmptyState
                  message={isFiltering ? 'Không có đơn hàng nào phù hợp bộ lọc' : 'Không có đơn hàng nào'}
                  hint={isFiltering ? 'Thử đổi trạng thái lọc hoặc xóa từ khóa tìm kiếm.' : 'Đơn hàng sẽ xuất hiện ở đây khi khách hàng đặt mua.'}
                />
              ) : visibleOrders.map((order) => {
                const nextOptions = NEXT_STATUSES[order.status] || [];
                return (
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
                      {nextOptions.length > 0 ? (
                        <select
                          className="admin-status-select"
                          value={order.status}
                          onChange={(e) => { changeStatus(order.id, e.target.value).catch(() => {}); }}
                        >
                          <option value={order.status}>{order.status}</option>
                          {nextOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <Status>{order.status}</Status>
                      )}
                    </td>
                  </tr>
                );
              })}
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
      )}

      {tab === 'payment-log' && (
        <PaymentLogTab />
      )}
    </>
  );
}
