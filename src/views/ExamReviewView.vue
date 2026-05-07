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
      <div v-if="questions.length" class="space-y-12">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-extrabold text-slate-900 m-0 sm:text-2xl">Chi tiết từng câu hỏi</h2>
          <span class="text-sm font-semibold text-slate-600">{{ questions.length }} câu</span>
        </div>

        <div v-for="(section, sIndex) in sections" :key="sIndex" class="space-y-6">
          <div v-if="section.title" class="flex items-center gap-4">
            <div class="h-px grow bg-slate-100"></div>
            <h3 class="m-0 text-sm font-black uppercase tracking-[0.3em] text-indigo-500 bg-white px-4">
              {{ section.title }}
            </h3>
            <div class="h-px grow bg-slate-100"></div>
          </div>

          <div 
            class="grid gap-8 items-stretch"
            :class="[
              uiLayoutHint === 'LITERATURE' || uiLayoutHint === 'ESSAY' 
                ? 'grid-cols-1 max-w-4xl mx-auto' 
                : 'grid-cols-1 md:grid-cols-2'
            ]"
          >
            <QuestionCard
              v-for="(q, index) in section.questions"
              :key="q.questionId || index"
              :id="q.questionId"
              :index="Number(index) + 1"
              :content="q.content"
              :content-format="q.contentFormat"
              :image-url="q.url ? resolveAssetUrl(q.url) : undefined"
              :options="q._options"
              :score="q.score"
              :is-review="true"
              :is-correct="q._isCorrect"
              :essay-answer="q._essayAnswer"
              :explanation="q.explanation"
              :sample-answer="q.sampleAnswer"
              :feedback="q._feedback"
              :grading-method="q._gradingMethod"
              :ui-layout-hint="uiLayoutHint"
              :animation-delay="200 + Number(index) * 50"
              @zoom="resolveAssetUrl($event)"
            />
        </div>
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
import QuestionCard from '@/components/common/QuestionCard.vue';

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
const sections = ref<Array<{ title: string; questions: any[] }>>([]);
const uiLayoutHint = ref<'STANDARD' | 'LITERATURE' | 'ESSAY' | 'MIXED'>('STANDARD');

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
        uiLayoutHint.value = examData.uiLayoutHint || 'STANDARD';

        if (examData?.questions?.length) {
          const submittedAnswers: any[] = attemptData.details || attemptData.answers || attemptData.submittedAnswers || [];
          const detailedQuestions = await Promise.all(
            submittedAnswers.map(async (ans: any) => {
              const qId = ans.questionId || ans.question?.id;
              if (!qId) return null;
              try {
                const qRes = await getQuestionById(qId);
                const qData = qRes.data?.data || qRes.data;
                return { ...qData, userAnswer: ans };
              } catch (err) {
                console.error(`Failed to fetch question ${qId}:`, err);
                return { id: qId, userAnswer: ans, content: 'Không thể tải nội dung câu hỏi.' };
              }
            })
          ).then(results => results.filter(r => r !== null));

          questions.value = detailedQuestions.map((q: any) => {
            const userAnswer = q.userAnswer;
            const qId = q.id || q.questionId;
            
            const rawOptions = q.options || q.questionOptions || q.choices || [];
            const options = Array.isArray(rawOptions) ? rawOptions : [];
            
            const selectedOptionId = userAnswer?.selectedOptionId ?? userAnswer?.optionId;
            const correctOption = options.find((o: any) => o.isCorrect);

            const isCorrect = userAnswer && userAnswer.isCorrect !== undefined 
                ? userAnswer.isCorrect 
                : (selectedOptionId ? String(correctOption?.id) === String(selectedOptionId) : false);

            return {
              ...q,
              questionId: qId,
              score: userAnswer?.score ?? q.score,
              content: q.content || q.contentSnapshot || '',
              url: q.url || q.imageUrl,
              explanation: q.explanation || userAnswer?.explanation || null,
              sampleAnswer: q.sampleAnswer || userAnswer?.sampleAnswer || null,
              _options: options.map((opt: any) => ({
                ...opt,
                _isSelected: String(opt.id) === String(selectedOptionId),
              })),
              _isCorrect: isCorrect,
              _essayAnswer: userAnswer?.essayAnswer ?? null,
              _feedback: userAnswer?.feedback ?? userAnswer?.aiFeedback ?? null,
              _gradingMethod: userAnswer?.gradingMethod ?? null,
            };
          });

          if (examData.sections && examData.sections.length > 0) {
            sections.value = examData.sections.map((s: any) => {
              const sectionQuestionIds = (s.questions || []).map((sq: any) => sq.questionId || sq.id);
              return {
                title: s.title,
                questions: questions.value.filter((q: any) => sectionQuestionIds.includes(q.questionId))
              };
            });
          } else {
            sections.value = [{ title: '', questions: questions.value }];
          }
        }
      } catch {
        // If exam fetch fails, just show score without details
        console.warn('Could not fetch exam details for review');
      }
    }
  } catch (err) {
    console.error('[loadAttempt:error]', err);
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
