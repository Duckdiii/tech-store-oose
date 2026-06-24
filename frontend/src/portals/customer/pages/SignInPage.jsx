import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';

export function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Vui lòng điền đầy đủ thông tin.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    login({ id: 1, name: 'Nguyễn Văn An', email: form.email, phone: '0901234567' });
    setLoading(false);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, background: '#0d1117', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="26" viewBox="0 0 20 24" fill="none">
                <rect x="3" y="1" width="14" height="22" rx="3.5" fill="white" opacity="0.95"/>
                <rect x="7" y="19" width="6" height="2" rx="1" fill="#0d1117"/>
              </svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#0d1117', letterSpacing: -0.8 }}>TechStore</span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0d1117', marginTop: 28, marginBottom: 6, letterSpacing: -0.5 }}>Đăng nhập</h1>
          <p style={{ fontSize: 14, color: '#6b7280' }}>Chào mừng bạn quay trở lại!</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e9ecef', padding: '36px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, padding: '12px 16px', marginBottom: 20, fontSize: 13.5, color: '#dc2626' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Email</label>
              <input type="email" placeholder="ten@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', color: '#0d1117', outline: 'none', background: '#fff' }}/>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Mật khẩu</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', color: '#0d1117', outline: 'none', background: '#fff' }}/>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <a href="#" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>Quên mật khẩu?</a>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', height: 48, background: loading ? '#374151' : '#0d1117', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập →'}
            </button>

            <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: '#f1f3f5' }}/>
              <span style={{ fontSize: 12.5, color: '#9ca3af', fontWeight: 500 }}>hoặc</span>
              <div style={{ flex: 1, height: 1, background: '#f1f3f5' }}/>
            </div>

            <button type="button" style={{ width: '100%', height: 44, background: '#fff', color: '#374151', border: '1.5px solid #e9ecef', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.6 0 6.6 5.5 2.6 13.5l7.8 6.1C12.3 13.5 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4C42.8 36.9 46.1 31.1 46.1 24.5z"/><path fill="#FBBC05" d="M10.4 28.6c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.8-4.6l-7.8-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.7l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7-5.4c-2 1.4-4.6 2.2-8.2 2.2-6.3 0-11.7-4.2-13.6-10l-7.8 6.1C6.6 42.5 14.6 48 24 48z"/></svg>
              Tiếp tục với Google
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 24 }}>
          Chưa có tài khoản?{' '}
          <Link to="/sign-up" style={{ color: '#0d1117', fontWeight: 700, textDecoration: 'none' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
