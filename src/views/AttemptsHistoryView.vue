<template>
  <section class="space-y-6 max-w-5xl mx-auto px-2 sm:px-4" style="animation: slide-up 600ms cubic-bezier(0.16,1,0.3,1) both">
    <div class="relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 p-8 sm:p-12 shadow-2xl shadow-blue-500/5">
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-50 blur-3xl opacity-50 animate-pulse"></div>
      <div class="relative flex flex-wrap gap-6 items-center justify-between">
        <div>
          <h1 class="m-0 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">Lịch sử rèn luyện</h1>
          <p class="mb-0 mt-4 text-sm font-black uppercase tracking-[0.2em] text-blue-400">
            Hành trình chinh phục tri thức của bạn
          </p>
        </div>
        <div class="h-16 w-16 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
          <i class="fa-solid fa-clock-rotate-left text-2xl"></i>
        </div>
      </div>
    </div>

    <div
      v-if="!auth.isAuthenticated"
      class="animate-slide-up-reveal card-elevated px-6 py-24 text-center bg-white rounded-[2.5rem] border-slate-100 shadow-2xl shadow-blue-500/5"
    >
      <div class="relative inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 mb-6">
        <div class="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl animate-pulse"></div>
        <i class="fa-solid fa-user-lock text-blue-500 text-3xl relative z-10"></i>
      </div>
      <h2 class="m-0 text-2xl font-black text-slate-900">Đăng nhập để xem lịch sử</h2>
      <p class="mb-0 mt-3 text-sm font-medium text-slate-400 max-w-md mx-auto leading-relaxed">
        Bạn cần đăng nhập để theo dõi quá trình rèn luyện của mình.
      </p>
    </div>

    <div v-else class="space-y-8">
      <div class="flex flex-wrap items-center justify-between gap-6 px-4">
        <p class="m-0 text-xs font-black uppercase tracking-widest text-slate-400">
          Tổng cộng: <strong class="text-blue-600 text-base">{{ pagination.totalElements }}</strong> bài làm
        </p>
        <button
          @click="loadAttempts"
          :disabled="loading"
          class="inline-flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 shadow-sm transition hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
        >
          <i class="fa-solid fa-rotate-right text-xs" :class="{'animate-spin': loading}"></i>
          Làm mới
        </button>
      </div>

      <p v-if="error" class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
        {{ error }}
      </p>

      <p v-else-if="loading" class="text-sm text-slate-500 text-center py-8">Đang tải lịch sử bài làm...</p>

      <div v-else-if="!attempts.length" class="text-sm text-slate-500 text-center py-8">Bạn chưa có lịch sử làm bài.</div>

      <div v-else class="grid gap-6 md:grid-cols-2">
        <article
          v-for="(attempt, idx) in attempts"
          :key="attempt.id"
          class="animate-slide-up-reveal group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5"
          :style="{ animationDelay: `${idx * 50}ms` }"
        >
          <div class="flex items-start justify-between gap-4 mb-6">
            <div class="min-w-0">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1 block">Bài làm #{{ attempt.id }}</span>
              <h3 class="m-0 text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                {{ attempt.examTitle || `Đề #${attempt.examId}` }}
              </h3>
            </div>
            <span class="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
              :class="attempt.status === 'SUBMITTED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'">
              {{ attempt.status || 'SUBMITTED' }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-2xl bg-slate-50/50 p-4 transition-colors group-hover:bg-blue-50/30">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Điểm số</span>
              <span class="text-2xl font-black text-blue-600">{{ attempt.score ?? '-' }}</span>
            </div>
            <div class="rounded-2xl bg-slate-50/50 p-4 transition-colors group-hover:bg-emerald-50/30">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Đúng / Sai</span>
              <div class="flex items-center gap-2">
                <span class="text-xl font-black text-emerald-500">{{ attempt.correctCount ?? 0 }}</span>
                <span class="text-slate-300">/</span>
                <span class="text-xl font-black text-rose-400">{{ attempt.wrongCount ?? 0 }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between pt-6 border-t border-slate-50">
            <div class="flex items-center gap-3 text-slate-400">
              <i class="fa-regular fa-calendar text-sm"></i>
              <span class="text-xs font-bold">{{ formatDate(attempt.startedAt) }}</span>
            </div>
            <router-link
              :to="`/attempts/${attempt.id}/review`"
              class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition-all duration-300 group-hover:bg-blue-600 group-hover:scale-110 active:scale-90"
              title="Xem chi tiết"
            >
              <i class="fa-solid fa-arrow-right-long"></i>
            </router-link>
          </div>
        </article>
      </div>

      <div class="mt-6 flex items-center justify-center gap-4" v-if="pagination.totalPages > 1">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page <= 0 || loading"
          class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Trước
        </button>
        <span class="text-sm font-medium text-slate-600">Trang {{ pagination.page + 1 }} / {{ pagination.totalPages }}</span>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages - 1 || loading"
          class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sau
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getMyAttempts } from '@/services/attemptService';

type AttemptItem = {
  id: number;
  examId: number;
  examTitle?: string;
  status?: string;
  score?: number;
  correctCount?: number;
  wrongCount?: number;
  totalQuestions?: number;
  startedAt?: string;
  submittedAt?: string;
};

const auth = useAuthStore();

const loading = ref(false);
const error = ref<string | null>(null);
const attempts = ref<AttemptItem[]>([]);

const pagination = reactive({
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
});

const formatDate = (value?: string) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('vi-VN');
};

const loadAttempts = async () => {
  if (!auth.isAuthenticated) {
    attempts.value = [];
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await getMyAttempts({
      page: pagination.page,
      size: pagination.size,
      sort: 'startedAt,DESC',
    });

    const payload = response.data?.data ?? {};
    attempts.value = Array.isArray(payload.items) ? payload.items : [];
    pagination.totalPages = Number(payload.totalPages ?? 0);
    pagination.totalElements = Number(payload.totalElements ?? attempts.value.length);
  } catch (err) {
    error.value = 'Không thể tải lịch sử bài làm. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};

const changePage = (newPage: number) => {
  if (newPage < 0 || (pagination.totalPages && newPage >= pagination.totalPages)) {
    return;
  }

  pagination.page = newPage;
  loadAttempts();
};

onMounted(() => {
  loadAttempts();
});
</script>
