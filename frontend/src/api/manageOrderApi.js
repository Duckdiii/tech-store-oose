import { httpClient } from './httpClient';

const cleanParams = (params = {}) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
};

export const manageOrderApi = {
  getAllOrders: async (filters = {}) => {
    const response = await httpClient.get('/manage/orders', {
      params: cleanParams(filters),
    });
    return response.data;
  },

  searchOrders: async (params = {}) => {
    const response = await httpClient.get('/manage/orders/search', {
      params: cleanParams(params),
    });
    return response.data;
  },

  getOrderDetail: async (orderId) => {
    const response = await httpClient.get(`/manage/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await httpClient.patch(`/manage/orders/${orderId}/status`, null, {
      params: { status },
    });
    return response.data;
  },
};
