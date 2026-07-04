import { httpClient } from './httpClient';

const normalizeInventory = (data) => ({
  products: (data.products || []).map((product) => ({
    ...product,
    brand: product.brand || product.brandName || product.brandId || '',
    category: product.category || product.categoryName || product.categoryId || '',
  })),
  variants: (data.variants || data.productVariants || []).map((variant) => ({
    ...variant,
    productId: variant.productId,
    price: Number(variant.price || 0),
    status: String(variant.status || '').toUpperCase(),
  })),
});

export const getWarehouseInventory = async () => {
  const response = await httpClient.get('/manage/warehouse');
  return normalizeInventory(response.data);
};

export const searchWarehouseOverview = async (params) => {
  const response = await httpClient.get('/manage/warehouse/overview/search', {
    params: cleanParams(params),
  });
  return response.data;
};

export const validateImport = async (payload) =>
  (await httpClient.post('/manage/warehouse/import/validate', payload)).data;

export const confirmImport = async (payload) =>
  (await httpClient.post('/manage/warehouse/import/confirm', payload)).data;

export const validateExport = async (payload) =>
  (await httpClient.post('/manage/warehouse/export/validate', payload)).data;

export const confirmExport = async (payload) =>
  (await httpClient.post('/manage/warehouse/export/confirm', payload)).data;

export const getWarehouseLogs = async (filters) => {
  const response = await httpClient.get('/manage/warehouse/logs', {
    params: cleanParams(filters),
  });
  return response.data;
};

export const getWarehouseLogDetail = async (logType, logId) =>
  (await httpClient.get(`/manage/warehouse/logs/${logType}/${logId}`)).data;

export const downloadReceipt = async (receiptId) => {
  const response = await httpClient.get(`/warehouse/receipts/${receiptId}/download`, {
    responseType: 'blob',
  });
  return response.data;
};

export const downloadWarehouseLogs = async (filters, format) => {
  const response = await httpClient.get('/manage/warehouse/logs/export', {
    params: { ...cleanParams(filters), format },
    responseType: 'blob',
  });
  return response.data;
};

export const getApiError = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status === 401) return 'Vui lòng đăng nhập bằng tài khoản Staff hoặc Manager.';
  if (status === 403) return 'Tài khoản hiện tại không có quyền thực hiện chức năng này.';
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (data?.title) return data.title;
  if (error?.message === 'Network Error') return 'Không kết nối được backend. Kiểm tra BE đã chạy chưa.';
  if (error?.message) return error.message;
  return 'Đã xảy ra lỗi, vui lòng thử lại.';
};

export const saveDownload = (blob, filename = `warehouse-export-${Date.now()}`) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

function cleanParams(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
}
