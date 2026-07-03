import { httpClient } from './httpClient';

const BASE = '/manage/supply-orders';

export const supplyOrderApi = {
  getAll: () => httpClient.get(BASE).then(r => r.data || []),
  create: (payload) => httpClient.post(BASE, payload).then(r => r.data),
  updateStatus: (id, status) => httpClient.patch(`${BASE}/${id}/status?status=${status}`).then(r => r.data),
  updateNotes: (id, notes) => httpClient.patch(`${BASE}/${id}/notes`, { notes }).then(r => r.data),
};
