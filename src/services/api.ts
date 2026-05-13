import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach Bearer token
api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.isAuthenticated) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// Response interceptor — handle 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const auth = useAuthStore();
      // Only auto-logout if we thought we were authenticated
      if (auth.isAuthenticated) {
        auth.logout();
        // Redirect to home — the UI will show the login prompt
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
