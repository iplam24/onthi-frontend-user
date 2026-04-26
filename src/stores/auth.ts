import { defineStore } from 'pinia';

type AuthUser = {
  id: number;
  username: string;
  email: string;
  roles: string[];
};

type LoginData = {
  token: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null') as AuthUser | null,
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
      };
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});
