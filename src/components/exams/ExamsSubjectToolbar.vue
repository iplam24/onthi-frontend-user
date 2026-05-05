<template>
  <header class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between pb-8 border-b border-slate-100">
    <div class="space-y-4">
      <div class="inline-flex items-center gap-3 rounded-full bg-indigo-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600 border border-indigo-100">
        <i class="fa-solid fa-layer-group"></i>
        Khám phá thư viện
      </div>
      <h1 class="m-0 text-4xl font-black tracking-tighter text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
        Chọn <span class="text-indigo-600">môn học</span>
      </h1>
      <p class="mb-0 text-lg font-semibold text-slate-500 leading-relaxed max-w-xl">
        Hệ thống luyện thi THPT Quốc gia thông minh với lộ trình cá nhân hóa.
      </p>
    </div>

    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Cấp học</span>
        
        <!-- Custom Premium Dropdown -->
        <div class="relative w-[280px]">
          <button 
            @click.stop="isOpen = !isOpen"
            class="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-3 transition-all duration-300 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-[0.98]"
          >
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-graduation-cap text-indigo-500 text-xs"></i>
              <span class="text-sm font-bold text-slate-800">{{ modelValue }}</span>
            </div>
            <i :class="['fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-300', isOpen ? 'rotate-180' : '']"></i>
          </button>

          <!-- Dropdown Menu -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-2 opacity-0 scale-95"
            enter-to-class="translate-y-0 opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100 scale-100"
            leave-to-class="translate-y-2 opacity-0 scale-95"
          >
            <div 
              v-if="isOpen" 
              class="absolute right-0 left-0 z-[100] mt-2 max-h-[300px] overflow-y-auto rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-xl p-1.5 shadow-2xl shadow-indigo-900/10 custom-scrollbar"
            >
              <button
                v-for="level in levelOptions"
                :key="level"
                @click="selectLevel(level)"
                class="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200"
                :class="modelValue === level 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                  : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'"
              >
                <span class="truncate">{{ level }}</span>
                <i v-if="modelValue === level" class="fa-solid fa-check text-[10px]"></i>
              </button>
            </div>
          </transition>
        </div>
      </div>

      <div class="flex items-center justify-end">
        <router-link
          to="/"
          class="group inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95"
        >
          <i class="fa-solid fa-arrow-left text-[10px] transition-transform group-hover:-translate-x-1"></i>
          TRANG CHỦ
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  modelValue: string;
  levelOptions: string[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);

const selectLevel = (level: string) => {
  emit('update:modelValue', level);
  isOpen.value = false;
};

// Simple click outside logic
const closeDropdown = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.relative')) {
    isOpen.value = false;
  }
};

onMounted(() => window.addEventListener('click', closeDropdown));
onBeforeUnmount(() => window.removeEventListener('click', closeDropdown));
</script>
