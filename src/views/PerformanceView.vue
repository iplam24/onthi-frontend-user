<template>
  <section class="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 pb-20 pt-4 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
          <i class="fa-solid fa-chart-line text-white text-lg"></i>
        </div>
        <div>
          <h1 class="m-0 text-2xl font-extrabold tracking-tight text-slate-900">Đánh giá hiệu suất</h1>
          <p class="m-0 text-sm font-medium text-slate-500">Phân tích chi tiết kết quả thi</p>
        </div>
      </div>
      <router-link to="/attempts" class="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
        <i class="fa-solid fa-arrow-left"></i> Về lịch sử
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-6">
      <div class="h-40 bg-slate-100 rounded-[2rem]"></div>
      <div class="grid grid-cols-2 gap-4">
        <div class="h-48 bg-slate-50 rounded-2xl"></div>
        <div class="h-48 bg-slate-50 rounded-2xl"></div>
      </div>
    </div>

    <!-- Grading in Progress -->
    <div v-else-if="isGrading" class="max-w-md mx-auto card-elevated p-8 text-slate-700 text-center space-y-6 border-indigo-100 bg-gradient-to-b from-white to-slate-50/50 shadow-2xl shadow-indigo-500/10 rounded-[2.5rem] animate-fade-in-up">
      <div class="relative flex items-center justify-center h-24 w-24 mx-auto">
        <!-- Outer glowing ring -->
        <span class="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20 animate-ping"></span>
        <!-- Inner grading icon container -->
        <div class="relative h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <i class="fa-solid fa-pen-nib text-white text-3xl animate-bounce"></i>
        </div>
      </div>
      <div class="space-y-2">
        <h2 class="m-0 text-xl font-black text-slate-800">Hệ thống đang chấm bài...</h2>
        <p class="m-0 text-sm font-medium text-slate-500 leading-relaxed">
          Bài làm tự luận của bạn đang được chấm tự động bằng AI. Vui lòng đợi trong giây lát, kết quả sẽ hiển thị ngay khi hoàn thành!
        </p>
      </div>
      <!-- Beautiful processing indicator -->
      <div class="flex items-center justify-center gap-2.5">
        <span class="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-bounce" style="animation-delay: 0ms;"></span>
        <span class="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-bounce" style="animation-delay: 150ms;"></span>
        <span class="h-2.5 w-2.5 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 300ms;"></span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card-elevated border-rose-200 bg-rose-50 p-6 text-center">
      <i class="fa-solid fa-circle-exclamation text-rose-500 text-2xl mb-3"></i>
      <p class="text-base font-semibold text-rose-700 m-0">{{ error }}</p>
    </div>

    <!-- Content -->
    <template v-else-if="perf">
      <!-- Overall Score Card -->
      <div class="animate-slide-up-reveal overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-indigo-500/5">
        <div class="p-8 sm:p-10 text-center space-y-4" :class="ratingBgClass">
          <p class="m-0 text-sm font-bold text-slate-600">{{ perf.examTitle }}</p>
          <div class="text-7xl font-black tracking-tighter" :class="ratingTextClass">
            {{ perf.percentage }}%
          </div>
          <span class="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest" :class="ratingBadgeClass">
            {{ ratingLabel }}
          </span>
        </div>
        <div class="grid grid-cols-4 divide-x divide-slate-50 border-t border-slate-50">
          <div class="p-5 text-center">
            <p class="m-0 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Điểm</p>
            <p class="m-0 text-2xl font-black text-slate-800">{{ perf.score ?? '-' }}</p>
          </div>
          <div class="p-5 text-center">
            <p class="m-0 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Đúng</p>
            <p class="m-0 text-2xl font-black text-emerald-500">{{ perf.correctCount }}</p>
          </div>
          <div class="p-5 text-center">
            <p class="m-0 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Sai</p>
            <p class="m-0 text-2xl font-black text-rose-500">{{ perf.wrongCount }}</p>
          </div>
          <div class="p-5 text-center">
            <p class="m-0 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Bỏ trống</p>
            <p class="m-0 text-2xl font-black text-slate-400">{{ perf.unansweredCount }}</p>
          </div>
        </div>
      </div>

      <!-- Progress Comparison -->
      <div v-if="perf.progressComparison" class="animate-slide-up-reveal card-elevated p-6">
        <h3 class="m-0 text-sm font-black uppercase tracking-widest text-slate-500 mb-4">
          <i class="fa-solid fa-arrow-trend-up mr-2"></i>So sánh tiến bộ
        </h3>
        <div v-if="perf.progressComparison.trend === 'FIRST_ATTEMPT'" class="flex items-center gap-3 text-sm text-slate-500">
          <i class="fa-solid fa-flag text-indigo-500"></i>
          <span class="font-semibold">Đây là lần thi đầu tiên của bạn cho đề này!</span>
        </div>
        <div v-else class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-slate-400">Lần trước:</span>
            <span class="text-xl font-black text-slate-600">{{ perf.progressComparison.previousScore }}</span>
          </div>
          <i class="fa-solid fa-arrow-right text-slate-300"></i>
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-slate-400">Lần này:</span>
            <span class="text-xl font-black text-slate-800">{{ perf.progressComparison.currentScore }}</span>
          </div>
          <span
            class="ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold"
            :class="{
              'bg-emerald-50 text-emerald-700': perf.progressComparison.trend === 'IMPROVING',
              'bg-amber-50 text-amber-700': perf.progressComparison.trend === 'STABLE',
              'bg-rose-50 text-rose-700': perf.progressComparison.trend === 'DECLINING',
            }"
          >
            <i :class="{
              'fa-solid fa-arrow-up': perf.progressComparison.trend === 'IMPROVING',
              'fa-solid fa-minus': perf.progressComparison.trend === 'STABLE',
              'fa-solid fa-arrow-down': perf.progressComparison.trend === 'DECLINING',
            }"></i>
            {{ perf.progressComparison.improvement != null ? `${perf.progressComparison.improvement > 0 ? '+' : ''}${perf.progressComparison.improvement}%` : '' }}
            {{ trendLabel(perf.progressComparison.trend) }}
          </span>
        </div>
      </div>

      <!-- Analysis Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Topic Analysis -->
        <div class="animate-slide-up-reveal card-elevated p-6 space-y-4">
          <h3 class="m-0 text-sm font-black uppercase tracking-widest text-slate-500">
            <i class="fa-solid fa-book mr-2"></i>Theo chủ đề
          </h3>
          <div v-for="ta in perf.topicAnalyses" :key="ta.topicId ?? ta.topicName" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="font-semibold text-slate-700 truncate mr-2">{{ ta.topicName }}</span>
              <span class="font-bold shrink-0" :class="ratingColor(ta.rating)">{{ ta.percentage }}%</span>
            </div>
            <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700" :class="barColor(ta.rating)" :style="{ width: ta.percentage + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Difficulty Analysis -->
        <div class="animate-slide-up-reveal card-elevated p-6 space-y-4">
          <h3 class="m-0 text-sm font-black uppercase tracking-widest text-slate-500">
            <i class="fa-solid fa-layer-group mr-2"></i>Theo mức độ khó
          </h3>
          <div v-for="da in perf.difficultyAnalyses" :key="da.difficulty" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="font-semibold text-slate-700">{{ diffLabel(da.difficulty) }}</span>
              <span class="font-bold" :class="ratingColor(da.rating)">{{ da.correctCount }}/{{ da.totalQuestions }} ({{ da.percentage }}%)</span>
            </div>
            <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700" :class="barColor(da.rating)" :style="{ width: da.percentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weaknesses -->
      <div v-if="perf.weaknesses?.length" class="animate-slide-up-reveal card-elevated p-6 space-y-4 border-rose-100">
        <h3 class="m-0 text-sm font-black uppercase tracking-widest text-rose-500">
          <i class="fa-solid fa-triangle-exclamation mr-2"></i>Điểm yếu cần cải thiện
        </h3>
        <div v-for="(w, i) in perf.weaknesses" :key="i" class="flex items-start gap-3 rounded-xl bg-rose-50/50 p-4">
          <div class="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
            <i :class="w.type === 'TOPIC' ? 'fa-solid fa-book' : 'fa-solid fa-layer-group'" class="text-rose-500 text-xs"></i>
          </div>
          <div>
            <p class="m-0 text-sm font-bold text-rose-700">{{ w.area }} — {{ w.percentage }}%</p>
            <p class="m-0 text-xs text-rose-600 mt-0.5">{{ w.description }}</p>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="perf.recommendations?.length" class="animate-slide-up-reveal card-elevated p-6 space-y-4 border-indigo-100">
        <h3 class="m-0 text-sm font-black uppercase tracking-widest text-indigo-500">
          <i class="fa-solid fa-lightbulb mr-2"></i>Gợi ý cải thiện
        </h3>
        <ul class="m-0 pl-0 space-y-3 list-none">
          <li v-for="(rec, i) in perf.recommendations" :key="i" class="flex items-start gap-3 text-sm font-medium text-slate-600">
            <i class="fa-solid fa-check-circle text-indigo-400 mt-0.5 shrink-0"></i>
            <span>{{ rec }}</span>
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="flex gap-4">
        <router-link :to="`/attempts/${perf.attemptId}/review`" class="flex-1 rounded-2xl bg-slate-900 px-6 py-4 text-center text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-600 transition-colors">
          <i class="fa-solid fa-eye mr-2"></i>Xem chi tiết bài làm
        </router-link>
        <router-link v-if="perf.examId" :to="`/exams/${perf.examId}/attempt`" class="flex-1 rounded-2xl bg-indigo-600 px-6 py-4 text-center text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-700 transition-colors">
          <i class="fa-solid fa-rotate-right mr-2"></i>Thi lại
        </router-link>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { getAttemptPerformance, type ExamPerformanceResponse } from '@/services/examService';

const route = useRoute();
const attemptId = Number(route.params.attemptId);

const loading = ref(true);
const isGrading = ref(false);
const error = ref<string | null>(null);
const perf = ref<ExamPerformanceResponse | null>(null);

const diffLabel = (d: string) => ({ EASY: 'Dễ', MEDIUM: 'Trung bình', HARD: 'Khó' }[d] || d);

const ratingLabel = computed(() => {
  const map: Record<string, string> = {
    EXCELLENT: 'Xuất sắc', GOOD: 'Tốt', AVERAGE: 'Trung bình', WEAK: 'Yếu', VERY_WEAK: 'Rất yếu',
  };
  return map[perf.value?.overallRating || ''] || perf.value?.overallRating;
});

const ratingTextClass = computed(() => {
  const map: Record<string, string> = {
    EXCELLENT: 'text-emerald-600', GOOD: 'text-blue-600', AVERAGE: 'text-amber-600', WEAK: 'text-orange-600', VERY_WEAK: 'text-rose-600',
  };
  return map[perf.value?.overallRating || ''] || 'text-slate-800';
});

const ratingBgClass = computed(() => {
  const map: Record<string, string> = {
    EXCELLENT: 'bg-emerald-50/50', GOOD: 'bg-blue-50/50', AVERAGE: 'bg-amber-50/30', WEAK: 'bg-orange-50/30', VERY_WEAK: 'bg-rose-50/30',
  };
  return map[perf.value?.overallRating || ''] || '';
});

const ratingBadgeClass = computed(() => {
  const map: Record<string, string> = {
    EXCELLENT: 'bg-emerald-100 text-emerald-700', GOOD: 'bg-blue-100 text-blue-700', AVERAGE: 'bg-amber-100 text-amber-700',
    WEAK: 'bg-orange-100 text-orange-700', VERY_WEAK: 'bg-rose-100 text-rose-700',
  };
  return map[perf.value?.overallRating || ''] || 'bg-slate-100 text-slate-700';
});

const ratingColor = (r: string) => ({
  STRONG: 'text-emerald-600', AVERAGE: 'text-amber-600', WEAK: 'text-rose-600',
}[r] || 'text-slate-600');

const barColor = (r: string) => ({
  STRONG: 'bg-emerald-500', AVERAGE: 'bg-amber-500', WEAK: 'bg-rose-500',
}[r] || 'bg-slate-400');

const trendLabel = (t: string) => ({
  IMPROVING: 'Tiến bộ', STABLE: 'Ổn định', DECLINING: 'Giảm sút',
}[t] || '');

let pollTimeout: any = null;

const loadPerformance = async () => {
  try {
    const res = await getAttemptPerformance(attemptId);
    if (res.data?.message === 'GRADING') {
      isGrading.value = true;
      loading.value = false;
      pollTimeout = setTimeout(loadPerformance, 3000);
    } else {
      perf.value = res.data?.data;
      isGrading.value = false;
      loading.value = false;
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Không thể tải dữ liệu đánh giá.';
    isGrading.value = false;
    loading.value = false;
  }
};

onMounted(() => {
  loadPerformance();
});

onUnmounted(() => {
  if (pollTimeout) {
    clearTimeout(pollTimeout);
  }
});
</script>
