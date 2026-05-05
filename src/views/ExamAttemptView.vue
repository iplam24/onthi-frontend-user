<template>
  <!-- Cheating overlay -->
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isCheating" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
        <div class="animate-scale-in max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div class="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <span class="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-25" style="animation: pulse-ring 1.5s ease-out infinite"></span>
            <span class="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <i class="fa-solid fa-triangle-exclamation text-3xl text-rose-600"></i>
            </span>
          </div>
          <h2 class="m-0 text-2xl font-extrabold text-slate-900">Phát hiện gian lận</h2>
          <p class="mb-0 mt-3 text-sm leading-relaxed text-slate-500">
            Bạn đã chuyển tab quá nhiều lần trong quá trình làm bài. Bài thi của bạn đã được tự động nộp.
          </p>
          <div class="mt-8 flex flex-col gap-3">
            <button
              @click="goToExamsNow"
              class="w-full rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/25 transition hover:bg-indigo-700 active:scale-[0.98]"
            >
              Xem kết quả bài thi
            </button>
            <router-link to="/exams" class="text-xs font-black uppercase tracking-widest text-slate-400 transition hover:text-indigo-600">
              Về danh sách đề thi
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </teleport>

<div class="text-slate-900 pb-12 pt-[180px] sm:pt-[150px] max-w-7xl mx-auto px-2 sm:px-4">
    <!-- Fixed Header -->
    <div class="fixed top-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-2xl border-b border-white/50 shadow-lg shadow-indigo-500/5">
      <div class="max-w-7xl mx-auto w-full flex flex-col">
        <!-- Header row -->
        <div class="flex flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10">
          <div class="flex items-center gap-6">
            <router-link
              to="/exams"
              class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-400 shadow-sm transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
              aria-label="Quay lại"
            >
              <i class="fa-solid fa-arrow-left text-sm" aria-hidden="true"></i>
            </router-link>

            <div>
              <p class="m-0 text-xl font-black tracking-tight text-slate-900 sm:text-3xl">{{ examTitle || 'Làm bài thi' }}</p>
            </div>

            <div class="hidden sm:flex items-center gap-3 rounded-2xl bg-indigo-50 px-5 py-2.5 shadow-inner">
              <i class="fa-regular fa-clock text-indigo-500 text-lg animate-pulse"></i>
              <span class="text-xl font-black text-indigo-700 tabular-nums">{{ timeLabel }}</span>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <div class="hidden lg:flex items-center gap-4 text-xs font-black uppercase tracking-widest">
              <p class="m-0 text-slate-500"><span class="text-indigo-600 text-base">{{ answeredCount }}</span> Đã làm</p>
              <p class="m-0 text-slate-400"><span class="text-slate-300 text-base">{{ remainingCount }}</span> Còn lại</p>
            </div>
            <button
              type="button"
              @click="handleSubmit"
              :disabled="submitting || !attempt"
              class="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
            >
              <span class="relative z-10">{{ submitting ? 'Đang nộp...' : 'Nộp bài' }}</span>
              <i class="fa-solid fa-paper-plane text-xs relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"></i>
            </button>
          </div>
        </div>

        <!-- Question Navigation row -->
        <div class="border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-10 overflow-x-auto">
          <div class="flex items-center gap-3">
            <p class="m-0 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mr-4 whitespace-nowrap">Danh sách câu:</p>
            <div class="flex gap-2">
              <button
                v-for="(question, index) in questions"
                :key="`nav-${question.id}`"
                type="button"
                @click="scrollToQuestion(question.id)"
                :class="[
                  'h-10 w-10 shrink-0 rounded-xl border text-xs font-black transition-all duration-200 hover:scale-110 active:scale-90',
                  currentQuestionId === question.id
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                    : answers[question.id]
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                      : 'border-slate-200 bg-white text-slate-400 hover:border-indigo-200 hover:text-indigo-500',
                ]"
              >
                {{ index + 1 }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section style="animation: slide-up 600ms cubic-bezier(0.16,1,0.3,1) both">

    <div
      v-if="!auth.isAuthenticated"
      class="card-elevated px-6 py-14 text-center"
    >
      <div class="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 mb-6">
        <i class="fa-solid fa-user-lock text-amber-500 text-3xl"></i>
      </div>
      <h2 class="m-0 text-2xl font-extrabold text-slate-900">Đăng nhập để làm bài</h2>
      <p class="mb-0 mt-3 text-base text-slate-500 max-w-md mx-auto leading-relaxed">
        Bạn cần đăng nhập vào tài khoản để bắt đầu làm bài thi này.
      </p>
    </div>

    <div
      v-else-if="loading"
      class="animate-pulse space-y-8 mt-8"
    >
      <div v-for="i in 2" :key="i" class="card-elevated p-8 space-y-6">
        <div class="h-10 w-40 bg-slate-100 rounded-xl"></div>
        <div class="h-8 w-3/4 bg-slate-100 rounded-lg"></div>
        <div class="space-y-4 mt-8">
          <div v-for="j in 4" :key="j" class="h-16 bg-slate-50 rounded-2xl"></div>
        </div>
      </div>
    </div>

    <div
      v-else-if="error && !isCheating"
      class="card-elevated border-rose-200 bg-rose-50 p-5 text-rose-700 font-medium rounded-xl"
    >
      <div class="flex items-start gap-3">
        <i class="fa-solid fa-circle-exclamation text-rose-500 mt-0.5"></i>
        <span>{{ error }}</span>
      </div>
    </div>

    <div
      v-if="result"
      class="card-subtle border-emerald-200 bg-emerald-50 p-5 text-emerald-800"
    >
      <h3 class="m-0 text-xl font-bold">Chúc mừng, bạn đã nộp bài thành công!</h3>
      <p class="mb-0 mt-2 text-sm text-emerald-700">
        Hệ thống sẽ chuyển bạn sang trang xem lại bài thi sau {{ redirectSeconds ?? 0 }} giây.
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          @click="goToExamsNow"
          class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <i class="fa-solid fa-square-check text-xs" aria-hidden="true"></i>
          Xem kết quả ngay
        </button>
      </div>
    </div>

    <form v-else-if="attempt" class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mt-8" @submit.prevent="handleSubmit">
      <article
        v-for="(question, index) in questions"
        :id="`q-${question.id}`"
        :key="question.id"
        class="animate-slide-up-reveal group flex flex-col h-full overflow-hidden rounded-[2rem] border border-slate-100/80 bg-white transition-all duration-500 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5"
        :style="{ animationDelay: `${index * 40}ms` }"
      >
        <div class="flex items-center justify-between gap-3 border-b border-slate-50 px-6 py-4 bg-slate-50/30">
          <p class="m-0 inline-flex items-center gap-3 rounded-lg bg-white px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 shadow-sm border border-slate-100 transition-colors group-hover:text-indigo-500">
            <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 font-extrabold">
              {{ (index + 1).toString().padStart(2, '0') }}
            </span>
            Câu hỏi
          </p>
        </div>

        <div class="px-6 py-5 sm:px-7 sm:py-6 flex flex-col grow">
          <h2 class="m-0 text-base font-bold leading-relaxed text-slate-800 transition-colors group-hover:text-indigo-700">
            {{ question.content }}
          </h2>

          <div v-if="question.imageUrl" class="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50/50 p-3">
            <img
              :src="question.imageUrl"
              :alt="question.content"
              class="max-h-[360px] w-full rounded-xl object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>

          <div v-if="question.options.length" class="mt-8 space-y-4 grow">
            <label
              v-for="option in question.options"
              :key="`${question.id}-${option.value}`"
              @click="currentQuestionId = question.id"
              class="flex cursor-pointer items-center gap-4 rounded-2xl border-2 px-5 py-3.5 transition-all duration-300"
              :class="isSelected(question.id, option.value) 
                ? 'border-indigo-400 bg-indigo-50/40 shadow-md shadow-indigo-500/5' 
                : 'border-slate-100 bg-slate-50/20 hover:border-indigo-200 hover:bg-white hover:shadow-sm'"
            >
              <input
                v-model="answers[question.id]"
                :value="option.value"
                type="radio"
                :name="`question-${question.id}`"
                class="hidden"
              />
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold shadow-sm transition-all duration-300"
                :class="isSelected(question.id, option.value) ? 'bg-indigo-600 text-white scale-105' : 'bg-white text-slate-400 border border-slate-100'"
              >
                {{ String.fromCharCode(65 + question.options.findIndex((x) => x.value === option.value)) }}
              </span>
              <span class="text-sm font-semibold leading-relaxed grow transition-colors" :class="isSelected(question.id, option.value) ? 'text-indigo-900' : 'text-slate-600'">
                {{ option.label }}
              </span>
            </label>
          </div>

          <div v-else class="mt-8 grow">
            <textarea
              v-model="answers[question.id]"
              @focus="currentQuestionId = question.id"
              :placeholder="`Nhập đáp án của bạn tại đây...`"
              class="w-full h-40 rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-6 py-5 text-sm font-semibold text-slate-800 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/5 resize-none"
            ></textarea>
          </div>
        </div>
      </article>
    </form>
  </section>
  </div>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios';
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { startAttempt, submitAttempt, getAttemptById, reportViolation } from '@/services/attemptService';
import { getExamById } from '@/services/examService';

type AttemptQuestion = {
  id: number;
  content: string;
  imageUrl?: string;
  options: Array<{ label: string; value: string; optionId: number | null }>;
};

type AttemptData = {
  attemptId: number;
  examId: number;
  startTime?: string;
  durationMinutes?: number;
};

type AttemptResult = {
  id: number;
  examId: number | null;
  examTitle: string | null;
  status: string | null;
  score: number | null;
  correctCount: number | null;
  wrongCount: number | null;
  totalQuestions: number | null;
  durationTaken: number | null;
  startedAt: string | null;
  submittedAt: string | null;
};

type ExamQuestion = {
  id?: number;
  questionId?: number;
  questionContent?: string;
  contentSnapshot?: string;
  content?: string;
  url?: string;
  options?: Array<{
    id?: number;
    content?: string;
    value?: string;
    label?: string;
  }>;
};

type ExamDetails = {
  id: number;
  title?: string;
  duration?: number;
  questions?: ExamQuestion[];
};

type StoredDraft = {
  attempt: AttemptData;
  answers: Record<number, string>;
  tabSwitchCount: number;
};

type SubmitAnswerPayload = {
  questionId: number;
  selectedOptionId: number | null;
  essayAnswer: string | null;
};

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const loading = ref(false);
const submitting = ref(false);
const error = ref<string | null>(null);
const examTitle = ref('');
const attempt = ref<AttemptData | null>(null);
const questions = ref<AttemptQuestion[]>([]);
const result = ref<AttemptResult | null>(null);
const timeRemainingSeconds = ref(0);
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null);
const redirectSeconds = ref<number | null>(null);
const redirectInterval = ref<ReturnType<typeof setInterval> | null>(null);
const tabSwitchCount = ref(0);
const isCheating = ref(false); // New ref to track cheating status
const answers = reactive<Record<number, string>>({});
let initPromise: Promise<void> | null = null;

const examId = computed(() => Number(route.params.examId));
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const draftKey = computed(() => `v-edu-exam-draft:${examId.value}`);

const answeredCount = computed(() =>
  questions.value.filter((question) => Boolean(answers[question.id]?.trim())).length,
);

const remainingCount = computed(() => Math.max(questions.value.length - answeredCount.value, 0));
const currentQuestionId = ref<number | null>(null);

const timeLabel = computed(() => formatTime(timeRemainingSeconds.value));

const getApiErrorMessage = (err: unknown, fallback: string) => {
  // If cheating is detected, always show the cheating message
  if (isCheating.value) return error.value;
  const axiosErr = err as AxiosError<{ message?: string } | string>;
  const responseData = axiosErr.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (typeof responseData === 'object' && responseData && 'message' in responseData) {
    const message = responseData.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  if (axiosErr.response?.status === 400) {
    return 'Không thể bắt đầu bài thi. Có thể đề đang đóng hoặc bạn đã hết lượt làm bài.';
  }

  return fallback;
};

const getAttemptIdFromPayload = (payload: Record<string, unknown> | null | undefined) => {
  if (!payload) {
    return null;
  }

  const rawAttemptId = payload.attemptId ?? payload.id;
  const attemptId = Number(rawAttemptId);
  return Number.isFinite(attemptId) && attemptId > 0 ? attemptId : null;
};

const resolveAssetUrl = (assetUrl?: string) => {
  if (!assetUrl) {
    return undefined;
  }

  if (/^https?:\/\//i.test(assetUrl)) {
    return assetUrl;
  }

  return `${BACKEND_ORIGIN}${assetUrl.startsWith('/') ? '' : '/'}${assetUrl}`;
};

const normalizeQuestions = (items: ExamQuestion[] = []): AttemptQuestion[] =>
  items.map((item) => {
    const options = Array.isArray(item.options) ? item.options : [];
    const questionContent = item.questionContent ?? item.contentSnapshot ?? item.content ?? '';

    return {
      id: Number(item.questionId ?? item.id),
      content: String(questionContent),
      imageUrl: resolveAssetUrl(item.url),
      options: options.map((option, index) => {
        const parsedOptionId = Number(option.id);
        const value = option.value ?? option.content ?? option.id ?? String(index + 1);
        return {
          label: String(option.content ?? option.label ?? `Đáp án ${index + 1}`),
          value: String(value),
          optionId: Number.isFinite(parsedOptionId) && parsedOptionId > 0 ? parsedOptionId : null,
        };
      }),
    };
  });

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const mapSubmitResult = (payload: Record<string, unknown> | null | undefined): AttemptResult => {
  return {
    id: Number(payload?.id ?? payload?.attemptId ?? 0),
    examId: payload?.examId ? Number(payload.examId) : null,
    examTitle: typeof payload?.examTitle === 'string' ? payload.examTitle : null,
    status: typeof payload?.status === 'string' ? payload.status : null,
    score: payload?.score !== undefined && payload?.score !== null ? Number(payload.score) : null,
    correctCount:
      payload?.correctCount !== undefined && payload?.correctCount !== null
        ? Number(payload.correctCount)
        : null,
    wrongCount:
      payload?.wrongCount !== undefined && payload?.wrongCount !== null ? Number(payload.wrongCount) : null,
    totalQuestions:
      payload?.totalQuestions !== undefined && payload?.totalQuestions !== null
        ? Number(payload.totalQuestions)
        : null,
    durationTaken:
      payload?.durationTaken !== undefined && payload?.durationTaken !== null
        ? Number(payload.durationTaken)
        : null,
    startedAt: typeof payload?.startedAt === 'string' ? payload.startedAt : null,
    submittedAt: typeof payload?.submittedAt === 'string' ? payload.submittedAt : null,
  };
};

const readDraft = (): StoredDraft | null => {
  try {
    const rawValue = sessionStorage.getItem(draftKey.value);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as StoredDraft;
    if (!parsedValue?.attempt?.attemptId || parsedValue.attempt.examId !== examId.value) {
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
};

const saveDraft = () => {
  if (!attempt.value) {
    return;
  }

  const payload: StoredDraft = {
    attempt: attempt.value,
    answers: { ...answers },
    tabSwitchCount: tabSwitchCount.value,
  };

  sessionStorage.setItem(draftKey.value, JSON.stringify(payload));
};

const clearDraft = () => {
  sessionStorage.removeItem(draftKey.value);
};

const clearRedirectTimer = () => {
  if (redirectInterval.value) {
    window.clearInterval(redirectInterval.value);
    redirectInterval.value = null;
  }
};

const goToExamsNow = () => {
  clearRedirectTimer();
  if (result.value?.id) {
    router.push(`/attempts/${result.value.id}/review`);
  } else {
    router.push('/exams');
  }
};

const startRedirectCountdown = (seconds = 4) => {
  clearRedirectTimer();
  redirectSeconds.value = seconds;

  redirectInterval.value = window.setInterval(() => {
    if (redirectSeconds.value === null) {
      return;
    }

    redirectSeconds.value -= 1;
    if (redirectSeconds.value <= 0) {
      goToExamsNow();
    }
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval.value) {
    window.clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};

const startTimer = (startTime: string, durationMinutes: number) => {
  stopTimer();

  const startedAt = new Date(startTime).getTime();
  const endTime = startedAt + durationMinutes * 60 * 1000;

  const updateTimer = () => {
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    timeRemainingSeconds.value = remaining;

    if (remaining <= 0) {
      stopTimer();
      if (attempt.value && !submitting.value && !result.value) {
        void handleSubmit();
      }
    }
  };

  updateTimer();
  timerInterval.value = window.setInterval(updateTimer, 1000);
};

const loadAttempt = async () => {
  if (initPromise) {
    return initPromise;
  }

  if (!auth.isAuthenticated) {
    return;
  }

  if (!Number.isFinite(examId.value) || examId.value <= 0) {
    error.value = 'Mã đề thi không hợp lệ.';
    return;
  }

  loading.value = true;
  error.value = null;

  initPromise = (async () => {
    const draft = readDraft();

    if (draft) {
      attempt.value = draft.attempt;
      Object.assign(answers, draft.answers);
      tabSwitchCount.value = Number(draft.tabSwitchCount ?? 0);
    } else {
      const attemptResponse = await startAttempt(examId.value);
      const attemptPayload = attemptResponse.data?.data ?? attemptResponse.data;
      const attemptId = getAttemptIdFromPayload(attemptPayload);

      if (!attemptId) {
        throw new Error('Invalid start attempt payload');
      }

      attempt.value = {
        attemptId,
        examId: Number(attemptPayload.examId ?? examId.value),
        startTime: attemptPayload.startTime ?? attemptPayload.startedAt ?? new Date().toISOString(),
      };

      clearDraft();
      saveDraft();
    }

    const examResponse = await getExamById(examId.value);
    const examPayload = (examResponse.data?.data ?? examResponse.data) as ExamDetails | undefined;

    if (!examPayload) {
      throw new Error('Invalid exam detail payload');
    }

    examTitle.value = examPayload.title ?? '';
    questions.value = normalizeQuestions(examPayload.questions ?? []);

    if (!questions.value.length) {
      throw new Error('Exam has no questions');
    }

    attempt.value = {
      ...attempt.value!,
      durationMinutes: examPayload.duration ?? attempt.value?.durationMinutes,
    };

    if (attempt.value.startTime && attempt.value.durationMinutes) {
      startTimer(attempt.value.startTime, attempt.value.durationMinutes);
    }
  })();

  try {
    await initPromise;
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Không thể bắt đầu bài thi. Vui lòng thử lại.');
  } finally {
    initPromise = null;
    loading.value = false;
  }
};

const isSelected = (questionId: number, optionValue: string) => answers[questionId] === optionValue;

const handleVisibilityChange = () => {
  if (document.hidden) {
    if (isCheating.value) {
      // If already cheating, do nothing or log for further monitoring
      console.warn('Cheating already detected, ignoring further tab switches.'); //
      // If cheating is already detected, we still want to ensure the exam is submitted
      // and the cheating message persists.
      return;
    }

    tabSwitchCount.value += 1;
    console.log(`Tab switch detected. Current count: ${tabSwitchCount.value}`);

    // Report violation to the server
    if (attempt.value?.attemptId) {
      void reportViolation(attempt.value.attemptId, 'TAB_SWITCH').catch((err) => {
        console.error('Failed to report tab switch violation:', err);
      });
    }

    const MAX_TAB_SWITCHES = 7; // Define the threshold for cheating
    if (tabSwitchCount.value > MAX_TAB_SWITCHES) {
      isCheating.value = true;
      error.value = 'Bạn đã mở tab quá nhiều lần và bị phát hiện gian lận. Bài thi của bạn đã bị nộp.';
      console.warn('Cheating detected! Automatically submitting exam.');
      // Automatically submit the exam, ensuring the cheating error message is preserved.
      void handleSubmit();
    }
  }
};
 
const scrollToQuestion = (questionId: number) => {
  currentQuestionId.value = questionId;
  const element = document.getElementById(`q-${questionId}`);
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const handleSubmit = async () => {
  if (!attempt.value || submitting.value || result.value) { // Prevent multiple submissions or submitting after result
    return;
  }

  submitting.value = true;
  if (!isCheating.value) { // Only clear error if not a cheating-triggered submission
    error.value = null;
  }

  const payloadAnswers = questions.value.reduce<SubmitAnswerPayload[]>((accumulator, question) => {
      const answerValue = answers[question.id]?.trim() ?? '';
      if (!answerValue) {
        return accumulator;
      }

      if (question.options.length) {
        const matchedOption = question.options.find((option) => option.value === answerValue);
        const selectedOptionId = matchedOption?.optionId ?? null;

        if (!selectedOptionId) {
          return accumulator;
        }

        accumulator.push({
          questionId: question.id,
          selectedOptionId,
          essayAnswer: null,
        });

        return accumulator;
      }

      accumulator.push({
        questionId: question.id,
        selectedOptionId: null,
        essayAnswer: answerValue,
      });

      return accumulator;
    }, []);

  try {
    const response = await submitAttempt(attempt.value.attemptId, {
      answers: payloadAnswers,
      tabSwitchCount: tabSwitchCount.value, // Always send tab switch count
      violationScore: isCheating.value ? 1 : 0, // Send violation score if cheating is detected
    });
    result.value = mapSubmitResult(response.data?.data ?? response.data);
    stopTimer();
    clearDraft();
    startRedirectCountdown();
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Nộp bài thất bại. Vui lòng thử lại.');
  } finally {
    submitting.value = false;
  }
};

watch(
  answers,
  () => {
    if (attempt.value) {
      saveDraft();
    }
  },
  { deep: true },
);

watch(
  questions,
  (nextQuestions) => {
    const firstQuestion = nextQuestions[0];
    currentQuestionId.value = firstQuestion ? firstQuestion.id : null;
  },
  { immediate: true },
);

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
  void loadAttempt();
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  stopTimer();
  clearRedirectTimer();
});
</script>
