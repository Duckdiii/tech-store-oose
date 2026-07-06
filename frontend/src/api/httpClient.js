import axios from 'axios';
import { maintenanceBus } from '../shared/maintenanceBus';

export const httpClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token to every request
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ts_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 (token expired/invalid), clear storage and redirect to login
httpClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginEndpoint = err.config?.url?.includes('/auth/login');
    if (err.response?.status === 401 && !isLoginEndpoint) {
      localStorage.removeItem('ts_token');
      localStorage.removeItem('ts_user');
      window.location.href = '/sign-in';
    }
    if (err.response?.status === 503 && err.response?.data?.maintenanceMode) {
      maintenanceBus.notifyMaintenance();
    }
    return Promise.reject(err);
  }
);
