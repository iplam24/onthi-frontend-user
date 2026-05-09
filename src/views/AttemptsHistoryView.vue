<template>
  <section class="space-y-10 max-w-5xl mx-auto px-2 sm:px-4" style="animation: slide-up 650ms cubic-bezier(0.16,1,0.3,1) both">

    <!-- Header with illustration -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100/80 p-8 sm:p-12 shadow-xl shadow-slate-200/20">
      <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-50/60 blur-3xl"></div>
      <div class="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
        <div class="flex-1 min-w-0">
          <div class="inline-flex items-center gap-2.5 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-indigo-600 mb-5">
            <i class="fa-solid fa-clock-rotate-left text-[10px]"></i>
            Lịch sử rèn luyện
          </div>
          <h1 class="m-0 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Hành trình học tập</h1>
          <p class="mb-0 mt-3 text-sm font-medium text-slate-500 leading-relaxed max-w-md">
            Theo dõi tiến trình chinh phục tri thức của bạn qua từng bài thi.
          </p>
          <div v-if="auth.isAuthenticated" class="mt-6 flex">
            <router-link to="/evaluation" class="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-500/30">
               <i class="fa-solid fa-chart-pie text-white/90"></i>
               Xem báo cáo phân tích năng lực
            </router-link>
          </div>
        </div>
        <div class="shrink-0 hidden sm:block">
          <img 
            src="@/asset/illustrations/history-tracking.png" 
            alt="History tracking" 
            class="h-36 w-auto drop-shadow-lg animate-float-slow"
          />
        </div>
      </div>
    </div>

    <!-- Not authenticated -->
    <div
      v-if="!auth.isAuthenticated"
      class="animate-slide-up-reveal card-elevated px-6 py-20 text-center"
    >
      <div class="relative inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 mb-6">
        <i class="fa-solid fa-user-lock text-indigo-400 text-3xl"></i>
      </div>
      <h2 class="m-0 text-2xl font-extrabold text-slate-900">Đăng nhập để xem lịch sử</h2>
      <p class="mb-0 mt-3 text-sm font-medium text-slate-500 max-w-md mx-auto">
        Bạn cần đăng nhập để theo dõi quá trình rèn luyện của mình.
      </p>
    </div>

    <div v-else class="space-y-8">
      <!-- Filter Bar -->
      <div class="card-elevated p-4 sm:p-6 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Keyword -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Tìm đề thi</label>
            <div class="relative">
              <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input v-model="filters.keyword" type="text" placeholder="Nhập tên đề..." @keyup.enter="applyFilters" class="input-primary pl-9 text-sm" />
            </div>
          </div>
          <!-- Level -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Khối/Lớp</label>
            <select v-model="filters.levelId" @change="onLevelChange" class="input-primary text-sm appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTRhM2I4Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10">
              <option :value="undefined">Tất cả khối</option>
              <option v-for="l in levels" :key="l.id" :value="l.id">{{ l.name }}</option>
            </select>
          </div>
          <!-- Subject -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Môn học</label>
            <select v-model="filters.subjectId" @change="applyFilters" class="input-primary text-sm appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTRhM2I4Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10">
              <option :value="undefined">Tất cả môn</option>
              <option v-for="s in filteredSubjects" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <!-- Status -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Trạng thái</label>
            <select v-model="filters.status" @change="applyFilters" class="input-primary text-sm appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTRhM2I4Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10">
              <option :value="undefined">Tất cả</option>
              <option value="SUBMITTED">Đã nộp</option>
              <option value="DOING">Đang làm</option>
              <option value="EXPIRED">Quá hạn</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-50">
           <!-- From Date -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Từ ngày</label>
            <input v-model="filters.from" type="date" @change="applyFilters" class="input-primary text-sm" />
          </div>
          <!-- To Date -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Đến ngày</label>
            <input v-model="filters.to" type="date" @change="applyFilters" class="input-primary text-sm" />
          </div>
          <div class="sm:col-span-2 flex items-end justify-end gap-3 mt-4 sm:mt-0">
             <button @click="resetFilters" class="flex-1 sm:flex-none btn-secondary text-[10px] font-extrabold px-4">Xóa lọc</button>
             <button @click="applyFilters" :disabled="loading" class="flex-1 sm:flex-none btn-primary text-[10px] font-extrabold px-6">
                <i class="fa-solid fa-filter text-[10px] mr-1" :class="{'animate-pulse': loading}"></i>
                Lọc kết quả
             </button>
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="flex flex-wrap items-center justify-between gap-6 px-2">
        <p class="m-0 text-sm font-medium text-slate-500">
          Tổng cộng <strong class="text-indigo-600 font-extrabold">{{ pagination.totalElements }}</strong> bài làm
        </p>
        <button @click="loadAttempts" :disabled="loading" class="btn-secondary text-xs font-extrabold uppercase tracking-widest">
          <i class="fa-solid fa-rotate-right text-xs" :class="{'animate-spin': loading}"></i>
          Làm mới
        </button>
      </div>

      <!-- Error -->
      <p v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm font-bold text-rose-700">
        <i class="fa-solid fa-circle-exclamation mr-2"></i>{{ error }}
      </p>

      <!-- Loading -->
      <div v-else-if="loading" class="space-y-5">
        <div v-for="i in 4" :key="i" class="h-40 w-full bg-slate-50 rounded-[2rem] animate-pulse border border-slate-100/50"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="!attempts.length" class="card-elevated px-6 py-20 text-center">
        <div class="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 mb-6 text-slate-200">
          <i class="fa-solid fa-inbox text-4xl"></i>
        </div>
        <h3 class="m-0 text-xl font-extrabold text-slate-900">Chưa có lịch sử</h3>
        <p class="text-sm font-medium text-slate-500 mt-2 m-0">Bạn chưa làm bài thi nào. Hãy bắt đầu ngay!</p>
        <router-link to="/exams" class="mt-6 btn-primary inline-flex">
          <i class="fa-solid fa-rocket text-xs"></i>
          Thi thử ngay
        </router-link>
      </div>

      <!-- History List -->
      <div v-else class="space-y-5">
        <article
          v-for="(attempt, idx) in attempts"
          :key="attempt.id"
          class="animate-slide-up-reveal group relative overflow-hidden rounded-[2rem] border bg-white transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
          :class="getScoreBorder(attempt.score)"
          :style="{ animationDelay: `${idx * 50}ms` }"
        >
          <!-- Score accent -->
          <div class="absolute top-0 left-0 right-0 h-[3px]" :class="getScoreBar(attempt.score)"></div>

          <div class="flex flex-col sm:flex-row items-stretch">
            <!-- Score Panel -->
            <div class="flex items-center justify-center sm:w-32 shrink-0 p-4 sm:p-6 sm:border-r border-b sm:border-b-0 transition-colors duration-500" :class="getScorePanelBg(attempt.score, attempt.status)">
              <div class="text-center">
                <span v-if="attempt.status === 'GRADING'" class="block text-2xl sm:text-3xl font-extrabold text-indigo-500 animate-pulse">
                  <i class="fa-solid fa-pen-to-square"></i>
                </span>
                <span v-else class="block text-3xl sm:text-4xl font-extrabold tabular-nums" :class="getScoreTextColor(attempt.score)">{{ attempt.score ?? '-' }}</span>
                <span class="block text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mt-1">Điểm</span>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 p-5 sm:p-7 flex flex-col justify-between gap-4">
              <div>
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 mb-2" v-if="attempt.subjectName || attempt.subjectLevelName">
                       <span v-if="attempt.subjectLevelName" class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">{{ attempt.subjectLevelName }}</span>
                       <span v-if="attempt.subjectName" class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-black text-indigo-600">{{ attempt.subjectName }}</span>
                    </div>
                    <h3 class="m-0 text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      <MathContent :content="attempt.examTitle || `Đề thi #${attempt.examId}`" />
                    </h3>
                    <p class="mt-1.5 m-0 text-xs font-medium text-slate-400 flex items-center gap-2">
                      <i class="fa-regular fa-calendar text-[10px]"></i>
                      {{ formatDate(attempt.startedAt) }}
                    </p>
                  </div>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap"
                    :class="[
                      attempt.status === 'SUBMITTED' ? 'bg-emerald-50 text-emerald-600' : 
                      attempt.status === 'DOING' ? 'bg-amber-50 text-amber-600' : 
                      attempt.status === 'GRADING' ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200 shadow-sm' : 
                      'bg-slate-50 text-slate-400'
                    ]">
                    <span class="h-1.5 w-1.5 rounded-full" 
                      :class="[
                        attempt.status === 'SUBMITTED' ? 'bg-emerald-500' : 
                        attempt.status === 'DOING' ? 'bg-amber-500' : 
                        attempt.status === 'GRADING' ? 'bg-indigo-500 animate-pulse' : 
                        'bg-slate-300'
                      ]"></span>
                    {{ 
                      attempt.status === 'SUBMITTED' ? 'Đã nộp' : 
                      attempt.status === 'DOING' ? 'Đang làm' : 
                      attempt.status === 'GRADING' ? 'Đang chấm bài' : 
                      (attempt.status || 'N/A') 
                    }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-5 text-sm font-bold">
                  <span class="text-emerald-600 flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-check text-[10px]"></i>
                    {{ attempt.correctCount ?? 0 }} đúng
                  </span>
                  <span class="text-rose-500 flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-xmark text-[10px]"></i>
                    {{ attempt.wrongCount ?? 0 }} sai
                  </span>
                </div>
                <router-link
                  :to="`/attempts/${attempt.id}/review`"
                  class="group/btn inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-white transition-all duration-300 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                >
                  Chi tiết
                  <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover/btn:translate-x-0.5"></i>
                </router-link>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-center gap-2" v-if="pagination.totalPages > 1">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page <= 0 || loading"
          class="btn-secondary px-4 py-2.5 text-xs font-extrabold"
        >
          <i class="fa-solid fa-chevron-left text-[10px]"></i>
          Trước
        </button>
        <span class="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-extrabold text-white shadow-md shadow-indigo-500/15 tabular-nums">
          {{ pagination.page + 1 }}
        </span>
        <span class="text-sm font-bold text-slate-300 px-1">/</span>
        <span class="text-sm font-bold text-slate-500 tabular-nums">{{ pagination.totalPages }}</span>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages - 1 || loading"
          class="btn-secondary px-4 py-2.5 text-xs font-extrabold"
        >
          Sau
          <i class="fa-solid fa-chevron-right text-[10px]"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getMyAttempts, type AttemptHistoryItem, type AttemptFilterParams } from '@/services/attemptService';
import { getLevels, getSubjects, type LevelItem, type SubjectItem } from '@/services/learningService';
import MathContent from '@/components/common/MathContent.vue';

const auth = useAuthStore();
const loading = ref(false);
const error = ref<string | null>(null);
const attempts = ref<AttemptHistoryItem[]>([]);
const pagination = reactive({ page: 0, size: 10, totalPages: 0, totalElements: 0 });

const levels = ref<LevelItem[]>([]);
const subjects = ref<SubjectItem[]>([]);

const filters = reactive<AttemptFilterParams>({
  keyword: undefined,
  levelId: undefined,
  subjectId: undefined,
  status: undefined,
  from: undefined,
  to: undefined
});

const filteredSubjects = computed(() => {
  if (!filters.levelId) return subjects.value;
  return subjects.value.filter(s => s.levelId === filters.levelId);
});

const onLevelChange = () => {
  filters.subjectId = undefined; // Reset subject when level changes
  applyFilters();
};

const applyFilters = () => {
  pagination.page = 0;
  loadAttempts();
};

const resetFilters = () => {
  filters.keyword = undefined;
  filters.levelId = undefined;
  filters.subjectId = undefined;
  filters.status = undefined;
  filters.from = undefined;
  filters.to = undefined;
  applyFilters();
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('vi-VN');
};

const getScoreTextColor = (score?: number) => {
  if (score == null) return 'text-slate-300';
  if (score >= 8) return 'text-emerald-600';
  if (score >= 6.5) return 'text-indigo-600';
  if (score >= 5) return 'text-amber-600';
  return 'text-rose-600';
};

const getScoreBorder = (score?: number) => {
  if (score == null) return 'border-slate-100';
  if (score >= 8) return 'border-emerald-100 hover:border-emerald-200';
  if (score >= 6.5) return 'border-indigo-100 hover:border-indigo-200';
  if (score >= 5) return 'border-amber-100 hover:border-amber-200';
  return 'border-rose-100 hover:border-rose-200';
};

const getScoreBar = (score?: number) => {
  if (score == null) return 'bg-gradient-to-r from-slate-200 to-slate-100';
  if (score >= 8) return 'bg-gradient-to-r from-emerald-400 to-emerald-300';
  if (score >= 6.5) return 'bg-gradient-to-r from-indigo-400 to-indigo-300';
  if (score >= 5) return 'bg-gradient-to-r from-amber-400 to-amber-300';
  return 'bg-gradient-to-r from-rose-400 to-rose-300';
};

const getScorePanelBg = (score?: number, status?: string) => {
  if (status === 'GRADING') return 'bg-indigo-50/30';
  if (score == null) return 'bg-slate-50/50';
  if (score >= 8) return 'bg-emerald-50/50';
  if (score >= 6.5) return 'bg-indigo-50/50';
  if (score >= 5) return 'bg-amber-50/50';
  return 'bg-rose-50/50';
};

const loadFiltersData = async () => {
  try {
    const [lRes, sRes] = await Promise.all([getLevels(), getSubjects()]);
    levels.value = lRes.data?.data || [];
    subjects.value = sRes.data?.data || [];
  } catch (err) {
    console.error('Failed to load filter metadata', err);
  }
};

const loadAttempts = async () => {
  if (!auth.isAuthenticated) { attempts.value = []; return; }
  loading.value = true; error.value = null;
  try {
    // Format date specifically for from/to if needed, usually simple string works if API accepts 'YYYY-MM-DD'
    const queryParams: Record<string, any> = { 
      page: pagination.page, 
      size: pagination.size, 
      sort: 'startedAt,DESC',
      ...filters 
    };

    // Remove empty/undefined filters
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === undefined || queryParams[key] === null || queryParams[key] === '') {
        delete queryParams[key];
      }
    });
    
    // API from and to might need time postfix if it's purely date from input type date.
    // E.g. from="2026-05-01T00:00:00"
    if (queryParams.from && !queryParams.from.includes('T')) {
      queryParams.from = `${queryParams.from}T00:00:00`;
    }
    if (queryParams.to && !queryParams.to.includes('T')) {
      queryParams.to = `${queryParams.to}T23:59:59`;
    }

    const response = await getMyAttempts(queryParams);
    const payload = response.data?.data ?? {};
    attempts.value = Array.isArray(payload.items) ? payload.items : [];
    pagination.totalPages = Number(payload.totalPages ?? 0);
    pagination.totalElements = Number(payload.totalElements ?? attempts.value.length);
  } catch (err) { error.value = 'Không thể tải lịch sử bài làm. Vui lòng thử lại.'; }
  finally { loading.value = false; }
};

const changePage = (newPage: number) => {
  if (newPage < 0 || (pagination.totalPages && newPage >= pagination.totalPages)) return;
  pagination.page = newPage;
  loadAttempts();
};

onMounted(() => { 
  if (auth.isAuthenticated) {
    loadFiltersData();
  }
  loadAttempts(); 
});
</script>
