import axios from 'axios';
import { maintenanceBus } from '../shared/maintenanceBus';

// In production the frontend (Vercel) and backend (Railway) are on different
// domains, so calls must target the backend's absolute URL. Set VITE_API_URL
// in Vercel's project env vars; locally it stays unset and falls back to the
// Vite dev server's '/api' proxy.
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Sends the session cookie cross-site so the backend's concurrent-login
  // limiting keeps working once frontend/backend are on separate origins.
  withCredentials: true,
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
