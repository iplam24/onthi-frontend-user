<template>
  <div class="card-elevated p-8 border border-slate-100 h-full">
    <div class="flex items-center justify-between mb-8">
      <h3 class="m-0 text-xl font-extrabold text-slate-900 flex items-center gap-3">
        <i class="fa-solid fa-rss text-indigo-500"></i> {{ title || 'Bảng tin hoạt động' }}
      </h3>
      <button @click="loadFeed(0)" :disabled="loading" class="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
        <i class="fa-solid fa-rotate-right" :class="{'animate-spin': loading}"></i>
      </button>
    </div>

    <div v-if="loading && activities.length === 0" class="space-y-6">
      <div v-for="i in 3" :key="i" class="animate-pulse flex gap-4">
        <div class="h-10 w-10 rounded-full bg-slate-100"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 w-1/3 bg-slate-100 rounded"></div>
          <div class="h-3 w-full bg-slate-50 rounded"></div>
        </div>
      </div>
    </div>

    <div v-else-if="activities.length === 0" class="text-center py-10">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300 mb-4">
        <i class="fa-solid fa-users-slash text-2xl"></i>
      </div>
      <p class="text-sm font-medium text-slate-400">Chưa có hoạt động nào. Hãy theo dõi thêm bạn bè để xem bảng tin!</p>
    </div>

    <div v-else class="relative space-y-8">
      <!-- Vertical Line -->
      <div class="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

      <div v-for="activity in activities" :key="activity.id" class="relative flex gap-4 group">
        <!-- Avatar / Icon -->
        <div class="relative z-10 flex-shrink-0">
          <router-link :to="`/profile/${activity.user.id}`" class="block h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform hover:scale-110">
            <img v-if="activity.user.avatar" :src="resolveImageUrl(activity.user.avatar)" class="h-full w-full object-cover" />
            <div v-else class="h-full w-full bg-indigo-500 flex items-center justify-center text-white text-xs font-black uppercase">
              {{ activity.user.username[0] }}
            </div>
          </router-link>
          <div class="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
            <i :class="getActivityIcon(activity.type)" class="text-[8px]"></i>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <router-link :to="`/profile/${activity.user.id}`" class="text-sm font-black text-slate-900 hover:text-indigo-600 transition-colors truncate">
              {{ activity.user.username }}
            </router-link>
            <span class="text-[10px] font-bold text-slate-400 whitespace-nowrap">{{ formatTime(activity.createdAt) }}</span>
          </div>
          <p class="mt-1 text-sm text-slate-600 font-medium leading-relaxed">{{ activity.content }}</p>
        </div>
      </div>

      <button v-if="hasMore && !limit" @click="loadMore" :disabled="loading" class="w-full py-3 rounded-xl border border-dashed border-slate-200 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all">
        {{ loading ? 'Đang tải...' : 'Xem thêm hoạt động' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { socialService } from '@/services/socialService';

const props = defineProps<{
  title?: string;
  limit?: number | null;
}>();

const activities = ref<any[]>([]);
const loading = ref(false);
const currentPage = ref(0);
const hasMore = ref(true);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'EXAM_COMPLETED': return 'fa-solid fa-graduation-cap text-emerald-500';
    case 'POST_CREATED': return 'fa-solid fa-pen-to-square text-indigo-500';
    case 'ACHIEVEMENT_EARNED': return 'fa-solid fa-trophy text-amber-500';
    default: return 'fa-solid fa-star text-slate-400';
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
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày trước`;
  
  return date.toLocaleDateString('vi-VN');
};

const loadFeed = async (page: number) => {
  loading.value = true;
  try {
    const res = await socialService.getFeed(page, 10);
    const newActivities = res.data?.data?.content || [];
    if (page === 0) {
      activities.value = props.limit ? newActivities.slice(0, props.limit) : newActivities;
    } else {
      activities.value = [...activities.value, ...newActivities];
    }
    hasMore.value = !res.data?.data?.last;
    currentPage.value = page;
  } catch (err) {
    console.error('Failed to load feed:', err);
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  loadFeed(currentPage.value + 1);
};

onMounted(() => {
  loadFeed(0);
});
</script>
