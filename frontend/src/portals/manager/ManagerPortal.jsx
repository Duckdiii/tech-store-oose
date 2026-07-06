import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ManagerLayout } from './layout/ManagerLayout';
import { useTheme } from '../../shared/context/ThemeContext';
import { StaffForm } from './components/index';
import { ProductForm } from './components/ProductForm';
import { ProductDetailModal } from './components/ProductDetailModal';
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
import { SupplierForm } from './components/SupplierForm';
import { SupplyOrdersPage } from './pages/SupplyOrdersPage';
import { SupplyOrderForm } from './components/SupplyOrderForm';
import { SupplyOrderDetailModal } from './components/SupplyOrderDetailModal';
import { supplierApi } from '../../api/supplierApi';
import { supplyOrderApi } from '../../api/supplyOrderApi';
import { getWarehouseInventory } from '../../api/warehouseApi';
import { productApi } from '../../api/productApi';
import { PromotionsPage } from './pages/PromotionsPage';
import { manageOrderApi } from '../../api/manageOrderApi';
import { customerApi } from '../../api/customerApi';
import { staffApi } from '../../api/staffApi';

const WAREHOUSE_SUB_LABEL = { import: 'Nhập kho', export: 'Xuất kho', logs: 'Nhật ký kho' };
const MANAGER_INITIAL_DATA = { ...INITIAL_DATA, products: [], variants: [], customers: [], staff: [] };

const MEMBERSHIP_TIER_LABEL = {
  STANDARD: 'Member',
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  DIAMOND: 'Diamond',
};

const apiMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Không thể kết nối API';

const mergeCatalogWithInventory = (catalogProducts = [], inventory = { products: [], variants: [] }) => {
  const inventoryById = new Map((inventory.products || []).map((product) => [product.id, product]));
  const catalogById = new Map(catalogProducts.map((product) => [product.id, product]));

  const mergedProducts = catalogProducts.map((product) => {
    const inventoryProduct = inventoryById.get(product.id) || {};
    return {
      ...inventoryProduct,
      ...product,
      brand: product.brand || inventoryProduct.brand || '',
      brandId: product.brandId || inventoryProduct.brandId || null,
      category: product.category || inventoryProduct.category || '',
      categoryId: product.categoryId || inventoryProduct.categoryId || null,
    };
  });

  for (const product of inventory.products || []) {
    if (!catalogById.has(product.id)) mergedProducts.push(product);
  }

  return {
    products: mergedProducts,
    variants: inventory.variants || [],
  };
};

const mapBackendStatusToFrontend = (status) => {
  const map = {
    'AWAITING_CONFIRMATION': 'Chờ xác nhận',
    'PROCESSING': 'Đang xử lý',
    'SHIPPING': 'Đang giao',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy',
    'REFUNDED': 'Đã hoàn tiền'
  };
  return map[status] || status;
};

const mapFrontendStatusToBackend = (status) => {
  const map = {
    'Chờ xác nhận': 'AWAITING_CONFIRMATION',
    'Đang xử lý': 'PROCESSING',
    'Đang giao': 'SHIPPING',
    'Hoàn thành': 'COMPLETED',
    'Đã hủy': 'CANCELLED',
    'Đã hoàn tiền': 'REFUNDED'
  };
  return map[status] || 'AWAITING_CONFIRMATION';
};

const formatDateString = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch {
    return isoString;
  }
};

export function ManagerPortal() {
  const { t } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const section = location.pathname.split('/')[2] || 'dashboard';
  const activeSection = PAGE_META[section] ? section : 'dashboard';
  const warehouseView = location.pathname.split('/')[3] || 'overview';

  const [data, setData] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('techstore_admin_state') || '{}');
      const { products, variants, supplyOrders, customers, staff, ...safeStored } = stored;
      return { ...MANAGER_INITIAL_DATA, ...safeStored };
    } catch {
      return MANAGER_INITIAL_DATA;
    }
  });
  const [query, setQuery] = useState('');
  const [productsRefreshToken, setProductsRefreshToken] = useState(0);
  const [suppliersRefreshToken, setSuppliersRefreshToken] = useState(0);
  const [supplyOrdersRefreshToken, setSupplyOrdersRefreshToken] = useState(0);
  const [customersRefreshToken, setCustomersRefreshToken] = useState(0);
  const [staffRefreshToken, setStaffRefreshToken] = useState(0);
  const [productForm, setProductForm] = useState(null);
  const [productDetailId, setProductDetailId] = useState(null);
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [supplierFormOpen, setSupplierFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplyOrderFormOpen, setSupplyOrderFormOpen] = useState(false);
  const [viewingSupplyOrder, setViewingSupplyOrder] = useState(null);
  // Mặc định true để lần render đầu tiên (trước khi các effect fetch chạy xong) đã
  // được coi là "đang tải", tránh Tổng quan lóe lên số liệu 0 giả trong một khung hình.
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [toast, setToast] = useState('');
  const toastTimerRef = useRef(null);

  const fetchOrdersFromApi = async () => {
    setOrdersLoading(true);
    try {
      const orders = await manageOrderApi.getAllOrders();
      const mappedOrders = (orders || []).map(o => ({
        id: o.orderId,
        customer: o.customerName,
        total: Number(o.totalAmount || 0),
        payment: o.paymentMethod || 'COD',
        status: mapBackendStatusToFrontend(o.orderStatus),
        date: formatDateString(o.orderDate),
      }));
      setData(prev => ({ ...prev, orders: mappedOrders }));
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (['dashboard', 'orders'].includes(activeSection)) {
      fetchOrdersFromApi();
    }
  }, [activeSection]);

  const fetchCustomersFromApi = async () => {
    setCustomersLoading(true);
    try {
      const customers = await customerApi.getAll();
      const mappedCustomers = (customers || []).map(c => ({
        id: c.customerId,
        accountId: c.accountId,
        name: c.name,
        email: c.email,
        phone: c.phone,
        orders: Number(c.totalOrders || 0),
        spent: Number(c.totalSpent || 0),
        tier: MEMBERSHIP_TIER_LABEL[c.tier] || c.tier,
        active: c.active,
      }));
      setData(prev => ({ ...prev, customers: mappedCustomers }));
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setCustomersLoading(false);
    }
  };

  useEffect(() => {
    if (['dashboard', 'customers'].includes(activeSection)) {
      fetchCustomersFromApi();
    }
  }, [activeSection]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const sups = await supplierApi.getAll();
        setData(prev => ({ ...prev, suppliers: sups }));
      } catch (err) {
        console.error("Failed to fetch from API", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Product/variant catalog is shared app-wide (Dashboard low-stock calc, product
    // detail modal from Products/Warehouse, and the Supply Order form's product
    // pickers) so it must load regardless of which manager section is active.
    const syncCatalogFromApi = async () => {
      setCatalogLoading(true);
      try {
        const [catalogResult, inventoryResult] = await Promise.allSettled([
          productApi.getManagerCatalog(),
          getWarehouseInventory(),
        ]);

        if (catalogResult.status === 'rejected' && inventoryResult.status === 'rejected') {
          console.error('Failed to sync product catalog API', catalogResult.reason);
          console.error('Failed to sync warehouse inventory API', inventoryResult.reason);
          setData((prev) => ({ ...prev, products: [], variants: [] }));
          return;
        }

        if (catalogResult.status === 'rejected') {
          console.error('Failed to sync product catalog API', catalogResult.reason);
        }
        if (inventoryResult.status === 'rejected') {
          console.error('Failed to sync warehouse inventory API', inventoryResult.reason);
        }

        const catalogProducts = catalogResult.status === 'fulfilled' ? catalogResult.value : [];
        const inventory = inventoryResult.status === 'fulfilled'
          ? inventoryResult.value
          : { products: [], variants: [] };
        const merged = mergeCatalogWithInventory(catalogProducts, inventory);

        setData((prev) => ({
          ...prev,
          products: merged.products,
          variants: merged.variants,
        }));
      } finally {
        setCatalogLoading(false);
      }
    };

    syncCatalogFromApi();
  }, [activeSection, warehouseView]);

  const showToast = (message, ttl = 2600) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = setTimeout(() => setToast(''), ttl);
  };

  const commit = (next, message) => {
    setData(next);
    localStorage.setItem('techstore_admin_state', JSON.stringify(next));
    showToast(message);
  };

  const [title] = PAGE_META[activeSection];

  // Tổng quan phụ thuộc vào 3 nguồn dữ liệu tải song song (đơn hàng, khách hàng, catalog sản
  // phẩm); chỉ coi là "đã tải xong" khi cả 3 đều hoàn tất, để tránh hiện số liệu 0 giả trong lúc chờ.
  const dashboardLoading = activeSection === 'dashboard' && (ordersLoading || customersLoading || catalogLoading);

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
    const stock = variants.length ? available.length : Number(product.stock || 0);
    const variantCount = variants.length || Number(product.variantCount || 0);
    const price = prices.length ? Math.min(...prices) : Number(product.price || 0);
    return {
      ...product,
      stock,
      variantCount,
      price,
      status: stock === 0 ? 'Tạm ẩn' : stock < 6 ? 'Sắp hết hàng' : 'Đang bán',
    };
  }), [data.products, data.variants]);

  const selectedDetailProduct = productRows.find((p) => p.id === productDetailId);
  const selectedDetailVariants = data.variants.filter((v) => v.productId === productDetailId);

  const openProductDetail = async (product) => {
    setProductDetailId(product.id);
    try {
      const detail = await productApi.getManagerProductDetail(product.id);
      setData((prev) => ({
        ...prev,
        products: prev.products.map((item) => item.id === product.id ? { ...item, ...detail } : item),
      }));
    } catch (err) {
      console.error('Failed to load product detail', err);
    }
  };

  const saveProduct = async (product) => {
    const exists = data.products.some((item) => item.id === product.id);
    const { id, stock, variantCount, price, status, ...payload } = product;

    try {
      const savedProduct = exists
        ? await productApi.updateManagerProduct(product.id, payload)
        : await productApi.createManagerProduct(payload);

      const currentProduct = data.products.find((item) => item.id === savedProduct.id) || {};
      const nextProduct = {
        ...currentProduct,
        ...savedProduct,
        stock: currentProduct.stock ?? savedProduct.stock ?? 0,
        variantCount: currentProduct.variantCount ?? savedProduct.variantCount ?? 0,
        status: currentProduct.status || savedProduct.status || 'Tạm ẩn',
      };

      commit(
        {
          ...data,
          products: exists
            ? data.products.map((item) => item.id === savedProduct.id ? nextProduct : item)
            : [nextProduct, ...data.products],
        },
        exists ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm mới'
      );
      setProductForm(null);
      setProductsRefreshToken((token) => token + 1);
    } catch (error) {
      setToast(apiMessage(error));
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await productApi.deleteManagerProduct(productId);
      // Xóa sản phẩm là thao tác không thể hoàn tác thật sự (đã xóa trên server),
      // nên dùng commit() thường thay vì commitWithUndo() để không hiện nút "Hoàn tác" gây hiểu nhầm.
      commit(
        { ...data, products: data.products.filter((p) => p.id !== productId), variants: data.variants.filter((v) => v.productId !== productId) },
        'Đã xóa sản phẩm'
      );
      if (productDetailId === productId) setProductDetailId(null);
      setProductsRefreshToken((token) => token + 1);
    } catch (error) {
      setToast(apiMessage(error));
    }
  };

  const changeOrderStatus = async (id, status) => {
    try {
      const backendStatus = mapFrontendStatusToBackend(status);
      await manageOrderApi.updateOrderStatus(id, backendStatus);
      showToast(`Đã cập nhật trạng thái đơn ${id} thành "${status}"`);
      fetchOrdersFromApi();
    } catch (error) {
      setToast(apiMessage(error));
      throw error;
    }
  };

  const toggleCustomer = async (customer) => {
    try {
      if (customer.active) {
        await customerApi.block(customer.accountId);
        showToast(`Đã khóa tài khoản của ${customer.name}`);
      } else {
        await customerApi.unblock(customer.accountId);
        showToast(`Đã mở khóa tài khoản của ${customer.name}`);
      }
      fetchCustomersFromApi();
      setCustomersRefreshToken((token) => token + 1);
    } catch (error) {
      setToast(apiMessage(error));
    }
  };

  const toggleStaff = async (member) => {
    try {
      if (member.active) {
        await staffApi.block(member.accountId);
        showToast(`Đã khóa tài khoản của ${member.name}`);
      } else {
        await staffApi.unblock(member.accountId);
        showToast(`Đã mở khóa tài khoản của ${member.name}`);
      }
      setStaffRefreshToken((token) => token + 1);
    } catch (error) {
      setToast(apiMessage(error));
    }
  };

  const setSetting = (key) => commit(
    { ...data, settings: { ...data.settings, [key]: !data.settings[key] } },
    'Đã lưu cài đặt'
  );

  const addStaff = async (member) => {
    try {
      await staffApi.add({
        fullName: member.name,
        email: member.email,
        phone: member.phone,
        staffCode: member.staffCode,
        hireDate: member.hireDate,
        initialPassword: member.initialPassword,
      });
      showToast('Đã thêm nhân viên mới');
      setStaffFormOpen(false);
      setStaffRefreshToken((token) => token + 1);
    } catch (error) {
      setToast(apiMessage(error));
      throw error;
    }
  };

  const deleteStaff = async (id) => {
    try {
      await staffApi.delete(id);
      showToast('Đã xóa nhân viên');
      setStaffRefreshToken((token) => token + 1);
    } catch (error) {
      setToast(apiMessage(error));
    }
  };

  const saveSupplier = async (supplierData) => {
    try {
      if (supplierData.id) {
        await supplierApi.update(supplierData.id, supplierData);
        setToast('Đã cập nhật nhà cung cấp');
      } else {
        await supplierApi.create(supplierData);
        setToast('Supplier added successfully');
      }
      const sups = await supplierApi.getAll();
      setData(prev => ({ ...prev, suppliers: sups }));
      setSupplierFormOpen(false);
      setEditingSupplier(null);
      setSuppliersRefreshToken((token) => token + 1);
    } catch (err) {
      setToast('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await supplierApi.delete(id);
      const sups = await supplierApi.getAll();
      setData(prev => ({ ...prev, suppliers: sups }));
      setToast(t('Supplier removed successfully'));
      setSuppliersRefreshToken((token) => token + 1);
    } catch (err) {
      setToast(t(apiMessage(err)));
    }
  };

  const createSupplyOrder = async (payload) => {
    try {
      await supplyOrderApi.create(payload);
      setToast(t('Purchase Order created successfully'));
      setSupplyOrderFormOpen(false);
      setSupplyOrdersRefreshToken((token) => token + 1);
    } catch (err) {
      setToast(t(apiMessage(err)));
    }
  };

  const updateSupplyOrderStatus = async (id, status) => {
    const updated = await supplyOrderApi.updateStatus(id, status);
    setToast(t('Supply Order status updated successfully'));
    setViewingSupplyOrder(updated);
    setSupplyOrdersRefreshToken((token) => token + 1);
    return updated;
  };

  return (
    <>
      <ManagerLayout activeSection={activeSection} title={title} query={query} onQueryChange={setQuery} breadcrumbs={breadcrumbs} badges={badges}>
        {activeSection === 'dashboard' && (
          <DashboardPage data={data} loading={dashboardLoading} />
        )}
        {activeSection === 'products' && (
          <ProductsPage
            searchQuery={query}
            refreshToken={productsRefreshToken}
            onAdd={() => setProductForm({})}
            onEdit={(product) => setProductForm(product)}
            onViewDetails={openProductDetail}
            onDelete={deleteProduct}
          />
        )}
        {activeSection === 'orders' && (
          <OrdersPage
            onStatus={changeOrderStatus}
            onExport={() => downloadCsv(
              'don-hang-techstore.csv',
              ['Mã đơn', 'Khách hàng', 'Ngày tạo', 'Thanh toán', 'Tổng tiền', 'Trạng thái'],
              data.orders.map((o) => [o.id, o.customer, o.date, o.payment, o.total, o.status])
            )}
          />
        )}
        {activeSection === 'warehouse' && (
          <WarehousePage view={warehouseView} navigate={navigate} suppliers={data.suppliers} onOpenProduct={openProductDetail} />
        )}
        {activeSection === 'customers' && (
          <CustomersPage refreshToken={customersRefreshToken} onToggle={toggleCustomer} />
        )}
        {activeSection === 'staff' && (
          <StaffPage refreshToken={staffRefreshToken} onToggle={toggleStaff} onAdd={() => setStaffFormOpen(true)} onDelete={deleteStaff} />
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
            refreshToken={suppliersRefreshToken}
            onAdd={() => { setEditingSupplier(null); setSupplierFormOpen(true); }}
            onEdit={(sup) => { setEditingSupplier(sup); setSupplierFormOpen(true); }}
            onDelete={deleteSupplier}
          />
        )}
        {activeSection === 'supply-orders' && (
          <SupplyOrdersPage
            refreshToken={supplyOrdersRefreshToken}
            onAdd={() => setSupplyOrderFormOpen(true)}
            onView={(order) => setViewingSupplyOrder(order)}
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
      {selectedDetailProduct && (
        <ProductDetailModal
          product={selectedDetailProduct}
          variants={selectedDetailVariants}
          onClose={() => setProductDetailId(null)}
          onEdit={() => { setProductDetailId(null); setProductForm(selectedDetailProduct); }}
          onDelete={() => deleteProduct(selectedDetailProduct.id)}
        />
      )}
      {staffFormOpen && <StaffForm onSave={addStaff} onClose={() => setStaffFormOpen(false)} />}
      {supplierFormOpen && <SupplierForm supplier={editingSupplier} onSave={saveSupplier} onClose={() => { setSupplierFormOpen(false); setEditingSupplier(null); }} />}
      {supplyOrderFormOpen && (
        <SupplyOrderForm
          suppliers={data.suppliers}
          products={data.products}
          variants={data.variants}
          onSave={createSupplyOrder}
          onClose={() => setSupplyOrderFormOpen(false)}
        />
      )}
      {viewingSupplyOrder && (
        <SupplyOrderDetailModal
          supplyOrder={viewingSupplyOrder}
          onUpdateStatus={updateSupplyOrderStatus}
          onClose={() => setViewingSupplyOrder(null)}
        />
      )}
      {toast && (
        <div className="admin-toast" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>✓ {toast}</span>
        </div>
      )}
    </>
  );
}
