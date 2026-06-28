import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { orderApi } from '../../../api/orderApi';
import { membershipApi } from '../../../api/membershipApi';

function fmt(n) { return n ? n.toLocaleString('vi-VN') : '0'; }

const RED = '#CC0000';

const MOCK_WISHLIST = [
  { id: 1, name: 'iPhone 15 128GB',           price: 22990000, oldPrice: 25000000 },
  { id: 2, name: 'Samsung Galaxy Z Fold 5',   price: 43990000, oldPrice: 48000000 },
  { id: 3, name: 'Xiaomi 14 Pro 512GB',       price: 18990000, oldPrice: 21000000 },
  { id: 4, name: 'OPPO Find X7 Pro 256GB',    price: 24990000, oldPrice: 27000000 },
  { id: 5, name: 'iPhone 14 128GB',           price: 18990000, oldPrice: 22990000 },
  { id: 6, name: 'Vivo X100 Pro 256GB',       price: 19990000, oldPrice: 22000000 },
];

const MOCK_VOUCHERS = [
  { code: 'TECH10OFF', desc: 'Giảm 10% cho đơn từ 5 triệu', expire: '30/06/2026' },
  { code: 'FREESHIP',  desc: 'Miễn phí vận chuyển toàn quốc', expire: '31/12/2026' },
  { code: 'NEWMEM50K', desc: 'Giảm 50.000đ cho thành viên mới', expire: '15/07/2026' },
];

const ADDRESSES = [
  { id: 1, tag: 'Nhà riêng', name: 'Nguyễn Văn An', phone: '0901 234 567', address: '123 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM', isDefault: true },
  { id: 2, tag: 'Công ty',   name: 'Nguyễn Văn An', phone: '0901 234 567', address: '456 Lê Lợi, P. Bến Thành, Q.1, TP.HCM',    isDefault: false },
];

const STATUS_MAP = {
  pending:   { label: 'Chờ xác nhận', color: '#f59e0b', bg: '#fffbeb' },
  confirmed: { label: 'Đã xác nhận',  color: '#3b82f6', bg: '#eff6ff' },
  shipping:  { label: 'Đang giao',    color: '#8b5cf6', bg: '#f5f3ff' },
  delivered: { label: 'Đã nhận hàng', color: '#16a34a', bg: '#f0fdf4' },
  cancelled: { label: 'Đã hủy',       color: '#e11d48', bg: '#fef2f2' },
};

const SIDEBAR_ITEMS = [
  { id: 'overview',   label: 'Tổng quan',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'orders',     label: 'Lịch sử mua hàng',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg> },
  { id: 'warranty',   label: 'Tra cứu bảo hành',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { id: 'tradein',    label: 'Lịch sử thu cũ',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
  { id: 'membership', label: 'Hạng thành viên và ưu đãi',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'vouchers',   label: 'Mã giảm giá', badge: MOCK_VOUCHERS.length,
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> },
  { id: 'address',    label: 'Số địa chỉ',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { id: 'referral',   label: 'Giới thiệu bạn bè', badge: 'Mới',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'info',       label: 'Thông tin tài khoản',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg> },
  { id: 'password',   label: 'Đổi mật khẩu',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
];

const SIDEBAR_FOOTER = [
  { id: 'policy',   label: 'Chính sách bảo hành' },
  { id: 'feedback', label: 'Góp ý - Phản hồi - Hỗ trợ' },
  { id: 'terms',    label: 'Điều khoản sử dụng' },
];

export function ProfilePage() {
  const { user, login, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('overview');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', birthday: '', gender: '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(null);

  const [orders, setOrders] = useState([]);
  const [tierInfo, setTierInfo] = useState(null);
  const [membershipError, setMembershipError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Fetch membership tier
        try {
          const tierData = await membershipApi.getMyTier();
          setTierInfo(tierData);
          setMembershipError('');
        } catch (err) {
          console.error("Failed to fetch tier", err);
          setMembershipError(err.response?.data?.message || 'Unable to load membership information. Please try again later');
        }
        
        // Fetch orders
        try {
          // Assume user.id exists, or default to some ID if mock auth
          const customerId = user?.id || 'CUST001'; 
          const ordersData = await orderApi.getOrderHistory(customerId);
          setOrders(ordersData || []);
        } catch (err) {
          console.error("Failed to fetch orders", err);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#f4f5f7' }}>
        <div style={{ fontSize: 56 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117' }}>Vui lòng đăng nhập</h2>
        <Link to="/sign-in" style={{ padding: '12px 28px', background: RED, color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Đăng nhập ngay</Link>
      </div>
    );
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setPw = k => e => setPwForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    login({ ...user, name: form.name, email: form.email, phone: form.phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const totalSpend = tierInfo ? Number(tierInfo.accumulatedSpending || 0) : orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const tierTarget = tierInfo ? Number(tierInfo.nextTierRequirement || 0) : 50000000;
  const tierProgress = tierTarget > 0 ? Math.min(100, Math.round((totalSpend / tierTarget) * 100)) : 100;
  const currentTierName = tierInfo ? (tierInfo.tierName || tierInfo.currentTierName) : 'Thành viên';

  const SectionTitle = ({ children }) => (
    <div style={{ fontSize: 16, fontWeight: 800, color: '#0d1117', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f1f3f5' }}>{children}</div>
  );

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  );

  const InputEl = (props) => (
    <input {...props} style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', color: '#0d1117', outline: 'none', background: '#fff', ...(props.style || {}) }}/>
  );

  const renderOverview = () => (
    <>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '20px 22px', marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#0d1117' }}>Đơn hàng gần đây</span>
          <button onClick={() => setActiveNav('orders')} style={{ fontSize: 13, color: RED, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            Xem tất cả →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.slice(0, 3).map(order => {
            const st = STATUS_MAP[order.status.toLowerCase()] || STATUS_MAP.pending;
            return (
              <div key={order.id} style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: '#fafafa', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12.5, color: '#6b7280' }}>Đơn hàng:</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0d1117' }}>#{order.id}</span>
                    <span style={{ fontSize: 11.5, color: '#6b7280' }}>·</span>
                    <span style={{ fontSize: 12.5, color: '#6b7280' }}>Ngày đặt hàng: <strong style={{ color: '#0d1117' }}>{order.date}</strong></span>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: st.color, background: st.bg, padding: '3px 10px', borderRadius: 20 }}>{st.label}</span>
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#f4f5f7,#eaecf0)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="32" height="52" viewBox="0 0 72 120" fill="none"><rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/><rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/><circle cx="36" cy="105" r="5" fill="#b8bdc8"/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0d1117', marginBottom: 4, lineHeight: 1.3 }}>{order.items && order.items.length > 0 ? order.items[0].productName : 'Đơn hàng'}</div>
                    <div style={{ fontSize: 12.5, color: '#9ca3af' }}>{order.items && order.items.length > 0 ? fmt(order.items[0].unitPrice) : 0}₫</div>
                    {order.items && order.items.length > 1 && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Cùng {order.items.length - 1} sản phẩm khác</div>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12.5, color: '#6b7280', marginBottom: 3 }}>Tổng thanh toán:</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: RED }}>{fmt(order.totalAmount)}₫</div>
                    <button onClick={() => navigate('/orders')} style={{ marginTop: 6, fontSize: 12.5, color: '#374151', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 3 }}>
                      Xem chi tiết
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '20px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#0d1117' }}>Sản phẩm yêu thích</span>
          <button style={{ fontSize: 13, color: RED, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Xem tất cả →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {MOCK_WISHLIST.map(p => (
            <div key={p.id} onClick={() => navigate(`/products/${p.id}`)}
              style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: '12px', cursor: 'pointer', position: 'relative' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#d1d5db'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#f0f0f0'}>
              <div style={{ width: '100%', aspectRatio: '1', background: 'linear-gradient(135deg,#f4f5f7,#eaecf0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <svg width="28" height="46" viewBox="0 0 72 120" fill="none"><rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/><rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/></svg>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0d1117', marginBottom: 5, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: RED }}>{fmt(p.price)}₫</div>
              <div style={{ fontSize: 11.5, color: '#c4c9d4', textDecoration: 'line-through' }}>{fmt(p.oldPrice)}₫</div>
              <button style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, background: '#fff', border: '1px solid #f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="13" height="13" fill={RED} stroke={RED} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderOrders = () => (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '20px 22px' }}>
      <SectionTitle>Lịch sử mua hàng</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map(order => {
          const st = STATUS_MAP[order.status.toLowerCase()] || STATUS_MAP.pending;
          return (
            <div key={order.id} style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: '#fafafa', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0d1117' }}>#{order.id}</span>
                  <span style={{ fontSize: 12.5, color: '#9ca3af' }}>· {order.date}</span>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: st.color, background: st.bg, padding: '3px 10px', borderRadius: 20 }}>{st.label}</span>
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {order.items && order.items.map((item, i) => (
                    <div key={i} style={{ fontSize: 13.5, color: '#374151', marginBottom: 2 }}>
                      {item.productName} <span style={{ color: '#9ca3af' }}>×{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: RED }}>{fmt(order.totalAmount)}₫</div>
                  <button onClick={() => navigate('/orders')} style={{ marginTop: 4, fontSize: 12.5, color: '#374151', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Xem chi tiết →</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMembership = () => (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '20px 22px' }}>
      <SectionTitle>Hạng thành viên</SectionTitle>

      {membershipError ? (
        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', borderRadius: 10, padding: '14px 16px', fontSize: 13.5, fontWeight: 600 }}>
          {membershipError}
        </div>
      ) : loading && !tierInfo ? (
        <div style={{ color: '#6b7280', fontSize: 14 }}>Đang tải thông tin hạng thành viên...</div>
      ) : (
        <>
          {tierInfo?.upgraded && tierInfo?.upgradeMessage && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 13.5, fontWeight: 700 }}>
              {tierInfo.upgradeMessage}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 18 }}>
            <div style={{ border: '1.5px solid #f1f3f5', borderRadius: 14, padding: 18, background: '#fffafa' }}>
              <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Current Tier</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: RED, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 18 }}>
                  {(currentTierName || 'M')[0]}
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#0d1117' }}>{currentTierName}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{tierInfo?.currentTierDescription || 'Standard membership benefits'}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: '#fff', border: '1px solid #f1f3f5', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11.5, color: '#9ca3af', marginBottom: 4 }}>Tổng chi tiêu tích lũy</div>
                  <b style={{ fontSize: 17, color: '#0d1117' }}>{fmt(totalSpend)}đ</b>
                </div>
                <div style={{ background: '#fff', border: '1px solid #f1f3f5', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11.5, color: '#9ca3af', marginBottom: 4 }}>Ưu đãi giảm giá</div>
                  <b style={{ fontSize: 17, color: '#0d1117' }}>{tierInfo?.discountPercentage || 0}%</b>
                </div>
              </div>
            </div>

            <div style={{ border: '1.5px solid #f1f3f5', borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Next Tier Progress</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{currentTierName}</span>
                <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 700 }}>{tierInfo?.nextTierName || 'Highest tier'}</span>
              </div>
              <div style={{ height: 9, background: '#f0f0f0', borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ width: `${tierProgress}%`, height: '100%', background: `linear-gradient(90deg, ${RED}, #ff6b6b)` }} />
              </div>
              {Number(tierInfo?.spendingToNextTier || 0) > 0 ? (
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                  Cần chi tiêu thêm <b style={{ color: RED }}>{fmt(Number(tierInfo.spendingToNextTier))}đ</b> để đạt {tierInfo.nextTierName}.
                </p>
              ) : (
                <p style={{ fontSize: 13, color: '#15803d', margin: 0, fontWeight: 700 }}>Bạn đã đạt hạng cao nhất hiện có.</p>
              )}
            </div>
          </div>

          <div style={{ border: '1.5px solid #f1f3f5', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0d1117', marginBottom: 12 }}>Quyền lợi đang áp dụng</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {(tierInfo?.activeBenefits || ['Standard membership benefits']).map((benefit, index) => (
                <div key={`${benefit}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f8fafc', borderRadius: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#f0fdf4', color: '#15803d', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span style={{ fontSize: 13.5, color: '#374151', fontWeight: 600 }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderVouchers = () => (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '20px 22px' }}>
      <SectionTitle>Mã giảm giá của tôi</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MOCK_VOUCHERS.map(v => (
          <div key={v.code} style={{ border: '1.5px dashed #e9ecef', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, background: '#fafafa' }}>
            <div style={{ width: 44, height: 44, background: RED, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0d1117', marginBottom: 3 }}>{v.desc}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>HSD: {v.expire}</div>
            </div>
            <button onClick={() => copyCode(v.code)}
              style={{ padding: '6px 12px', background: copied === v.code ? '#f0fdf4' : '#fff', border: `1.5px solid ${copied === v.code ? '#bbf7d0' : '#e9ecef'}`, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: copied === v.code ? '#16a34a' : '#374151', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.5 }}>{v.code}</span>
              <span style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af' }}>{copied === v.code ? '✓ Đã sao' : 'Sao chép'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddress = () => (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '20px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f1f3f5' }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#0d1117' }}>Số địa chỉ</span>
        <button style={{ padding: '8px 16px', background: RED, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ Thêm địa chỉ</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ADDRESSES.map(addr => (
          <div key={addr.id} style={{ padding: '16px 18px', border: `1.5px solid ${addr.isDefault ? RED : '#e9ecef'}`, borderRadius: 12, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, background: '#0d1117', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>{addr.tag}</span>
              {addr.isDefault && <span style={{ fontSize: 11.5, fontWeight: 700, color: '#16a34a' }}>● Mặc định</span>}
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0d1117', marginBottom: 3 }}>{addr.name}</div>
            <div style={{ fontSize: 13.5, color: '#6b7280', marginBottom: 2 }}>{addr.phone}</div>
            <div style={{ fontSize: 13.5, color: '#6b7280' }}>{addr.address}</div>
            <div style={{ display: 'flex', gap: 14, marginTop: 12 }}>
              <button style={{ fontSize: 13, color: RED, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Chỉnh sửa</button>
              {!addr.isDefault && <button style={{ fontSize: 13, color: '#e11d48', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Xóa</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInfo = () => (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '20px 22px' }}>
      <SectionTitle>Thông tin tài khoản</SectionTitle>
      {saved && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9, padding: '11px 16px', marginBottom: 20, fontSize: 13.5, color: '#16a34a', fontWeight: 600 }}>✓ Cập nhật thành công!</div>}
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Field label="Họ và tên *"><InputEl value={form.name} onChange={set('name')} placeholder="Nguyễn Văn An"/></Field>
          <Field label="Email"><InputEl value={form.email} onChange={set('email')} type="email" placeholder="ten@email.com"/></Field>
          <Field label="Số điện thoại"><InputEl value={form.phone} onChange={set('phone')} placeholder="0901 234 567"/></Field>
          <Field label="Ngày sinh"><InputEl value={form.birthday} onChange={set('birthday')} type="date"/></Field>
        </div>
        <Field label="Giới tính">
          <div style={{ display: 'flex', gap: 10 }}>
            {['Nam','Nữ','Khác'].map(g => (
              <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '9px 16px', border: `1.5px solid ${form.gender===g ? RED : '#e9ecef'}`, borderRadius: 9, background: form.gender===g ? '#fff5f5' : '#fff' }}>
                <input type="radio" name="gender" value={g} checked={form.gender===g} onChange={set('gender')} style={{ accentColor: RED }}/>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{g}</span>
              </label>
            ))}
          </div>
        </Field>
        <button type="submit" style={{ padding: '11px 28px', background: RED, color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }}>
          Lưu thay đổi
        </button>
      </form>
    </div>
  );

  const renderPassword = () => (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '20px 22px' }}>
      <SectionTitle>Đổi mật khẩu</SectionTitle>
      <form onSubmit={e => { e.preventDefault(); alert('Đổi mật khẩu thành công!'); setPwForm({ current: '', next: '', confirm: '' }); }} style={{ maxWidth: 420 }}>
        {[{ key: 'current', label: 'Mật khẩu hiện tại' },{ key: 'next', label: 'Mật khẩu mới' },{ key: 'confirm', label: 'Xác nhận mật khẩu mới' }].map(f => (
          <Field key={f.key} label={f.label}><InputEl type="password" value={pwForm[f.key]} onChange={setPw(f.key)} placeholder="••••••••"/></Field>
        ))}
        <button type="submit" style={{ padding: '11px 28px', background: RED, color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }}>Cập nhật mật khẩu</button>
      </form>
    </div>
  );

  const renderPlaceholder = (label) => (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '60px 22px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>{label}</div>
      <div style={{ fontSize: 13.5, color: '#9ca3af', marginTop: 8 }}>Tính năng đang được phát triển</div>
    </div>
  );

  const renderMain = () => {
    switch (activeNav) {
      case 'overview':   return renderOverview();
      case 'orders':     return renderOrders();
      case 'membership': return renderMembership();
      case 'vouchers':   return renderVouchers();
      case 'address':    return renderAddress();
      case 'info':       return renderInfo();
      case 'password':   return renderPassword();
      default:           return renderPlaceholder(SIDEBAR_ITEMS.find(s => s.id === activeNav)?.label || '');
    }
  };

  return (
    <div style={{ background: '#f4f5f7', minHeight: '80vh', padding: '20px 0 60px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chủ</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 600 }}>Tài khoản</span>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', padding: '20px 24px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '0 0 auto', paddingRight: 28, borderRight: '1px solid #f0f0f0' }}>
              <div style={{ width: 72, height: 72, background: `linear-gradient(135deg, ${RED}, #ff6b6b)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#0d1117', marginBottom: 4 }}>{user?.name || 'Khách hàng'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{user?.phone ? user.phone.slice(0, 3) + '*****' + user.phone.slice(-2) : '096*****35'}</span>
                  <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>{currentTierName}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
              <div style={{ flex: 1, padding: '0 28px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{ width: 40, height: 40, background: '#fff5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" fill="none" stroke={RED} strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  </div>
                  <span style={{ fontSize: 26, fontWeight: 900, color: '#0d1117' }}>{orders.length}</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 500 }}>Tổng số đơn hàng đã mua</div>
              </div>

              <div style={{ width: 1, height: 52, background: '#f0f0f0' }}/>

              <div style={{ flex: 2, padding: '0 28px' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#0d1117', marginBottom: 2 }}>{fmt(totalSpend)}₫</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Tổng tiền tích lũy · Từ 01/01/2025</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${tierProgress}%`, height: '100%', background: `linear-gradient(90deg, ${RED}, #ff6b6b)`, borderRadius: 4, transition: 'width 0.6s' }}/>
                  </div>
                  <span style={{ fontSize: 11.5, color: '#9ca3af', whiteSpace: 'nowrap' }}>{tierProgress}%</span>
                </div>
                <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 4 }}>
                  {tierInfo && Number(tierInfo.spendingToNextTier || 0) > 0 ? (
                    <>Cần chi tiêu thêm <strong style={{ color: RED }}>{fmt(Number(tierInfo.spendingToNextTier))}đ</strong> để thăng hạng</>
                  ) : (
                    <>Bạn đã đạt hạng cao nhất</>
                  )}
                </div>
              </div>

              <div style={{ width: 1, height: 52, background: '#f0f0f0' }}/>

              <div style={{ flex: '0 0 auto', padding: '0 0 0 28px', textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>Bạn đang ở kênh thành viên</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                  <div style={{ width: 36, height: 36, background: RED, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 900 }}>T</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0d1117' }}>TechStore</div>
                    <div style={{ fontSize: 12, color: RED }}>techstore.vn ↗</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '0 8px', marginBottom: 16, display: 'flex', overflowX: 'auto' }}>
          {[
            { id: 'membership', label: 'Hạng thành viên' },
            { id: 'vouchers',   label: 'Mã giảm giá', badge: MOCK_VOUCHERS.length },
            { id: 'orders',     label: 'Lịch sử mua hàng' },
            { id: 'address',    label: 'Số địa chỉ' },
            { id: 'referral',   label: 'Giới thiệu bạn bè', badge: 'Mới' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveNav(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 16px', background: 'none', border: 'none', borderBottom: `2.5px solid ${activeNav === tab.id ? RED : 'transparent'}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: activeNav === tab.id ? 700 : 500, color: activeNav === tab.id ? RED : '#374151', whiteSpace: 'nowrap', transition: 'all 0.15s', flexShrink: 0 }}>
              {tab.label}
              {tab.badge != null && (
                <span style={{ minWidth: 18, height: 18, background: RED, color: '#fff', fontSize: 10.5, fontWeight: 800, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', overflow: 'hidden', position: 'sticky', top: 80 }}>
            <div style={{ padding: '6px 0' }}>
              {SIDEBAR_ITEMS.map(item => (
                <button key={item.id} onClick={() => setActiveNav(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', background: activeNav === item.id ? '#fff5f5' : 'none', border: 'none', borderLeft: `3px solid ${activeNav === item.id ? RED : 'transparent'}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: activeNav === item.id ? 700 : 500, color: activeNav === item.id ? RED : '#374151', textAlign: 'left', transition: 'all 0.12s' }}>
                  <span style={{ color: activeNav === item.id ? RED : '#9ca3af', display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge != null && (
                    <span style={{ minWidth: 18, height: 18, background: RED, color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', padding: '6px 0' }}>
              {SIDEBAR_FOOTER.map(item => (
                <button key={item.id} style={{ display: 'block', width: '100%', padding: '10px 16px 10px 19px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: '#6b7280', textAlign: 'left' }}>
                  {item.label}
                </button>
              ))}
              <button onClick={() => { logout(); navigate('/'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, color: '#e11d48', textAlign: 'left' }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Đăng xuất
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {renderMain()}
          </div>

          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', padding: '18px 16px' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0d1117', marginBottom: 14 }}>Ưu đãi của bạn</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_VOUCHERS.map(v => (
                  <div key={v.code} style={{ border: '1px solid #f0f0f0', borderRadius: 10, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: 8, background: RED, flexShrink: 0 }}/>
                    <div style={{ padding: '10px 12px', flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0d1117', marginBottom: 3, lineHeight: 1.3 }}>{v.desc}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                        <div>
                          <span style={{ fontSize: 10.5, fontWeight: 800, color: RED, background: '#fff5f5', padding: '2px 6px', borderRadius: 4, letterSpacing: 0.5 }}>{v.code}</span>
                          <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 3 }}>HSD: {v.expire}</div>
                        </div>
                        <button onClick={() => copyCode(v.code)}
                          style={{ fontSize: 11, fontWeight: 700, color: copied === v.code ? '#16a34a' : '#374151', background: copied === v.code ? '#f0fdf4' : '#f4f5f7', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                          {copied === v.code ? '✓' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveNav('vouchers')} style={{ width: '100%', marginTop: 12, padding: '9px', background: 'none', border: `1.5px solid ${RED}`, borderRadius: 8, fontSize: 13, fontWeight: 700, color: RED, cursor: 'pointer', fontFamily: 'inherit' }}>
                Xem tất cả mã giảm giá
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
