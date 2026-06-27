import { httpClient } from './httpClient';

export const authApi = {
  login: (email, password) =>
    httpClient.post('/auth/login', { email, password }),
};
