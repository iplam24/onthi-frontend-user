<template>
  <div class="pb-20 overflow-hidden relative container-standard">
    <!-- Decorative background -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none"></div>
    <div class="absolute top-20 right-[10%] w-96 h-96 bg-indigo-200/20 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-20 left-[10%] w-96 h-96 bg-sky-200/20 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>

    <div class="relative z-10">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-widest mb-6 animate-fade-in">
          <i class="fa-solid fa-rocket"></i> Nâng cấp trải nghiệm học tập
        </div>
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight animate-slide-up">
          Nâng cấp sức mạnh <br class="hidden sm:block"/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">học tập cùng AI</span>
        </h1>
        <p class="text-lg text-slate-500 font-medium max-w-2xl mx-auto animate-slide-up" style="animation-delay: 0.1s">
          Mở khóa toàn bộ sức mạnh của AI, không giới hạn câu hỏi và tiếp cận kho đề thi độc quyền dành riêng cho học viên cao cấp.
        </p>
      </div>

      <!-- Plans Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start max-w-6xl mx-auto">
        <div 
          v-for="(plan, index) in plans" 
          :key="plan.id"
          class="relative group animate-slide-up"
          :style="{ animationDelay: `${0.2 + index * 0.1}s` }"
        >
          <!-- Popular Badge -->
          <div v-if="plan.name === 'ProMax'" class="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
            Khuyên dùng
          </div>

          <div 
            :class="[
              'card-premium p-8 h-full flex flex-col transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl',
              plan.name === 'ProMax' ? 'border-2 border-indigo-500 shadow-xl shadow-indigo-500/10' : 'border border-white hover:border-indigo-200'
            ]"
          >
            <div class="mb-8 text-center md:text-left">
              <div class="flex items-center justify-between mb-4">
                <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:rotate-6 mx-auto md:mx-0', getPlanIconBg(plan.name)]">
                  <i :class="['text-2xl', getPlanIcon(plan.name)]"></i>
                </div>
                <div v-if="currentPlanId === plan.id" class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 hidden md:block">
                  Đang dùng
                </div>
              </div>
              <h3 class="text-2xl font-black text-slate-900 mb-2">{{ plan.name }}</h3>
              <p class="text-sm text-slate-500 font-medium leading-relaxed">{{ getPlanDescription(plan.name) }}</p>
            </div>

            <div class="mb-8 text-center md:text-left">
              <div class="flex items-baseline justify-center md:justify-start gap-1">
                <span class="text-4xl font-black text-slate-900">{{ formatPrice(plan.price) }}đ</span>
                <span class="text-slate-400 font-bold text-sm">/ {{ plan.durationDays }} ngày</span>
              </div>
            </div>

            <div class="flex-1 space-y-4 mb-10">
              <div v-for="feature in getPlanFeatures(plan)" :key="feature.label" class="flex items-start gap-3">
                <div :class="['mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0', feature.included ? 'text-indigo-600' : 'text-slate-300']">
                  <i :class="['text-[10px] fa-solid', feature.included ? 'fa-check' : 'fa-xmark']"></i>
                </div>
                <span :class="['text-sm font-medium', feature.included ? 'text-slate-700' : 'text-slate-400 line-through decoration-slate-200']">
                  {{ feature.label }}
                </span>
              </div>
            </div>

            <div v-if="currentPlanId !== plan.id">
              <button 
                @click="confirmPurchase(plan)"
                :disabled="buying === plan.id || plan.price < currentPlanPrice"
                :class="[
                  'w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2',
                  plan.price < currentPlanPrice
                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100 shadow-none'
                    : plan.name === 'ProMax' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700' 
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10'
                ]"
              >
                <i v-if="buying === plan.id" class="fa-solid fa-circle-notch animate-spin"></i>
                <span v-if="plan.price < currentPlanPrice">Không khả dụng</span>
                <span v-else>{{ buying === plan.id ? 'Đang xử lý...' : (plan.price === 0 ? 'Kích hoạt miễn phí' : 'Mua ngay') }}</span>
              </button>
            </div>
            <div v-else class="h-[52px] flex items-center justify-center border-2 border-dashed border-indigo-100 bg-indigo-50/20 rounded-2xl">
                <span class="text-xs font-black text-indigo-600 uppercase tracking-widest">Gói hiện tại của bạn</span>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ / Info Section -->
      <div class="mt-24 max-w-3xl mx-auto">
        <div class="card-premium p-8 md:p-12 border border-indigo-100 bg-indigo-50/30">
          <h3 class="text-2xl font-black text-slate-900 mb-8 text-center">Tại sao nên nâng cấp?</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-indigo-600">
                <i class="fa-solid fa-brain"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 mb-1">AI thông minh hơn</h4>
                <p class="text-sm text-slate-500 font-medium">Truy cập vào các model AI mới nhất với khả năng giải bài tập chuyên sâu.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-indigo-600">
                <i class="fa-solid fa-infinity"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 mb-1">Không giới hạn</h4>
                <p class="text-sm text-slate-500 font-medium">Làm đề, tạo câu hỏi AI thoải mái mà không lo hết lượt mỗi ngày.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase Confirmation Modal -->
    <Transition name="fade">
      <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click="showConfirmModal = false">
        <div class="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl animate-scale-in" @click.stop>
          <div class="text-center mb-8">
            <div class="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-cart-shopping text-3xl"></i>
            </div>
            <h2 class="text-2xl font-black text-slate-900 mb-2">Xác nhận mua gói</h2>
            <p class="text-slate-500 font-medium">
              Bạn có chắc chắn muốn mua gói <span class="text-indigo-600 font-bold">{{ selectedPlan?.name }}</span> với giá {{ formatPrice(selectedPlan?.price || 0) }}đ?
            </p>
          </div>

          <div class="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <div class="flex justify-between items-center mb-3">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Số dư ví:</span>
              <span class="text-sm font-black text-slate-900">{{ formatPrice(auth.user?.balance || 0) }}đ</span>
            </div>
            <div class="flex justify-between items-center pt-3 border-t border-slate-200">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest text-rose-500">Thanh toán:</span>
              <span class="text-lg font-black text-rose-600">-{{ formatPrice(selectedPlan?.price || 0) }}đ</span>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <button 
              @click="handleBuy"
              :disabled="buying !== null || (auth.user?.balance || 0) < (selectedPlan?.price || 0)"
              class="w-full py-4 rounded-2xl bg-indigo-600 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {{ (auth.user?.balance || 0) < (selectedPlan?.price || 0) ? 'Số dư không đủ' : 'Xác nhận thanh toán' }}
            </button>
            <button 
              @click="showConfirmModal = false"
              class="w-full py-4 rounded-2xl bg-slate-100 text-slate-600 text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Hủy bỏ
            </button>
          </div>
          
          <p v-if="(auth.user?.balance || 0) < (selectedPlan?.price || 0)" class="mt-4 text-center">
            <router-link to="/deposit" class="text-indigo-600 font-bold text-xs hover:underline">
              <i class="fa-solid fa-plus-circle mr-1"></i> Nạp thêm tiền vào ví ngay
            </router-link>
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import apiClient from '@/services/api';

interface Plan {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  maxAiQuestionsPerDay: number;
  hasAiChatbot: boolean;
  hasAiGrading: boolean;
  hasAdvancedStats: boolean;
  hasCustomExams: boolean;
  hasAiHistory: boolean;
  isMentorPlan: boolean;
}

const auth = useAuthStore();
const router = useRouter();
const plans = ref<Plan[]>([]);
const buying = ref<number | null>(null);
const currentPlanId = ref<number | null>(null);
const currentPlanPrice = ref<number>(0);
const showConfirmModal = ref(false);
const selectedPlan = ref<Plan | null>(null);

const formatPrice = (val: number) => new Intl.NumberFormat('vi-VN').format(val);

const getPlanIcon = (name: string) => {
  switch (name) {
    case 'Free': return 'fa-solid fa-seedling';
    case 'Pro': return 'fa-solid fa-rocket';
    case 'ProMax': return 'fa-solid fa-bolt-lightning';
    default: return 'fa-solid fa-star';
  }
};

const getPlanIconBg = (name: string) => {
  switch (name) {
    case 'Free': return 'bg-emerald-100 text-emerald-600';
    case 'Pro': return 'bg-sky-100 text-sky-600';
    case 'ProMax': return 'bg-amber-100 text-amber-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const getPlanDescription = (name: string) => {
  switch (name) {
    case 'Free': return 'Đủ dùng để làm quen với AI.';
    case 'Pro': return 'Học tập chuyên sâu, không giới hạn câu hỏi.';
    case 'ProMax': return 'Đặc quyền tối thượng, AI đồng hành 24/7.';
    default: return '';
  }
};

const getPlanFeatures = (plan: Plan) => {
  return [
    { label: 'Chấm điểm Văn/Tự luận bằng AI', included: plan.hasAiGrading },
    { label: `Hỏi AI: ${plan.maxAiQuestionsPerDay > 999 ? 'Không giới hạn' : plan.maxAiQuestionsPerDay + ' câu/ngày'}`, included: true },
    { label: 'Chatbot giải bài tập chi tiết', included: plan.hasAiChatbot },
    { label: 'Lưu lịch sử hỏi AI', included: plan.hasAiHistory },
    { label: 'AI phân tích & dự đoán điểm thi', included: plan.hasAdvancedStats },
    { label: 'Đặc quyền ưu tiên AI xử lý', included: plan.isMentorPlan },
  ];
};

const fetchPlans = async () => {
  try {
    const res = await apiClient.get('/plans');
    plans.value = res.data?.data || [];
  } catch (err) {
    console.error('Failed to fetch plans:', err);
  }
};

const fetchMyPlan = async () => {
  try {
    const res = await apiClient.get('/plans/my-plan');
    const myPlan = res.data?.data?.plan;
    currentPlanId.value = myPlan?.id || null;
    currentPlanPrice.value = myPlan?.price || 0;
  } catch (err) {
    console.error('Failed to fetch current plan:', err);
  }
};

const confirmPurchase = (plan: Plan) => {
  selectedPlan.value = plan;
  showConfirmModal.value = true;
};

const handleBuy = async () => {
  if (!selectedPlan.value) return;
  buying.value = selectedPlan.value.id;
  try {
    await apiClient.post(`/plans/buy/${selectedPlan.value.id}`);
    showConfirmModal.value = false;
    alert('Mua gói cước thành công! Hệ thống đã kích hoạt quyền lợi mới cho bạn.');
    fetchMyPlan();
    // Update state in store using setUser to ensure persistence
    auth.setUser({
      balance: (auth.user?.balance || 0) - selectedPlan.value.price,
      planName: selectedPlan.value.name
    });
  } catch (err: any) {
    alert(err.response?.data?.message || 'Có lỗi xảy ra khi mua gói.');
  } finally {
    buying.value = null;
  }
};

onMounted(() => {
  fetchPlans();
  if (auth.isAuthenticated) {
    fetchMyPlan();
  }
});
</script>

<style scoped>
.card-premium {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 2.5rem;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.animate-slide-up {
  animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out both;
}

.animate-scale-in {
  animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
