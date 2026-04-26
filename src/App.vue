<template>
  <div id="app" :class="appClass">
    <div v-if="showDecorativeBackdrop" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-24 -top-16 h-80 w-80 rounded-full bg-sky-300/40 blur-[110px] animate-liquid-breathe"></div>
      <div class="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-200/35 blur-[130px] animate-liquid-drift"></div>
      <div class="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-cyan-200/25 blur-[120px] animate-liquid-breathe"></div>
    </div>

    <Header v-if="!isExamShellHiddenRoute" />

    <main :class="mainClass">
      <router-view />
    </main>

    <Footer v-if="!isExamShellHiddenRoute" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

const route = useRoute();

const isExamShellHiddenRoute = computed(() => route.name === 'exam-attempt' || route.name === 'exams');
const showDecorativeBackdrop = computed(() => !isExamShellHiddenRoute.value);

const appClass = computed(() =>
  isExamShellHiddenRoute.value
    ? 'relative flex min-h-screen flex-col bg-[#f5f7f8]'
    : 'relative flex min-h-screen flex-col',
);

const mainClass = computed(() =>
  isExamShellHiddenRoute.value
    ? 'relative mx-auto w-full max-w-7xl flex-1 px-4 pb-12 pt-8 sm:px-6 lg:px-8'
    : 'relative mx-auto w-full max-w-7xl flex-1 px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pt-32',
);
</script>
