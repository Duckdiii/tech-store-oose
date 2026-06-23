import { Link } from 'react-router-dom';

const PRODUCTS = ['iPhone', 'Samsung Galaxy', 'Xiaomi', 'OPPO', 'Vivo', 'Phụ kiện'];
const SUPPORT  = ['Hướng dẫn mua hàng', 'Chính sách bảo hành', 'Đổi trả hàng', 'Theo dõi đơn hàng', 'Câu hỏi thường gặp', 'Liên hệ'];

export function Footer() {
  return (
    <footer style={{ background: '#060b12', paddingTop: 64, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48, paddingBottom: 56 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                  <rect x="3" y="1" width="14" height="22" rx="3.5" fill="#0d1117"/>
                  <rect x="7" y="19" width="6" height="2" rx="1" fill="#fff"/>
                </svg>
              </div>
              <span style={{ fontSize: 21, fontWeight: 900, color: '#fff', letterSpacing: -0.8 }}>TechStore</span>
            </div>
            <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.75, marginBottom: 24, maxWidth: 280 }}>
              Hệ thống bán lẻ điện thoại chính hãng hàng đầu Việt Nam. Cam kết uy tín, chất lượng và dịch vụ tốt nhất.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['f', 'YT', 'IG', 'TK'].map(s => (
                <a key={s} href="#" style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', textDecoration: 'none', fontSize: 11, fontWeight: 800 }}>{s}</a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>Sản phẩm</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PRODUCTS.map(p => (
                <Link key={p} to="/products" style={{ fontSize: 13.5, color: '#334155', textDecoration: 'none', fontWeight: 500 }}>{p}</Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>Hỗ trợ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SUPPORT.map(s => (
                <a key={s} href="#" style={{ fontSize: 13.5, color: '#334155', textDecoration: 'none', fontWeight: 500 }}>{s}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>Liên hệ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <span style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6 }}>123 Đường Nguyễn Huệ, Q.1, TP.HCM</span>
              <span style={{ fontSize: 13.5, color: '#334155', fontWeight: 500 }}>1800 6789 (miễn phí)</span>
              <span style={{ fontSize: 13.5, color: '#334155' }}>support@techstore.vn</span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Thanh toán</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['VISA', 'Master', 'ATM', 'MoMo', 'ZaloPay', 'COD'].map(m => (
                  <span key={m} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11, color: '#64748b', fontWeight: 600 }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12.5, color: '#1e293b' }}>© 2025 TechStore. Bảo lưu mọi quyền.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Điều khoản sử dụng', 'Chính sách bảo mật', 'Cookie'].map(t => (
              <a key={t} href="#" style={{ fontSize: 12.5, color: '#1e293b', textDecoration: 'none' }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
