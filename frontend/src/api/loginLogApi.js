import { httpClient } from './httpClient';

export const loginLogApi = {
  search: (params) => httpClient.get('/manage/login-logs', { params: { size: 100, ...params } }).then(r => r.data.content || []),
  exportCsv: (params) => httpClient.get('/manage/login-logs/export', { params, responseType: 'blob' }).then(r => r.data),
};
