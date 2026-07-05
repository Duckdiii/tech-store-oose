import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, adminStyles, LAST_BACKUP } from '../constants';
import { useAuth } from '../../../shared/context/AuthContext';
import { manageNotificationApi } from '../../../api/manageNotificationApi';

function getInitials(name, email) {
  const source = (name || email || 'Manager').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function getRoleLabel(role) {
  const normalizedRole = String(role || '').replace(/^ROLE_/, '').toUpperCase();
  if (normalizedRole === 'MANAGER') return 'Quản lý hệ thống';
  if (normalizedRole === 'STAFF') return 'Nhân viên cửa hàng';
  return 'Tài khoản TechStore';
}

export function ManagerLayout({ activeSection, title, query, onQueryChange, breadcrumbs, badges, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.email || 'Manager';
  const initials = getInitials(user?.name, user?.email);
  const roleLabel = getRoleLabel(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/sign-in');
  };

  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const loadNotifications = async () => {
    setNotifLoading(true);
    try {
      const data = await manageNotificationApi.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load manage notifications:', err);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    const normalizedRole = String(user?.role || '').replace(/^ROLE_/, '').toUpperCase();
    if (['STAFF', 'MANAGER'].includes(normalizedRole)) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const clickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await manageNotificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.readAt).length, [notifications]);

  const filteredNavItems = useMemo(() => {
    const normalizedRole = String(user?.role || '').replace(/^ROLE_/, '').toUpperCase();
    if (normalizedRole === 'STAFF') {
      return NAV_ITEMS.filter(([key]) => ['dashboard', 'orders', 'warehouse', 'suppliers', 'supply-orders'].includes(key));
    }
    return NAV_ITEMS;
  }, [user]);

  return (
    <div className="admin-shell">
      <style>{adminStyles}</style>
      <style>{`
        .admin-notif-bell {
          position: relative;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: none;
          border: 1px solid #cbd5e1;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-notif-bell:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #94a3b8;
        }
        .admin-notif-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
        }
        .admin-notif-dropdown {
          position: absolute;
          top: 48px;
          right: 0;
          width: 320px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
          z-index: 50;
          overflow: hidden;
        }
        .admin-notif-header {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin-notif-header h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }
        .admin-notif-list {
          max-height: 280px;
          overflow-y: auto;
        }
        .admin-notif-item {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: background 0.15s;
          cursor: pointer;
          position: relative;
          text-align: left;
        }
        .admin-notif-item:hover {
          background: #f8fafc;
        }
        .admin-notif-item.is-unread {
          background: #f0f9ff;
        }
        .admin-notif-item.is-unread:hover {
          background: #e0f2fe;
        }
        .admin-notif-item__unread-dot {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 6px;
          height: 6px;
          background: #3b82f6;
          border-radius: 50%;
        }
        .admin-notif-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
        }
        .admin-notif-msg {
          font-size: 12px;
          color: #475569;
          line-height: 1.4;
        }
        .admin-profile-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .admin-profile-dropdown {
          position: absolute;
          top: 48px;
          right: 0;
          width: 220px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
          z-index: 50;
          overflow: hidden;
        }
        .admin-profile-dropdown__head {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .admin-profile-dropdown__head strong {
          display: block;
          font-size: 13px;
          color: #0f172a;
        }
        .admin-profile-dropdown__head small {
          font-size: 11.5px;
          color: #94a3b8;
        }
        .admin-profile-dropdown__logout {
          display: block;
          width: 100%;
          padding: 11px 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          color: #e11d48;
          font-weight: 600;
          font-family: inherit;
          text-align: left;
        }
        .admin-profile-dropdown__logout:hover {
          background: #fef2f2;
        }
      `}</style>

      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span>TS</span>
          <div>TechStore<small>MANAGER PORTAL</small></div>
        </Link>
        <p className="admin-sidebar__label">ĐIỀU HƯỚNG</p>
        <nav>
          {filteredNavItems.map(([key, label]) => {
            const badge = badges?.[key];
            return (
              <Link
                key={key}
                className={`admin-nav-item ${activeSection === key ? 'is-active' : ''}`}
                to={`/manager/${key}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>{label}</span>
                {badge && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    lineHeight: 1,
                    padding: '3px 6px',
                    borderRadius: 10,
                    background: badge.warn ? '#f59e0b' : 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    minWidth: 18,
                    textAlign: 'center',
                    flexShrink: 0,
                  }}>
                    {badge.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar__foot">
          <div className="admin-user">
            <span>{initials}</span>
            <div><strong>{displayName}</strong><small>{roleLabel}</small></div>
          </div>
          <Link to="/" className="admin-back">← Về cửa hàng</Link>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            marginTop: 10,
            padding: '7px 10px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}>
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none" style={{ flexShrink: 0 }}>
              <path d="M5.5 0L0 2.167V6c0 3.148 2.333 5.5 5.5 6.5C8.667 11.5 11 9.148 11 6V2.167L5.5 0Z" fill="rgba(255,255,255,0.25)"/>
            </svg>
            <div style={{ fontSize: 10.5, lineHeight: 1.45, color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ display: 'block', fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em' }}>BACKUP LẦN CUỐI</span>
              {LAST_BACKUP}
            </div>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {(breadcrumbs || [{ label: 'Manager', to: '/manager/dashboard' }]).map((crumb, i, arr) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {i > 0 && <span style={{ color: '#cbd5e1', fontSize: 11 }}>›</span>}
                  {crumb.to
                    ? <Link to={crumb.to} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 12, fontWeight: 500 }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#374151'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                      >{crumb.label}</Link>
                    : <span style={{ color: i === arr.length - 1 ? '#374151' : '#94a3b8', fontSize: 12, fontWeight: i === arr.length - 1 ? 600 : 500 }}>{crumb.label}</span>
                  }
                </span>
              ))}
            </p>
            <h1>{title}</h1>
          </div>
          <div className="admin-topbar__actions">
            <label className="admin-search">
              <span>Tìm kiếm</span>
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Tìm trong trang..."
              />
            </label>

            <div ref={notifRef} style={{ position: 'relative' }}>
              <button className="admin-notif-bell" onClick={() => setShowNotif(!showNotif)} title="Thông báo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && <span className="admin-notif-badge">{unreadCount}</span>}
              </button>

              {showNotif && (
                <div className="admin-notif-dropdown">
                  <div className="admin-notif-header">
                    <h4>Thông báo</h4>
                    {unreadCount > 0 && (
                      <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600 }}>
                        {unreadCount} chưa đọc
                      </span>
                    )}
                  </div>
                  <div className="admin-notif-list">
                    {notifLoading && notifications.length === 0 ? (
                      <div style={{ padding: 16, textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>Đang tải thông báo...</div>
                    ) : notifications.length === 0 ? (
                      <div style={{ padding: 16, textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>Không có thông báo nào</div>
                    ) : (
                      notifications.map(item => (
                        <div
                          key={item.id}
                          className={`admin-notif-item ${!item.readAt ? 'is-unread' : ''}`}
                          onClick={() => !item.readAt && handleMarkAsRead(item.id)}
                        >
                          <div className="admin-notif-title">{item.title}</div>
                          <div className="admin-notif-msg">{item.message}</div>
                          {!item.readAt && <span className="admin-notif-item__unread-dot" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                className="admin-profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                title={displayName}
              >
                <div className="admin-profile">{initials}</div>
              </button>

              {showProfileMenu && (
                <div className="admin-profile-dropdown">
                  <div className="admin-profile-dropdown__head">
                    <strong>{displayName}</strong>
                    <small>{roleLabel}</small>
                  </div>
                  <button className="admin-profile-dropdown__logout" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <section className="admin-content">
          {children}
        </section>
      </main>
    </div>
  );
}
