<template>
  <header class="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 transition-all duration-500" :class="{ 'pt-2': scrolled }">
    <div
      class="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-2xl px-5 py-3 sm:px-8 transition-all duration-500"
      :class="scrolled 
        ? 'bg-white/80 backdrop-blur-2xl border border-white/60 shadow-lg shadow-indigo-500/5' 
        : 'bg-white border border-slate-100 shadow-md shadow-slate-200/30'"
    >
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="relative">
          <div class="absolute -inset-1 rounded-xl bg-indigo-500/20 blur-md transition-all duration-500 group-hover:bg-indigo-500/40 group-hover:blur-lg group-hover:scale-110"></div>
          <img
            src="@/asset/logo.png"
            alt="Logo"
            class="relative h-10 w-10 rounded-xl shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          />
        </div>
        <div>
          <p class="m-0 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{{ appName }}</p>
          <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">Learning Platform</p>
        </div>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden items-center gap-1 md:flex">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link group relative inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition-all duration-300 hover:text-indigo-600"
        >
          <span class="absolute inset-0 rounded-xl bg-transparent transition-all duration-300 group-hover:bg-indigo-50 [.router-link-exact-active_&]:bg-indigo-50"></span>
          <i :class="['fa-solid text-xs relative z-10 transition-transform duration-300 group-hover:scale-110', item.icon, 'group-hover:text-indigo-500']" aria-hidden="true"></i>
          <span class="relative z-10 [.router-link-exact-active_&]:text-indigo-600">{{ item.label }}</span>
          <span class="absolute bottom-1 left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 [.router-link-exact-active_&]:w-8"></span>
        </router-link>
      </nav>

      <!-- Desktop Auth -->
      <div class="hidden items-center gap-3 md:flex">
        <template v-if="auth.isAuthenticated">
          <div class="flex items-center gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/50 px-3.5 py-2 transition-all hover:border-indigo-200 hover:bg-indigo-50">
            <div class="relative h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-sm">
              <span class="text-[10px] font-bold text-white uppercase">{{ auth.user.username?.[0] }}</span>
              <span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white"></span>
            </div>
            <span class="text-sm font-bold text-slate-800">{{ auth.user.username }}</span>
          </div>
          <button
            @click="logout"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-500 transition-all duration-300 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-md hover:shadow-rose-500/5 active:scale-95"
          >
            <i class="fa-solid fa-right-from-bracket text-xs" aria-hidden="true"></i>
            Đăng xuất
          </button>
        </template>
        <template v-else>
          <button
            @click="showAuthPopover = true"
            class="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.03] active:scale-95"
          >
            <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full skew-x-12"></span>
            <i class="fa-solid fa-right-to-bracket text-xs relative z-10" aria-hidden="true"></i>
            <span class="relative z-10">Đăng nhập</span>
          </button>
        </template>
      </div>

      <!-- Mobile menu toggle -->
      <button
        @click="mobileOpen = !mobileOpen"
        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 md:hidden active:scale-90"
        aria-label="Mở menu"
      >
        <i :class="['fa-solid text-sm transition-all duration-500', mobileOpen ? 'fa-xmark rotate-180' : 'fa-bars']" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-3 opacity-0 scale-[0.97]"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-3 opacity-0 scale-[0.97]"
    >
      <div
        v-if="mobileOpen"
        class="relative mx-auto mt-2 w-full max-w-7xl overflow-hidden rounded-2xl border border-white/80 bg-white/95 p-3 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl md:hidden"
      >
        <nav class="grid gap-1">
          <router-link
            v-for="item in navItems"
            :key="`m-${item.to}`"
            :to="item.to"
            class="inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 [&.router-link-exact-active]:bg-indigo-50 [&.router-link-exact-active]:text-indigo-600"
            @click="mobileOpen = false"
          >
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-colors [.router-link-exact-active_&]:bg-indigo-100">
              <i :class="['fa-solid text-xs', item.icon]" aria-hidden="true"></i>
            </span>
            {{ item.label }}
          </router-link>
        </nav>

        <div class="mt-3 border-t border-slate-100 pt-3">
          <template v-if="auth.isAuthenticated">
            <div class="flex items-center gap-3 rounded-xl bg-indigo-50/50 px-4 py-3">
              <div class="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-sm">
                <span class="text-sm font-bold text-white uppercase">{{ auth.user.username?.[0] }}</span>
              </div>
              <div>
                <p class="m-0 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tài khoản</p>
                <p class="m-0 text-sm font-bold text-slate-900">{{ auth.user.username }}</p>
              </div>
            </div>
            <button
              @click="logout"
              class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 active:scale-95"
            >
              <i class="fa-solid fa-right-from-bracket text-xs" aria-hidden="true"></i>
              Đăng xuất
            </button>
          </template>
          <template v-else>
            <button
              @click="openAuthOnMobile"
              class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 active:scale-95"
            >
              <i class="fa-solid fa-right-to-bracket text-xs" aria-hidden="true"></i>
              Đăng nhập
            </button>
          </template>
        </div>
      </div>
    </transition>

    <AuthPopover v-if="showAuthPopover" @close="showAuthPopover = false" />
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { APP_NAME } from '@/config';
import AuthPopover from '@/components/auth/AuthPopover.vue';

const appName = APP_NAME;
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const showAuthPopover = ref(false);
const mobileOpen = ref(false);
const scrolled = ref(false);

const navItems = [
  { to: '/', label: 'Trang chủ', icon: 'fa-house' },
  { to: '/exams', label: 'Bài thi', icon: 'fa-file-pen' },
  { to: '/attempts', label: 'Lịch sử', icon: 'fa-clock-rotate-left' },
  { to: '/learning', label: 'Học tập', icon: 'fa-book-open-reader' },
  { to: '/policy', label: 'Chính sách', icon: 'fa-shield-heart' },
  { to: '/contact', label: 'Liên hệ', icon: 'fa-envelope' },
];

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(
  () => route.fullPath,
  () => { mobileOpen.value = false; },
);

const openAuthOnMobile = () => {
  mobileOpen.value = false;
  showAuthPopover.value = true;
};

const logout = () => {
  auth.logout();
  mobileOpen.value = false;
  router.push('/');
};
</script>