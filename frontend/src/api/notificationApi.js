import { httpClient } from './httpClient';

export const notificationApi = {
  subscribeProduct: async (productId) => {
    const response = await httpClient.post(`/products/${productId}/notifications/subscription`);
    return response.data;
  },

  unsubscribeProduct: async (productId) => {
    const response = await httpClient.delete(`/products/${productId}/notifications/subscription`);
    return response.data;
  },

  getSubscriptions: async () => {
    const response = await httpClient.get('/users/me/notification-subscriptions');
    return response.data;
  },

  getNotifications: async (params) => {
    const response = await httpClient.get('/users/me/notifications', { params });
    return response.data;
  },

  markRead: async (notificationId) => {
    const response = await httpClient.patch(`/users/me/notifications/${notificationId}/read`);
    return response.data;
  },
};
