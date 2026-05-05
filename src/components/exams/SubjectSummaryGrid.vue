<template>
  <div v-if="subjects.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
    <SubjectSummaryCard
      v-for="subject in subjects"
      :key="subject.name"
      :subject="subject"
      class="h-full"
      @select="emit('select-subject', $event)"
    />

    <article
      class="flex min-h-[400px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-100 bg-white/50 p-10 text-center transition-all hover:bg-white"
    >
      <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-200">
        <i class="fa-solid fa-plus text-2xl"></i>
      </div>
      <p class="m-0 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Đang cập nhật thêm...</p>
    </article>
  </div>

  <div
    v-else
    class="card-elevated px-5 py-10 text-center text-sm font-medium text-slate-500"
  >
    Không có môn học nào thuộc cấp học đã chọn.
  </div>
</template>

<script setup lang="ts">
import SubjectSummaryCard from '@/components/exams/SubjectSummaryCard.vue';
import type { SubjectSummaryItem } from '@/types/examDisplay';

defineProps<{
  subjects: SubjectSummaryItem[];
}>();

const emit = defineEmits<{
  'select-subject': [subjectName: string];
}>();
</script>

