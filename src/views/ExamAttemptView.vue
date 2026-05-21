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

  <!-- Image Zoom Overlay -->
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 backdrop-blur-0"
      enter-to-class="opacity-100 backdrop-blur-md"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 backdrop-blur-md"
      leave-to-class="opacity-0 backdrop-blur-0"
    >
      <div v-if="zoomImageUrl" class="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/90 p-4 md:p-10" @click="zoomImageUrl = null">
        <button 
          @click="zoomImageUrl = null"
          class="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
        <img 
          :src="zoomImageUrl" 
          class="max-h-full max-w-full rounded-2xl shadow-2xl object-contain animate-scale-in" 
          @click.stop
        />
      </div>
    </transition>
  </teleport>

<div class="text-slate-900 pb-12 pt-[105px] sm:pt-[95px] max-w-7xl mx-auto px-2 sm:px-4">
    <!-- Fixed Header -->
    <div class="fixed top-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-2xl border-b border-white/50 shadow-lg shadow-indigo-500/5">
      <div class="max-w-7xl mx-auto w-full flex flex-col">
        <!-- Header row -->
        <div class="flex items-center justify-between gap-3 px-4 py-3 sm:px-10 sm:py-4">
          <div class="flex items-center gap-6">
            <router-link
              to="/exams"
              class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-400 shadow-sm transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
              aria-label="Quay lại"
            >
              <i class="fa-solid fa-arrow-left text-sm" aria-hidden="true"></i>
            </router-link>

            <div class="min-w-0 flex-1">
              <p class="m-0 text-lg font-black tracking-tight text-slate-900 sm:text-3xl truncate">{{ examTitle || 'Làm bài thi' }}</p>
            </div>

            <div class="flex items-center gap-2 sm:gap-3 rounded-2xl bg-indigo-50 px-3 py-2 sm:px-5 sm:py-2.5 shadow-inner">
               <i class="fa-regular fa-clock text-indigo-500 text-sm sm:text-lg animate-pulse"></i>
              <span class="text-base sm:text-xl font-black text-indigo-700 tabular-nums">{{ timeLabel }}</span>
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
              class="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl bg-indigo-600 px-4 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
            >
              <span class="relative z-10">{{ submitting ? '...' : 'Nộp bài' }}</span>
              <i class="fa-solid fa-paper-plane text-[10px] sm:text-xs relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <section>

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
        Bài làm của bạn đang được <strong>hệ thống chấm điểm chi tiết</strong>. Hệ thống sẽ chuyển bạn sang trang kết quả sau {{ redirectSeconds ?? 0 }} giây.
      </p>
      <div v-if="streakCheckedIn" class="mt-4 flex items-center gap-2 text-orange-600 bg-orange-100/50 px-3 py-2 rounded-lg text-sm font-bold w-fit">
        <i class="fa-solid fa-fire text-orange-500"></i> Bạn đã giữ lửa ôn thi thành công hôm nay!
      </div>
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

    <div v-else-if="attempt" class="relative mt-8 lg:pr-[360px]">
      <!-- Left Side: Questions list -->
      <form class="space-y-12 w-full" @submit.prevent="handleSubmit">
        <div v-for="(section, sIndex) in sections" :key="sIndex" class="space-y-6">
          <div v-if="section.title" class="flex items-center gap-4">
            <div class="h-px grow bg-slate-100"></div>
            <h3 class="m-0 text-sm font-black uppercase tracking-[0.3em] text-indigo-500 bg-white px-4">
              {{ section.title }}
            </h3>
            <div class="h-px grow bg-slate-100"></div>
          </div>

          <!-- Single Continuous White Paper Sheet (Standard / Mixed Exams) -->
          <div 
            v-if="uiLayoutHint !== 'LITERATURE' && uiLayoutHint !== 'ESSAY'"
            class="bg-white rounded-3xl border border-slate-100/80 shadow-xl shadow-slate-200/40 p-6 sm:p-10 divide-y divide-slate-100 max-w-4xl mx-auto"
          >
            <QuestionCard
              v-for="(question, index) in section.questions"
              :key="question.id"
              :id="question.id"
              :index="questions.findIndex(q => q.id === question.id) + 1"
              :content="question.content"
              :content-format="question.contentFormat"
              :image-url="question.imageUrl"
              :options="question.options"
              v-model="answers[question.id]"
              :ui-layout-hint="uiLayoutHint"
              :animation-delay="Number(index) * 40"
              :paper-mode="true"
              @select="answers[question.id] = $event"
              @zoom="zoomImageUrl = $event"
              @focus="currentQuestionId = question.id"
            />
          </div>

          <!-- Special Literature & Essay Views (Separate pages) -->
          <div 
            v-else
            class="grid gap-6 items-stretch grid-cols-1 max-w-5xl mx-auto px-4 sm:px-8"
          >
            <QuestionCard
              v-for="(question, index) in section.questions"
              :key="question.id"
              :id="question.id"
              :index="questions.findIndex(q => q.id === question.id) + 1"
              :content="question.content"
              :content-format="question.contentFormat"
              :image-url="question.imageUrl"
              :options="question.options"
              v-model="answers[question.id]"
              :ui-layout-hint="uiLayoutHint"
              :animation-delay="Number(index) * 40"
              @select="answers[question.id] = $event"
              @zoom="zoomImageUrl = $event"
              @focus="currentQuestionId = question.id"
            />
          </div>
        </div>
      </form>

      <!-- Right Side: Fixed Matrix Card (Desktop only) -->
      <div class="hidden lg:block fixed-sidebar-matrix">
        <div class="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-100 p-5 shadow-xl shadow-indigo-500/5">
          <div class="flex items-center justify-between mb-4">
            <p class="m-0 text-xs font-black uppercase tracking-widest text-slate-400">Tiến độ bài làm</p>
            <span class="text-xs font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg">
              {{ answeredCount }}/{{ questions.length }}
            </span>
          </div>

          <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
            <div 
              class="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
              :style="{ width: (answeredCount / (questions.length || 1)) * 100 + '%' }"
            ></div>
          </div>

          <div class="max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="(question, index) in questions"
                :key="`matrix-${question.id}`"
                type="button"
                @click="scrollToQuestion(question.id)"
                :class="[
                  'h-10 w-full rounded-xl border text-xs font-black transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center',
                  currentQuestionId === question.id
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : answers[question.id]
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:border-slate-200',
                ]"
              >
                {{ Number(index) + 1 }}
              </button>
            </div>
          </div>

          <div class="border-t border-slate-50 mt-5 pt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <div class="flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Đã làm</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-slate-200"></span>
              <span>Chưa làm</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Đang chọn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  </div>

  <!-- Mobile Floating Matrix Trigger -->
  <div v-if="attempt" class="lg:hidden fixed bottom-6 right-6 z-50">
    <button
      type="button"
      @click="showMobileMatrix = true"
      class="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 transition active:scale-95"
    >
      <i class="fa-solid fa-list-ol text-lg"></i>
      <!-- Badge with count -->
      <span class="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white border-2 border-white">
        {{ answeredCount }}
      </span>
    </button>
  </div>

  <!-- Mobile Matrix Drawer -->
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-full"
    >
      <div v-if="showMobileMatrix" class="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-end justify-center p-4 lg:hidden h-full" @click="showMobileMatrix = false">
        <div class="w-full max-w-md bg-white rounded-t-[2.5rem] rounded-b-none p-6 shadow-2xl animate-slide-up-reveal" @click.stop>
          <!-- Drawer handle bar -->
          <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
          
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div>
              <h4 class="m-0 text-lg font-black text-slate-900">Danh sách câu hỏi</h4>
              <p class="m-0 text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">Đã làm: {{ answeredCount }}/{{ questions.length }} câu</p>
            </div>
            <button 
              type="button"
              @click="showMobileMatrix = false"
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <!-- Grid Matrix -->
          <div class="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar mb-6">
            <div class="grid grid-cols-5 gap-2.5">
              <button
                v-for="(question, index) in questions"
                :key="`matrix-mobile-${question.id}`"
                type="button"
                @click="scrollToQuestion(question.id); showMobileMatrix = false"
                :class="[
                  'h-11 w-full rounded-xl border text-xs font-black transition active:scale-95 flex items-center justify-center',
                  currentQuestionId === question.id
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : answers[question.id]
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                      : 'border-slate-100 bg-slate-50 text-slate-400',
                ]"
              >
                {{ Number(index) + 1 }}
              </button>
            </div>
          </div>

          <!-- Legends -->
          <div class="flex gap-4 text-[10px] font-black uppercase tracking-wider text-slate-400 justify-center">
            <div class="flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Đã làm</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-slate-200"></span>
              <span>Chưa làm</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Đang chọn</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios';
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { startAttempt, submitAttempt, getAttemptById, reportViolation, getMyAttempts } from '@/services/attemptService';
import { getExamById } from '@/services/examService';
import { checkInStreak } from '@/services/userService';
import QuestionEditModal from '@/components/admin/QuestionEditModal.vue';
import MathContent from '@/components/common/MathContent.vue';
import QuestionCard from '@/components/common/QuestionCard.vue';

type AttemptQuestion = {
  id: number;
  content: string;
  contentFormat?: 'PLAIN_TEXT' | 'LATEX';
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
  contentFormat?: 'PLAIN_TEXT' | 'LATEX';
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
  uiLayoutHint?: 'STANDARD' | 'LITERATURE' | 'ESSAY' | 'MIXED';
  sections?: Array<{ title: string; questions: any[] }>;
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
const timerInterval = ref<number | null>(null);
const redirectSeconds = ref<number | null>(null);
const redirectInterval = ref<number | null>(null);
const tabSwitchCount = ref(0);
const isCheating = ref(false); // New ref to track cheating status
const streakCheckedIn = ref(false);
const uiLayoutHint = ref<'STANDARD' | 'LITERATURE' | 'ESSAY' | 'MIXED'>('STANDARD');
const sections = ref<Array<{ title: string; questions: AttemptQuestion[] }>>([]);
const answers = reactive<Record<number, string>>({});
const zoomImageUrl = ref<string | null>(null);
const showMobileMatrix = ref(false);
let initPromise: Promise<void> | null = null;

// Admin Edit Logic (Removed)

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
    // Check multiple possible field names for options
    const rawOptions = item.options || (item as any).questionOptions || (item as any).choices || [];
    const options = Array.isArray(rawOptions) ? rawOptions : [];
    const questionContent = item.questionContent ?? item.contentSnapshot ?? item.content ?? '';

    return {
      id: Number(item.questionId ?? item.id),
      content: String(questionContent),
      contentFormat: item.contentFormat,
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
  if (redirectInterval.value != null) {
    window.clearInterval(redirectInterval.value);
    redirectInterval.value = null;
  }
};

const goToExamsNow = () => {
  clearRedirectTimer();
  if (result.value?.id) {
    router.push(`/attempts/${result.value.id}/performance`);
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
  }, 1000) as unknown as number;
};

const stopTimer = () => {
  if (timerInterval.value != null) {
    window.clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};

const startTimer = (startTime: string, durationMinutes: number) => {
  stopTimer();

  const startedAt = new Date(startTime).getTime();
  const endTime = startedAt + durationMinutes * 60 * 1000;
  
  // Flag to prevent immediate submission on first tick due to clock skew
  let isFirstTick = true;

  const updateTimer = () => {
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
    timeRemainingSeconds.value = remaining;

    if (remaining <= 0) {
      stopTimer();
      
      // If it's the very first tick and the attempt is "new" (started < 30s ago), 
      // don't auto-submit. This handles server-client clock skew.
      const isVeryRecent = (now - startedAt) < 30000;
      if (isFirstTick && isVeryRecent) {
        console.warn('Timer started at <= 0 but attempt is very recent. Ignoring auto-submit to allow for clock skew.');
        timeRemainingSeconds.value = 1; // Give it at least 1s
        isFirstTick = false;
        return;
      }

      if (attempt.value && !submitting.value && !result.value) {
        void handleSubmit();
      }
    }
    isFirstTick = false;
  };

  updateTimer();
  timerInterval.value = window.setInterval(updateTimer, 1000) as unknown as number;
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
      // Step 1: Check if there's an ongoing (DOING) attempt for this exam
      console.log('[loadAttempt:checkExisting] Checking for ongoing attempts...');
      let ongoingAttempt = null;
      
      try {
        const existingAttemptsResponse = await getMyAttempts({ 
          status: 'DOING',
          size: 50 // Get more to be sure
        });
        
        const content = existingAttemptsResponse.data?.data?.content || existingAttemptsResponse.data?.content || [];
        // Manual filter to be 100% sure we match the current exam
        ongoingAttempt = content.find((a: any) => Number(a.examId) === Number(examId.value));
      } catch (e) {
        console.warn('[loadAttempt:checkExisting] Failed to pre-check attempts:', e);
      }

      let attemptPayload;
      if (ongoingAttempt) {
        console.log('[loadAttempt:continue] Found ongoing attempt via pre-check:', ongoingAttempt);
        attemptPayload = ongoingAttempt;
      } else {
        try {
          // Step 2: If no ongoing attempt found, try to start a new one
          console.log('[loadAttempt:start] No ongoing attempt. Starting new one...');
          const attemptResponse = await startAttempt(examId.value);
          attemptPayload = attemptResponse.data?.data ?? attemptResponse.data;
        } catch (err: any) {
          // Step 3: Handle the case where backend says it exists even if pre-check missed it
          const errMsg = err.response?.data?.message || err.message || '';
          if (errMsg.includes('chưa nộp') || errMsg.includes('already has a doing attempt') || err.response?.status === 400) {
            console.log('[loadAttempt:fallback] Backend reported existing attempt. Fetching all DOING attempts to find match...');
            const fallbackResponse = await getMyAttempts({ status: 'DOING', size: 100 });
            const fallbackContent = fallbackResponse.data?.data?.content || fallbackResponse.data?.content || [];
            
            // Try to find by examId first, if not find the most recent DOING one
            ongoingAttempt = fallbackContent.find((a: any) => Number(a.examId ?? a.exam?.id) === Number(examId.value));
            
            if (!ongoingAttempt && fallbackContent.length > 0) {
              // If still not found by ID, maybe the backend doesn't return examId in the list, 
              // take the first DOING one as a last resort if it's the only one
              ongoingAttempt = fallbackContent[0];
            }

            if (ongoingAttempt) {
              console.log('[loadAttempt:fallback:success] Found attempt to resume:', ongoingAttempt);
              attemptPayload = ongoingAttempt;
            } else {
              throw err; 
            }
          } else {
            throw err;
          }
        }
      }

      const attemptId = getAttemptIdFromPayload(attemptPayload);
      if (!attemptId) {
        console.error('[loadAttempt:error] No attemptId in payload:', attemptPayload);
        throw new Error('Invalid attempt payload');
      }

      attempt.value = {
        attemptId,
        examId: Number(attemptPayload.examId ?? examId.value),
        startTime: attemptPayload.startTime ?? attemptPayload.startedAt ?? new Date().toISOString(),
      };

      // (Optional) If the backend returns answers in the ongoing attempt, restore them
      if (ongoingAttempt?.answers && Array.isArray(ongoingAttempt.answers)) {
        ongoingAttempt.answers.forEach((ans: any) => {
          if (ans.questionId) {
            const val = ans.selectedOptionId ? String(ans.selectedOptionId) : (ans.essayAnswer || '');
            if (val) answers[ans.questionId] = val;
          }
        });
      }

      clearDraft();
      saveDraft();
    }

    console.log('[loadAttempt:step2] Calling getExamById for examId:', examId.value);
    const examResponse = await getExamById(examId.value);
    console.log('[loadAttempt:step2] getExamById success:', examResponse);
    const examPayload = (examResponse.data?.data ?? examResponse.data) as ExamDetails | undefined;

    if (!examPayload) {
      throw new Error('Invalid exam detail payload');
    }

    examTitle.value = examPayload.title ?? '';
    uiLayoutHint.value = examPayload.uiLayoutHint ?? 'STANDARD';
    const allQuestions = normalizeQuestions(examPayload.questions ?? []);
    questions.value = allQuestions;

    if (examPayload.sections && examPayload.sections.length > 0) {
      sections.value = examPayload.sections.map(s => {
        const sectionQuestionIds = (s.questions || []).map((sq: any) => sq.questionId || sq.id);
        return {
          title: s.title,
          questions: allQuestions.filter(q => sectionQuestionIds.includes(q.id))
        };
      });
    } else {
      sections.value = [{ title: '', questions: allQuestions }];
    }

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
    console.error('[loadAttempt:error]', err);
    error.value = getApiErrorMessage(err, 'Không thể bắt đầu bài thi. Vui lòng thử lại.');
  } finally {
    initPromise = null;
    loading.value = false;
  }
};

const isSelected = (questionId: number, optionValue: string) => answers[questionId] === optionValue;

const handleVisibilityChange = () => {
  if (document.hidden) {
    if (isCheating.value || result.value) {
      return;
    }

    tabSwitchCount.value += 1;
    console.log(`Tab switch detected. Current count: ${tabSwitchCount.value}`);

    if (attempt.value?.attemptId) {
      void reportViolation(attempt.value.attemptId, 'TAB_SWITCH').catch((err) => {
        console.error('Failed to report tab switch violation:', err);
      });
    }

    const MAX_TAB_SWITCHES = 15; // Increased threshold
    if (tabSwitchCount.value > MAX_TAB_SWITCHES) {
      isCheating.value = true;
      error.value = 'Bạn đã mở tab quá nhiều lần và bị phát hiện gian lận. Bài thi của bạn đã bị nộp.';
      console.warn('Cheating detected! Automatically submitting exam.');
      void handleSubmit();
    }
  }
};
 
const scrollToQuestion = (questionId: number) => {
  currentQuestionId.value = questionId;
  const element = document.getElementById(`q-${questionId}`);
  if (element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = rect.top + scrollTop - 92;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }
};

const handleSubmit = async () => {
  if (!attempt.value || submitting.value || result.value) {
    return;
  }

  submitting.value = true;
  try {
    if (!isCheating.value) {
      error.value = null;
    }

    const payloadAnswers = questions.value.reduce<SubmitAnswerPayload[]>((accumulator, question) => {
      // Ensure we have a string to trim
      const rawVal = answers[question.id];
      const answerValue = (typeof rawVal === 'string' ? rawVal : String(rawVal ?? '')).trim();
      
      if (!answerValue) {
        return accumulator;
      }

      if (question.options && question.options.length > 0) {
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
      } else {
        accumulator.push({
          questionId: question.id,
          selectedOptionId: null,
          essayAnswer: answerValue,
        });
      }

      return accumulator;
    }, []);

    const response = await submitAttempt(attempt.value.attemptId, {
      answers: payloadAnswers,
      tabSwitchCount: tabSwitchCount.value,
      violationScore: isCheating.value ? 1 : 0,
    });
    
    result.value = mapSubmitResult(response.data?.data ?? response.data);
    
    // Celebration effects
    if (typeof (window as any).confetti === 'function') {
      (window as any).confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#4f46e5', '#06b6d4', '#10b981']
      });
      
      setTimeout(() => {
        (window as any).confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#ef4444', '#8b5cf6']
        });
      }, 300);
    }

    // Success sound
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
      audio.volume = 0.5;
      void audio.play();
    } catch (e) {
      console.warn('Failed to play success sound:', e);
    }

    if (!auth.user?.activeToday) {
      try {
        await checkInStreak();
        streakCheckedIn.value = true;
        auth.setUser({ activeToday: true });
      } catch (err) {
        console.warn('Failed to check-in streak:', err);
      }
    }

    stopTimer();
    clearDraft();
    startRedirectCountdown();
  } catch (err) {
    console.error('[handleSubmit:error]', err);
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
  // Delay visibility monitoring to avoid issues during page transition
  setTimeout(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }, 2000);
  
  void loadAttempt();
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  stopTimer();
  clearRedirectTimer();
});
</script>

<style scoped>
.fixed-sidebar-matrix {
  position: fixed;
  top: 92px;
  width: 320px;
  right: 24px;
  z-index: 40;
}
@media (min-width: 1328px) {
  .fixed-sidebar-matrix {
    right: calc((100vw - 1280px) / 2 + 24px);
  }
}
</style>
