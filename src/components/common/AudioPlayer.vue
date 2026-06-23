<template>
  <div class="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/20 p-4 shadow-sm">
    <!-- Play/Pause Button -->
    <button
      type="button"
      @click="togglePlay"
      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 active:scale-95 transition-all duration-200"
    >
      <i class="fa-solid" :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
    </button>

    <!-- Progress slider & Times -->
    <div class="flex grow flex-col gap-1 w-full">
      <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-indigo-500/80">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
      <div class="relative flex items-center group w-full">
        <input
          type="range"
          min="0"
          :max="duration || 100"
          step="0.1"
          :value="currentTime"
          @input="seek"
          class="w-full h-1 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
        />
        <!-- Progress bar background track highlights (Optional, simple slider is fine) -->
      </div>
    </div>

    <!-- Playback Speed cycle button -->
    <button
      type="button"
      @click="cycleSpeed"
      class="inline-flex items-center gap-1 rounded-xl border border-indigo-200/60 bg-white px-3 py-2 text-xs font-black text-indigo-600 shadow-sm hover:bg-indigo-50 active:scale-95 transition-all"
    >
      <i class="fa-solid fa-gauge-simple-high"></i>
      <span>{{ speed }}x</span>
    </button>

    <!-- Hidden native audio element -->
    <audio
      ref="audioRef"
      :src="src"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps<{
  src: string;
}>();

const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const speed = ref(1.0);

const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

// Watch for src changes to reset state
watch(() => props.src, () => {
  isPlaying.value = false;
  currentTime.value = 0;
  if (audioRef.value) {
    audioRef.value.playbackRate = speed.value;
  }
});

function togglePlay() {
  if (!audioRef.value) return;

  if (isPlaying.value) {
    audioRef.value.pause();
    isPlaying.value = false;
  } else {
    // Apply speed settings before playing
    audioRef.value.playbackRate = speed.value;
    audioRef.value.play().then(() => {
      isPlaying.value = true;
    }).catch(err => {
      console.error('Audio play failed:', err);
    });
  }
}

function seek(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value);
  if (audioRef.value) {
    audioRef.value.currentTime = val;
    currentTime.value = val;
  }
}

function cycleSpeed() {
  const currentIndex = speeds.indexOf(speed.value);
  const nextIndex = (currentIndex + 1) % speeds.length;
  speed.value = speeds[nextIndex] ?? 1.0;
  if (audioRef.value) {
    audioRef.value.playbackRate = speed.value;
  }
}

function onTimeUpdate() {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime;
  }
}

function onLoadedMetadata() {
  if (audioRef.value) {
    duration.value = audioRef.value.duration;
  }
}

function onEnded() {
  isPlaying.value = false;
  currentTime.value = 0;
}

function formatTime(secs: number): string {
  if (isNaN(secs) || secs === Infinity) return '0:00';
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause();
  }
});
</script>

<style scoped>
/* Simple CSS slider styling override to make it premium */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  transition: transform 0.1s ease;
}
input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}
input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: 0;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  transition: transform 0.1s ease;
}
input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
}
</style>
