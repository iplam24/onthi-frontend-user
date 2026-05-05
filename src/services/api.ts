import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.isAuthenticated) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default api;
