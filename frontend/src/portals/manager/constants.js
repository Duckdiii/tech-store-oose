export const adminStyles = `
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
  .admin-button:active::before { width: 300px; height: 300px; }
  .admin-modal { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  .admin-nav-item { transition: all 0.2s ease; }
  .admin-table tr { transition: background-color 0.2s ease; }
  .admin-table tbody tr:hover { background-color: #f8f9fa; }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes admin-spin { to { transform: rotate(360deg); } }
  .admin-skeleton {
    display: block;
    background: linear-gradient(90deg, #eef1f4 25%, #f7f8fa 37%, #eef1f4 63%);
    background-size: 400% 100%;
    animation: admin-shimmer 1.4s ease-in-out infinite;
    border-radius: 6px;
  }
  @keyframes admin-shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
  }
`;

export const INITIAL_DATA = {
  products: [
    { id: 'SP-001', name: 'iPhone 15 Pro Max',       brand: 'Apple',   category: 'Điện thoại', description: 'Flagship titanium, màn hình 6.7 inch.' },
    { id: 'SP-002', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Điện thoại', description: 'Galaxy AI, bút S Pen.' },
    { id: 'SP-003', name: 'Xiaomi 14 Pro',            brand: 'Xiaomi',  category: 'Điện thoại', description: 'Camera Leica, Snapdragon 8 Gen 3.' },
    { id: 'SP-004', name: 'OPPO Find X7 Pro',         brand: 'OPPO',    category: 'Điện thoại', description: 'Thiết bị đang tạm ẩn.' },
    { id: 'SP-005', name: 'iPhone 15',                brand: 'Apple',   category: 'Điện thoại', description: 'Dynamic Island, cổng USB-C.' },
  ],
  variants: [
    { id: 'IP15PM-001', productId: 'SP-001', ramGb: 8,  storageGb: 256, color: 'Titanium Blue',    price: 34990000, status: 'AVAILABLE' },
    { id: 'IP15PM-002', productId: 'SP-001', ramGb: 8,  storageGb: 512, color: 'Titanium Natural', price: 39990000, status: 'AVAILABLE' },
    { id: 'IP15PM-003', productId: 'SP-001', ramGb: 8,  storageGb: 256, color: 'Titanium Black',   price: 34990000, status: 'EXPORTED' },
    { id: 'S24U-001',   productId: 'SP-002', ramGb: 12, storageGb: 256, color: 'Titanium Gray',    price: 28990000, status: 'AVAILABLE' },
    { id: 'S24U-002',   productId: 'SP-002', ramGb: 12, storageGb: 512, color: 'Titanium Violet',  price: 32990000, status: 'AVAILABLE' },
    { id: 'XM14P-001',  productId: 'SP-003', ramGb: 12, storageGb: 512, color: 'Đen',              price: 18990000, status: 'AVAILABLE' },
    { id: 'IP15-001',   productId: 'SP-005', ramGb: 6,  storageGb: 128, color: 'Hồng',             price: 22990000, status: 'AVAILABLE' },
    { id: 'IP15-002',   productId: 'SP-005', ramGb: 6,  storageGb: 128, color: 'Xanh dương',       price: 22990000, status: 'AVAILABLE' },
  ],
  orders: [
    { id: 'TS20250615001', customer: 'Nguyễn Thị Hoa', total: 34990000, payment: 'VNPay', status: 'Hoàn thành',    date: '15/06/2025' },
    { id: 'TS20250615002', customer: 'Trần Văn Minh',  total: 28990000, payment: 'COD',   status: 'Đang giao',     date: '15/06/2025' },
    { id: 'TS20250614017', customer: 'Lê Thị Lan',     total: 7490000,  payment: 'MoMo',  status: 'Chờ xác nhận', date: '14/06/2025' },
    { id: 'TS20250614016', customer: 'Phạm Quốc Bảo',  total: 19990000, payment: 'VNPay', status: 'Đã hủy',       date: '14/06/2025' },
  ],
  customers: [
    { id: 'KH-101', name: 'Nguyễn Thị Hoa', email: 'hoa.nguyen@email.com', orders: 8, spent: 84500000, tier: 'Gold',   active: true },
    { id: 'KH-102', name: 'Trần Văn Minh',  email: 'minh.tran@email.com',  orders: 5, spent: 52900000, tier: 'Silver', active: true },
    { id: 'KH-103', name: 'Lê Thị Lan',     email: 'lan.le@email.com',     orders: 3, spent: 26480000, tier: 'Member', active: true },
    { id: 'KH-104', name: 'Phạm Quốc Bảo',  email: 'bao.pham@email.com',   orders: 1, spent: 19990000, tier: 'Member', active: false },
  ],
  staff: [
    { id: 'NV-001', name: 'Nguyễn Đức Duy', email: 'duy.nguyen@techstore.vn', phone: '0901 111 222', staffCode: 'TS-MGR-001', hireDate: '2023-01-10', role: 'Manager', active: true },
    { id: 'NV-002', name: 'Trần Thu Hà',    email: 'ha.tran@techstore.vn',    phone: '0912 333 444', staffCode: 'TS-STF-001', hireDate: '2023-06-15', role: 'Staff',   active: true },
    { id: 'NV-003', name: 'Lê Minh Khoa',   email: 'khoa.le@techstore.vn',    phone: '0933 555 666', staffCode: 'TS-STF-002', hireDate: '2024-02-01', role: 'Staff',   active: true },
  ],
  settings: { stockAlert: true, orderAlert: true, weeklyReport: false },
  suppliers: [],
  supplyOrders: []
};

export const LAST_BACKUP = '24/06/2026 02:00';

export const NAV_ITEMS = [
  ['dashboard', 'Tổng quan'],
  ['products',  'Sản phẩm'],
  ['orders',    'Đơn hàng'],
  ['warehouse', 'Kho hàng'],
  ['suppliers', 'Nhà cung cấp'],
  ['supply-orders', 'Đơn nhập hàng'],
  ['customers', 'Khách hàng'],
  ['staff',     'Nhân viên'],
  ['reports',   'Báo cáo'],
  ['promotions', 'Khuyến mãi'],
  ['settings',  'Cài đặt'],
];

export const PAGE_META = {
  dashboard: ['Tổng quan',          'Theo dõi hiệu quả kinh doanh của TechStore'],
  products:  ['Quản lý sản phẩm',   'Thêm, cập nhật và kiểm soát tình trạng sản phẩm'],
  orders:    ['Quản lý đơn hàng',   'Theo dõi và cập nhật trạng thái đơn hàng'],
  warehouse: ['Quản lý kho',        'Nhập, xuất và theo dõi biến động tồn kho'],
  suppliers: ['Nhà cung cấp',       'Quản lý thông tin các nhà cung cấp sản phẩm'],
  'supply-orders': ['Đơn nhập hàng', 'Tạo và theo dõi trạng thái đơn nhập hàng từ nhà cung cấp'],
  customers: ['Khách hàng',         'Quản lý thông tin và hạng thành viên khách hàng'],
  staff:     ['Nhân viên',          'Quản lý nhân sự và phân quyền hệ thống'],
  reports:   ['Báo cáo doanh thu',  'Tổng hợp kết quả kinh doanh trong tháng'],
  promotions: ['Khuyến mãi',        'Tạo chương trình khuyến mãi và marketing'],
  settings:  ['Cài đặt',            'Thiết lập thông báo và tuỳ chọn hệ thống'],
};
