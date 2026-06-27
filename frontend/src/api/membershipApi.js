import { httpClient } from './httpClient';

export const membershipApi = {
  getMyTier: async () => {
    const response = await httpClient.get('/membership/my-tier');
    return response.data;
  }
};
