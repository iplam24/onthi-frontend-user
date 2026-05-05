<template>
  <div class="animate-fade-in-up space-y-6">
    <button
      type="button"
      @click="emit('back')"
      class="group inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.15em] text-slate-400 transition-all duration-300 hover:text-indigo-600 active:scale-95"
    >
      <i class="fa-solid fa-arrow-left-long text-xs transition-transform group-hover:-translate-x-1" aria-hidden="true"></i>
      Quay lại môn học
    </button>

    <header class="flex flex-wrap items-center gap-6 border-b border-slate-100 pb-8">
      <div
        class="grid h-20 w-20 shrink-0 place-content-center rounded-[1.5rem] bg-gradient-to-br from-indigo-100 to-indigo-50 text-3xl font-black text-indigo-600 shadow-inner transition-transform duration-500 hover:scale-105 hover:rotate-3"
      >
        {{ selectedSubjectInitial }}
      </div>

      <div class="min-w-0">
        <h1 class="m-0 truncate text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{{ selectedSubject }}</h1>
        <p class="mb-0 mt-3 text-xs font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
          Danh sách đề thi hiện có
        </p>
      </div>
    </header>

    <div
      v-if="!exams.length"
      class="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center"
    >
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 mb-4 shadow-sm">
        <i class="fa-solid fa-inbox text-3xl"></i>
      </div>
      <p class="text-base font-bold text-slate-500 m-0">Môn này hiện chưa có đề thi.</p>
    </div>

    <div v-else class="space-y-4">
      <ExamListItem
        v-for="exam in exams"
        :key="exam.id"
        :exam="exam"
        :can-start-exam="canStartExam"
        :get-start-blocked-reason="getStartBlockedReason"
        :user-attempts-count="getUserAttempts(exam.id)"
        :is-logged-in="isLoggedIn"
        @start="emit('start-exam', $event)"
      />
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        @click="emit('refresh')"
        :disabled="loading"
        class="group inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
      >
        <i class="fa-solid fa-rotate-right text-xs transition-transform" :class="loading ? 'animate-spin' : 'group-hover:rotate-180'" aria-hidden="true"></i>
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
  getUserAttempts: (examId: number) => number;
  isLoggedIn: boolean;
}>();

const emit = defineEmits<{
  back: [];
  refresh: [];
  'start-exam': [exam: ExamDisplayItem];
}>();
</script>
