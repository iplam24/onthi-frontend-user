<template>
  <section class="mx-auto w-full max-w-6xl space-y-6 px-2 sm:px-4">
    <p v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
      {{ error }}
    </p>

    <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
      Đang tải dữ liệu môn học và đề thi...
    </div>

    <div
      v-else-if="!subjectSummaries.length"
      class="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600"
    >
      Hiện chưa có đề thi nào khả dụng.
    </div>

    <template v-else>
      <div v-if="!selectedSubject" class="space-y-8">
        <header class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 class="m-0 text-4xl font-extrabold tracking-tight text-slate-900">Chọn môn học</h1>
            <p class="mb-0 mt-2 text-xl font-medium text-slate-500">Hệ thống luyện thi THPT Quốc gia thông minh</p>
          </div>

          <router-link
            to="/"
            class="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold tracking-[0.08em] text-slate-500 transition hover:bg-slate-50"
          >
            <i class="fa-solid fa-arrow-left text-xs" aria-hidden="true"></i>
            TRANG CHỦ
          </router-link>
        </header>

        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="subject in subjectSummaries"
            :key="subject.name"
            class="group rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.1)]"
          >
            <div class="flex items-start justify-between gap-3">
              <p class="m-0 text-sm font-black uppercase tracking-[0.12em] text-slate-400">{{ subject.levelName }}</p>
              <span :class="['mt-1 h-2.5 w-2.5 rounded-full', subject.dotClass]"></span>
            </div>

            <div v-if="subject.imageUrl" class="mt-3">
              <img :src="subject.imageUrl" :alt="subject.name" class="h-24 w-full object-contain" />
            </div>

            <h2 class="mb-0 mt-3 text-[2rem] font-extrabold leading-none text-slate-900">{{ subject.name }}</h2>

            <div class="mt-5 space-y-2 text-sm font-semibold text-slate-400">
              <p class="m-0 inline-flex items-center gap-2">
                <i class="fa-regular fa-clock text-xs" aria-hidden="true"></i>
                {{ subject.durationLabel }}
              </p>
              <p class="m-0 inline-flex items-center gap-2">
                <i class="fa-solid fa-layer-group text-xs" aria-hidden="true"></i>
                {{ subject.count }} đề thi
              </p>
            </div>

            <button
              type="button"
              @click="openSubject(subject.name)"
              class="mt-8 inline-flex w-full items-center justify-between border-t border-slate-100 pt-4 text-sm font-black tracking-[0.05em] text-emerald-600 transition group-hover:text-emerald-700"
            >
              <span>VÀO THI NGAY</span>
              <i class="fa-solid fa-angle-right text-base" aria-hidden="true"></i>
            </button>
          </article>

          <article class="grid place-content-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-slate-300">
            <p class="m-0 text-sm font-black uppercase tracking-[0.12em]">Cập nhật thêm...</p>
          </article>
        </div>
      </div>

      <div v-else class="space-y-6">
        <button
          type="button"
          @click="selectedSubject = ''"
          class="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-slate-400 transition hover:text-slate-600"
        >
          <i class="fa-solid fa-arrow-left text-xs" aria-hidden="true"></i>
          Quay lại môn học
        </button>

        <header class="flex items-center gap-4">
          <div class="grid h-14 w-14 place-content-center rounded-2xl bg-white text-2xl font-black text-sky-500 shadow-[0_8px_20px_rgba(15,23,42,0.09)]">
            {{ selectedSubjectInitial }}
          </div>

          <div>
            <h1 class="m-0 text-5xl font-extrabold leading-none text-slate-900">{{ selectedSubject }}</h1>
            <p class="mb-0 mt-2 text-sm font-bold uppercase tracking-[0.1em] text-slate-400">Danh sách đề thi hiện có</p>
          </div>
        </header>

        <div v-if="!selectedSubjectExams.length" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
          Môn này hiện chưa có đề thi.
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="exam in selectedSubjectExams"
            :key="exam.id"
            class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:px-5"
          >
            <div class="min-w-[260px] flex-1">
              <h3 class="mb-0 mt-3 text-xl font-extrabold text-slate-800">{{ exam.title }}</h3>

              <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
                <p class="m-0 inline-flex items-center gap-1.5">
                  <i class="fa-regular fa-clock" aria-hidden="true"></i>
                  {{ exam.duration }} phút
                </p>
                <p class="m-0 inline-flex items-center gap-1.5">
                  <i class="fa-solid fa-list-check" aria-hidden="true"></i>
                  {{ exam.maxAttempts ?? 1 }} lượt
                </p>
                <p class="m-0 inline-flex items-center gap-1.5">
                  <i class="fa-solid fa-circle-dot" aria-hidden="true"></i>
                  {{ exam.isActive ? 'Đang mở' : 'Đã đóng' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                @click="startExam(exam)"
                :disabled="!canStartExam(exam)"
                class="rounded-xl bg-blue-500 px-7 py-3 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(59,130,246,0.35)] transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {{ canStartExam(exam) ? 'Vào thi' : getStartBlockedReason(exam) }}
              </button>
              <button
                type="button"
                @click="startExam(exam)"
                :disabled="!canStartExam(exam)"
                class="grid h-10 w-10 place-content-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 disabled:cursor-not-allowed"
                aria-label="Vào thi"
              >
                <i class="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </article>
        </div>

        <div class="flex justify-end">
          <button
            @click="refreshData"
            :disabled="loading"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i class="fa-solid fa-rotate-right text-xs" aria-hidden="true"></i>
            Làm mới danh sách
          </button>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getAllExams } from '@/services/examService';
import { getMyAttempts } from '@/services/attemptService';
import { getSubjects, type SubjectItem } from '@/services/learningService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.00.0.1:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveAssetUrl = (assetUrl?: string) => {
  if (!assetUrl) return undefined;
  return /^https?:\/\//i.test(assetUrl) ? assetUrl : `${BACKEND_ORIGIN}${assetUrl.startsWith('/') ? '' : '/'}${assetUrl}`;
};

type ExamItem = {
  id: number;
  title: string;
  subjectName?: string;
  duration: number;
  totalQuestions?: number;
  maxAttempts?: number;
  type: string;
  isActive: boolean;
};

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
const router = useRouter();

const loading = ref(false);
const error = ref<string | null>(null);
const exams = ref<ExamItem[]>([]);
const subjects = ref<SubjectItem[]>([]); // New ref for subjects
const selectedSubject = ref<string>('');
const dotPalette = ['bg-blue-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500'];

const myAttempts = ref<AttemptItem[]>([]);

const subjectSummaries = computed(() => {
  const map = new Map<string, { count: number; totalDuration: number }>();
  for (const exam of exams.value) {
    const name = exam.subjectName?.trim() || 'Khác';
    const current = map.get(name) ?? { count: 0, totalDuration: 0 };
    current.count += 1;
    current.totalDuration += Number(exam.duration ?? 0);
    map.set(name, current);
  }
  
  // Use the fetched subjects as the base for summaries
  return subjects.value
    .map((subject) => {
      const name = subject.name.trim();
      const stats = map.get(name) ?? { count: 0, totalDuration: 0 };
      const averageDuration = stats.count ? Math.round(stats.totalDuration / stats.count) : 0;
      const index = subjects.value.findIndex(s => s.name.trim() === name); // Get index for dotClass
      return {
        name,
        imageUrl: resolveAssetUrl(subject.imageUrl), // Add image URL
        levelName: subject.levelName, // Add levelName
        count: stats.count,
        durationLabel: `${averageDuration || 0} phút`,
        dotClass: dotPalette[index % dotPalette.length],
      };
    })
    // .filter(subject => subject.count > 0) // Removed: Show all subjects, even those without exams
    .sort((a, b) => a.name.localeCompare(b.name));
});

const selectedSubjectInitial = computed(() => {
  if (!selectedSubject.value) {
    return 'S';
  }

  return selectedSubject.value.trim().charAt(0).toUpperCase() || 'S';
});

const selectedSubjectExams = computed(() => {
  if (!selectedSubject.value) {
    return [];
  }

  return exams.value.filter((exam) => (exam.subjectName?.trim() || 'Khác') === selectedSubject.value);
});

const loadSubjects = async () => {
  // error.value = null; // Error handling is done in refreshData
  try {
    const response = await getSubjects();
    subjects.value = Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (err) {
    error.value = 'Không thể tải danh sách môn học. Vui lòng thử lại.';
    subjects.value = [];
  }
};

// Combine loadExams and loadSubjects into refreshData
// to ensure subjects are loaded before exams are processed for summaries.
// The original loadExams is now part of refreshData.
const loadExams = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await getAllExams({
      page: 0,
      size: 100,
      sort: 'id,desc',
    });

    const payload = response.data?.data ?? {};
    exams.value = Array.isArray(payload.items) ? payload.items : [];

    if (subjects.value.length) { // Check against loaded subjects
      const availableSubjects = new Set(subjects.value.map(s => s.name.trim() || 'Khác'));
      const currentSelectedSubject = selectedSubject.value;

      // If no subject is selected or the selected subject is no longer available,
      // default to the first subject in the list of available subjects.
      if (!currentSelectedSubject || (currentSelectedSubject && !availableSubjects.has(currentSelectedSubject))) {
        selectedSubject.value = exams.value[0].subjectName?.trim() || 'Khác';
      }
    } else {
      selectedSubject.value = '';
    }
  } catch (err) {
    error.value = 'Không thể tải danh sách đề thi. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};

const loadMyAttempts = async () => {
  if (!auth.isAuthenticated) {
    myAttempts.value = [];
    return;
  }

  try {
    const response = await getMyAttempts({
      page: 0,
      size: 10,
      sort: 'startedAt,DESC',
    });
    const payload = response.data?.data ?? {};
    myAttempts.value = Array.isArray(payload.items) ? payload.items : [];
  } catch (err) {
    myAttempts.value = [];
  }
};

const getAttemptCountByExam = (examId: number) => {
  return myAttempts.value.filter((attempt) => attempt.examId === examId).length;
};

const canStartExam = (exam: ExamItem) => {
  if (!exam.isActive) {
    return false;
  }

  if (!auth.isAuthenticated) {
    return true;
  }

  if (!auth.isAuthenticated) {
    return true;
  }

  if (!exam.maxAttempts || exam.maxAttempts <= 0) {
    return true;
  }

  return getAttemptCountByExam(exam.id) < exam.maxAttempts;
};

const getStartBlockedReason = (exam: ExamItem) => {
  if (!exam.isActive) {
    return 'Đề đang đóng';
  }

  if (!auth.isAuthenticated) {
    return 'Đăng nhập để làm bài';
  }

  if (auth.isAuthenticated && exam.maxAttempts && getAttemptCountByExam(exam.id) >= exam.maxAttempts) {
    return 'Đã hết lượt làm';
  }

  return 'Không thể bắt đầu';
};

const startExam = (exam: ExamItem) => {
  if (!canStartExam(exam)) {
    return;
  }

  router.push(`/exams/${exam.id}/attempt`);
};

const openSubject = (subject: string) => {
  selectedSubject.value = subject;
};

const refreshData = async () => {
  loading.value = true;
  error.value = null;
  await Promise.all([loadSubjects(), loadExams(), loadMyAttempts()]); // Ensure subjects are loaded first
  loading.value = false;
};

watch(
  () => auth.isAuthenticated,
  () => {
    loadMyAttempts();
  },
);

onMounted(() => {
  void refreshData();
});
</script>
