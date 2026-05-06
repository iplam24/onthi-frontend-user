<template>
  <section class="space-y-10 max-w-7xl mx-auto px-4 pb-20 pt-6" style="animation: slide-up 600ms var(--ease-out-expo) both">
    <!-- Dynamic Hero Header -->
    <div v-if="!selectedTopic" class="premium-overlay relative overflow-hidden rounded-[2.5rem] bg-gradient-brand shadow-2xl shadow-indigo-500/12">
      <div class="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[100px] animate-pulse"></div>
      <div class="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-white/5 blur-[80px]"></div>
      <div class="pointer-events-none absolute top-1/4 right-[10%] h-16 w-16 rounded-2xl bg-white/8 rotate-12 animate-float-slow"></div>
      <div class="pointer-events-none absolute bottom-1/3 left-[5%] h-10 w-10 rounded-full bg-white/5 animate-float" style="animation-delay:-2s"></div>
      
      <div class="relative z-10 flex flex-col lg:flex-row items-center gap-12 p-10 sm:p-14 lg:p-16">
        <div class="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
          <div class="inline-flex items-center gap-3 rounded-full bg-white/15 px-5 py-2 text-[10px] font-extrabold uppercase tracking-[0.25em] text-white border border-white/25 backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            Khai phá tiềm năng
          </div>
          <h1 class="m-0 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]">
            Chinh phục <br class="hidden sm:block"/><span class="bg-gradient-to-r from-cyan-200 via-white to-indigo-200 bg-clip-text text-transparent">đỉnh cao tri thức</span>
          </h1>
          <p class="mb-0 text-base font-medium text-white/85 leading-relaxed max-w-lg sm:text-lg">
            Hệ thống học tập cá nhân hóa giúp bạn tập trung vào những mảng kiến thức quan trọng nhất.
          </p>
        </div>
        
        <div class="shrink-0 hidden lg:block">
          <img 
            src="@/asset/illustrations/learning-journey.png" 
            alt="Learning Journey" 
            class="h-[300px] w-auto drop-shadow-2xl animate-float-slow"
          />
        </div>
      </div>
    </div>

    <!-- Main Navigation/Content Area -->
    <div class="space-y-8">
      <!-- Breadcrumbs / Back button -->
      <div v-if="selectedSubject || selectedTopic" class="flex items-center gap-4 animate-fade-in">
        <button 
          @click="goBack"
          class="group inline-flex h-10 items-center gap-3 rounded-xl border border-slate-100 bg-white px-5 text-xs font-black uppercase tracking-widest text-slate-500 shadow-sm transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 active:scale-95"
        >
          <i class="fa-solid fa-arrow-left-long transition-transform group-hover:-translate-x-1"></i>
          Quay lại
        </button>
        <div class="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span v-if="selectedLevel" class="text-slate-300">/</span>
          <span v-if="selectedLevel">{{ levels.find(l => l.id === selectedLevel)?.name || '' }}</span>
          <span v-if="selectedSubject" class="text-slate-300">/</span>
          <span v-if="selectedSubject" class="text-indigo-600">{{ subjects.find(s => s.id === selectedSubject)?.name || '' }}</span>
          <span v-if="selectedTopic" class="text-slate-300">/</span>
          <span v-if="selectedTopic" class="text-indigo-600 truncate max-w-[150px]">{{ topics.find(t => t.id === selectedTopic)?.name || '' }}</span>
        </div>
      </div>

      <!-- Level Selection & Bookmark Tabs -->
      <div v-if="!selectedSubject && !selectedTopic" class="flex flex-wrap gap-3 animate-slide-up-reveal stagger-1">
        <button
          v-for="(level, idx) in levels"
          :key="level.id"
          @click="selectedLevel = level.id; viewMode = 'levels'"
          class="group flex items-center gap-3 px-7 py-3.5 rounded-2xl text-sm font-black transition-all duration-500 shadow-sm border border-transparent"
          :class="(selectedLevel === level.id && viewMode === 'levels')
            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/25 scale-[1.03]' 
            : 'bg-white text-slate-600 border-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'"
        >
          <div class="h-6 w-6 flex items-center justify-center rounded-lg transition-colors" :class="(selectedLevel === level.id && viewMode === 'levels') ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-indigo-100'">
            <i :class="['fa-solid text-xs', idx === 0 ? 'fa-star' : (idx === 1 ? 'fa-rocket' : 'fa-graduation-cap')]"></i>
          </div>
          {{ level.name }}
        </button>

        <!-- Bookmark Tab -->
        <button
          @click="viewMode = 'bookmarks'; selectedLevel = null"
          class="group flex items-center gap-3 px-7 py-3.5 rounded-2xl text-sm font-black transition-all duration-500 shadow-sm border border-transparent"
          :class="viewMode === 'bookmarks'
            ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/25 scale-[1.03]' 
            : 'bg-white text-slate-600 border-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'"
        >
          <div class="h-6 w-6 flex items-center justify-center rounded-lg transition-colors" :class="viewMode === 'bookmarks' ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-rose-100'">
            <i class="fa-solid fa-bookmark text-xs"></i>
          </div>
          Đã lưu ({{ bookmarkedQuestions.length }})
        </button>
      </div>

      <!-- Content Grid -->
      <div class="relative min-h-[400px]">
        <!-- Skeleton Loading State -->
        <div v-if="loading" class="animate-pulse space-y-8">
          <div v-if="!selectedSubject" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="i in 8" :key="i" class="card-elevated p-6 space-y-4">
              <div class="h-40 w-full bg-slate-100 rounded-2xl"></div>
              <div class="h-6 w-3/4 bg-slate-100 rounded-lg"></div>
              <div class="h-4 w-1/2 bg-slate-50 rounded-lg"></div>
            </div>
          </div>
          <div v-else-if="!selectedTopic" class="space-y-4">
            <div v-for="i in 6" :key="i" class="card-elevated p-6 flex items-center justify-between">
              <div class="flex items-center gap-6">
                <div class="h-14 w-14 bg-slate-100 rounded-2xl"></div>
                <div class="space-y-2">
                  <div class="h-5 w-48 bg-slate-100 rounded-lg"></div>
                  <div class="h-3 w-24 bg-slate-50 rounded-lg"></div>
                </div>
              </div>
              <div class="h-4 w-4 bg-slate-100 rounded-full"></div>
            </div>
          </div>
          <div v-else class="space-y-6">
            <div v-for="i in 3" :key="i" class="card-elevated p-8 space-y-6">
              <div class="flex gap-3">
                <div class="h-6 w-20 bg-slate-100 rounded-lg"></div>
                <div class="h-6 w-16 bg-slate-100 rounded-lg"></div>
              </div>
              <div class="h-8 w-3/4 bg-slate-100 rounded-lg"></div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="j in 4" :key="j" class="h-16 bg-slate-50 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="card-elevated p-10 text-center">
          <i class="fa-solid fa-circle-exclamation text-4xl text-rose-500 mb-4"></i>
          <p class="text-lg font-bold text-slate-900">{{ error }}</p>
          <button @click="initData" class="mt-4 text-blue-600 font-bold hover:underline">Thử lại</button>
        </div>

        <!-- 1. Subjects Selection (Levels Mode) -->
        <div v-else-if="viewMode === 'levels' && !selectedSubject" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up-reveal stagger-2">
          <div 
            v-for="subject in filteredSubjects" 
            :key="subject.id"
            @click="selectSubject(subject.id)"
            class="group card-interactive p-6 flex flex-col gap-6 cursor-pointer"
          >
            <div class="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-50">
              <img v-if="subject.imageUrl" :src="resolveAssetUrl(subject.imageUrl)" :alt="subject.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <i class="fa-solid fa-book text-4xl text-blue-200 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6"></i>
              </div>
              <!-- Simulated Progress Overlay -->
              <div class="absolute bottom-4 left-4 right-4 z-20">
                <div class="h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
                  <div class="h-full bg-white rounded-full transition-all duration-1000" :style="{ width: `${Math.floor(Math.random() * 60 + 20)}%` }"></div>
                </div>
              </div>
            </div>
            <div>
              <h3 class="m-0 text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{{ subject.name }}</h3>
              <p class="mt-2 mb-0 text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <i class="fa-solid fa-layer-group text-[10px] text-indigo-400"></i>
                {{ getTopicCount(subject.id) }} chuyên đề
              </p>
            </div>
          </div>
        </div>

        <!-- 1b. Bookmarks Mode -->
        <div v-else-if="viewMode === 'bookmarks' && !selectedSubject" class="space-y-8 animate-fade-in">
          <div v-if="bookmarkedQuestions.length === 0" class="card-elevated p-20 text-center">
            <div class="h-24 w-24 mx-auto rounded-[2rem] bg-slate-50 flex items-center justify-center mb-8 text-slate-200">
              <i class="fa-solid fa-bookmark text-4xl"></i>
            </div>
            <h3 class="text-xl font-black text-slate-900">Chưa có câu hỏi đã lưu</h3>
            <p class="text-slate-400 font-medium text-sm mt-2">Hãy nhấn biểu tượng bookmark ở góc mỗi câu hỏi để xem lại tại đây.</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article
              v-for="(q, index) in bookmarkedQuestions"
              :key="`bookmark-${q.id}`"
              class="animate-slide-up-reveal group flex flex-col h-full overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-3 transition-all duration-500 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5"
            >
              <div class="flex items-center justify-between gap-4 border-b border-slate-50 px-8 py-6">
                <div class="flex items-center gap-4">
                  <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 text-sm font-black shadow-inner">
                    {{ (Number(index) + 1).toString().padStart(2, '0') }}
                  </span>
                  <p class="m-0 text-[10px] font-black uppercase tracking-[0.2em] text-black/60">Câu hỏi đã lưu</p>
                </div>
                <button 
                  @click="toggleBookmark(q)"
                  class="h-11 w-11 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition-all hover:bg-rose-100 border border-rose-100"
                >
                  <i class="fa-solid fa-bookmark"></i>
                </button>
              </div>
              
              <div class="px-8 py-8 flex flex-col grow">
                <p class="text-lg font-black leading-relaxed text-slate-900 leading-relaxed">{{ q.content }}</p>
                
                <div v-if="q.url" class="mt-8 overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 p-3">
                  <img :src="resolveAssetUrl(q.url)" class="max-h-64 rounded-[1.5rem] object-contain w-full" alt="Question" />
                </div>

                <div class="mt-10 space-y-4">
                  <button 
                    @click="q._showAnswer = !q._showAnswer"
                    class="w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95"
                  >
                    {{ q._showAnswer ? 'Ẩn lời giải' : 'Xem lời giải' }}
                  </button>
                  
                  <div v-if="q._showAnswer" class="animate-slide-up-reveal rounded-3xl bg-emerald-50 border border-emerald-100 p-6">
                    <p class="text-xs font-black uppercase tracking-widest text-emerald-600 mb-3">Đáp án đúng</p>
                    <div v-for="opt in q.options" :key="opt.id">
                      <div v-if="opt.isCorrect" class="text-base font-bold text-slate-900 leading-relaxed">
                        {{ opt.content }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- 2. Topics Selection -->
        <div v-else-if="!selectedTopic" class="grid gap-4 animate-slide-up-reveal">
          <div 
            v-for="topic in filteredTopics" 
            :key="topic.id"
            @click="selectTopic(topic.id)"
            class="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 transition-all duration-500 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/8 cursor-pointer"
          >
            <!-- Background pattern -->
            <div class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-indigo-50 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-150"></div>
            
            <div class="relative flex items-center justify-between gap-6">
              <div class="flex items-center gap-6">
                <div class="h-16 w-16 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-indigo-500/20">
                  <i class="fa-solid fa-layer-group text-2xl"></i>
                </div>
                <div>
                  <h3 class="m-0 text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{{ topic.name }}</h3>
                  <div class="mt-2 flex items-center gap-4">
                    <span class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <i class="fa-solid fa-circle-check text-emerald-500"></i> Luyện tập
                    </span>
                    <span class="h-1 w-1 rounded-full bg-slate-200"></span>
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Chi tiết</span>
                  </div>
                </div>
              </div>
              
              <button class="h-12 w-12 rounded-xl bg-slate-50 text-slate-300 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/20">
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
          <div v-if="!filteredTopics.length" class="card-elevated p-20 text-center">
            <p class="text-slate-400 font-bold">Môn học này hiện chưa có chuyên đề nào.</p>
          </div>
        </div>

        <!-- 3. Question List -->
        <div v-else class="space-y-6 animate-slide-up-reveal">
          <div class="flex items-center justify-between px-2">
            <h2 class="m-0 text-2xl font-black text-slate-900">Danh sách câu hỏi</h2>
            <span class="text-xs font-black uppercase tracking-widest text-slate-500">{{ questions.length }} câu hỏi</span>
          </div>

          <div v-for="(q, idx) in questions" :key="q.id" class="card-elevated overflow-hidden border border-slate-100">
            <div class="p-6 sm:p-8">
              <div class="flex items-center justify-between gap-4 border-b border-slate-50 px-8 py-4 bg-slate-50/50 -mx-8 -mt-8 mb-8">
                <div class="flex items-center gap-3">
                  <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white text-[11px] font-black shadow-lg shadow-indigo-500/20">
                    {{ (Number(idx) + 1).toString().padStart(2, '0') }}
                  </span>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Câu hỏi</span>
                  <span 
                    class="ml-2 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border"
                    :class="q.difficulty === 'EASY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : (q.difficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100')"
                  >
                    {{ q.difficulty === 'EASY' ? 'Dễ' : (q.difficulty === 'MEDIUM' ? 'Trung bình' : 'Khó') }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    @click="toggleBookmark(q)"
                    class="h-9 w-9 flex items-center justify-center rounded-xl bg-white transition-all border border-slate-100 active:scale-90"
                    :class="isBookmarked(q.id) ? 'text-rose-500 bg-rose-50 border-rose-100 shadow-sm' : 'text-slate-300 hover:bg-rose-50 hover:text-rose-500'"
                  >
                    <i :class="isBookmarked(q.id) ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'" class="text-xs"></i>
                  </button>
                </div>
              </div>

              <div class="prose max-w-none">
                <p class="text-lg font-bold text-slate-900 leading-relaxed mb-6">
                  <MathContent :content="q.content" :format="q.contentFormat" />
                </p>
                <img v-if="q.url" :src="resolveAssetUrl(q.url)" class="rounded-2xl max-h-80 w-auto mb-6 shadow-sm border border-slate-100" />
              </div>

              <!-- Options -->
              <div v-if="q.options && q.options.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="(opt, oi) in q.options" 
                  :key="opt.id"
                  class="flex items-center gap-4 rounded-2xl border p-4 transition-all"
                  :class="opt.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'"
                >
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow-sm"
                    :class="opt.isCorrect ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-100'"
                  >
                    {{ String.fromCharCode(65 + Number(oi)) }}
                  </span>
                  <span class="text-sm font-bold" :class="opt.isCorrect ? 'text-emerald-700' : 'text-slate-600'">
                    <MathContent :content="opt.content.replace(/^[A-D]\.\s*/, '')" :format="q.contentFormat" />
                  </span>
                  <i v-if="opt.isCorrect" class="fa-solid fa-check text-emerald-500 ml-auto"></i>
                </div>
              </div>

              <!-- Explanation / Sample Answer -->
              <div v-if="q.explanation || q.sampleAnswer" class="mt-8 pt-8 border-t border-slate-50">
                <div class="flex items-center gap-3 mb-4">
                  <div class="h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <i class="fa-solid fa-lightbulb"></i>
                  </div>
                  <h4 class="m-0 text-sm font-black uppercase tracking-widest text-indigo-600">Giải thích chi tiết</h4>
                </div>
                <div class="rounded-2xl bg-indigo-50/30 p-6 border border-indigo-100/50">
                  <p class="text-sm font-bold text-slate-700 leading-relaxed m-0 italic">
                    <MathContent :content="q.explanation || q.sampleAnswer" :format="q.contentFormat" />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!questions.length" class="card-elevated p-20 text-center">
            <p class="text-slate-400 font-bold">Chuyên đề này hiện chưa có câu hỏi luyện tập.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getLevels, getSubjects, getTopics, type LevelItem, type SubjectItem, type TopicItem } from '@/services/learningService';
import { getAllQuestions } from '@/services/questionService';
import QuestionEditModal from '@/components/admin/QuestionEditModal.vue';
import MathContent from '@/components/common/MathContent.vue';

const auth = useAuthStore();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveAssetUrl = (assetUrl?: string) => {
  if (!assetUrl) return undefined;
  return /^https?:\/\//i.test(assetUrl) ? assetUrl : `${BACKEND_ORIGIN}${assetUrl.startsWith('/') ? '' : '/'}${assetUrl}`;
};

const loading = ref(false);
const error = ref<string | null>(null);

const levels = ref<LevelItem[]>([]);
const subjects = ref<SubjectItem[]>([]);
const topics = ref<TopicItem[]>([]);
const questions = ref<any[]>([]);

const selectedLevel = ref<number | null>(null);
const selectedSubject = ref<number | null>(null);
const selectedTopic = ref<number | null>(null);
const viewMode = ref<'levels' | 'bookmarks'>('levels');

// Admin Edit Logic (Removed)

// Bookmarks logic
const bookmarkedQuestions = ref<any[]>(JSON.parse(localStorage.getItem('edu_bookmarks') || '[]'));

const toggleBookmark = (q: any) => {
  const index = bookmarkedQuestions.value.findIndex((item: any) => item.id === q.id);
  if (index > -1) {
    bookmarkedQuestions.value.splice(index, 1);
  } else {
    // Add q to bookmarks with _showAnswer false
    bookmarkedQuestions.value.push({ ...q, _showAnswer: false });
  }
  localStorage.setItem('edu_bookmarks', JSON.stringify(bookmarkedQuestions.value));
};

const isBookmarked = (qId: number) => {
  return bookmarkedQuestions.value.some((item: any) => item.id === qId);
};

const filteredSubjects = computed(() => {
  if (!selectedLevel.value) return subjects.value;
  return subjects.value.filter(s => s.levelId === selectedLevel.value);
});

const filteredTopics = computed(() => {
  if (!selectedSubject.value) return [];
  return topics.value.filter(t => t.subjectId === selectedSubject.value);
});

const getTopicCount = (subjectId: number) => {
  return topics.value.filter(t => t.subjectId === subjectId).length;
};

const initData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [lRes, sRes, tRes] = await Promise.all([
      getLevels(),
      getSubjects(),
      getTopics()
    ]);
    
    levels.value = lRes.data?.data || [];
    subjects.value = sRes.data?.data || [];
    topics.value = tRes.data?.data || [];

    if (levels.value.length > 0) {
      selectedLevel.value = levels.value[0]?.id ?? null;
    }
  } catch (err) {
    error.value = 'Không thể tải dữ liệu học tập. Vui lòng thử lại sau.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const selectSubject = (id: number) => {
  selectedSubject.value = id;
};

const selectTopic = async (id: number) => {
  selectedTopic.value = id;
  loading.value = true;
  try {
    const qRes = await getAllQuestions({ topicId: id, size: 50 });
    questions.value = qRes.data?.data?.items || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  if (selectedTopic.value) {
    selectedTopic.value = null;
    questions.value = [];
  } else if (selectedSubject.value) {
    selectedSubject.value = null;
  }
};

onMounted(() => {
  initData();
});
</script>

<style scoped>
.prose :deep(p) {
  margin: 0;
}
</style>
