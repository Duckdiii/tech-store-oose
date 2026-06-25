import { useState, useMemo } from 'react';
import { Metric } from '../components/index';
import { money } from '../utils';

// ─── Mock dataset ────────────────────────────────────────────────────────────
// Each record represents one completed order line item
const MOCK_SALES = [
  // June 2026
  { date: '2026-06-24', product: 'iPhone 15 Pro Max',        brand: 'Apple',   category: 'Điện thoại', payment: 'VNPay', revenue: 34990000 },
  { date: '2026-06-24', product: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Điện thoại', payment: 'COD',   revenue: 28990000 },
  { date: '2026-06-23', product: 'iPhone 15',                brand: 'Apple',   category: 'Điện thoại', payment: 'MoMo',  revenue: 22990000 },
  { date: '2026-06-23', product: 'Xiaomi 14 Pro',            brand: 'Xiaomi',  category: 'Điện thoại', payment: 'VNPay', revenue: 18990000 },
  { date: '2026-06-22', product: 'iPhone 15 Pro Max',        brand: 'Apple',   category: 'Điện thoại', payment: 'VNPay', revenue: 34990000 },
  { date: '2026-06-22', product: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Điện thoại', payment: 'MoMo',  revenue: 32990000 },
  { date: '2026-06-21', product: 'iPhone 15',                brand: 'Apple',   category: 'Điện thoại', payment: 'COD',   revenue: 22990000 },
  { date: '2026-06-21', product: 'OPPO Find X7 Pro',         brand: 'OPPO',    category: 'Điện thoại', payment: 'VNPay', revenue: 19990000 },
  { date: '2026-06-20', product: 'iPhone 15 Pro Max',        brand: 'Apple',   category: 'Điện thoại', payment: 'MoMo',  revenue: 34990000 },
  { date: '2026-06-20', product: 'Xiaomi 14 Pro',            brand: 'Xiaomi',  category: 'Điện thoại', payment: 'COD',   revenue: 18990000 },
  { date: '2026-06-18', product: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Điện thoại', payment: 'VNPay', revenue: 28990000 },
  { date: '2026-06-15', product: 'iPhone 15 Pro Max',        brand: 'Apple',   category: 'Điện thoại', payment: 'VNPay', revenue: 34990000 },
  { date: '2026-06-15', product: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Điện thoại', payment: 'COD',   revenue: 28990000 },
  { date: '2026-06-14', product: 'Xiaomi 14 Pro',            brand: 'Xiaomi',  category: 'Điện thoại', payment: 'MoMo',  revenue: 18990000 },
  { date: '2026-06-13', product: 'iPhone 15',                brand: 'Apple',   category: 'Điện thoại', payment: 'VNPay', revenue: 22990000 },
  { date: '2026-06-13', product: 'OPPO Find X7 Pro',         brand: 'OPPO',    category: 'Điện thoại', payment: 'MoMo',  revenue: 19990000 },
  // May 2026
  { date: '2026-05-28', product: 'iPhone 15 Pro Max',        brand: 'Apple',   category: 'Điện thoại', payment: 'VNPay', revenue: 34990000 },
  { date: '2026-05-25', product: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Điện thoại', payment: 'COD',   revenue: 28990000 },
  { date: '2026-05-20', product: 'Xiaomi 14 Pro',            brand: 'Xiaomi',  category: 'Điện thoại', payment: 'VNPay', revenue: 18990000 },
  { date: '2026-05-15', product: 'iPhone 15',                brand: 'Apple',   category: 'Điện thoại', payment: 'MoMo',  revenue: 22990000 },
  { date: '2026-05-10', product: 'iPhone 15 Pro Max',        brand: 'Apple',   category: 'Điện thoại', payment: 'COD',   revenue: 34990000 },
  { date: '2026-05-05', product: 'OPPO Find X7 Pro',         brand: 'OPPO',    category: 'Điện thoại', payment: 'VNPay', revenue: 19990000 },
];

const TODAY = '2026-06-24';

function parseDate(str) { return new Date(str); }

function inRange(dateStr, from, to) {
  const d = parseDate(dateStr);
  return d >= parseDate(from) && d <= parseDate(to);
}

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function startOfMonth(dateStr) { return dateStr.slice(0, 7) + '-01'; }
function endOfMonth(dateStr) {
  const [y, m] = dateStr.slice(0, 7).split('-').map(Number);
  return new Date(y, m, 0).toISOString().slice(0, 10);
}

function formatMoney(n) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)} triệu`;
  return money(n);
}

function groupBy(rows, key) {
  const map = {};
  for (const row of rows) {
    const k = row[key];
    map[k] = (map[k] || 0) + row.revenue;
  }
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

function BarBreakdown({ entries }) {
  const [hovered, setHovered] = useState(null);
  if (!entries.length) return <p style={{ color: '#94a3b8', fontSize: 13, padding: '12px 0' }}>Không có dữ liệu</p>;
  const max = entries[0][1];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {entries.map(([label, val]) => {
        const isHovered = hovered === label;
        return (
          <div
            key={label}
            style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}
            onMouseEnter={() => setHovered(label)}
            onMouseLeave={() => setHovered(null)}
          >
            <span style={{ width: 130, fontSize: 12.5, color: '#374151', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
            <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden', height: 10, cursor: 'default' }}>
              <div style={{ width: `${(val / max) * 100}%`, height: '100%', background: isHovered ? '#374151' : '#0d1117', borderRadius: 4, transition: 'width 0.4s ease, background 0.15s' }} />
            </div>
            <span style={{ width: 90, fontSize: 12, color: isHovered ? '#0d1117' : '#6b7280', fontWeight: isHovered ? 600 : 400, textAlign: 'right', flexShrink: 0, transition: 'all 0.15s' }}>{formatMoney(val)}</span>
            {isHovered && (
              <div style={{
                position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)',
                background: '#0d1117', color: '#fff', fontSize: 11.5, fontWeight: 600,
                padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap',
                zIndex: 20, pointerEvents: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              }}>
                {label}: {money(val)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const PERIOD_OPTIONS = [
  { key: 'daily',   label: 'Hôm nay' },
  { key: 'weekly',  label: '7 ngày qua' },
  { key: 'monthly', label: 'Tháng này' },
  { key: 'custom',  label: 'Tuỳ chỉnh' },
];

export function ReportsPage() {
  const [period, setPeriod] = useState('monthly');
  const [customFrom, setCustomFrom] = useState(addDays(TODAY, -30));
  const [customTo,   setCustomTo]   = useState(TODAY);

  const { from, to } = useMemo(() => {
    if (period === 'daily')   return { from: TODAY, to: TODAY };
    if (period === 'weekly')  return { from: addDays(TODAY, -6), to: TODAY };
    if (period === 'monthly') return { from: startOfMonth(TODAY), to: endOfMonth(TODAY) };
    return { from: customFrom, to: customTo };
  }, [period, customFrom, customTo]);

  const filtered = useMemo(() => MOCK_SALES.filter((s) => inRange(s.date, from, to)), [from, to]);

  const totalRevenue = filtered.reduce((s, r) => s + r.revenue, 0);
  const orderCount   = filtered.length;
  const avgOrder     = orderCount ? Math.round(totalRevenue / orderCount) : 0;

  // Previous period — same duration ending the day before `from`
  const { prevFrom, prevTo } = useMemo(() => {
    const durationDays = Math.round((new Date(to) - new Date(from)) / 86400000);
    const pTo = addDays(from, -1);
    const pFrom = addDays(pTo, -durationDays);
    return { prevFrom: pFrom, prevTo: pTo };
  }, [from, to]);

  const prevFiltered   = useMemo(() => MOCK_SALES.filter((s) => inRange(s.date, prevFrom, prevTo)), [prevFrom, prevTo]);
  const prevRevenue    = prevFiltered.reduce((s, r) => s + r.revenue, 0);
  const prevOrderCount = prevFiltered.length;
  const prevAvgOrder   = prevOrderCount ? Math.round(prevRevenue / prevOrderCount) : 0;

  const pctDelta = (curr, prev) => (prev ? Math.round(((curr - prev) / prev) * 100) : null);
  const revenueΔ  = pctDelta(totalRevenue, prevRevenue);
  const orderΔ    = pctDelta(orderCount, prevOrderCount);
  const avgOrderΔ = pctDelta(avgOrder, prevAvgOrder);

  const byCategory = groupBy(filtered, 'category');
  const byBrand    = groupBy(filtered, 'brand');
  const byPayment  = groupBy(filtered, 'payment');

  const top5 = useMemo(() => {
    const map = {};
    for (const r of filtered) {
      if (!map[r.product]) map[r.product] = { revenue: 0, units: 0 };
      map[r.product].revenue += r.revenue;
      map[r.product].units   += 1;
    }
    return Object.entries(map)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filtered]);

  const exportCsv = () => {
    const rows = [
      ['Chỉ số', 'Giá trị'],
      ['Kỳ báo cáo', `${from} → ${to}`],
      ['Doanh thu thuần', totalRevenue],
      ['Số đơn hàng', orderCount],
      ['Giá trị đơn trung bình', avgOrder],
      [],
      ['Top sản phẩm', 'Doanh thu', 'Số lượng'],
      ...top5.map((p) => [p.name, p.revenue, p.units]),
      [],
      ['Phân tích theo danh mục', 'Doanh thu'],
      ...byCategory.map(([k, v]) => [k, v]),
      [],
      ['Phân tích theo thương hiệu', 'Doanh thu'],
      ...byBrand.map(([k, v]) => [k, v]),
      [],
      ['Phân tích theo thanh toán', 'Doanh thu'],
      ...byPayment.map(([k, v]) => [k, v]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'bao-cao-doanh-thu.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const periodLabel = period === 'custom'
    ? `${customFrom} → ${customTo}`
    : PERIOD_OPTIONS.find((p) => p.key === period)?.label;

  return (
    <>
      <div className="admin-page-intro">
        <div>
          <p>{periodLabel}</p>
          <h2>Báo cáo doanh thu</h2>
        </div>
        <button className="admin-button admin-button--secondary" onClick={exportCsv}>Tải báo cáo</button>
      </div>

      {/* Period filter */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        {PERIOD_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: `1.5px solid ${period === key ? '#0d1117' : '#e2e8f0'}`,
              background: period === key ? '#0d1117' : '#fff',
              color: period === key ? '#fff' : '#374151',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
        {period === 'custom' && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 4 }}>
            <input type="date" className="admin-status-select" value={customFrom} max={customTo} onChange={(e) => setCustomFrom(e.target.value)} />
            <span style={{ fontSize: 13, color: '#9ca3af' }}>→</span>
            <input type="date" className="admin-status-select" value={customTo}   min={customFrom} max={TODAY} onChange={(e) => setCustomTo(e.target.value)} />
          </div>
        )}
      </div>

      {/* KPI metrics */}
      <div className="admin-metrics admin-metrics--three">
        <Metric label="Doanh thu thuần"        value={formatMoney(totalRevenue)} hint={`${orderCount} đơn hàng trong kỳ`}  delta={revenueΔ}  />
        <Metric label="Giá trị đơn trung bình" value={formatMoney(avgOrder)}     hint="Trung bình mỗi đơn hàng"            delta={avgOrderΔ} tone="blue" />
        <Metric label="Số đơn hoàn thành"      value={String(orderCount)}        hint="Đơn hàng trong kỳ báo cáo"          delta={orderΔ}    tone="purple" />
      </div>

      {/* Breakdown + Top 5 */}
      <div className="admin-grid admin-grid--wide" style={{ marginTop: 20 }}>
        {/* Top 5 products */}
        <article className="admin-card">
          <div className="admin-card__head">
            <div><p>TOP SẢN PHẨM</p><h3>Bán chạy nhất</h3></div>
          </div>
          {top5.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 13, padding: '16px 0' }}>Không có dữ liệu trong kỳ này</p>
          ) : (
            <ol className="admin-ranking">
              {top5.map((p, i) => (
                <li key={p.name}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <div><b>{p.name}</b><small>{p.units} sản phẩm đã bán</small></div>
                  <strong>{formatMoney(p.revenue)}</strong>
                </li>
              ))}
            </ol>
          )}
        </article>

        {/* Revenue by payment method */}
        <article className="admin-card">
          <div className="admin-card__head">
            <div><p>PHÂN TÍCH</p><h3>Theo phương thức thanh toán</h3></div>
          </div>
          <BarBreakdown entries={byPayment} />
        </article>
      </div>

      {/* Category + Brand breakdown */}
      <div className="admin-grid admin-grid--wide" style={{ marginTop: 16 }}>
        <article className="admin-card">
          <div className="admin-card__head">
            <div><p>PHÂN TÍCH</p><h3>Theo danh mục sản phẩm</h3></div>
          </div>
          <BarBreakdown entries={byCategory} />
        </article>

        <article className="admin-card">
          <div className="admin-card__head">
            <div><p>PHÂN TÍCH</p><h3>Theo thương hiệu</h3></div>
          </div>
          <BarBreakdown entries={byBrand} />
        </article>
      </div>
    </>
  );
}
