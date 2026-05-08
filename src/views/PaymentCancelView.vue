<template>
  <div class="min-h-[80vh] flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-rose-500/10 border border-slate-100 overflow-hidden animate-slide-up-reveal">
      <div class="p-8 sm:p-12 text-center">
        <!-- Cancel Icon -->
        <div class="relative mx-auto w-24 h-24 mb-8">
          <div class="absolute inset-0 bg-rose-100 rounded-full animate-pulse opacity-25"></div>
          <div class="relative flex items-center justify-center w-full h-full bg-rose-500 rounded-full shadow-lg shadow-rose-500/30">
            <i class="fa-solid fa-xmark text-4xl text-white"></i>
          </div>
        </div>

        <h1 class="text-3xl font-black text-slate-900 mb-4 tracking-tight">Giao dịch đã hủy</h1>
        <p class="text-slate-500 font-medium mb-8 leading-relaxed">
          Bạn đã hủy yêu cầu thanh toán. Đừng lo lắng, số dư của bạn chưa bị thay đổi.
        </p>

        <!-- Action Buttons -->
        <div class="grid gap-4">
          <router-link to="/profile" class="btn-primary py-4 text-xs font-black uppercase tracking-[0.2em] bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/25">
            Thử lại thanh toán
          </router-link>
          <router-link to="/" class="btn-secondary py-4 text-xs font-black uppercase tracking-[0.2em]">
            Về trang chủ
          </router-link>
        </div>
      </div>
      
      <div class="h-2 bg-gradient-to-r from-rose-500 to-orange-500"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No extra logic needed for cancel view currently
</script>

<style scoped>
.animate-slide-up-reveal {
  animation: slideUpReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpReveal {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
