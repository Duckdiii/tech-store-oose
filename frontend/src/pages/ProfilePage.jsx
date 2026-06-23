import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, login, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('info');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', birthday: '', gender: '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [saved, setSaved] = useState(false);

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#f4f5f7' }}>
        <div style={{ fontSize: 56 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117' }}>Vui lòng đăng nhập</h2>
        <Link to="/sign-in" style={{ padding: '12px 28px', background: '#0d1117', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Đăng nhập ngay</Link>
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

  const TABS = [
    { id: 'info',    label: '👤 Thông tin cá nhân' },
    { id: 'address', label: '📍 Địa chỉ giao hàng' },
    { id: 'password',label: '🔒 Đổi mật khẩu' },
    { id: 'orders',  label: '📦 Đơn hàng', link: '/orders' },
  ];

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  );

  const Input = ({ value, onChange, ...rest }) => (
    <input value={value} onChange={onChange} {...rest}
      style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', color: '#0d1117', outline: 'none', background: '#fff', ...rest.style }}/>
  );

  return (
    <div style={{ background: '#f4f5f7', minHeight: '80vh', padding: '32px 0 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chủ</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 600 }}>Tài khoản</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', overflow: 'hidden' }}>
            {/* Avatar */}
            <div style={{ padding: '28px 20px', textAlign: 'center', borderBottom: '1px solid #f1f3f5' }}>
              <div style={{ width: 72, height: 72, background: '#0d1117', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 auto 12px' }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0d1117', marginBottom: 4 }}>{user?.name}</div>
              <div style={{ fontSize: 12.5, color: '#9ca3af' }}>{user?.email}</div>
            </div>
            {/* Nav */}
            <div style={{ padding: '8px' }}>
              {TABS.map(t => (
                t.link ? (
                  <Link key={t.id} to={t.link}
                    style={{ display: 'block', padding: '11px 14px', borderRadius: 9, fontSize: 13.5, fontWeight: 500, color: '#6b7280', textDecoration: 'none', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f4f5f7'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    {t.label}
                  </Link>
                ) : (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    style={{ display: 'block', width: '100%', padding: '11px 14px', borderRadius: 9, border: 'none', fontSize: 13.5, fontWeight: tab===t.id ? 700 : 500, background: tab===t.id ? '#f4f5f7' : 'transparent', color: tab===t.id ? '#0d1117' : '#6b7280', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s' }}>
                    {t.label}
                  </button>
                )
              ))}
              <div style={{ borderTop: '1px solid #f1f3f5', margin: '8px 0', padding: '8px 0' }}>
                <button onClick={() => { logout(); navigate('/'); }}
                  style={{ display: 'block', width: '100%', padding: '11px 14px', borderRadius: 9, border: 'none', fontSize: 13.5, fontWeight: 600, background: 'transparent', color: '#e11d48', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                  🚪 Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Main panel */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', padding: '28px 32px' }}>
            {tab === 'info' && (
              <form onSubmit={handleSave}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0d1117', marginBottom: 24, letterSpacing: -0.3 }}>Thông tin cá nhân</h2>
                {saved && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9, padding: '12px 16px', marginBottom: 20, fontSize: 13.5, color: '#16a34a', fontWeight: 600 }}>
                    ✓ Cập nhật thành công!
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <Field label="Họ và tên *">
                    <Input value={form.name} onChange={set('name')} placeholder="Nguyễn Văn An"/>
                  </Field>
                  <Field label="Email">
                    <Input value={form.email} onChange={set('email')} type="email" placeholder="ten@email.com"/>
                  </Field>
                  <Field label="Số điện thoại">
                    <Input value={form.phone} onChange={set('phone')} placeholder="0901 234 567"/>
                  </Field>
                  <Field label="Ngày sinh">
                    <Input value={form.birthday} onChange={set('birthday')} type="date"/>
                  </Field>
                </div>
                <Field label="Giới tính">
                  <div style={{ display: 'flex', gap: 12 }}>
                    {['Nam','Nữ','Khác'].map(g => (
                      <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '10px 16px', border: `1.5px solid ${form.gender===g ? '#0d1117' : '#e9ecef'}`, borderRadius: 9, background: form.gender===g ? '#f8f9fa' : '#fff' }}>
                        <input type="radio" name="gender" value={g} checked={form.gender===g} onChange={set('gender')} style={{ accentColor: '#0d1117' }}/>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{g}</span>
                      </label>
                    ))}
                  </div>
                </Field>
                <button type="submit" style={{ padding: '12px 32px', background: '#0d1117', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }}>
                  Lưu thay đổi
                </button>
              </form>
            )}

            {tab === 'address' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0d1117', letterSpacing: -0.3 }}>Địa chỉ giao hàng</h2>
                  <button style={{ padding: '10px 18px', background: '#0d1117', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ Thêm địa chỉ</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { name: user?.name, phone: user?.phone || '0901 234 567', address: '123 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM', default: true },
                  ].map((addr, i) => (
                    <div key={i} style={{ padding: '18px 20px', border: `1.5px solid ${addr.default ? '#0d1117' : '#e9ecef'}`, borderRadius: 14, position: 'relative' }}>
                      {addr.default && <span style={{ position: 'absolute', top: 12, right: 12, background: '#0d1117', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 5 }}>Mặc định</span>}
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0d1117', marginBottom: 4 }}>{addr.name}</div>
                      <div style={{ fontSize: 13.5, color: '#6b7280', marginBottom: 2 }}>{addr.phone}</div>
                      <div style={{ fontSize: 13.5, color: '#6b7280' }}>{addr.address}</div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                        <button style={{ fontSize: 13, color: '#0d1117', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Chỉnh sửa</button>
                        {!addr.default && <button style={{ fontSize: 13, color: '#e11d48', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Xóa</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'password' && (
              <form onSubmit={e => { e.preventDefault(); alert('Đổi mật khẩu thành công!'); setPwForm({ current: '', next: '', confirm: '' }); }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0d1117', marginBottom: 24, letterSpacing: -0.3 }}>Đổi mật khẩu</h2>
                {[
                  { key: 'current', label: 'Mật khẩu hiện tại' },
                  { key: 'next',    label: 'Mật khẩu mới' },
                  { key: 'confirm', label: 'Xác nhận mật khẩu mới' },
                ].map(f => (
                  <Field key={f.key} label={f.label}>
                    <Input type="password" value={pwForm[f.key]} onChange={setPw(f.key)} placeholder="••••••••"/>
                  </Field>
                ))}
                <button type="submit" style={{ padding: '12px 32px', background: '#0d1117', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }}>
                  Cập nhật mật khẩu
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
