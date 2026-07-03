import { httpClient } from './httpClient';

export const categoryApi = {
  getCategories: () => httpClient.get('/categories').then(r => r.data || []),
};
