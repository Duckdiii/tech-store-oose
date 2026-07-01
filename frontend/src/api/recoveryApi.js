import { httpClient } from './httpClient';

export const recoveryApi = {
  getRecoveryPoints: async () => {
    const response = await httpClient.get('/manage/recovery-points');
    return response.data;
  },

  createRecoveryPoint: async (payload) => {
    const response = await httpClient.post('/manage/recovery-points', payload);
    return response.data;
  },

  restoreRecoveryPoint: async (id, payload) => {
    const response = await httpClient.post(`/manage/recovery-points/${id}/restore`, payload);
    return response.data;
  },

  getAuditLogs: async () => {
    const response = await httpClient.get('/manage/recovery-audit-logs');
    return response.data;
  },
};
