import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';

function fmt(n) { return n.toLocaleString('vi-VN'); }

const BUNDLE_SERVICES = [
  { id: 'warranty', icon: '🛡️', label: 'Bảo hành mở rộng 12 tháng', desc: 'Bao gồm lỗi phần cứng, hỗ trợ ưu tiên 24/7', price: 490000 },
  { id: 'screen',   icon: '📱', label: 'Dán cường lực màn hình',     desc: 'Dán tại cửa hàng, bảo vệ chống xước & vỡ',  price: 99000 },
  { id: 'setup',    icon: '⚙️', label: 'Cài đặt & chuyển dữ liệu',  desc: 'Chuyển danh bạ, ảnh, ứng dụng từ máy cũ',  price: 0 },
  { id: 'insure',   icon: '🔒', label: 'Bảo hiểm điện thoại 1 năm', desc: 'Bồi thường vỡ màn hình, rơi vỡ, ngấm nước', price: 390000 },
];

export function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (id) =>
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const bundleTotal = BUNDLE_SERVICES
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  if (items.length === 0) {
    return (
      <div style={{ background: '#f4f5f7', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 72 }}>🛒</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0d1117', letterSpacing: -0.5 }}>Giỏ hàng trống</h2>
        <p style={{ fontSize: 15, color: '#6b7280' }}>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
        <Link to="/products" style={{ padding: '13px 32px', background: '#0d1117', color: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
          Khám phá sản phẩm →
        </Link>
      </div>
    );
  }

  const shipping = total >= 500000 ? 0 : 30000;
  const finalTotal = total + shipping + bundleTotal;

  return (
    <div style={{ background: '#f4f5f7', minHeight: '80vh', padding: '32px 0 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
          <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chủ</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 600 }}>Giỏ hàng</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0d1117', letterSpacing: -0.8, marginBottom: 24 }}>Giỏ hàng ({items.length} sản phẩm)</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', padding: '20px 22px', display: 'flex', gap: 18, alignItems: 'center' }}>
                <div style={{ width: 88, height: 88, background: 'linear-gradient(148deg,#f4f5f7,#eaecf0)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="40" height="66" viewBox="0 0 72 120" fill="none">
                    <rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/>
                    <rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/>
                    <circle cx="36" cy="105" r="5" fill="#b8bdc8"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{item.brand}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0d1117', lineHeight: 1.35, marginBottom: 8 }}>{item.name}</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#0d1117' }}>{fmt(item.price)}₫</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e9ecef', borderRadius: 9, overflow: 'hidden' }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)}
                      style={{ width: 36, height: 36, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ width: 36, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#0d1117' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}
                      style={{ width: 36, height: 36, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#0d1117', minWidth: 120, textAlign: 'right' }}>
                    {fmt(item.price * item.qty)}₫
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    style={{ width: 36, height: 36, background: '#fef2f2', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </div>
            ))}

            <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#0d1117' }}>Dịch vụ đi kèm</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6b7280', background: '#f4f5f7', padding: '2px 8px', borderRadius: 20 }}>Tùy chọn</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {BUNDLE_SERVICES.map(svc => {
                  const checked = selectedServices.includes(svc.id);
                  return (
                    <label key={svc.id}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 12, border: `1.5px solid ${checked ? '#0d1117' : '#e9ecef'}`, background: checked ? '#f8f9fa' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <input type="checkbox" checked={checked} onChange={() => toggleService(svc.id)}
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                      <div style={{ width: 18, height: 18, border: `1.5px solid ${checked ? '#0d1117' : '#d1d5db'}`, borderRadius: 4, background: checked ? '#0d1117' : '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                        {checked && <svg width="10" height="10" fill="none" stroke="#fff" strokeWidth="2.8" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{svc.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0d1117' }}>{svc.label}</div>
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{svc.desc}</div>
                      </div>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: svc.price === 0 ? '#16a34a' : '#0d1117', flexShrink: 0 }}>
                        {svc.price === 0 ? 'Miễn phí' : `+${fmt(svc.price)}₫`}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
              <Link to="/products" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                ← Tiếp tục mua sắm
              </Link>
              <button onClick={clearCart} style={{ fontSize: 13, color: '#e11d48', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                Xóa tất cả
              </button>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', padding: '24px', position: 'sticky', top: 88 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0d1117', marginBottom: 20, letterSpacing: -0.3 }}>Tóm tắt đơn hàng</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                <span>Tạm tính ({items.reduce((s,i) => s+i.qty, 0)} sản phẩm)</span>
                <span style={{ fontWeight: 600, color: '#374151' }}>{fmt(total)}₫</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                <span>Phí vận chuyển</span>
                <span style={{ fontWeight: 600, color: shipping === 0 ? '#16a34a' : '#374151' }}>
                  {shipping === 0 ? 'Miễn phí' : fmt(shipping)+'₫'}
                </span>
              </div>
              {shipping === 0 && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 12px', fontSize: 12.5, color: '#16a34a', fontWeight: 600 }}>
                  ✓ Bạn được miễn phí vận chuyển!
                </div>
              )}
              {bundleTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                  <span>Dịch vụ đi kèm ({selectedServices.length})</span>
                  <span style={{ fontWeight: 600, color: '#374151' }}>+{fmt(bundleTotal)}₫</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <input type="text" placeholder="Mã giảm giá" style={{ flex: 1, height: 40, padding: '0 12px', border: '1.5px solid #e9ecef', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}/>
              <button style={{ padding: '0 14px', height: 40, background: '#f4f5f7', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>Áp dụng</button>
            </div>
            <div style={{ height: 1, background: '#f1f3f5', marginBottom: 16 }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#0d1117' }}>Tổng cộng</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#0d1117' }}>{fmt(finalTotal)}₫</span>
            </div>
            <button onClick={() => navigate('/checkout')}
              style={{ width: '100%', padding: '14px', background: '#0d1117', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 }}
              onMouseEnter={e => e.currentTarget.style.background='#1e293b'}
              onMouseLeave={e => e.currentTarget.style.background='#0d1117'}>
              Tiến hành thanh toán →
            </button>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              {['VISA','Master','MoMo','ZaloPay','COD'].map(m => (
                <span key={m} style={{ fontSize: 10, color: '#9ca3af', background: '#f4f5f7', padding: '3px 7px', borderRadius: 4, fontWeight: 600 }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
