<template>
  <article
    class="group flex flex-col gap-4 rounded-2xl border border-slate-50 bg-white px-6 py-5 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="min-w-0 flex-1">
      <h3 class="mb-0 mt-0 text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">{{ exam.title }}</h3>

	  <div class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-medium uppercase tracking-wider text-slate-600">
		<p class="m-0 inline-flex items-center gap-1.5">
		  <i class="fa-regular fa-clock" aria-hidden="true"></i>
		  {{ exam.duration }} phút
		</p>
		<p class="m-0 inline-flex items-center gap-1.5">
		  <i class="fa-solid fa-list-check" aria-hidden="true"></i>
		  <template v-if="!exam.maxAttempts || exam.maxAttempts <= 0">Vô hạn lượt</template>
		  <template v-else-if="!isLoggedIn">Tối đa {{ exam.maxAttempts }} lượt</template>
		  <template v-else>Còn lại {{ Math.max(0, exam.maxAttempts - (userAttemptsCount ?? 0)) }} lượt</template>
		</p>
		<p class="m-0 inline-flex items-center gap-1.5">
		  <i class="fa-solid fa-circle-dot" :class="exam.isActive && !isExpired(exam) ? 'text-emerald-500' : 'text-slate-300'" aria-hidden="true"></i>
		  {{ (exam.isActive && !isExpired(exam)) ? 'Đang mở' : 'Đã đóng' }}
		</p>
	  </div>
	</div>

	<div class="flex shrink-0 items-center gap-3 self-end sm:self-auto">
    <button
      type="button"
      @click="emit('start', exam)"
      :disabled="!canStartExam(exam)"
      class="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:cursor-not-allowed"
      :class="(exam.isActive && !isExpired(exam))
        ? 'bg-gradient-brand text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02]' 
        : 'bg-slate-100 text-slate-400 border border-slate-200'"
    >
      <span class="relative z-10">{{ (exam.isActive && !isExpired(exam)) ? (canStartExam(exam) ? 'Vào thi' : getStartBlockedReason(exam)) : 'Đề thi đã kết thúc!' }}</span>
      <i v-if="exam.isActive && !isExpired(exam) && canStartExam(exam)" class="fa-solid fa-arrow-right-long relative z-10 transition-transform group-hover:translate-x-1"></i>
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

