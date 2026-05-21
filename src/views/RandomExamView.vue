<template>
  <section class="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 pb-20 animate-fade-in-up">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100/80 p-8 sm:p-10 shadow-xl shadow-indigo-500/5">
      <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-50/60 blur-3xl"></div>
      <div class="flex items-center gap-5">
        <div class="relative h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <i class="fa-solid fa-shuffle text-white text-xl"></i>
        </div>
        <div>
          <h1 class="m-0 text-2xl font-extrabold tracking-tight text-slate-900">Tạo Đề Thi Ngẫu Nhiên</h1>
          <p class="mb-0 mt-1 text-sm font-medium text-slate-500">Tuỳ chỉnh số lượng, chủ đề, và mức độ khó</p>
        </div>
      </div>
    </div>

    <!-- Success Result -->
    <div v-if="result" class="animate-slide-up-reveal space-y-6">
      <div class="card-elevated p-8 space-y-6">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <i class="fa-solid fa-circle-check text-emerald-500 text-xl"></i>
          </div>
          <div>
            <h2 class="m-0 text-xl font-bold text-slate-900">{{ result.title }}</h2>
            <p class="m-0 text-sm text-slate-500">{{ result.subjectName }} · {{ result.totalQuestions }} câu · {{ result.duration }} phút</p>
          </div>
        </div>

        <!-- Distribution -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rounded-2xl bg-slate-50 p-5 space-y-3">
            <p class="m-0 text-xs font-black uppercase tracking-widest text-slate-500">Mức độ khó</p>
            <div v-for="(count, diff) in result.difficultyDistribution" :key="diff" class="flex items-center justify-between">
              <span class="text-sm font-semibold" :class="diffColor(diff as string)">{{ diffLabel(diff as string) }}</span>
              <span class="text-sm font-bold text-slate-700">{{ count }} câu</span>
            </div>
          </div>
          <div class="rounded-2xl bg-slate-50 p-5 space-y-3">
            <p class="m-0 text-xs font-black uppercase tracking-widest text-slate-500">Chủ đề</p>
            <div v-for="(count, topic) in result.topicDistribution" :key="topic" class="flex items-center justify-between">
              <span class="text-sm font-semibold text-slate-600 truncate mr-2">{{ topic }}</span>
              <span class="text-sm font-bold text-slate-700 shrink-0">{{ count }} câu</span>
            </div>
          </div>
        </div>

        <div v-if="result.hasDuplicates" class="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm font-medium text-amber-700">
          <i class="fa-solid fa-triangle-exclamation mr-2"></i>
          Do ngân hàng câu hỏi hạn chế, một số câu có thể trùng với đề cũ.
        </div>

        <button
          @click="goToExam"
          class="w-full rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-700 active:scale-[0.98] shadow-lg shadow-indigo-500/20"
        >
          <i class="fa-solid fa-play mr-2"></i>Bắt đầu làm bài ngay
        </button>
      </div>

      <button @click="resetForm" class="w-full text-center text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors py-2">
        <i class="fa-solid fa-arrow-left mr-2"></i>Tạo đề khác
      </button>
    </div>

    <!-- Form -->
    <div v-else class="card-elevated p-6 sm:p-8 space-y-8">
      <!-- Exam Title -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-xs font-black uppercase tracking-widest text-slate-500">Tên đề thi (Tùy chọn)</label>
          <span class="text-slate-400 text-[10px] font-black tracking-widest">Bỏ trống để tự tạo tên</span>
        </div>
        <input
          v-model="form.title"
          type="text"
          placeholder="Ví dụ: Đề tự luyện Đại số tuyến tính Chương 1"
          class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
        />
      </div>

      <!-- Subject -->
      <div class="space-y-2">
        <label class="text-xs font-black uppercase tracking-widest text-slate-500">Môn học *</label>
        <select v-model="form.subjectId" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" @change="onSubjectChange">
          <option :value="null" disabled>Chọn môn học</option>
          <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>

      <!-- Total Questions & Duration -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-xs font-black uppercase tracking-widest text-slate-500">Số câu hỏi *</label>
          <input v-model.number="form.totalQuestions" type="number" min="1" max="200" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-black uppercase tracking-widest text-slate-500">Thời gian (phút) *</label>
          <input v-model.number="form.duration" type="number" min="1" max="300" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
        </div>
      </div>

      <!-- Difficulty Config (Common) -->
      <div v-if="!useDetailedTopicConfig" class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-xs font-black uppercase tracking-widest text-slate-500">Phân bổ mức độ khó chung</label>
          <button @click="toggleDifficultyConfig" class="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
            {{ useDifficultyConfig ? 'Tắt' : 'Bật' }}
          </button>
        </div>
        <div v-if="useDifficultyConfig" class="grid grid-cols-3 gap-3">
          <div v-for="dc in form.difficultyConfigs" :key="dc.difficulty" class="rounded-xl border border-slate-200 p-4 space-y-2 text-center">
            <span class="text-xs font-bold" :class="diffColor(dc.difficulty)">{{ diffLabel(dc.difficulty) }}</span>
            <input v-model.number="dc.count" type="number" min="0" class="w-full rounded-lg border border-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-700 focus:border-indigo-400 outline-none" />
          </div>
          <p v-if="diffTotal !== form.totalQuestions" class="col-span-3 text-xs font-semibold text-rose-500 m-0">
            <i class="fa-solid fa-exclamation-circle mr-1"></i>
            Tổng số câu khó chung ({{ diffTotal }}) phải bằng tổng số câu hỏi ({{ form.totalQuestions }})
          </p>
        </div>
      </div>

      <!-- Detailed Topic Config -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-xs font-black uppercase tracking-widest text-slate-500">Cấu hình câu hỏi theo chủ đề & độ khó</label>
            <p class="m-0 text-[11px] text-slate-400 mt-0.5">Phân bổ chi tiết số câu Dễ, Trung bình, Khó cho từng chủ đề</p>
          </div>
          <button @click="toggleDetailedTopicConfig" class="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors shrink-0">
            {{ useDetailedTopicConfig ? 'Tắt cấu hình chủ đề' : 'Bật cấu hình chủ đề' }}
          </button>
        </div>
        <div v-if="useDetailedTopicConfig && topics.length" class="space-y-4">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="py-2 text-xs font-black uppercase tracking-widest text-slate-400">Chủ đề</th>
                  <th class="py-2 text-xs font-black uppercase tracking-widest text-emerald-500 text-center w-24">Dễ</th>
                  <th class="py-2 text-xs font-black uppercase tracking-widest text-amber-500 text-center w-24">T.Bình</th>
                  <th class="py-2 text-xs font-black uppercase tracking-widest text-rose-500 text-center w-24">Khó</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tc in form.topicDetailedConfigs" :key="tc.topicId" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td class="py-3 text-sm font-semibold text-slate-700 pr-4 max-w-[200px] truncate">
                    {{ getTopicName(tc.topicId) }}
                  </td>
                  <td class="py-3 text-center">
                    <input v-model.number="tc.easyCount" type="number" min="0" class="w-20 mx-auto rounded-lg border border-slate-200 px-2 py-1.5 text-center text-sm font-bold text-slate-700 focus:border-indigo-400 outline-none" />
                  </td>
                  <td class="py-3 text-center">
                    <input v-model.number="tc.mediumCount" type="number" min="0" class="w-20 mx-auto rounded-lg border border-slate-200 px-2 py-1.5 text-center text-sm font-bold text-slate-700 focus:border-indigo-400 outline-none" />
                  </td>
                  <td class="py-3 text-center">
                    <input v-model.number="tc.hardCount" type="number" min="0" class="w-20 mx-auto rounded-lg border border-slate-200 px-2 py-1.5 text-center text-sm font-bold text-slate-700 focus:border-indigo-400 outline-none" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="detailedTopicTotal !== form.totalQuestions" class="text-xs font-semibold text-rose-500 m-0">
            <i class="fa-solid fa-exclamation-circle mr-1"></i>
            Tổng số câu trong cấu hình chi tiết ({{ detailedTopicTotal }}) phải bằng số câu hỏi ({{ form.totalQuestions }})
          </p>
        </div>
        <p v-else-if="useDetailedTopicConfig" class="text-sm text-slate-400 m-0">Chọn môn học trước để cấu hình theo chủ đề.</p>
      </div>

      <!-- Options -->
      <div class="grid grid-cols-2 gap-4">
        <label class="flex items-center gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer hover:border-indigo-300 transition-colors">
          <input v-model="form.avoidDuplicates" type="checkbox" class="h-4 w-4 rounded text-indigo-600 border-slate-300" />
          <span class="text-sm font-semibold text-slate-600">Tránh trùng lặp câu</span>
        </label>
        <div class="space-y-2">
          <label class="text-xs font-black uppercase tracking-widest text-slate-500">Số lần làm tối đa</label>
          <input v-model.number="form.maxAttempts" type="number" min="0" placeholder="0 = Không giới hạn" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
        <i class="fa-solid fa-circle-exclamation mr-2"></i>{{ error }}
      </div>

      <!-- Submit -->
      <button
        @click="handleGenerate"
        :disabled="submitting || !isFormValid"
        class="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:shadow-xl hover:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i v-if="submitting" class="fa-solid fa-spinner fa-spin mr-2"></i>
        <i v-else class="fa-solid fa-wand-magic-sparkles mr-2"></i>
        {{ submitting ? 'Đang tạo đề...' : 'Tạo đề thi ngẫu nhiên' }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { generateRandomExam, type RandomExamRequest, type RandomExamResponse } from '@/services/examService';
import { getSubjects, getTopics, type SubjectItem, type TopicItem } from '@/services/learningService';

const router = useRouter();

const subjects = ref<SubjectItem[]>([]);
const topics = ref<TopicItem[]>([]);
const allTopics = ref<TopicItem[]>([]);
const submitting = ref(false);
const error = ref<string | null>(null);
const result = ref<RandomExamResponse | null>(null);

const useDifficultyConfig = ref(true);
const useDetailedTopicConfig = ref(false);

const form = ref<{
  title: string;
  subjectId: number | null;
  totalQuestions: number;
  duration: number;
  difficultyConfigs: Array<{ difficulty: string; count: number }>;
  topicDetailedConfigs: Array<{ topicId: number; easyCount: number; mediumCount: number; hardCount: number }>;
  avoidDuplicates: boolean;
  maxAttempts: number | null;
}>({
  title: '',
  subjectId: null,
  totalQuestions: 30,
  duration: 45,
  difficultyConfigs: [
    { difficulty: 'EASY', count: 10 },
    { difficulty: 'MEDIUM', count: 15 },
    { difficulty: 'HARD', count: 5 },
  ],
  topicDetailedConfigs: [],
  avoidDuplicates: true,
  maxAttempts: null,
});

const diffTotal = computed(() => form.value.difficultyConfigs.reduce((s, d) => s + (d.count || 0), 0));
const detailedTopicTotal = computed(() => form.value.topicDetailedConfigs.reduce((s, t) => s + (t.easyCount || 0) + (t.mediumCount || 0) + (t.hardCount || 0), 0));

const isFormValid = computed(() => {
  if (!form.value.subjectId || !form.value.totalQuestions || !form.value.duration) return false;
  if (useDifficultyConfig.value && diffTotal.value !== form.value.totalQuestions) return false;
  if (useDetailedTopicConfig.value && detailedTopicTotal.value !== form.value.totalQuestions) return false;
  return true;
});

const diffLabel = (d: string) => ({ EASY: 'Dễ', MEDIUM: 'Trung bình', HARD: 'Khó' }[d] || d);
const diffColor = (d: string) => ({
  EASY: 'text-emerald-600',
  MEDIUM: 'text-amber-600',
  HARD: 'text-rose-600',
}[d] || 'text-slate-600');

const getTopicName = (id: number) => allTopics.value.find(t => t.id === id)?.name || `Topic #${id}`;

const onSubjectChange = () => {
  topics.value = allTopics.value.filter(t => t.subjectId === form.value.subjectId);
  if (useDetailedTopicConfig.value) {
    form.value.topicDetailedConfigs = topics.value.map(t => ({ topicId: t.id, easyCount: 0, mediumCount: 0, hardCount: 0 }));
  }
};

const toggleDifficultyConfig = () => {
  useDifficultyConfig.value = !useDifficultyConfig.value;
  if (useDifficultyConfig.value) {
    useDetailedTopicConfig.value = false;
  }
};

const toggleDetailedTopicConfig = () => {
  useDetailedTopicConfig.value = !useDetailedTopicConfig.value;
  if (useDetailedTopicConfig.value) {
    useDifficultyConfig.value = false;
    if (form.value.subjectId) {
      onSubjectChange();
    }
  }
};

const handleGenerate = async () => {
  if (!isFormValid.value || submitting.value) return;
  submitting.value = true;
  error.value = null;

  try {
    const payload: RandomExamRequest = {
      subjectId: form.value.subjectId!,
      totalQuestions: form.value.totalQuestions,
      duration: form.value.duration,
      avoidDuplicates: form.value.avoidDuplicates,
      maxAttempts: form.value.maxAttempts || undefined,
      title: form.value.title.trim() || undefined,
    };
    if (useDifficultyConfig.value) {
      payload.difficultyConfigs = form.value.difficultyConfigs.filter(d => d.count > 0) as any;
    }
    if (useDetailedTopicConfig.value) {
      payload.topicDetailedConfigs = form.value.topicDetailedConfigs.filter(t => (t.easyCount > 0 || t.mediumCount > 0 || t.hardCount > 0));
    }

    const res = await generateRandomExam(payload);
    result.value = res.data?.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Tạo đề thi thất bại. Vui lòng thử lại.';
  } finally {
    submitting.value = false;
  }
};

const goToExam = () => {
  if (result.value?.examId) {
    router.push(`/exams/${result.value.examId}/attempt`);
  }
};

const resetForm = () => {
  result.value = null;
  form.value.title = '';
};

onMounted(async () => {
  try {
    const [subRes, topRes] = await Promise.all([getSubjects(), getTopics()]);
    subjects.value = Array.isArray(subRes.data?.data) ? subRes.data.data : [];
    allTopics.value = Array.isArray(topRes.data?.data) ? topRes.data.data : [];
  } catch { /* ignore */ }
});
</script>
