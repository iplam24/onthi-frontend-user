<template>
  <div class="card-elevated overflow-hidden border border-slate-100 bg-white">
    <div class="bg-slate-50/50 px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex items-center justify-between">
      <div>
        <h2 class="m-0 text-xl font-black text-slate-900 tracking-tight">{{ title }}</h2>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ subtitle }}</p>
      </div>
      <div class="h-10 w-10 rounded-xl flex items-center justify-center" :class="iconBgClass">
        <i :class="[iconClass, 'text-lg']"></i>
      </div>
    </div>

    <div class="p-5 sm:p-8">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div v-else-if="list.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
          <i :class="[iconClass, 'text-4xl']"></i>
        </div>
        <p class="text-lg font-black text-slate-900 m-0">{{ emptyMessage }}</p>
        <p class="text-xs font-bold text-slate-400 mt-2">{{ emptySubtitle }}</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="item in list" :key="item.id" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-indigo-100 transition-all group">
          <router-link :to="`/profile/${item.id}`" class="flex items-center gap-4 flex-1">
            <div class="h-12 w-12 rounded-xl bg-indigo-500 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
              <img v-if="item.avatar" :src="resolveImageUrl(item.avatar)" class="h-full w-full object-cover" />
              <div v-else class="h-full w-full flex items-center justify-center text-white font-black text-xl">{{ item.username[0].toUpperCase() }}</div>
            </div>
            <div class="min-w-0">
              <p class="m-0 text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{{ item.fullName || item.username }}</p>
              <p class="m-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">@{{ item.username }}</p>
            </div>
          </router-link>
          
          <button v-if="canAction" @click="$emit('action', item)" class="h-9 w-9 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center shadow-sm" :title="actionTitle">
            <i :class="actionIconClass"></i>
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-8 pt-8 border-t border-slate-50 flex justify-center gap-2">
        <button 
          v-for="p in pagination.totalPages" 
          :key="p"
          @click="$emit('change-page', p-1)"
          class="h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black transition-all"
          :class="pagination.page === p-1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'"
        >
          {{ p }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle: string;
  iconClass: string;
  iconBgClass: string;
  list: any[];
  loading: boolean;
  pagination: any;
  emptyMessage: string;
  emptySubtitle: string;
  canAction: boolean;
  actionTitle: string;
  actionIconClass: string;
}>();

defineEmits(['action', 'change-page']);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};
</script>
