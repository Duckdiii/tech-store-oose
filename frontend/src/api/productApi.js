import { httpClient } from './httpClient';

const normalizeProductForManager = (product) => ({
  ...product,
  id: product.id,
  name: product.name || '',
  description: product.description || '',
  brand: product.brand || product.brandName || product.brandId || '',
  brandId: product.brandId || null,
  category: product.category || product.categoryName || product.categoryId || '',
  categoryId: product.categoryId || null,
  price: Number(product.price ?? product.lowestPrice ?? 0),
  stock: Number(product.stock ?? product.availableVariantCount ?? 0),
  variantCount: Number(product.variantCount ?? product.availableVariantCount ?? 0),
  images: product.images || (product.thumbnailUrl ? [{ name: 'Ảnh đại diện', imageUrl: product.thumbnailUrl }] : []),
});

export const productApi = {
  searchProducts: async (params) => {
    const response = await httpClient.get('/products/search', { params });
    return response.data;
  },

  getManagerCatalog: async () => {
    const response = await httpClient.get('/manage/products');
    return (response.data || []).map(normalizeProductForManager);
  },

  searchManagerCatalog: async (params) => {
    const response = await httpClient.get('/manage/products/search', { params });
    return { ...response.data, content: (response.data.content || []).map(normalizeProductForManager) };
  },

  getManagerCatalogStatusCounts: async (keyword) => {
    const response = await httpClient.get('/manage/products/status-counts', { params: { keyword } });
    return response.data;
  },

  getManagerProductDetail: async (id) => {
    const response = await httpClient.get(`/manage/products/${id}`);
    return normalizeProductForManager(response.data);
  },

  getCustomerProductDetail: async (id) => {
    const response = await httpClient.get(`/products/${id}`);
    return response.data;
  },

  createManagerProduct: async (payload) => {
    const response = await httpClient.post('/manage/products', payload);
    return normalizeProductForManager(response.data);
  },

  updateManagerProduct: async (id, payload) => {
    const response = await httpClient.put(`/manage/products/${id}`, payload);
    return normalizeProductForManager(response.data);
  },

  deleteManagerProduct: async (id) => {
    await httpClient.delete(`/manage/products/${id}`);
  }
};
