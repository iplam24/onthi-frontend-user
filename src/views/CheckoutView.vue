<template>
  <div class="min-h-screen bg-slate-50 pt-24 pb-20 overflow-hidden relative">
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl -mr-80 -mt-80"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-3xl -ml-80 -mb-80"></div>

    <div class="max-w-4xl mx-auto px-4 relative z-10">
      <div v-if="!paymentData" class="text-center py-20">
        <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fa-solid fa-circle-exclamation text-3xl"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900 mb-4">Không tìm thấy thông tin thanh toán</h2>
        <router-link to="/deposit" class="rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-black text-white transition-all hover:bg-indigo-700 active:scale-95 inline-flex">Quay lại trang nạp tiền</router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <!-- Left Column: Bank Info -->
        <div class="flex flex-col gap-6">
          <div class="card-checkout p-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <i class="fa-solid fa-university text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-black text-slate-900 leading-tight">Thông tin chuyển khoản</h3>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Quét mã hoặc chuyển tay</p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="relative group">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Ngân hàng</p>
                <div class="flex items-center justify-between">
                  <p class="text-sm font-black text-slate-900">{{ getBankInfo(paymentData.bin).name }}</p>
                  <img :src="`https://api.vietqr.io/img/${getBankInfo(paymentData.bin).code}.png`" alt="Bank Logo" class="h-8 w-auto object-contain">
                </div>
              </div>

              <div class="relative group">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Chủ tài khoản</p>
                <div class="flex items-center justify-between">
                  <p class="text-sm font-black text-slate-900 uppercase tracking-wide">{{ paymentData.accountName }}</p>
                </div>
              </div>

              <div class="relative group">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Số tài khoản</p>
                <div class="flex items-center justify-between">
                  <p class="text-xl font-black text-indigo-600 tabular-nums tracking-wider">{{ paymentData.accountNumber }}</p>
                  <button @click="copyText(paymentData.accountNumber)" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all active:scale-90">
                    <i class="fa-solid fa-copy text-xs"></i>
                  </button>
                </div>
              </div>

              <div class="relative group">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Số tiền</p>
                <div class="flex items-center justify-between">
                  <p class="text-xl font-black text-slate-900 tabular-nums">{{ formatPrice(paymentData.amount) }}đ</p>
                  <button @click="copyText(paymentData.amount.toString())" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all active:scale-90">
                    <i class="fa-solid fa-copy text-xs"></i>
                  </button>
                </div>
              </div>

              <div class="relative group">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nội dung</p>
                <div class="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <p class="text-sm font-black text-amber-700 tracking-wide">{{ paymentData.description }}</p>
                  <button @click="copyText(paymentData.description)" class="w-8 h-8 rounded-lg bg-white text-amber-400 hover:bg-amber-600 hover:text-white transition-all active:scale-90 shadow-sm">
                    <i class="fa-solid fa-copy text-xs"></i>
                  </button>
                </div>
                <p class="mt-2 text-[10px] font-bold text-amber-600 flex items-center gap-1.5 leading-relaxed">
                  <i class="fa-solid fa-triangle-exclamation animate-pulse"></i>
                  Lưu ý: Chuyển chính xác nội dung để được cộng tiền tự động.
                </p>
              </div>
            </div>
          </div>

          <div class="card-checkout p-6 bg-slate-900 border-none shadow-indigo-900/10">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 animate-pulse">
                <i class="fa-solid fa-clock"></i>
              </div>
              <div class="flex-1">
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đang chờ thanh toán</p>
                <p class="text-sm font-bold text-white mt-0.5">Hệ thống sẽ cập nhật sau 3-5s</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-black text-indigo-400 tabular-nums">{{ timeLeft }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: QR Code -->
        <div class="card-checkout p-8 flex flex-col items-center justify-center text-center bg-white border-2 border-indigo-50 border-dashed">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Mở ứng dụng Ngân hàng / Ví để quét</p>
          
          <div class="relative p-4 bg-white rounded-3xl shadow-2xl border border-slate-100 mb-8 overflow-hidden group">
            <!-- Animated corner borders -->
            <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-600 rounded-tl-2xl"></div>
            <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-600 rounded-tr-2xl"></div>
            <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-600 rounded-bl-2xl"></div>
            <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-600 rounded-br-2xl"></div>
            
            <img 
              :src="`https://img.vietqr.io/image/${paymentData.bin}-${paymentData.accountNumber.replace('/', '')}-qr_only.png?amount=${paymentData.amount}&addInfo=${paymentData.description}&accountName=${paymentData.accountName}`" 
              alt="VietQR" 
              class="w-full max-w-[280px] h-auto rounded-xl relative z-10"
            >
            
            <div class="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-[2px]">
              <i class="fa-solid fa-expand text-4xl text-indigo-600 animate-bounce"></i>
            </div>
          </div>

          <div class="space-y-4 w-full">
            <div class="flex items-center justify-center gap-3 grayscale opacity-40">
              <span class="text-[10px] font-black text-slate-400 tracking-tighter">PAYOS</span>
              <div class="w-px h-3 bg-slate-300"></div>
              <span class="text-[10px] font-black text-slate-400 tracking-tighter">NAPAS247</span>
            </div>
            <button 
              @click="cancelPayment" 
              class="w-full text-xs font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest pt-4"
            >
              Hủy yêu cầu thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Feedback (Overlay) -->
    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 scale-90 backdrop-blur-0"
      enter-to-class="opacity-100 scale-100 backdrop-blur-xl"
    >
      <div v-if="paid" class="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-2xl p-4">
        <div class="text-center max-w-sm animate-scale-in">
          <div class="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
            <i class="fa-solid fa-check text-5xl"></i>
          </div>
          <h2 class="text-3xl font-black text-slate-900 mb-4 tracking-tight">Thành công!</h2>
          <p class="text-slate-500 font-medium mb-10 leading-relaxed">Tiền đã được cộng vào ví của bạn. Bắt đầu trải nghiệm ngay thôi!</p>
          <router-link to="/profile" class="rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-black text-white transition-all hover:bg-indigo-700 active:scale-95 w-full shadow-2xl shadow-indigo-500/30">Về trang cá nhân</router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { getPaymentStatus } from '@/services/paymentService';

const router = useRouter();
const paymentData = ref<any>(null);
const paid = ref(false);
const timeLeft = ref('15:00');
const timerInterval = ref<any>(null);
const pollingInterval = ref<any>(null);

const getBankInfo = (bin: string) => {
  const banks: any = {
    '970415': { name: 'VietinBank', code: 'CTG' },
    '970422': { name: 'MB Bank', code: 'MB' },
    '970436': { name: 'Vietcombank', code: 'VCB' },
    '970418': { name: 'BIDV', code: 'BIDV' },
    '970405': { name: 'Agribank', code: 'VBA' },
    '970423': { name: 'TPBank', code: 'TPB' },
    '970416': { name: 'ACB', code: 'ACB' },
    '970432': { name: 'VPBank', code: 'VPB' },
    '970407': { name: 'Techcombank', code: 'TCB' }
  };
  return banks[bin] || { name: 'Ngân hàng thụ hưởng', code: 'BANK' };
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
  // Optional: Add a toast notification here
};

const startTimer = () => {
  if (timerInterval.value) clearInterval(timerInterval.value);
  
  const updateTimer = () => {
    const now = Math.floor(Date.now() / 1000);
    const expiredAt = paymentData.value.expiredAt;
    const diff = expiredAt - now;
    
    if (diff <= 0) {
      timeLeft.value = '00:00';
      clearInterval(timerInterval.value);
      alert('Giao dịch đã hết hạn.');
      router.push('/deposit');
      return;
    }
    
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    timeLeft.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  updateTimer(); // Run once immediately
  timerInterval.value = setInterval(updateTimer, 1000);
};

const startPolling = () => {
  pollingInterval.value = setInterval(async () => {
    try {
      const res = await getPaymentStatus(paymentData.value.orderCode);
      const status = res.data?.data?.status;
      if (status === 'PAID') {
        paid.value = true;
        clearInterval(pollingInterval.value);
        clearInterval(timerInterval.value);
      }
    } catch (err) {
      console.warn('Polling error:', err);
    }
  }, 3000); // Check every 3 seconds
};

const cancelPayment = () => {
  if (confirm('Bạn có chắc chắn muốn hủy giao dịch này?')) {
    router.push('/deposit');
  }
};

onMounted(() => {
  // Get data from router state
  const state = window.history.state;
  console.log('[DEBUG] Router State:', state);
  if (state?.paymentData) {
    paymentData.value = state.paymentData;
    console.log('[DEBUG] Payment Data loaded from state:', paymentData.value);
    startTimer();
    startPolling();
  } else {
    // Attempt to get from session storage or fallback
    const saved = sessionStorage.getItem('lastPayment');
    if (saved) {
      paymentData.value = JSON.parse(saved);
      console.log('[DEBUG] Payment Data loaded from session:', paymentData.value);
      startTimer();
      startPolling();
    }
  }
});

onBeforeUnmount(() => {
  if (timerInterval.value) clearInterval(timerInterval.value);
  if (pollingInterval.value) clearInterval(pollingInterval.value);
});
</script>

<style scoped>
.card-checkout {
  background: white;
  border-radius: 2.5rem;
  box-shadow: 
    0 15px 35px -10px rgba(0, 0, 0, 0.05),
    0 5px 15px -5px rgba(0, 0, 0, 0.02);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
