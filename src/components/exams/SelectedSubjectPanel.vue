<template>
  <div class="space-y-6">
    <button
      type="button"
      @click="emit('back')"
      class="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-slate-400 transition hover:text-slate-600"
    >
      <i class="fa-solid fa-arrow-left text-xs" aria-hidden="true"></i>
      Quay lại môn học
    </button>

    <header class="flex flex-wrap items-center gap-4">
      <div
        class="grid h-14 w-14 shrink-0 place-content-center rounded-2xl bg-white text-2xl font-black text-sky-500 shadow-[0_8px_20px_rgba(15,23,42,0.09)]"
      >
        {{ selectedSubjectInitial }}
      </div>

      <div class="min-w-0">
        <h1 class="m-0 truncate text-4xl font-extrabold leading-none text-slate-900 sm:text-5xl">{{ selectedSubject }}</h1>
        <p class="mb-0 mt-2 text-sm font-bold uppercase tracking-[0.1em] text-slate-400">Danh sách đề thi hiện có</p>
      </div>
    </header>

    <div
      v-if="!exams.length"
      class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600"
    >
      Môn này hiện chưa có đề thi.
    </div>

    <div v-else class="space-y-4">
      <ExamListItem
        v-for="exam in exams"
        :key="exam.id"
        :exam="exam"
        :can-start-exam="canStartExam"
        :get-start-blocked-reason="getStartBlockedReason"
        @start="emit('start-exam', $event)"
      />
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        @click="emit('refresh')"
        :disabled="loading"
        class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <i class="fa-solid fa-rotate-right text-xs" aria-hidden="true"></i>
        Làm mới danh sách
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExamListItem from '@/components/exams/ExamListItem.vue';
import type { ExamDisplayItem } from '@/types/examDisplay';

defineProps<{
  selectedSubject: string;
  selectedSubjectInitial: string;
  exams: ExamDisplayItem[];
  loading: boolean;
  canStartExam: (exam: ExamDisplayItem) => boolean;
  getStartBlockedReason: (exam: ExamDisplayItem) => string;
}>();

const emit = defineEmits<{
  back: [];
  refresh: [];
  'start-exam': [exam: ExamDisplayItem];
}>();
</script>

