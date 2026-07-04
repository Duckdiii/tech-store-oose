import { useState, useEffect } from 'react';
import { fmt } from '../../../utils/format';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';
import { productApi } from '../../../api/productApi';
import { promotionApi } from '../../../api/promotionApi';

// Brand SVG Icons (Simple Icons optimized)
function AppleIcon({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color }}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function SamsungIcon({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color }}>
      <path d="M19.8166 10.2808l.0459 2.6934h-.023l-.7793-2.6934h-1.2837v3.3925h.8481l-.0458-2.785h.023l.8366 2.785h1.2264v-3.3925zm-16.149 0l-.6418 3.427h.9284l.4699-3.1175h.0229l.4585 3.1174h.9169l-.6304-3.4269zm5.1805 0l-.424 2.6132h-.023l-.424-2.6132H6.5788l-.0688 3.427h.8596l.023-3.0832h.0114l.573 3.0831h.8711l.5731-3.083h.023l.0228 3.083h.8596l-.0802-3.4269zm-7.2664 2.4527c.0343.0802.0229.1949.0114.2522-.0229.1146-.1031.2292-.3324.2292-.2177 0-.3438-.126-.3438-.3095v-.3323H0v.2636c0 .7679.6074.9971 1.2493.9971.6189 0 1.1346-.2178 1.2149-.7794.0458-.298.0114-.4928 0-.5616-.1605-.722-1.467-.9283-1.5588-1.3295-.0114-.0688-.0114-.1375 0-.1834.023-.1146.1032-.2292.3095-.2292.2063 0 .321.126.321.3095v.2063h.8595v-.2407c0-.745-.6762-.8596-1.1576-.8596-.6074 0-1.1117.2063-1.2034.7564-.023.149-.0344.2866.0114.4585.1376.7106 1.364.9169 1.5358 1.3524m11.152 0c.0343.0803.0228.1834.0114.2522-.023.1146-.1032.2292-.3324.2292-.2178 0-.3438-.126-.3438-.3095v-.3323h-.917v.2636c0 .7564.596.9857 1.2379.9857.6189 0 1.1232-.2063 1.2034-.7794.0459-.298.0115-.4814 0-.5616-.1375-.7106-1.4327-.9284-1.5243-1.318-.0115-.0688-.0115-.1376 0-.1835.0229-.1146.1031-.2292.3094-.2292.1948 0 .321.126.321.3095v.2063h.848v-.2407c0-.745-.6647-.8596-1.146-.8596-.6075 0-1.1004.1948-1.192.7564-.023.149-.023.2866.0114.4585.1376.7106 1.341.9054 1.513 1.3524m2.8882.4585c.2407 0 .3094-.1605.3323-.2522.0115-.0343.0115-.0917.0115-.126v-2.533h.871v2.4642c0 .0688 0 .1948-.0114.2292-.0573.6419-.5616.8482-1.192.8482-.6303 0-1.1346-.2063-1.192-.8482 0-.0344-.0114-.1604-.0114-.2292v-2.4642h.871v2.533c0 .0458 0 .0916.0115.126 0 .0917.0688.2522.3095.2522m7.1518-.0344c.2522 0 .3324-.1605.3553-.2522.0115-.0343.0115-.0917.0115-.126v-.4929h-.3553v-.5043H24v.917c0 .0687 0 .1145-.0115.2292-.0573.6303-.596.8481-1.2034.8481-.6075 0-1.1461-.2178-1.2034-.8481-.0115-.1147-.0115-.1605-.0115-.2293v-1.444c0-.0574.0115-.172.0115-.2293.0802-.6419.596-.8482 1.2034-.8482s1.1347.2063 1.2034.8482c.0115.1031.0115.2292.0115.2292v.1146h-.8596v-.1948s0-.0803-.0115-.1261c-.0114-.0802-.0802-.2521-.3438-.2521-.2521 0-.321.1604-.3438.2521-.0115.0458-.0115.1032-.0115.1605v1.5702c0 .0458 0 .0916.0115.126 0 .0917.0917.2522.3323.2522" />
    </svg>
  );
}

function XiaomiIcon({ size = 20, color = '#FF6700' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color }}>
      <path d="M12 0C8.016 0 4.756.255 2.493 2.516.23 4.776 0 8.033 0 12.012c0 3.98.23 7.235 2.494 9.497C4.757 23.77 8.017 24 12 24c3.983 0 7.243-.23 9.506-2.491C23.77 19.247 24 15.99 24 12.012c0-3.984-.233-7.243-2.502-9.504C19.234.252 15.978 0 12 0zM4.906 7.405h5.624c1.47 0 3.007.068 3.764.827.746.746.827 2.233.83 3.676v4.54a.15.15 0 0 1-.152.147h-1.947a.15.15 0 0 1-.152-.148V11.83c-.002-.806-.048-1.634-.464-2.051-.358-.36-1.026-.441-1.72-.458H7.158a.15.15 0 0 0-.151.147v6.98a.15.15 0 0 1-.152.148H4.906a.15.15 0 0 1-.15-.148V7.554a.15.15 0 0 1 .15-.149zm12.131 0h1.949a.15.15 0 0 1 .15.15v8.892a.15.15 0 0 1-.15.148h-1.949a.15.15 0 0 1-.151-.148V7.554a.15.15 0 0 1 .151-.149zM8.92 10.948h2.046c.083 0 .15.066.15.147v5.352a.15.15 0 0 1-.15.148H8.92a.15.15 0 0 1-.152-.148v-5.352a.15.15 0 0 1 .152-.147Z" />
    </svg>
  );
}

function OppoIcon({ size = 20, color = '#00c070' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color }}>
      <path d="M2.85 12.786h-.001C1.639 12.774.858 12.2.858 11.321s.781-1.452 1.99-1.465c1.21.013 1.992.588 1.992 1.465s-.782 1.453-1.99 1.465zm.034-3.638h-.073C1.156 9.175 0 10.068 0 11.32s1.156 2.147 2.811 2.174h.073c1.655-.027 2.811-.921 2.811-2.174S4.54 9.175 2.885 9.148zm18.27 3.638c-1.21-.012-1.992-.587-1.992-1.465s.782-1.452 1.991-1.465c1.21.013 1.991.588 1.991 1.465s-.781 1.453-1.99 1.465zm.035-3.638h-.073c-1.655.027-2.811.92-2.811 2.173s1.156 2.147 2.81 2.174h.074C22.844 13.468 24 12.574 24 11.32s-1.156-2.146-2.811-2.173zm-6.126 3.638c-1.21-.012-1.99-.587-1.99-1.465s.78-1.452 1.99-1.465c1.21.013 1.991.588 1.991 1.465s-.781 1.453-1.99 1.465zm.036-3.638h-.073c-.789.013-1.464.222-1.955.574v-.37h-.857v5.5h.857v-1.931c.49.351 1.166.56 1.954.574h.074c1.655-.027 2.81-.921 2.81-2.174s-1.155-2.146-2.81-2.173zm-6.144 3.638c-1.21-.012-1.99-.587-1.99-1.465s.78-1.452 1.99-1.465c1.21.013 1.991.588 1.991 1.465s-.781 1.453-1.99 1.465zm.037-3.638H8.92c-.789.013-1.464.222-1.955.574v-.37h-.856v5.5h.856v-1.931c.491.351 1.166.56 1.955.574a3.728 3.728 0 0 0 .073 0c1.655-.027 2.811-.921 2.811-2.174s-1.156-2.146-2.81-2.173z" />
    </svg>
  );
}

function VivoIcon({ size = 20, color = '#415fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color }}>
      <path d="M19.604 14.101c-1.159 0-1.262-.95-1.262-1.24 0-.29.103-1.242 1.262-1.242h2.062c1.16 0 1.263.951 1.263 1.242 0 .29-.104 1.24-1.263 1.24m-2.062-3.527c-2.142 0-2.333 1.752-2.333 2.287 0 .535.19 2.286 2.333 2.286h2.062c2.143 0 2.334-1.751 2.334-2.286 0-.535-.19-2.287-2.334-2.287m-5.477.107c-.286 0-.345.05-.456.213-.11.164-2.022 3.082-2.022 3.082-.06.09-.126.126-.206.126-.08 0-.145-.036-.206-.126 0 0-1.912-2.918-2.022-3.082-.11-.164-.17-.213-.456-.213h-.668c-.154 0-.224.12-.127.267l2.283 3.467c.354.521.614.732 1.196.732s.842-.21 1.196-.732l2.284-3.467c.096-.146.026-.267-.128-.267m-8.876.284c0-.203.08-.284.283-.284h.505c.203 0 .283.08.283.283v3.9c0 .202-.08.283-.283.283h-.505c-.203 0-.283-.08-.283-.283zm-1.769-.285c-.287 0-.346.05-.456.213-.11.164-2.022 3.082-2.022 3.082-.061.09-.126.126-.206.126-.08 0-.145-.036-.206-.126 0 0-1.912-2.918-2.023-3.082-.11-.164-.169-.213-.455-.213H.175c-.171 0-.224.12-.127.267l2.283 3.467c.355.521.615.732 1.197.732.582 0 .842-.21 1.196-.732l2.283-3.467c.097-.146.044-.267-.127-.267m1.055-.893c-.165-.164-.165-.295 0-.46l.351-.351c.165-.165.296-.165.46 0l.352.351c.165.165.165.296 0 .46l-.352.352c-.164.165-.295.165-.46 0z" />
    </svg>
  );
}

function RealmeIcon({ size = 20, color = '#ffc800' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color }}>
      <path d="M6 8h3v1.8c.8-1.2 2-2 3.5-2H13v3h-.8c-2 0-3.2 1.2-3.2 3.2V18H6V8z" />
    </svg>
  );
}

// Trust Badge Icons (Lucide-style outline SVGs)
function ShieldIcon({ size = 20, color = '#0d1117' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function TruckIcon({ size = 20, color = '#0d1117' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

// RotateCw / Exchange Icon
function RefreshIcon({ size = 20, color = '#0d1117' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function CreditCardIcon({ size = 20, color = '#0d1117' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <line x1="6" y1="13" x2="10" y2="13" />
    </svg>
  );
}

function LightningIcon({ size = 16, color = '#f59e0b', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" style={style}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const INITIAL_CATEGORIES = [
  { id: 1, icon: <AppleIcon color="#fff" />, name: 'Apple', count: '... sản phẩm' },
  { id: 2, icon: <SamsungIcon color="#60a5fa" />, name: 'Samsung', count: '... sản phẩm' },
  { id: 3, icon: <XiaomiIcon color="#ff6700" />, name: 'Xiaomi', count: '... sản phẩm' },
  { id: 4, icon: <OppoIcon color="#00c070" />, name: 'OPPO', count: '... sản phẩm' },
  { id: 5, icon: <VivoIcon color="#415fff" />, name: 'Vivo', count: '... sản phẩm' },
  { id: 6, icon: <RealmeIcon color="#ffc800" />, name: 'Realme', count: '... sản phẩm' },
];

const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Realme', 'Nokia'];

const HERO_STATS = [
  { target: 500, decimals: 0, suffix: '+', label: 'Sản phẩm' },
  { target: 50, decimals: 0, suffix: 'K+', label: 'Khách hàng' },
  { target: 4.9, decimals: 1, suffix: '★', label: 'Đánh giá' },
  { target: 30, decimals: 0, suffix: '', label: 'Ngày đổi trả' },
];

// Đếm dần từ 0 lên target mỗi khi component mount (trang chủ reload hoặc user điều hướng vào lại).
function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(0);
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function HeroStat({ target, decimals, suffix }) {
  const value = useCountUp(target);
  return <>{value.toFixed(decimals)}{suffix}</>;
}

const REVIEWS = [
  { name: 'Nguyễn Thị Hoa', avatar: 'NH', product: 'iPhone 15 Pro Max', date: '12/06/2025', text: 'Shop bán hàng uy tín, giao hàng nhanh, máy chính hãng 100%. Mình đã mua lần 3 rồi, lần nào cũng hài lòng!' },
  { name: 'Trần Văn Minh', avatar: 'TM', product: 'Samsung Galaxy S24', date: '08/06/2025', text: 'Giá tốt hơn các shop khác, được tặng kèm ốp lưng và cường lực. Nhân viên tư vấn nhiệt tình, chuyên nghiệp.' },
  { name: 'Lê Thị Lan', avatar: 'LL', product: 'Xiaomi 14 Pro', date: '05/06/2025', text: 'Máy đẹp, mượt, đúng hàng chính hãng. Bao bì nguyên seal, giao hàng đúng hẹn. Sẽ giới thiệu bạn bè!' },
];

const BLOGS = [
  { category: 'Review', date: '15/06/2025', readTime: '5 phút đọc', tag: 'iPhone', title: 'iPhone 15 Pro Max sau 6 tháng sử dụng: Có còn đáng mua?', excerpt: 'Sau nửa năm trải nghiệm thực tế, chúng tôi đánh giá toàn diện hiệu suất, camera và thời lượng pin của iPhone 15 Pro Max...', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500' },
  { category: 'Tin tức', date: '12/06/2025', readTime: '3 phút đọc', tag: 'Samsung', title: 'Samsung Galaxy S25 Ultra lộ diện: Thiết kế mới hoàn toàn?', excerpt: 'Các tài liệu rò rỉ mới nhất cho thấy Samsung sẽ thay đổi hoàn toàn thiết kế dòng S25 Ultra với viền phẳng và S Pen cải tiến...', image: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?w=500' },
  { category: 'Hướng dẫn', date: '10/06/2025', readTime: '7 phút đọc', tag: 'Tips', title: 'Top 5 mẹo tiết kiệm pin điện thoại Android hiệu quả nhất 2025', excerpt: 'Những cài đặt đơn giản nhưng cực kỳ hiệu quả giúp điện thoại Android của bạn sử dụng được lâu hơn mà không ảnh hưởng hiệu năng...', image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500' },
];

function pad(n) { return String(n).padStart(2, '0'); }

function useCountdownTarget(targetTimeStr) {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!targetTimeStr) return;
    const target = new Date(targetTimeStr).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setT({ h: 0, m: 0, s: 0 });
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setT({ h, m, s });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetTimeStr]);

  return t;
}

export function HomePage() {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Mới nhất');

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  const [flashSale, setFlashSale] = useState({ promotionId: null, discountPercent: 0, endAt: null, products: [] });
  const [loadingFlashSale, setLoadingFlashSale] = useState(true);

  const cd = useCountdownTarget(flashSale.endAt);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        let sortQuery = 'createdAt,desc'; // Mới nhất: sản phẩm tạo gần đây nhất
        let onPromotion;
        if (activeTab === 'Bán chạy') sortQuery = 'sold,desc'; // tổng số lượng đã bán từ đơn hàng COMPLETED
        if (activeTab === 'Giảm giá') { sortQuery = 'price,asc'; onPromotion = true; } // chỉ sản phẩm đang có khuyến mãi active

        const data = await productApi.searchProducts({ size: 8, sort: sortQuery, onPromotion });
        setProducts(data.content || []);
      } catch (err) {
        console.error("Failed to fetch products for home", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  useEffect(() => {
    const fetchFlashSale = async () => {
      setLoadingFlashSale(true);
      try {
        const data = await promotionApi.getFlashSale();
        if (data && data.products) {
          setFlashSale(data);
        }
      } catch (err) {
        console.error("Failed to fetch flash sale for home", err);
      } finally {
        setLoadingFlashSale(false);
      }
    };
    fetchFlashSale();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const promises = INITIAL_CATEGORIES.map(async (cat) => {
          const res = await productApi.searchProducts({ brand: cat.name, size: 1 });
          return {
            ...cat,
            count: `${res.totalElements || 0} sản phẩm`
          };
        });
        const updated = await Promise.all(promises);
        setCategories(updated);
      } catch (err) {
        console.error("Failed to fetch product counts by brand", err);
      }
    };
    fetchCounts();
  }, []);

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
              <button style={{ padding: '14px 26px', background: 'transparent', color: '#64748b', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 9, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Xem Flash Sale <LightningIcon size={14} color="#f59e0b" />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 32 }}>
              {HERO_STATS.map(({ target, decimals, suffix, label }, i) => (
                <div key={label} style={{ flex: 1, textAlign: 'center', padding: '0 12px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: -1.5, lineHeight: 1 }}>
                    <HeroStat target={target} decimals={decimals} suffix={suffix} />
                  </div>
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
            { icon: <ShieldIcon color="#0d1117" />, title: 'Bảo hành chính hãng', sub: '12 tháng tại TTBH hãng' },
            { icon: <TruckIcon color="#0d1117" />, title: 'Giao hàng toàn quốc', sub: 'Miễn phí từ 500.000₫' },
            { icon: <RefreshIcon color="#0d1117" />, title: 'Đổi trả dễ dàng', sub: '30 ngày không cần lý do' },
            { icon: <CreditCardIcon color="#0d1117" />, title: 'Thanh toán linh hoạt', sub: 'Trả góp 0% lãi suất' },
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
            {categories.map(cat => (
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
            {loadingProducts ? (
              <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>Đang tải...</div>
            ) : products.map(item => (
              <div key={item.id}
                style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #f1f3f5', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.22s' }}
                onClick={() => navigate(`/products/${item.id}`)}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 10px 32px rgba(0,0,0,0.09)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
                <div style={{ background: '#f8fafc', padding: '16px', height: 196, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.name} style={{ height: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s' }} />
                  ) : (
                    <svg width="48" height="48" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  )}
                  {item.discount && <span style={{ position: 'absolute', top: 11, right: 11, background: '#e11d48', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 5 }}>{item.discount}</span>}
                  <span style={{ position: 'absolute', top: 11, left: 11, background: '#0d1117', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 5 }}>Mới</span>
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>{item.brandName || 'Thương hiệu'}</div>
                  <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#0d1117', marginBottom: 9, lineHeight: 1.35 }}>{item.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <span style={{ fontSize: 12.5, color: '#f59e0b', letterSpacing: 1 }}>★★★★★</span>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{item.rating || 5.0} ({item.reviews || 0})</span>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 19, fontWeight: 900, color: '#0d1117', letterSpacing: -0.5 }}>{fmt(item.lowestPrice)}₫</span>
                    {item.originalPrice > item.lowestPrice && (
                      <span style={{ fontSize: 12, color: '#c4c9d4', textDecoration: 'line-through', marginLeft: 8 }}>{fmt(item.originalPrice)}₫</span>
                    )}
                  </div>
                  <button onClick={e => { e.stopPropagation(); addItem({ id: item.id, name: item.name, price: item.lowestPrice, brand: item.brandName || '', brandName: item.brandName || '', thumbnailUrl: item.thumbnailUrl || '' }); }}
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
      {!loadingFlashSale && flashSale.products.length > 0 && (
        <section style={{ background: '#0d1117', padding: '64px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%,rgba(225,29,72,0.06) 0%,transparent 50%)', pointerEvents: 'none' }}/>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: -1.2 }}>FLASH SALE</span>
                    <LightningIcon size={28} color="#f59e0b" style={{ marginLeft: 4 }} />
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
              {flashSale.products.map(fp => (
                <div key={fp.id}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.transform='none'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 132, marginBottom: 14, position: 'relative', background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: 8 }}>
                    {fp.thumbnailUrl ? (
                      <img src={fp.thumbnailUrl} alt={fp.name} style={{ height: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    ) : (
                      <svg width="40" height="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" viewBox="0 0 24 24">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    )}
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
                  <button onClick={() => addItem({ id: fp.id, name: fp.name, price: fp.price, brand: fp.brandName || '', brandName: fp.brandName || '', thumbnailUrl: fp.thumbnailUrl || '' })}
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
      )}

      {/* ===== BRANDS ===== */}
      <section style={{ background: '#fff', padding: '64px 0', borderTop: '1px solid #f1f3f5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 2.5, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Đối tác</span>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: '#0d1117', letterSpacing: -1 }}>Thương hiệu chính hãng</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 12 }}>
            {BRANDS.map(brand => (
              <div key={brand}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '22px 12px', border: '1.5px solid #f1f3f5', borderRadius: 14, fontSize: 17, fontWeight: 900, color: '#111827', transition: 'all 0.2s', userSelect: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 4px 14px rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; }}>
                {brand}
              </div>
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
                <div style={{ height: 196, position: 'relative', overflow: 'hidden' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
