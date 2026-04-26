import api from './api';
import type { LoginCredentials, RegisterPayload } from '@/types/auth';

export const login = (credentials: LoginCredentials) => {
  return api.post('/auth/login', credentials);
};

export const register = (payload: RegisterPayload) => {
  return api.post('/auth/register', payload);
};

// Placeholder for Google Login
export const loginWithGoogle = () => {
  // This would typically redirect to the backend endpoint for Google OAuth
  // window.location.href = '/api/oauth2/authorization/google';
  console.log('Redirecting to Google login...');
};
