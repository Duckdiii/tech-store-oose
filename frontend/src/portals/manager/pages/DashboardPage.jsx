import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { Status, DataTable } from '../components/index';
import { money, sortRows } from '../utils';

const GREET_HOUR = new Date().getHours();
const GREET = GREET_HOUR < 12 ? 'Chào buổi sáng' : GREET_HOUR < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
const TODAY = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const TODAY_DMY = (() => {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
})();

// dateStr format: DD/MM/YYYY (see formatDateString in ManagerPortal.jsx)
function parseOrderDate(dateStr) {
  const [, month, year] = (dateStr || '').split('/').map(Number);
  return { month, year };
}

function ClickableMetric({ label, value, hint, tone = 'dark', to, navigate }) {
  const mark = { dark: '#0d1117', blue: '#3b82f6', purple: '#7c3aed', amber: '#f59e0b' }[tone] || '#0d1117';
  return (
    <article
      className="admin-metric"
      onClick={() => navigate(to)}
      style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
      title={`Đến trang ${label}`}
    >
      <div className={`admin-metric__mark`} style={{ background: mark }} />
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{hint}</small>
      <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, display: 'block' }}>Nhấn để xem →</span>
    </article>
  );
}

function TodoSection({ pendingOrders, lowStockItems, navigate }) {
  const totalItems = pendingOrders.length + lowStockItems.length;

  if (totalItems === 0) {
    return (
      <article className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card__head">
          <div><p>VIỆC CẦN LÀM HÔM NAY</p><h3>Tất cả đã hoàn thành</h3></div>
        </div>
        <p style={{ color: '#6b7280', fontSize: 13, padding: '8px 0' }}>Không có việc tồn đọng. Hôm nay suôn sẻ!</p>
      </article>
    );
  }

  return (
    <article className="admin-card" style={{ marginBottom: 20 }}>
      <div className="admin-card__head">
        <div>
          <p>VIỆC CẦN LÀM HÔM NAY</p>
          <h3>{totalItems} mục cần xử lý</h3>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        {pendingOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate('/manager/orders')}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 10,
              border: '1.5px solid #e0f2fe', background: '#f0f9ff',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f0f9ff'}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ fontSize: 13, color: '#0d1117', display: 'block' }}>Đơn hàng {order.id} — {order.customer}</b>
              <span style={{ fontSize: 12, color: '#6b7280' }}>{money(order.total)} · {order.payment}</span>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
              background: '#dbeafe', color: '#1d4ed8', flexShrink: 0,
            }}>Chờ xác nhận</span>
            <span style={{ color: '#94a3b8', fontSize: 12, flexShrink: 0 }}>→</span>
          </div>
        ))}

        {lowStockItems.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate('/manager/warehouse')}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 10,
              border: `1.5px solid ${item.stock === 0 ? '#fee2e2' : '#fef3c7'}`,
              background: item.stock === 0 ? '#fff5f5' : '#fffbeb',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = item.stock === 0 ? '#fee2e2' : '#fef3c7'}
            onMouseLeave={(e) => e.currentTarget.style.background = item.stock === 0 ? '#fff5f5' : '#fffbeb'}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.stock === 0 ? '#ef4444' : '#f59e0b', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ fontSize: 13, color: '#0d1117', display: 'block' }}>{item.name}</b>
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                {item.stock === 0 ? 'Đã hết hàng' : `Chỉ còn ${item.stock} sản phẩm`}
              </span>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
              background: item.stock === 0 ? '#fee2e2' : '#fef3c7',
              color: item.stock === 0 ? '#b91c1c' : '#92400e',
              flexShrink: 0,
            }}>
              {item.stock === 0 ? 'Hết hàng' : 'Sắp hết'}
            </span>
            <span style={{ color: '#94a3b8', fontSize: 12, flexShrink: 0 }}>→</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export function DashboardPage({ data }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.name || user?.email || 'Manager';

  const pendingOrders = useMemo(
    () => data.orders.filter((o) => o.status === 'Chờ xác nhận'),
    [data.orders]
  );

  const newOrdersToday = useMemo(
    () => data.orders.filter((o) => o.date === TODAY_DMY).length,
    [data.orders]
  );

  const recentOrders = useMemo(
    () => sortRows(data.orders, 'date', 'desc').slice(0, 4),
    [data.orders]
  );

  const lowStockItems = useMemo(
    () => data.products
      .map((p) => ({
        ...p,
        stock: data.variants.filter((v) => v.productId === p.id && v.status === 'AVAILABLE').length,
      }))
      .filter((p) => p.stock < 6)
      .sort((a, b) => a.stock - b.stock),
    [data.products, data.variants]
  );

  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    const curMonth = now.getMonth() + 1;
    const curYear = now.getFullYear();
    const prevRef = new Date(curYear, now.getMonth() - 1, 1);
    const prevMonth = prevRef.getMonth() + 1;
    const prevYear = prevRef.getFullYear();

    let current = 0;
    let previous = 0;
    data.orders
      .filter((o) => o.status === 'Hoàn thành')
      .forEach((o) => {
        const { month, year } = parseOrderDate(o.date);
        if (month === curMonth && year === curYear) current += o.total;
        else if (month === prevMonth && year === prevYear) previous += o.total;
      });

    const changePercent = previous > 0 ? ((current - previous) / previous) * 100 : null;
    return { current, previous, changePercent };
  }, [data.orders]);

  const availableYears = useMemo(() => {
    const curYear = new Date().getFullYear();
    const years = new Set([curYear]);
    data.orders.forEach((o) => {
      const { year } = parseOrderDate(o.date);
      if (year) years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [data.orders]);

  const [revenueYear, setRevenueYear] = useState(() => new Date().getFullYear());

  const revenueByMonth = useMemo(() => {
    const totals = Array(12).fill(0);
    data.orders
      .filter((o) => o.status === 'Hoàn thành')
      .forEach((o) => {
        const { month, year } = parseOrderDate(o.date);
        if (year === revenueYear && month >= 1 && month <= 12) totals[month - 1] += o.total;
      });
    const max = Math.max(...totals, 1);
    return { heights: totals.map((v) => (v / max) * 100), totals };
  }, [data.orders, revenueYear]);

  const orderStatusStats = useMemo(() => {
    const total = data.orders.length;
    if (total === 0) return [];
    const cancelled = data.orders.filter((o) => o.status === 'Đã hủy' || o.status === 'Đã hoàn tiền').length;
    const completed = data.orders.filter((o) => o.status === 'Hoàn thành').length;
    const processing = total - completed - cancelled;
    return [
      { label: 'Hoàn thành', dot: 'dot--dark', percent: (completed / total) * 100 },
      { label: 'Đang xử lý', dot: 'dot--blue', percent: (processing / total) * 100 },
      { label: 'Đã hủy', dot: 'dot--muted', percent: (cancelled / total) * 100 },
    ];
  }, [data.orders]);

  const orderStatusGradient = useMemo(() => {
    if (orderStatusStats.length === 0) return null;
    const colors = ['#0d1117', '#2563eb', '#cbd5e1'];
    let cursor = 0;
    const stops = orderStatusStats.map((s, i) => {
      const start = cursor;
      cursor += s.percent;
      return `${colors[i]} ${start}% ${cursor}%`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }, [orderStatusStats]);

  const revenueHint = monthlyRevenue.previous <= 0
    ? (monthlyRevenue.current > 0 ? 'Chưa có dữ liệu tháng trước để so sánh' : 'Chưa có doanh thu tháng này')
    : `${monthlyRevenue.changePercent >= 0 ? '↑' : '↓'} ${Math.abs(monthlyRevenue.changePercent).toFixed(1).replace('.', ',')}% so với tháng trước`;

  const availableVariants = useMemo(
    () => data.variants.filter((v) => v.status === 'AVAILABLE').length,
    [data.variants]
  );

  const todoCount = pendingOrders.length + lowStockItems.length;

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>{TODAY}</p>
          <h2>{GREET}, {displayName}.</h2>
        </div>
        <button className="admin-button" onClick={() => navigate('/manager/products')}>
          + Thêm sản phẩm
        </button>
      </div>

      {/* Clickable metric cards */}
      <div className="admin-metrics">
        <ClickableMetric
          label="Doanh thu tháng"
          value={`${(monthlyRevenue.current / 1_000_000).toFixed(1).replace('.', ',')} triệu`}
          hint={revenueHint}
          tone="dark"
          to="/manager/reports"
          navigate={navigate}
        />
        <ClickableMetric
          label="Đơn hàng mới"
          value={String(newOrdersToday)}
          hint={`${pendingOrders.length} đơn đang chờ xác nhận · ${data.orders.length} tổng đơn`}
          tone="blue"
          to="/manager/orders"
          navigate={navigate}
        />
        <ClickableMetric
          label="Khách hàng"
          value={String(data.customers.length)}
          hint={`${data.customers.filter((c) => c.active).length} đang hoạt động`}
          tone="purple"
          to="/manager/customers"
          navigate={navigate}
        />
        <ClickableMetric
          label="Tồn kho có sẵn"
          value={String(availableVariants)}
          hint={lowStockItems.length > 0 ? `${lowStockItems.length} sản phẩm sắp hết` : 'Kho đang ổn định'}
          tone={lowStockItems.length > 0 ? 'amber' : 'dark'}
          to="/manager/warehouse"
          navigate={navigate}
        />
      </div>

      {/* Todo section */}
      {todoCount > 0 && (
        <TodoSection
          pendingOrders={pendingOrders}
          lowStockItems={lowStockItems}
          navigate={navigate}
        />
      )}

      {/* Charts row */}
      <div className="admin-grid admin-grid--wide">
        <article className="admin-card admin-chart-card">
          <div className="admin-card__head">
            <div><p>HIỆU QUẢ KINH DOANH</p><h3>Doanh thu theo tháng</h3></div>
            <select
              className="admin-status-select"
              value={revenueYear}
              onChange={(e) => setRevenueYear(Number(e.target.value))}
            >
              {availableYears.map((y) => <option key={y} value={y}>Năm {y}</option>)}
            </select>
          </div>
          <div className="admin-chart">
            {revenueByMonth.heights.map((height, i) => (
              <div key={i} className="admin-chart__item" title={money(revenueByMonth.totals[i])}>
                <div style={{ height: `${height}%` }} />
                <span>T{i + 1}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card__head">
            <div><p>TRẠNG THÁI ĐƠN</p><h3>Phân bổ đơn hàng</h3></div>
          </div>
          <div className="admin-donut" style={orderStatusGradient ? { background: orderStatusGradient } : undefined}>
            <div><strong>{data.orders.length}</strong><span>đơn hàng</span></div>
          </div>
          <div className="admin-legend">
            {orderStatusStats.length === 0
              ? <span style={{ color: '#94a3b8' }}>Chưa có đơn hàng nào</span>
              : orderStatusStats.map((s) => (
                <span key={s.label}><i className={`dot ${s.dot}`} />{s.label} <b>{s.percent.toFixed(0)}%</b></span>
              ))}
          </div>
        </article>
      </div>

      {/* Recent orders + warehouse alerts */}
      <div className="admin-grid admin-grid--wide">
        <article className="admin-card">
          <div className="admin-card__head">
            <div><p>ĐƠN HÀNG</p><h3>Đơn hàng gần đây</h3></div>
            <button className="admin-text-button" onClick={() => navigate('/manager/orders')}>
              Xem tất cả →
            </button>
          </div>
          <DataTable columns={['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Trạng thái']}>
            {recentOrders.map((order) => (
              <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/manager/orders')}>
                <td><b>{order.id}</b></td>
                <td>{order.customer}</td>
                <td>{money(order.total)}</td>
                <td><Status>{order.status}</Status></td>
              </tr>
            ))}
          </DataTable>
        </article>

        <article className="admin-card">
          <div className="admin-card__head">
            <div><p>KHO HÀNG</p><h3>Cần chú ý</h3></div>
            <button className="admin-text-button" onClick={() => navigate('/manager/warehouse')}>
              Xem kho →
            </button>
          </div>
          {lowStockItems.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 13, padding: '8px 0' }}>Tồn kho đang ổn định.</p>
          ) : (
            <div className="admin-alert-list">
              {lowStockItems.slice(0, 4).map((item) => (
                <div key={item.id}>
                  <b>{item.name}</b>
                  <span>{item.stock === 0 ? 'Đã hết hàng' : `Chỉ còn ${item.stock} sản phẩm`}</span>
                  <Status>{item.stock === 0 ? 'Hết hàng' : 'Sắp hết hàng'}</Status>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </>
  );
}
