<<<<<<< HEAD
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';

const ALL_PRODUCTS = [
  { id: 1,  brand: 'Apple',   name: 'iPhone 15 Pro Max 256GB', price: 34990000, oldPrice: 38000000, rating: 4.9, reviews: '2.4K', discount: '-8%',  tag: 'Mới',  tagBg: '#0d1117', ram: '8GB',  storage: '256GB',
    colors: ['Titan Đen', 'Titan Trắng', 'Titan Xanh', 'Titan Tự nhiên'],
    storages: ['256GB','512GB','1TB'], prices: { '256GB': 34990000, '512GB': 37990000, '1TB': 43990000 },
    specs: { 'Màn hình': '6.7" Super Retina XDR, ProMotion 120Hz', 'Chip': 'Apple A17 Pro', 'RAM': '8 GB', 'Camera': '48MP + 12MP + 12MP', 'Pin': '4.422 mAh', 'Hệ điều hành': 'iOS 17', 'Kết nối': 'USB-C, Wi-Fi 6E, Bluetooth 5.3', 'Kích thước': '159.9 × 76.7 × 8.25 mm', 'Trọng lượng': '221 g' },
    desc: 'iPhone 15 Pro Max là chiếc iPhone mạnh mẽ nhất từ trước đến nay với chip A17 Pro tiên tiến, hệ thống camera chuyên nghiệp 48MP và khung titan nhẹ bền. Màn hình Super Retina XDR 6.7 inch với ProMotion 120Hz mang lại trải nghiệm hình ảnh tuyệt vời.' },
  { id: 2,  brand: 'Samsung', name: 'Samsung Galaxy S24 Ultra 512GB', price: 28990000, oldPrice: 33000000, rating: 4.8, reviews: '1.8K', discount: '-12%', tag: 'Hot',  tagBg: '#e11d48', ram: '12GB', storage: '512GB',
    colors: ['Titan Đen', 'Titan Xám', 'Titan Tím', 'Titan Vàng'],
    storages: ['256GB','512GB','1TB'], prices: { '256GB': 25990000, '512GB': 28990000, '1TB': 33990000 },
    specs: { 'Màn hình': '6.8" Dynamic AMOLED 2X, 120Hz', 'Chip': 'Snapdragon 8 Gen 3', 'RAM': '12 GB', 'Camera': '200MP + 12MP + 10MP + 50MP', 'Pin': '5.000 mAh', 'Hệ điều hành': 'Android 14, One UI 6.1', 'Kết nối': 'USB-C 3.2, Wi-Fi 7, Bluetooth 5.3', 'Kích thước': '162.3 × 79 × 8.6 mm', 'Trọng lượng': '232 g' },
    desc: 'Samsung Galaxy S24 Ultra với bút S Pen tích hợp, camera 200MP vượt trội và chip Snapdragon 8 Gen 3 mạnh mẽ. Màn hình Dynamic AMOLED 2X 6.8 inch sắc nét và khung titan cao cấp.' },
  { id: 3,  brand: 'Xiaomi',  name: 'Xiaomi 14 Pro 512GB',          price: 18990000, oldPrice: 21000000, rating: 4.7, reviews: '956',  discount: '-10%', tag: 'Mới',  tagBg: '#0d1117', ram: '12GB', storage: '512GB',
    colors: ['Đen', 'Trắng', 'Xanh Neptune'],
    storages: ['256GB','512GB'], prices: { '256GB': 16990000, '512GB': 18990000 },
    specs: { 'Màn hình': '6.73" LTPO AMOLED, 120Hz', 'Chip': 'Snapdragon 8 Gen 3', 'RAM': '12 GB', 'Camera': '50MP Leica + 50MP + 50MP', 'Pin': '4.880 mAh', 'Hệ điều hành': 'Android 14, HyperOS', 'Kết nối': 'USB-C, Wi-Fi 7, Bluetooth 5.4', 'Kích thước': '161.4 × 75.3 × 8.49 mm', 'Trọng lượng': '223 g' },
    desc: 'Xiaomi 14 Pro với camera Leica đẳng cấp, chip Snapdragon 8 Gen 3 và màn hình LTPO AMOLED sắc nét. Sạc nhanh HyperCharge 120W đầy pin chỉ trong 23 phút.' },
  { id: 4,  brand: 'OPPO',    name: 'OPPO Find X7 Pro 256GB',       price: 24990000, oldPrice: 27000000, rating: 4.6, reviews: '743',  discount: '-7%',  tag: 'Sale', tagBg: '#f59e0b', ram: '16GB', storage: '256GB',
    colors: ['Đen Biển Sâu', 'Xanh Bầu Trời'],
    storages: ['256GB','512GB'], prices: { '256GB': 24990000, '512GB': 27990000 },
    specs: { 'Màn hình': '6.82" LTPO AMOLED, 120Hz', 'Chip': 'Snapdragon 8 Gen 3', 'RAM': '16 GB', 'Camera': '50MP Hasselblad + 50MP + 64MP', 'Pin': '5.000 mAh', 'Hệ điều hành': 'Android 14, ColorOS 14', 'Kết nối': 'USB-C, Wi-Fi 7, Bluetooth 5.4', 'Kích thước': '164.3 × 76.2 × 9.5 mm', 'Trọng lượng': '220 g' },
    desc: 'OPPO Find X7 Pro với hệ thống camera Hasselblad chuyên nghiệp, màn hình LTPO AMOLED và sạc nhanh SuperVOOC 100W. Thiết kế sang trọng với khung vân gỗ độc đáo.' },
  { id: 5,  brand: 'Apple',   name: 'iPhone 15 128GB',               price: 22990000, oldPrice: 25000000, rating: 4.8, reviews: '3.1K', discount: '-8%',  tag: 'Mới',  tagBg: '#0d1117', ram: '6GB',  storage: '128GB',
    colors: ['Hồng', 'Vàng', 'Xanh lá', 'Xanh dương', 'Đen'],
    storages: ['128GB','256GB','512GB'], prices: { '128GB': 22990000, '256GB': 25990000, '512GB': 30990000 },
    specs: { 'Màn hình': '6.1" Super Retina XDR, 60Hz', 'Chip': 'Apple A16 Bionic', 'RAM': '6 GB', 'Camera': '48MP + 12MP', 'Pin': '3.877 mAh', 'Hệ điều hành': 'iOS 17', 'Kết nối': 'USB-C, Wi-Fi 6, Bluetooth 5.3', 'Kích thước': '147.6 × 71.6 × 7.8 mm', 'Trọng lượng': '171 g' },
    desc: 'iPhone 15 với camera 48MP mới, cổng USB-C và chip A16 Bionic mạnh mẽ. Màn hình Super Retina XDR 6.1 inch tuyệt đẹp trong thiết kế nhôm và kính sang trọng.' },
  { id: 6,  brand: 'Samsung', name: 'Samsung Galaxy Z Fold 5 256GB', price: 43990000, oldPrice: 48000000, rating: 4.7, reviews: '621',  discount: '-8%',  tag: 'Hot',  tagBg: '#e11d48', ram: '12GB', storage: '256GB',
    colors: ['Kem', 'Xanh Đá Phiến', 'Đen'],
    storages: ['256GB','512GB'], prices: { '256GB': 43990000, '512GB': 47990000 },
    specs: { 'Màn hình chính': '7.6" Dynamic AMOLED 2X, 120Hz', 'Màn hình phụ': '6.2" Dynamic AMOLED 2X', 'Chip': 'Snapdragon 8 Gen 2', 'RAM': '12 GB', 'Camera': '50MP + 12MP + 10MP', 'Pin': '4.400 mAh', 'Hệ điều hành': 'Android 13, One UI 5.1.1', 'Trọng lượng': '253 g' },
    desc: 'Galaxy Z Fold 5 là smartphone màn hình gập cao cấp nhất của Samsung với bản lề Flex mỏng hơn, màn hình AMOLED 7.6 inch và chip Snapdragon 8 Gen 2 mạnh mẽ.' },
  { id: 7,  brand: 'Vivo',    name: 'Vivo X100 Pro 256GB',           price: 19990000, oldPrice: 22000000, rating: 4.6, reviews: '412',  discount: '-9%',  tag: 'Mới',  tagBg: '#0d1117', ram: '12GB', storage: '256GB',
    colors: ['Đen Tinh Thể', 'Trắng Tinh Tuyết', 'Xanh Dương Sâu'],
    storages: ['256GB','512GB'], prices: { '256GB': 19990000, '512GB': 22990000 },
    specs: { 'Màn hình': '6.78" LTPO AMOLED, 120Hz', 'Chip': 'MediaTek Dimensity 9300', 'RAM': '12 GB', 'Camera': '50MP ZEISS + 50MP + 64MP', 'Pin': '5.400 mAh', 'Hệ điều hành': 'Android 14, OriginOS 4', 'Kết nối': 'USB-C, Wi-Fi 7, Bluetooth 5.4', 'Trọng lượng': '225 g' },
    desc: 'Vivo X100 Pro với camera ZEISS chuyên nghiệp, chip Dimensity 9300 mạnh mẽ và pin 5.400 mAh dung lượng khủng. Sạc nhanh FlashCharge 100W và sạc không dây 50W.' },
  { id: 8,  brand: 'Xiaomi',  name: 'Xiaomi Redmi Note 13 Pro 256GB', price: 7490000, oldPrice: 9000000, rating: 4.7, reviews: '1.5K', discount: '-17%', tag: 'Sale', tagBg: '#f59e0b', ram: '8GB',  storage: '256GB',
    colors: ['Xanh Rừng', 'Đen Bóng Đêm', 'Trắng Tuyết'],
    storages: ['128GB','256GB'], prices: { '128GB': 6490000, '256GB': 7490000 },
    specs: { 'Màn hình': '6.67" AMOLED, 120Hz', 'Chip': 'MediaTek Helio G99 Ultra', 'RAM': '8 GB', 'Camera': '200MP + 8MP + 2MP', 'Pin': '5.100 mAh', 'Hệ điều hành': 'Android 13, MIUI 14', 'Kết nối': 'USB-C, Wi-Fi 5, Bluetooth 5.2', 'Trọng lượng': '187 g' },
    desc: 'Redmi Note 13 Pro với camera 200MP sắc nét vượt trội trong phân khúc tầm trung, màn hình AMOLED 120Hz và pin 5.100 mAh sử dụng cả ngày thoải mái.' },
  { id: 9,  brand: 'OPPO',    name: 'OPPO Reno 11 Pro 256GB',        price: 14990000, oldPrice: 16990000, rating: 4.5, reviews: '534',  discount: '-12%', tag: 'Mới',  tagBg: '#0d1117', ram: '12GB', storage: '256GB',
    colors: ['Xanh Biển', 'Đen'],
    storages: ['256GB'], prices: { '256GB': 14990000 },
    specs: { 'Màn hình': '6.7" AMOLED, 120Hz', 'Chip': 'MediaTek Dimensity 8200', 'RAM': '12 GB', 'Camera': '50MP + 32MP + 8MP', 'Pin': '4.600 mAh', 'Hệ điều hành': 'Android 14, ColorOS 14', 'Trọng lượng': '185 g' },
    desc: 'OPPO Reno 11 Pro với thiết kế thời thượng, camera selfie 32MP sắc nét và màn hình AMOLED 6.7 inch tràn viền. Hiệu năng mạnh mẽ nhờ chip Dimensity 8200.' },
  { id: 10, brand: 'Samsung', name: 'Samsung Galaxy A55 128GB',       price: 10490000, oldPrice: 12490000, rating: 4.6, reviews: '887',  discount: '-16%', tag: 'Sale', tagBg: '#f59e0b', ram: '8GB',  storage: '128GB',
    colors: ['Xanh Băng', 'Đen', 'Vàng Ánh Sáng'],
    storages: ['128GB','256GB'], prices: { '128GB': 10490000, '256GB': 12490000 },
    specs: { 'Màn hình': '6.6" Super AMOLED, 120Hz', 'Chip': 'Exynos 1480', 'RAM': '8 GB', 'Camera': '50MP + 12MP + 5MP', 'Pin': '5.000 mAh', 'Hệ điều hành': 'Android 14, One UI 6.1', 'Trọng lượng': '213 g' },
    desc: 'Samsung Galaxy A55 với màn hình Super AMOLED 6.6 inch, camera 50MP chất lượng cao và thiết kế nhôm sang trọng. Hỗ trợ Galaxy AI thông minh.' },
  { id: 11, brand: 'Apple',   name: 'iPhone 14 128GB',               price: 18990000, oldPrice: 22990000, rating: 4.7, reviews: '2.1K', discount: '-17%', tag: 'Sale', tagBg: '#f59e0b', ram: '6GB',  storage: '128GB',
    colors: ['Xanh Dương', 'Tím', 'Đêm Khuya', 'Đỏ', 'Ánh Sao'],
    storages: ['128GB','256GB','512GB'], prices: { '128GB': 18990000, '256GB': 21990000, '512GB': 26990000 },
    specs: { 'Màn hình': '6.1" Super Retina XDR, 60Hz', 'Chip': 'Apple A15 Bionic', 'RAM': '6 GB', 'Camera': '12MP + 12MP', 'Pin': '3.279 mAh', 'Hệ điều hành': 'iOS 16 (nâng cấp iOS 17)', 'Kết nối': 'Lightning, Wi-Fi 6, Bluetooth 5.3', 'Trọng lượng': '172 g' },
    desc: 'iPhone 14 với chip A15 Bionic, camera 12MP cải tiến và chế độ Action Mode chống rung vượt trội. Thiết kế nhôm và kính sang trọng, phù hợp cho mọi phong cách.' },
  { id: 12, brand: 'Xiaomi',  name: 'Xiaomi Redmi 12C 128GB',        price: 3490000, oldPrice: 4290000,  rating: 4.4, reviews: '2.3K', discount: '-19%', tag: 'Sale', tagBg: '#f59e0b', ram: '4GB',  storage: '128GB',
    colors: ['Xanh Lá', 'Xám Graphite', 'Xanh Bầu Trời'],
    storages: ['64GB','128GB'], prices: { '64GB': 2990000, '128GB': 3490000 },
    specs: { 'Màn hình': '6.71" IPS LCD, 60Hz', 'Chip': 'MediaTek Helio G85', 'RAM': '4 GB', 'Camera': '50MP + 2MP', 'Pin': '5.000 mAh', 'Hệ điều hành': 'Android 12, MIUI 13', 'Kết nối': 'USB-C, Wi-Fi 5, Bluetooth 5.1', 'Trọng lượng': '192 g' },
    desc: 'Redmi 12C là lựa chọn giá rẻ thông minh với pin 5.000 mAh sử dụng cả ngày, camera 50MP chất lượng và màn hình lớn 6.71 inch. Phù hợp cho người dùng phổ thông.' },
];
=======
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';
import { productApi } from '../../../api/productApi';
>>>>>>> origin/anhvansuy

const REVIEWS_MOCK = [
  { name: 'Nguyễn Văn An', avatar: 'NA', rating: 5, date: '10/06/2025', text: 'Sản phẩm đúng như mô tả, giao hàng nhanh, đóng gói cẩn thận. Máy chạy mượt, pin trâu. Rất hài lòng!', helpful: 24 },
  { name: 'Trần Thị Bình', avatar: 'TB', rating: 5, date: '05/06/2025', text: 'Hàng chính hãng, seal nguyên vẹn. Shop tư vấn nhiệt tình, giao hàng đúng hẹn. Sẽ ủng hộ dài dài.', helpful: 18 },
  { name: 'Lê Hoàng Nam', avatar: 'LN', rating: 4, date: '01/06/2025', text: 'Máy đẹp, chạy tốt. Chỉ tiếc là không có tặng kèm phụ kiện. Nhưng giá tốt nên cũng ok.', helpful: 7 },
];

<<<<<<< HEAD
function fmt(n) { return n.toLocaleString('vi-VN'); }

export function ProductDetailPage() {
=======
function fmt(n) { return n ? n.toLocaleString('vi-VN') : '0'; }

>>>>>>> origin/anhvansuy
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

<<<<<<< HEAD
  const product = ALL_PRODUCTS.find(p => p.id === Number(id));

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(product?.storage || '');
=======
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
>>>>>>> origin/anhvansuy
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('specs');
  const [added, setAdded] = useState(false);

<<<<<<< HEAD
=======
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

>>>>>>> origin/anhvansuy
  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#f4f5f7' }}>
        <div style={{ fontSize: 64 }}>😕</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0d1117' }}>Không tìm thấy sản phẩm</h2>
        <Link to="/products" style={{ padding: '12px 28px', background: '#0d1117', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Quay lại danh mục</Link>
      </div>
    );
  }

<<<<<<< HEAD
  const currentPrice = product.prices?.[selectedStorage] ?? product.price;
  const discount = Math.round((1 - currentPrice / product.oldPrice) * 100);

  const handleAddToCart = () => {
    addItem({ ...product, id: `${product.id}-${selectedStorage}`, name: `${product.name.replace(/\d+GB$/, '').trim()} ${selectedStorage}`, price: currentPrice, storage: selectedStorage }, qty);
=======
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
>>>>>>> origin/anhvansuy
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
<<<<<<< HEAD
    addItem({ ...product, id: `${product.id}-${selectedStorage}`, name: `${product.name.replace(/\d+GB$/, '').trim()} ${selectedStorage}`, price: currentPrice, storage: selectedStorage }, qty);
    navigate('/checkout');
  };

  const relatedProducts = ALL_PRODUCTS.filter(p => p.brand === product.brand && p.id !== product.id).slice(0, 4);
=======
    handleAddToCart();
    navigate('/checkout');
  };

  const relatedProducts = []; // ALL_PRODUCTS.filter(p => p.brand === product.brand && p.id !== product.id).slice(0, 4);
>>>>>>> origin/anhvansuy

  return (
    <div style={{ background: '#f4f5f7', minHeight: '80vh', paddingBottom: 80 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f3f5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Trang chủ</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <Link to="/products" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>Điện thoại</Link>
          <span style={{ color: '#d1d5db' }}>/</span>
<<<<<<< HEAD
          <Link to={`/products?brand=${product.brand}`} style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>{product.brand}</Link>
=======
          <Link to={`/products?brand=${product.brandName}`} style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>{product.brandName}</Link>
>>>>>>> origin/anhvansuy
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
<<<<<<< HEAD
=======
                {product.images && product.images[0] && <image href={product.images[0].url} x="13" y="23" width="46" height="70" preserveAspectRatio="xMidYMid slice" />}
>>>>>>> origin/anhvansuy
                <rect x="24" y="11" width="24" height="5" rx="2.5" fill="#b8bdc8"/>
                <circle cx="36" cy="105" r="5" fill="#b8bdc8"/>
              </svg>
            </div>
<<<<<<< HEAD
            <div style={{ display: 'flex', gap: 10 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 12, border: `1.5px solid ${i===1 ? '#0d1117' : '#f1f3f5'}`, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', height: 72 }}>
                  <svg width="28" height="48" viewBox="0 0 72 120" fill="none">
                    <rect x="7" y="7" width="58" height="106" rx="13" fill="#d1d5db"/>
                    <rect x="13" y="23" width="46" height="70" rx="5" fill="#9ca3af" opacity="0.45"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>{product.brand}</div>
=======
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
>>>>>>> origin/anhvansuy
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
<<<<<<< HEAD
                <span style={{ fontSize: 16, color: '#c4c9d4', textDecoration: 'line-through' }}>{fmt(product.oldPrice)}₫</span>
              </div>
              <span style={{ display: 'inline-block', background: '#fef2f2', color: '#e11d48', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 6 }}>
                Tiết kiệm {fmt(product.oldPrice - currentPrice)}₫
=======
                <span style={{ fontSize: 16, color: '#c4c9d4', textDecoration: 'line-through' }}>{fmt(oldPrice)}₫</span>
              </div>
              <span style={{ display: 'inline-block', background: '#fef2f2', color: '#e11d48', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 6 }}>
                Tiết kiệm {fmt(oldPrice - currentPrice)}₫
>>>>>>> origin/anhvansuy
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
<<<<<<< HEAD
                Dung lượng: <span style={{ fontWeight: 800, color: '#0d1117' }}>{selectedStorage}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {product.storages.map(s => (
                  <button key={s} onClick={() => setSelectedStorage(s)}
                    style={{ padding: '10px 20px', border: `2px solid ${selectedStorage===s ? '#0d1117' : '#e9ecef'}`, borderRadius: 9, background: selectedStorage===s ? '#0d1117' : '#fff', fontSize: 13.5, fontWeight: 700, color: selectedStorage===s ? '#fff' : '#374151', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    {s}
                    {product.prices?.[s] && s !== selectedStorage && (
                      <span style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#9ca3af', marginTop: 2 }}>{fmt(product.prices[s])}₫</span>
                    )}
                  </button>
                ))}
=======
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
>>>>>>> origin/anhvansuy
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
<<<<<<< HEAD
            {tab === 'specs' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
                {Object.entries(product.specs).map(([key, val]) => (
=======
            {tab === 'specs' && product.attributes && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
                {Object.entries(product.attributes).map(([key, val]) => (
>>>>>>> origin/anhvansuy
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid #f4f5f7', gap: 16 }}>
                    <span style={{ fontSize: 13.5, color: '#9ca3af', fontWeight: 500, flexShrink: 0 }}>{key}</span>
                    <span style={{ fontSize: 13.5, color: '#0d1117', fontWeight: 600, textAlign: 'right' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'desc' && (
              <div style={{ maxWidth: 720 }}>
<<<<<<< HEAD
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, marginBottom: 20 }}>{product.desc}</p>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                    <li key={k} style={{ fontSize: 14.5, color: '#4b5563', lineHeight: 1.6 }}>
                      <strong style={{ color: '#0d1117' }}>{k}:</strong> {v}
                    </li>
                  ))}
                </ul>
=======
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
>>>>>>> origin/anhvansuy
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
