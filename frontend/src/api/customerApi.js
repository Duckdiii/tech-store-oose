import { httpClient } from './httpClient';

export const customerApi = {
  getAll: () => httpClient.get('/manage/customers').then(r => r.data),
  block: (accountId) => httpClient.patch(`/manage/accounts/${accountId}/block`).then(r => r.data),
  unblock: (accountId) => httpClient.patch(`/manage/accounts/${accountId}/unblock`).then(r => r.data),
};
