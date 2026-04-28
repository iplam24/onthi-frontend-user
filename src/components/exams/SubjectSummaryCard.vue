<template>
  <article
    class="group rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.1)]"
  >
    <div class="flex items-start justify-between gap-3">
      <p class="m-0 text-sm font-black uppercase tracking-[0.12em] text-slate-400">{{ subject.levelName || 'Khác' }}</p>
      <span :class="['mt-1 h-2.5 w-2.5 rounded-full', subject.dotClass]"></span>
    </div>

    <div v-if="subject.imageUrl" class="mt-3">
      <img :src="subject.imageUrl" :alt="subject.name" class="h-24 w-full object-contain" />
    </div>

    <h2 class="mb-0 mt-3 text-[2rem] font-extrabold leading-none text-slate-900">{{ subject.name }}</h2>

    <div class="mt-5 space-y-2 text-sm font-semibold text-slate-400">
      <p class="m-0 inline-flex items-center gap-2">
        <i class="fa-regular fa-clock text-xs" aria-hidden="true"></i>
        {{ subject.durationLabel }}
      </p>
      <p class="m-0 inline-flex items-center gap-2">
        <i class="fa-solid fa-layer-group text-xs" aria-hidden="true"></i>
        {{ subject.count }} đề thi
      </p>
    </div>

    <button
      type="button"
      @click="emit('select', subject.name)"
      class="mt-8 inline-flex w-full items-center justify-between border-t border-slate-100 pt-4 text-sm font-black tracking-[0.05em] text-emerald-600 transition group-hover:text-emerald-700"
    >
      <span>VÀO THI NGAY</span>
      <i class="fa-solid fa-angle-right text-base" aria-hidden="true"></i>
    </button>
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
</script>

