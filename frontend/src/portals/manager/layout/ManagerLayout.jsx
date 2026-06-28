import { Link } from 'react-router-dom';
import { NAV_ITEMS, adminStyles, LAST_BACKUP } from '../constants';
import { useAuth } from '../../../shared/context/AuthContext';

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
  const { user } = useAuth();
  const displayName = user?.name || user?.email || 'Manager';
  const initials = getInitials(user?.name, user?.email);
  const roleLabel = getRoleLabel(user?.role);

  return (
    <div className="admin-shell">
      <style>{adminStyles}</style>

      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span>TS</span>
          <div>TechStore<small>MANAGER PORTAL</small></div>
        </Link>
        <p className="admin-sidebar__label">ĐIỀU HƯỚNG</p>
        <nav>
          {NAV_ITEMS.map(([key, label]) => {
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
            <div className="admin-profile" title={displayName}>{initials}</div>
          </div>
        </header>
        <section className="admin-content">
          {children}
        </section>
      </main>
    </div>
  );
}
