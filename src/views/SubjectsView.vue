<template>
  <section class="space-y-6" style="animation: slide-up 600ms cubic-bezier(0.16,1,0.3,1) both">
    <div class="premium-overlay relative overflow-hidden rounded-2xl bg-gradient-brand px-6 py-6 text-white sm:px-8 sm:py-7 shadow-lg shadow-blue-500/20">
      <div class="relative z-10">
        <h1 class="m-0 text-2xl font-bold sm:text-3xl text-white">Chọn môn học</h1>
        <p class="mb-0 mt-2 text-sm text-white/85 sm:text-base">
          Khám phá các môn học và xem danh sách đề thi tương ứng.
        </p>
      </div>
    </div>

    <p v-if="error" class="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
      <i class="fa-solid fa-circle-exclamation mr-2"></i>{{ error }}
    </p>

    <div v-if="loading" class="card-elevated px-5 py-14 text-center">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 mb-4">
        <i class="fa-solid fa-spinner animate-spin text-indigo-500 text-2xl"></i>
      </div>
      <p class="text-base font-medium text-slate-500 m-0">Đang tải danh sách môn học...</p>
    </div>

    <div v-else-if="!subjectSummaries.length" class="card-elevated px-5 py-14 text-center">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
        <i class="fa-solid fa-book-open text-slate-400 text-2xl"></i>
      </div>
      <p class="text-base font-medium text-slate-500 m-0">Hiện chưa có môn học nào.</p>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="subject in subjectSummaries"
        :key="subject.name"
        class="card-subtle-hover group overflow-hidden"
      >
        <router-link :to="`/exams/subject/${subject.name}`" class="block p-5 h-full flex flex-col">
          <div class="flex items-start justify-between gap-3">
            <p class="m-0 text-xs font-bold uppercase tracking-wider text-slate-400">{{ subject.levelName }}</p>
            <span :class="['mt-1 h-2.5 w-2.5 rounded-full', subject.dotClass]"></span>
          </div>

          <div v-if="subject.imageUrl" class="mt-4 mb-2 flex justify-center">
            <img :src="subject.imageUrl" :alt="subject.name" class="h-20 w-auto object-contain" />
          </div>

          <h2 class="mb-0 mt-2 text-2xl font-bold text-slate-900">{{ subject.name }}</h2>

          <div class="mt-4 space-y-2 text-sm font-medium text-slate-500 flex-1">
            <p class="m-0 inline-flex items-center gap-2">
              <i class="fa-solid fa-list-check text-xs" aria-hidden="true"></i>
              {{ subject.count }} đề thi
            </p>
            <br />
            <p class="m-0 inline-flex items-center gap-2">
              <i class="fa-regular fa-clock text-xs" aria-hidden="true"></i>
              Thời gian trung bình: {{ subject.durationLabel }}
            </p>
          </div>

          <div class="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p class="m-0 text-sm font-bold text-indigo-600">
              Xem chi tiết
            </p>
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-indigo-600 group-hover:text-white">
              <i class="fa-solid fa-angle-right text-xs"></i>
            </span>
          </div>
        </router-link>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAllExams } from '@/services/examService';
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

const router = useRouter();

const loading = ref(false);
const error = ref<string | null>(null);
const exams = ref<ExamItem[]>([]);
const subjects = ref<SubjectItem[]>([]);
const dotPalette = ['bg-blue-500', 'bg-emerald-500', 'bg-sky-500', 'bg-amber-500', 'bg-rose-500'];

const subjectSummaries = computed(() => {
  const map = new Map<string, { count: number; totalDuration: number }>();
  for (const exam of exams.value) {
    const name = exam.subjectName?.trim() || 'Khác';
    const current = map.get(name) ?? { count: 0, totalDuration: 0 };
    current.count += 1;
    current.totalDuration += Number(exam.duration ?? 0);
    map.set(name, current);
  }

  return subjects.value
    .map((subject) => {
      const name = subject.name.trim();
      const stats = map.get(name) ?? { count: 0, totalDuration: 0 };
      const averageDuration = stats.count ? Math.round(stats.totalDuration / stats.count) : 0;
      const index = subjects.value.findIndex(s => s.name.trim() === name);
      return {
        name,
        imageUrl: resolveAssetUrl(subject.imageUrl),
        levelName: subject.levelName,
        count: stats.count,
        durationLabel: `${averageDuration || 0} phút`,
        dotClass: dotPalette[index % dotPalette.length],
      };
    })
    .filter(subject => subject.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
});

const loadSubjects = async () => {
  try {
    const response = await getSubjects();
    subjects.value = Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (err) {
    error.value = 'Không thể tải danh sách môn học. Vui lòng thử lại.';
    subjects.value = [];
  }
};

const loadExams = async () => {
  try {
    const response = await getAllExams({
      page: 0,
      size: 100,
      sort: 'id,desc',
    });
    const payload = response.data?.data ?? {};
    exams.value = Array.isArray(payload.items) ? payload.items : [];
  } catch (err) {
    error.value = 'Không thể tải danh sách đề thi. Vui lòng thử lại.';
  }
};

const refreshData = async () => {
  loading.value = true;
  error.value = null;
  await Promise.all([loadSubjects(), loadExams()]);
  loading.value = false;
};

onMounted(() => {
  void refreshData();
});
</script>