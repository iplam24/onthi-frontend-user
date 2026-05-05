<template>
  <section class="mx-auto w-full max-w-6xl space-y-12 px-2 sm:px-4">

    <!-- ═══ REFINED ELECTRIC COUNTDOWN (TOP) ═══ -->
    <div 
      v-if="auth.isAuthenticated && countdowns.length > 0"
      class="animate-slide-up-reveal relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] p-0.5 shadow-2xl shadow-blue-500/20"
    >
      <div class="relative overflow-hidden rounded-[2.35rem] bg-gradient-to-br from-indigo-700 via-blue-600 to-rose-600 p-8 sm:p-10 lg:p-12">
        <!-- Subtle Energy Mesh -->
        <div class="pointer-events-none absolute -right-10 -top-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-[80px] animate-pulse"></div>
        <div class="pointer-events-none absolute -left-10 -bottom-10 h-80 w-80 rounded-full bg-rose-500/30 blur-[80px] animate-pulse" style="animation-delay: -2s"></div>

        <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div class="flex-1 text-center lg:text-left space-y-6">
            <div class="inline-flex items-center gap-3 rounded-full bg-black/40 border border-white/20 px-5 py-2">
              <span class="relative flex h-2.5 w-2.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
              </span>
              <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/90">Đường tới thành công</span>
            </div>
            
            <div class="space-y-3">
              <h2 class="m-0 text-3xl font-black text-white sm:text-5xl lg:text-6xl tracking-tighter leading-[1.1]">
                {{ countdowns[0]?.title }}
              </h2>
              <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <span class="inline-flex items-center gap-2.5 rounded-xl bg-white/20 px-4 py-2 border border-white/20 text-[10px] font-black uppercase tracking-widest text-white">
                  <i class="fa-solid fa-graduation-cap text-blue-300"></i>
                  {{ countdowns[0]?.levelName }}
                </span>
                <span class="text-[10px] font-black text-white/70 uppercase tracking-[0.15em] flex items-center gap-2">
                  <i class="fa-regular fa-calendar-check text-rose-300"></i>
                  {{ countdowns[0] ? new Date(countdowns[0].examDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }) : '' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Refined Compact Timer -->
          <div class="flex flex-col sm:flex-row items-center gap-8">
            <div class="group relative">
              <div class="absolute -inset-6 rounded-full bg-rose-500/20 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div class="relative flex flex-col items-center justify-center h-32 w-32 sm:h-40 sm:w-40 rounded-[2.5rem] bg-white p-1 shadow-2xl transform transition-transform duration-500 hover:scale-105">
                <div class="flex h-full w-full flex-col items-center justify-center rounded-[2.25rem] bg-black border border-black">
                  <span class="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tighter leading-none tabular-nums">
                    {{ countdowns[0] ? calculateDaysRemaining(countdowns[0].examDate) : 0 }}
                  </span>
                  <span class="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400 mt-2">Ngày còn lại</span>
                  
                  <div v-if="countdowns[0] && calculateDaysRemaining(countdowns[0].examDate) <= 30" class="absolute -top-4 -right-4 h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-xl animate-bounce">
                    <i class="fa-solid fa-fire text-lg"></i>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <router-link
                to="/learning"
                class="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 text-[11px] font-black uppercase tracking-widest text-black shadow-xl transition-all hover:bg-rose-500 hover:text-white active:scale-95"
              >
                <span class="relative z-10">Ôn tập ngay</span>
                <i class="fa-solid fa-bolt-lightning text-[10px] relative z-10 transition-transform group-hover:translate-x-1"></i>
              </router-link>
              
              <div v-if="countdowns.length > 1" class="hidden sm:flex flex-col gap-2">
                 <div 
                  v-for="item in countdowns.slice(1, 3)" 
                  :key="item.id"
                  class="flex items-center gap-4 rounded-xl bg-black/40 border border-white/20 p-2 pr-6 hover:bg-white/10 transition-all cursor-pointer group/item"
                >
                  <div class="h-8 w-8 flex items-center justify-center rounded-lg bg-white text-blue-600 font-black text-[10px]">
                    {{ calculateDaysRemaining(item.examDate) }}
                  </div>
                  <div class="space-y-0">
                    <p class="m-0 text-[10px] font-black text-white truncate max-w-[100px]">{{ item.title }}</p>
                    <p class="m-0 text-[7px] font-bold text-white/40 uppercase tracking-widest">Sắp đến</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ HERO ═══ -->
    <div
      class="hero-section premium-overlay relative overflow-hidden rounded-[2.5rem] p-10 sm:p-16 lg:p-24 shadow-2xl shadow-blue-500/20 bg-gradient-brand"
    >
      <!-- Artistic Background Elements -->
      <div class="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[100px] animate-pulse"></div>
      <div class="pointer-events-none absolute -bottom-32 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]"></div>
      
      <!-- Floating Shapes -->
      <div class="absolute top-1/4 right-10 h-16 w-16 bg-white/10 rounded-2xl rotate-12 animate-float"></div>
      <div class="absolute bottom-1/4 left-10 h-12 w-12 bg-white/5 rounded-full animate-float" style="animation-delay: -2s"></div>

      <div class="relative z-10 max-w-4xl space-y-8 text-center sm:text-left">
        <span class="animate-slide-up-reveal inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/20 px-5 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-white">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-200 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
          </span>
          Next-Gen Education
        </span>

        <h1 class="animate-slide-up-reveal stagger-1 m-0 text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl">
          Học thông minh,
          <br class="hidden sm:block" />
          <span class="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">vươn tới tầm cao</span>
        </h1>

        <p class="animate-slide-up-reveal stagger-2 m-0 max-w-2xl text-lg leading-relaxed text-white/95 sm:text-xl font-medium">
          Trải nghiệm nền tảng luyện thi cá nhân hóa với công nghệ vượt trội, giúp bạn bứt phá giới hạn và đạt kết quả tối ưu.
        </p>

        <div class="animate-slide-up-reveal stagger-3 flex flex-wrap justify-center sm:justify-start gap-5 pt-4">
          <router-link
            to="/exams"
            class="group inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-blue-600 shadow-xl shadow-blue-900/10 transition-all hover:scale-105 hover:-translate-y-1 active:scale-95"
          >
            Bắt đầu ngay
            <i class="fa-solid fa-bolt-lightning text-xs transition-transform group-hover:rotate-12"></i>
          </router-link>
          <router-link
            to="/learning"
            class="inline-flex items-center gap-3 rounded-2xl border border-white/40 bg-white/20 px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white/30 active:scale-95"
          >
            Tìm hiểu thêm
          </router-link>
        </div>
      </div>
    </div>



    <!-- ═══ STATS ═══ -->
    <div
      class="animate-slide-up-reveal stagger-2 overflow-hidden rounded-[2.5rem] bg-white p-10 sm:p-16 border border-gray-100 shadow-xl shadow-gray-200/40"
    >
      <div class="flex flex-wrap items-end justify-between gap-8 mb-16">
        <div class="max-w-2xl">
          <p class="text-blue-600 font-black uppercase tracking-widest text-[10px] mb-3">Live Statistics</p>
          <h2 class="m-0 text-3xl font-black text-black sm:text-5xl tracking-tight">
            Nơi hàng ngàn tài năng<br/><span class="text-blue-600">tỏa sáng mỗi ngày</span>
          </h2>
        </div>
        <button
          type="button"
          class="inline-flex h-12 items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/50 px-6 text-xs font-black uppercase tracking-widest text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
          :disabled="statsLoading"
          @click="loadDashboardStats"
        >
          <i :class="['fa-solid fa-rotate-right', statsLoading ? 'animate-spin' : '']"></i>
          Cập nhật
        </button>
      </div>

      <!-- Hero stats grid -->
      <div class="grid gap-8 md:grid-cols-3">
        <article
          v-for="(item, idx) in heroStats"
          :key="item.key"
          class="group relative p-8 rounded-3xl border border-transparent hover:border-blue-100 transition-all duration-500"
        >
          <div class="absolute inset-0 bg-blue-50/0 rounded-3xl transition-colors group-hover:bg-blue-50/30"></div>
          <div class="relative z-10">
            <p class="m-0 text-[10px] font-black uppercase tracking-widest text-gray-400">{{ item.label }}</p>
            <p class="mb-0 mt-4 text-6xl font-black text-black tracking-tighter group-hover:text-blue-600 transition-colors">
              {{ formatNumber(item.value) }}<span class="text-blue-400">+</span>
            </p>
            <p class="mb-0 mt-3 text-sm font-medium text-black/60">{{ item.caption }}</p>
          </div>
        </article>
      </div>
    </div>

    <!-- ═══ FEATURES ═══ -->
    <div class="grid gap-8 md:grid-cols-3">
      <article
        v-for="(feature, idx) in features"
        :key="feature.title"
        class="animate-slide-up-reveal group relative overflow-hidden rounded-[2.5rem] bg-white p-10 border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
        :style="{ animationDelay: `${0.4 + Number(idx) * 0.1}s` }"
      >
        <div :class="['mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110 shadow-lg', feature.bgClass]">
          <i :class="[feature.icon, 'text-2xl', feature.textClass]"></i>
        </div>
        <h3 class="m-0 text-xl font-black tracking-tight text-black">{{ feature.title }}</h3>
        <p class="mb-0 mt-4 text-sm font-medium leading-relaxed text-black/80">{{ feature.description }}</p>
        
        <div class="mt-8 pt-8 border-t border-gray-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span class="text-xs font-black uppercase tracking-widest text-blue-600 inline-flex items-center gap-2">
            Khám phá ngay <i class="fa-solid fa-arrow-right"></i>
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
import { useAuthStore } from '@/stores/auth';

const trustBadges = ['Miễn phí hoàn toàn', 'Không cần cài đặt', 'Cập nhật liên tục'];

const features = [
  {
    icon: 'fa-solid fa-route',
    title: 'Lộ trình cá nhân hóa',
    description: 'Học theo chuyên đề, theo dõi phần đã hoàn thành và tập trung cải thiện điểm yếu một cách hiệu quả.',
    bgClass: 'bg-indigo-100',
    textClass: 'text-indigo-600',
    gradientClass: 'bg-gradient-to-br from-indigo-50/80 to-transparent',
    shadowClass: 'group-hover:shadow-indigo-200',
  },
  {
    icon: 'fa-solid fa-file-signature',
    title: 'Thi thử sát đề thực tế',
    description: 'Kho đề phân loại theo cấp độ, chấm điểm tự động và phản hồi chi tiết từng câu hỏi.',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-600',
    gradientClass: 'bg-gradient-to-br from-emerald-50/80 to-transparent',
    shadowClass: 'group-hover:shadow-emerald-200',
  },
  {
    icon: 'fa-solid fa-chart-line',
    title: 'Theo dõi tiến độ',
    description: 'Biểu đồ thống kê trực quan giúp bạn nắm rõ sự tiến bộ và định hướng ôn tập thông minh hơn.',
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-600',
    gradientClass: 'bg-gradient-to-br from-amber-50/80 to-transparent',
    shadowClass: 'group-hover:shadow-amber-200',
  },
];

const createDefaultStats = (): DashboardStatistics => ({
  totalUsers: 0,
  newUsersToday: 0,
  totalQuestions: 0,
  totalExams: 0,
  totalAttempts: 0,
  totalSubjects: 0,
  totalLevels: 0,
  totalTopics: 0,
});

const statsLoading = ref(false);
const statsError = ref<string | null>(null);
const dashboardStats = ref<DashboardStatistics>(createDefaultStats());
const animatedStats = ref<DashboardStatistics>(createDefaultStats());
const animationFrameIds = new Set<number>();

const auth = useAuthStore();
const countdowns = ref<CountdownItem[]>([]);
const countdownLoading = ref(false);

const calculateDaysRemaining = (dateString: string) => {
  const diff = new Date(dateString).getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const heroStats = computed(() => [
  {
    key: 'totalUsers',
    label: 'Học sinh',
    value: animatedStats.value.totalUsers,
    caption: 'đang ôn luyện cùng hệ thống',
  },
  {
    key: 'totalAttempts',
    label: 'Lượt làm bài',
    value: animatedStats.value.totalAttempts,
    caption: 'đã hoàn thành thành công',
  },
  {
    key: 'totalQuestions',
    label: 'Câu hỏi',
    value: animatedStats.value.totalQuestions,
    caption: 'sẵn sàng cho bạn luyện tập',
  },
]);

const secondaryStats = computed(() => [
  { key: 'totalExams', label: 'Đề thi', value: animatedStats.value.totalExams, icon: 'fa-solid fa-file-pen' },
  { key: 'totalSubjects', label: 'Môn học', value: animatedStats.value.totalSubjects, icon: 'fa-solid fa-book-open' },
  { key: 'totalLevels', label: 'Cấp học', value: animatedStats.value.totalLevels, icon: 'fa-solid fa-layer-group' },
  { key: 'totalTopics', label: 'Chuyên đề', value: animatedStats.value.totalTopics, icon: 'fa-solid fa-lightbulb' },
  { key: 'newUsersToday', label: 'Mới hôm nay', value: animatedStats.value.newUsersToday, icon: 'fa-solid fa-user-plus' },
]);

const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(Number(value) || 0);

const stopCounterAnimations = () => {
  for (const id of animationFrameIds) cancelAnimationFrame(id);
  animationFrameIds.clear();
};

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
  countdownLoading.value = true;
  try {
    const response = await getCountdowns();
    countdowns.value = response.data?.data || [];
  } catch (error) {
    console.error('Failed to load countdowns:', error);
  } finally {
    countdownLoading.value = false;
  }
};

const loadDashboardStats = async () => {
  statsLoading.value = true;
  statsError.value = null;
  try {
    const response = await getDashboardStatistics();
    const payload = response.data?.data ?? {};
    dashboardStats.value = {
      totalUsers: Number(payload.totalUsers) || 0,
      newUsersToday: Number(payload.newUsersToday) || 0,
      totalQuestions: Number(payload.totalQuestions) || 0,
      totalExams: Number(payload.totalExams) || 0,
      totalAttempts: Number(payload.totalAttempts) || 0,
      totalSubjects: Number(payload.totalSubjects) || 0,
      totalLevels: Number(payload.totalLevels) || 0,
      totalTopics: Number(payload.totalTopics) || 0,
    };
    animateDashboardStats(dashboardStats.value);
  } catch (error) {
    statsError.value = 'Không thể tải thống kê hệ thống. Vui lòng thử lại.';
  } finally {
    statsLoading.value = false;
  }
};

onMounted(() => {
  void loadDashboardStats();
  void loadCountdowns();
});
onBeforeUnmount(() => stopCounterAnimations());
</script>