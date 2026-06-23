import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function fmt(n) { return n.toLocaleString('vi-VN'); }

const PAYMENT_METHODS = [
  { id: 'cod',    label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  { id: 'momo',   label: 'Ví MoMo',                        icon: '💜' },
  { id: 'zalopay',label: 'ZaloPay',                        icon: '🔵' },
  { id: 'card',   label: 'Thẻ Visa / Mastercard',          icon: '💳' },
  { id: 'bank',   label: 'Chuyển khoản ngân hàng',         icon: '🏦' },
];

export function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', email: user?.email || '',
    address: '', province: '', note: '',
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const shipping = total >= 500000 ? 0 : 30000;
  const finalTotal = total + shipping;

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1200));
    clearCart();
    setPlacing(false);
    navigate('/orders?new=1');
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#f4f5f7' }}>
        <div style={{ fontSize: 56 }}>🛒</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117' }}>Giỏ hàng trống</h2>
        <Link to="/products" style={{ padding: '12px 28px', background: '#0d1117', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Tiếp tục mua sắm</Link>
      </div>
    );
  }

  const Field = ({ label, id, ...rest }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 7 }}>{label}</label>
      <input id={id} {...rest}
        style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', color: '#0d1117', outline: 'none', ...rest.style }}/>
    </div>
  );

  return (
    <div style={{ background: '#f4f5f7', minHeight: '80vh', padding: '32px 0 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
          <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chủ</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <Link to="/cart" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Giỏ hàng</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 600 }}>Thanh toán</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'flex-start' }}>
          {/* Left — form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Shipping */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', padding: '24px' }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0d1117', marginBottom: 20, letterSpacing: -0.3 }}>📦 Thông tin giao hàng</h2>
              <Field label="Họ và tên *" placeholder="Nguyễn Văn An" value={form.name} onChange={set('name')}/>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Số điện thoại *" placeholder="0901 234 567" value={form.phone} onChange={set('phone')}/>
                <Field label="Email" placeholder="ten@email.com" value={form.email} onChange={set('email')}/>
              </div>
              <Field label="Địa chỉ *" placeholder="Số nhà, tên đường, phường/xã" value={form.address} onChange={set('address')}/>
              <div>
                <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 7 }}>Tỉnh / Thành phố</label>
                <select value={form.province} onChange={set('province')}
                  style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', color: '#374151', outline: 'none', background: '#fff', marginBottom: 16 }}>
                  <option value="">Chọn tỉnh / thành phố</option>
                  {['TP. Hồ Chí Minh','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Biên Hòa','Nha Trang'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 7 }}>Ghi chú đơn hàng</label>
                <textarea value={form.note} onChange={set('note')} placeholder="Ghi chú thêm (tùy chọn)..."
                  style={{ width: '100%', height: 80, padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}/>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', padding: '24px' }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0d1117', marginBottom: 20, letterSpacing: -0.3 }}>💳 Phương thức thanh toán</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PAYMENT_METHODS.map(m => (
                  <label key={m.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', border: `1.5px solid ${method===m.id ? '#0d1117' : '#e9ecef'}`, borderRadius: 11, cursor: 'pointer', background: method===m.id ? '#f8f9fa' : '#fff', transition: 'all 0.15s' }}>
                    <input type="radio" name="method" value={m.id} checked={method===m.id} onChange={() => setMethod(m.id)} style={{ accentColor: '#0d1117', width: 16, height: 16 }}/>
                    <span style={{ fontSize: 20 }}>{m.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0d1117' }}>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right — summary */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', padding: '24px', position: 'sticky', top: 88 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0d1117', marginBottom: 18, letterSpacing: -0.3 }}>Đơn hàng của bạn</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 52, height: 52, background: '#f4f5f7', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                    <svg width="24" height="40" viewBox="0 0 72 120" fill="none"><rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/><rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/></svg>
                    <span style={{ position: 'absolute', top: -6, right: -6, background: '#0d1117', color: '#fff', fontSize: 10, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{item.qty}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0d1117', lineHeight: 1.3, marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{fmt(item.price)}₫ × {item.qty}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0d1117', flexShrink: 0 }}>{fmt(item.price*item.qty)}₫</div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: '#f1f3f5', marginBottom: 16 }}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                <span>Tạm tính</span><span style={{ fontWeight: 600, color: '#374151' }}>{fmt(total)}₫</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                <span>Vận chuyển</span>
                <span style={{ fontWeight: 600, color: shipping===0 ? '#16a34a' : '#374151' }}>{shipping===0 ? 'Miễn phí' : fmt(shipping)+'₫'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, color: '#0d1117', fontWeight: 900, borderTop: '1px solid #f1f3f5', paddingTop: 12 }}>
                <span>Tổng cộng</span><span>{fmt(finalTotal)}₫</span>
              </div>
            </div>
            <button onClick={handleOrder} disabled={placing}
              style={{ width: '100%', padding: '14px', background: placing ? '#374151' : '#0d1117', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: placing ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {placing ? 'Đang xử lý...' : 'Đặt hàng ngay →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 12, lineHeight: 1.6 }}>
              Bằng cách đặt hàng, bạn đồng ý với <a href="#" style={{ color: '#374151' }}>Điều khoản sử dụng</a> của TechStore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
