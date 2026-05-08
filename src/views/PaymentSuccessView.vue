<template>
  <div class="min-h-[80vh] flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-slate-100 overflow-hidden animate-slide-up-reveal">
      <div class="p-8 sm:p-12 text-center">
        <!-- Success Icon Animation -->
        <div class="relative mx-auto w-24 h-24 mb-8">
          <div class="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25"></div>
          <div class="relative flex items-center justify-center w-full h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30">
            <i class="fa-solid fa-check text-4xl text-white"></i>
          </div>
        </div>

        <h1 class="text-3xl font-black text-slate-900 mb-4 tracking-tight">Thanh toán thành công!</h1>
        <p class="text-slate-500 font-medium mb-8 leading-relaxed">
          Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của <span class="text-indigo-600 font-bold">V-Edu</span>. Giao dịch của bạn đã được xử lý hoàn tất.
        </p>

        <!-- Transaction Details -->
        <div v-if="loading" class="space-y-4 py-6 border-y border-slate-50">
          <div class="h-4 bg-slate-100 rounded animate-pulse w-3/4 mx-auto"></div>
          <div class="h-4 bg-slate-100 rounded animate-pulse w-1/2 mx-auto"></div>
        </div>
        
        <div v-else-if="paymentInfo" class="bg-slate-50 rounded-3xl p-6 mb-8 text-left space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Mã đơn hàng</span>
            <span class="text-sm font-black text-slate-700 tabular-nums">#{{ paymentInfo.orderCode }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Số tiền</span>
            <span class="text-lg font-black text-emerald-600 tabular-nums">{{ formatPrice(paymentInfo.amount) }}đ</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Trạng thái</span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              {{ paymentInfo.status === 'PAID' ? 'Đã thanh toán' : paymentInfo.status }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid gap-4">
          <router-link to="/profile" class="btn-primary py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/25">
            Quay lại trang cá nhân
          </router-link>
          <router-link to="/" class="btn-secondary py-4 text-xs font-black uppercase tracking-[0.2em]">
            Về trang chủ
          </router-link>
        </div>
      </div>
      
      <!-- Footer Decor -->
      <div class="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getPaymentStatus } from '@/services/paymentService';

const route = useRoute();
const loading = ref(true);
const paymentInfo = ref<any>(null);

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

onMounted(async () => {
  const orderCode = route.query.orderCode as string;
  if (orderCode) {
    let retries = 0;
    const maxRetries = 5;
    
    const checkStatus = async () => {
      try {
        const response = await getPaymentStatus(orderCode);
        paymentInfo.value = response.data.data;
        
        // Nếu chưa PAID thì đợi 2s rồi thử lại (tối đa 5 lần)
        if (paymentInfo.value.status !== 'PAID' && retries < maxRetries) {
          retries++;
          setTimeout(checkStatus, 2000);
        } else {
          loading.value = false;
        }
      } catch (error) {
        console.error('Error fetching payment status:', error);
        loading.value = false;
      }
    };
    
    checkStatus();
  } else {
    loading.value = false;
  }
});
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
