<template>
  <div id="app" :class="appClass">
    <!-- Loading Bar -->
    <div 
      class="fixed top-0 left-0 z-[100] h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600 transition-all duration-300 ease-out"
      :style="{ width: loadingProgress + '%', opacity: loadingProgress > 0 && loadingProgress < 100 ? 1 : 0 }"
    ></div>

    <Header v-if="!isExamShellHiddenRoute" />

    <main :class="mainClass" class="grid-layout-main">
      <router-view v-slot="{ Component }">
        <transition
          name="page-cross-fade"
        >
          <component :is="Component" :key="route.path" class="route-view-item" />
        </transition>
      </router-view>
    </main>

    <Footer v-if="!isExamShellHiddenRoute" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

const route = useRoute();
const auth = useAuthStore();
const loadingProgress = ref(0);
let progressInterval = null;

const startLoading = () => {
  loadingProgress.value = 0;
  if (progressInterval) clearInterval(progressInterval);
  
  progressInterval = setInterval(() => {
    if (loadingProgress.value < 90) {
      loadingProgress.value += Math.random() * 10;
    }
  }, 200);
};

const finishLoading = () => {
  if (progressInterval) clearInterval(progressInterval);
  loadingProgress.value = 100;
  setTimeout(() => {
    loadingProgress.value = 0;
  }, 400);
};

watch(() => route.path, () => {
  startLoading();
  // Finish loading almost immediately for a responsive feel
  setTimeout(finishLoading, 150);
});

const isExamShellHiddenRoute = computed(() => {
  if (route.name === 'exam-attempt' || route.name === 'exam-review') return true;
  if (route.name === 'exams' && auth.isAuthenticated) return true;
  return false;
});

const appClass = computed(() =>
  isExamShellHiddenRoute.value
    ? 'relative flex min-h-screen flex-col bg-white'
    : 'relative flex min-h-screen flex-col',
);

const mainClass = computed(() =>
  isExamShellHiddenRoute.value
    ? 'relative mx-auto w-full max-w-7xl flex-1 px-4 pb-12 pt-10 sm:px-6 lg:px-8'
    : 'relative mx-auto w-full max-w-7xl flex-1 px-4 pb-14 pt-28 sm:px-6 lg:px-8',
);
</script>

<style>
/* ══════ Seamless Cross-fade Transitions ══════ */
.grid-layout-main {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: start;
}

.route-view-item {
  grid-area: 1 / 1 / 2 / 2;
  width: 100%;
  will-change: opacity, transform;
}

.page-cross-fade-enter-active {
  transition: opacity 400ms ease-out, transform 450ms cubic-bezier(0.16, 1, 0.3, 1);
}

.page-cross-fade-leave-active {
  transition: opacity 300ms ease-in, transform 350ms ease-in;
  pointer-events: none;
  z-index: 0;
}

.page-cross-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-cross-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Ensure the container doesn't collapse during transition */
main {
  min-height: 70vh;
}

/* Ensure smooth scrolling when navigating */
html {
  scroll-behavior: smooth;
}
</style>
