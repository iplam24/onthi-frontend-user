<template>
  <div class="relative" ref="container">
    <button
      @click="toggleDropdown"
      class="relative h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300"
      :class="plan === 'promax' ? 'bg-white/80 border border-indigo-200 text-indigo-600 shadow-sm hover:scale-110' : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'"
    >
      <i class="fa-solid fa-bell text-sm"></i>
      <span v-if="unreadCount > 0" 
            class="absolute -top-1 -right-1 h-4 min-w-[1rem] px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 scale-95 -translate-y-2"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-3 w-80 sm:w-96 overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50"
      >
        <div class="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 class="m-0 text-sm font-black text-slate-900">Thông báo</h3>
          <button v-if="unreadCount > 0" @click="markAllAsRead" class="text-[10px] font-bold text-indigo-600 hover:underline">
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
          <div v-if="loading && notifications.length === 0" class="p-10 text-center">
            <i class="fa-solid fa-circle-notch animate-spin text-slate-200 text-2xl"></i>
          </div>
          
          <div v-else-if="notifications.length === 0" class="p-10 text-center">
            <i class="fa-solid fa-bell-slash text-slate-200 text-3xl mb-3"></i>
            <p class="m-0 text-xs font-bold text-slate-400">Không có thông báo nào</p>
          </div>

          <div v-else class="divide-y divide-slate-50">
            <div
              v-for="n in notifications"
              :key="n.id"
              @click="handleNotificationClick(n)"
              class="px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors relative group"
              :class="{ 'bg-indigo-50/30': !n.read }"
            >
              <div v-if="!n.read" class="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
              <div class="flex gap-3">
                <div :class="['h-9 w-9 rounded-xl shrink-0 flex items-center justify-center text-xs', getTypeIcon(n.type).bg]">
                  <i :class="['fa-solid', getTypeIcon(n.type).icon, getTypeIcon(n.type).color]"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="m-0 text-[13px] font-black text-slate-900 truncate">{{ n.title }}</p>
                  <p class="m-0 text-[12px] font-medium text-slate-500 line-clamp-2 mt-0.5">{{ n.message }}</p>
                  <p class="m-0 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{{ formatTime(n.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="notifications.length > 0" class="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <router-link to="/notifications" @click="isOpen = false" class="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
            Xem tất cả thông báo
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import apiClient from '@/services/api';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const plan = computed(() => (auth.user?.planName || 'free').toLowerCase());

const isOpen = ref(false);
const notifications = ref<any[]>([]);
const unreadCount = ref(0);
const loading = ref(false);
const container = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    fetchNotifications();
  }
};

const fetchNotifications = async () => {
  loading.value = true;
  try {
    const res = await apiClient.get('/social/notifications?size=10');
    notifications.value = res.data.data.content;
    fetchUnreadCount();
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
  } finally {
    loading.value = false;
  }
};

const fetchUnreadCount = async () => {
  try {
    const res = await apiClient.get('/social/notifications/unread-count');
    unreadCount.value = res.data.data;
  } catch (err) {
    console.error('Failed to fetch unread count:', err);
  }
};

const markAsRead = async (id: number) => {
  try {
    await apiClient.post(`/social/notifications/${id}/read`);
    const n = notifications.value.find(item => item.id === id);
    if (n && !n.read) {
      n.read = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  } catch (err) {
    console.error('Failed to mark as read:', err);
  }
};

const markAllAsRead = async () => {
  try {
    await apiClient.post('/social/notifications/read-all');
    notifications.value.forEach(n => n.read = true);
    unreadCount.value = 0;
  } catch (err) {
    console.error('Failed to mark all as read:', err);
  }
};

const handleNotificationClick = (n: any) => {
  if (!n.read) markAsRead(n.id);
  isOpen.value = false;
  if (n.targetUrl) {
    router.push(n.targetUrl);
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'FOLLOW': return { icon: 'fa-user-plus', color: 'text-indigo-600', bg: 'bg-indigo-50' };
    case 'POST_COMMENT': return { icon: 'fa-comment', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    case 'COMMENT_REPLY': return { icon: 'fa-reply', color: 'text-blue-600', bg: 'bg-blue-50' };
    case 'GIFT': return { icon: 'fa-gift', color: 'text-rose-600', bg: 'bg-rose-50' };
    default: return { icon: 'fa-bell', color: 'text-slate-400', bg: 'bg-slate-100' };
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'vừa xong';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  return date.toLocaleDateString('vi-VN');
};

const handleClickOutside = (event: MouseEvent) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

let pollingInterval: any = null;

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
  if (auth.isAuthenticated) {
    fetchUnreadCount();
    // Poll for new notifications every minute
    pollingInterval = setInterval(fetchUnreadCount, 60000);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
