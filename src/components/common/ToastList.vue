<template>
  <div class="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 w-96 max-w-[calc(100vw-2rem)] pointer-events-none">
    <TransitionGroup
      name="toast-slide"
      tag="div"
      class="flex flex-col gap-3 w-full"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto relative overflow-hidden flex items-start gap-3.5 p-4 rounded-2xl border bg-white/85 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        :class="[
          toast.type === 'success' ? 'border-emerald-500/20 shadow-emerald-500/5' :
          toast.type === 'error' ? 'border-rose-500/20 shadow-rose-500/5' :
          toast.type === 'warning' ? 'border-amber-500/20 shadow-amber-500/5' :
          'border-indigo-500/20 shadow-indigo-500/5'
        ]"
      >
        <!-- Dynamic Glow Accent -->
        <div 
          class="absolute -inset-px -z-10 bg-gradient-to-r blur-lg opacity-20"
          :class="[
            toast.type === 'success' ? 'from-emerald-500 to-teal-400' :
            toast.type === 'error' ? 'from-rose-500 to-red-400' :
            toast.type === 'warning' ? 'from-amber-500 to-orange-400' :
            'from-indigo-500 to-cyan-400'
          ]"
        ></div>

        <!-- Left Accent Line -->
        <div 
          class="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
          :class="[
            toast.type === 'success' ? 'bg-gradient-to-b from-emerald-500 to-emerald-400' :
            toast.type === 'error' ? 'bg-gradient-to-b from-rose-500 to-rose-400' :
            toast.type === 'warning' ? 'bg-gradient-to-b from-amber-500 to-amber-400' :
            'bg-gradient-to-b from-indigo-500 to-indigo-400'
          ]"
        ></div>

        <!-- Icon Wrapper -->
        <div 
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all shadow-sm"
          :class="[
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
            toast.type === 'error' ? 'bg-rose-50 text-rose-500 animate-shake' :
            toast.type === 'warning' ? 'bg-amber-50 text-amber-500' :
            'bg-indigo-50 text-indigo-500'
          ]"
        >
          <i v-if="toast.type === 'success'" class="fa-solid fa-circle-check text-base"></i>
          <i v-else-if="toast.type === 'error'" class="fa-solid fa-circle-exclamation text-base"></i>
          <i v-else-if="toast.type === 'warning'" class="fa-solid fa-triangle-exclamation text-base"></i>
          <i v-else class="fa-solid fa-circle-info text-base"></i>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 pr-4">
          <p class="text-[10px] font-black uppercase tracking-[0.15em] mb-0.5"
             :class="[
               toast.type === 'success' ? 'text-emerald-600' :
               toast.type === 'error' ? 'text-rose-600' :
               toast.type === 'warning' ? 'text-amber-600' :
               'text-indigo-600'
             ]"
          >
            {{ toast.type === 'success' ? 'Thành công' :
               toast.type === 'error' ? 'Thất bại' :
               toast.type === 'warning' ? 'Cảnh báo' : 'Thông báo' }}
          </p>
          <p class="text-xs font-bold text-slate-700 leading-relaxed break-words m-0">
            {{ toast.message }}
          </p>
        </div>

        <!-- Dismiss Button -->
        <button
          @click="toastStore.remove(toast.id)"
          class="inline-flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <i class="fa-solid fa-xmark text-[10px]"></i>
        </button>

        <!-- Progress Indicator -->
        <div 
          class="absolute bottom-0 left-0 right-0 h-[2px] opacity-40 origin-left scale-x-0 animate-toast-progress"
          :class="[
            toast.type === 'success' ? 'bg-emerald-500' :
            toast.type === 'error' ? 'bg-rose-500' :
            toast.type === 'warning' ? 'bg-amber-500' :
            'bg-indigo-500'
          ]"
          :style="{ animationDuration: toast.duration + 'ms' }"
        ></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast';

const toastStore = useToastStore();
</script>

<style scoped>
/* ══════ Sliding Transitions ══════ */
.toast-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-slide-leave-active {
  transition: all 0.35s ease-in;
  position: absolute;
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(120px) scale(0.95);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.9);
}
.toast-slide-move {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ══════ Progress Bar Animation ══════ */
@keyframes toast-progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

.animate-toast-progress {
  animation-name: toast-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
</style>
