<template>
  <article
    class="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-50 bg-white px-6 py-5 shadow-sm transition-all duration-500 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 sm:flex-row sm:items-center sm:justify-between"
  >
    <!-- Hover accent -->
    <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-transparent transition-all duration-500 group-hover:bg-gradient-to-b group-hover:from-indigo-500 group-hover:to-cyan-400"></div>

    <div class="min-w-0 flex-1 pl-2">
      <h3 class="mb-0 mt-0 text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">{{ exam.title }}</h3>

	  <div class="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
		<p class="m-0 inline-flex items-center gap-1.5">
		  <i class="fa-regular fa-clock text-indigo-400" aria-hidden="true"></i>
		  {{ exam.duration }} phút
		</p>
		<p class="m-0 inline-flex items-center gap-1.5">
		  <i class="fa-solid fa-list-check text-indigo-400" aria-hidden="true"></i>
		  <template v-if="!exam.maxAttempts || exam.maxAttempts <= 0">Vô hạn lượt</template>
		  <template v-else-if="!isLoggedIn">Tối đa {{ exam.maxAttempts }} lượt</template>
		  <template v-else>Còn lại {{ Math.max(0, exam.maxAttempts - (userAttemptsCount ?? 0)) }} lượt</template>
		</p>
		<p class="m-0 inline-flex items-center gap-1.5">
		  <span class="relative flex h-2 w-2">
            <span v-if="exam.isActive && !isExpired(exam)" class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full" :class="exam.isActive && !isExpired(exam) ? 'bg-emerald-500' : 'bg-slate-300'"></span>
          </span>
		  {{ (exam.isActive && !isExpired(exam)) ? 'Đang mở' : 'Đã đóng' }}
		</p>
	  </div>
	</div>

	<div class="flex shrink-0 items-center gap-3 self-end sm:self-auto">
    <button
      type="button"
      @click="emit('start', exam)"
      :disabled="!canStartExam(exam)"
      class="group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:cursor-not-allowed"
      :class="(exam.isActive && !isExpired(exam))
        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-500/25' 
        : 'bg-slate-100 text-slate-400 border border-slate-200'"
    >
      <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full skew-x-12"></span>
      <span class="relative z-10">{{ (exam.isActive && !isExpired(exam)) ? (canStartExam(exam) ? 'Vào thi' : getStartBlockedReason(exam)) : 'Đề thi đã kết thúc!' }}</span>
      <i v-if="exam.isActive && !isExpired(exam) && canStartExam(exam)" class="fa-solid fa-arrow-right-long relative z-10 transition-transform group-hover/btn:translate-x-1"></i>
      <i v-else-if="!exam.isActive || isExpired(exam)" class="fa-solid fa-lock text-[10px] relative z-10"></i>
    </button>
	</div>
  </article>
</template>

<script setup lang="ts">
import type { ExamDisplayItem } from '@/types/examDisplay';

defineProps<{
  exam: ExamDisplayItem;
  canStartExam: (exam: ExamDisplayItem) => boolean;
  getStartBlockedReason: (exam: ExamDisplayItem) => string;
  userAttemptsCount?: number;
  isLoggedIn?: boolean;
}>();

const isExpired = (exam: any) => {
  const expiryDate = exam.endTime || exam.endDate || exam.deadline;
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

const emit = defineEmits<{
  start: [exam: ExamDisplayItem];
}>();
</script>
