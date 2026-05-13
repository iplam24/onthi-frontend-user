import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

type AuthUser = {
  id: number;
  username: string;
  email: string;
  roles: string[];
  balance?: number;
  fireLevel?: number;
  activeToday?: boolean;
  currentStreak?: number;
  avatar?: string | null;
  fullName?: string | null;
  planName?: string;
};

type LoginData = {
  token: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  balance?: number;
  planName?: string;
};

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,
  sameSite: 'Lax',
  secure: window.location.protocol === 'https:',
};

/**
 * Safely parse user data from localStorage.
 * Returns null on any failure to prevent corrupted state.
 */
const loadUserFromStorage = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem('v_edu_user');
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem('v_edu_user');
    return null;
  }
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: Cookies.get('token') || null,
    user: loadUserFromStorage(),
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.roles?.includes('ROLE_ADMIN'),
  },
  actions: {
    login(data: LoginData) {
      this.token = data.token;
      this.user = {
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles,
        balance: data.balance ?? 0,
        planName: data.planName || 'FREE'
      };
      // Token in cookie (Secure + SameSite), user info in localStorage only
      Cookies.set('token', data.token, COOKIE_OPTIONS);
      localStorage.setItem('v_edu_user', JSON.stringify(this.user));
    },
    logout() {
      this.token = null;
      this.user = null;
      Cookies.remove('token');
      localStorage.removeItem('v_edu_user');
      // Clean up legacy cookie if present
      Cookies.remove('user');
    },
    setUser(user: Partial<AuthUser>) {
      if (this.user) {
        this.user = { ...this.user, ...user };
        localStorage.setItem('v_edu_user', JSON.stringify(this.user));
      }
    },
  },
});
