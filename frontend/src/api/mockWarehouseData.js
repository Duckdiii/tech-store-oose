// Mock Warehouse Data for Development

// Helper to generate random ID
const generateId = (prefix) => `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// MOCK DATA STORE
const mockStore = {
  products: [
    { id: 'PROD001', name: 'iPhone 15 Pro', brandId: 'BRAND001', categoryId: 'CAT001', description: 'Latest iPhone model' },
    { id: 'PROD002', name: 'Samsung S24', brandId: 'BRAND002', categoryId: 'CAT001', description: 'Flagship Samsung phone' },
    { id: 'PROD003', name: 'MacBook Pro 16', brandId: 'BRAND001', categoryId: 'CAT002', description: 'Professional laptop' },
  ],
  brands: [
    { id: 'BRAND001', name: 'Apple', logoUrl: '', description: 'Apple Inc.' },
    { id: 'BRAND002', name: 'Samsung', logoUrl: '', description: 'Samsung Electronics' },
  ],
  categories: [
    { id: 'CAT001', name: 'Smartphones', imageUrl: '' },
    { id: 'CAT002', name: 'Laptops', imageUrl: '' },
  ],
  productVariants: [
    { id: 'SN-IP15-001', productId: 'PROD001', ramGb: 8, storageGb: 256, color: 'Titanium Blue', price: 999, status: 'AVAILABLE' },
    { id: 'SN-IP15-002', productId: 'PROD001', ramGb: 8, storageGb: 256, color: 'Titanium Blue', price: 999, status: 'AVAILABLE' },
    { id: 'SN-IP15-003', productId: 'PROD001', ramGb: 12, storageGb: 512, color: 'Space Black', price: 1099, status: 'EXPORTED' },
    { id: 'SN-SAM-S24-001', productId: 'PROD002', ramGb: 12, storageGb: 256, color: 'Phantom Gray', price: 899, status: 'AVAILABLE' },
  ],
  importLogs: [
    {
      id: 'IMP001',
      performedBy: 'staff@techstore.com',
      importedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SUCCESS',
      note: 'Nhập hàng từ Apple Singapore',
      items: [
        { productVariantId: 'SN-IP15-001', productName: 'iPhone 15 Pro', quantity: 1, importPrice: 800 },
        { productVariantId: 'SN-IP15-002', productName: 'iPhone 15 Pro', quantity: 1, importPrice: 800 },
      ],
    },
    {
      id: 'IMP002',
      performedBy: 'manager@techstore.com',
      importedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SUCCESS',
      note: 'Nhập hàng từ Samsung VN',
      items: [
        { productVariantId: 'SN-SAM-S24-001', productName: 'Samsung S24', quantity: 1, importPrice: 700 },
      ],
    },
  ],
  exportLogs: [
    {
      id: 'EXP001',
      performedBy: 'staff@techstore.com',
      exportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SUCCESS',
      reason: 'Xuất theo đơn hàng ORD-2026-001',
      items: [
        { productVariantId: 'SN-IP15-003', productName: 'iPhone 15 Pro', quantity: 1, importPrice: null },
      ],
    },
  ],
};

// VALIDATE IMPORT
export const validateImport = async (payload) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validate payload
  if (!payload.productId && !payload.newProduct) {
    throw new Error('Phải chọn sản phẩm hoặc tạo sản phẩm mới');
  }

  if (payload.productId && payload.newProduct) {
    throw new Error('Không được chọn cả sản phẩm cũ và mới');
  }

  if (!payload.items || payload.items.length === 0) {
    throw new Error('Phải nhập ít nhất một serial');
  }

  // Check serial duplicates
  const serials = payload.items.map((i) => i.serialId.toLowerCase());
  if (new Set(serials).size !== serials.length) {
    throw new Error('Có serial ID bị trùng lặp');
  }

  // Check existing serials in DB
  for (const serial of serials) {
    if (mockStore.productVariants.some((v) => v.id.toLowerCase() === serial)) {
      throw new Error(`Serial ID đã tồn tại: ${serial}`);
    }
  }

  return {
    productName: payload.newProduct ? payload.newProduct.name : `Product ${payload.productId}`,
    newProduct: !!payload.newProduct,
    importQuantity: payload.items.length,
    serialIds: payload.items.map((i) => i.serialId),
    message: 'Thông tin nhập kho hợp lệ. Vui lòng confirm.',
  };
};

// CONFIRM IMPORT
export const confirmImport = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const importLogId = generateId('IMP');

  // Add new variants
  payload.items.forEach((item) => {
    mockStore.productVariants.push({
      id: item.serialId,
      productId: payload.productId || 'PROD_NEW',
      ramGb: item.ramGb,
      storageGb: item.storageGb,
      color: item.color,
      price: item.price,
      status: 'AVAILABLE',
    });
  });

  // Create import log
  const importLog = {
    id: importLogId,
    performedBy: 'staff@techstore.com',
    importedAt: new Date().toISOString(),
    status: 'SUCCESS',
    note: payload.note,
    items: payload.items.map((item) => ({
      productVariantId: item.serialId,
      productName: payload.newProduct ? payload.newProduct.name : 'Product',
      quantity: 1,
      importPrice: item.importPrice,
    })),
  };

  mockStore.importLogs.push(importLog);

  return {
    importLogId,
    status: 'SUCCESS',
    importedQuantity: payload.items.length,
    serialIds: payload.items.map((i) => i.serialId),
    message: 'Nhập kho thành công',
  };
};

// VALIDATE EXPORT
export const validateExport = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!payload.serialIds || payload.serialIds.length === 0) {
    throw new Error('Phải nhập ít nhất một serial ID');
  }

  // Check duplicates
  const serials = payload.serialIds.map((s) => s.toLowerCase());
  if (new Set(serials).size !== serials.length) {
    throw new Error('Có serial ID bị trùng lặp');
  }

  // Check if all serials exist and are available
  for (const serial of serials) {
    const variant = mockStore.productVariants.find((v) => v.id.toLowerCase() === serial);
    if (!variant) {
      throw new Error(`Serial ID không tìm thấy: ${serial}`);
    }
    if (variant.status !== 'AVAILABLE') {
      throw new Error(`Serial ID không khả dụng: ${serial}`);
    }
  }

  return {
    exportQuantity: payload.serialIds.length,
    serialIds: payload.serialIds,
    message: 'Kiểm tra tồn kho thành công',
  };
};

// CONFIRM EXPORT
export const confirmExport = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const exportLogId = generateId('EXP');

  // Mark variants as exported
  const affectedProducts = new Map();
  payload.serialIds.forEach((serial) => {
    const variant = mockStore.productVariants.find((v) => v.id.toLowerCase() === serial);
    if (variant) {
      variant.status = 'EXPORTED';
      affectedProducts.set(variant.productId, {
        productId: variant.productId,
        productName: `Product ${variant.productId}`,
      });
    }
  });

  // Create export log
  const exportLog = {
    id: exportLogId,
    performedBy: 'staff@techstore.com',
    exportedAt: new Date().toISOString(),
    status: 'SUCCESS',
    reason: payload.reason,
    items: payload.serialIds.map((serial) => {
      const variant = mockStore.productVariants.find((v) => v.id.toLowerCase() === serial);
      return {
        productVariantId: serial,
        productName: variant ? `Product` : 'Unknown',
        quantity: 1,
        importPrice: null,
      };
    }),
  };

  mockStore.exportLogs.push(exportLog);

  return {
    exportLogId,
    status: 'SUCCESS',
    serialIds: payload.serialIds,
    receipt: {
      id: generateId('REC'),
      message: 'Hóa đơn được tạo thành công',
    },
    inventoryStatuses: Array.from(affectedProducts.values()).map((product) => ({
      productId: product.productId,
      productName: product.productName,
      availableQuantity: mockStore.productVariants.filter((v) => v.productId === product.productId && v.status === 'AVAILABLE').length,
      status: 'UPDATED',
    })),
    warnings: [],
    message: 'Xuất kho thành công',
  };
};

// GET WAREHOUSE LOGS
export const getWarehouseLogs = async (filters) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let logs = [];

  // Combine import and export logs
  mockStore.importLogs.forEach((log) => {
    logs.push({
      logId: log.id,
      logType: 'IMPORT',
      occurredAt: log.importedAt,
      performedBy: log.performedBy,
      status: log.status,
      totalQuantity: log.items.reduce((sum, item) => sum + item.quantity, 0),
      productNames: log.items.map((item) => item.productName).join(', '),
    });
  });

  mockStore.exportLogs.forEach((log) => {
    logs.push({
      logId: log.id,
      logType: 'EXPORT',
      occurredAt: log.exportedAt,
      performedBy: log.performedBy,
      status: log.status,
      totalQuantity: log.items.reduce((sum, item) => sum + item.quantity, 0),
      productNames: log.items.map((item) => item.productName).join(', '),
    });
  });

  // Apply filters
  if (filters.logType && filters.logType !== '') {
    logs = logs.filter((log) => log.logType === filters.logType);
  }

  if (filters.status && filters.status !== '') {
    logs = logs.filter((log) => log.status === filters.status);
  }

  if (filters.performedBy && filters.performedBy.trim() !== '') {
    logs = logs.filter((log) => log.performedBy.toLowerCase().includes(filters.performedBy.toLowerCase()));
  }

  if (filters.from) {
    const fromDate = new Date(filters.from);
    logs = logs.filter((log) => new Date(log.occurredAt) >= fromDate);
  }

  if (filters.to) {
    const toDate = new Date(filters.to);
    logs = logs.filter((log) => new Date(log.occurredAt) <= toDate);
  }

  // Sort by date descending
  logs.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));

  return {
    logs,
    totalCount: logs.length,
  };
};

// GET WAREHOUSE LOG DETAIL
export const getWarehouseLogDetail = async (logType, logId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  let log;
  if (logType === 'IMPORT') {
    log = mockStore.importLogs.find((l) => l.id === logId);
  } else {
    log = mockStore.exportLogs.find((l) => l.id === logId);
  }

  if (!log) {
    throw new Error('Log không tìm thấy');
  }

  return {
    logId: log.id,
    logType,
    occurredAt: logType === 'IMPORT' ? log.importedAt : log.exportedAt,
    performedBy: log.performedBy,
    status: log.status,
    note: logType === 'IMPORT' ? log.note : null,
    reason: logType === 'EXPORT' ? log.reason : null,
    items: log.items.map((item) => ({
      productVariantId: item.productVariantId,
      productName: item.productName,
      quantity: item.quantity,
      importPrice: item.importPrice,
    })),
  };
};

// DOWNLOAD RECEIPT
export const downloadReceipt = async (receiptId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return new Blob([`Mock receipt: ${receiptId}`], { type: 'text/plain' });
};

// DOWNLOAD WAREHOUSE LOGS
export const downloadWarehouseLogs = async (filters, format) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const response = await getWarehouseLogs(filters);
  const logs = response.logs;

  let content;
  if (format === 'CSV') {
    content = 'Log ID,Type,Occurred At,Performed By,Status,Quantity,Product Names\n';
    logs.forEach((log) => {
      content += `${log.logId},${log.logType},${log.occurredAt},${log.performedBy},${log.status},${log.totalQuantity},"${log.productNames}"\n`;
    });
  } else {
    // Excel format as JSON (frontend will handle conversion if needed)
    content = JSON.stringify(logs, null, 2);
  }

  return new Blob([content], { type: format === 'CSV' ? 'text/csv' : 'application/json' });
};

// HELPER: Get API Error
export const getApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Đã xảy ra lỗi, vui lòng thử lại';
};

// HELPER: Save Download
export const saveDownload = (blob) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `warehouse-export-${Date.now()}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
