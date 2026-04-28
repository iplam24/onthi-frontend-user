<template>
  <article
	class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-5"
  >
	<div class="min-w-0 flex-1">
	  <h3 class="mb-0 mt-0 text-xl font-extrabold text-slate-800">{{ exam.title }}</h3>

	  <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
		<p class="m-0 inline-flex items-center gap-1.5">
		  <i class="fa-regular fa-clock" aria-hidden="true"></i>
		  {{ exam.duration }} phút
		</p>
		<p class="m-0 inline-flex items-center gap-1.5">
		  <i class="fa-solid fa-list-check" aria-hidden="true"></i>
		  {{ exam.maxAttempts ?? 1 }} lượt
		</p>
		<p class="m-0 inline-flex items-center gap-1.5">
		  <i class="fa-solid fa-circle-dot" aria-hidden="true"></i>
		  {{ exam.isActive ? 'Đang mở' : 'Đã đóng' }}
		</p>
	  </div>
	</div>

	<div class="flex shrink-0 items-center gap-3 self-end sm:self-auto">
	  <button
		type="button"
		@click="emit('start', exam)"
		:disabled="!canStartExam(exam)"
		class="rounded-xl bg-blue-500 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(59,130,246,0.35)] transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
	  >
		{{ canStartExam(exam) ? 'Vào thi' : getStartBlockedReason(exam) }}
	  </button>
	  <button
		type="button"
		@click="emit('start', exam)"
		:disabled="!canStartExam(exam)"
		class="grid h-10 w-10 place-content-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 disabled:cursor-not-allowed"
		aria-label="Vào thi"
	  >
		<i class="fa-solid fa-angle-right"></i>
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
}>();

const emit = defineEmits<{
  start: [exam: ExamDisplayItem];
}>();
</script>

