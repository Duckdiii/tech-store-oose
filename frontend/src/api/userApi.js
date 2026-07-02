import { httpClient } from './httpClient';

export const userApi = {
  getProfile: async () => {
    const response = await httpClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (payload) => {
    const response = await httpClient.put('/users/me', payload);
    return response.data;
  },

  changePassword: async (payload) => {
    const response = await httpClient.put('/users/me/password', payload);
    return response.data;
  },

  addAddress: async (payload) => {
    const response = await httpClient.post('/users/me/addresses', payload);
    return response.data;
  },

  updateAddress: async (addressId, payload) => {
    const response = await httpClient.put(`/users/me/addresses/${addressId}`, payload);
    return response.data;
  },

  removeAddress: async (addressId) => {
    const response = await httpClient.delete(`/users/me/addresses/${addressId}`);
    return response.data;
  },
};
