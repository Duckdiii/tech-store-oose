import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { authApi } from '../../../api/authApi';

export function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || !form.password) { setError('Vui lòng điền đầy đủ thông tin.'); return; }
    if (form.password !== form.confirm) { setError('Mật khẩu xác nhận không khớp.'); return; }
    if (form.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
    setLoading(true);
    try {
      await authApi.register(form.name, form.email, form.phone, form.password);
      await login(form.email, form.password);
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Đăng ký thất bại. Email có thể đã tồn tại hoặc định dạng dữ liệu không hợp lệ.';
      setError(errMsg);
    }
  };

  const fields = [
    { key: 'name',     label: 'Họ và tên',           type: 'text',     placeholder: 'Nguyễn Văn An' },
    { key: 'email',    label: 'Email',                type: 'email',    placeholder: 'ten@email.com' },
    { key: 'phone',    label: 'Số điện thoại',        type: 'tel',      placeholder: '0901 234 567' },
    { key: 'password', label: 'Mật khẩu',             type: 'password', placeholder: '••••••••' },
    { key: 'confirm',  label: 'Xác nhận mật khẩu',   type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, background: '#0d1117', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="26" viewBox="0 0 20 24" fill="none">
                <rect x="3" y="1" width="14" height="22" rx="3.5" fill="white" opacity="0.95"/>
                <rect x="7" y="19" width="6" height="2" rx="1" fill="#0d1117"/>
              </svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#0d1117', letterSpacing: -0.8 }}>TechStore</span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0d1117', marginTop: 28, marginBottom: 6, letterSpacing: -0.5 }}>Tạo tài khoản</h1>
          <p style={{ fontSize: 14, color: '#6b7280' }}>Mua sắm dễ dàng, tích điểm ưu đãi!</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e9ecef', padding: '36px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, padding: '12px 16px', marginBottom: 20, fontSize: 13.5, color: '#dc2626' }}>
                {error}
              </div>
            )}

            {fields.map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 7 }}>{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={set(f.key)}
                  style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid #e9ecef', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', color: '#0d1117', outline: 'none', background: '#fff' }}
                />
              </div>
            ))}

            <div style={{ marginTop: 8, marginBottom: 24 }}>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" required style={{ marginTop: 3, accentColor: '#0d1117' }}/>
                <span style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                  Tôi đồng ý với <a href="#" style={{ color: '#0d1117', fontWeight: 600 }}>Điều khoản sử dụng</a> và <a href="#" style={{ color: '#0d1117', fontWeight: 600 }}>Chính sách bảo mật</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', height: 48, background: loading ? '#374151' : '#0d1117', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 24 }}>
          Đã có tài khoản?{' '}
          <Link to="/sign-in" style={{ color: '#0d1117', fontWeight: 700, textDecoration: 'none' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
