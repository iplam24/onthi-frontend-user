import { defineStore } from 'pinia';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
  }),
  actions: {
    add(message: string, type: ToastType = 'info', duration = 4000) {
      const id = Date.now() + Math.random();
      this.toasts.push({ id, message, type, duration });

      setTimeout(() => {
        this.remove(id);
      }, duration);
    },
    success(message: string, duration = 4000) {
      this.add(message, 'success', duration);
    },
    error(message: string, duration = 4000) {
      this.add(message, 'error', duration);
    },
    warning(message: string, duration = 4000) {
      this.add(message, 'warning', duration);
    },
    info(message: string, duration = 4000) {
      this.add(message, 'info', duration);
    },
    remove(id: number) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
  },
});
