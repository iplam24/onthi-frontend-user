<template>
  <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl">
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
    <div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]"></div>
    <div class="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]"></div>

    <!-- Mobile layout: vertical stacked. Desktop: horizontal side-by-side -->
    <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:gap-12 p-6 sm:p-8 lg:p-10">

      <!-- Top part on mobile: avatar + name + stats in one centered column -->
      <div class="flex flex-col items-center text-center gap-4 flex-shrink-0 lg:w-auto w-full">

        <!-- Avatar -->
        <div class="relative" ref="avatarMenuContainer">
          <div 
            @click.stop="!isPublicProfile && $emit('toggle-avatar-menu')"
            class="group/avatar relative h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-indigo-500/30 border-4 border-white/10 overflow-hidden transition-all"
            :class="!isPublicProfile ? 'cursor-pointer hover:scale-105 active:scale-95' : ''"
          >
            <img v-if="previewUrl || profile?.avatar" :src="resolveImageUrl(previewUrl || profile?.avatar)" class="h-full w-full object-cover" />
            <span v-else class="text-5xl font-black text-white uppercase">{{ profile?.username?.[0] || '?' }}</span>
            
            <div v-if="!isPublicProfile" class="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
              <i class="fa-solid fa-camera text-white text-2xl"></i>
            </div>

            <div v-if="profile?.streak?.activeToday" class="absolute -bottom-2 -right-2 h-9 w-9 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-slate-800 z-20" title="Đã học hôm nay">
              <i class="fa-solid fa-fire text-orange-500 text-lg animate-pulse"></i>
            </div>
          </div>

          <!-- Avatar Menu -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
          >
            <div 
              v-if="showAvatarMenu" 
              class="absolute left-1/2 top-full z-30 mt-3 w-44 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl"
            >
              <button @click="$emit('open-preview')" class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-black text-slate-300 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
                <i class="fa-solid fa-eye w-4"></i> Xem ảnh
              </button>
              <button @click="$emit('trigger-upload')" class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-black text-slate-300 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
                <i class="fa-solid fa-image w-4"></i> Đổi ảnh
              </button>
            </div>
          </transition>
        </div>

        <!-- Name -->
        <h1 class="m-0 text-2xl sm:text-3xl font-black tracking-tight text-white leading-none break-words max-w-full px-2">{{ displayName }}</h1>

        <!-- Stats row -->
        <div v-if="profile" class="flex items-center gap-5 sm:gap-8">
          <div class="text-center">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] m-0 mb-1">Bạn bè</p>
            <p class="text-lg font-black text-white m-0 tabular-nums">{{ stats.friends || 0 }}</p>
          </div>
          <div class="h-7 w-px bg-slate-700 shrink-0"></div>
          <div class="text-center">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] m-0 mb-1">Follower</p>
            <p class="text-lg font-black text-white m-0 tabular-nums">{{ stats.followers }}</p>
          </div>
          <div class="h-7 w-px bg-slate-700 shrink-0"></div>
          <div class="text-center">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] m-0 mb-1">Following</p>
            <p class="text-lg font-black text-white m-0 tabular-nums">{{ stats.following }}</p>
          </div>
        </div>
        <p v-else class="m-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-white">{{ email }}</p>

        <!-- Action buttons for public profile -->
        <div v-if="isPublicProfile" class="w-full flex flex-col gap-2 mt-1">
          <button 
            @click="$emit('follow')"
            :disabled="followLoading"
            class="w-full justify-center px-6 py-3 rounded-xl text-xs font-black transition-all shadow-xl flex items-center gap-2 uppercase tracking-widest"
            :class="isFollowingUser ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'"
          >
            <i v-if="followLoading" class="fa-solid fa-circle-notch animate-spin"></i>
            <i v-else :class="isFollowingUser ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'"></i>
            {{ isFollowingUser ? 'Đang theo dõi' : 'Theo dõi' }}
          </button>
          <div class="grid grid-cols-2 gap-2 w-full">
            <button 
              @click="$emit('show-gift')"
              class="flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 text-white text-xs font-black hover:bg-white/20 transition-all border border-white/10 uppercase tracking-widest"
            >
              <i class="fa-solid fa-gift mr-2"></i> Tặng quà
            </button>
            <button 
              @click="$emit('start-chat')"
              class="flex items-center justify-center px-4 py-3 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 border border-indigo-500/30 uppercase tracking-widest"
            >
              <i class="fa-solid fa-comment-dots mr-2"></i> Nhắn tin
            </button>
          </div>
        </div>
      </div>

      <!-- Divider on mobile, spacer on desktop -->
      <div class="w-full h-px bg-white/5 my-2 lg:hidden"></div>

      <!-- Streak stats grid slot -->
      <slot name="stats"></slot>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  profile: any;
  stats: any;
  displayName: string;
  isPublicProfile: boolean;
  isFollowingUser: boolean;
  followLoading: boolean;
  previewUrl: string | null;
  showAvatarMenu: boolean;
  email: string;
}>();

defineEmits(['toggle-avatar-menu', 'open-preview', 'trigger-upload', 'follow', 'show-gift', 'start-chat']);

const avatarMenuContainer = ref<HTMLElement | null>(null);
defineExpose({ avatarMenuContainer });

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};
</script>
