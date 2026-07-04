import { httpClient } from './httpClient';

const BASE = '/manage/suppliers';

export const supplierApi = {
  getAll: () => httpClient.get(BASE).then(r => r.data),
  search: (params) => httpClient.get(`${BASE}/search`, { params }).then(r => r.data),
  create: (data) => httpClient.post(BASE, data).then(r => r.data),
  update: (id, data) => httpClient.put(`${BASE}/${id}`, data).then(r => r.data),
  delete: (id) => httpClient.delete(`${BASE}/${id}`).then(r => r.data),
};
