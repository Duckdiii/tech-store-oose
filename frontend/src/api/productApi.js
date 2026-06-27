import { httpClient } from './httpClient';

export const productApi = {
  searchProducts: async (params) => {
    // params can include: keyword, categoryId, brand, minPrice, maxPrice, page, size, sort
    const response = await httpClient.get('/products/search', { params });
    return response.data;
  },

  getProductDetail: async (id) => {
    const response = await httpClient.get(`/products/${id}`);
    return response.data;
  }
};
