import { httpClient } from './httpClient';

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.value)) return data.value;
  return [];
};

export const notificationApi = {
  subscribeProduct: async (productVariantId) => {
    const response = await httpClient.post(`/variants/${productVariantId}/notifications/subscription`);
    return response.data;
  },

  unsubscribeProduct: async (productVariantId) => {
    const response = await httpClient.delete(`/variants/${productVariantId}/notifications/subscription`);
    return response.data;
  },

  getSubscriptions: async () => {
    const response = await httpClient.get('/users/me/notification-subscriptions');
    return normalizeList(response.data);
  },

  getNotifications: async (params) => {
    const response = await httpClient.get('/users/me/notifications', { params });
    return normalizeList(response.data);
  },

  markRead: async (notificationId) => {
    const response = await httpClient.patch(`/users/me/notifications/${notificationId}/read`);
    return response.data;
  },
};
