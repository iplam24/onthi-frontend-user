<template>
  <div class="space-y-8">
    <!-- Academic Stats -->
    <div class="card-elevated overflow-hidden border border-slate-100 bg-white shadow-xl shadow-slate-200/20">
      <div class="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
        <h3 class="m-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thống kê học tập</h3>
      </div>
      <div class="p-6 space-y-6">
        <div class="flex items-center justify-between group">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-bolt"></i>
            </div>
            <span class="text-xs font-black text-slate-600 uppercase tracking-wider">Chuỗi ngày học</span>
          </div>
          <span class="text-xl font-black text-slate-900 tabular-nums">{{ profile?.streak?.currentStreak || 0 }}</span>
        </div>

        <div class="flex items-center justify-between group">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-fire-flame-curved"></i>
            </div>
            <span class="text-xs font-black text-slate-600 uppercase tracking-wider">Mức giữ lửa</span>
          </div>
          <span class="text-sm font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-slate-50" :class="getFireColorClass(profile?.streak?.fireLevel)">
            {{ getFireLabel(profile?.streak?.fireLevel) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Financial (Only own profile) -->
    <div v-if="!isPublicProfile" class="card-elevated overflow-hidden border-0 bg-slate-900 text-white relative group shadow-2xl shadow-indigo-900/20">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent pointer-events-none"></div>
      <div class="absolute -right-10 -bottom-10 h-32 w-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
      
      <div class="relative p-8">
        <div class="flex items-center justify-between mb-8">
          <div class="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <i class="fa-solid fa-wallet text-xl text-indigo-300"></i>
          </div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Số dư ví V-Edu</p>
        </div>
        
        <p class="text-3xl font-black mb-1 tabular-nums tracking-tight">{{ formatPrice(profile?.balance || 0) }}đ</p>
        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Sẵn sàng thanh toán</p>
        
        <router-link to="/deposit" class="flex items-center justify-center gap-2 w-full bg-white py-3 sm:py-4 rounded-2xl text-slate-900 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-indigo-50 active:scale-95 transition-all shadow-xl shadow-black/20">
          <i class="fa-solid fa-plus-circle"></i>
          Nạp thêm tiền
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  profile: any;
  isPublicProfile: boolean;
}>();

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

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
</script>
