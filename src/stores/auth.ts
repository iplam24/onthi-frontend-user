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
};

type LoginData = {
  token: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  balance?: number;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: Cookies.get('token') || null,
    user: JSON.parse(Cookies.get('user') || 'null') as AuthUser | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
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
      };
      // Save to cookies with 7 days expiration
      Cookies.set('token', data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(this.user), { expires: 7 });
    },
    logout() {
      this.token = null;
      this.user = null;
      Cookies.remove('token');
      Cookies.remove('user');
    },
    setUser(user: Partial<AuthUser>) {
      if (this.user) {
        this.user = { ...this.user, ...user };
        Cookies.set('user', JSON.stringify(this.user), { expires: 7 });
      }
    },
  },
});
