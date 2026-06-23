import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function fmt(n) { return n.toLocaleString('vi-VN'); }

const STATUS_MAP = {
  pending:   { label: 'Chờ xác nhận', color: '#f59e0b', bg: '#fffbeb' },
  confirmed: { label: 'Đã xác nhận',  color: '#3b82f6', bg: '#eff6ff' },
  shipping:  { label: 'Đang giao',    color: '#8b5cf6', bg: '#f5f3ff' },
  delivered: { label: 'Đã nhận hàng', color: '#16a34a', bg: '#f0fdf4' },
  cancelled: { label: 'Đã hủy',       color: '#e11d48', bg: '#fef2f2' },
};

const MOCK_ORDERS = [
  {
    id: 'TS20250615001', date: '15/06/2025', status: 'delivered', total: 34990000,
    items: [{ name: 'iPhone 15 Pro Max 256GB', qty: 1, price: 34990000 }]
  },
  {
    id: 'TS20250601002', date: '01/06/2025', status: 'delivered', total: 18990000,
    items: [{ name: 'Samsung Galaxy S23 FE 256GB', qty: 1, price: 10990000 }, { name: 'Ốp lưng Samsung', qty: 1, price: 290000 }, { name: 'Cáp sạc Type-C', qty: 2, price: 195000 }]
  },
  {
    id: 'TS20250520003', date: '20/05/2025', status: 'cancelled', total: 7490000,
    items: [{ name: 'Xiaomi Redmi Note 13 Pro 256GB', qty: 1, price: 7490000 }]
  },
];

export function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const [params] = useSearchParams();
  const [expanded, setExpanded] = useState(params.get('new') === '1' ? 'new' : null);
  const [filter, setFilter] = useState('all');

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#f4f5f7' }}>
        <div style={{ fontSize: 56 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117' }}>Vui lòng đăng nhập</h2>
        <p style={{ fontSize: 14, color: '#6b7280' }}>Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
        <Link to="/sign-in" style={{ padding: '12px 28px', background: '#0d1117', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Đăng nhập ngay</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'all',       label: 'Tất cả' },
    { id: 'pending',   label: 'Chờ xác nhận' },
    { id: 'shipping',  label: 'Đang giao' },
    { id: 'delivered', label: 'Đã nhận' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  const orders = filter === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter);

  return (
    <div style={{ background: '#f4f5f7', minHeight: '80vh', padding: '32px 0 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>
        {/* New order banner */}
        {params.get('new') === '1' && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>🎉</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#16a34a', marginBottom: 2 }}>Đặt hàng thành công!</div>
              <div style={{ fontSize: 13, color: '#4ade80' }}>Cảm ơn bạn đã mua hàng tại TechStore. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chủ</Link>
              <span style={{ color: '#d1d5db' }}>/</span>
              <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 600 }}>Đơn hàng</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0d1117', letterSpacing: -0.5 }}>Đơn hàng của tôi</h1>
          </div>
        </div>

        {/* Tab filter */}
        <div style={{ display: 'flex', gap: 4, background: '#fff', borderRadius: 12, padding: 4, marginBottom: 20, border: '1.5px solid #f1f3f5' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              style={{ flex: 1, padding: '9px 12px', borderRadius: 9, border: 'none', background: filter===t.id ? '#0d1117' : 'transparent', color: filter===t.id ? '#fff' : '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {orders.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Không có đơn hàng nào</h3>
            <Link to="/products" style={{ fontSize: 14, color: '#0d1117', fontWeight: 700, textDecoration: 'none' }}>Mua sắm ngay →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map(order => {
              const st = STATUS_MAP[order.status];
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', overflow: 'hidden' }}>
                  <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                    onClick={() => setExpanded(isOpen ? null : order.id)}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#0d1117' }}>#{order.id}</span>
                        <span style={{ background: st.bg, color: st.color, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{st.label}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#9ca3af' }}>
                        {order.date} · {order.items.length} sản phẩm · <strong style={{ color: '#0d1117' }}>{fmt(order.total)}₫</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {order.status === 'delivered' && (
                        <button style={{ padding: '8px 14px', background: '#f4f5f7', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>
                          Mua lại
                        </button>
                      )}
                      <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f1f3f5', padding: '18px 22px', background: '#fafafa' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 52, height: 52, background: '#eaecf0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <svg width="24" height="40" viewBox="0 0 72 120" fill="none"><rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/><rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/></svg>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#0d1117' }}>{item.name}</div>
                              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>x{item.qty} · {fmt(item.price)}₫/cái</div>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#0d1117' }}>{fmt(item.price * item.qty)}₫</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ borderTop: '1px solid #e9ecef', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {order.status === 'pending' && (
                            <button style={{ padding: '8px 14px', background: '#fef2f2', color: '#e11d48', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy đơn</button>
                          )}
                          {order.status === 'delivered' && (
                            <button style={{ padding: '8px 14px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Đánh giá</button>
                          )}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#0d1117' }}>Tổng: {fmt(order.total)}₫</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
