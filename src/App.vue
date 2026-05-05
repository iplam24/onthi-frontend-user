<template>
  <div id="app" :class="appClass">
    <Header v-if="!isExamShellHiddenRoute" />

    <main :class="mainClass">
      <transition
        :name="transitionName"
        mode="out-in"
        @before-enter="onBeforeEnter"
      >
        <router-view :key="route.path" />
      </transition>
    </main>

    <Footer v-if="!isExamShellHiddenRoute" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

const route = useRoute();
const auth = useAuthStore();
const transitionName = ref('page-fade');

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

const onBeforeEnter = (el) => {
  el.style.willChange = 'opacity, transform';
};
</script>

<style>
/* Page transition animations */
.page-fade-enter-active {
  animation: fade-in-scale 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.page-fade-leave-active {
  animation: fade-in 200ms ease-in reverse both;
}
</style>
