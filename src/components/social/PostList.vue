<template>
  <div class="space-y-6">
    <div v-if="loading && posts.length === 0" class="space-y-6">
      <div v-for="i in 2" :key="i" class="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse">
        <div class="flex gap-4 mb-6">
          <div class="h-10 w-10 rounded-xl bg-slate-100"></div>
          <div class="space-y-2 flex-1 pt-1">
            <div class="h-3 w-1/4 bg-slate-100 rounded-lg"></div>
            <div class="h-2 w-1/6 bg-slate-50 rounded-lg"></div>
          </div>
        </div>
        <div class="space-y-3">
          <div class="h-4 w-full bg-slate-50 rounded-lg"></div>
          <div class="h-4 w-5/6 bg-slate-50 rounded-lg"></div>
        </div>
      </div>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div class="inline-flex h-20 w-20 rounded-3xl bg-slate-50 items-center justify-center text-slate-200 mb-6">
        <i class="fa-solid fa-user-group text-4xl"></i>
      </div>
      <h3 class="text-slate-900 font-black text-xl m-0 tracking-tight">Chưa có bài viết nào</h3>
      <p v-if="userId" class="text-slate-400 font-bold mt-2 text-xs uppercase tracking-widest px-6">
        Chỉ bạn bè (người theo dõi lại nhau) mới thấy được bài viết của nhau.
      </p>
      <p v-else class="text-slate-400 font-bold mt-2 text-xs uppercase tracking-widest px-6">
        Hãy kết bạn thêm để bảng tin thêm sôi động nhé!
      </p>
    </div>

    <div v-else>
      <PostItem 
        v-for="post in posts" 
        :key="post.id" 
        :post="post" 
        @deleted="handlePostDeleted" 
      />
      
      <button v-if="hasMore" @click="loadMore" :disabled="loading" class="w-full py-5 rounded-2xl border border-dashed border-slate-200 text-xs font-black text-slate-400 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md bg-slate-50/30">
        <i v-if="loading" class="fa-solid fa-circle-notch animate-spin mr-2"></i>
        {{ loading ? 'Đang tải bài viết...' : 'Khám phá thêm bài viết' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { socialService } from '@/services/socialService';
import PostItem from './PostItem.vue';

const props = defineProps<{
  userId?: number;
}>();

const posts = ref<any[]>([]);
const loading = ref(false);
const currentPage = ref(0);
const hasMore = ref(true);
let pollingInterval: any = null;

watch(() => props.userId, () => {
  loadPosts(0);
});

const loadPosts = async (page: number, silent = false) => {
  if (!silent) loading.value = true;
  try {
    const res = props.userId 
      ? await socialService.getUserPosts(props.userId, page, 10)
      : await socialService.getPosts(page, 10);
      
    const newPosts = res.data?.content || [];
    if (page === 0) {
      // For silent updates (polling), only update if there are new posts to avoid flashing
      if (silent && JSON.stringify(newPosts.map(p => p.id)) === JSON.stringify(posts.value.slice(0, 10).map(p => p.id))) {
        return;
      }
      posts.value = newPosts;
    } else {
      posts.value = [...posts.value, ...newPosts];
    }
    hasMore.value = !res.data?.last;
    currentPage.value = page;
  } catch (err) {
    console.error('Failed to load posts:', err);
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  loadPosts(currentPage.value + 1);
};

const handlePostDeleted = (id: number) => {
  posts.value = posts.value.filter(p => p.id !== id);
};

defineExpose({
  refresh: () => loadPosts(0)
});

onMounted(() => {
  loadPosts(0);
  // Poll for new posts every 30 seconds if on main feed and first page
  pollingInterval = setInterval(() => {
    if (currentPage.value === 0 && !loading.value) {
      loadPosts(0, true);
    }
  }, 30000);
});

onBeforeUnmount(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>
