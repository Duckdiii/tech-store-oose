import { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ManagerLayout } from './layout/ManagerLayout';
import { ProductForm, VariantForm, VariantManager, StaffForm } from './components/index';
import { downloadCsv } from './utils';
import { INITIAL_DATA, PAGE_META } from './constants';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { CustomersPage } from './pages/CustomersPage';
import { StaffPage } from './pages/StaffPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { WarehousePage } from './pages/WarehousePage';
import { SuppliersPage } from './pages/SuppliersPage';
import { SupplyOrdersPage } from './pages/SupplyOrdersPage';
import { SupplierForm } from './components/SupplierForm';
import { SupplyOrderForm } from './components/SupplyOrderForm';
import { supplierApi } from '../../api/supplierApi';
import { supplyOrderApi } from '../../api/supplyOrderApi';
import { useEffect } from 'react';
import { PromotionsPage } from './pages/PromotionsPage';

const WAREHOUSE_SUB_LABEL = { import: 'Nhập kho', export: 'Xuất kho', logs: 'Nhật ký kho' };

export function ManagerPortal() {
  const location = useLocation();
  const navigate = useNavigate();
  const section = location.pathname.split('/')[2] || 'dashboard';
  const activeSection = PAGE_META[section] ? section : 'dashboard';
  const warehouseView = location.pathname.split('/')[3] || 'overview';

  const [data, setData] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('techstore_admin_state') || '{}');
      return { ...INITIAL_DATA, ...stored, variants: Array.isArray(stored.variants) ? stored.variants : INITIAL_DATA.variants };
    } catch {
      return INITIAL_DATA;
    }
  });
  const [query, setQuery] = useState('');
  const [productForm, setProductForm] = useState(null);
  const [variantProductId, setVariantProductId] = useState(null);
  const [variantForm, setVariantForm] = useState(null);
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [supplierFormOpen, setSupplierFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [poFormOpen, setPoFormOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [undoData, setUndoData] = useState(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sups, pos] = await Promise.all([
          supplierApi.getAll(),
          supplyOrderApi.getAll()
        ]);
        setData(prev => ({ ...prev, suppliers: sups, supplyOrders: pos }));
      } catch (err) {
        console.error("Failed to fetch from API", err);
      }
    };
    fetchData();
  }, []);

  const showToast = (message, ttl = 2600) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = setTimeout(() => { setToast(''); setUndoData(null); }, ttl);
  };

  const commit = (next, message) => {
    setUndoData(null);
    setData(next);
    localStorage.setItem('techstore_admin_state', JSON.stringify(next));
    showToast(message);
  };

  const commitWithUndo = (next, message) => {
    const prev = data;
    setData(next);
    localStorage.setItem('techstore_admin_state', JSON.stringify(next));
    setUndoData(prev);
    showToast(message, 5000);
  };

  const handleUndo = () => {
    if (!undoData) return;
    setData(undoData);
    localStorage.setItem('techstore_admin_state', JSON.stringify(undoData));
    setUndoData(null);
    showToast('Đã hoàn tác');
  };

  const [title] = PAGE_META[activeSection];

  const badges = useMemo(() => {
    const pendingOrders = data.orders.filter((o) => o.status === 'Chờ xác nhận').length;
    const lowStockProducts = data.products.filter((p) => {
      const available = data.variants.filter((v) => v.productId === p.id && v.status === 'AVAILABLE').length;
      return available < 6;
    }).length;
    return {
      ...(pendingOrders > 0 ? { orders: { label: String(pendingOrders) } } : {}),
      ...(lowStockProducts > 0 ? { warehouse: { label: String(lowStockProducts), warn: true } } : {}),
    };
  }, [data.orders, data.products, data.variants]);

  const breadcrumbs = useMemo(() => {
    const manager = { label: 'Manager', to: '/manager/dashboard' };
    if (activeSection === 'warehouse') {
      const sub = WAREHOUSE_SUB_LABEL[warehouseView];
      if (sub) return [manager, { label: 'Kho hàng', to: '/manager/warehouse' }, { label: sub }];
      return [manager, { label: 'Kho hàng' }];
    }
    return [manager, { label: PAGE_META[activeSection][0] }];
  }, [activeSection, warehouseView]);

  const productRows = useMemo(() => data.products.map((product) => {
    const variants = data.variants.filter((v) => v.productId === product.id);
    const available = variants.filter((v) => v.status === 'AVAILABLE');
    const prices = variants.map((v) => v.price).filter(Boolean);
    const stock = available.length;
    return {
      ...product,
      stock,
      variantCount: variants.length,
      price: prices.length ? Math.min(...prices) : 0,
      status: stock === 0 ? 'Tạm ẩn' : stock < 6 ? 'Sắp hết hàng' : 'Đang bán',
    };
  }), [data.products, data.variants]);

  const filteredProducts = useMemo(() =>
    productRows.filter((p) => `${p.name} ${p.brand} ${p.category || ''}`.toLowerCase().includes(query.toLowerCase())),
    [productRows, query]
  );

  const selectedVariantProduct = data.products.find((p) => p.id === variantProductId);
  const selectedVariants = data.variants.filter((v) => v.productId === variantProductId);

  const saveProduct = (product) => {
    const exists = data.products.some((item) => item.id === product.id);
    const next = { ...product, id: exists ? product.id : `SP-${String(data.products.length + 1).padStart(3, '0')}` };
    commit(
      { ...data, products: exists ? data.products.map((item) => item.id === product.id ? next : item) : [next, ...data.products] },
      exists ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm mới'
    );
    setProductForm(null);
  };

  const deleteProduct = (productId) => {
    commitWithUndo(
      { ...data, products: data.products.filter((p) => p.id !== productId), variants: data.variants.filter((v) => v.productId !== productId) },
      'Đã xóa sản phẩm'
    );
    if (variantProductId === productId) setVariantProductId(null);
  };

  const saveVariant = (variant, isNew) => {
    const exists = data.variants.some((v) => v.id === variant.id);
    if (isNew && exists) { setToast('Serial ID đã tồn tại'); return; }
    commit(
      { ...data, variants: exists ? data.variants.map((v) => v.id === variant.id ? variant : v) : [variant, ...data.variants] },
      exists ? 'Đã cập nhật ProductVariant' : 'Đã thêm ProductVariant mới'
    );
    setVariantForm(null);
  };

  const deleteVariant = (variantId) => commit(
    { ...data, variants: data.variants.filter((v) => v.id !== variantId) },
    'Đã xóa ProductVariant'
  );

  const changeOrderStatus = (id, status) => commit(
    { ...data, orders: data.orders.map((o) => o.id === id ? { ...o, status } : o) },
    `Đã cập nhật đơn ${id}`
  );

  const toggleCustomer = (id) => commit(
    { ...data, customers: data.customers.map((c) => c.id === id ? { ...c, active: !c.active } : c) },
    'Đã cập nhật trạng thái khách hàng'
  );

  const toggleStaff = (id) => commit(
    { ...data, staff: data.staff.map((m) => m.id === id ? { ...m, active: !m.active } : m) },
    'Đã cập nhật trạng thái nhân viên'
  );

  const setSetting = (key) => commit(
    { ...data, settings: { ...data.settings, [key]: !data.settings[key] } },
    'Đã lưu cài đặt'
  );

  const addStaff = (member) => {
    commit(
      { ...data, staff: [{ ...member, id: `NV-${String(data.staff.length + 1).padStart(3, '0')}`, active: true }, ...data.staff] },
      'Đã thêm nhân viên mới'
    );
    setStaffFormOpen(false);
  };

  const deleteStaff = (id) => commitWithUndo(
    { ...data, staff: data.staff.filter((m) => m.id !== id) },
    'Đã xóa nhân viên'
  );

  const saveSupplier = async (supplierData) => {
    try {
      if (supplierData.id) {
        await supplierApi.update(supplierData.id, supplierData);
        setToast('Đã cập nhật nhà cung cấp');
      } else {
        await supplierApi.create(supplierData);
        setToast('Đã thêm nhà cung cấp mới');
      }
      const sups = await supplierApi.getAll();
      setData(prev => ({ ...prev, suppliers: sups }));
      setSupplierFormOpen(false);
      setEditingSupplier(null);
    } catch (err) {
      setToast('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await supplierApi.delete(id);
      const sups = await supplierApi.getAll();
      setData(prev => ({ ...prev, suppliers: sups }));
      setToast('Đã xóa nhà cung cấp');
    } catch (err) {
      setToast('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const saveSupplyOrder = async (poData) => {
    try {
      await supplyOrderApi.create(poData);
      const pos = await supplyOrderApi.getAll();
      setData(prev => ({ ...prev, supplyOrders: pos }));
      setToast('Đã tạo đơn nhập hàng');
      setPoFormOpen(false);
    } catch (err) {
      setToast('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const updateSOStatus = async (id, status) => {
    try {
      await supplyOrderApi.updateStatus(id, status);
      const pos = await supplyOrderApi.getAll();
      setData(prev => ({ ...prev, supplyOrders: pos }));
      setToast(`Đã cập nhật trạng thái đơn thành ${status}`);
    } catch (err) {
      setToast('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <ManagerLayout activeSection={activeSection} title={title} query={query} onQueryChange={setQuery} breadcrumbs={breadcrumbs} badges={badges}>
        {activeSection === 'dashboard' && (
          <DashboardPage data={data} />
        )}
        {activeSection === 'products' && (
          <ProductsPage
            products={filteredProducts}
            onAdd={() => setProductForm({})}
            onEdit={(product) => setProductForm(product)}
            onViewVariants={(product) => setVariantProductId(product.id)}
            onDelete={deleteProduct}
          />
        )}
        {activeSection === 'orders' && (
          <OrdersPage
            orders={data.orders}
            onStatus={changeOrderStatus}
            onExport={() => downloadCsv(
              'don-hang-techstore.csv',
              ['Mã đơn', 'Khách hàng', 'Ngày tạo', 'Thanh toán', 'Tổng tiền', 'Trạng thái'],
              data.orders.map((o) => [o.id, o.customer, o.date, o.payment, o.total, o.status])
            )}
          />
        )}
        {activeSection === 'warehouse' && (
          <WarehousePage view={warehouseView} navigate={navigate} products={data.products} variants={data.variants} />
        )}
        {activeSection === 'customers' && (
          <CustomersPage customers={data.customers} onToggle={toggleCustomer} />
        )}
        {activeSection === 'staff' && (
          <StaffPage staff={data.staff} onToggle={toggleStaff} onAdd={() => setStaffFormOpen(true)} onDelete={deleteStaff} />
        )}
        {activeSection === 'reports' && (
          <ReportsPage onExport={() => downloadCsv(
            'bao-cao-doanh-thu-techstore.csv',
            ['Chỉ số', 'Giá trị'],
            [['Doanh thu thuần', '428500000'], ['Giá trị đơn trung bình', '2840000'], ['Tỉ lệ hoàn tất', '94.2%']]
          )} />
        )}
        {activeSection === 'suppliers' && (
          <SuppliersPage
            suppliers={data.suppliers}
            onAdd={() => { setEditingSupplier(null); setSupplierFormOpen(true); }}
            onEdit={(sup) => { setEditingSupplier(sup); setSupplierFormOpen(true); }}
            onDelete={deleteSupplier}
          />
        )}
        {activeSection === 'supply-orders' && (
          <SupplyOrdersPage
            supplyOrders={data.supplyOrders}
            onAdd={() => setPoFormOpen(true)}
            onUpdateStatus={updateSOStatus}
          />
        )}
        {activeSection === 'promotions' && (
          <PromotionsPage />
        )}
        {activeSection === 'settings' && (
          <SettingsPage settings={data.settings} onToggle={setSetting} />
        )}
      </ManagerLayout>

      {productForm && (
        <ProductForm product={productForm.id ? productForm : null} onSave={saveProduct} onClose={() => setProductForm(null)} />
      )}
      {selectedVariantProduct && (
        <VariantManager
          product={selectedVariantProduct}
          variants={selectedVariants}
          onAdd={() => setVariantForm({ productId: selectedVariantProduct.id })}
          onEdit={setVariantForm}
          onDelete={deleteVariant}
          onClose={() => setVariantProductId(null)}
        />
      )}
      {variantForm && (
        <VariantForm
          product={data.products.find((p) => p.id === variantForm.productId) || selectedVariantProduct}
          variant={variantForm.id ? variantForm : null}
          onSave={(variant) => saveVariant(variant, !variantForm.id)}
          onClose={() => setVariantForm(null)}
        />
      )}
      {staffFormOpen && <StaffForm onSave={addStaff} onClose={() => setStaffFormOpen(false)} />}
      {supplierFormOpen && <SupplierForm supplier={editingSupplier} onSave={saveSupplier} onClose={() => { setSupplierFormOpen(false); setEditingSupplier(null); }} />}
      {poFormOpen && <SupplyOrderForm suppliers={data.suppliers} products={data.products} onSave={saveSupplyOrder} onClose={() => setPoFormOpen(false)} />}
      {toast && (
        <div className="admin-toast" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>✓ {toast}</span>
          {undoData && (
            <button
              onClick={handleUndo}
              style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', color: '#fff', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Hoàn tác
            </button>
          )}
        </div>
      )}
    </>
  );
}
