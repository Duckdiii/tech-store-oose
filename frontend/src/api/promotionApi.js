import { httpClient } from './httpClient';

export const promotionApi = {
  listPromotions() {
    return httpClient.get('/promotions').then((res) => res.data);
  },

  getPromotion(id) {
    return httpClient.get(`/promotions/${id}`).then((res) => res.data);
  },

  getPromotionPerformance(id) {
    return httpClient.get(`/promotions/${id}/performance`).then((res) => res.data);
  },

  createPromotion(payload) {
    return httpClient.post('/promotions', payload).then((res) => res.data);
  },

  updatePromotion(id, payload) {
    return httpClient.put(`/promotions/${id}`, payload).then((res) => res.data);
  },

  removePromotion(id) {
    return httpClient.delete(`/promotions/${id}`).then((res) => res.data);
  },

  getFlashSale() {
    return httpClient.get('/promotions/flash-sale').then((res) => res.data);
  },
};
