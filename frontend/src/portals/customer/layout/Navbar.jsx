import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { useTheme } from '../../../shared/context/ThemeContext';
import { notificationApi } from '../../../api/notificationApi';

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ', exact: true },
  { to: '/products', label: 'Điện thoại' },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const { user, logout, isLoggedIn } = useAuth();
  const { theme, setTheme, lang, setLang, t } = useTheme();
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const menuRef = useRef(null);
  const favoritesRef = useRef(null);
  const notificationsRef = useRef(null);

  const isActive = (link) => {
    if (link.exact) return location.pathname === '/';
    return location.pathname.startsWith(link.to.split('?')[0]);
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      if (favoritesRef.current && !favoritesRef.current.contains(e.target)) setShowFavorites(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowFavorites(false);
      setShowNotifications(false);
      setFavoriteProducts([]);
      setNotifications([]);
      setFavoritesError('');
    }
  }, [isLoggedIn]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (q) navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  const loadFavorites = async () => {
    setFavoritesLoading(true);
    setFavoritesError('');
    try {
      const subscriptions = await notificationApi.getSubscriptions();
      setFavoriteProducts(subscriptions.filter((item) => item.status === 'SUBSCRIBED'));
    } catch (err) {
      setFavoriteProducts([]);
      setFavoritesError('Khong tai duoc danh sach da tim.');
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleFavoritesClick = () => {
    if (!isLoggedIn) {
      navigate('/sign-in');
      return;
    }

    const nextOpen = !showFavorites;
    setShowFavorites(nextOpen);
    setShowMenu(false);
    setShowNotifications(false);
    if (nextOpen) loadFavorites();
  };

  const loadNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleNotificationsClick = () => {
    if (!isLoggedIn) {
      navigate('/sign-in');
      return;
    }
    const nextOpen = !showNotifications;
    setShowNotifications(nextOpen);
    setShowFavorites(false);
    setShowMenu(false);
    if (nextOpen) loadNotifications();
  };

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationApi.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const unreadNotificationsCount = notifications.filter(n => !n.readAt).length;

  return (
    <>
      {/* Promo bar */}
      <div style={{ background: '#0d1117', padding: '9px 0', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12.5, color: '#64748b' }}>
            {t('Miễn phí vận chuyển đơn từ')} <strong style={{ color: '#e2e8f0' }}>500.000₫</strong> — {t('Áp dụng toàn quốc')}
          </span>
          <span style={{ fontSize: 12.5, color: '#64748b' }}>
            {t('Hotline')}: <strong style={{ color: '#fff' }}>1800 6789</strong> — 08:00–21:00 {t('hằng ngày')}
          </span>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <Link to="/orders" style={{ fontSize: 12.5, color: '#475569', textDecoration: 'none' }}>{t('Theo dõi đơn hàng')}</Link>
            <span style={{ color: '#1e293b' }}>|</span>
            <button style={{ fontSize: 12.5, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>{t('Hệ thống cửa hàng')}</button>
            <span style={{ color: '#1e293b' }}>|</span>
            <button style={{ fontSize: 12.5, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>{t('Tuyển dụng')}</button>
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
              <div style={{ fontSize: 9.5, color: '#9ca3af', letterSpacing: 1.5, fontWeight: 600, lineHeight: 1, textTransform: 'uppercase' }}>{t('Điện thoại chính hãng')}</div>
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
                  {t(link.label)}
                </Link>
              );
            })}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ position: 'relative', width: 272, flexShrink: 0 }}>
            <input
              type="text"
              placeholder={t('Tìm kiếm sản phẩm...')}
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
            <div ref={favoritesRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={handleFavoritesClick}
                title="{t('Danh sách yêu thích')}"
                aria-label="{t('Danh sách yêu thích')}"
                style={{ width: 40, height: 40, background: showFavorites ? '#f4f5f7' : 'none', border: 'none', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: showFavorites ? '#0d1117' : '#4b5563' }}
              >
                <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>

              {showFavorites && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: -46, width: 320, maxWidth: 'calc(100vw - 32px)', background: '#fff', border: '1.5px solid #e9ecef', borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 1001 }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f3f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0d1117' }}>{t('Danh sách yêu thích')}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{favoriteProducts.length} {t('Đang theo dõi thông báo')}</div>
                    </div>
                    <button
                      type="button"
                      onClick={loadFavorites}
                      disabled={favoritesLoading}
                      style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e9ecef', background: '#fff', color: '#6b7280', cursor: favoritesLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Tai lai"
                      aria-label="Tai lai"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 1-15.53 6.21M3 12A9 9 0 0 1 18.53 5.79"/><path d="M21 3v6h-6M3 21v-6h6"/></svg>
                    </button>
                  </div>

                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {favoritesLoading ? (
                      <div style={{ padding: '22px 16px', color: '#9ca3af', fontSize: 13.5 }}>{t('Đang tải...')}</div>
                    ) : favoritesError ? (
                      <div style={{ padding: '22px 16px', color: '#e11d48', fontSize: 13.5 }}>{favoritesError}</div>
                    ) : favoriteProducts.length === 0 ? (
                      <div style={{ padding: '22px 16px', color: '#9ca3af', fontSize: 13.5 }}>{t('Chưa có sản phẩm nào yêu thích')}</div>
                    ) : (
                      favoriteProducts.map((item) => (
                        <button
                          key={item.id || item.productId}
                          type="button"
                          onClick={() => {
                            setShowFavorites(false);
                            navigate(`/products/${item.productId}`);
                          }}
                          style={{ width: '100%', padding: '12px 16px', background: '#fff', border: 'none', borderBottom: '1px solid #f4f5f7', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, fontFamily: 'inherit' }}
                        >
                          <span style={{ width: 34, height: 34, borderRadius: 9, background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
                          </span>
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: '#0d1117', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName || 'San pham'}</span>
                            <span style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{t('Đang theo dõi thông báo')}</span>
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bell Notifications */}
            <div ref={notificationsRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={handleNotificationsClick}
                title="Thông báo"
                aria-label="Thông báo"
                style={{ width: 40, height: 40, background: showNotifications ? '#f4f5f7' : 'none', border: 'none', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: showNotifications ? '#0d1117' : '#4b5563', position: 'relative' }}
              >
                <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadNotificationsCount > 0 && (
                  <span style={{ position: 'absolute', top: 5, right: 5, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, minWidth: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 2px' }}>
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: -46, width: 320, maxWidth: 'calc(100vw - 32px)', background: '#fff', border: '1.5px solid #e9ecef', borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 1001 }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f3f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0d1117' }}>{t('Thông báo')}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{t('Bạn có {count} thông báo chưa đọc').replace('{count}', String(unreadNotificationsCount))}</div>
                    </div>
                  </div>

                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {notificationsLoading && notifications.length === 0 ? (
                      <div style={{ padding: '22px 16px', color: '#9ca3af', fontSize: 13.5 }}>{t('Đang tải...')}</div>
                    ) : notifications.length === 0 ? (
                      <div style={{ padding: '22px 16px', color: '#9ca3af', fontSize: 13.5, textAlign: 'center' }}>{t('Không có thông báo nào.')}</div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          style={{ width: '100%', padding: '12px 16px', background: item.readAt ? '#fff' : '#f8fafc', borderBottom: '1px solid #f4f5f7', display: 'flex', alignItems: 'flex-start', gap: 11, transition: 'background 0.15s' }}
                        >
                          <span style={{ width: 34, height: 34, borderRadius: 9, background: item.readAt ? '#f1f5f9' : '#eff6ff', color: item.readAt ? '#64748b' : '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: 'block', fontSize: 13.5, fontWeight: item.readAt ? 600 : 800, color: '#0d1117', lineHeight: 1.35 }}>{item.title}</span>
                            <span style={{ display: 'block', fontSize: 12.5, color: '#4b5563', marginTop: 2, wordBreak: 'break-word' }}>{item.message}</span>
                            <span style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                              {item.sentAt ? new Date(item.sentAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : ''}
                            </span>
                          </div>
                          {!item.readAt && (
                            <button
                              type="button"
                              onClick={(e) => handleMarkAsRead(e, item.id)}
                              style={{ border: 'none', background: 'none', color: '#3b82f6', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', padding: '2px 4px', whiteSpace: 'nowrap' }}
                              title={t('Đánh dấu đã đọc')}
                            >
                              {t('Đọc')}
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0d1117' }}>{user?.name?.split(' ').at(-1) || t('Hồ sơ')}</span>
                  <svg width="12" height="12" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {showMenu && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1.5px solid #e9ecef', borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.12)', minWidth: 200, overflow: 'hidden', zIndex: 1001 }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f3f5' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0d1117' }}>{user?.name}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{user?.email}</div>
                    </div>
                    {[
                      { to: '/profile', label: t('Hồ sơ') },
                      { to: '/orders', label: t('Đơn hàng') },
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setShowMenu(false)}
                        style={{ display: 'block', padding: '11px 16px', textDecoration: 'none', fontSize: 13.5, color: '#374151', fontWeight: 500 }}>
                        {item.label}
                      </Link>
                    ))}

                    {/* System settings */}
                    <div style={{ borderTop: '1px solid #f1f3f5', padding: '12px 16px 8px' }}>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: '#c4c9d4', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>
                        {t('Hệ thống')}
                      </div>

                      {/* Language */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#374151', fontWeight: 500 }}>
                          <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          {t('Ngôn ngữ')}
                        </div>
                        <div style={{ display: 'flex', background: '#f0f1f3', borderRadius: 6, padding: 2, gap: 1 }}>
                          {['VI', 'EN'].map(l => (
                            <button key={l} onClick={() => setLang(l.toLowerCase())}
                              style={{ padding: '3px 9px', borderRadius: 4, border: 'none', background: lang === l.toLowerCase() ? '#0d1117' : 'transparent', color: lang === l.toLowerCase() ? '#fff' : '#6b7280', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Theme */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#374151', fontWeight: 500 }}>
                          {theme === 'dark'
                            ? <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                            : <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                          }
                          {t('Giao diện')}
                        </div>
                        <div style={{ display: 'flex', background: '#f0f1f3', borderRadius: 6, padding: 2, gap: 1 }}>
                          <button onClick={() => setTheme('light')} title={t('Sáng')}
                            style={{ width: 30, height: 24, borderRadius: 4, border: 'none', background: theme === 'light' ? '#0d1117' : 'transparent', color: theme === 'light' ? '#fff' : '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                          </button>
                          <button onClick={() => setTheme('dark')} title={t('Tối')}
                            style={{ width: 30, height: 24, borderRadius: 4, border: 'none', background: theme === 'dark' ? '#0d1117' : 'transparent', color: theme === 'dark' ? '#fff' : '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f3f5' }}>
                      <button
                        onClick={() => { logout(); setShowMenu(false); navigate('/'); }}
                        style={{ display: 'block', width: '100%', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, color: '#e11d48', fontWeight: 600, fontFamily: 'inherit', textAlign: 'left' }}>
                        {t('Đăng xuất')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/sign-in"
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#0d1117', borderRadius: 9, color: '#fff', fontSize: 13.5, fontWeight: 700, textDecoration: 'none', flexShrink: 0, marginLeft: 4 }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {t('Đăng nhập')}
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
