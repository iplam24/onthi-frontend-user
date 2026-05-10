<template>
  <section class="mx-auto w-full max-w-6xl space-y-10 px-4 sm:px-6 pb-20 pt-6">
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 sm:p-14 shadow-2xl">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px]"></div>
      <div class="relative z-10 space-y-4 text-center">
        <h1 class="m-0 text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
          Cộng đồng <span class="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">V-Edu Social</span>
        </h1>
        <p class="mx-auto max-w-2xl text-base font-medium text-slate-400 sm:text-lg">
          Kết nối với những học viên ưu tú, chia sẻ kinh nghiệm và cùng nhau bứt phá trong học tập.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Feed -->
      <div class="lg:col-span-2">
        <!-- Search friends for mobile -->
        <div class="mb-6 lg:hidden">
          <UserSearch />
        </div>

        <PostCreator @success="refreshPostList" />
        
        <div class="space-y-12">
          <div>
            <h3 class="m-0 text-base font-black text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-widest">
              <div class="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                <i class="fa-solid fa-earth-americas text-xs"></i>
              </div>
              Bảng tin cộng đồng
            </h3>
            <PostList ref="postListRef" />
          </div>

          <div>
            <h3 class="m-0 text-base font-black text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-widest">
              <div class="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                <i class="fa-solid fa-graduation-cap text-xs"></i>
              </div>
              Hoạt động học tập
            </h3>
            <ActivityFeed :limit="null" title="Lịch sử học tập" />
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-8">
        <!-- Search friends for desktop -->
        <div class="hidden lg:block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 class="m-0 text-xs font-black text-slate-900 mb-4 uppercase tracking-widest flex items-center gap-2">
            <i class="fa-solid fa-magnifying-glass text-indigo-500"></i>
            Tìm kiếm bạn bè
          </h3>
          <UserSearch />
        </div>

        <!-- User Stats Shortcut -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center gap-4 mb-6">
            <div class="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-100">
              {{ auth.user?.username?.[0] }}
            </div>
            <div>
              <h3 class="m-0 text-base font-black text-slate-900">{{ auth.user?.fullName || auth.user?.username }}</h3>
              <p class="m-0 text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ auth.user?.planName }} Member</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cấp độ lửa</p>
              <p class="text-lg font-black text-orange-500 m-0">{{ auth.user?.fireLevel || 0 }}</p>
            </div>
            <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Số dư ví</p>
              <p class="text-lg font-black text-indigo-600 m-0">{{ formatCurrency(auth.user?.balance || 0) }}</p>
            </div>
          </div>
          <router-link to="/profile" class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-black text-white hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
            Xem hồ sơ cá nhân
          </router-link>
        </div>

        <!-- Suggestion / Trending (Placeholder) -->
        <div class="card-elevated p-8 border border-slate-100 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
          <div class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
          <h3 class="m-0 text-lg font-extrabold mb-3">Thách thức tuần này</h3>
          <p class="text-indigo-100 text-sm font-medium mb-6 leading-relaxed">
            Hoàn thành 3 đề thi thử bất kỳ để nhận ngay huy hiệu "Chiến binh bền bỉ".
          </p>
          <router-link to="/exams" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-50">
            Tham gia ngay
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ActivityFeed from '@/components/social/ActivityFeed.vue';
import PostCreator from '@/components/social/PostCreator.vue';
import PostList from '@/components/social/PostList.vue';
import UserSearch from '@/components/social/UserSearch.vue';

const auth = useAuthStore();
const postListRef = ref<any>(null);

const refreshPostList = () => {
  postListRef.value?.refresh();
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};
</script>
