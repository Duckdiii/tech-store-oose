<<<<<<< HEAD
import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

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
=======
import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { productApi } from '../../../api/productApi';
import { notificationApi } from '../../../api/notificationApi';
import { useAuth } from '../../../shared/context/AuthContext';
>>>>>>> origin/duc

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

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

function HeartIcon({ broken = false }) {
  if (broken) {
    return (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.6 6.15 10.9 9.2l2.3 2.1-2.1 3.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProductListingPage() {
  const [params] = useSearchParams();
  const { isLoggedIn } = useAuth();
  const [brands, setBrands] = useState([]);
  const [prices, setPrices] = useState([]);
  const [rams, setRams] = useState([]);
  const [storages, setStorages] = useState([]);
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const [goTo, setGoTo] = useState('');
  const navigate = useNavigate();
  const PER_PAGE = 8;

<<<<<<< HEAD
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
=======
  const [products, setProducts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [subscribedProductIds, setSubscribedProductIds] = useState(() => new Set());
  const [subscriptionBusyId, setSubscriptionBusyId] = useState('');

  const toggle = (list, setList, val) =>
    setList(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = params.get('q') || '';
        const brandQuery = brands.length > 0 ? brands[0] : '';
        const minPrice = prices.length > 0 ? prices[0].min : '';
        const maxPrice = prices.length > 0 ? prices[0].max : '';
        
        let sortQuery = '';
        if (sort === 'price-asc') sortQuery = 'price,asc';
        if (sort === 'price-desc') sortQuery = 'price,desc';

        const data = await productApi.searchProducts({
          keyword: q,
          brand: brandQuery,
          minPrice: minPrice !== '' && minPrice !== Infinity ? minPrice : undefined,
          maxPrice: maxPrice !== '' && maxPrice !== Infinity ? maxPrice : undefined,
          page: page - 1,
          size: PER_PAGE,
          sort: sortQuery || undefined
        });
        
        setProducts(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Simple debounce
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [params, brands, prices, sort, page]);

  useEffect(() => {
    if (!isLoggedIn) {
      setSubscribedProductIds(new Set());
      return;
    }

    notificationApi.getSubscriptions()
      .then((subscriptions) => {
        setSubscribedProductIds(new Set(
          subscriptions
            .filter((item) => item.status === 'SUBSCRIBED')
            .map((item) => item.productId),
        ));
      })
      .catch(() => setSubscribedProductIds(new Set()));
  }, [isLoggedIn]);
>>>>>>> origin/duc

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

  const handleToggleSubscription = async (event, productId) => {
    event.stopPropagation();

    if (!isLoggedIn) {
      navigate('/sign-in');
      return;
    }

    const next = new Set(subscribedProductIds);

    setSubscriptionBusyId(productId);
    try {
      if (next.has(productId)) {
        await notificationApi.unsubscribeProduct(productId);
        next.delete(productId);
      } else {
        await notificationApi.subscribeProduct(productId);
        next.add(productId);
      }
      setSubscribedProductIds(next);
    } catch (err) {
      console.error('Failed to update notification subscription', err);
    } finally {
      setSubscriptionBusyId('');
    }
  };

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
              <div style={{ paddingTop: 18, paddingBottom: 18, borderBottom: '1px solid #f4f5f7' }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 13 }}>Thương hiệu</h3>
                {FILTER_BRANDS.map(b => <CheckItem key={b} label={b} checked={brands.includes(b)} onToggle={() => toggle(brands, setBrands, b)}/>)}
              </div>
              <div style={{ paddingTop: 18, paddingBottom: 18, borderBottom: '1px solid #f4f5f7' }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 13 }}>Khoảng giá</h3>
                {FILTER_PRICES.map(p => <CheckItem key={p.label} label={p.label} checked={prices.includes(p)} onToggle={() => toggle(prices, setPrices, p)}/>)}
              </div>
              <div style={{ paddingTop: 18, paddingBottom: 18, borderBottom: '1px solid #f4f5f7' }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 13 }}>RAM</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {FILTER_RAMS.map(r => <Chip key={r} label={r} selected={rams.includes(r)} onToggle={() => toggle(rams, setRams, r)}/>)}
                </div>
              </div>
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
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #f1f3f5', padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 13.5, color: '#6b7280', flex: 1 }}>
<<<<<<< HEAD
              Hiển thị <strong style={{ color: '#0d1117' }}>{(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,total)}</strong> trong <strong style={{ color: '#0d1117' }}>{total}</strong> sản phẩm
=======
              Hiển thị <strong style={{ color: '#0d1117' }}>{totalElements > 0 ? (page-1)*PER_PAGE+1 : 0}–{Math.min(page*PER_PAGE,totalElements)}</strong> trong <strong style={{ color: '#0d1117' }}>{totalElements}</strong> sản phẩm
>>>>>>> origin/duc
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

<<<<<<< HEAD
          {displayed.length === 0 ? (
=======
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#374151' }}>Đang tải dữ liệu...</div>
            </div>
          ) : products.length === 0 ? (
>>>>>>> origin/duc
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Không tìm thấy sản phẩm</div>
              <div style={{ fontSize: 14 }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
<<<<<<< HEAD
              {displayed.map(item => (
=======
              {products.map(item => (
>>>>>>> origin/duc
                <div key={item.id}
                  onClick={() => navigate(`/products/${item.id}`)}
                  style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.22s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='0 10px 32px rgba(0,0,0,0.09)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='#e2e5ea'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#f1f3f5'; }}>
                  <div style={{ background: 'linear-gradient(148deg,#f4f5f7 0%,#eaecf0 100%)', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={(event) => handleToggleSubscription(event, item.id)}
                      disabled={subscriptionBusyId === item.id}
                      title={subscribedProductIds.has(item.id) ? 'Huy dang ky thong bao' : 'Dang ky nhan thong bao'}
                      aria-label={subscribedProductIds.has(item.id) ? 'Huy dang ky thong bao' : 'Dang ky nhan thong bao'}
                      style={{
                        position: 'absolute',
                        top: 11,
                        right: 11,
                        zIndex: 2,
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        border: `1.5px solid ${subscribedProductIds.has(item.id) ? '#e11d48' : '#d8c9e4'}`,
                        background: subscribedProductIds.has(item.id) ? '#fff1f2' : '#fff',
                        color: subscribedProductIds.has(item.id) ? '#e11d48' : '#7c6a86',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 18px rgba(17,24,39,0.12)',
                        cursor: subscriptionBusyId === item.id ? 'wait' : 'pointer',
                      }}
                    >
                      <HeartIcon broken={subscribedProductIds.has(item.id)} />
                    </button>
                    <svg width="72" height="120" viewBox="0 0 72 120" fill="none">
                      <rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/>
                      <rect x="7" y="7" width="58" height="106" rx="13" stroke="#c4c9d4" strokeWidth="1.5"/>
                      <rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/>
<<<<<<< HEAD
                      <rect x="24" y="11" width="24" height="5" rx="2.5" fill="#b8bdc8"/>
                      <circle cx="36" cy="105" r="5" fill="#b8bdc8"/>
                    </svg>
                    <span style={{ position: 'absolute', top: 11, right: 11, background: '#e11d48', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 5 }}>{item.discount}</span>
                    <span style={{ position: 'absolute', top: 11, left: 11, background: item.tagBg, color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 5 }}>{item.tag}</span>
                  </div>
                  <div style={{ padding: '16px 18px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>{item.brand}</div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0d1117', marginBottom: 10, lineHeight: 1.35 }}>{item.name}</h3>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                      <span style={{ background: '#f4f5f7', fontSize: 11, color: '#6b7280', padding: '3px 9px', borderRadius: 5, fontWeight: 600 }}>{item.ram}</span>
                      <span style={{ background: '#f4f5f7', fontSize: 11, color: '#6b7280', padding: '3px 9px', borderRadius: 5, fontWeight: 600 }}>{item.storage}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
                      <span style={{ fontSize: 12.5, color: '#f59e0b', letterSpacing: 1 }}>★★★★★</span>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>{item.rating} ({item.reviews})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#0d1117', letterSpacing: -0.5 }}>{fmt(item.price)}₫</span>
                      <span style={{ fontSize: 12, color: '#c4c9d4', textDecoration: 'line-through' }}>{fmt(item.oldPrice)}₫</span>
=======
                      {item.thumbnailUrl && <image href={item.thumbnailUrl} x="13" y="23" width="46" height="70" preserveAspectRatio="xMidYMid slice" />}
                      <rect x="24" y="11" width="24" height="5" rx="2.5" fill="#b8bdc8"/>
                      <circle cx="36" cy="105" r="5" fill="#b8bdc8"/>
                    </svg>
                    {item.discount && <span style={{ position: 'absolute', top: 58, right: 11, background: '#e11d48', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 5 }}>{item.discount}</span>}
                    <span style={{ position: 'absolute', top: 11, left: 11, background: '#0d1117', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 5 }}>Mới</span>
                  </div>
                  <div style={{ padding: '16px 18px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>{item.brandName || 'Thương hiệu'}</div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0d1117', marginBottom: 10, lineHeight: 1.35 }}>{item.name}</h3>
                    {(item.ram || item.storage) && (
                      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                        {item.ram && <span style={{ background: '#f4f5f7', fontSize: 11, color: '#6b7280', padding: '3px 9px', borderRadius: 5, fontWeight: 600 }}>{item.ram}</span>}
                        {item.storage && <span style={{ background: '#f4f5f7', fontSize: 11, color: '#6b7280', padding: '3px 9px', borderRadius: 5, fontWeight: 600 }}>{item.storage}</span>}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
                      <span style={{ fontSize: 12.5, color: '#f59e0b', letterSpacing: 1 }}>★★★★★</span>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>5.0 (200+)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#0d1117', letterSpacing: -0.5 }}>{fmt(item.lowestPrice)}₫</span>
                      <span style={{ fontSize: 12, color: '#c4c9d4', textDecoration: 'line-through' }}>{fmt(item.lowestPrice * 1.1)}₫</span>
>>>>>>> origin/duc
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

<<<<<<< HEAD
          {pages > 1 && (
=======
          {!loading && totalPages > 1 && (
>>>>>>> origin/duc
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 40, flexWrap: 'wrap' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ height: 40, padding: '0 14px', borderRadius: 9, border: '1.5px solid #e9ecef', background: '#fff', color: page === 1 ? '#c4c9d4' : '#374151', fontSize: 13, fontWeight: 700, cursor: page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                ← Trước
              </button>
<<<<<<< HEAD
              {getPageNumbers(page, pages).map((p, i) =>
=======
              {getPageNumbers(page, totalPages).map((p, i) =>
>>>>>>> origin/duc
                p === '...'
                  ? <span key={`dots-${i}`} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 16, userSelect: 'none' }}>…</span>
                  : <button key={p} onClick={() => setPage(p)}
                      style={{ width: 40, height: 40, borderRadius: 9, border: p === page ? 'none' : '1.5px solid #e9ecef', background: p === page ? '#0d1117' : '#fff', color: p === page ? '#fff' : '#374151', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {p}
                    </button>
              )}
<<<<<<< HEAD
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                style={{ height: 40, padding: '0 14px', borderRadius: 9, border: '1.5px solid #e9ecef', background: '#fff', color: page === pages ? '#c4c9d4' : '#374151', fontSize: 13, fontWeight: 700, cursor: page === pages ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                Sau →
              </button>
              <form onSubmit={e => { e.preventDefault(); const v = parseInt(goTo); if (v >= 1 && v <= pages) { setPage(v); setGoTo(''); } }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
                <span style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}>Đến trang</span>
                <input type="number" min={1} max={pages} value={goTo} onChange={e => setGoTo(e.target.value)} placeholder={page}
=======
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ height: 40, padding: '0 14px', borderRadius: 9, border: '1.5px solid #e9ecef', background: '#fff', color: page === totalPages ? '#c4c9d4' : '#374151', fontSize: 13, fontWeight: 700, cursor: page === totalPages ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                Sau →
              </button>
              <form onSubmit={e => { e.preventDefault(); const v = parseInt(goTo); if (v >= 1 && v <= totalPages) { setPage(v); setGoTo(''); } }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
                <span style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}>Đến trang</span>
                <input type="number" min={1} max={totalPages} value={goTo} onChange={e => setGoTo(e.target.value)} placeholder={page}
>>>>>>> origin/duc
                  style={{ width: 60, height: 40, border: '1.5px solid #e9ecef', borderRadius: 9, textAlign: 'center', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', outline: 'none', color: '#0d1117', background: '#fff' }}/>
                <button type="submit"
                  style={{ height: 40, padding: '0 14px', borderRadius: 9, border: 'none', background: '#0d1117', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Đi
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
