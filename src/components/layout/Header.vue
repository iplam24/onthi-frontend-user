<template>
  <header class="fixed inset-x-0 top-0 z-50 px-4 pt-5 sm:px-6 transition-all duration-300">
    <div
      class="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-2xl border border-white bg-white px-5 py-3 shadow-lg shadow-slate-200/40 sm:px-8"
    >
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="relative">
          <div class="absolute inset-0 rounded-xl bg-indigo-500/20 blur-md transition-all group-hover:bg-indigo-500/35 group-hover:blur-lg"></div>
          <img
            src="@/asset/logo.png"
            alt="Logo"
            class="relative h-10 w-10 rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div>
          <p class="m-0 text-lg font-extrabold tracking-tight text-black sm:text-xl">{{ appName }}</p>
          <p class="m-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Learning Platform</p>
        </div>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden items-center gap-0.5 md:flex">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-black/60 transition-all duration-200 hover:text-blue-600 [&.router-link-exact-active]:text-blue-600"
        >
          <span class="absolute inset-0 rounded-xl bg-transparent transition-all duration-200 group-hover:bg-blue-50 [.router-link-exact-active_&]:bg-blue-50"></span>
          <i :class="['fa-solid text-xs relative z-10', item.icon]" aria-hidden="true"></i>
          <span class="relative z-10">{{ item.label }}</span>
          <span class="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-brand transition-all duration-300 [.router-link-exact-active_&]:w-6"></span>
        </router-link>
      </nav>

      <!-- Desktop Auth -->
      <div class="hidden items-center gap-2 md:flex">
        <template v-if="auth.isAuthenticated">
          <div class="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5">
            <div class="h-6 w-6 rounded-full bg-gradient-brand flex items-center justify-center">
              <span class="text-[10px] font-bold text-white uppercase">{{ auth.user.username?.[0] }}</span>
            </div>
            <span class="text-sm font-bold text-black">{{ auth.user.username }}</span>
          </div>
          <button
            @click="logout"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <i class="fa-solid fa-right-from-bracket text-xs" aria-hidden="true"></i>
            Đăng xuất
          </button>
        </template>
        <template v-else>
          <button
            @click="showAuthPopover = true"
            class="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all duration-300 hover:shadow-lg hover:shadow-blue-300 active:scale-95"
          >
            <span class="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0 skew-x-12"></span>
            <i class="fa-solid fa-right-to-bracket text-xs relative z-10" aria-hidden="true"></i>
            <span class="relative z-10">Đăng nhập</span>
          </button>
        </template>
      </div>

      <!-- Mobile menu toggle -->
      <button
        @click="mobileOpen = !mobileOpen"
        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-indigo-600 md:hidden"
        aria-label="Mở menu"
      >
        <i :class="['fa-solid text-sm transition-all duration-300', mobileOpen ? 'fa-xmark rotate-90' : 'fa-bars']" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-2 opacity-0 scale-98"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-2 opacity-0 scale-98"
    >
      <div
        v-if="mobileOpen"
        class="relative mx-auto mt-2 w-full max-w-7xl overflow-hidden rounded-2xl border border-white/60 bg-white/90 p-3 shadow-xl shadow-slate-200/60 backdrop-blur-xl md:hidden"
      >
        <nav class="grid gap-1">
          <router-link
            v-for="item in navItems"
            :key="`m-${item.to}`"
            :to="item.to"
            class="inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 [&.router-link-exact-active]:bg-blue-50 [&.router-link-exact-active]:text-blue-600"
            @click="mobileOpen = false"
          >
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 [.router-link-exact-active_&]:bg-blue-100">
              <i :class="['fa-solid text-xs', item.icon]" aria-hidden="true"></i>
            </span>
            {{ item.label }}
          </router-link>
        </nav>

        <div class="mt-3 border-t border-slate-100 pt-3">
          <template v-if="auth.isAuthenticated">
            <div class="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <div class="h-9 w-9 rounded-full bg-gradient-brand flex items-center justify-center">
                <span class="text-sm font-bold text-white uppercase">{{ auth.user.username?.[0] }}</span>
              </div>
              <div>
                <p class="m-0 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tài khoản</p>
                <p class="m-0 text-sm font-bold text-slate-900">{{ auth.user.username }}</p>
              </div>
            </div>
            <button
              @click="logout"
              class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <i class="fa-solid fa-right-from-bracket text-xs" aria-hidden="true"></i>
              Đăng xuất
            </button>
          </template>
          <template v-else>
            <button
              @click="openAuthOnMobile"
              class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all duration-200 hover:bg-blue-700 active:scale-95"
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
import { ref, watch } from 'vue';
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

const navItems = [
  { to: '/', label: 'Trang chủ', icon: 'fa-house' },
  { to: '/exams', label: 'Bài thi', icon: 'fa-file-pen' },
  { to: '/attempts', label: 'Lịch sử', icon: 'fa-clock-rotate-left' },
  { to: '/learning', label: 'Học tập', icon: 'fa-book-open-reader' },
  { to: '/policy', label: 'Chính sách', icon: 'fa-shield-heart' },
  { to: '/contact', label: 'Liên hệ', icon: 'fa-envelope' },
];

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