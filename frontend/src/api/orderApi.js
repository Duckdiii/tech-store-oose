import { httpClient } from './httpClient';

export const orderApi = {
  getOrderHistory: async (customerId, params) => {
    // Using GET /api/orders with customerId as query param
    const response = await httpClient.get('/orders', { 
      params: { customerId, ...params } 
    });
    return response.data;
  },
  
  getOrderDetail: async (orderId, customerId) => {
    const response = await httpClient.get(`/orders/${orderId}`, {
      params: { customerId }
    });
    return response.data;
  }
};
