import { httpClient } from './httpClient';

export const authApi = {
  login: (email, password) =>
    httpClient.post('/auth/login', { email, password }),
  register: (name, email, phone, password) =>
    httpClient.post('/auth/register', { name, email, phone, password }),
};
