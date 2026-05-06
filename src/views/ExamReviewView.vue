<template>
  <section class="space-y-8 px-3 sm:px-6 max-w-5xl mx-auto pb-12 pt-[140px] sm:pt-[130px]" style="animation: slide-up 700ms cubic-bezier(0.16,1,0.3,1) both">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-2xl border-b border-white/50 shadow-lg shadow-indigo-500/5">
      <div class="max-w-5xl mx-auto px-6 py-5 sm:px-10 flex flex-wrap gap-4 items-center justify-between">
        <div class="flex items-center gap-5">
          <div class="relative h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-50">
            <div class="absolute inset-0 rounded-2xl bg-indigo-400/20 blur-lg animate-pulse"></div>
            <i class="fa-solid fa-file-signature text-indigo-600 text-2xl relative z-10"></i>
          </div>
          <div>
            <h1 class="m-0 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Xem lại kết quả</h1>
            <p class="mb-0 mt-1 text-xs font-black uppercase tracking-[0.2em] text-indigo-500">
              Chi tiết bài làm & giải thích
            </p>
          </div>
        </div>
        <router-link
          to="/attempts"
          class="group inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600 active:scale-95 shadow-xl shadow-slate-900/10"
        >
          <i class="fa-solid fa-arrow-left-long text-xs transition-transform group-hover:-translate-x-1"></i>
          Về lịch sử
        </router-link>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-8">
      <!-- Score Card Skeleton -->
      <div class="card-elevated h-32 w-full bg-slate-50 rounded-[2.5rem]"></div>
      
      <!-- Questions Skeleton -->
      <div class="space-y-6">
        <div class="h-8 w-48 bg-slate-100 rounded-lg"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="i in 4" :key="i" class="card-elevated p-8 space-y-6 h-[400px]">
            <div class="h-10 w-32 bg-slate-100 rounded-xl"></div>
            <div class="h-8 w-full bg-slate-100 rounded-lg"></div>
            <div class="space-y-4">
              <div v-for="j in 4" :key="j" class="h-12 bg-slate-50 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card-elevated border-rose-200 bg-rose-50 p-6 text-center">
      <div class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 mb-4">
        <i class="fa-solid fa-circle-exclamation text-rose-500 text-xl"></i>
      </div>
      <p class="text-base font-semibold text-rose-700 m-0">{{ error }}</p>
    </div>

    <!-- Content -->
    <template v-else-if="attempt">
      <!-- Score Card -->
      <!-- Score Card -->
      <div class="animate-slide-up-reveal stagger-1 overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-indigo-500/5">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-50">
          <div class="p-8 sm:p-10 text-center">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-600 m-0 mb-3">Điểm số</p>
            <p class="text-6xl font-black text-indigo-600 m-0 tracking-tighter">{{ attempt.score ?? '-' }}</p>
          </div>
          <div class="p-8 sm:p-10 text-center">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-600 m-0 mb-3">Trả lời đúng</p>
            <p class="text-4xl font-black text-emerald-500 m-0 tabular-nums">
              {{ attempt.correctCount ?? attempt.totalCorrect ?? 0 }}
              <span class="text-base font-bold text-slate-200">/ {{ totalQuestions }}</span>
            </p>
          </div>
          <div class="p-8 sm:p-10 text-center">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-600 m-0 mb-3">Trả lời sai</p>
            <p class="text-4xl font-black text-rose-500 m-0 tabular-nums">
              {{ attempt.wrongCount ?? attempt.totalIncorrect ?? 0 }}
            </p>
          </div>
          <div class="p-8 sm:p-10 flex flex-col items-center justify-center">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-600 m-0 mb-3">Trạng thái</p>
            <span class="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-5 py-2 text-xs font-black uppercase tracking-widest text-indigo-600">
              <span class="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              {{ attempt.status === 'SUBMITTED' ? 'Đã nộp' : (attempt.status || 'Hoàn thành') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Questions list -->
      <div v-if="questions.length" class="space-y-5">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-extrabold text-slate-900 m-0 sm:text-2xl">Chi tiết từng câu hỏi</h2>
          <span class="text-sm font-semibold text-slate-600">{{ questions.length }} câu</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <article
            v-for="(q, index) in questions"
            :key="q.questionId || index"
            class="animate-slide-up-reveal group flex flex-col h-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-2 transition-all duration-500 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/5"
            :style="{ animationDelay: `${200 + Number(index) * 50}ms` }"
          >
            <!-- Question header -->
            <div class="flex items-center justify-between gap-3 border-b border-slate-50 px-6 py-3.5 bg-slate-50/50 rounded-t-[1.75rem]">
              <div class="flex items-center gap-3">
                <span
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-inner transition-all duration-500 group-hover:scale-110"
                  :class="q._isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'"
                >
                  {{ (Number(index) + 1).toString().padStart(2, '0') }}
                </span>
                <span
                  class="inline-flex items-center gap-2 rounded-xl px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border border-white"
                  :class="q._isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
                >
                  <i :class="q._isCorrect ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
                  {{ q._isCorrect ? 'Đúng' : 'Sai' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="q.score" class="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100">{{ q.score }} điểm</span>
              </div>
            </div>

            <!-- Question content -->
            <div class="px-6 py-6 sm:px-8 sm:py-8 flex flex-col grow">
              <h2 class="m-0 text-lg font-black leading-relaxed text-slate-900 transition-colors group-hover:text-indigo-700 min-h-[4.5rem]">
                <MathContent :content="q.content || q.contentSnapshot || q.questionContent || 'Nội dung câu hỏi'" />
              </h2>

              <div v-if="q.url" class="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50/50 p-3">
                <img :src="resolveAssetUrl(q.url)" class="max-h-64 rounded-xl object-contain w-full transition-transform duration-500 group-hover:scale-[1.02]" alt="Hình ảnh câu hỏi" />
              </div>

              <!-- Options -->
              <div v-if="q._options && q._options.length" class="mt-8 space-y-4 grow">
                <div
                  v-for="(opt, oi) in q._options"
                  :key="opt.id || oi"
                  class="flex items-center gap-4 rounded-2xl border-2 px-5 py-4 transition-all duration-300 relative overflow-hidden"
                  :class="getOptionClass(opt)"
                >
                  <span
                    class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow-sm transition-all duration-300"
                    :class="opt.isCorrect ? 'bg-emerald-500 text-white' : (opt._isSelected ? 'bg-rose-500 text-white' : 'bg-white text-slate-600 border border-slate-100')"
                  >
                    {{ String.fromCharCode(65 + Number(oi)) }}
                  </span>
                  <span class="relative z-10 text-base font-bold leading-relaxed grow transition-colors" :class="opt.isCorrect ? 'text-emerald-900' : (opt._isSelected ? 'text-rose-900' : 'text-slate-600')">
                    <MathContent :content="opt.content" />
                  </span>
                  <i v-if="opt.isCorrect" class="relative z-10 fa-solid fa-circle-check text-emerald-500 text-2xl shrink-0 animate-scale-in"></i>
                  <i v-else-if="opt._isSelected" class="relative z-10 fa-solid fa-circle-xmark text-rose-500 text-2xl shrink-0 animate-scale-in"></i>
                </div>
              </div>

              <!-- Answer Summary -->
              <div v-if="q._options && q._options.length" class="mt-8 pt-6 border-t border-slate-50 flex flex-col gap-3">
                <div class="flex items-center gap-4">
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 w-24">Bạn đã chọn:</span>
                  <span class="text-sm font-black" :class="q._isCorrect ? 'text-emerald-600' : (q._options.find((o: any) => o._isSelected) ? 'text-rose-600' : 'text-slate-300')">
                    {{ q._options.find((o: any) => o._isSelected)?.content || 'Chưa chọn' }}
                  </span>
                </div>
                <div v-if="!q._isCorrect" class="flex items-center gap-4">
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 w-24">Đáp án đúng:</span>
                  <span class="text-sm font-black text-emerald-600">
                    {{ q._options.find((o: any) => o.isCorrect)?.content || 'Đang cập nhật' }}
                  </span>
                </div>
              </div>

              <!-- Explanation / Sample Answer -->
              <div v-if="q.explanation || q.sampleAnswer" class="mt-8 rounded-[1.5rem] border-2 border-blue-100 bg-blue-50/30 px-6 py-6 shrink-0 shadow-xl shadow-blue-500/5">
                <p class="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 m-0 mb-4 flex items-center">
                  <i class="fa-solid fa-lightbulb mr-2 text-blue-400 text-base"></i> 
                  {{ q.sampleAnswer ? 'DÁP ÁN MẪU' : 'GIẢI THÍCH CHI TIẾT' }}
                </p>
                <p class="text-sm text-slate-700 leading-relaxed m-0 font-bold whitespace-pre-line">
                  <MathContent :content="q.explanation || q.sampleAnswer" />
                </p>
              </div>
              <div v-else-if="!q._isCorrect && !q.explanation" class="mt-8 rounded-[1.5rem] border-2 border-slate-50 bg-slate-50/30 px-6 py-5 shrink-0">
                <p class="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 m-0 flex items-center">
                  <i class="fa-solid fa-circle-info mr-2 text-slate-300"></i> Chưa có giải thích cho câu hỏi này
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- No questions fallback -->
      <div v-else class="card-elevated px-6 py-14 text-center">
        <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
          <i class="fa-solid fa-file-circle-question text-slate-400 text-2xl"></i>
        </div>
        <p class="text-base font-semibold text-slate-500 m-0">Không có chi tiết câu hỏi cho bài thi này.</p>
        <p class="text-sm text-slate-400 m-0 mt-1">Hệ thống sẽ hiển thị khi dữ liệu được cập nhật.</p>
      </div>
    </template>
  </section>

<!-- Edit Modal Removed -->
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getAttemptById } from '@/services/attemptService';
import { getExamById } from '@/services/examService';
import { getQuestionById } from '@/services/questionService';
import QuestionEditModal from '@/components/admin/QuestionEditModal.vue';
import MathContent from '@/components/common/MathContent.vue';

const auth = useAuthStore();

const route = useRoute();
const id = Number(route.params.id);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveAssetUrl = (assetUrl?: string) => {
  if (!assetUrl) return undefined;
  return /^https?:\/\//i.test(assetUrl) ? assetUrl : `${BACKEND_ORIGIN}${assetUrl.startsWith('/') ? '' : '/'}${assetUrl}`;
};

const loading = ref(true);
const error = ref<string | null>(null);
const attempt = ref<any>(null);
const questions = ref<any[]>([]);

// Admin Edit Logic (Removed)

const totalQuestions = computed(() => {
  return attempt.value?.totalQuestions ?? questions.value.length ?? 0;
});

const loadAttempt = async () => {
  if (!id) {
    error.value = 'Mã bài thi không hợp lệ.';
    loading.value = false;
    return;
  }

  try {
    // Step 1: Fetch attempt basic info
    const attemptRes = await getAttemptById(id);
    const attemptData = attemptRes.data?.data || attemptRes.data;
    attempt.value = attemptData;

    // Step 2: Fetch exam details (questions + options with isCorrect)
    const examId = attemptData.examId;
    if (examId) {
      try {
        const examRes = await getExamById(examId);
        const examData = examRes.data?.data || examRes.data;

        if (examData?.questions?.length) {
          const submittedAnswers: any[] = attemptData.details || attemptData.answers || attemptData.submittedAnswers || [];

          // Fetch full details for each question to get isCorrect and explanation
          const detailedQuestions = await Promise.all(
            examData.questions.map(async (q: any) => {
              try {
                const qId = q.questionId || q.id;
                const qRes = await getQuestionById(qId);
                return qRes.data?.data || qRes.data || q;
              } catch {
                return q; // Fallback to basic info if detail fetch fails
              }
            })
          );

          questions.value = detailedQuestions.map((q: any) => {
            const qId = q.id || q.questionId;
            const userAnswer = submittedAnswers.find((a: any) =>
              (a.questionId === qId) || (a.question?.id === qId)
            );

            const options = q.options || [];
            const selectedOptionId = userAnswer?.selectedOptionId ?? userAnswer?.optionId;
            const correctOption = options.find((o: any) => o.isCorrect);

            const isCorrect = userAnswer && userAnswer.isCorrect !== undefined 
                ? userAnswer.isCorrect 
                : (selectedOptionId ? correctOption?.id === selectedOptionId : false);

            return {
              ...q,
              questionId: qId,
              score: userAnswer?.score ?? q.score,
              content: q.content || q.contentSnapshot || '',
              _options: options.map((opt: any) => ({
                ...opt,
                _isSelected: opt.id === selectedOptionId,
              })),
              _isCorrect: isCorrect,
              _essayAnswer: userAnswer?.essayAnswer ?? null,
            };
          });
        }
      } catch {
        // If exam fetch fails, just show score without details
        console.warn('Could not fetch exam details for review');
      }
    }
  } catch (err) {
    error.value = 'Không thể tải chi tiết bài thi. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
};

const getOptionClass = (opt: any) => {
  if (opt.isCorrect) {
    return 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'; // Extra emphasis for correct answer
  }
  if (opt._isSelected && !opt.isCorrect) {
    return 'border-rose-500 bg-rose-50/50 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/20'; // Extra emphasis for wrong selection
  }
  return 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md';
};

onMounted(() => {
  loadAttempt();
});
</script>
