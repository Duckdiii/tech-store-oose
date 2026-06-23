import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ', exact: true },
  { to: '/products', label: 'Điện thoại' },
  { to: '/products?cat=accessories', label: 'Phụ kiện' },
  { to: '/brands', label: 'Thương hiệu' },
  { to: '/flash-sale', label: 'Flash Sale ⚡' },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const { user, logout, isLoggedIn } = useAuth();
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const isActive = (link) => {
    if (link.exact) return location.pathname === '/';
    return location.pathname.startsWith(link.to.split('?')[0]);
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (q) navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* Promo bar */}
      <div style={{ background: '#0d1117', padding: '9px 0', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12.5, color: '#64748b' }}>
            Miễn phí vận chuyển đơn từ <strong style={{ color: '#e2e8f0' }}>500.000₫</strong> — Áp dụng toàn quốc
          </span>
          <span style={{ fontSize: 12.5, color: '#64748b' }}>
            Hotline: <strong style={{ color: '#fff' }}>1800 6789</strong> — 08:00–21:00 hằng ngày
          </span>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <Link to="/orders" style={{ fontSize: 12.5, color: '#475569', textDecoration: 'none' }}>Theo dõi đơn hàng</Link>
            <span style={{ color: '#1e293b' }}>|</span>
            <a href="#" style={{ fontSize: 12.5, color: '#475569', textDecoration: 'none' }}>Hệ thống cửa hàng</a>
            <span style={{ color: '#1e293b' }}>|</span>
            <a href="#" style={{ fontSize: 12.5, color: '#475569', textDecoration: 'none' }}>Tuyển dụng</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#fff', borderBottom: '1px solid #e9ecef', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', gap: 20 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 40, height: 40, background: '#0d1117', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                <rect x="3" y="1" width="14" height="22" rx="3.5" fill="white" opacity="0.95"/>
                <rect x="7" y="19" width="6" height="2" rx="1" fill="#0d1117"/>
                <rect x="6" y="5" width="8" height="9" rx="2" fill="#0d1117" opacity="0.12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0d1117', letterSpacing: -0.8, lineHeight: 1.1 }}>TechStore</div>
              <div style={{ fontSize: 9.5, color: '#9ca3af', letterSpacing: 1.5, fontWeight: 600, lineHeight: 1, textTransform: 'uppercase' }}>Điện thoại chính hãng</div>
            </div>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {NAV_LINKS.map(link => {
              const active = isActive(link);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: active ? '8px 13px 6px' : '8px 13px',
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? '#0d1117' : '#4b5563',
                    textDecoration: 'none',
                    borderBottom: active ? '2px solid #0d1117' : '2px solid transparent',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ position: 'relative', width: 272, flexShrink: 0 }}>
            <input
              type="text"
              placeholder="Tìm điện thoại, phụ kiện..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', height: 40, padding: '0 42px 0 15px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 13, fontFamily: 'inherit', background: '#f8f9fa', color: '#374151', outline: 'none' }}
            />
            <button type="submit" style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex', alignItems: 'center' }}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </form>

          {/* Action icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <button style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
              <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>

            <Link to="/cart" style={{ width: 40, height: 40, background: 'none', border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', position: 'relative', textDecoration: 'none' }}>
              <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {count > 0 && (
                <span style={{ position: 'absolute', top: 4, right: 4, background: '#e11d48', color: '#fff', fontSize: 10, fontWeight: 800, minWidth: 17, height: 17, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                  {count}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div ref={menuRef} style={{ position: 'relative', marginLeft: 4 }}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#f4f5f7', border: 'none', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <div style={{ width: 28, height: 28, background: '#0d1117', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0d1117' }}>{user?.name?.split(' ').at(-1) || 'Tài khoản'}</span>
                  <svg width="12" height="12" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {showMenu && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1.5px solid #e9ecef', borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.12)', minWidth: 200, overflow: 'hidden', zIndex: 1001 }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f3f5' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0d1117' }}>{user?.name}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{user?.email}</div>
                    </div>
                    {[
                      { to: '/profile', label: 'Tài khoản của tôi' },
                      { to: '/orders', label: 'Đơn hàng của tôi' },
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setShowMenu(false)}
                        style={{ display: 'block', padding: '11px 16px', textDecoration: 'none', fontSize: 13.5, color: '#374151', fontWeight: 500 }}>
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid #f1f3f5' }}>
                      <button
                        onClick={() => { logout(); setShowMenu(false); navigate('/'); }}
                        style={{ display: 'block', width: '100%', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, color: '#e11d48', fontWeight: 600, fontFamily: 'inherit', textAlign: 'left' }}>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/sign-in"
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#0d1117', borderRadius: 9, color: '#fff', fontSize: 13.5, fontWeight: 700, textDecoration: 'none', flexShrink: 0, marginLeft: 4 }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
