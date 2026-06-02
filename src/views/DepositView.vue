<template>
  <div class="pb-20 overflow-hidden relative container-standard animate-fade-in-up">
    <!-- Decorative background elements -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl -mr-64 -mt-64"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-3xl -ml-64 -mb-64"></div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left Side: Info & Hero -->
        <div class="lg:col-span-5 pt-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-widest mb-6">
            <i class="fa-solid fa-shield-halved"></i> Thanh toán bảo mật PayOS
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Nạp tiền vào <br/> <span class="text-indigo-600">ví V-Edu</span> của bạn.
          </h1>
          <p class="text-lg text-slate-500 font-medium leading-relaxed mb-10">
            Tích lũy số dư để mở khóa các bài thi VIP, mua tài liệu hoặc sử dụng hệ thống chấm bài AI chuyên sâu bất cứ lúc nào.
          </p>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <i class="fa-solid fa-bolt text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-black text-slate-900 mb-1">Xử lý tức thì</h3>
                <p class="text-sm text-slate-500 font-medium">Tiền sẽ được cộng vào ví ngay sau khi thanh toán thành công.</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <i class="fa-solid fa-lock text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-black text-slate-900 mb-1">Bảo mật tuyệt đối</h3>
                <p class="text-sm text-slate-500 font-medium">Giao dịch được mã hóa và xử lý trực tiếp qua cổng thanh toán PayOS.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Deposit Card -->
        <div class="lg:col-span-7">
          <div class="card-premium p-8 md:p-12 border border-white">
            <div class="flex items-center justify-between mb-10">
              <h2 class="text-xl sm:text-2xl font-black text-slate-900">Chọn số tiền nạp</h2>
              <div class="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Số dư hiện tại:</span>
                <span class="text-sm font-black text-slate-900">{{ formatPrice(auth.user?.balance || 0) }}đ</span>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-10">
              <button 
                v-for="pkg in depositPackages" 
                :key="pkg.amount"
                @click="depositAmount = pkg.amount"
                :class="[
                  'relative group p-6 rounded-[2rem] border-2 transition-all duration-300 text-left overflow-hidden',
                  depositAmount === pkg.amount 
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-500/10' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                ]"
              >
                <div v-if="pkg.popular" class="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                  Gợi ý
                </div>
                <p :class="['text-[10px] font-black uppercase tracking-[0.2em] mb-1', depositAmount === pkg.amount ? 'text-indigo-600' : 'text-slate-400']">
                  Mức {{ pkg.label }}
                </p>
                <p class="text-2xl font-black text-slate-900">{{ formatPrice(pkg.amount) }}đ</p>
                <div v-if="depositAmount === pkg.amount" class="absolute bottom-4 right-4 text-indigo-600 animate-bounce-slow">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
              </button>
            </div>

            <div class="mb-10">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Số tiền tùy chỉnh</label>
              <div class="relative group">
                <div class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400 group-focus-within:text-indigo-600 transition-colors">đ</div>
                <input 
                  v-model.number="depositAmount"
                  type="number" 
                  step="1000"
                  class="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl px-12 py-6 text-2xl font-black text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all placeholder:text-slate-300"
                  placeholder="Nhập số tiền..."
                />
              </div>
              <p class="mt-4 text-xs font-medium text-slate-400 italic">
                * Tối thiểu 2.000đ, tối đa 50.000.000đ mỗi lần nạp.
              </p>
            </div>

            <button 
              @click="handleDeposit"
              :disabled="creating || depositAmount < 2000"
              class="w-full relative group overflow-hidden rounded-3xl bg-slate-900 px-8 py-6 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-2xl shadow-slate-900/20"
            >
              <div class="relative z-10 flex items-center justify-center gap-3">
                <i v-if="creating" class="fa-solid fa-circle-notch animate-spin"></i>
                <i v-else class="fa-solid fa-credit-card"></i>
                {{ creating ? 'Đang khởi tạo giao dịch...' : 'Tiến hành thanh toán' }}
              </div>
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <div class="mt-8 flex items-center justify-center gap-6 grayscale opacity-50">
              <img src="https://img.vietqr.io/image/payos-logo.png" alt="PayOS" class="h-6">
              <div class="w-px h-4 bg-slate-200"></div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">An toàn & Bảo mật</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createPayment } from '@/services/paymentService';
import { useAuthStore } from '@/stores/auth';
import { getUserProfile } from '@/services/userService';

import { useToastStore } from '@/stores/toast';

const router = useRouter();
const auth = useAuthStore();
const toast = useToastStore();
const depositAmount = ref(50000);
const creating = ref(false);

const depositPackages = [
  { amount: 20000, label: '20k', popular: false },
  { amount: 50000, label: '50k', popular: true },
  { amount: 100000, label: '100k', popular: false },
  { amount: 200000, label: '200k', popular: false }
];

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

const handleDeposit = async () => {
  if (depositAmount.value < 2000) {
    toast.warning('Số tiền nạp tối thiểu là 2.000đ.');
    return;
  }
  creating.value = true;
  try {
    const res = await createPayment(depositAmount.value);
    const paymentData = res.data?.data;
    if (paymentData) {
      // Save to session storage for persistence
      sessionStorage.setItem('lastPayment', JSON.stringify(paymentData));
      // Navigate to our custom checkout page
      router.push({ 
        name: 'checkout', 
        state: { paymentData } 
      });
    }
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Không thể khởi tạo thanh toán.');
  } finally {
    creating.value = false;
  }
};

onMounted(async () => {
  if (auth.isAuthenticated) {
    try {
      const res = await getUserProfile();
      const profile = res.data?.data;
      if (profile) {
        auth.setUser({
          balance: profile.balance,
          avatar: profile.avatar
        });
      }
    } catch (err) {
      console.warn('Failed to refresh balance in DepositView:', err);
    }
  }
});
</script>

<style scoped>
.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
