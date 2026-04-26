<template>
  <section class="space-y-6">
    <div class="liquid-glass liquid-border px-6 py-6 sm:px-8 sm:py-7">
      <h1 class="m-0 text-2xl font-extrabold text-white sm:text-3xl">Lịch sử làm bài</h1>
      <p class="mb-0 mt-2 text-sm text-blue-100/80 sm:text-base">
        Theo dõi các lần làm bài gần đây, điểm số và trạng thái nộp bài của bạn.
      </p>
    </div>

    <div
      v-if="!auth.isAuthenticated"
      class="liquid-glass liquid-border rounded-2xl border border-amber-300/40 bg-amber-500/10 p-5 text-amber-100"
    >
      Bạn cần đăng nhập để xem lịch sử làm bài.
    </div>

    <div v-else class="liquid-glass liquid-border rounded-2xl p-5">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p class="m-0 text-sm text-blue-100/85">
          Tổng bài làm: <strong class="text-white">{{ pagination.totalElements }}</strong>
        </p>
        <button
          @click="loadAttempts"
          :disabled="loading"
          class="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm font-semibold text-blue-50 transition hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i class="fa-solid fa-rotate-right text-xs" aria-hidden="true"></i>
          Làm mới
        </button>
      </div>

      <p v-if="error" class="rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
        {{ error }}
      </p>

      <p v-else-if="loading" class="text-sm text-blue-100">Đang tải lịch sử bài làm...</p>

      <div v-else-if="!attempts.length" class="text-sm text-blue-100">Bạn chưa có lịch sử làm bài.</div>

      <div v-else class="grid gap-3 md:grid-cols-2">
        <article
          v-for="attempt in attempts"
          :key="attempt.id"
          class="rounded-xl border border-white/20 bg-white/8 p-4"
        >
          <p class="m-0 text-sm font-semibold text-white">
            Bài làm #{{ attempt.id }} - {{ attempt.examTitle || `Đề #${attempt.examId}` }}
          </p>
          <p class="mb-0 mt-2 text-xs text-blue-100/85">
            Trạng thái: {{ attempt.status || 'SUBMITTED' }}
          </p>
          <p class="mb-0 mt-1 text-xs text-blue-100/85">
            Điểm: {{ attempt.score ?? '-' }} | Đúng/Sai: {{ attempt.correctCount ?? 0 }}/{{ attempt.wrongCount ?? 0 }}
          </p>
          <p class="mb-0 mt-1 text-xs text-blue-100/85">
            Tổng câu: {{ attempt.totalQuestions ?? 0 }} | Bắt đầu: {{ formatDate(attempt.startedAt) }}
          </p>
        </article>
      </div>

      <div class="mt-5 flex items-center justify-center gap-2" v-if="pagination.totalPages > 1">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page <= 0 || loading"
          class="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-blue-50 transition hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Trước
        </button>
        <span class="text-sm text-blue-100">Trang {{ pagination.page + 1 }} / {{ pagination.totalPages }}</span>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages - 1 || loading"
          class="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-blue-50 transition hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-60"
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
