<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-3 transition-all duration-500 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
  >
    <div class="relative h-56 overflow-hidden rounded-[2rem] bg-slate-50 transition-colors group-hover:bg-blue-50/50">
      <!-- Background Abstract Shape -->
      <div class="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
      
      <div class="absolute inset-x-6 top-6 flex items-start justify-between z-10">
        <span class="inline-flex min-h-[1.75rem] items-center rounded-xl bg-white/90 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white">
          {{ subject.levelName || 'Cơ bản' }}
        </span>
        <div class="flex h-8 w-8 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform group-hover:rotate-12">
          <span :class="['h-2.5 w-2.5 rounded-full shadow-sm', subject.dotClass]"></span>
        </div>
      </div>

      <div class="flex h-full w-full items-center justify-center pt-10">
        <div v-if="subject.imageUrl" class="relative h-36 w-36 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
          <div class="absolute inset-0 rounded-full bg-blue-400/20 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
          <img :src="resolveAssetUrl(subject.imageUrl)" :alt="subject.name" class="relative h-full w-full object-contain drop-shadow-2xl" />
        </div>
        <div v-else class="relative h-24 w-24 flex items-center justify-center rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 text-4xl font-black text-slate-100 transition-all duration-500 group-hover:text-blue-500 group-hover:scale-110 group-hover:rotate-6">
          {{ subject.name?.charAt(0).toUpperCase() }}
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col px-6 py-8">
      <h3 class="m-0 min-h-[3.5rem] line-clamp-2 text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
        {{ subject.name }}
      </h3>

      <div class="mt-4 flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <div class="flex items-center gap-2">
          <div class="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
          <span>{{ subject.count }} Đề thi</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
          <span>{{ subject.durationLabel }}</span>
        </div>
      </div>

      <button
        type="button"
        @click="emit('select', subject.name)"
        class="mt-10 group/btn relative flex w-full items-center justify-between overflow-hidden rounded-[1.25rem] bg-gradient-brand px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/20"
      >
        <span class="relative z-10">Khám phá ngay</span>
        <i class="fa-solid fa-arrow-right-long relative z-10 text-base transition-transform group-hover/btn:translate-x-2"></i>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { SubjectSummaryItem } from '@/types/examDisplay';

defineProps<{
  subject: SubjectSummaryItem;
}>();

const emit = defineEmits<{
  select: [subjectName: string];
}>();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveAssetUrl = (assetUrl?: string) => {
  if (!assetUrl) return undefined;
  return /^https?:\/\//i.test(assetUrl) ? assetUrl : `${BACKEND_ORIGIN}${assetUrl.startsWith('/') ? '' : '/'}${assetUrl}`;
};
</script>

