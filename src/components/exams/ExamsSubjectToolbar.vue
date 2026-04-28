<template>
  <header class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
    <div>
      <h1 class="m-0 text-4xl font-extrabold tracking-tight text-slate-900">Chọn môn học</h1>
      <p class="mb-0 mt-2 text-xl font-medium text-slate-500">Hệ thống luyện thi THPT Quốc gia thông minh</p>
    </div>

    <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
      <label
        class="inline-flex w-full items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 sm:w-[280px]"
      >
        <span class="shrink-0 text-slate-400">Cấp học</span>
        <select
          :value="modelValue"
          @change="onLevelChange"
          class="w-full bg-transparent text-right text-sm font-bold text-slate-700 outline-none"
          aria-label="Lọc theo cấp học"
        >
          <option v-for="level in levelOptions" :key="level" :value="level">
            {{ level }}
          </option>
        </select>
      </label>

      <router-link
        to="/"
        class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold tracking-[0.08em] text-slate-500 transition hover:bg-slate-50"
      >
        <i class="fa-solid fa-arrow-left text-xs" aria-hidden="true"></i>
        TRANG CHỦ
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  levelOptions: string[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const onLevelChange = (event: Event) => {
  const target = event.target as HTMLSelectElement | null;
  emit('update:modelValue', target?.value || props.modelValue);
};
</script>

