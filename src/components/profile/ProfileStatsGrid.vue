<template>
  <div class="flex-1 w-full grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 self-center">
    <!-- Current Streak -->
    <div class="min-w-0 bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all hover:bg-white/10 group">
      <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 m-0 group-hover:text-amber-400 transition-colors">Chuỗi ngày</p>
      <div class="mt-2 flex items-center gap-2">
        <i class="fa-solid fa-bolt text-amber-400 text-xl"></i>
        <span class="text-2xl sm:text-3xl font-black text-white tabular-nums leading-none">{{ profile?.streak?.currentStreak || 0 }}</span>
      </div>
    </div>
    <!-- Longest Streak -->
    <div class="min-w-0 bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all hover:bg-white/10 group">
      <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 m-0 group-hover:text-amber-500 transition-colors">Kỷ lục</p>
      <div class="mt-2 flex items-center gap-2">
        <i class="fa-solid fa-crown text-amber-500 text-xl"></i>
        <span class="text-2xl sm:text-3xl font-black text-white tabular-nums leading-none">{{ profile?.streak?.longestStreak || 0 }}</span>
      </div>
    </div>
    <!-- Fire Level -->
    <div class="min-w-0 bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center col-span-2 transition-all hover:bg-white/10">
      <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 m-0">Mức độ giữ lửa</p>
      <div class="mt-3 w-full px-1">
        <div class="flex justify-between mb-2">
          <span class="text-[10px] font-black uppercase tracking-widest" :class="getFireColorClass(profile?.streak?.fireLevel)">{{ getFireLabel(profile?.streak?.fireLevel) }}</span>
          <span class="text-[10px] text-slate-500 font-black uppercase tracking-widest">Lvl {{ profile?.streak?.fireLevel || 0 }}/5</span>
        </div>
        <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-1000 shadow-lg" :class="getFireBgClass(profile?.streak?.fireLevel)" :style="{ width: `${((profile?.streak?.fireLevel || 0) / 5) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  profile: any;
}>();

const getFireLabel = (level?: number) => {
  if (!level || level === 0) return 'Chưa có lửa';
  if (level === 1) return 'Mới bắt đầu';
  if (level === 2) return 'Ổn định nhẹ';
  if (level === 3) return 'Khá tốt';
  if (level === 4) return 'Rất tốt';
  return 'Bùng cháy';
};

const getFireColorClass = (level?: number) => {
  if (!level || level === 0) return 'text-slate-400';
  if (level === 1) return 'text-amber-500';
  if (level === 2) return 'text-orange-500';
  if (level === 3) return 'text-rose-500';
  if (level === 4) return 'text-red-500';
  return 'text-red-600 font-black';
};

const getFireBgClass = (level?: number) => {
  if (!level || level === 0) return 'bg-slate-600';
  if (level === 1) return 'bg-amber-500';
  if (level === 2) return 'bg-orange-500';
  if (level === 3) return 'bg-rose-500';
  if (level === 4) return 'bg-red-500';
  return 'bg-gradient-to-r from-red-500 to-orange-400';
};
</script>
