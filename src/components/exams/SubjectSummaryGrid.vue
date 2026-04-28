<template>
  <div v-if="subjects.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
    <SubjectSummaryCard
      v-for="subject in subjects"
      :key="subject.name"
      :subject="subject"
      @select="emit('select-subject', $event)"
    />

    <article
      class="grid min-h-[300px] place-content-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-slate-300"
    >
      <p class="m-0 text-sm font-black uppercase tracking-[0.12em]">Cập nhật thêm...</p>
    </article>
  </div>

  <div
    v-else
    class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center text-sm font-medium text-slate-500"
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

