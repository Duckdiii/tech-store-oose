import { httpClient } from './httpClient';

export const staffApi = {
  getAll: () => httpClient.get('/manage/staff', { params: { size: 100 } }).then(r => r.data.content || []),
  add: (data) => httpClient.post('/manage/staff', data).then(r => r.data),
  delete: (staffId) => httpClient.delete(`/manage/staff/${staffId}`).then(r => r.data),
  block: (accountId) => httpClient.patch(`/manage/accounts/${accountId}/block`).then(r => r.data),
  unblock: (accountId) => httpClient.patch(`/manage/accounts/${accountId}/unblock`).then(r => r.data),
};
