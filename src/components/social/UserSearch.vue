<template>
  <div class="relative" ref="searchContainer">
    <div class="relative">
      <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
      <input 
        v-model="query" 
        @input="handleSearch"
        type="text" 
        placeholder="Tìm kiếm bạn bè..." 
        class="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all"
      />
      <div v-if="loading" class="absolute right-4 top-1/2 -translate-y-1/2">
        <i class="fa-solid fa-circle-notch animate-spin text-indigo-500"></i>
      </div>
    </div>

    <!-- Results Dropdown -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="results.length > 0 && query" class="absolute left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div class="max-h-80 overflow-y-auto custom-scrollbar">
          <router-link 
            v-for="user in results" 
            :key="user.id" 
            :to="`/profile/${user.id}`"
            @click="query = ''; results = []"
            class="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
          >
            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
              <img v-if="user.avatar" :src="resolveImageUrl(user.avatar)" class="h-full w-full object-cover" />
              <span v-else class="text-xs font-black text-indigo-600 uppercase">{{ user.username[0] }}</span>
            </div>
            <div>
              <p class="m-0 text-sm font-bold text-slate-900">{{ user.fullName || user.username }}</p>
              <p class="m-0 text-[10px] text-slate-400 font-medium">@{{ user.username }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { searchUsers } from '@/services/userService';

const query = ref('');
const results = ref<any[]>([]);
const loading = ref(false);
const searchContainer = ref<HTMLElement | null>(null);

let timeout: any = null;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

const handleSearch = () => {
  if (timeout) clearTimeout(timeout);
  if (!query.value.trim()) {
    results.value = [];
    return;
  }

  timeout = setTimeout(async () => {
    loading.value = true;
    try {
      const res = await searchUsers(query.value);
      results.value = res.data?.data || [];
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  }, 300);
};

const handleClickOutside = (e: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(e.target as Node)) {
    results.value = [];
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>
