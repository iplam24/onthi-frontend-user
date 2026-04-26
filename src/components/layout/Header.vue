<template>
  <header class="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
    <div
      class="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/72 px-4 py-3 text-slate-900 shadow-[0_14px_38px_rgba(15,23,42,0.13)] backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sm:px-6"
    >
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(191,219,254,0.4),rgba(255,255,255,0.55),rgba(186,230,253,0.35))]"></div>
      <div class="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sky-200/60 blur-3xl"></div>

      <div class="relative flex items-center justify-between gap-3">
        <router-link to="/" class="flex items-center gap-3">
          <img
            src="@/asset/logo.png"
            alt="Logo"
            class="h-11 w-11 rounded-xl border border-slate-200/90 bg-white/80 p-1.5 shadow-[0_8px_18px_rgba(59,130,246,0.2)]"
          />
          <div>
            <p class="m-0 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{{ appName }}</p>
         
          </div>
        </router-link>

        <nav class="hidden items-center gap-1 md:flex">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="inline-flex items-center gap-2 rounded-xl border border-transparent px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-100 hover:bg-white/85 hover:text-sky-700 [&.router-link-exact-active]:border-sky-200 [&.router-link-exact-active]:bg-white [&.router-link-exact-active]:text-sky-700 [&.router-link-exact-active]:shadow-[0_6px_16px_rgba(2,132,199,0.16)]"
          >
            <i :class="['fa-solid text-xs', item.icon]" aria-hidden="true"></i>
            {{ item.label }}
          </router-link>
        </nav>

        <div class="hidden items-center gap-2 md:flex">
          <template v-if="auth.isAuthenticated">
            <span class="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              Chào, {{ auth.user.username }}
            </span>
            <button
              @click="logout"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-sky-700"
            >
              <i class="fa-solid fa-right-from-bracket text-xs" aria-hidden="true"></i>
              Đăng xuất
            </button>
          </template>
          <template v-else>
            <button
              @click="showAuthPopover = true"
              class="inline-flex items-center gap-2 rounded-xl border border-sky-200/70 bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(37,99,235,0.38)]"
            >
              <i class="fa-solid fa-right-to-bracket text-xs" aria-hidden="true"></i>
              Đăng nhập
            </button>
          </template>
        </div>

        <button
          @click="mobileOpen = !mobileOpen"
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-700 transition hover:bg-white md:hidden"
          aria-label="Mở menu"
        >
          <i :class="['fa-solid text-base', mobileOpen ? 'fa-xmark' : 'fa-bars']" aria-hidden="true"></i>
        </button>
      </div>

      <transition
        enter-active-class="transition duration-250 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-2 opacity-0"
      >
        <div
          v-if="mobileOpen"
          class="relative mt-3 rounded-2xl border border-slate-200 bg-white/78 p-3 shadow-[0_12px_26px_rgba(15,23,42,0.1)] md:hidden"
        >
          <nav class="grid gap-1">
            <router-link
              v-for="item in navItems"
              :key="`m-${item.to}`"
              :to="item.to"
              class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 [&.router-link-exact-active]:bg-sky-100 [&.router-link-exact-active]:text-sky-700"
              @click="mobileOpen = false"
            >
              <i :class="['fa-solid text-xs', item.icon]" aria-hidden="true"></i>
              {{ item.label }}
            </router-link>
          </nav>

          <div class="mt-3 border-t border-slate-200 pt-3">
            <template v-if="auth.isAuthenticated">
              <p class="m-0 mb-2 text-sm font-medium text-slate-700">Chào, {{ auth.user.username }}</p>
              <button
                @click="logout"
                class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
              >
                <i class="fa-solid fa-right-from-bracket text-xs" aria-hidden="true"></i>
                Đăng xuất
              </button>
            </template>
            <template v-else>
              <button
                @click="openAuthOnMobile"
                class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-sky-200/50 bg-gradient-to-r from-sky-400 to-blue-500 px-3 py-2 text-sm font-semibold text-white"
              >
                <i class="fa-solid fa-right-to-bracket text-xs" aria-hidden="true"></i>
                Đăng nhập
              </button>
            </template>
          </div>
        </div>
      </transition>
    </div>

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
  () => {
    mobileOpen.value = false;
  },
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
