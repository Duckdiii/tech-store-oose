import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { WarehouseWorkspace } from './WarehouseWorkspace';

const adminStyles = `
  .admin-button {
    position: relative;
    overflow: hidden;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .admin-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s ease-out;
    pointer-events: none;
  }
  .admin-button:active::before {
    width: 300px;
    height: 300px;
  }
  .admin-modal {
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .admin-nav-item {
    transition: all 0.2s ease;
  }
  .admin-table tr {
    transition: background-color 0.2s ease;
  }
  .admin-table tbody tr:hover {
    background-color: #f8f9fa;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const INITIAL_DATA = {
  products: [
    { id: 'SP-001', name: 'iPhone 15 Pro Max', brand: 'Apple', category: 'Điện thoại', description: 'Flagship titanium, màn hình 6.7 inch.' },
    { id: 'SP-002', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Điện thoại', description: 'Galaxy AI, bút S Pen.' },
    { id: 'SP-003', name: 'Xiaomi 14 Pro', brand: 'Xiaomi', category: 'Điện thoại', description: 'Camera Leica, Snapdragon 8 Gen 3.' },
    { id: 'SP-004', name: 'OPPO Find X7 Pro', brand: 'OPPO', category: 'Điện thoại', description: 'Thiết bị đang tạm ẩn.' },
    { id: 'SP-005', name: 'iPhone 15', brand: 'Apple', category: 'Điện thoại', description: 'Dynamic Island, cổng USB-C.' },
  ],
  variants: [
    { id: 'IP15PM-001', productId: 'SP-001', ramGb: 8, storageGb: 256, color: 'Titanium Blue', price: 34990000, status: 'AVAILABLE' },
    { id: 'IP15PM-002', productId: 'SP-001', ramGb: 8, storageGb: 512, color: 'Titanium Natural', price: 39990000, status: 'AVAILABLE' },
    { id: 'IP15PM-003', productId: 'SP-001', ramGb: 8, storageGb: 256, color: 'Titanium Black', price: 34990000, status: 'EXPORTED' },
    { id: 'S24U-001', productId: 'SP-002', ramGb: 12, storageGb: 256, color: 'Titanium Gray', price: 28990000, status: 'AVAILABLE' },
    { id: 'S24U-002', productId: 'SP-002', ramGb: 12, storageGb: 512, color: 'Titanium Violet', price: 32990000, status: 'AVAILABLE' },
    { id: 'XM14P-001', productId: 'SP-003', ramGb: 12, storageGb: 512, color: 'Đen', price: 18990000, status: 'AVAILABLE' },
    { id: 'IP15-001', productId: 'SP-005', ramGb: 6, storageGb: 128, color: 'Hồng', price: 22990000, status: 'AVAILABLE' },
    { id: 'IP15-002', productId: 'SP-005', ramGb: 6, storageGb: 128, color: 'Xanh dương', price: 22990000, status: 'AVAILABLE' },
  ],
  orders: [
    { id: 'TS20250615001', customer: 'Nguyễn Thị Hoa', total: 34990000, payment: 'VNPay', status: 'Hoàn thành', date: '15/06/2025' },
    { id: 'TS20250615002', customer: 'Trần Văn Minh', total: 28990000, payment: 'COD', status: 'Đang giao', date: '15/06/2025' },
    { id: 'TS20250614017', customer: 'Lê Thị Lan', total: 7490000, payment: 'MoMo', status: 'Chờ xác nhận', date: '14/06/2025' },
    { id: 'TS20250614016', customer: 'Phạm Quốc Bảo', total: 19990000, payment: 'VNPay', status: 'Đã hủy', date: '14/06/2025' },
  ],
  customers: [
    { id: 'KH-101', name: 'Nguyễn Thị Hoa', email: 'hoa.nguyen@email.com', orders: 8, spent: 84500000, tier: 'Gold', active: true },
    { id: 'KH-102', name: 'Trần Văn Minh', email: 'minh.tran@email.com', orders: 5, spent: 52900000, tier: 'Silver', active: true },
    { id: 'KH-103', name: 'Lê Thị Lan', email: 'lan.le@email.com', orders: 3, spent: 26480000, tier: 'Member', active: true },
    { id: 'KH-104', name: 'Phạm Quốc Bảo', email: 'bao.pham@email.com', orders: 1, spent: 19990000, tier: 'Member', active: false },
  ],
  staff: [
    { id: 'NV-001', name: 'Nguyễn Đức Duy', email: 'duy.nguyen@techstore.vn', role: 'Manager', active: true },
    { id: 'NV-002', name: 'Trần Thu Hà', email: 'ha.tran@techstore.vn', role: 'Staff', active: true },
    { id: 'NV-003', name: 'Lê Minh Khoa', email: 'khoa.le@techstore.vn', role: 'Staff', active: true },
  ],
  warehouse: [
    { id: 'NK-00031', type: 'Nhập kho', product: 'iPhone 15 Pro Max 256GB', quantity: 12, actor: 'Trần Thu Hà', date: '15/06/2025 09:12', status: 'Hoàn tất' },
    { id: 'XK-00042', type: 'Xuất kho', product: 'Samsung Galaxy S24 Ultra', quantity: 3, actor: 'Lê Minh Khoa', date: '15/06/2025 11:05', status: 'Hoàn tất' },
    { id: 'NK-00030', type: 'Nhập kho', product: 'Xiaomi 14 Pro 512GB', quantity: 8, actor: 'Trần Thu Hà', date: '14/06/2025 14:20', status: 'Hoàn tất' },
  ],
  settings: { stockAlert: true, orderAlert: true, weeklyReport: false },
};

const NAV_ITEMS = [
  ['dashboard', 'Tổng quan'], ['products', 'Sản phẩm'], ['orders', 'Đơn hàng'], ['warehouse', 'Kho hàng'],
  ['customers', 'Khách hàng'], ['staff', 'Nhân viên'], ['reports', 'Báo cáo'], ['logs', 'Nhật ký'], ['settings', 'Cài đặt'],
];

const PAGE_META = {
  dashboard: ['Tổng quan', 'Theo dõi hiệu quả kinh doanh của TechStore'],
  products: ['Quản lý sản phẩm', 'Thêm, cập nhật và kiểm soát tình trạng sản phẩm'],
  orders: ['Quản lý đơn hàng', 'Theo dõi và cập nhật trạng thái đơn hàng'],
  warehouse: ['Quản lý kho', 'Nhập, xuất và theo dõi biến động tồn kho'],
  customers: ['Khách hàng', 'Quản lý thông tin và hạng thành viên khách hàng'],
  staff: ['Nhân viên', 'Quản lý nhân sự và phân quyền hệ thống'],
  reports: ['Báo cáo doanh thu', 'Tổng hợp kết quả kinh doanh trong tháng'],
  logs: ['Nhật ký hệ thống', 'Theo dõi các hoạt động quản trị gần đây'],
  settings: ['Cài đặt', 'Thiết lập thông báo và tuỳ chọn hệ thống'],
};

const money = (value) => `${Number(value).toLocaleString('vi-VN')}đ`;
const initials = (name) => name.split(' ').slice(-2).map((word) => word[0]).join('');
const downloadCsv = (filename, headers, rows) => {
  const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const content = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
};

function Status({ children }) {
  const key = String(children).toLowerCase();
  const tone = key.includes('hoàn') || key.includes('đang bán') || key.includes('đang giao') || key.includes('active')
    ? 'success' : key.includes('chờ') || key.includes('sắp') ? 'warning' : 'danger';
  return <span className={`admin-status admin-status--${tone}`}>{children}</span>;
}

function Metric({ label, value, hint, tone = 'dark' }) {
  return <article className="admin-metric">
    <div className={`admin-metric__mark admin-metric__mark--${tone}`} />
    <p>{label}</p><strong>{value}</strong><small>{hint}</small>
  </article>;
}

function DataTable({ columns, children }) {
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', brand: 'Apple', category: 'Điện thoại', description: '', ...(product || {}) });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, name: form.name.trim(), description: form.description.trim() });
  };
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
    <form className="admin-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
      <div className="admin-modal__head"><div><p>Danh mục sản phẩm</p><h2>{product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2></div><button type="button" className="admin-close" onClick={onClose}>×</button></div>
      <div className="admin-form-grid">
        <label className="admin-field admin-field--wide">Tên sản phẩm<input autoFocus value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Ví dụ: iPhone 16 Pro" /></label>
        <label className="admin-field">Thương hiệu<select value={form.brand} onChange={(event) => update('brand', event.target.value)}>{['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo'].map((brand) => <option key={brand}>{brand}</option>)}</select></label>
        <label className="admin-field">Danh mục<select value={form.category} onChange={(event) => update('category', event.target.value)}>{['Điện thoại', 'Laptop', 'Máy tính bảng', 'Phụ kiện'].map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="admin-field admin-field--wide">Mô tả<textarea rows="3" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Mô tả ngắn về Product" /></label>
      </div>
      <div className="admin-modal__actions"><button type="button" className="admin-button admin-button--secondary" onClick={onClose}>Hủy</button><button className="admin-button" type="submit">Lưu sản phẩm</button></div>
    </form>
  </div>;
}

function VariantForm({ product, variant, onSave, onClose }) {
  const [form, setForm] = useState(variant || { id: '', ramGb: 8, storageGb: 128, color: '', price: '', status: 'AVAILABLE' });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.id.trim() || !form.color.trim() || !form.price) return;
    onSave({ ...form, id: form.id.trim().toUpperCase(), productId: product.id, ramGb: Number(form.ramGb), storageGb: Number(form.storageGb), price: Number(form.price) });
  };
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
    <form className="admin-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
      <div className="admin-modal__head"><div><p>PHIÊN BẢN SẢN PHẨM · {product.id}</p><h2>{variant ? 'Cập nhật phiên bản' : 'Thêm phiên bản mới'}</h2></div><button type="button" className="admin-close" onClick={onClose}>×</button></div>
      <div className="admin-form-grid">
        <label className="admin-field admin-field--wide">Serial ID<input autoFocus disabled={Boolean(variant)} value={form.id} onChange={(event) => update('id', event.target.value)} placeholder="VD: IP16PM-001" /></label>
        <label className="admin-field">RAM (GB)<input type="number" min="0" value={form.ramGb} onChange={(event) => update('ramGb', event.target.value)} /></label>
        <label className="admin-field">Bộ nhớ (GB)<input type="number" min="0" value={form.storageGb} onChange={(event) => update('storageGb', event.target.value)} /></label>
        <label className="admin-field">Màu sắc<input value={form.color} onChange={(event) => update('color', event.target.value)} placeholder="VD: Titanium Blue" /></label>
        <label className="admin-field">Giá bán<input type="number" min="1" value={form.price} onChange={(event) => update('price', event.target.value)} placeholder="0" /></label>
        <label className="admin-field">Trạng thái<select value={form.status} onChange={(event) => update('status', event.target.value)}><option value="AVAILABLE">AVAILABLE</option><option value="EXPORTED">EXPORTED</option><option value="HOLD">HOLD</option></select></label>
      </div>
      <div className="admin-modal__actions"><button type="button" className="admin-button admin-button--secondary" onClick={onClose}>Hủy</button><button className="admin-button" type="submit">Lưu phiên bản</button></div>
    </form>
  </div>;
}

function VariantManager({ product, variants, onAdd, onEdit, onDelete, onClose }) {
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="admin-modal admin-modal--wide" onMouseDown={(event) => event.stopPropagation()}>
      <div className="admin-modal__head"><div><p>PHIÊN BẢN SẢN PHẨM · {product.id}</p><h2>{product.name}</h2><span className="admin-modal__description">{product.description || 'Chưa có mô tả'} · {variants.length} phiên bản</span></div><button type="button" className="admin-close" onClick={onClose}>×</button></div>
      <div className="admin-modal__toolbar"><span>Mỗi serial là một sản phẩm vật lý trong kho.</span><button className="admin-button" onClick={onAdd}>+ Thêm phiên bản</button></div>
      <DataTable columns={['Serial ID', 'RAM', 'Bộ nhớ', 'Màu sắc', 'Giá bán', 'Trạng thái', '']}>{variants.length ? variants.map((variant) => {
        const isAvailable = String(variant.status).toLowerCase() === 'available';
        return (<tr key={variant.id}><td><b>{variant.id}</b></td><td>{variant.ramGb} GB</td><td>{variant.storageGb} GB</td><td>{variant.color}</td><td><b>{money(variant.price)}</b></td><td><Status>{isAvailable ? 'Có sẵn' : 'Đã bán'}</Status></td><td><div className="admin-row-actions"><button className="admin-row-action" onClick={() => onEdit(variant)}>Sửa</button><button className="admin-row-action admin-row-action--danger" onClick={() => onDelete(variant.id)}>Xóa</button></div></td></tr>);
      }) : <tr><td colSpan="7" className="admin-table-empty">Chưa có phiên bản. Thêm serial để quản lý tồn kho.</td></tr>}</DataTable>
    </section>
  </div>;
}

function StaffForm({ onSave, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'Staff' });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => { event.preventDefault(); if (form.name.trim() && form.email.trim()) onSave(form); };
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
    <form className="admin-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
      <div className="admin-modal__head"><div><p>Nhân sự</p><h2>Thêm nhân viên</h2></div><button type="button" className="admin-close" onClick={onClose}>×</button></div>
      <div className="admin-form-grid"><label className="admin-field admin-field--wide">Họ và tên<input autoFocus value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Nguyễn Văn A" /></label><label className="admin-field admin-field--wide">Email công việc<input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="nhanvien@techstore.vn" /></label><label className="admin-field">Vai trò<select value={form.role} onChange={(event) => update('role', event.target.value)}><option>Staff</option><option>Manager</option></select></label></div>
      <div className="admin-modal__actions"><button type="button" className="admin-button admin-button--secondary" onClick={onClose}>Hủy</button><button className="admin-button" type="submit">Tạo nhân viên</button></div>
    </form>
  </div>;
}

export function AdminPortal() {
  const location = useLocation();
  const navigate = useNavigate();
  const section = location.pathname.split('/')[2] || 'dashboard';
  const activeSection = PAGE_META[section] ? section : 'dashboard';
  const warehouseView = location.pathname.split('/')[3] || 'overview';
  const [data, setData] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('techstore_admin_state') || '{}');
      return { ...INITIAL_DATA, ...stored, variants: Array.isArray(stored.variants) ? stored.variants : INITIAL_DATA.variants };
    }
    catch { return INITIAL_DATA; }
  });
  const [query, setQuery] = useState('');
  const [productForm, setProductForm] = useState(null);
  const [variantProductId, setVariantProductId] = useState(null);
  const [variantForm, setVariantForm] = useState(null);
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [toast, setToast] = useState('');
  const commit = (next, message) => { setData(next); localStorage.setItem('techstore_admin_state', JSON.stringify(next)); setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const [title] = PAGE_META[activeSection];
  const productRows = useMemo(() => data.products.map((product) => {
    const variants = data.variants.filter((variant) => variant.productId === product.id);
    const available = variants.filter((variant) => variant.status === 'AVAILABLE');
    const prices = variants.map((variant) => variant.price).filter(Boolean);
    const stock = available.length;
    return { ...product, stock, variantCount: variants.length, price: prices.length ? Math.min(...prices) : 0, status: stock === 0 ? 'Tạm ẩn' : stock < 6 ? 'Sắp hết hàng' : 'Đang bán' };
  }), [data.products, data.variants]);
  const filteredProducts = useMemo(() => productRows.filter((product) => `${product.name} ${product.brand} ${product.category || ''}`.toLowerCase().includes(query.toLowerCase())), [productRows, query]);
  const selectedVariantProduct = data.products.find((product) => product.id === variantProductId);
  const selectedVariants = data.variants.filter((variant) => variant.productId === variantProductId);

  const saveProduct = (product) => {
    const exists = data.products.some((item) => item.id === product.id);
    const nextProduct = { ...product, id: exists ? product.id : `SP-${String(data.products.length + 1).padStart(3, '0')}` };
    commit({ ...data, products: exists ? data.products.map((item) => item.id === product.id ? nextProduct : item) : [nextProduct, ...data.products] }, exists ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm mới');
    setProductForm(null);
  };
  const deleteProduct = (productId) => {
    commit({ ...data, products: data.products.filter((product) => product.id !== productId), variants: data.variants.filter((variant) => variant.productId !== productId) }, 'Đã xóa Product và các serial liên quan');
    if (variantProductId === productId) setVariantProductId(null);
  };
  const saveVariant = (variant, isNew) => {
    const exists = data.variants.some((item) => item.id === variant.id);
    if (isNew && exists) { setToast('Serial ID đã tồn tại'); return; }
    commit({ ...data, variants: exists ? data.variants.map((item) => item.id === variant.id ? variant : item) : [variant, ...data.variants] }, exists ? 'Đã cập nhật ProductVariant' : 'Đã thêm ProductVariant mới');
    setVariantForm(null);
  };
  const deleteVariant = (variantId) => commit({ ...data, variants: data.variants.filter((variant) => variant.id !== variantId) }, 'Đã xóa ProductVariant');
  const changeOrderStatus = (id, status) => commit({ ...data, orders: data.orders.map((order) => order.id === id ? { ...order, status } : order) }, `Đã cập nhật đơn ${id}`);
  const toggleCustomer = (id) => commit({ ...data, customers: data.customers.map((customer) => customer.id === id ? { ...customer, active: !customer.active } : customer) }, 'Đã cập nhật trạng thái khách hàng');
  const toggleStaff = (id) => commit({ ...data, staff: data.staff.map((member) => member.id === id ? { ...member, active: !member.active } : member) }, 'Đã cập nhật trạng thái nhân viên');
  const setSetting = (key) => commit({ ...data, settings: { ...data.settings, [key]: !data.settings[key] } }, 'Đã lưu cài đặt');
  const addStaff = (member) => { commit({ ...data, staff: [{ ...member, id: `NV-${String(data.staff.length + 1).padStart(3, '0')}`, active: true }, ...data.staff] }, 'Đã thêm nhân viên mới'); setStaffFormOpen(false); };
  return <div className="admin-shell">
    <style>{adminStyles}</style>
    <aside className="admin-sidebar">
      <Link to="/" className="admin-brand"><span>TS</span><div>TechStore<small>ADMIN PORTAL</small></div></Link>
      <p className="admin-sidebar__label">ĐIỀU HƯỚNG</p>
      <nav>{NAV_ITEMS.map(([key, label]) => <Link key={key} className={`admin-nav-item ${activeSection === key ? 'is-active' : ''}`} to={`/admin/${key}`}>{label}</Link>)}</nav>
      <div className="admin-sidebar__foot"><div className="admin-user"><span>DD</span><div><strong>Đức Duy</strong><small>Quản lý hệ thống</small></div></div><Link to="/" className="admin-back">← Về cửa hàng</Link></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div><p>TechStore / Admin</p><h1>{title}</h1></div><div className="admin-topbar__actions"><label className="admin-search"><span>Tìm kiếm</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm trong trang..." /></label><div className="admin-profile">DD</div></div></header>
      <section className="admin-content">
        {activeSection === 'dashboard' && <Dashboard data={data} navigate={navigate} />}
        {activeSection === 'products' && <Products products={filteredProducts} onAdd={() => setProductForm({})} onEdit={(product) => setProductForm(product)} onViewVariants={(product) => setVariantProductId(product.id)} onDelete={deleteProduct} />}
        {activeSection === 'orders' && <Orders orders={data.orders} onStatus={changeOrderStatus} onExport={() => downloadCsv('don-hang-techstore.csv', ['Mã đơn', 'Khách hàng', 'Ngày tạo', 'Thanh toán', 'Tổng tiền', 'Trạng thái'], data.orders.map((order) => [order.id, order.customer, order.date, order.payment, order.total, order.status]))} />}
        {activeSection === 'warehouse' && <WarehouseWorkspace view={warehouseView} navigate={navigate} products={data.products} variants={data.variants} />}
        {activeSection === 'customers' && <Customers customers={data.customers} onToggle={toggleCustomer} />}
        {activeSection === 'staff' && <Staff staff={data.staff} onToggle={toggleStaff} onAdd={() => setStaffFormOpen(true)} />}
        {activeSection === 'reports' && <Reports onExport={() => downloadCsv('bao-cao-doanh-thu-techstore.csv', ['Chỉ số', 'Giá trị'], [['Doanh thu thuần', '428500000'], ['Giá trị đơn trung bình', '2840000'], ['Tỉ lệ hoàn tất', '94.2%']])} />}
        {activeSection === 'logs' && <Logs onExport={() => downloadCsv('nhat-ky-techstore.csv', ['Thời gian', 'Nội dung', 'Phân hệ'], [['10:42', 'Đơn hàng TS20250615002 chuyển sang Đang giao', 'Đơn hàng'], ['09:12', 'Nhập kho 12 sản phẩm iPhone 15 Pro Max', 'Kho hàng'], ['08:45', 'Nguyễn Đức Duy cập nhật sản phẩm SP-001', 'Sản phẩm']])} />}
        {activeSection === 'settings' && <Settings settings={data.settings} onToggle={setSetting} />}
      </section>
    </main>
    {productForm && <ProductForm product={productForm.id ? productForm : null} onSave={saveProduct} onClose={() => setProductForm(null)} />}
    {selectedVariantProduct && <VariantManager product={selectedVariantProduct} variants={selectedVariants} onAdd={() => setVariantForm({ productId: selectedVariantProduct.id })} onEdit={setVariantForm} onDelete={deleteVariant} onClose={() => setVariantProductId(null)} />}
    {variantForm && <VariantForm product={data.products.find((product) => product.id === variantForm.productId) || selectedVariantProduct} variant={variantForm.id ? variantForm : null} onSave={(variant) => saveVariant(variant, !variantForm.id)} onClose={() => setVariantForm(null)} />}
    {staffFormOpen && <StaffForm onSave={addStaff} onClose={() => setStaffFormOpen(false)} />}
    {toast && <div className="admin-toast">✓ {toast}</div>}
  </div>;
}

function Dashboard({ data, navigate }) {
  const chart = [45, 68, 54, 82, 61, 92, 75, 96, 88, 72, 100, 84];
  return <>
    <div className="admin-page-intro"><div><p>16 Tháng 06, 2025</p><h2>Chào buổi sáng, Đức Duy.</h2></div><button className="admin-button" onClick={() => navigate('/admin/products')}>+ Thêm sản phẩm</button></div>
    <div className="admin-metrics"><Metric label="Doanh thu tháng" value="428,5 triệu" hint="↑ 12,8% so với tháng trước" /><Metric label="Đơn hàng mới" value="1.284" hint="↑ 8,4% so với tháng trước" tone="blue" /><Metric label="Khách hàng" value="8.642" hint="↑ 142 khách hàng mới" tone="purple" /><Metric label="Sản phẩm sắp hết" value="7" hint="Cần nhập thêm trong hôm nay" tone="amber" /></div>
    <div className="admin-grid admin-grid--wide"><article className="admin-card admin-chart-card"><div className="admin-card__head"><div><p>HIỆU QUẢ KINH DOANH</p><h3>Doanh thu theo tháng</h3></div><span className="admin-text-button">Năm 2025</span></div><div className="admin-chart">{chart.map((height, index) => <div key={index} className="admin-chart__item"><div style={{ height: `${height}%` }} /><span>T{index + 1}</span></div>)}</div></article><article className="admin-card"><div className="admin-card__head"><div><p>TRẠNG THÁI ĐƠN</p><h3>Phân bổ đơn hàng</h3></div></div><div className="admin-donut"><div><strong>1.284</strong><span>đơn hàng</span></div></div><div className="admin-legend"><span><i className="dot dot--dark" />Hoàn thành <b>62%</b></span><span><i className="dot dot--blue" />Đang xử lý <b>28%</b></span><span><i className="dot dot--muted" />Đã hủy <b>10%</b></span></div></article></div>
    <div className="admin-grid admin-grid--wide"><article className="admin-card"><div className="admin-card__head"><div><p>ĐƠN HÀNG</p><h3>Đơn hàng gần đây</h3></div><button className="admin-text-button" onClick={() => navigate('/admin/orders')}>Xem tất cả →</button></div><DataTable columns={['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Trạng thái']}>{data.orders.slice(0, 4).map((order) => <tr key={order.id}><td><b>{order.id}</b></td><td>{order.customer}</td><td>{money(order.total)}</td><td><Status>{order.status}</Status></td></tr>)}</DataTable></article><article className="admin-card"><div className="admin-card__head"><div><p>KHO HÀNG</p><h3>Cần chú ý</h3></div><button className="admin-text-button" onClick={() => navigate('/admin/warehouse')}>Xem kho →</button></div><div className="admin-alert-list"><div><b>Xiaomi 14 Pro 512GB</b><span>Chỉ còn 4 sản phẩm</span><Status>Sắp hết hàng</Status></div><div><b>OPPO Find X7 Pro 256GB</b><span>Hiện đã hết hàng</span><Status>Hết hàng</Status></div><div><b>iPhone 15 Pro Max 256GB</b><span>Cần kiểm tra serial mới</span><Status>Chờ xử lý</Status></div></div></article></div>
  </>;
}

function Products({ products, onAdd, onEdit, onViewVariants, onDelete }) { const [filter, setFilter] = useState('Tất cả'); const visibleProducts = filter === 'Tất cả' ? products : products.filter((product) => product.status === filter || (filter === 'Sắp hết' && product.status === 'Sắp hết hàng')); return <>
  <div className="admin-page-intro"><div><p>{products.length} sản phẩm hiển thị</p><h2>Danh mục sản phẩm</h2></div><button className="admin-button" onClick={onAdd}>+ Thêm sản phẩm</button></div>
  <article className="admin-card">
    <div className="admin-filterbar">{['Tất cả', 'Đang bán', 'Sắp hết', 'Tạm ẩn'].map((item) => <button key={item} className={`admin-filter ${filter === item ? 'is-active' : ''}`} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <DataTable columns={['Sản phẩm', 'Mã SP', 'Thương hiệu', 'Giá từ', 'Tồn kho', 'Trạng thái', '']} >
      {visibleProducts.map((product) => <tr key={product.id}>
        <td>
          <div className="admin-product"><span>{product.brand.slice(0, 1)}</span>
            <div><b>{product.name}</b><small>{product.category || 'Chưa phân loại'} · {product.variantCount} chi tiết</small></div>
          </div>
        </td>
        <td>{product.id}</td>
        <td>{product.brand}</td>
        <td><b>{product.price ? money(product.price) : '-'}</b></td>
        <td className={product.stock < 6 ? 'admin-low-stock' : ''}>{product.stock}</td>
        <td><Status>{product.status}</Status></td>
        <td>
          <div className="admin-row-actions">
            <button className="admin-row-action admin-row-action--primary" onClick={() => onViewVariants(product)}>Chi tiết ({product.variantCount})</button>
            <button className="admin-row-action" onClick={() => onEdit(product)}>Sửa</button>
            <button className="admin-row-action admin-row-action--danger" onClick={() => onDelete(product.id)}>Xóa</button>
          </div>
        </td>
      </tr>)}
    </DataTable>
  </article>
  </>; }

function Orders({ orders, onStatus, onExport }) { return <><div className="admin-page-intro"><div><p>Đồng bộ theo dữ liệu mock</p><h2>Đơn hàng gần đây</h2></div><button className="admin-button admin-button--secondary" onClick={onExport}>Xuất danh sách</button></div><article className="admin-card"><DataTable columns={['Mã đơn', 'Khách hàng', 'Ngày tạo', 'Thanh toán', 'Tổng tiền', 'Trạng thái']}>{orders.map((order) => <tr key={order.id}><td><b>{order.id}</b></td><td>{order.customer}</td><td>{order.date}</td><td>{order.payment}</td><td><b>{money(order.total)}</b></td><td><select className="admin-status-select" value={order.status} onChange={(event) => onStatus(order.id, event.target.value)}>{['Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'].map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</DataTable></article></>; }

function Customers({ customers, onToggle }) { return <><div className="admin-page-intro"><div><p>{customers.filter((customer) => customer.active).length} khách hàng đang hoạt động</p><h2>Khách hàng</h2></div></div><article className="admin-card"><DataTable columns={['Khách hàng', 'Email', 'Số đơn', 'Tổng chi tiêu', 'Hạng thành viên', 'Trạng thái', '']} >{customers.map((customer) => <tr key={customer.id}><td><div className="admin-person"><span>{initials(customer.name)}</span><b>{customer.name}</b></div></td><td>{customer.email}</td><td>{customer.orders}</td><td><b>{money(customer.spent)}</b></td><td><span className="admin-tier">{customer.tier}</span></td><td><Status>{customer.active ? 'Active' : 'Đã khóa'}</Status></td><td><button className="admin-row-action" onClick={() => onToggle(customer.id)}>{customer.active ? 'Khóa' : 'Mở khóa'}</button></td></tr>)}</DataTable></article></>; }

function Staff({ staff, onToggle, onAdd }) { return <><div className="admin-page-intro"><div><p>{staff.filter((member) => member.active).length} thành viên hoạt động</p><h2>Nhân viên & phân quyền</h2></div><button className="admin-button" onClick={onAdd}>+ Thêm nhân viên</button></div><article className="admin-card"><DataTable columns={['Nhân viên', 'Email', 'Vai trò', 'Trạng thái', '']} >{staff.map((member) => <tr key={member.id}><td><div className="admin-person"><span>{initials(member.name)}</span><b>{member.name}</b></div></td><td>{member.email}</td><td><span className="admin-role">{member.role}</span></td><td><Status>{member.active ? 'Active' : 'Đã khóa'}</Status></td><td><button className="admin-row-action" onClick={() => onToggle(member.id)}>{member.active ? 'Vô hiệu hóa' : 'Kích hoạt'}</button></td></tr>)}</DataTable></article></>; }

function Reports({ onExport }) { const values = [55, 72, 45, 63, 80, 68, 92]; return <><div className="admin-page-intro"><div><p>Tháng 06, 2025</p><h2>Báo cáo doanh thu</h2></div><button className="admin-button admin-button--secondary" onClick={onExport}>Tải báo cáo</button></div><div className="admin-metrics admin-metrics--three"><Metric label="Doanh thu thuần" value="428,5 triệu" hint="↑ 12,8% so với tháng trước" /><Metric label="Giá trị đơn trung bình" value="2,84 triệu" hint="↑ 4,1% so với tháng trước" tone="blue" /><Metric label="Tỉ lệ hoàn tất" value="94,2%" hint="Dựa trên 1.284 đơn hàng" tone="purple" /></div><div className="admin-grid admin-grid--wide"><article className="admin-card admin-chart-card"><div className="admin-card__head"><div><p>DOANH THU 7 NGÀY</p><h3>Xu hướng tuần này</h3></div></div><div className="admin-chart admin-chart--week">{values.map((height, index) => <div key={index} className="admin-chart__item"><div style={{ height: `${height}%` }} /><span>{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][index]}</span></div>)}</div></article><article className="admin-card"><div className="admin-card__head"><div><p>TOP SẢN PHẨM</p><h3>Bán chạy nhất</h3></div></div><ol className="admin-ranking"><li><span>01</span><div><b>iPhone 15 Pro Max</b><small>84 sản phẩm đã bán</small></div><strong>2,9 tỷ</strong></li><li><span>02</span><div><b>Samsung Galaxy S24 Ultra</b><small>63 sản phẩm đã bán</small></div><strong>1,8 tỷ</strong></li><li><span>03</span><div><b>Xiaomi 14 Pro</b><small>52 sản phẩm đã bán</small></div><strong>988 triệu</strong></li></ol></article></div></>; }

function Logs({ onExport }) { const logs = [['10:42', 'Đơn hàng TS20250615002 chuyển sang Đang giao', 'Đơn hàng'], ['09:12', 'Nhập kho 12 sản phẩm iPhone 15 Pro Max', 'Kho hàng'], ['08:45', 'Nguyễn Đức Duy cập nhật sản phẩm SP-001', 'Sản phẩm'], ['Hôm qua', 'Báo cáo doanh thu tháng 05 được xuất', 'Báo cáo'], ['Hôm qua', 'Tài khoản Phạm Quốc Bảo được khóa', 'Tài khoản']]; return <><div className="admin-page-intro"><div><p>Hoạt động quản trị hệ thống</p><h2>Nhật ký hệ thống</h2></div><button className="admin-button admin-button--secondary" onClick={onExport}>Xuất nhật ký</button></div><article className="admin-card"><div className="admin-log-list">{logs.map(([time, content, type]) => <div key={content}><span>{time}</span><p><b>{type}</b>{content}</p><small>Ghi nhận</small></div>)}</div></article></>; }

function Settings({ settings, onToggle }) { const rows = [['stockAlert', 'Cảnh báo tồn kho thấp', 'Gửi thông báo khi số lượng tồn xuống dưới mức tối thiểu.'], ['orderAlert', 'Thông báo đơn hàng mới', 'Hiển thị thông báo ngay khi có đơn đặt hàng mới.'], ['weeklyReport', 'Báo cáo hàng tuần', 'Gửi tóm tắt doanh thu và tồn kho vào mỗi thứ Hai.']]; return <><div className="admin-page-intro"><div><p>Thay đổi được lưu trên trình duyệt</p><h2>Cài đặt hệ thống</h2></div></div><article className="admin-card admin-settings"><div className="admin-card__head"><div><p>THÔNG BÁO</p><h3>Tuỳ chọn nhận thông tin</h3></div></div>{rows.map(([key, name, description]) => <div className="admin-setting" key={key}><div><b>{name}</b><p>{description}</p></div><button className={`admin-toggle ${settings[key] ? 'is-on' : ''}`} aria-pressed={settings[key]} onClick={() => onToggle(key)}><span /></button></div>)}</article><article className="admin-card admin-danger-zone"><div><p>VÙNG QUẢN TRỊ</p><h3>Đặt lại dữ liệu mock</h3><span>Chỉ dùng khi bạn muốn khôi phục dữ liệu quản trị ban đầu trên trình duyệt này.</span><button className="admin-button admin-button--danger" onClick={() => { localStorage.removeItem('techstore_admin_state'); window.location.reload(); }}>Khôi phục dữ liệu</button></div></article></>; }
