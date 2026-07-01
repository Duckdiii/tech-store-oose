import { useEffect, useMemo, useState } from 'react';
import { fmt } from '../../../utils/format';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../../../api/productApi';
import { notificationApi } from '../../../api/notificationApi';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';



function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildAttributes(product) {
  return {
    'Man hinh': product.screenSize ? `${product.screenSize} inch` : null,
    'Do phan giai': product.screenResolution,
    Chipset: product.chipset,
    'Camera sau': product.rearCamera,
    'Camera truoc': product.frontCamera,
    Pin: product.batteryCapacity ? `${product.batteryCapacity} mAh` : null,
    SIM: product.simType,
    'He dieu hanh': product.operatingSystem,
    NFC: product.nfcSupported == null ? null : product.nfcSupported ? 'Co' : 'Khong',
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

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();

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
      } catch (err) {
        if (!cancelled) {
          setError('Khong tai duoc thong tin san pham.');
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

  const colors = useMemo(() => unique(product?.variants?.map((variant) => variant.color) || []), [product]);
  const storages = useMemo(
    () => unique((product?.variants || []).map((variant) => variant.storageGb).map((value) => value && `${value}GB`)),
    [product],
  );

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    const color = colors[selectedColor];
    const storage = storages[selectedStorage];
    return product.variants.find((variant) => {
      const variantStorage = variant.storageGb ? `${variant.storageGb}GB` : null;
      return (!color || variant.color === color) && (!storage || variantStorage === storage);
    }) || product.variants[0];
  }, [colors, product, selectedColor, selectedStorage, storages]);

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
        <h2 style={{ fontSize: 20, color: '#374151' }}>Dang tai thong tin san pham...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', background: '#f4f5f7', gap: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117' }}>{error || 'Khong tim thay san pham'}</h2>
        <Link to="/products" style={{ padding: '12px 28px', background: '#0d1117', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
          Quay lai danh muc
        </Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.imageUrl;
  const currentPrice = selectedVariant?.price || 0;
  const oldPrice = Math.round(currentPrice * 1.1);
  const attributes = Object.entries(buildAttributes(product)).filter(([, value]) => value != null && value !== '');
  const inStock = (product.variants || []).length > 0;

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant?.id || product.id,
      productId: product.id,
      name: `${product.name} ${selectedVariant?.storageGb ? `${selectedVariant.storageGb}GB` : ''}`.trim(),
      price: currentPrice,
      brand: product.brandName,
      storage: selectedVariant?.storageGb ? `${selectedVariant.storageGb}GB` : null,
      color: selectedVariant?.color,
      thumbnailUrl: imageUrl,
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
        setSubscriptionMessage('Da huy dang ky thong bao cho san pham nay.');
      } else {
        await notificationApi.subscribeProduct(selectedVariant.id);
        setSubscribed(true);
        setSubscriptionMessage('Da dang ky nhan thong bao khi san pham co cap nhat ton kho.');
      }
    } catch (err) {
      setSubscriptionMessage(err.response?.data?.message || 'Khong the cap nhat dang ky thong bao.');
    } finally {
      setSubscriptionBusy(false);
    }
  };

  return (
    <div style={{ background: '#f4f5f7', minHeight: '80vh', paddingBottom: 80 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f3f5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chu</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <Link to="/products" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>San pham</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontSize: 13, color: '#0d1117', fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #f1f3f5', minHeight: 440, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} style={{ maxWidth: '78%', maxHeight: 380, objectFit: 'contain' }} />
              ) : (
                <svg width="160" height="268" viewBox="0 0 72 120" fill="none">
                  <rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db" />
                  <rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45" />
                  <circle cx="36" cy="105" r="5" fill="#b8bdc8" />
                </svg>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
              {product.brandName || product.categoryName || 'Tech Store'}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
              <h1 style={{ flex: 1, fontSize: 26, fontWeight: 900, color: '#0d1117', letterSpacing: -0.8, lineHeight: 1.25, margin: 0 }}>{product.name}</h1>
              <button
                type="button"
                onClick={handleToggleSubscription}
                disabled={subscriptionBusy}
                title={subscribed ? 'Huy dang ky thong bao' : 'Dang ky nhan thong bao'}
                aria-label={subscribed ? 'Huy dang ky thong bao' : 'Dang ky nhan thong bao'}
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
            {subscriptionMessage && <p style={{ margin: '-4px 0 14px', color: subscribed ? '#15803d' : '#6b7280', fontSize: 13 }}>{subscriptionMessage}</p>}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 34, fontWeight: 900, color: '#e11d48', letterSpacing: -1 }}>{fmt(currentPrice)}d</span>
              {currentPrice > 0 && <span style={{ fontSize: 16, color: '#c4c9d4', textDecoration: 'line-through' }}>{fmt(oldPrice)}d</span>}
            </div>

            {colors.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Mau sac</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {colors.map((color, index) => (
                    <button key={color} onClick={() => setSelectedColor(index)}
                      style={{ padding: '8px 16px', border: `2px solid ${selectedColor === index ? '#0d1117' : '#e9ecef'}`, borderRadius: 9, background: '#fff', cursor: 'pointer' }}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {storages.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Dung luong</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {storages.map((storage, index) => (
                    <button key={storage} onClick={() => setSelectedStorage(index)}
                      style={{ padding: '10px 20px', border: `2px solid ${selectedStorage === index ? '#0d1117' : '#e9ecef'}`, borderRadius: 9, background: selectedStorage === index ? '#0d1117' : '#fff', color: selectedStorage === index ? '#fff' : '#374151', cursor: 'pointer' }}>
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <button onClick={() => setQty((value) => Math.max(1, value - 1))} style={{ width: 44, height: 44, border: '1.5px solid #e9ecef', background: '#fff', borderRadius: 10 }}>-</button>
              <span style={{ width: 36, textAlign: 'center', fontWeight: 800 }}>{qty}</span>
              <button onClick={() => setQty((value) => value + 1)} style={{ width: 44, height: 44, border: '1.5px solid #e9ecef', background: '#fff', borderRadius: 10 }}>+</button>
              <button onClick={handleAddToCart} disabled={!inStock}
                style={{ flex: 1, height: 48, background: added ? '#16a34a' : '#fff', color: added ? '#fff' : '#0d1117', border: '2px solid #0d1117', borderRadius: 11, fontWeight: 800, cursor: inStock ? 'pointer' : 'not-allowed' }}>
                {added ? 'Da them' : 'Them vao gio'}
              </button>
              <button onClick={handleBuyNow} disabled={!inStock}
                style={{ flex: 1, height: 48, background: '#0d1117', color: '#fff', border: 'none', borderRadius: 11, fontWeight: 800, cursor: inStock ? 'pointer' : 'not-allowed' }}>
                Mua ngay
              </button>
            </div>

          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #f1f3f5', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f3f5' }}>
            {[['specs', 'Thong so ky thuat'], ['desc', 'Mo ta san pham']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ padding: '16px 28px', background: 'none', border: 'none', borderBottom: `2.5px solid ${tab === key ? '#0d1117' : 'transparent'}`, fontWeight: tab === key ? 800 : 500, cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ padding: '28px 32px' }}>
            {tab === 'specs' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
                {attributes.map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f4f5f7', gap: 16 }}>
                    <span style={{ color: '#9ca3af' }}>{key}</span>
                    <span style={{ color: '#0d1117', fontWeight: 700, textAlign: 'right' }}>{value}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'desc' && <p style={{ maxWidth: 760, fontSize: 15, color: '#374151', lineHeight: 1.8 }}>{product.description || 'San pham chua co mo ta.'}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
