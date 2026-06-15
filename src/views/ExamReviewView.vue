<template>
<section class="space-y-8 px-4 sm:px-8 w-full mx-auto pb-12 pt-[90px] sm:pt-[85px]" style="animation: slide-up 700ms cubic-bezier(0.16,1,0.3,1) both">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-2xl border-b border-white/50 shadow-lg shadow-indigo-500/5">
      <div class="w-full mx-auto px-4 py-3 sm:px-8 flex flex-wrap gap-4 items-center justify-between">
        <div class="flex items-center gap-5">
          <div class="relative h-10 w-10 flex items-center justify-center rounded-2xl bg-indigo-50">
            <div class="absolute inset-0 rounded-2xl bg-indigo-400/20 blur-lg animate-pulse"></div>
            <i class="fa-solid fa-file-signature text-indigo-600 text-lg relative z-10"></i>
          </div>
          <div>
            <h1 class="m-0 text-lg font-black tracking-tight text-slate-900 sm:text-xl">Xem lại kết quả</h1>
            <p class="mb-0 mt-1 text-xs font-black uppercase tracking-[0.2em] text-indigo-500">
              Chi tiết bài làm & giải thích
            </p>
          </div>
        </div>
        <router-link
          to="/attempts"
          class="group inline-flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600 active:scale-95 shadow-xl shadow-slate-900/10"
        >
          <i class="fa-solid fa-arrow-left-long text-xs transition-transform group-hover:-translate-x-1"></i>
          {{ attempt?.status === 'GRADING' ? 'Xem sau' : 'Về lịch sử' }}
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
      <!-- Grading State -->
      <div v-if="attempt.status === 'GRADING'" class="animate-slide-up-reveal py-12 text-center space-y-8">
        <div class="relative mx-auto w-32 h-32">
          <div class="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-25"></div>
          <div class="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
          <div class="absolute inset-2 rounded-full bg-white shadow-inner flex items-center justify-center">
            <i class="fa-solid fa-pen-nib text-4xl text-indigo-600 animate-bounce"></i>
          </div>
        </div>
        
        <div class="max-w-md mx-auto space-y-4">
          <h2 class="m-0 text-3xl font-black text-slate-900">Hệ thống đang chấm điểm...</h2>
          <p class="text-slate-500 font-medium leading-relaxed">
            Hệ thống đang phân tích chi tiết bài làm của bạn để đưa ra điểm số và nhận xét chính xác nhất.
          </p>
          <div class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-50 text-indigo-700 text-sm font-black">
            <span class="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Vui lòng chờ trong giây lát
          </div>
        </div>

        <div class="pt-8 grid gap-4 max-w-sm mx-auto">
          <router-link to="/attempts" class="btn-secondary py-4 text-xs font-black uppercase tracking-widest">
            Quay lại sau
          </router-link>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Tự động cập nhật sau mỗi 3 giây
          </p>
        </div>
      </div>

      <!-- Result Content -->
      <template v-else>
        <!-- Score Card -->
        <div class="animate-slide-up-reveal stagger-1 overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-indigo-500/5">
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-50">
            <div class="p-5 sm:p-6 text-center">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-600 m-0 mb-3">Điểm số</p>
              <p class="text-5xl font-black text-indigo-600 m-0 tracking-tighter">{{ attempt.score ?? '-' }}</p>
            </div>
            <div class="p-5 sm:p-6 text-center">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-600 m-0 mb-3">Trả lời đúng</p>
              <p class="text-3xl font-black text-emerald-500 m-0 tabular-nums">
                {{ attempt.correctCount ?? attempt.totalCorrect ?? 0 }}
                <span class="text-base font-bold text-slate-200">/ {{ totalQuestions }}</span>
              </p>
            </div>
            <div class="p-5 sm:p-6 text-center">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-600 m-0 mb-3">Trả lời sai</p>
              <p class="text-3xl font-black text-rose-500 m-0 tabular-nums">
                {{ attempt.wrongCount ?? attempt.totalIncorrect ?? 0 }}
              </p>
            </div>
            <div class="p-5 sm:p-6 flex flex-col items-center justify-center">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-600 m-0 mb-3">Trạng thái</p>
              <span class="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-5 py-2 text-xs font-black uppercase tracking-widest text-indigo-600">
                <span class="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                {{ attempt.status === 'SUBMITTED' ? 'Đã nộp' : (attempt.status === 'GRADING' ? 'Đang chấm' : (attempt.status || 'Hoàn thành')) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Questions list -->
        <div v-if="questions.length" class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-extrabold text-slate-900 m-0 sm:text-2xl">Chi tiết từng câu hỏi</h2>
            <span class="text-sm font-semibold text-slate-600">{{ questions.length }} câu</span>
          </div>

          <div v-for="(section, sIndex) in sections" :key="sIndex" class="space-y-4">
            <div v-if="section.title" class="flex items-center gap-4">
              <div class="h-px grow bg-slate-100"></div>
              <h3 class="m-0 text-sm font-black uppercase tracking-[0.3em] text-indigo-500 bg-white px-4">
                {{ section.title }}
              </h3>
              <div class="h-px grow bg-slate-100"></div>
            </div>

            <!-- Grouped rendering -->
            <div v-for="(chunk, cIndex) in groupQuestions(section.questions)" :key="cIndex" class="space-y-4">
              
              <!-- Question Group Layout -->
              <div 
                v-if="chunk.isGroup" 
                class="bg-white rounded-3xl border border-slate-100/80 shadow-xl shadow-slate-200/40 p-4 sm:p-6 w-full mx-auto flex flex-col lg:flex-row gap-8"
              >
                <!-- Left side: Group content -->
                <div class="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-slate-100 pr-0 lg:pr-8 pb-6 lg:pb-0">
                  <h4 class="text-xl font-bold text-slate-800 mb-4">{{ chunk.title }}</h4>
                  <div class="prose prose-sm sm:prose-base max-w-none text-slate-700" v-html="chunk.content"></div>
                </div>
                <!-- Right side: Questions -->
                <div class="lg:w-1/2 divide-y divide-slate-100 h-full max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                  <QuestionCard
                    v-for="(q, index) in chunk.questions"
                    :key="q.questionId || index"
                    :id="q.questionId"
                    :index="questions.findIndex(allQ => allQ.questionId === q.questionId) + 1"
                    :content="q.content"
                    :content-format="q.contentFormat"
                    :image-url="q.url ? resolveAssetUrl(q.url) : undefined"
                    :options="q._options"
                    :score="q.score"
                    :is-review="true"
                    :is-multiple="q.isMultiple"
                    :is-correct="q._isCorrect"
                    :essay-answer="q._essayAnswer"
                    :explanation="q.explanation"
                    :sample-answer="q.sampleAnswer"
                    :feedback="q._feedback"
                    :grading-method="q._gradingMethod"
                    :ui-layout-hint="uiLayoutHint"
                    :animation-delay="200 + Number(index) * 50"
                    :ai-explanation="aiExplanations[q.questionId]"
                    :ai-explaining="aiExplainingIds.has(q.questionId)"
                    :group-content="chunk.content"
                    @zoom="resolveAssetUrl($event)"
                    @ask-ai="handleAskAi"
                  />
                </div>
              </div>

              <!-- Standard Single Questions Layout -->
              <div 
                v-else-if="uiLayoutHint !== 'LITERATURE' && uiLayoutHint !== 'ESSAY'"
                class="bg-white rounded-3xl border border-slate-100/80 shadow-xl shadow-slate-200/40 p-4 sm:p-6 w-full mx-auto"
              >
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">
                  <QuestionCard
                    v-for="(q, index) in chunk.questions"
                    :key="q.questionId || index"
                    :id="q.questionId"
                    :index="questions.findIndex(allQ => allQ.questionId === q.questionId) + 1"
                    :content="q.content"
                    :content-format="q.contentFormat"
                    :image-url="q.url ? resolveAssetUrl(q.url) : undefined"
                    :options="q._options"
                    :score="q.score"
                    :is-review="true"
                    :is-multiple="q.isMultiple"
                    :is-correct="q._isCorrect"
                    :essay-answer="q._essayAnswer"
                    :explanation="q.explanation"
                    :sample-answer="q.sampleAnswer"
                    :feedback="q._feedback"
                    :grading-method="q._gradingMethod"
                    :ui-layout-hint="uiLayoutHint"
                    :animation-delay="200 + Number(index) * 50"
                    :ai-explanation="aiExplanations[q.questionId]"
                    :ai-explaining="aiExplainingIds.has(q.questionId)"
                    @zoom="resolveAssetUrl($event)"
                    @ask-ai="handleAskAi"
                  />
                </div>
              </div>

              <!-- Special Literature & Essay Views -->
              <div 
                v-else
                class="grid gap-8 items-stretch grid-cols-1 w-full mx-auto"
              >
                <QuestionCard
                  v-for="(q, index) in chunk.questions"
                  :key="q.questionId || index"
                  :id="q.questionId"
                  :index="questions.findIndex(allQ => allQ.questionId === q.questionId) + 1"
                  :content="q.content"
                  :content-format="q.contentFormat"
                  :image-url="q.url ? resolveAssetUrl(q.url) : undefined"
                  :options="q._options"
                  :score="q.score"
                  :is-review="true"
                  :is-multiple="q.isMultiple"
                  :is-correct="q._isCorrect"
                  :essay-answer="q._essayAnswer"
                  :explanation="q.explanation"
                  :sample-answer="q.sampleAnswer"
                  :feedback="q._feedback"
                  :grading-method="q._gradingMethod"
                  :ui-layout-hint="uiLayoutHint"
                  :animation-delay="200 + Number(index) * 50"
                  :ai-explanation="aiExplanations[q.questionId]"
                  :ai-explaining="aiExplainingIds.has(q.questionId)"
                  @zoom="resolveAssetUrl($event)"
                  @ask-ai="handleAskAi"
                />
              </div>
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
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getAttemptById } from '@/services/attemptService';
import { getExamById } from '@/services/examService';
import { getQuestionById } from '@/services/questionService';
import QuestionEditModal from '@/components/admin/QuestionEditModal.vue';
import QuestionCard from '@/components/common/QuestionCard.vue';
import { getAiExplanation } from '@/services/aiService';

const props = defineProps<{
  id: string | number;
}>();

const auth = useAuthStore();

const route = useRoute();
const id = Number(props.id || route.params.id);

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
const pollingInterval = ref<number | null>(null);

const aiExplanations = ref<Record<number, string>>({});
const aiExplainingIds = ref<Set<number>>(new Set());

const handleAskAi = async (questionId: number) => {
  if (aiExplainingIds.value.has(questionId)) return;
  
  const question = questions.value.find(q => q.questionId === questionId);
  const studentAnswer = question?._essayAnswer || ''; // Hoặc lấy từ options nếu là MCQ
  
  aiExplainingIds.value.add(questionId);
  try {
    const res = await getAiExplanation(questionId, studentAnswer);
    aiExplanations.value[questionId] = res.data?.explanation;
  } catch (err) {
    console.error('AI Tutor Error:', err);
  } finally {
    aiExplainingIds.value.delete(questionId);
  }
};

const groupQuestions = (questionList: any[]) => {
  const result: any[] = [];
  let currentGroup: any = null;
  let currentSingles: any[] = [];

  for (const q of questionList) {
    if (q.groupId || q.questionGroupId) {
      if (currentSingles.length > 0) {
        result.push({ isGroup: false, questions: currentSingles });
        currentSingles = [];
      }
      const groupId = q.groupId || q.questionGroupId;
      if (currentGroup && currentGroup.id === groupId) {
        currentGroup.questions.push(q);
      } else {
        currentGroup = { 
          isGroup: true, 
          id: groupId, 
          title: q.groupTitle || q.questionGroupTitle, 
          content: q.groupContent || q.questionGroupContent, 
          questions: [q] 
        };
        result.push(currentGroup);
      }
    } else {
      if (currentGroup) {
        currentGroup = null;
      }
      currentSingles.push(q);
    }
  }
  
  if (currentSingles.length > 0) {
    result.push({ isGroup: false, questions: currentSingles });
  }
  
  return result;
};

// Admin Edit Logic (Removed)

const totalQuestions = computed(() => {
  return attempt.value?.totalQuestions ?? questions.value.length ?? 0;
});

const loadAttempt = async (isPolling = false) => {
  if (!id) {
    error.value = 'Mã bài thi không hợp lệ.';
    loading.value = false;
    return;
  }

  if (!isPolling) {
    loading.value = true;
  }
  
  try {
    // Step 1: Fetch attempt basic info
    const attemptRes = await getAttemptById(id);
    const attemptData = attemptRes.data?.data || attemptRes.data;
    attempt.value = attemptData;

    // Handle polling based on status
    if (attemptData.status === 'GRADING') {
      startPolling();
      // If we are grading, we might not have all details yet, 
      // but we still want to show the grading UI.
      if (!isPolling) loading.value = false;
      return;
    } else {
      stopPolling();
    }

    // Step 2: Fetch exam details (questions + options with isCorrect)
    const examId = attemptData.examId;
    if (examId) {
      try {
        const examRes = await getExamById(examId);
        const examData = examRes.data?.data || examRes.data;
        uiLayoutHint.value = examData.uiLayoutHint || 'STANDARD';

        if (examData?.questions?.length) {
          const examQuestionsMap = new Map();
          for (const eq of (examData.questions || [])) {
            examQuestionsMap.set(eq.questionId || eq.id, eq);
          }

          const submittedAnswers: any[] = attemptData.details || attemptData.answers || attemptData.submittedAnswers || [];
          const detailedQuestions = await Promise.all(
            submittedAnswers.map(async (ans: any) => {
              const qId = ans.questionId || ans.question?.id;
              if (!qId) return null;
              try {
                const qRes = await getQuestionById(qId);
                const qData = qRes.data?.data || qRes.data;
                const examQ = examQuestionsMap.get(qId) || {};
                return { 
                  ...examQ, 
                  ...qData, 
                  userAnswer: ans,
                  groupId: qData.groupId || examQ.questionGroupId || examQ.groupId,
                  groupTitle: qData.groupTitle || examQ.questionGroupTitle || examQ.groupTitle,
                  groupContent: qData.groupContent || examQ.questionGroupContent || examQ.groupContent
                };
              } catch (err) {
                console.error(`Failed to fetch question ${qId}:`, err);
                const examQ = examQuestionsMap.get(qId) || {};
                return { ...examQ, id: qId, userAnswer: ans, content: 'Không thể tải nội dung câu hỏi.' };
              }
            })
          ).then(results => results.filter(r => r !== null));

          questions.value = detailedQuestions.map((q: any) => {
            const userAnswer = q.userAnswer;
            const qId = q.id || q.questionId;
            
            const rawOptions = q.options || q.questionOptions || q.choices || [];
            const options = Array.isArray(rawOptions) ? rawOptions : [];
            
            const selectedOptionId = userAnswer?.selectedOptionId ?? userAnswer?.optionId;
            const selectedOptionIds = userAnswer?.selectedOptionIds || [];
            const correctOptions = options.filter((o: any) => o.isCorrect || o.correct);
            const isMultiple = correctOptions.length > 1;

            const isCorrect = userAnswer && userAnswer.isCorrect !== undefined 
                ? userAnswer.isCorrect 
                : (Array.isArray(selectedOptionIds) && selectedOptionIds.length > 0
                    ? (() => {
                        const correctIds = correctOptions.map((o: any) => o.id);
                        return correctIds.length === selectedOptionIds.length && 
                               correctIds.every((id: any) => selectedOptionIds.includes(id));
                      })()
                    : (selectedOptionId ? String(correctOptions[0]?.id) === String(selectedOptionId) : false));

            return {
              ...q,
              questionId: qId,
              score: userAnswer?.score ?? q.score,
              content: q.content || q.contentSnapshot || '',
              url: q.url || q.imageUrl,
              explanation: q.explanation || userAnswer?.explanation || null,
              sampleAnswer: q.sampleAnswer || userAnswer?.sampleAnswer || null,
              isMultiple,
              _options: options.map((opt: any) => {
                const isSel = Array.isArray(selectedOptionIds) && selectedOptionIds.length > 0
                  ? selectedOptionIds.includes(opt.id)
                  : String(opt.id) === String(selectedOptionId);
                return {
                  ...opt,
                  _isSelected: isSel,
                };
              }),
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
    if (!isPolling) {
      error.value = 'Không thể tải chi tiết bài thi. Vui lòng thử lại sau.';
    }
  } finally {
    if (!isPolling) {
      loading.value = false;
    }
  }
};

const startPolling = () => {
  if (pollingInterval.value != null) return;
  pollingInterval.value = window.setInterval(() => loadAttempt(true), 3000) as unknown as number;
};

const stopPolling = () => {
  if (pollingInterval.value != null) {
    window.clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
};
onMounted(() => {
  loadAttempt();
});

onBeforeUnmount(() => {
  stopPolling();
});
</script>
