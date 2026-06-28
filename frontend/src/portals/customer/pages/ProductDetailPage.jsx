import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';
import { productApi } from '../../../api/productApi';

const REVIEWS_MOCK = [
  { name: 'Nguyễn Văn An', avatar: 'NA', rating: 5, date: '10/06/2025', text: 'Sản phẩm đúng như mô tả, giao hàng nhanh, đóng gói cẩn thận. Máy chạy mượt, pin trâu. Rất hài lòng!', helpful: 24 },
  { name: 'Trần Thị Bình', avatar: 'TB', rating: 5, date: '05/06/2025', text: 'Hàng chính hãng, seal nguyên vẹn. Shop tư vấn nhiệt tình, giao hàng đúng hẹn. Sẽ ủng hộ dài dài.', helpful: 18 },
  { name: 'Lê Hoàng Nam', avatar: 'LN', rating: 4, date: '01/06/2025', text: 'Máy đẹp, chạy tốt. Chỉ tiếc là không có tặng kèm phụ kiện. Nhưng giá tốt nên cũng ok.', helpful: 7 },
];

function fmt(n) { return n ? n.toLocaleString('vi-VN') : '0'; }

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('specs');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProductDetail(id);
        
        // Transform the backend data into a format suitable for the UI
        const colors = [...new Set(data.variants.map(v => v.color))].filter(Boolean);
        const storages = [...new Set(data.variants.map(v => v.capacity))].filter(Boolean);
        
        setProduct({
          ...data,
          colors: colors.length ? colors : ['Mặc định'],
          storages: storages.length ? storages : ['Mặc định'],
          rating: 5.0, // Mock for now
          reviews: '2.4K', // Mock for now
        });
        
        setSelectedColor(0);
        setSelectedStorage(0);
      } catch (err) {
        console.error('Failed to fetch product detail', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7' }}>
        <h2 style={{ fontSize: 20, color: '#374151' }}>Đang tải thông tin sản phẩm...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#f4f5f7' }}>
        <div style={{ fontSize: 64 }}>😕</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117' }}>Không tìm thấy sản phẩm</h2>
        <Link to="/products" style={{ padding: '12px 28px', background: '#0d1117', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Quay lại danh mục</Link>
      </div>
    );
  }

  // Find the selected variant to get the correct price
  const selectedVariantColor = product.colors[selectedColor] !== 'Mặc định' ? product.colors[selectedColor] : null;
  const selectedVariantCapacity = product.storages[selectedStorage] !== 'Mặc định' ? product.storages[selectedStorage] : null;
  
  const currentVariant = product.variants?.find(v => 
    (!selectedVariantColor || v.color === selectedVariantColor) &&
    (!selectedVariantCapacity || v.capacity === selectedVariantCapacity)
  ) || product.variants?.[0];

  const currentPrice = currentVariant ? currentVariant.price : (product.price || 0);
  const oldPrice = currentPrice * 1.1; // Mock old price
  const discount = 10; // Mock discount

  const handleAddToCart = () => {
    addItem({ 
      id: `${product.id}-${selectedVariantColor}-${selectedVariantCapacity}`, 
      name: `${product.name} ${selectedVariantCapacity || ''}`.trim(), 
      price: currentPrice, 
      storage: selectedVariantCapacity,
      brand: product.brandName,
      thumbnailUrl: product.thumbnailUrl
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const relatedProducts = []; // ALL_PRODUCTS.filter(p => p.brand === product.brand && p.id !== product.id).slice(0, 4);

  return (
    <div style={{ background: '#f4f5f7', minHeight: '80vh', paddingBottom: 80 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f3f5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chủ</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <Link to="/products" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Điện thoại</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <Link to={`/products?brand=${product.brandName}`} style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>{product.brandName}</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #f1f3f5', padding: '40px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 440, position: 'relative', marginBottom: 16 }}>
              <span style={{ position: 'absolute', top: 16, left: 16, background: '#e11d48', color: '#fff', fontSize: 13, fontWeight: 800, padding: '4px 12px', borderRadius: 6 }}>-{discount}%</span>
              <span style={{ position: 'absolute', top: 16, right: 16, background: product.tagBg, color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>{product.tag}</span>
              <svg width="160" height="268" viewBox="0 0 72 120" fill="none" style={{ filter: 'drop-shadow(0 32px 48px rgba(0,0,0,0.12))' }}>
                <rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/>
                <rect x="7" y="7" width="58" height="106" rx="13" stroke="#c4c9d4" strokeWidth="1.5"/>
                <rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.5"/>
                {product.images && product.images[0] && <image href={product.images[0].url} x="13" y="23" width="46" height="70" preserveAspectRatio="xMidYMid slice" />}
                <rect x="24" y="11" width="24" height="5" rx="2.5" fill="#b8bdc8"/>
                <circle cx="36" cy="105" r="5" fill="#b8bdc8"/>
              </svg>
            </div>
            {product.images && product.images.length > 0 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {product.images.slice(0,3).map((img, i) => (
                  <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 12, border: `1.5px solid ${i===0 ? '#0d1117' : '#f1f3f5'}`, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', height: 72 }}>
                    <svg width="28" height="48" viewBox="0 0 72 120" fill="none">
                      <rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/>
                      <rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/>
                      <image href={img.url} x="13" y="23" width="46" height="70" preserveAspectRatio="xMidYMid slice" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>{product.brandName}</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0d1117', letterSpacing: -0.8, lineHeight: 1.25, marginBottom: 14 }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f1f3f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 15, color: '#f59e0b', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0d1117' }}>{product.rating}</span>
              </div>
              <span style={{ color: '#e9ecef' }}>|</span>
              <span style={{ fontSize: 13.5, color: '#6b7280' }}>{product.reviews} đánh giá</span>
              <span style={{ color: '#e9ecef' }}>|</span>
              <span style={{ fontSize: 13.5, color: '#16a34a', fontWeight: 600 }}>Còn hàng</span>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 34, fontWeight: 900, color: '#e11d48', letterSpacing: -1 }}>{fmt(currentPrice)}₫</span>
                <span style={{ fontSize: 16, color: '#c4c9d4', textDecoration: 'line-through' }}>{fmt(oldPrice)}₫</span>
              </div>
              <span style={{ display: 'inline-block', background: '#fef2f2', color: '#e11d48', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 6 }}>
                Tiết kiệm {fmt(oldPrice - currentPrice)}₫
              </span>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
                Màu sắc: <span style={{ fontWeight: 800, color: '#0d1117' }}>{product.colors[selectedColor]}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {product.colors.map((c, i) => (
                  <button key={c} onClick={() => setSelectedColor(i)}
                    style={{ padding: '8px 16px', border: `2px solid ${selectedColor===i ? '#0d1117' : '#e9ecef'}`, borderRadius: 9, background: selectedColor===i ? '#f8f9fa' : '#fff', fontSize: 13, fontWeight: 600, color: selectedColor===i ? '#0d1117' : '#6b7280', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
                Dung lượng: <span style={{ fontWeight: 800, color: '#0d1117' }}>{product.storages[selectedStorage]}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {product.storages.map((s, i) => {
                  // Find the variant for this storage and the selected color
                  const v = product.variants?.find(v => v.capacity === s && (!selectedVariantColor || v.color === selectedVariantColor));
                  const sPrice = v ? v.price : null;
                  return (
                    <button key={i} onClick={() => setSelectedStorage(i)}
                      style={{ padding: '10px 20px', border: `2px solid ${selectedStorage===i ? '#0d1117' : '#e9ecef'}`, borderRadius: 9, background: selectedStorage===i ? '#0d1117' : '#fff', fontSize: 13.5, fontWeight: 700, color: selectedStorage===i ? '#fff' : '#374151', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                      {s}
                      {sPrice && i !== selectedStorage && (
                        <span style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#9ca3af', marginTop: 2 }}>{fmt(sPrice)}₫</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e9ecef', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q-1))}
                  style={{ width: 44, height: 44, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 300 }}>−</button>
                <span style={{ width: 44, textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#0d1117' }}>{qty}</span>
                <button onClick={() => setQty(q => q+1)}
                  style={{ width: 44, height: 44, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 300 }}>+</button>
              </div>
              <button onClick={handleAddToCart}
                style={{ flex: 1, height: 48, background: added ? '#16a34a' : '#fff', color: added ? '#fff' : '#0d1117', border: '2px solid #0d1117', borderColor: added ? '#16a34a' : '#0d1117', borderRadius: 11, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                {added ? '✓ Đã thêm!' : 'Thêm vào giỏ'}
              </button>
              <button onClick={handleBuyNow}
                style={{ flex: 1, height: 48, background: '#0d1117', color: '#fff', border: 'none', borderRadius: 11, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background='#1e293b'}
                onMouseLeave={e => e.currentTarget.style.background='#0d1117'}>
                Mua ngay →
              </button>
            </div>
            <div style={{ background: '#f8f9fa', borderRadius: 14, padding: '16px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: '🛡️', label: 'Bảo hành 12 tháng', sub: 'Tại trung tâm hãng' },
                { icon: '🚚', label: 'Giao hàng miễn phí', sub: 'Toàn quốc 1–3 ngày' },
                { icon: '🔄', label: 'Đổi trả 30 ngày', sub: 'Không cần lý do' },
                { icon: '✅', label: 'Hàng chính hãng', sub: 'Nguyên seal, seal hãng' },
              ].map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0d1117' }}>{b.label}</div>
                    <div style={{ fontSize: 11.5, color: '#9ca3af' }}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #f1f3f5', marginBottom: 32, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f3f5' }}>
            {[
              { id: 'specs', label: 'Thông số kỹ thuật' },
              { id: 'desc',  label: 'Mô tả sản phẩm' },
              { id: 'reviews', label: `Đánh giá (${REVIEWS_MOCK.length})` },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: '16px 28px', background: 'none', border: 'none', borderBottom: `2.5px solid ${tab===t.id ? '#0d1117' : 'transparent'}`, fontSize: 14.5, fontWeight: tab===t.id ? 800 : 500, color: tab===t.id ? '#0d1117' : '#6b7280', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', marginBottom: -1 }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ padding: '28px 32px' }}>
            {tab === 'specs' && product.attributes && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
                {Object.entries(product.attributes).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid #f4f5f7', gap: 16 }}>
                    <span style={{ fontSize: 13.5, color: '#9ca3af', fontWeight: 500, flexShrink: 0 }}>{key}</span>
                    <span style={{ fontSize: 13.5, color: '#0d1117', fontWeight: 600, textAlign: 'right' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'desc' && (
              <div style={{ maxWidth: 720 }}>
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 20 }}>{product.description}</p>
                {product.attributes && (
                  <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {Object.entries(product.attributes).slice(0, 4).map(([k, v]) => (
                      <li key={k} style={{ fontSize: 14.5, color: '#4b5563', lineHeight: 1.6 }}>
                        <strong style={{ color: '#0d1117' }}>{k}:</strong> {v}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {tab === 'reviews' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '0 0 28px', borderBottom: '1px solid #f1f3f5', marginBottom: 28 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 56, fontWeight: 900, color: '#0d1117', letterSpacing: -2, lineHeight: 1 }}>{product.rating}</div>
                    <div style={{ fontSize: 18, color: '#f59e0b', margin: '6px 0 4px' }}>★★★★★</div>
                    <div style={{ fontSize: 13, color: '#9ca3af' }}>{product.reviews} đánh giá</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {[5,4,3,2,1].map(star => (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: '#374151', width: 14, textAlign: 'right' }}>{star}</span>
                        <span style={{ fontSize: 12, color: '#f59e0b' }}>★</span>
                        <div style={{ flex: 1, height: 7, background: '#f4f5f7', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#f59e0b', borderRadius: 4, width: star===5?'72%':star===4?'18%':star===3?'6%':star===2?'2%':'2%' }}/>
                        </div>
                        <span style={{ fontSize: 12, color: '#9ca3af', width: 28, textAlign: 'right' }}>{star===5?'72%':star===4?'18%':star===3?'6%':star===2?'2%':'2%'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {REVIEWS_MOCK.map((rev, i) => (
                    <div key={i} style={{ paddingBottom: 20, borderBottom: '1px solid #f4f5f7' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 42, height: 42, background: '#0d1117', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{rev.avatar}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#0d1117' }}>{rev.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                            <span style={{ fontSize: 13, color: '#f59e0b' }}>{'★'.repeat(rev.rating)}</span>
                            <span style={{ fontSize: 12, color: '#9ca3af' }}>{rev.date}</span>
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>{rev.text}</p>
                      <button style={{ fontSize: 13, color: '#6b7280', background: 'none', border: '1px solid #e9ecef', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        👍 Hữu ích ({rev.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #f1f3f5', padding: '28px 32px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0d1117', letterSpacing: -0.5, marginBottom: 24 }}>Sản phẩm {product.brand} khác</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {relatedProducts.map(p => (
                <div key={p.id}
                  onClick={() => { navigate(`/products/${p.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ border: '1.5px solid #f1f3f5', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
                  <div style={{ background: 'linear-gradient(148deg,#f4f5f7,#eaecf0)', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="54" height="90" viewBox="0 0 72 120" fill="none">
                      <rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/>
                      <rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/>
                    </svg>
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0d1117', marginBottom: 6, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#0d1117' }}>{fmt(p.price)}₫</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
