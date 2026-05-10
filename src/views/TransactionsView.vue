<template>
  <div class="min-h-screen bg-slate-50 pt-24 pb-20">
    <div class="max-w-5xl mx-auto px-4">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight mb-2">Lịch sử giao dịch</h1>
          <p class="text-slate-500 font-medium">Theo dõi các khoản nạp và chi tiêu trong ví của bạn.</p>
        </div>
        <router-link 
          to="/deposit" 
          class="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-black text-white transition-all hover:bg-indigo-700 active:scale-95 shadow-xl shadow-indigo-500/25"
        >
          <i class="fa-solid fa-plus-circle"></i> Nạp thêm tiền
        </router-link>
      </div>

      <!-- Content -->
      <div class="card-elevated overflow-hidden border border-slate-100">
        <div v-if="loading" class="p-20 flex flex-col items-center justify-center">
          <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-slate-400 font-bold animate-pulse">Đang tải dữ liệu...</p>
        </div>

        <div v-else-if="transactions.length === 0" class="p-20 flex flex-col items-center justify-center text-center">
          <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
            <i class="fa-solid fa-receipt text-4xl text-slate-200"></i>
          </div>
          <h3 class="text-xl font-black text-slate-900 mb-2">Chưa có giao dịch nào</h3>
          <p class="text-slate-500 max-w-xs mx-auto mb-8">Bạn chưa thực hiện giao dịch nào trên hệ thống V-Edu.</p>
          <router-link to="/deposit" class="btn-secondary px-8">Nạp tiền ngay</router-link>
        </div>

        <template v-else>
          <!-- Desktop Table -->
          <div class="hidden sm:block overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/50 border-b border-slate-100">
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Thời gian</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mã giao dịch</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loại</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nội dung</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Số tiền</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-slate-50/30 transition-colors group">
                  <td class="px-8 py-6">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-900">{{ formatDate(tx.createdAt) }}</span>
                      <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{{ formatTime(tx.createdAt) }}</span>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <span class="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">#{{ tx.orderCode || tx.id }}</span>
                  </td>
                  <td class="px-8 py-6">
                    <span class="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <i :class="tx.amount > 0 ? 'fa-solid fa-arrow-down-to-bracket text-emerald-500' : 'fa-solid fa-arrow-up-from-bracket text-rose-500'"></i>
                      {{ tx.amount > 0 ? 'Tiền vào' : 'Tiền ra' }}
                    </span>
                  </td>
                  <td class="px-8 py-6">
                    <p class="m-0 text-sm font-medium text-slate-600 line-clamp-1 group-hover:line-clamp-none transition-all duration-300 max-w-[200px]">
                      {{ tx.description || 'Giao dịch hệ thống' }}
                    </p>
                  </td>
                  <td class="px-8 py-6 text-right">
                    <span :class="['text-base font-black tabular-nums', tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900']">
                      {{ tx.amount > 0 ? '+' : '' }}{{ formatPrice(tx.amount) }}đ
                    </span>
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex justify-center">
                      <span :class="[
                        'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
                        tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 
                        tx.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      ]">
                        {{ formatStatus(tx.status) }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile List -->
          <div class="sm:hidden divide-y divide-slate-100">
            <div v-for="tx in transactions" :key="`mob-${tx.id}`" class="p-5 flex flex-col gap-4 bg-white active:bg-slate-50 transition-colors">
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div :class="['h-10 w-10 flex items-center justify-center rounded-xl', tx.amount > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600']">
                    <i :class="tx.amount > 0 ? 'fa-solid fa-arrow-down-to-bracket' : 'fa-solid fa-arrow-up-from-bracket'"></i>
                  </div>
                  <div>
                    <p class="m-0 text-sm font-black text-slate-900">{{ tx.type === 'DEPOSIT' ? 'Nạp tiền vào ví' : tx.type === 'PURCHASE' ? 'Thanh toán đề thi' : 'Mua gói cước' }}</p>
                    <p class="m-0 text-[11px] font-medium text-slate-500 mt-1">{{ tx.description || 'Giao dịch hệ thống' }}</p>
                    <p class="m-0 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">#{{ tx.orderCode || tx.id }}</p>
                  </div>
                </div>
                <span :class="['text-lg font-black tabular-nums', tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900']">
                  {{ tx.amount > 0 ? '+' : '' }}{{ formatPrice(tx.amount) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="fa-regular fa-clock text-slate-300 text-xs"></i>
                  <span class="text-xs font-bold text-slate-500">{{ formatDate(tx.createdAt) }} {{ formatTime(tx.createdAt) }}</span>
                </div>
                <span :class="[
                  'px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest',
                  tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 
                  tx.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                ]">
                  {{ formatStatus(tx.status) }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- Pagination -->
        <div class="p-6 border-t border-slate-100 flex items-center justify-between bg-white">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Trang {{ pagination.page + 1 }} / {{ pagination.totalPages }}
          </p>
          <div class="flex items-center gap-2">
            <button 
              @click="changePage(pagination.page - 1)" 
              :disabled="pagination.page === 0"
              class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <i class="fa-solid fa-chevron-left text-xs"></i>
            </button>
            <button 
              @click="changePage(pagination.page + 1)" 
              :disabled="pagination.page >= pagination.totalPages - 1"
              class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTransactions } from '@/services/paymentService';

const loading = ref(true);
const transactions = ref<any[]>([]);
const pagination = ref({
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0
});

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const formatStatus = (status: string) => {
  const map: any = {
    'SUCCESS': 'Thành công',
    'PENDING': 'Đang chờ',
    'FAILED': 'Thất bại'
  };
  return map[status] || status;
};

const fetchTransactions = async (page = 0) => {
  loading.value = true;
  try {
    const res = await getTransactions(page, pagination.value.size);
    const rawData = res.data?.data;
    
    if (rawData && Array.isArray(rawData.content)) {
      transactions.value = rawData.content;
      pagination.value.page = rawData.number;
      pagination.value.totalPages = rawData.totalPages;
      pagination.value.totalElements = rawData.totalElements;
    } else if (Array.isArray(rawData)) {
      transactions.value = rawData;
      pagination.value.totalPages = 1;
    } else {
      transactions.value = [];
    }
  } catch (err) {
    console.error('Failed to load transactions', err);
  } finally {
    loading.value = false;
  }
};

const changePage = (newPage: number) => {
  if (newPage >= 0 && newPage < pagination.value.totalPages) {
    fetchTransactions(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(() => {
  fetchTransactions(0);
});
</script>

<style scoped>
.card-elevated {
  background: white;
  border-radius: 2rem;
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.04),
    0 4px 10px -5px rgba(0, 0, 0, 0.02);
}
</style>
