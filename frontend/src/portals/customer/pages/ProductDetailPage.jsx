import { useEffect, useMemo, useState } from 'react';
import { fmt } from '../../../utils/format';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../../../api/productApi';
import { notificationApi } from '../../../api/notificationApi';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { useTheme } from '../../../shared/context/ThemeContext';



function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildAttributes(product) {
  return {
    'Màn hình': product.screenSize ? `${product.screenSize} inch` : null,
    'Độ phân giải': product.screenResolution,
    Chipset: product.chipset,
    'Camera sau': product.rearCamera,
    'Camera trước': product.frontCamera,
    Pin: product.batteryCapacity ? `${product.batteryCapacity} mAh` : null,
    SIM: product.simType,
    'Hệ điều hành': product.operatingSystem,
    NFC: product.nfcSupported == null ? null : product.nfcSupported ? 'Có' : 'Không',
  };
}

function HeartIcon({ broken = false }) {
  if (broken) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6 6.15 10.9 9.2l2.3 2.1-2.1 3.35"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PLACEHOLDER_ICON = (
  <svg width="160" height="268" viewBox="0 0 72 120" fill="none">
    <rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db" />
    <rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45" />
    <circle cx="36" cy="105" r="5" fill="#b8bdc8" />
  </svg>
);

function ProductGallery({ images, productName }) {
  const list = images || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => { setActiveIndex(0); }, [images]);

  const active = list[activeIndex];
  const showNav = list.length > 1;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2)' });
  };

  const goPrev = () => setActiveIndex((i) => (i - 1 + list.length) % list.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % list.length);

  return (
    <div>
      <div
        onClick={() => active && setLightboxOpen(true)}
        onMouseMove={active ? handleMouseMove : undefined}
        onMouseLeave={() => setZoomStyle(null)}
        style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #f1f3f5', minHeight: 440, display: 'grid', placeItems: 'center', overflow: 'hidden', cursor: active ? 'zoom-in' : 'default' }}
      >
        {active ? (
          <img
            src={active.imageUrl}
            alt={active.name || productName}
            style={{ maxWidth: '78%', maxHeight: 380, objectFit: 'contain', transition: 'transform 0.2s ease', willChange: 'transform', ...zoomStyle }}
          />
        ) : PLACEHOLDER_ICON}
      </div>

      {showNav && (
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          {list.map((img, index) => (
            <button
              key={img.id || index}
              onClick={() => setActiveIndex(index)}
              style={{ width: 68, height: 68, borderRadius: 10, border: `2px solid ${index === activeIndex ? '#0d1117' : '#e9ecef'}`, padding: 4, background: '#fff', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}
            >
              <img src={img.imageUrl} alt={img.name || `${productName} ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && active && (
        <div
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', inset: 0, background: 'rgba(13,17,23,0.92)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Đóng"
            style={{ position: 'absolute', top: 24, right: 32, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}
          >×</button>

          {showNav && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Ảnh trước"
              style={{ position: 'absolute', left: 24, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer' }}
            >‹</button>
          )}

          <img
            src={active.imageUrl}
            alt={active.name || productName}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain' }}
          />

          {showNav && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Ảnh sau"
              style={{ position: 'absolute', right: 24, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer' }}
            >›</button>
          )}
        </div>
      )}
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();
  const { t } = useTheme();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('specs');
  const [added, setAdded] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionBusy, setSubscriptionBusy] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productApi.getCustomerProductDetail(id);
        if (!cancelled) {
          setProduct(data);
          setSelectedColor(0);
          setSelectedStorage(0);
        }
      } catch {
        if (!cancelled) {
          setError('Không tải được thông tin sản phẩm.');
          setProduct(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!product?.categoryId) {
      setRelatedProducts([]);
      return;
    }

    let cancelled = false;
    setLoadingRelated(true);
    productApi.searchProducts({ categoryId: product.categoryId, size: 5 })
      .then((data) => {
        if (cancelled) return;
        setRelatedProducts((data.content || []).filter((item) => item.id !== product.id).slice(0, 4));
      })
      .catch(() => {
        if (!cancelled) setRelatedProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingRelated(false);
      });

    return () => { cancelled = true; };
  }, [product?.categoryId, product?.id]);

  const colors = useMemo(() => unique(product?.variants?.map((variant) => variant.color) || []), [product]);
  const storages = useMemo(
    () => unique((product?.variants || []).map((variant) => variant.storageGb).map((value) => value && `${value}GB`)),
    [product],
  );

  // Chỉ khớp đúng tổ hợp màu + dung lượng đang chọn; không fallback về variants[0]
  // để tránh âm thầm hiển thị giá/tồn kho của một biến thể khác với lựa chọn của khách.
  // Mỗi variant là một máy vật lý (theo số serial), nên số variant khớp tổ hợp = số máy còn hàng.
  const matchingVariants = useMemo(() => {
    if (!product?.variants?.length) return [];
    const color = colors[selectedColor];
    const storage = storages[selectedStorage];
    return product.variants.filter((variant) => {
      const variantStorage = variant.storageGb ? `${variant.storageGb}GB` : null;
      return (!color || variant.color === color) && (!storage || variantStorage === storage);
    });
  }, [colors, product, selectedColor, selectedStorage, storages]);

  const selectedVariant = matchingVariants[0] || null;
  const stockCount = matchingVariants.length;

  useEffect(() => {
    if (!isLoggedIn || !id || !selectedVariant) {
      setSubscribed(false);
      return;
    }

    let cancelled = false;
    notificationApi.getSubscriptions()
      .then((subscriptions) => {
        if (cancelled) return;
        setSubscribed(subscriptions.some((item) => item.productVariantId === selectedVariant.id && item.status === 'SUBSCRIBED'));
      })
      .catch(() => {
        if (!cancelled) setSubscribed(false);
      });

    return () => { cancelled = true; };
  }, [id, isLoggedIn, selectedVariant]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', background: '#f4f5f7' }}>
        <h2 style={{ fontSize: 20, color: '#374151' }}>Đang tải thông tin sản phẩm...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', background: '#f4f5f7', gap: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117' }}>{error || 'Không tìm thấy sản phẩm'}</h2>
        <Link to="/products" style={{ padding: '12px 28px', background: '#0d1117', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
          Quay lại danh mục
        </Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.imageUrl;
  const currentPrice = selectedVariant?.price || 0;
  const originalPrice = selectedVariant?.originalPrice || 0;
  const attributes = Object.entries(buildAttributes(product)).filter(([, value]) => value != null && value !== '');
  // Backend chỉ trả về các biến thể còn hàng (AVAILABLE), nên có selectedVariant khớp đúng
  // tổ hợp màu + dung lượng nghĩa là tổ hợp đó đang còn hàng.
  const inStock = !!selectedVariant;
  const hasVariants = (product.variants || []).length > 0;
  const comboUnavailable = hasVariants && !selectedVariant;
  const handleAddToCart = () => {
    addItem({
      id: selectedVariant?.id || product.id,
      productId: product.id,
      name: `${product.name} ${selectedVariant?.storageGb ? `${selectedVariant.storageGb}GB` : ''}`.trim(),
      price: currentPrice,
      brand: product.brandName,
      brandName: product.brandName,
      storage: selectedVariant?.storageGb ? `${selectedVariant.storageGb}GB` : null,
      color: selectedVariant?.color,
      thumbnailUrl: imageUrl,
      screenSize: product.screenSize,
      screenResolution: product.screenResolution,
      chipset: product.chipset,
      rearCamera: product.rearCamera,
      frontCamera: product.frontCamera,
      batteryCapacity: product.batteryCapacity,
      simType: product.simType,
      operatingSystem: product.operatingSystem,
      nfcSupported: product.nfcSupported,
      ramGb: selectedVariant?.ramGb,
      storageGb: selectedVariant?.storageGb
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleToggleSubscription = async () => {
    if (!isLoggedIn) {
      navigate('/sign-in');
      return;
    }

    if (!selectedVariant) return;

    setSubscriptionBusy(true);
    setSubscriptionMessage('');
    try {
      if (subscribed) {
        await notificationApi.unsubscribeProduct(selectedVariant.id);
        setSubscribed(false);
        setSubscriptionMessage(t('You have successfully unsubscribed from product updates.'));
      } else {
        await notificationApi.subscribeProduct(selectedVariant.id);
        setSubscribed(true);
        setSubscriptionMessage(t('You have successfully subscribed to product updates.'));
      }
    } catch (err) {
      const rawMsg = err.response?.data?.message || 'Unable to update subscription. Please try again later.';
      setSubscriptionMessage(t(rawMsg));
    } finally {
      setSubscriptionBusy(false);
    }
  };

  return (
    <div style={{ background: '#f4f5f7', minHeight: '80vh', paddingBottom: 80 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f3f5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chủ</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <Link to="/products" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Sản phẩm</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
              {product.brandName || product.categoryName || 'Tech Store'}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
              <h1 style={{ flex: 1, fontSize: 32, fontWeight: 800, color: '#0d1117', letterSpacing: -0.8, lineHeight: 1.25, margin: 0 }}>{product.name}</h1>
              <button
                type="button"
                onClick={handleToggleSubscription}
                disabled={subscriptionBusy}
                title={subscribed ? 'Hủy đăng ký thông báo' : 'Đăng ký nhận thông báo'}
                aria-label={subscribed ? 'Hủy đăng ký thông báo' : 'Đăng ký nhận thông báo'}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  border: `1.5px solid ${subscribed ? '#e11d48' : '#d8c9e4'}`,
                  background: subscribed ? '#fff1f2' : '#fff',
                  color: subscribed ? '#e11d48' : '#7c6a86',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: subscriptionBusy ? 'wait' : 'pointer',
                  boxShadow: '0 6px 18px rgba(17, 24, 39, 0.08)',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                <HeartIcon broken={subscribed} />
              </button>
            </div>
            {subscriptionMessage && <p style={{ margin: '-4px 0 14px', color: subscribed ? '#15803d' : '#6b7280', fontSize: 13.5, fontWeight: 500 }}>{subscriptionMessage}</p>}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#e11d48', letterSpacing: -1 }}>
                {selectedVariant ? `${fmt(currentPrice)}₫` : '—'}
              </span>
              {originalPrice > currentPrice && (
                <span style={{ fontSize: 17, color: '#9ca3af', textDecoration: 'line-through', fontWeight: 500 }}>{fmt(originalPrice)}₫</span>
              )}
            </div>

            {selectedVariant && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 22, marginTop: -12 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: stockCount < 6 ? '#e11d48' : '#16a34a', flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: stockCount < 6 ? '#e11d48' : '#16a34a' }}>
                  {stockCount < 6 ? `Chỉ còn ${stockCount} sản phẩm` : `Còn ${stockCount} sản phẩm`}
                </span>
              </div>
            )}

            {colors.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Màu sắc</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {colors.map((color, index) => (
                    <button key={color} onClick={() => setSelectedColor(index)}
                      style={{ padding: '9px 18px', border: `2px solid ${selectedColor === index ? '#0d1117' : '#e9ecef'}`, borderRadius: 9, background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {storages.length > 0 && (
              <div style={{ marginBottom: 26 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Dung lượng</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {storages.map((storage, index) => (
                    <button key={storage} onClick={() => setSelectedStorage(index)}
                      style={{ padding: '10px 22px', border: `2px solid ${selectedStorage === index ? '#0d1117' : '#e9ecef'}`, borderRadius: 9, background: selectedStorage === index ? '#0d1117' : '#fff', color: selectedStorage === index ? '#fff' : '#374151', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {comboUnavailable && (
              <p style={{ margin: '-10px 0 16px', color: '#b91c1c', fontSize: 13.5, fontWeight: 600 }}>
                Tổ hợp màu sắc và dung lượng này hiện không có sẵn. Vui lòng chọn lựa chọn khác.
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <button onClick={() => setQty((value) => Math.max(1, value - 1))} style={{ width: 44, height: 44, border: '1.5px solid #e9ecef', background: '#fff', borderRadius: 10, cursor: 'pointer', fontSize: 18, fontWeight: 600 }}>-</button>
              <span style={{ width: 36, textAlign: 'center', fontWeight: 800, fontSize: 16 }}>{qty}</span>
              <button onClick={() => setQty((value) => value + 1)} style={{ width: 44, height: 44, border: '1.5px solid #e9ecef', background: '#fff', borderRadius: 10, cursor: 'pointer', fontSize: 18, fontWeight: 600 }}>+</button>
              <button onClick={handleAddToCart} disabled={!inStock}
                style={{ flex: 1, height: 48, background: added ? '#16a34a' : '#fff', color: added ? '#fff' : '#0d1117', border: '2px solid #0d1117', borderRadius: 11, fontWeight: 800, cursor: inStock ? 'pointer' : 'not-allowed', fontSize: 15 }}>
                {added ? 'Đã thêm' : 'Thêm vào giỏ'}
              </button>
              <button onClick={handleBuyNow} disabled={!inStock}
                style={{ flex: 1, height: 48, background: '#0d1117', color: '#fff', border: 'none', borderRadius: 11, fontWeight: 800, cursor: inStock ? 'pointer' : 'not-allowed', fontSize: 15 }}>
                Mua ngay
              </button>
            </div>

          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #f1f3f5', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f3f5' }}>
            {[['specs', 'Thông số kỹ thuật'], ['desc', 'Mô tả sản phẩm']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ padding: '16px 28px', background: 'none', border: 'none', borderBottom: `2.5px solid ${tab === key ? '#0d1117' : 'transparent'}`, fontWeight: tab === key ? 800 : 600, cursor: 'pointer', fontSize: 15, color: tab === key ? '#0d1117' : '#6b7280' }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ padding: '28px 32px' }}>
            {tab === 'specs' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
                {attributes.map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f4f5f7', gap: 16, fontSize: 14.5 }}>
                    <span style={{ color: '#6b7280', fontWeight: 500 }}>{key}</span>
                    <span style={{ color: '#0d1117', fontWeight: 700, textAlign: 'right' }}>{value}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'desc' && <p style={{ maxWidth: 760, fontSize: 15.5, color: '#374151', lineHeight: 1.8 }}>{product.description || 'Sản phẩm chưa có mô tả.'}</p>}
          </div>
        </div>

        {!loadingRelated && relatedProducts.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117', letterSpacing: -0.6, marginBottom: 18 }}>Sản phẩm liên quan</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
              {relatedProducts.map((item) => (
                <div key={item.id}
                  onClick={() => navigate(`/products/${item.id}`)}
                  style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.22s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ background: '#f8fafc', padding: 16, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.name} style={{ height: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    ) : PLACEHOLDER_ICON}
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>{item.brandName || 'Thương hiệu'}</div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0d1117', marginBottom: 9, lineHeight: 1.35, minHeight: 38 }}>{item.name}</h3>
                    <span style={{ fontSize: 16.5, fontWeight: 900, color: '#0d1117', letterSpacing: -0.4 }}>{fmt(item.lowestPrice)}₫</span>
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
