import { useState, useMemo, useEffect } from 'react';
import { Metric, SkeletonMetricCard, SkeletonChart, SkeletonLines } from '../components/index';
import { money } from '../utils';
import { httpClient } from '../../../api/httpClient';
import { useTheme } from '../../../shared/context/ThemeContext';

const TODAY = new Date().toISOString().slice(0, 10);

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

function formatDateVN(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function formatPeriodRange(from, to) {
  return from === to ? formatDateVN(from) : `${formatDateVN(from)} - ${formatDateVN(to)}`;
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
  const { t } = useTheme();
  const [period, setPeriod] = useState('monthly');
  const [customFrom, setCustomFrom] = useState(addDays(TODAY, -30));
  const [customTo,   setCustomTo]   = useState(TODAY);

  // Alt Flow 3a / 3b / 3c filters
  const [filterCategory,      setFilterCategory]      = useState('');
  const [filterBrand,         setFilterBrand]         = useState('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('');

  const [report, setReport] = useState(null);
  const [prevReport, setPrevReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [noData,  setNoData]  = useState(false);

  const { from, to } = useMemo(() => {
    if (period === 'daily')   return { from: TODAY, to: TODAY };
    if (period === 'weekly')  return { from: addDays(TODAY, -6), to: TODAY };
    if (period === 'monthly') return { from: startOfMonth(TODAY), to: endOfMonth(TODAY) };
    return { from: customFrom, to: customTo };
  }, [period, customFrom, customTo]);

  // filter tùy chọn thời gian cho report
  const { prevFrom, prevTo } = useMemo(() => {
    const durationDays = Math.round((new Date(to) - new Date(from)) / 86400000); // ví dụ  từ 01/05 đến 15/05 (14 ngày lệch nhau)
    const pTo = addDays(from, -1); // 30/04 (ngày trước customFrom)
    const pFrom = addDays(pTo, -durationDays);// 30/04 − 14 ngày = 16/04
    return { prevFrom: pFrom, prevTo: pTo };
  }, [from, to]);

  const startDate = `${from}T00:00:00`;
  const endDate = `${to}T23:59:59`;

  // Fetch current report
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError('');
      setNoData(false);
      try {
        const params = new URLSearchParams({
          startDate,
          endDate,
          ...(filterCategory      && { categoryId:      filterCategory }),
          ...(filterBrand         && { brandId:         filterBrand }),
          ...(filterPaymentMethod && { paymentMethodId: filterPaymentMethod }),
        });
        const response = await httpClient.get(`/reports/revenue?${params}`);
        const data = response.data;
        // Exception 4a: backend returns empty report (totalOrders === 0)
        if (!data || data.totalOrders === 0) {
          setNoData(true);
          setReport(data || null);
        } else {
          setReport(data);
        }
      } catch (err) {
        setReport(null);
        setError(t('Unable to load report data. Please try again later.'));
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [startDate, endDate, filterCategory, filterBrand, filterPaymentMethod]);

  // Fetch previous report for deltas
  useEffect(() => {
    const fetchPrevReport = async () => {
      try {
        const prevStartDate = `${prevFrom}T00:00:00`;
        const prevEndDate = `${prevTo}T23:59:59`;
        const response = await httpClient.get(`/reports/revenue?startDate=${prevStartDate}&endDate=${prevEndDate}`);
        setPrevReport(response.data);
      } catch (error) {
        console.error('Error fetching previous report:', error);
      }
    };
    fetchPrevReport();
  }, [prevFrom, prevTo]);

  const totalRevenue = report?.totalRevenue || 0;
  const orderCount   = report?.totalOrders || 0;
  const avgOrder     = orderCount ? Math.round(Number(totalRevenue) / orderCount) : 0;

  const prevRevenue    = prevReport?.totalRevenue || 0;
  const prevOrderCount = prevReport?.totalOrders || 0;
  const prevAvgOrder   = prevOrderCount ? Math.round(Number(prevRevenue) / prevOrderCount) : 0;

  const pctDelta = (curr, prev) => {
    const c = Number(curr); // current value
    const p = Number(prev); // previous value
    return p ? Math.round(((c - p) / p) * 100) : null; // return null if previous value is 0 to avoid division by zero
  };
  
  const revenueΔ  = pctDelta(totalRevenue, prevRevenue);
  const orderΔ    = pctDelta(orderCount, prevOrderCount);
  const avgOrderΔ = pctDelta(avgOrder, prevAvgOrder);

  const prevPeriodRange = formatPeriodRange(prevFrom, prevTo);
  const revenueΔTooltip  = `So với ${prevPeriodRange}: ${formatMoney(prevRevenue)}`;
  const orderΔTooltip    = `So với ${prevPeriodRange}: ${prevOrderCount} đơn hoàn thành`;
  const avgOrderΔTooltip = `So với ${prevPeriodRange}: ${formatMoney(prevAvgOrder)}`;

  const byCategory = useMemo(() => {
    if (!report?.revenueByCategory) return [];
    return report.revenueByCategory.map(item => [item.categoryName, Number(item.revenue)]);
  }, [report]);

  const byBrand = useMemo(() => {
    if (!report?.revenueByBrand) return [];
    return report.revenueByBrand.map(item => [item.brandName, Number(item.revenue)]);
  }, [report]);

  const byPayment = useMemo(() => {
    if (!report?.revenueByPaymentMethod) return [];
    return report.revenueByPaymentMethod.map(item => [item.paymentMethod, Number(item.revenue)]);
  }, [report]);

  const top5 = useMemo(() => {
    if (!report?.topProducts) return [];
    return report.topProducts.map(item => ({
      name: item.productName,
      units: item.totalQuantity,
      revenue: Number(item.totalRevenue)
    })).slice(0, 5);
  }, [report]);

  const exportPdfReport = () => {
    const params = new URLSearchParams({
      startDate,
      endDate,
      ...(filterCategory      && { categoryId:      filterCategory }),
      ...(filterBrand         && { brandId:         filterBrand }),
      ...(filterPaymentMethod && { paymentMethodId: filterPaymentMethod }),
    });
    window.open(`/api/reports/revenue/export?${params}`, '_blank');
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
        <button className="admin-button admin-button--secondary" onClick={exportPdfReport}>Xuất PDF Báo Cáo</button>
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

      {/* Alt Flow 3a / 3b / 3c: filters by category, brand, payment method */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <input
          className="admin-status-select"
          style={{ minWidth: 160 }}
          placeholder="Danh mục (ID)..."
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />
        <input
          className="admin-status-select"
          style={{ minWidth: 160 }}
          placeholder="Thương hiệu (ID)..."
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        />
        <select
          className="admin-status-select"
          value={filterPaymentMethod}
          onChange={(e) => setFilterPaymentMethod(e.target.value)}
        >
          <option value="">Tất cả PTTT</option>
          <option value="MOMO">MoMo</option>
          <option value="VNPAY">VNPay</option>
          <option value="COD">COD</option>
        </select>
        {(filterCategory || filterBrand || filterPaymentMethod) && (
          <button className="admin-row-action" onClick={() => { setFilterCategory(''); setFilterBrand(''); setFilterPaymentMethod(''); }}>
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Exception Flow 4b: system error */}
      {error && (
        <p style={{ color: 'var(--color-danger, #e53e3e)', background: 'var(--color-danger-bg, #fff5f5)', border: '1px solid var(--color-danger, #e53e3e)', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 14 }}>
          {error}
        </p>
      )}

      {/* Exception Flow 4a: no completed orders found */}
      {!loading && !error && noData && (
        <p style={{ color: '#92400e', background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 14 }}>
          {t('No revenue data found for the selected period')}
        </p>
      )}

      {loading ? (
        <>
          <div className="admin-metrics admin-metrics--three" aria-hidden="true">
            <SkeletonMetricCard />
            <SkeletonMetricCard tone="blue" />
            <SkeletonMetricCard tone="purple" />
          </div>

          <article className="admin-card admin-chart-card" style={{ marginTop: 20 }}>
            <div className="admin-card__head">
              <div><p>XU HƯỚNG</p><h3>Doanh thu theo thời gian</h3></div>
            </div>
            <SkeletonChart />
          </article>

          <div className="admin-grid admin-grid--wide" style={{ marginTop: 20 }}>
            <article className="admin-card">
              <div className="admin-card__head">
                <div><p>TOP SẢN PHẨM</p><h3>Bán chạy nhất</h3></div>
              </div>
              <SkeletonLines count={5} />
            </article>
            <article className="admin-card">
              <div className="admin-card__head">
                <div><p>PHÂN TÍCH</p><h3>Theo phương thức thanh toán</h3></div>
              </div>
              <SkeletonLines count={3} />
            </article>
          </div>

          <div className="admin-grid admin-grid--wide" style={{ marginTop: 16 }}>
            <article className="admin-card">
              <div className="admin-card__head">
                <div><p>PHÂN TÍCH</p><h3>Theo danh mục sản phẩm</h3></div>
              </div>
              <SkeletonLines count={4} />
            </article>
            <article className="admin-card">
              <div className="admin-card__head">
                <div><p>PHÂN TÍCH</p><h3>Theo thương hiệu</h3></div>
              </div>
              <SkeletonLines count={4} />
            </article>
          </div>
        </>
      ) : (
        <>
          {/* KPI metrics */}
          <div className="admin-metrics admin-metrics--three">
            <Metric label="Doanh thu thuần"        value={formatMoney(Number(totalRevenue))} hint={`${orderCount} đơn hàng trong kỳ`}  delta={revenueΔ}  deltaTooltip={revenueΔTooltip} />
            <Metric label="Giá trị đơn trung bình" value={formatMoney(avgOrder)}     hint="Trung bình mỗi đơn hàng"            delta={avgOrderΔ} deltaTooltip={avgOrderΔTooltip} tone="blue" />
            <Metric label="Số đơn hoàn thành"      value={String(orderCount)}        hint="Đơn hàng trong kỳ báo cáo"          delta={orderΔ}    deltaTooltip={orderΔTooltip} tone="purple" />
          </div>

          {/* Revenue Trend Chart */}
          <article className="admin-card admin-chart-card" style={{ marginTop: 20 }}>
            <div className="admin-card__head">
              <div><p>XU HƯỚNG</p><h3>Doanh thu theo thời gian</h3></div>
            </div>
            <div className="admin-chart" style={{ height: 200, paddingBottom: 10 }}>
              {report?.revenueTrend && report.revenueTrend.length > 0 ? (
                (() => {
                  const maxRevenue = Math.max(...report.revenueTrend.map(t => Number(t.revenue || 0)), 0) || 1;
                  return report.revenueTrend.map((item, i) => {
                    const height = (Number(item.revenue || 0) / maxRevenue) * 100;
                    return (
                      <div key={i} className="admin-chart__item" title={`${item.period}: ${money(Number(item.revenue || 0))}`}>
                        <div style={{ height: `${height}%` }} />
                        <span style={{ fontSize: 9, whiteSpace: 'nowrap' }}>{item.period}</span>
                      </div>
                    );
                  });
                })()
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#94a3b8', fontSize: 13 }}>
                  Không có dữ liệu xu hướng
                </div>
              )}
            </div>
          </article>

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
      )}
    </>
  );
}
