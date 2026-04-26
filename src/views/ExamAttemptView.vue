<template>
  <section class="space-y-4 text-slate-800">
    <div class="sticky top-3 z-20 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <router-link
            to="/exams"
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
            aria-label="Quay lại"
          >
            <i class="fa-solid fa-angle-left text-sm" aria-hidden="true"></i>
          </router-link>

          <div>
            <p class="m-0 text-lg font-extrabold text-slate-900 sm:text-2xl">{{ examTitle || 'Làm bài thi' }}</p>
          </div>

          <span class="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
            <i class="fa-regular fa-clock"></i>
            {{ timeLabel }}
          </span>
        </div>

        <div class="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <p class="m-0"><span class="text-emerald-600">{{ answeredCount }}</span> Đã làm</p>
          <p class="m-0"><span class="text-slate-400">{{ remainingCount }}</span> Còn lại</p>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="submitting || !attempt"
            class="inline-flex items-center rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,185,129,0.35)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ submitting ? 'ĐANG NỘP...' : 'NỘP BÀI' }}
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="m-0 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">CÂU HỎI: PHẦN 1</p>
        <p class="m-0 text-xs font-semibold text-slate-500">{{ answeredCount }} xong - {{ remainingCount }} còn</p>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <button
          v-for="(question, index) in questions"
          :key="`nav-${question.id}`"
          type="button"
          @click="scrollToQuestion(question.id)"
          :class="[
            'h-8 w-8 rounded-full border text-xs font-bold transition',
            currentQuestionId === question.id
              ? 'border-sky-500 bg-sky-500 text-white'
              : answers[question.id]
                ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100',
          ]"
        >
          {{ index + 1 }}
        </button>
      </div>
    </div>

    <div
      v-if="!auth.isAuthenticated"
      class="liquid-glass liquid-border rounded-2xl border border-amber-300/40 bg-amber-500/10 p-5 text-amber-100"
    >
      Bạn cần đăng nhập để bắt đầu làm bài.
    </div>

    <div
      v-else-if="loading"
      class="liquid-glass liquid-border rounded-2xl p-6 text-center text-blue-100"
    >
      Đang khởi tạo bài thi...
    </div>

    <div
      v-else-if="error"
      class="liquid-glass liquid-border rounded-2xl border border-rose-300/40 bg-rose-500/10 p-5 text-rose-100"
    >
      {{ error }}
    </div>

    <div
      v-if="result"
      class="liquid-glass liquid-border rounded-2xl border border-emerald-300/35 bg-emerald-500/10 p-5 text-emerald-100"
    >
      <h3 class="m-0 text-xl font-extrabold">Chúc mừng, bạn đã nộp bài thành công!</h3>
      <p class="mb-0 mt-2 text-sm text-emerald-100/90">
        Hệ thống sẽ chuyển bạn về trang danh sách đề sau {{ redirectSeconds ?? 0 }} giây.
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          @click="goToExamsNow"
          class="inline-flex items-center gap-2 rounded-xl border border-emerald-200/60 bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400/30"
        >
          <i class="fa-solid fa-list-check text-xs" aria-hidden="true"></i>
          Về danh sách đề ngay
        </button>
      </div>
    </div>

    <form v-else-if="attempt" class="space-y-4" @submit.prevent="handleSubmit">
      <article
        v-for="(question, index) in questions"
        :id="`q-${question.id}`"
        :key="question.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.05)]"
      >
        <div class="mb-2 flex items-center justify-between gap-3">
          <p class="m-0 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-emerald-600">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-700">{{ index + 1 }}</span>
            Câu hỏi
          </p>
        </div>

        <h2 class="mb-0 mt-2 text-base font-bold leading-relaxed text-slate-800 sm:text-lg">
          {{ question.content }}
        </h2>

        <div v-if="question.imageUrl" class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <img
            :src="question.imageUrl"
            :alt="question.content"
            class="max-h-[360px] w-full rounded-xl object-contain"
            loading="lazy"
          />
        </div>

        <div v-if="question.options.length" class="mt-4 grid gap-2 sm:grid-cols-2">
          <label
            v-for="option in question.options"
            :key="`${question.id}-${option.value}`"
            @click="currentQuestionId = question.id"
            :class="[
              'flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition',
              isSelected(question.id, option.value)
                ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-[0_0_0_1px_rgba(14,165,233,0.25)]'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            ]"
          >
            <input
              v-model="answers[question.id]"
              :value="option.value"
              type="radio"
              :name="`question-${question.id}`"
              class="h-4 w-4 accent-sky-500"
            />
            <span class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-xs font-bold uppercase">
              {{ String.fromCharCode(65 + question.options.findIndex((x) => x.value === option.value)) }}
            </span>
            <span class="font-medium">{{ option.label }}</span>
          </label>
        </div>

        <div v-else class="mt-4">
          <input
            v-model="answers[question.id]"
            @focus="currentQuestionId = question.id"
            type="text"
            :placeholder="`Nhập đáp án cho câu ${index + 1}`"
            class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400"
          />
        </div>
      </article>
    </form>

    <div
      v-if="result"
      class="liquid-glass liquid-border rounded-2xl border border-emerald-300/35 bg-emerald-500/10 p-5 text-emerald-100"
    >
      <h3 class="m-0 text-lg font-bold">Kết quả bài thi</h3>
      <div class="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <p class="m-0">Mã bài làm: <strong>{{ result.id }}</strong></p>
        <p class="m-0">Điểm: <strong>{{ result.score ?? '-' }}</strong></p>
        <p class="m-0">Đúng/Sai: <strong>{{ result.correctCount ?? 0 }}/{{ result.wrongCount ?? 0 }}</strong></p>
        <p class="m-0">Tổng câu: <strong>{{ result.totalQuestions ?? questions.length }}</strong></p>
        <p class="m-0">Trạng thái: <strong>{{ result.status ?? 'SUBMITTED' }}</strong></p>
        <p class="m-0">Thời gian làm: <strong>{{ formatTime(result.durationTaken ?? 0) }}</strong></p>
      </div>
    </div>
  </section>
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
  router.push('/exams');
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
