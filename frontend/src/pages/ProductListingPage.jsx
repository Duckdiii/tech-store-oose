import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ALL_PRODUCTS = [
  { id: 1, brand: 'Apple', name: 'iPhone 15 Pro Max 256GB', price: 34990000, oldPrice: 38000000, rating: 4.9, reviews: '2.4K', discount: '-8%', tag: 'Mới', tagBg: '#0d1117', ram: '8GB', storage: '256GB' },
  { id: 2, brand: 'Samsung', name: 'Samsung Galaxy S24 Ultra 512GB', price: 28990000, oldPrice: 33000000, rating: 4.8, reviews: '1.8K', discount: '-12%', tag: 'Hot', tagBg: '#e11d48', ram: '12GB', storage: '512GB' },
  { id: 3, brand: 'Xiaomi', name: 'Xiaomi 14 Pro 512GB', price: 18990000, oldPrice: 21000000, rating: 4.7, reviews: '956', discount: '-10%', tag: 'Mới', tagBg: '#0d1117', ram: '12GB', storage: '512GB' },
  { id: 4, brand: 'OPPO', name: 'OPPO Find X7 Pro 256GB', price: 24990000, oldPrice: 27000000, rating: 4.6, reviews: '743', discount: '-7%', tag: 'Sale', tagBg: '#f59e0b', ram: '16GB', storage: '256GB' },
  { id: 5, brand: 'Apple', name: 'iPhone 15 128GB', price: 22990000, oldPrice: 25000000, rating: 4.8, reviews: '3.1K', discount: '-8%', tag: 'Mới', tagBg: '#0d1117', ram: '6GB', storage: '128GB' },
  { id: 6, brand: 'Samsung', name: 'Samsung Galaxy Z Fold 5 256GB', price: 43990000, oldPrice: 48000000, rating: 4.7, reviews: '621', discount: '-8%', tag: 'Hot', tagBg: '#e11d48', ram: '12GB', storage: '256GB' },
  { id: 7, brand: 'Vivo', name: 'Vivo X100 Pro 256GB', price: 19990000, oldPrice: 22000000, rating: 4.6, reviews: '412', discount: '-9%', tag: 'Mới', tagBg: '#0d1117', ram: '12GB', storage: '256GB' },
  { id: 8, brand: 'Xiaomi', name: 'Xiaomi Redmi Note 13 Pro 256GB', price: 7490000, oldPrice: 9000000, rating: 4.7, reviews: '1.5K', discount: '-17%', tag: 'Sale', tagBg: '#f59e0b', ram: '8GB', storage: '256GB' },
  { id: 9, brand: 'OPPO', name: 'OPPO Reno 11 Pro 256GB', price: 14990000, oldPrice: 16990000, rating: 4.5, reviews: '534', discount: '-12%', tag: 'Mới', tagBg: '#0d1117', ram: '12GB', storage: '256GB' },
  { id: 10, brand: 'Samsung', name: 'Samsung Galaxy A55 128GB', price: 10490000, oldPrice: 12490000, rating: 4.6, reviews: '887', discount: '-16%', tag: 'Sale', tagBg: '#f59e0b', ram: '8GB', storage: '128GB' },
  { id: 11, brand: 'Apple', name: 'iPhone 14 128GB', price: 18990000, oldPrice: 22990000, rating: 4.7, reviews: '2.1K', discount: '-17%', tag: 'Sale', tagBg: '#f59e0b', ram: '6GB', storage: '128GB' },
  { id: 12, brand: 'Xiaomi', name: 'Xiaomi Redmi 12C 128GB', price: 3490000, oldPrice: 4290000, rating: 4.4, reviews: '2.3K', discount: '-19%', tag: 'Sale', tagBg: '#f59e0b', ram: '4GB', storage: '128GB' },
];

const FILTER_BRANDS = ['Apple','Samsung','Xiaomi','OPPO','Vivo','Realme'];
const FILTER_PRICES = [
  { label: 'Dưới 5 triệu',       min: 0,        max: 5000000 },
  { label: '5 – 10 triệu',       min: 5000000,  max: 10000000 },
  { label: '10 – 20 triệu',      min: 10000000, max: 20000000 },
  { label: '20 – 30 triệu',      min: 20000000, max: 30000000 },
  { label: 'Trên 30 triệu',      min: 30000000, max: Infinity },
];
const FILTER_RAMS = ['4GB','6GB','8GB','12GB','16GB'];
const FILTER_STORAGES = ['128GB','256GB','512GB'];

function fmt(n) { return n.toLocaleString('vi-VN'); }

export function ProductListingPage() {
  const [params] = useSearchParams();
  const { addItem } = useCart();
  const [brands, setBrands] = useState([]);
  const [prices, setPrices] = useState([]);
  const [rams, setRams] = useState([]);
  const [storages, setStorages] = useState([]);
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const toggle = (list, setList, val) =>
    setList(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  let products = [...ALL_PRODUCTS];
  const q = params.get('q');
  if (q) products = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  if (brands.length) products = products.filter(p => brands.includes(p.brand));
  if (prices.length) products = products.filter(p => prices.some(pi => p.price >= pi.min && p.price < pi.max));
  if (rams.length) products = products.filter(p => rams.includes(p.ram));
  if (storages.length) products = products.filter(p => storages.includes(p.storage));
  if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
  if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);

  const total = products.length;
  const pages = Math.ceil(total / PER_PAGE);
  const displayed = products.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const clearAll = () => { setBrands([]); setPrices([]); setRams([]); setStorages([]); };
  const hasFilter = brands.length || prices.length || rams.length || storages.length;

  const CheckItem = ({ label, checked, onToggle, count }) => (
    <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 0' }}>
      <div style={{ width: 17, height: 17, border: `1.5px solid ${checked ? '#0d1117' : '#d1d5db'}`, borderRadius: 4, background: checked ? '#0d1117' : '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
        {checked && <svg width="10" height="10" fill="none" stroke="#fff" strokeWidth="2.8" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <span style={{ fontSize: 13.5, color: checked ? '#0d1117' : '#374151', flex: 1 }}>{label}</span>
      {count != null && <span style={{ fontSize: 11.5, color: '#c4c9d4' }}>({count})</span>}
    </div>
  );

  const Chip = ({ label, selected, onToggle }) => (
    <div onClick={onToggle} style={{ padding: '6px 13px', border: `1.5px solid ${selected ? '#0d1117' : '#e9ecef'}`, borderRadius: 20, background: selected ? '#0d1117' : '#fff', fontSize: 13, fontWeight: 600, color: selected ? '#fff' : '#374151', cursor: 'pointer', transition: 'all 0.15s', userSelect: 'none' }}>
      {label}
    </div>
  );

  return (
    <div style={{ background: '#f4f5f7' }}>
      {/* Header strip */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f3f5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chủ</Link>
            <span style={{ color: '#d1d5db' }}>/</span>
            <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 600 }}>Điện thoại di động</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0d1117', letterSpacing: -0.8 }}>Điện thoại di động</h1>
              <p style={{ fontSize: 13.5, color: '#9ca3af', marginTop: 5 }}>{total} sản phẩm từ các thương hiệu hàng đầu</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Tất cả',...FILTER_BRANDS.slice(0,4)].map((b, i) => (
                <button key={b} onClick={() => i === 0 ? setBrands([]) : toggle(brands, setBrands, b)}
                  style={{ padding: '8px 14px', background: (i===0 ? !brands.length : brands.includes(b)) ? '#0d1117' : '#f4f5f7', color: (i===0 ? !brands.length : brands.includes(b)) ? '#fff' : '#374151', border: '1.5px solid #e9ecef', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 72px', display: 'flex', gap: 22, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{ width: 244, flexShrink: 0, position: 'sticky', top: 80, maxHeight: 'calc(100vh - 96px)', overflowY: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid #f4f5f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#0d1117' }}>🔽 Bộ lọc {hasFilter ? <span style={{ background: '#0d1117', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '2px 7px', borderRadius: 20, marginLeft: 6 }}>{brands.length+prices.length+rams.length+storages.length}</span> : null}</span>
              {hasFilter && <button onClick={clearAll} style={{ fontSize: 12, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Xóa tất cả</button>}
            </div>
            <div style={{ padding: '0 18px 18px' }}>
              {/* Brands */}
              <div style={{ paddingTop: 18, paddingBottom: 18, borderBottom: '1px solid #f4f5f7' }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 13 }}>Thương hiệu</h3>
                {FILTER_BRANDS.map(b => <CheckItem key={b} label={b} checked={brands.includes(b)} onToggle={() => toggle(brands, setBrands, b)}/>)}
              </div>
              {/* Price */}
              <div style={{ paddingTop: 18, paddingBottom: 18, borderBottom: '1px solid #f4f5f7' }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 13 }}>Khoảng giá</h3>
                {FILTER_PRICES.map(p => <CheckItem key={p.label} label={p.label} checked={prices.includes(p)} onToggle={() => toggle(prices, setPrices, p)}/>)}
              </div>
              {/* RAM */}
              <div style={{ paddingTop: 18, paddingBottom: 18, borderBottom: '1px solid #f4f5f7' }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 13 }}>RAM</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {FILTER_RAMS.map(r => <Chip key={r} label={r} selected={rams.includes(r)} onToggle={() => toggle(rams, setRams, r)}/>)}
                </div>
              </div>
              {/* Storage */}
              <div style={{ paddingTop: 18 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 13 }}>Bộ nhớ trong</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {FILTER_STORAGES.map(s => <Chip key={s} label={s} selected={storages.includes(s)} onToggle={() => toggle(storages, setStorages, s)}/>)}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Sort bar */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #f1f3f5', padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 13.5, color: '#6b7280', flex: 1 }}>
              Hiển thị <strong style={{ color: '#0d1117' }}>{(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,total)}</strong> trong <strong style={{ color: '#0d1117' }}>{total}</strong> sản phẩm
            </span>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>Sắp xếp:</span>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ height: 36, padding: '0 32px 0 12px', border: '1.5px solid #e9ecef', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', color: '#374151', outline: 'none', cursor: 'pointer' }}>
              <option value="default">Nổi bật</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>

          {displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Không tìm thấy sản phẩm</div>
              <div style={{ fontSize: 14 }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {displayed.map(item => (
                <div key={item.id}
                  style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.22s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='0 10px 32px rgba(0,0,0,0.09)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
                  <div style={{ background: 'linear-gradient(148deg,#f4f5f7 0%,#eaecf0 100%)', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <svg width="64" height="108" viewBox="0 0 72 120" fill="none">
                      <rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/>
                      <rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/>
                      <circle cx="36" cy="105" r="5" fill="#b8bdc8"/>
                    </svg>
                    <span style={{ position: 'absolute', top: 11, right: 11, background: '#e11d48', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 5 }}>{item.discount}</span>
                    <span style={{ position: 'absolute', top: 11, left: 11, background: item.tagBg, color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 5 }}>{item.tag}</span>
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{item.brand}</div>
                    <h3 style={{ fontSize: 13.5, fontWeight: 700, color: '#0d1117', marginBottom: 8, lineHeight: 1.3 }}>{item.name}</h3>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                      <span style={{ background: '#f4f5f7', fontSize: 11, color: '#6b7280', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{item.ram}</span>
                      <span style={{ background: '#f4f5f7', fontSize: 11, color: '#6b7280', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{item.storage}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: '#f59e0b' }}>★★★★★</span>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>{item.rating} ({item.reviews})</span>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: 17, fontWeight: 900, color: '#0d1117' }}>{fmt(item.price)}₫</span>
                      <span style={{ fontSize: 12, color: '#c4c9d4', textDecoration: 'line-through', marginLeft: 7 }}>{fmt(item.oldPrice)}₫</span>
                    </div>
                    <button onClick={() => addItem(item)}
                      style={{ width: '100%', padding: '9px', background: '#0d1117', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.background='#1e293b'}
                      onMouseLeave={e => e.currentTarget.style.background='#0d1117'}>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
              {Array.from({ length: pages }, (_, i) => i+1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 40, height: 40, borderRadius: 9, border: p===page ? 'none' : '1.5px solid #e9ecef', background: p===page ? '#0d1117' : '#fff', color: p===page ? '#fff' : '#374151', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
