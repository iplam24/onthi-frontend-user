<template>
  <section class="container-standard space-y-12 pb-20 animate-fade-in-up">
    <div class="premium-overlay relative overflow-hidden rounded-[2.5rem] bg-gradient-brand px-8 py-8 sm:px-10 sm:py-10 text-white shadow-xl shadow-indigo-500/15">
      <div class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-[80px] animate-pulse"></div>
      <div class="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-[60px]"></div>
      <div class="absolute top-1/3 right-8 h-10 w-10 rounded-xl bg-white/10 rotate-12 animate-float"></div>
      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/20 mb-4">
          <i class="fa-solid fa-book-open text-cyan-200"></i>
          Thư viện môn học
        </div>
        <h1 class="m-0 text-3xl font-black sm:text-4xl text-white tracking-tight">Chọn môn học</h1>
        <p class="mb-0 mt-3 text-base text-white/90 font-medium max-w-md leading-relaxed">
          Khám phá các môn học và xem danh sách đề thi tương ứng.
        </p>
      </div>
    </div>

    <p v-if="error" class="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700">
      <i class="fa-solid fa-circle-exclamation mr-2"></i>{{ error }}
    </p>

    <div v-if="loading" class="animate-pulse grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="card-elevated p-6 space-y-4">
        <div class="h-20 w-full bg-slate-100 rounded-2xl"></div>
        <div class="h-6 w-3/4 bg-slate-100 rounded-lg"></div>
        <div class="h-4 w-1/2 bg-slate-50 rounded-lg"></div>
      </div>
    </div>

    <div v-else-if="!subjectSummaries.length" class="card-elevated px-6 py-20 text-center">
      <div class="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 mb-6 text-slate-200">
        <i class="fa-solid fa-book-open text-4xl"></i>
      </div>
      <h3 class="m-0 text-xl font-black text-slate-900">Hiện chưa có môn học nào</h3>
      <p class="text-sm font-medium text-slate-500 mt-2 m-0">Hệ thống đang được cập nhật.</p>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="(subject, idx) in subjectSummaries"
        :key="subject.name"
        class="animate-slide-up-reveal card-subtle-hover group overflow-hidden"
        :style="{ animationDelay: `${idx * 60}ms` }"
      >
        <router-link :to="`/exams/subject/${subject.name}`" class="block p-6 h-full flex flex-col">
          <div class="flex items-start justify-between gap-3">
            <p class="m-0 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{{ subject.levelName }}</p>
            <span :class="['mt-1 h-3 w-3 rounded-full shadow-sm', subject.dotClass]"></span>
          </div>

          <div v-if="subject.imageUrl" class="mt-5 mb-3 flex justify-center">
            <img :src="subject.imageUrl" :alt="subject.name" class="h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
          </div>

          <h2 class="mb-0 mt-3 text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{{ subject.name }}</h2>

          <div class="mt-4 space-y-2 text-sm font-semibold text-slate-500 flex-1">
            <p class="m-0 inline-flex items-center gap-2">
              <i class="fa-solid fa-list-check text-xs text-indigo-400" aria-hidden="true"></i>
              {{ subject.count }} đề thi
            </p>
            <br />
            <p class="m-0 inline-flex items-center gap-2">
              <i class="fa-regular fa-clock text-xs text-indigo-400" aria-hidden="true"></i>
              Thời gian trung bình: {{ subject.durationLabel }}
            </p>
          </div>

          <div class="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <p class="m-0 text-sm font-black text-indigo-600">
              Xem chi tiết
            </p>
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/20">
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
const dotPalette = ['bg-indigo-500', 'bg-emerald-500', 'bg-sky-500', 'bg-amber-500', 'bg-rose-500'];

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