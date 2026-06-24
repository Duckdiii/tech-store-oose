import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';

const CATEGORIES = [
  { id: 1, icon: '🍎', name: 'Apple', count: '43 sản phẩm' },
  { id: 2, icon: '📱', name: 'Samsung', count: '87 sản phẩm' },
  { id: 3, icon: '⚡', name: 'Xiaomi', count: '52 sản phẩm' },
  { id: 4, icon: '🔵', name: 'OPPO', count: '38 sản phẩm' },
  { id: 5, icon: '🌟', name: 'Vivo', count: '29 sản phẩm' },
  { id: 6, icon: '🎯', name: 'Realme', count: '24 sản phẩm' },
];

const PRODUCTS = [
  { id: 1, brand: 'Apple', name: 'iPhone 15 Pro Max 256GB', price: 34990000, oldPrice: 38000000, rating: 4.9, reviews: '2.4K', discount: '-8%', tag: 'Mới', tagBg: '#0d1117' },
  { id: 2, brand: 'Samsung', name: 'Samsung Galaxy S24 Ultra 512GB', price: 28990000, oldPrice: 33000000, rating: 4.8, reviews: '1.8K', discount: '-12%', tag: 'Hot', tagBg: '#e11d48' },
  { id: 3, brand: 'Xiaomi', name: 'Xiaomi 14 Pro 512GB', price: 18990000, oldPrice: 21000000, rating: 4.7, reviews: '956', discount: '-10%', tag: 'Mới', tagBg: '#0d1117' },
  { id: 4, brand: 'OPPO', name: 'OPPO Find X7 Pro 256GB', price: 24990000, oldPrice: 27000000, rating: 4.6, reviews: '743', discount: '-7%', tag: 'Sale', tagBg: '#f59e0b' },
  { id: 5, brand: 'Apple', name: 'iPhone 15 128GB', price: 22990000, oldPrice: 25000000, rating: 4.8, reviews: '3.1K', discount: '-8%', tag: 'Mới', tagBg: '#0d1117' },
  { id: 6, brand: 'Samsung', name: 'Samsung Galaxy Z Fold 5 256GB', price: 43990000, oldPrice: 48000000, rating: 4.7, reviews: '621', discount: '-8%', tag: 'Hot', tagBg: '#e11d48' },
  { id: 7, brand: 'Vivo', name: 'Vivo X100 Pro 256GB', price: 19990000, oldPrice: 22000000, rating: 4.6, reviews: '412', discount: '-9%', tag: 'Mới', tagBg: '#0d1117' },
  { id: 8, brand: 'Xiaomi', name: 'Xiaomi Redmi Note 13 Pro 256GB', price: 7490000, oldPrice: 9000000, rating: 4.7, reviews: '1.5K', discount: '-17%', tag: 'Sale', tagBg: '#f59e0b' },
];

const FLASH_PRODUCTS = [
  { id: 101, name: 'iPhone 14 128GB', price: 18990000, oldPrice: 22990000, discount: '-17%', sold: 87, total: 100, soldPct: 87 },
  { id: 102, name: 'Samsung S23 FE 256GB', price: 10990000, oldPrice: 14990000, discount: '-27%', sold: 64, total: 80, soldPct: 80 },
  { id: 103, name: 'Xiaomi Redmi 12C 128GB', price: 3490000, oldPrice: 4290000, discount: '-19%', sold: 112, total: 150, soldPct: 75 },
  { id: 104, name: 'OPPO A78 256GB', price: 6290000, oldPrice: 8490000, discount: '-26%', sold: 53, total: 70, soldPct: 76 },
  { id: 105, name: 'Realme C55 128GB', price: 4490000, oldPrice: 5790000, discount: '-22%', sold: 38, total: 60, soldPct: 63 },
];

const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Realme', 'Nokia'];

const REVIEWS = [
  { name: 'Nguyễn Thị Hoa', avatar: 'NH', product: 'iPhone 15 Pro Max', date: '12/06/2025', text: 'Shop bán hàng uy tín, giao hàng nhanh, máy chính hãng 100%. Mình đã mua lần 3 rồi, lần nào cũng hài lòng!' },
  { name: 'Trần Văn Minh', avatar: 'TM', product: 'Samsung Galaxy S24', date: '08/06/2025', text: 'Giá tốt hơn các shop khác, được tặng kèm ốp lưng và cường lực. Nhân viên tư vấn nhiệt tình, chuyên nghiệp.' },
  { name: 'Lê Thị Lan', avatar: 'LL', product: 'Xiaomi 14 Pro', date: '05/06/2025', text: 'Máy đẹp, mượt, đúng hàng chính hãng. Bao bì nguyên seal, giao hàng đúng hẹn. Sẽ giới thiệu bạn bè!' },
];

const BLOGS = [
  { category: 'Review', date: '15/06/2025', readTime: '5 phút đọc', tag: 'iPhone', title: 'iPhone 15 Pro Max sau 6 tháng sử dụng: Có còn đáng mua?', excerpt: 'Sau nửa năm trải nghiệm thực tế, chúng tôi đánh giá toàn diện hiệu suất, camera và thời lượng pin của iPhone 15 Pro Max...' },
  { category: 'Tin tức', date: '12/06/2025', readTime: '3 phút đọc', tag: 'Samsung', title: 'Samsung Galaxy S25 Ultra lộ diện: Thiết kế mới hoàn toàn?', excerpt: 'Các tài liệu rò rỉ mới nhất cho thấy Samsung sẽ thay đổi hoàn toàn thiết kế dòng S25 Ultra với viền phẳng và S Pen cải tiến...' },
  { category: 'Hướng dẫn', date: '10/06/2025', readTime: '7 phút đọc', tag: 'Tips', title: 'Top 5 mẹo tiết kiệm pin điện thoại Android hiệu quả nhất 2025', excerpt: 'Những cài đặt đơn giản nhưng cực kỳ hiệu quả giúp điện thoại Android của bạn sử dụng được lâu hơn mà không ảnh hưởng hiệu năng...' },
];

function fmt(n) { return n.toLocaleString('vi-VN'); }
function pad(n) { return String(n).padStart(2, '0'); }

function useCountdown(h0 = 5) {
  const [t, setT] = useState({ h: h0, m: 59, s: 59 });
  useEffect(() => {
    const id = setInterval(() => setT(prev => {
      let { h, m, s } = prev;
      s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = h0; m = 59; s = 59; }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(id);
  }, [h0]);
  return t;
}

export function HomePage() {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Mới nhất');
  const cd = useCountdown(5);

  return (
    <main>
      {/* ===== HERO ===== */}
      <section style={{ background: '#0d1117', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', minHeight: 576, gap: 48, position: 'relative' }}>
          <div style={{ padding: '80px 0', animation: 'fadeUp 0.65s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, background: '#4ade80', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }}/>
              <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Hàng chính hãng · Bảo hành 12 tháng</span>
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: -2, marginBottom: 22 }}>
              Công Nghệ<br/><span style={{ color: '#475569' }}>Trong Tầm</span><br/>Tay Bạn
            </h1>
            <p style={{ fontSize: 15.5, color: '#4b5563', lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
              Hàng ngàn sản phẩm điện thoại chính hãng từ Apple, Samsung, Xiaomi và các thương hiệu hàng đầu. Giao hàng toàn quốc, đổi trả trong 30 ngày.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 56 }}>
              <button onClick={() => navigate('/products')} style={{ padding: '14px 28px', background: '#fff', color: '#0d1117', border: 'none', borderRadius: 9, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>Mua sắm ngay →</button>
              <button style={{ padding: '14px 26px', background: 'transparent', color: '#64748b', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 9, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Xem Flash Sale ⚡</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 32 }}>
              {[['500+','Sản phẩm'],['50K+','Khách hàng'],['4.9★','Đánh giá'],['30','Ngày đổi trả']].map(([val, label], i) => (
                <div key={label} style={{ flex: 1, textAlign: 'center', padding: '0 12px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: -1.5, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#334155', marginTop: 5, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', position: 'relative', animation: 'fadeIn 0.8s ease both 0.2s' }}>
            <div style={{ position: 'absolute', width: 400, height: 400, border: '1px solid rgba(255,255,255,0.04)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}/>
            <div style={{ position: 'absolute', width: 280, height: 280, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}/>
            <div style={{ animation: 'float 4s ease-in-out infinite', position: 'relative', zIndex: 2 }}>
              <div style={{ width: 212, height: 396, background: 'linear-gradient(158deg,#1e293b 0%,#0d1117 100%)', borderRadius: 40, border: '2px solid #2d3f56', boxShadow: '0 48px 96px rgba(0,0,0,0.7)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 88, height: 22, background: '#000', borderRadius: 11, zIndex: 4 }}/>
                <div style={{ position: 'absolute', top: 12, left: 6, right: 6, bottom: 6, background: 'linear-gradient(168deg,#1a2d48 0%,#0d1b2e 45%,#111827 100%)', borderRadius: 35, overflow: 'hidden', padding: '50px 14px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>9:41</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'rgba(255,255,255,0.85)', marginBottom: 10 }}>TechStore</div>
                  <div style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(99,102,241,0.15))', borderRadius: 12, height: 80, display: 'flex', alignItems: 'center', padding: '0 14px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 10 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>34.990.000₫</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 9, height: 56 }}/>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 9, height: 56 }}/>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 9, height: 40 }}/>
                </div>
                <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: 72, height: 4, background: 'rgba(255,255,255,0.28)', borderRadius: 2 }}/>
              </div>
            </div>
            <div style={{ position: 'absolute', top: '16%', right: '-4%', background: '#fff', borderRadius: 14, padding: '12px 16px', boxShadow: '0 12px 32px rgba(0,0,0,0.3)', zIndex: 5 }}>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>iPhone 15 Pro Max</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#0d1117' }}>34.990.000₫</div>
              <div style={{ fontSize: 11.5, color: '#e11d48', fontWeight: 700, marginTop: 3 }}>↓ Giảm 3.000.000₫</div>
            </div>
            <div style={{ position: 'absolute', bottom: '20%', left: '-4%', background: '#fff', borderRadius: 14, padding: '11px 15px', boxShadow: '0 12px 32px rgba(0,0,0,0.3)', zIndex: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#0d1117' }}>4.9</div>
                <div>
                  <div style={{ fontSize: 13, color: '#f59e0b' }}>★★★★★</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>2.4K đánh giá</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f3f5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[
            { icon: '🛡️', title: 'Bảo hành chính hãng', sub: '12 tháng tại TTBH hãng' },
            { icon: '🚚', title: 'Giao hàng toàn quốc', sub: 'Miễn phí từ 500.000₫' },
            { icon: '🔄', title: 'Đổi trả dễ dàng', sub: '30 ngày không cần lý do' },
            { icon: '💳', title: 'Thanh toán linh hoạt', sub: 'Trả góp 0% lãi suất' },
          ].map((b, i) => (
            <div key={b.title} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 24px', borderRight: i < 3 ? '1px solid #f1f3f5' : 'none' }}>
              <div style={{ width: 42, height: 42, background: '#f4f5f7', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0d1117' }}>{b.title}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CATEGORIES ===== */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 2.5, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Danh mục</span>
              <h2 style={{ fontSize: 34, fontWeight: 900, color: '#0d1117', letterSpacing: -1, lineHeight: 1.1 }}>Chọn theo thương hiệu</h2>
            </div>
            <Link to="/products" style={{ fontSize: 14, fontWeight: 700, color: '#374151', textDecoration: 'none' }}>Xem tất cả →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.id} to={`/products?brand=${cat.name}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '28px 12px', background: '#f8f9fa', border: '1.5px solid #f1f3f5', borderRadius: 16, textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.07)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#f8f9fa'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
                <div style={{ width: 54, height: 54, background: '#0d1117', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{cat.icon}</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0d1117', marginBottom: 4 }}>{cat.name}</div>
                  <div style={{ fontSize: 11.5, color: '#9ca3af' }}>{cat.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section style={{ background: '#f4f5f7', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 2.5, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Sản phẩm</span>
              <h2 style={{ fontSize: 34, fontWeight: 900, color: '#0d1117', letterSpacing: -1, lineHeight: 1.1 }}>Điện thoại nổi bật</h2>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Mới nhất','Bán chạy','Giảm giá'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '8px 16px', background: activeTab===tab ? '#0d1117' : '#fff', color: activeTab===tab ? '#fff' : '#4b5563', border: activeTab===tab ? 'none' : '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {PRODUCTS.map(item => (
              <div key={item.id}
                style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.22s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 10px 32px rgba(0,0,0,0.09)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
                <div style={{ background: 'linear-gradient(148deg,#f4f5f7 0%,#eaecf0 100%)', padding: '28px 20px', height: 196, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <svg width="72" height="120" viewBox="0 0 72 120" fill="none">
                    <rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/>
                    <rect x="7" y="7" width="58" height="106" rx="13" stroke="#c4c9d4" strokeWidth="1.5"/>
                    <rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/>
                    <rect x="24" y="11" width="24" height="5" rx="2.5" fill="#b8bdc8"/>
                    <circle cx="36" cy="105" r="5" fill="#b8bdc8"/>
                  </svg>
                  <span style={{ position: 'absolute', top: 11, right: 11, background: '#e11d48', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 5 }}>{item.discount}</span>
                  <span style={{ position: 'absolute', top: 11, left: 11, background: item.tagBg, color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 5 }}>{item.tag}</span>
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>{item.brand}</div>
                  <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#0d1117', marginBottom: 9, lineHeight: 1.35 }}>{item.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <span style={{ fontSize: 12.5, color: '#f59e0b', letterSpacing: 1 }}>★★★★★</span>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{item.rating} ({item.reviews})</span>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 19, fontWeight: 900, color: '#0d1117', letterSpacing: -0.5 }}>{fmt(item.price)}₫</span>
                    <span style={{ fontSize: 12, color: '#c4c9d4', textDecoration: 'line-through', marginLeft: 8 }}>{fmt(item.oldPrice)}₫</span>
                  </div>
                  <button onClick={() => addItem(item)}
                    style={{ width: '100%', padding: 10, background: '#0d1117', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background='#1e293b'}
                    onMouseLeave={e => e.currentTarget.style.background='#0d1117'}>
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link to="/products" style={{ display: 'inline-block', padding: '13px 40px', background: '#fff', color: '#0d1117', border: '2px solid #0d1117', borderRadius: 9, fontSize: 14.5, fontWeight: 800, textDecoration: 'none' }}>
              Xem tất cả sản phẩm →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FLASH SALE ===== */}
      <section style={{ background: '#0d1117', padding: '64px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%,rgba(225,29,72,0.06) 0%,transparent 50%)', pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: -1.2 }}>FLASH SALE</span>
                  <span style={{ fontSize: 28 }}>⚡</span>
                  <span style={{ background: '#e11d48', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 5 }}>Giá sốc</span>
                </div>
                <span style={{ fontSize: 13, color: '#475569' }}>Số lượng có hạn — Nhanh tay kẻo lỡ!</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 20px' }}>
                <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>Kết thúc sau:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {[cd.h, cd.m, cd.s].map((v, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ background: '#e11d48', color: '#fff', fontSize: 24, fontWeight: 900, minWidth: 52, textAlign: 'center', borderRadius: 8, padding: '7px 10px', lineHeight: 1, display: 'inline-block' }}>{pad(v)}</span>
                      {i < 2 && <span style={{ color: '#e11d48', fontSize: 22, fontWeight: 900 }}>:</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/products" style={{ fontSize: 14, fontWeight: 700, color: '#475569', textDecoration: 'none' }}>Xem tất cả →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
            {FLASH_PRODUCTS.map(fp => (
              <div key={fp.id}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.transform='none'; }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 132, marginBottom: 14, position: 'relative' }}>
                  <svg width="66" height="108" viewBox="0 0 66 108" fill="none">
                    <rect x="5" y="5" width="56" height="98" rx="12" fill="#1e293b" stroke="#2d3f56" strokeWidth="1.5"/>
                    <rect x="11" y="20" width="44" height="64" rx="5" fill="#0d1117" opacity="0.8"/>
                    <circle cx="33" cy="95" r="4.5" fill="#2d3f56"/>
                  </svg>
                  <div style={{ position: 'absolute', top: 0, right: 0, background: '#e11d48', color: '#fff', fontSize: 13.5, fontWeight: 900, padding: '4px 10px', borderRadius: 8 }}>{fp.discount}</div>
                </div>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: '#e2e8f0', marginBottom: 9, lineHeight: 1.3 }}>{fp.name}</h4>
                <div style={{ marginBottom: 13 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{fmt(fp.price)}₫</div>
                  <div style={{ fontSize: 12, color: '#334155', textDecoration: 'line-through', marginTop: 2 }}>{fmt(fp.oldPrice)}₫</div>
                </div>
                <div style={{ marginBottom: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#475569' }}>Đã bán: {fp.sold}/{fp.total}</span>
                    <span style={{ fontSize: 11, color: '#e11d48', fontWeight: 700 }}>{fp.soldPct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg,#e11d48,#f43f5e)', borderRadius: 3, width: `${fp.soldPct}%` }}/>
                  </div>
                </div>
                <button onClick={() => addItem({ id: fp.id, name: fp.name, price: fp.price, brand: '' })}
                  style={{ width: '100%', padding: 9, background: 'rgba(225,29,72,0.12)', color: '#f43f5e', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#e11d48'; e.currentTarget.style.color='#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(225,29,72,0.12)'; e.currentTarget.style.color='#f43f5e'; }}>
                  Mua ngay
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section style={{ background: '#fff', padding: '64px 0', borderTop: '1px solid #f1f3f5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 2.5, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Đối tác</span>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: '#0d1117', letterSpacing: -1 }}>Thương hiệu chính hãng</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 12 }}>
            {BRANDS.map(brand => (
              <Link key={brand} to={`/products?brand=${brand}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '22px 12px', border: '1.5px solid #f1f3f5', borderRadius: 14, textDecoration: 'none', fontSize: 17, fontWeight: 900, color: '#111827', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 4px 14px rgba(0,0,0,0.06)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section style={{ background: '#f4f5f7', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 2.5, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Đánh giá</span>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: '#0d1117', letterSpacing: -1 }}>Khách hàng nói gì về chúng tôi</h2>
            <p style={{ fontSize: 15, color: '#6b7280', marginTop: 12 }}>Hơn 50.000 khách hàng tin tưởng và lựa chọn TechStore</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {REVIEWS.map(rev => (
              <div key={rev.name} style={{ background: '#fff', borderRadius: 18, padding: '28px 28px 24px', border: '1.5px solid #f1f3f5' }}>
                <div style={{ fontSize: 44, color: '#e9ecef', fontFamily: 'Georgia,serif', lineHeight: 0.8, marginBottom: 14 }}>"</div>
                <div style={{ fontSize: 14, color: '#f59e0b', letterSpacing: 2, marginBottom: 14 }}>★★★★★</div>
                <p style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.75, marginBottom: 22, fontStyle: 'italic' }}>{rev.text}</p>
                <div style={{ height: 1, background: '#f1f3f5', marginBottom: 18 }}/>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, background: '#0d1117', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>{rev.avatar}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0d1117' }}>{rev.name}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Đã mua: {rev.product}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#d1d5db' }}>{rev.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 2.5, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Blog</span>
              <h2 style={{ fontSize: 34, fontWeight: 900, color: '#0d1117', letterSpacing: -1 }}>Tin tức công nghệ</h2>
            </div>
            <a href="#" style={{ fontSize: 14, fontWeight: 700, color: '#374151', textDecoration: 'none' }}>Tất cả bài viết →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {BLOGS.map(post => (
              <article key={post.title}
                style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #f1f3f5', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.22s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.07)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
                <div style={{ height: 196, background: 'linear-gradient(148deg,#e9ecef 0%,#d5dae2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <svg width="44" height="44" fill="none" stroke="#b0b8c4" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <div style={{ position: 'absolute', top: 14, left: 14, background: '#0d1117', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 5 }}>{post.category}</div>
                </div>
                <div style={{ padding: '22px 22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 13 }}>
                    <span style={{ fontSize: 11.5, color: '#9ca3af' }}>{post.date}</span>
                    <span style={{ color: '#e5e7eb' }}>·</span>
                    <span style={{ fontSize: 11.5, color: '#9ca3af' }}>{post.readTime}</span>
                    <span style={{ background: '#f4f5f7', color: '#374151', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, marginLeft: 'auto' }}>{post.tag}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0d1117', marginBottom: 10, lineHeight: 1.4 }}>{post.title}</h3>
                  <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.65, marginBottom: 18, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                  <a href="#" style={{ fontSize: 13.5, fontWeight: 700, color: '#0d1117', textDecoration: 'none' }}>Đọc thêm →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section style={{ background: '#0d1117', padding: '72px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 32px', textAlign: 'center', position: 'relative' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#334155', letterSpacing: 2.5, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Newsletter</span>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: '#fff', letterSpacing: -1.5, marginBottom: 14, lineHeight: 1.1 }}>Đừng bỏ lỡ ưu đãi</h2>
          <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7, marginBottom: 32 }}>Đăng ký để nhận thông báo Flash Sale, sản phẩm mới và voucher độc quyền sớm nhất.</p>
          <div style={{ display: 'flex', gap: 10, maxWidth: 460, margin: '0 auto 16px' }}>
            <input type="email" placeholder="Nhập địa chỉ email của bạn..." style={{ flex: 1, height: 48, padding: '0 18px', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', outline: 'none' }}/>
            <button style={{ padding: '0 22px', height: 48, background: '#fff', color: '#0d1117', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>Đăng ký</button>
          </div>
        </div>
      </section>
    </main>
  );
}
