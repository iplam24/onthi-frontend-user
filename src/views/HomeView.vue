<template>
  <section class="mx-auto w-full max-w-6xl space-y-16 px-2 sm:px-4">

    <!-- ═══ UPDATE PROFILE WARNING ═══ -->
    <div v-if="auth.isAuthenticated && hasNoLevelId" class="animate-slide-down relative overflow-hidden rounded-2xl bg-amber-50 border border-amber-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
          <i class="fa-solid fa-circle-exclamation text-xl"></i>
        </div>
        <div>
          <h3 class="m-0 text-sm font-extrabold text-amber-800">Cập nhật hồ sơ học tập</h3>
          <p class="m-0 text-xs text-amber-700 mt-1">Bạn chưa cập nhật khối/lớp hiện tại. Hãy cập nhật để nhận lộ trình ôn tập phù hợp nhất.</p>
        </div>
      </div>
      <router-link to="/profile" class="flex-shrink-0 whitespace-nowrap btn-primary bg-amber-500 hover:bg-amber-600 px-5 py-2 text-xs">
        Cập nhật ngay <i class="fa-solid fa-arrow-right ml-1"></i>
      </router-link>
    </div>

    <!-- ═══ COUNTDOWN BANNER ═══ -->
    <div 
      v-if="auth.isAuthenticated && countdowns.length > 0"
      class="animate-slide-up-reveal relative overflow-hidden rounded-[2rem] p-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 shadow-2xl shadow-indigo-500/15"
    >
      <div class="relative overflow-hidden rounded-[calc(2rem-2px)] bg-white/80 backdrop-blur-3xl p-8 sm:p-10 lg:p-12">
        <div class="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-indigo-500/15 blur-[80px] animate-pulse"></div>
        <div class="pointer-events-none absolute -left-10 -bottom-10 h-72 w-72 rounded-full bg-purple-500/15 blur-[80px] animate-pulse" style="animation-delay: -2s"></div>
        <div class="pointer-events-none absolute top-1/3 right-12 h-14 w-14 rounded-xl bg-white/5 rotate-12 animate-float-slow"></div>

        <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div class="flex-1 text-center lg:text-left space-y-5">
            <div class="inline-flex items-center gap-3 rounded-full bg-white/10 border border-white/10 px-5 py-2">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
              </span>
              <span class="text-[10px] font-extrabold uppercase tracking-[0.3em] text-indigo-600">Đường tới thành công</span>
            </div>
            <h2 class="m-0 text-2xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl tracking-tight leading-[1.15]">
              {{ countdowns[0]?.title }}
            </h2>
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span class="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3.5 py-1.5 border border-indigo-100 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                <i class="fa-solid fa-graduation-cap text-indigo-500"></i>
                {{ countdowns[0]?.levelName }}
              </span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <i class="fa-regular fa-calendar text-slate-400"></i>
                {{ countdowns[0] ? new Date(countdowns[0].examDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }) : '' }}
              </span>
            </div>
          </div>

          <!-- Days counter -->
          <div class="flex items-center gap-8">
            <div class="group relative">
              <div class="absolute -inset-4 rounded-3xl bg-indigo-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div class="relative h-28 w-28 sm:h-36 sm:w-36 rounded-[1.75rem] bg-indigo-50/50 border border-indigo-100 backdrop-blur-sm flex flex-col items-center justify-center transition-transform duration-500 hover:scale-105">
                <span class="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tighter leading-none tabular-nums">
                  {{ countdowns[0] ? calculateDaysRemaining(countdowns[0].examDate) : 0 }}
                </span>
                <span class="text-[8px] font-extrabold uppercase tracking-[0.25em] text-indigo-600 mt-1.5">Ngày còn lại</span>
              </div>
            </div>
            <router-link
              to="/learning"
              class="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-indigo-600 px-5 sm:px-7 py-3 sm:py-4 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-white shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-95"
            >
              <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-indigo-100 to-transparent transition-transform duration-700 group-hover:translate-x-full skew-x-12"></span>
              <span class="relative z-10">Ôn tập</span>
              <i class="fa-solid fa-bolt-lightning text-xs relative z-10 text-indigo-500"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ HERO SECTION ═══ -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-brand shadow-2xl shadow-indigo-500/12">
      <!-- Decorative elements -->
      <div class="pointer-events-none absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-white/8 blur-[120px]"></div>
      <div class="pointer-events-none absolute -bottom-32 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[100px]"></div>
      <div class="pointer-events-none absolute top-1/4 right-[10%] h-20 w-20 rounded-2xl bg-white/8 rotate-12 animate-float-slow"></div>
      <div class="pointer-events-none absolute bottom-1/4 left-[8%] h-12 w-12 rounded-full bg-white/5 animate-float" style="animation-delay:-2s"></div>

      <div class="relative z-10 flex flex-col lg:flex-row items-center gap-12 p-10 sm:p-16 lg:p-20">
        <!-- Text -->
        <div class="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
          <span class="animate-slide-up-reveal inline-flex items-center gap-2.5 rounded-full border border-indigo-100 bg-indigo-50 px-5 py-2 text-[10px] font-extrabold uppercase tracking-[0.25em] text-indigo-600 shadow-sm">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
            </span>
            Next-Gen Education
          </span>

          <h1 class="animate-slide-up-reveal stagger-1 m-0 text-3xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Học thông minh,
            <br class="hidden sm:block" />
            <span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">vươn tới tầm cao</span>
          </h1>

          <p class="animate-slide-up-reveal stagger-2 m-0 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg font-medium">
            Trải nghiệm nền tảng luyện thi cá nhân hóa với công nghệ vượt trội, giúp bạn bứt phá giới hạn.
          </p>

          <div class="animate-slide-up-reveal stagger-3 flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
            <router-link
              to="/exams"
              class="group inline-flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-extrabold uppercase tracking-widest text-white shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl active:scale-95"
            >
              Bắt đầu ngay
              <i class="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
            </router-link>
            <router-link
              to="/learning"
              class="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-8 py-4 text-sm font-extrabold uppercase tracking-widest text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:border-slate-300 active:scale-95"
            >
              Tìm hiểu thêm
            </router-link>
          </div>
        </div>

        <!-- Hero Image -->
        <div class="animate-slide-up-reveal stagger-3 flex-shrink-0 hidden lg:block">
          <img
            src="@/asset/illustrations/hero-studying.png"
            alt="Students studying"
            class="h-[340px] w-auto drop-shadow-2xl animate-float-slow"
          />
        </div>
      </div>
    </div>

    <!-- ═══ STATS ═══ -->
    <div class="animate-slide-up-reveal stagger-2 overflow-hidden rounded-[2.5rem] bg-white p-10 sm:p-14 border border-slate-100/80 shadow-xl shadow-slate-200/20">
      <div class="flex flex-wrap items-end justify-between gap-8 mb-14">
        <div class="max-w-2xl">
          <p class="text-indigo-600 font-extrabold uppercase tracking-widest text-[10px] mb-3 flex items-center gap-2.5">
            <span class="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            Live Statistics
          </p>
          <h2 class="m-0 text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            Nơi hàng ngàn tài năng <span class="text-indigo-600">tỏa sáng</span>
          </h2>
        </div>
        <button
          type="button"
          class="btn-secondary text-xs font-extrabold uppercase tracking-widest"
          :disabled="statsLoading"
          @click="loadDashboardStats"
        >
          <i :class="['fa-solid fa-rotate-right transition-transform', statsLoading ? 'animate-spin' : 'group-hover:rotate-180']"></i>
          Cập nhật
        </button>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(item, idx) in heroStats"
          :key="item.key"
          class="group relative overflow-hidden rounded-2xl p-8 border border-transparent transition-all duration-500 hover:border-indigo-100 hover:bg-indigo-50/30"
        >
          <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-indigo-100/0 transition-all duration-700 group-hover:bg-indigo-100/50 group-hover:scale-[2]"></div>
          <div class="relative z-10">
            <p class="m-0 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{{ item.label }}</p>
            <p class="mb-0 mt-3 text-5xl font-extrabold text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors duration-500 tabular-nums">
              {{ formatNumber(item.value) }}<span class="text-indigo-300 text-3xl ml-0.5">+</span>
            </p>
            <p class="mb-0 mt-2 text-sm font-medium text-slate-500">{{ item.caption }}</p>
          </div>
        </article>
      </div>
    </div>

    <!-- ═══ FEATURES ═══ -->
    <div class="grid gap-6 md:grid-cols-3">
      <article
        v-for="(feature, idx) in features"
        :key="feature.title"
        class="animate-slide-up-reveal group relative overflow-hidden rounded-[2rem] bg-white p-9 border border-slate-100/80 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/6 hover:-translate-y-2 hover:border-indigo-100"
        :style="{ animationDelay: `${0.3 + Number(idx) * 0.1}s` }"
      >
        <div class="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[2.5]" :class="feature.glowBg"></div>

        <div :class="['relative z-10 mb-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-lg', feature.bgClass]">
          <i :class="[feature.icon, 'text-xl', feature.textClass]"></i>
        </div>
        <h3 class="m-0 text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">{{ feature.title }}</h3>
        <p class="mb-0 mt-3 text-sm font-medium leading-relaxed text-slate-500">{{ feature.description }}</p>

        <div class="mt-7 pt-6 border-t border-slate-50 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <span class="text-xs font-extrabold uppercase tracking-widest text-indigo-600 inline-flex items-center gap-2">
            Khám phá <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
          </span>
        </div>
      </article>
    </div>

  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { getDashboardStatistics, type DashboardStatistics } from '@/services/statisticsService';
import { getCountdowns, type CountdownItem } from '@/services/countdownService';
import { getUserProfile } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';

const features = [
  {
    icon: 'fa-solid fa-route',
    title: 'Lộ trình cá nhân hóa',
    description: 'Học theo chuyên đề, theo dõi phần đã hoàn thành và tập trung cải thiện điểm yếu một cách hiệu quả.',
    bgClass: 'bg-indigo-100',
    textClass: 'text-indigo-600',
    glowBg: 'bg-indigo-50',
  },
  {
    icon: 'fa-solid fa-file-signature',
    title: 'Thi thử sát đề thực tế',
    description: 'Kho đề phân loại theo cấp độ, chấm điểm tự động và phản hồi chi tiết từng câu hỏi.',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-600',
    glowBg: 'bg-emerald-50',
  },
  {
    icon: 'fa-solid fa-chart-line',
    title: 'Theo dõi tiến độ',
    description: 'Biểu đồ thống kê trực quan giúp bạn nắm rõ sự tiến bộ và ôn tập thông minh hơn.',
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-600',
    glowBg: 'bg-amber-50',
  },
];

const createDefaultStats = (): DashboardStatistics => ({
  totalUsers: 0, newUsersToday: 0, totalQuestions: 0, totalExams: 0,
  totalAttempts: 0, totalSubjects: 0, totalLevels: 0, totalTopics: 0,
});

const statsLoading = ref(false);
const statsError = ref<string | null>(null);
const dashboardStats = ref<DashboardStatistics>(createDefaultStats());
const animatedStats = ref<DashboardStatistics>(createDefaultStats());
const animationFrameIds = new Set<number>();
const auth = useAuthStore();
const countdowns = ref<CountdownItem[]>([]);
const hasNoLevelId = ref(false);

const calculateDaysRemaining = (dateString: string) => {
  const diff = new Date(dateString).getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const heroStats = computed(() => [
  { key: 'totalUsers', label: 'Học sinh', value: animatedStats.value.totalUsers, caption: 'đang ôn luyện cùng hệ thống' },
  { key: 'totalAttempts', label: 'Lượt làm bài', value: animatedStats.value.totalAttempts, caption: 'đã hoàn thành thành công' },
  { key: 'totalQuestions', label: 'Câu hỏi', value: animatedStats.value.totalQuestions, caption: 'sẵn sàng cho bạn luyện tập' },
]);

const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(Number(value) || 0);

const stopCounterAnimations = () => { for (const id of animationFrameIds) cancelAnimationFrame(id); animationFrameIds.clear(); };

const animateNumber = (key: keyof DashboardStatistics, fromValue: number, toValue: number, delayMs: number) => {
  const startAt = performance.now() + delayMs;
  const duration = 1200;
  const step = (now: number) => {
    if (now < startAt) { animationFrameIds.add(requestAnimationFrame(step)); return; }
    const progress = Math.min((now - startAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    animatedStats.value[key] = Math.round(fromValue + (toValue - fromValue) * eased);
    if (progress < 1) animationFrameIds.add(requestAnimationFrame(step));
  };
  animationFrameIds.add(requestAnimationFrame(step));
};

const animateDashboardStats = (nextStats: DashboardStatistics) => {
  stopCounterAnimations();
  const keys = Object.keys(nextStats) as Array<keyof DashboardStatistics>;
  for (const [index, key] of keys.entries()) {
    animateNumber(key, Number(animatedStats.value[key]) || 0, Number(nextStats[key]) || 0, 80 * index);
  }
};

const loadCountdowns = async () => {
  if (!auth.isAuthenticated) return;
  try {
    const response = await getCountdowns();
    countdowns.value = response.data?.data || [];
  } catch (error) { console.error('Failed to load countdowns:', error); }
};

const checkUserProfile = async () => {
  if (!auth.isAuthenticated) return;
  try {
    const res = await getUserProfile();
    const profile = res.data?.data;
    if (profile && profile.levelId == null) {
      hasNoLevelId.value = true;
    }
  } catch (error) { console.error('Failed to load user profile:', error); }
};

const loadDashboardStats = async () => {
  statsLoading.value = true;
  statsError.value = null;
  try {
    const response = await getDashboardStatistics();
    const payload = response.data?.data ?? {};
    dashboardStats.value = {
      totalUsers: Number(payload.totalUsers) || 0, newUsersToday: Number(payload.newUsersToday) || 0,
      totalQuestions: Number(payload.totalQuestions) || 0, totalExams: Number(payload.totalExams) || 0,
      totalAttempts: Number(payload.totalAttempts) || 0, totalSubjects: Number(payload.totalSubjects) || 0,
      totalLevels: Number(payload.totalLevels) || 0, totalTopics: Number(payload.totalTopics) || 0,
    };
    animateDashboardStats(dashboardStats.value);
  } catch (error) { statsError.value = 'Không thể tải thống kê.'; }
  finally { statsLoading.value = false; }
};

onMounted(() => { 
  void loadDashboardStats(); 
  void loadCountdowns(); 
  void checkUserProfile(); 
});
onBeforeUnmount(() => stopCounterAnimations());
</script>