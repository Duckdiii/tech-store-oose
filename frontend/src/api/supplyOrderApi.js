import { httpClient } from './httpClient';

const BASE = '/admin/supply-orders';

export const supplyOrderApi = {
  getAll: () => httpClient.get(BASE).then(r => r.data),
  create: (data) => httpClient.post(BASE, data).then(r => r.data),
  updateStatus: (id, status) =>
    httpClient.patch(`${BASE}/${id}/status`, null, { params: { status } }).then(r => r.data),
};
