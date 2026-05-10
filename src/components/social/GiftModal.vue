<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="close"></div>
        
        <div class="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <!-- Header -->
          <div class="bg-indigo-600 p-8 text-white relative">
            <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
            <h3 class="m-0 text-2xl font-black">Tặng quà cho {{ receiverName }}</h3>
            <p class="m-0 mt-1 text-indigo-100 text-sm font-medium">Lan tỏa niềm vui và sự khích lệ</p>
          </div>

          <!-- Body -->
          <div class="p-8 space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Số tiền muốn tặng (đ)</label>
              <div class="relative">
                <input 
                  v-model.number="amount" 
                  type="number" 
                  placeholder="Ví dụ: 10000" 
                  class="input-primary w-full pl-10"
                />
                <i class="fa-solid fa-coins absolute left-4 top-1/2 -translate-y-1/2 text-amber-500"></i>
              </div>
              <p class="text-[10px] text-slate-400 font-bold">Số dư hiện tại: {{ formatPrice(balance) }}đ</p>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Lời nhắn nhủ</label>
              <textarea 
                v-model="message" 
                rows="3" 
                placeholder="Chúc bạn học tốt nhé!..." 
                class="input-primary w-full resize-none"
              ></textarea>
            </div>

            <div v-if="error" class="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold flex items-center gap-2">
              <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
            </div>

            <div class="flex gap-3 pt-2">
              <button @click="close" class="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                Hủy bỏ
              </button>
              <button 
                @click="handleSend" 
                :disabled="loading || !amount || amount <= 0" 
                class="flex-[2] btn-primary bg-indigo-600 px-6 py-3 shadow-lg shadow-indigo-500/25"
              >
                <i v-if="loading" class="fa-solid fa-circle-notch animate-spin mr-2"></i>
                <i v-else class="fa-solid fa-gift mr-2"></i>
                {{ loading ? 'Đang gửi...' : 'Gửi quà ngay' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { socialService } from '@/services/socialService';

const props = defineProps<{
  isOpen: boolean;
  receiverId: number;
  receiverName: string;
  balance: number;
}>();

const emit = defineEmits(['close', 'success']);

const amount = ref<number | null>(null);
const message = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

const formatPrice = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

const close = () => {
  amount.value = null;
  message.value = '';
  error.value = null;
  emit('close');
};

const handleSend = async () => {
  if (!amount.value || amount.value <= 0) return;
  if (amount.value > props.balance) {
    error.value = 'Số dư ví không đủ!';
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    await socialService.sendGift(props.receiverId, amount.value, message.value);
    emit('success');
    close();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra khi gửi quà.';
  } finally {
    loading.value = false;
  }
};
</script>
