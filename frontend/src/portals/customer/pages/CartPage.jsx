import { useState, useEffect  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';
import {httpClient } from '../../../api/httpClient';

function fmt(n) { return n.toLocaleString('vi-VN'); }


export function CartPage() {
  const { items, removeItem, updateQty, total, clearCart, addBundleServiceToItem, removeBundleServiceFromItem} = useCart();
  const navigate = useNavigate();

  const [bundleServices , setBundleServices] = useState([]);

  useEffect(() => {
    const fetchBundleServices = async () => {
      try {
        const response = await httpClient.get('/bundle-services');
        setBundleServices(response.data);
      } catch (error) {
        console.error('Error fetching bundle services:', error);
      }
    };

    fetchBundleServices();
  }, []);

  const bundleTotal = items.reduce((sum, item) => {
    const itemBundles = item.bundleServices || [];
    return sum + itemBundles.reduce((s, b) => s + b.price, 0);
  }, 0);

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
            {items.map(item => {
              const itemBundles = item.bundleServices || [];
              return (
                <div key={item.id} style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                    <div style={{ width: 88, height: 88, background: 'linear-gradient(148deg,#f4f5f7,#eaecf0)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="40" height="66" viewBox="0 0 72 120" fill="none">
                        <rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/>
                        <rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/>
                        <circle cx="36" cy="105" r="5" fill="#b8bdc8"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {item.brand && <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{item.brand}</div>}
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0d1117', lineHeight: 1.35, marginBottom: 8 }}>{item.name}</div>
                      {item.variantDisplay && <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{item.variantDisplay}</div>}
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

                  {bundleServices.length > 0 && (
                    <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Dịch vụ đi kèm sản phẩm này:</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                        {bundleServices.map(svc => {
                          const checked = itemBundles.some(b => b.id === svc.id);
                          const handleToggle = () => {
                            if (checked) {
                              removeBundleServiceFromItem(item.id, svc.id);
                            } else {
                              addBundleServiceToItem(item.id, svc.id);
                            }
                          };
                          return (
                            <label key={svc.id}
                              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${checked ? '#0d1117' : '#e9ecef'}`, background: checked ? '#f8f9fa' : '#fff', cursor: 'pointer', transition: 'all 0.15s', fontSize: 13 }}>
                              <input type="checkbox" checked={checked} onChange={handleToggle} style={{ cursor: 'pointer' }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, color: '#0d1117' }}>{svc.name}</div>
                              </div>
                              <div style={{ fontWeight: 800, color: svc.price === 0 ? '#16a34a' : '#0d1117' }}>
                                {svc.price === 0 ? 'Miễn phí' : `+${fmt(svc.price)}₫`}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Dịch vụ đi kèm đã được tích hợp trực tiếp vào từng sản phẩm ở trên */}

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
                  <span>Dịch vụ đi kèm ({items.reduce((s, i) => s + (i.bundleServices?.length || 0), 0)})</span>
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
