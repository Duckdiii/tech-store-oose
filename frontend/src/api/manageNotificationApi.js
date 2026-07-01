import { httpClient } from './httpClient';

export const manageNotificationApi = {
  getNotifications: async (unreadOnly = false) => {
    const response = await httpClient.get('/manage/notifications', {
      params: { unreadOnly },
    });
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await httpClient.patch(`/manage/notifications/${id}/read`);
    return response.data;
  },
};
