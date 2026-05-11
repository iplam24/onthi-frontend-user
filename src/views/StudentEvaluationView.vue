<template>
  <section class="container-standard space-y-12 pb-20 animate-fade-in-up">
    
    <!-- Header Area -->
    <div class="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-slate-900 border border-slate-800 p-6 sm:p-12 shadow-2xl">
      <div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]"></div>
      <div class="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[80px]"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div class="flex-1 text-center md:text-left">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 sm:px-4 sm:py-1.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide sm:tracking-[0.2em] text-cyan-300 mb-4 sm:mb-5 max-w-full">
            <i class="fa-solid fa-chart-pie text-[9px] sm:text-[10px]"></i>
            Phân tích năng lực
          </div>
          <h1 class="m-0 text-xl font-extrabold tracking-tight text-white sm:text-5xl">Đánh giá học sinh</h1>
          <p class="mb-0 mt-3 sm:mt-4 text-[13px] sm:text-sm font-medium text-slate-300 leading-relaxed max-w-xl mx-auto md:mx-0 break-words">
            Báo cáo chi tiết về hiệu suất học tập, điểm mạnh, điểm yếu và lộ trình cải thiện cá nhân hóa dựa trên dữ liệu làm bài của bạn.
          </p>
        </div>
        
        <!-- Filter Toggle -->
        <div class="shrink-0 w-full sm:w-auto">
           <button @click="showFilters = !showFilters" class="w-full sm:w-auto btn-primary bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-500/30 text-xs sm:text-sm">
              <i class="fa-solid fa-filter mr-2"></i> {{ showFilters ? 'Ẩn bộ lọc' : 'Bộ lọc phân tích' }}
           </button>
        </div>
      </div>

      <!-- Filters Panel -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-if="showFilters" class="relative z-10 mt-8 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           <div class="space-y-1.5">
              <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Khối/Lớp</label>
              <select v-model="filters.levelId" @change="onLevelChange" class="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm appearance-none outline-none focus:border-indigo-500 transition-colors">
                <option :value="undefined">Tất cả khối</option>
                <option v-for="l in levels" :key="l.id" :value="l.id">{{ l.name }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Môn học</label>
              <select v-model="filters.subjectId" @change="fetchEvaluation" class="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm appearance-none outline-none focus:border-indigo-500 transition-colors">
                <option :value="undefined">Tất cả môn</option>
                <option v-for="s in filteredSubjects" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Từ ngày</label>
              <input v-model="filters.from" type="date" @change="fetchEvaluation" class="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Đến ngày</label>
              <input v-model="filters.to" type="date" @change="fetchEvaluation" class="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors" />
            </div>
        </div>
      </Transition>
    </div>

    <!-- Error/Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="card-elevated p-10 text-center border border-rose-100 bg-rose-50/50">
      <i class="fa-solid fa-circle-exclamation text-4xl text-rose-500 mb-4"></i>
      <p class="text-lg font-bold text-slate-900">{{ error }}</p>
      <button @click="fetchEvaluation" class="mt-4 text-rose-600 font-bold hover:underline">Thử lại</button>
    </div>

    <div v-else-if="!evaluation" class="card-elevated p-20 text-center">
       <div class="h-20 w-20 mx-auto bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-6">
          <i class="fa-solid fa-chart-line text-4xl"></i>
       </div>
       <h3 class="text-xl font-extrabold text-slate-900">Chưa có dữ liệu</h3>
       <p class="text-slate-500 font-medium text-sm mt-2">Bạn chưa có đủ dữ liệu làm bài để hệ thống phân tích. Hãy hoàn thành thêm các bài thi nhé.</p>
    </div>

    <div v-else class="space-y-8 animate-fade-in">
       
      <!-- 1. TỔNG QUAN -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Điểm Tổng Hợp -->
        <div class="card-elevated p-4 sm:p-8 flex flex-col justify-center items-center text-center relative overflow-hidden bg-white">
           <div class="absolute top-0 right-0 p-2 sm:p-6">
              <span class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest" :class="getLabelColor(evaluation.overallScore)">
                 {{ evaluation.performanceLabel }}
              </span>
           </div>
           
           <div class="relative h-28 w-28 sm:h-40 sm:w-40 min-w-[112px] min-h-[112px] aspect-square flex items-center justify-center mb-4 sm:mb-6">
              <!-- Background circle -->
              <svg class="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                <circle class="text-slate-100 stroke-current" stroke-width="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                <!-- Progress circle -->
                <circle class="stroke-current" :class="getScoreTextColor(evaluation.overallScore)" stroke-width="8" stroke-linecap="round" cx="50" cy="50" r="40" fill="transparent" 
                  :stroke-dasharray="((safePercent(evaluation.overallScore) / 100) * 251.2) + ' 251.2'" stroke-dashoffset="0" transform="rotate(-90 50 50)"></circle>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span class="text-2xl sm:text-4xl font-black break-words" :class="getScoreTextColor(evaluation.overallScore)">{{ evaluation.overallScore?.toFixed(1) }}</span>
              </div>
           </div>
           <h3 class="text-base sm:text-lg font-black text-slate-900 m-0">Điểm tổng hợp</h3>
           <p class="text-[13px] sm:text-sm font-medium text-slate-500 mt-2 max-w-[250px]">Dựa trên kiến thức, tốc độ, tiến bộ và kỷ luật.</p>
           
           <div class="flex items-center justify-center gap-4 sm:gap-6 mt-6 w-full border-t border-slate-50 pt-6">
              <div class="text-center">
                 <p class="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Đã làm</p>
                 <p class="text-lg sm:text-xl font-black text-slate-900">{{ evaluation.totalAttempts }} <span class="text-[10px] sm:text-xs font-bold text-slate-500">đề</span></p>
              </div>
              <div class="text-center border-l border-slate-100 pl-4 sm:pl-6">
                 <p class="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Điểm TB</p>
                 <p class="text-lg sm:text-xl font-black text-slate-900">{{ evaluation.averageScore?.toFixed(1) }}</p>
              </div>
           </div>
        </div>

        <!-- 4 Trục đánh giá -->
        <div class="lg:col-span-2 card-elevated p-6 sm:p-8">
           <h3 class="flex items-center gap-2 m-0 text-base sm:text-lg font-black text-slate-900 mb-6">
              <i class="fa-solid fa-radar text-indigo-500"></i> Phân tích năng lực chi tiết
           </h3>
           
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-8">
              <!-- Knowledge -->
              <div>
                 <div class="flex items-end justify-between mb-2">
                    <div>
                       <h4 class="text-sm font-black text-slate-900 m-0">Kiến thức nền tảng</h4>
                       <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">Độ chính xác và nắm bắt bài</p>
                    </div>
                    <span class="text-xl font-black" :class="getScoreTextColor(evaluation.knowledgeScore)">{{ evaluation.knowledgeScore?.toFixed(1) }}</span>
                 </div>
                 <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000" :class="getScoreBarBg(evaluation.knowledgeScore)" :style="{ width: `${evaluation.knowledgeScore}%` }"></div>
                 </div>
              </div>

              <!-- Speed -->
              <div>
                 <div class="flex items-end justify-between mb-2">
                    <div>
                       <h4 class="text-sm font-black text-slate-900 m-0">Tốc độ làm bài</h4>
                       <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">Quản lý thời gian hiệu quả</p>
                    </div>
                    <span class="text-xl font-black" :class="getScoreTextColor(evaluation.speedScore)">{{ evaluation.speedScore?.toFixed(1) }}</span>
                 </div>
                 <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000" :class="getScoreBarBg(evaluation.speedScore)" :style="{ width: `${evaluation.speedScore}%` }"></div>
                 </div>
              </div>

              <!-- Progress -->
              <div>
                 <div class="flex items-end justify-between mb-2">
                    <div>
                       <h4 class="text-sm font-black text-slate-900 m-0">Tiến bộ</h4>
                       <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">Sự cải thiện qua các bài test</p>
                    </div>
                    <span class="text-xl font-black" :class="getScoreTextColor(evaluation.progressScore)">{{ evaluation.progressScore?.toFixed(1) }}</span>
                 </div>
                 <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000" :class="getScoreBarBg(evaluation.progressScore)" :style="{ width: `${evaluation.progressScore}%` }"></div>
                 </div>
              </div>

              <!-- Discipline -->
              <div>
                 <div class="flex items-end justify-between mb-2">
                    <div>
                       <h4 class="text-sm font-black text-slate-900 m-0">Kỷ luật học tập</h4>
                       <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">Mức độ chuyên cần & đều đặn</p>
                    </div>
                    <span class="text-xl font-black" :class="getScoreTextColor(evaluation.disciplineScore)">{{ evaluation.disciplineScore?.toFixed(1) }}</span>
                 </div>
                 <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000" :class="getScoreBarBg(evaluation.disciplineScore)" :style="{ width: `${evaluation.disciplineScore}%` }"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- 2. NHẬN XÉT -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div class="lg:col-span-1 card-elevated p-6 sm:p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
            <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
            <i class="fa-solid fa-quote-left text-2xl sm:text-3xl text-indigo-400/50 mb-4 block"></i>
            <h3 class="text-lg sm:text-xl font-black text-white mb-4">Nhận xét hệ thống</h3>
            <p class="text-indigo-100 leading-relaxed font-medium text-[13px] sm:text-sm break-words">{{ evaluation.summary }}</p>
         </div>

         <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Strengths -->
            <div class="card-elevated p-6 sm:p-8 border border-emerald-100/50">
               <h3 class="flex items-center gap-2 m-0 text-base sm:text-lg font-black text-emerald-700 mb-5">
                  <i class="fa-solid fa-arrow-trend-up"></i> Điểm mạnh
               </h3>
               <ul class="space-y-4 m-0 p-0 list-none">
                  <li v-for="(str, i) in evaluation.strengths" :key="i" class="flex items-start gap-3">
                     <span class="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]"><i class="fa-solid fa-check"></i></span>
                     <span class="text-[13px] sm:text-sm font-bold text-slate-700 leading-relaxed break-words">{{ str }}</span>
                  </li>
                  <li v-if="!evaluation.strengths?.length" class="text-sm text-slate-400 italic">Chưa có đủ dữ liệu.</li>
               </ul>
            </div>

            <!-- Weaknesses -->
            <div class="card-elevated p-6 sm:p-8 border border-rose-100/50">
               <h3 class="flex items-center gap-2 m-0 text-base sm:text-lg font-black text-rose-600 mb-5">
                  <i class="fa-solid fa-triangle-exclamation"></i> Cần khắc phục
               </h3>
               <ul class="space-y-4 m-0 p-0 list-none">
                  <li v-for="(wkn, i) in evaluation.weaknesses" :key="i" class="flex items-start gap-3">
                     <span class="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-[10px]"><i class="fa-solid fa-xmark"></i></span>
                     <span class="text-[13px] sm:text-sm font-bold text-slate-700 leading-relaxed break-words">{{ wkn }}</span>
                  </li>
                  <li v-if="!evaluation.weaknesses?.length" class="text-sm text-slate-400 italic">Chưa có đủ dữ liệu.</li>
               </ul>
            </div>
         </div>
      </div>
      
      <!-- 3.5 AI PERSONALIZED LEARNING PATH -->
      <div class="card-elevated p-8 sm:p-12 relative overflow-hidden bg-slate-900 border border-indigo-500/30 group mt-8">
        <!-- AI Background Effects -->
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-[100px] animate-pulse"></div>
        <div class="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-600/10 blur-[60px]"></div>
        
        <div class="relative z-10">
          <div class="flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="flex-1 text-center md:text-left">
              <div class="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-6">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                AI Personalized
              </div>
              <h2 class="text-3xl sm:text-4xl font-black text-white m-0">Lộ trình học tập thông minh</h2>
              <p class="mt-4 text-slate-400 font-medium text-sm sm:text-base leading-relaxed max-w-2xl">
                Dựa trên phân tích sâu các bài làm gần đây, AI của V-Edu sẽ xây dựng riêng cho bạn một kế hoạch ôn tập tối ưu nhất.
              </p>
            </div>
            
            <div class="shrink-0">
              <button 
                @click="generateAiPath" 
                :disabled="aiLoading"
                class="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl font-black text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                <i v-if="aiLoading" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-bolt"></i>
                {{ aiLoading ? 'Đang phân tích...' : 'Tạo lộ trình ngay' }}
              </button>
            </div>
          </div>

          <!-- AI Response Area -->
          <Transition
            enter-active-class="transition duration-500 ease-out"
            enter-from-class="opacity-0 translate-y-8"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="aiLearningPath" class="mt-12 p-6 sm:p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
               <div class="max-w-none">
                  <div class="whitespace-pre-wrap leading-relaxed text-sm sm:text-base font-medium text-slate-200 ai-markdown-content" v-html="formattedAiPath"></div>
               </div>
               
               <div class="mt-8 flex justify-center border-t border-white/10 pt-6">
                  <button @click="aiLearningPath = null" class="text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
                    <i class="fa-solid fa-chevron-up mr-2"></i> Thu gọn lộ trình
                  </button>
               </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- 4. PHÂN TÍCH MÔN HỌC -->

      <!-- 4. PHÂN TÍCH MÔN HỌC -->
      <div v-if="evaluation.subjectEvaluations?.length" class="card-elevated p-6 sm:p-8">
         <h3 class="flex items-center gap-2 m-0 text-base sm:text-lg font-black text-slate-900 mb-6">
            <i class="fa-solid fa-layer-group text-blue-500"></i> Phân tích theo môn học
         </h3>
         <div class="overflow-x-auto hidden md:block">
            <table class="w-full text-left text-sm">
               <thead>
                  <tr class="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <th class="pb-3 pr-4">Môn học</th>
                     <th class="pb-3 px-4">Số bài làm</th>
                     <th class="pb-3 px-4">Điểm TB</th>
                     <th class="pb-3 px-4">Tỷ lệ đúng</th>
                     <th class="pb-3 pl-4">Khối</th>
                  </tr>
               </thead>
               <tbody class="divide-y divide-slate-50">
                  <tr v-for="sub in evaluation.subjectEvaluations" :key="sub.subjectId" class="hover:bg-slate-50/50 transition-colors group">
                     <td class="py-4 pr-4 font-bold text-slate-900">{{ sub.subjectName }}</td>
                     <td class="py-4 px-4 font-medium text-slate-600">{{ sub.attemptCount }}</td>
                     <td class="py-4 px-4 font-black" :class="getScoreTextColor(sub.averageScore)">{{ sub.averageScore?.toFixed(1) }}</td>
                     <td class="py-4 px-4">
                        <div class="flex items-center gap-2">
                           <div class="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                              <div class="h-full rounded-full bg-indigo-500" :style="{ width: `${safePercent(sub.accuracyRate)}%` }"></div>
                           </div>
                           <span class="text-xs font-bold text-slate-600">{{ sub.accuracyRate?.toFixed(1) }}%</span>
                        </div>
                     </td>
                     <td class="py-4 pl-4 font-medium text-slate-500 text-xs">{{ sub.levelName }}</td>
                  </tr>
               </tbody>
            </table>
         </div>

         <!-- Mobile Subject Cards -->
         <div class="md:hidden divide-y divide-slate-100">
            <div v-for="sub in evaluation.subjectEvaluations" :key="'mob-sub-' + sub.subjectId" class="py-4 space-y-3">
               <div class="flex items-center justify-between">
                  <span class="text-sm font-black text-slate-900">{{ sub.subjectName }}</span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ sub.levelName }}</span>
               </div>
               <div class="grid grid-cols-2 gap-4">
                  <div>
                     <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Số bài / Điểm TB</p>
                     <p class="text-sm font-black text-slate-700">
                        {{ sub.attemptCount }} đề / <span :class="getScoreTextColor(sub.averageScore)">{{ sub.averageScore?.toFixed(1) }}</span>
                     </p>
                  </div>
                  <div class="text-right">
                     <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tỷ lệ đúng</p>
                     <p class="text-sm font-black text-indigo-600">{{ sub.accuracyRate?.toFixed(1) }}%</p>
                  </div>
               </div>
               <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full bg-indigo-500" :style="{ width: `${safePercent(sub.accuracyRate)}%` }"></div>
               </div>
            </div>
         </div>
      </div>
       
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getStudentEvaluation, type StudentEvaluationResponse } from '@/services/statisticsService';
import { getLevels, getSubjects, type LevelItem, type SubjectItem } from '@/services/learningService';
import { getAiLearningPath } from '@/services/aiService';

const auth = useAuthStore();
const loading = ref(false);
const aiLoading = ref(false);
const aiLearningPath = ref<string | null>(null);
const error = ref<string | null>(null);
const evaluation = ref<StudentEvaluationResponse | null>(null);

// @ts-ignore
const formattedAiPath = computed(() => {
  return aiLearningPath.value || '';
});

const generateAiPath = async () => {
  if (aiLoading.value) return;
  aiLoading.value = true;
  try {
    const res = await getAiLearningPath();
    aiLearningPath.value = res.data?.data?.learningPath;
  } catch (err) {
    console.error('AI Path Error:', err);
  } finally {
    aiLoading.value = false;
  }
};

const showFilters = ref(false);

const levels = ref<LevelItem[]>([]);
const subjects = ref<SubjectItem[]>([]);

const filters = reactive({
  levelId: undefined as number | undefined,
  subjectId: undefined as number | undefined,
  from: undefined as string | undefined,
  to: undefined as string | undefined,
});

const filteredSubjects = computed(() => {
  if (!filters.levelId) return subjects.value;
  return subjects.value.filter(s => s.levelId === filters.levelId);
});

const onLevelChange = () => {
  filters.subjectId = undefined;
  fetchEvaluation();
};

const safePercent = (value?: number) => {
  if (value == null) return 0;
  return Math.min(100, Math.max(0, value));
};

const getScoreTextColor = (score?: number) => {
  if (score == null) return 'text-slate-300';
  if (score >= 75) return 'text-emerald-600';
  if (score >= 60) return 'text-indigo-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-rose-600';
};

const getScoreBarBg = (score?: number) => {
  if (score == null) return 'bg-slate-200';
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 60) return 'bg-indigo-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-rose-500';
};

const getLabelColor = (score?: number) => {
  if (score == null) return 'bg-slate-100 text-slate-500';
  if (score >= 75) return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
  if (score >= 60) return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
  if (score >= 40) return 'bg-amber-100 text-amber-700 border border-amber-200';
  return 'bg-rose-100 text-rose-700 border border-rose-200';
};

const loadMetadata = async () => {
  try {
    const [lRes, sRes] = await Promise.all([getLevels(), getSubjects()]);
    levels.value = lRes.data?.data || [];
    subjects.value = sRes.data?.data || [];
  } catch (err) {
    console.error('Failed to load filter metadata', err);
  }
};

const fetchEvaluation = async () => {
  if (!auth.isAuthenticated) return;
  loading.value = true;
  error.value = null;
  
  try {
    const queryParams: Record<string, any> = { ...filters };
    
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === undefined || queryParams[key] === null || queryParams[key] === '') {
        delete queryParams[key];
      }
    });
    
    if (queryParams.from && !queryParams.from.includes('T')) {
      queryParams.from = `${queryParams.from}T00:00:00`;
    }
    if (queryParams.to && !queryParams.to.includes('T')) {
      queryParams.to = `${queryParams.to}T23:59:59`;
    }

    const response = await getStudentEvaluation(queryParams);
    evaluation.value = response.data?.data;
  } catch (err) {
    console.error(err);
    error.value = 'Không thể lấy dữ liệu phân tích. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (auth.isAuthenticated) {
    loadMetadata();
    fetchEvaluation();
  }
});
</script>
