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
        <ExamsSubjectToolbar v-model="selectedLevel" :level-options="levelOptions" />
        <SubjectSummaryGrid :subjects="filteredSubjectSummaries" @select-subject="openSubject" />
      </div>

      <SelectedSubjectPanel
        v-else
        :selected-subject="selectedSubject"
        :selected-subject-initial="selectedSubjectInitial"
        :exams="selectedSubjectExams"
        :loading="loading"
        :can-start-exam="canStartExam"
        :get-start-blocked-reason="getStartBlockedReason"
        @back="selectedSubject = ''"
        @refresh="refreshData"
        @start-exam="startExam"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import ExamsSubjectToolbar from '@/components/exams/ExamsSubjectToolbar.vue';
import SelectedSubjectPanel from '@/components/exams/SelectedSubjectPanel.vue';
import SubjectSummaryGrid from '@/components/exams/SubjectSummaryGrid.vue';
import { useAuthStore } from '@/stores/auth';
import { getAllExams } from '@/services/examService';
import { getMyAttempts } from '@/services/attemptService';
import { getSubjects, type SubjectItem } from '@/services/learningService';
import type { ExamDisplayItem, SubjectSummaryItem } from '@/types/examDisplay';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.00.0.1:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveAssetUrl = (assetUrl?: string) => {
  if (!assetUrl) return undefined;
  return /^https?:\/\//i.test(assetUrl) ? assetUrl : `${BACKEND_ORIGIN}${assetUrl.startsWith('/') ? '' : '/'}${assetUrl}`;
};

type ExamItem = ExamDisplayItem & {
  subjectName?: string;
  totalQuestions?: number;
  type: string;
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
const selectedLevel = ref<string>('Tất cả');
const dotPalette = ['bg-blue-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500'];

const myAttempts = ref<AttemptItem[]>([]);

const subjectSummaries = computed<SubjectSummaryItem[]>(() => {
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
      const dotClass: string = dotPalette[index % dotPalette.length] || 'bg-blue-500';
      return {
        name,
        imageUrl: resolveAssetUrl(subject.imageUrl), // Add image URL
        levelName: subject.levelName, // Add levelName
        count: stats.count,
        durationLabel: `${averageDuration || 0} phút`,
        dotClass,
      };
    })
    // .filter(subject => subject.count > 0) // Removed: Show all subjects, even those without exams
    .sort((a, b) => a.name.localeCompare(b.name));
});

const levelOptions = computed(() => {
  const uniqueLevels = new Set<string>();
  for (const subject of subjectSummaries.value) {
    const levelName = subject.levelName?.trim();
    if (levelName) {
      uniqueLevels.add(levelName);
    }
  }

  return ['Tất cả', ...Array.from(uniqueLevels).sort((a, b) => a.localeCompare(b))];
});

const filteredSubjectSummaries = computed(() => {
  if (selectedLevel.value === 'Tất cả') {
    return subjectSummaries.value;
  }

  return subjectSummaries.value.filter((subject) => subject.levelName?.trim() === selectedLevel.value);
});

const selectedSubjectInitial = computed(() => {
  if (!selectedSubject.value) {
    return 'S';
  }

  return selectedSubject.value.trim().charAt(0).toUpperCase() || 'S';
});

const selectedSubjectExams = computed<ExamDisplayItem[]>(() => {
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
        selectedSubject.value = exams.value[0]?.subjectName?.trim() || 'Khác';
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

const canStartExam = (exam: ExamDisplayItem) => {
  if (!exam.isActive) {
    return false;
  }

  if (!auth.isAuthenticated) {
    return true;
  }

  if (!exam.maxAttempts || exam.maxAttempts <= 0) {
    return true;
  }

  return getAttemptCountByExam(exam.id) < exam.maxAttempts;
};

const getStartBlockedReason = (exam: ExamDisplayItem) => {
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

const startExam = (exam: ExamDisplayItem) => {
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

watch(levelOptions, (options) => {
  if (!options.includes(selectedLevel.value)) {
    selectedLevel.value = 'Tất cả';
  }
});

watch(filteredSubjectSummaries, (items) => {
  if (selectedSubject.value && !items.some((subject) => subject.name === selectedSubject.value)) {
    selectedSubject.value = '';
  }
});

onMounted(() => {
  void refreshData();
});
</script>
