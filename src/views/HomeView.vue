<template>
  <section class="mx-auto w-full max-w-6xl space-y-8 px-2 sm:space-y-10 sm:px-4">
    <div
      class="reveal-up relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:px-10 sm:py-12"
      style="animation-delay: 40ms"
    >
      <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-100 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-16 left-4 h-40 w-40 rounded-full bg-blue-100 blur-3xl"></div>

      <div class="relative max-w-3xl space-y-4">
        <p class="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-sky-700">
          V-Edu Platform
        </p>
        <h1 class="m-0 text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
          Ôn luyện thông minh, giao diện hiện đại và tập trung vào kết quả.
        </h1>
        <p class="m-0 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Ôn thi theo lộ trình cá nhân, làm bài kiểm tra theo thời gian thực và theo dõi tiến bộ bằng bố cục rõ ràng,
          dễ quan sát như trải nghiệm ở khu vực thi.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <router-link
            to="/subjects"
            class="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(59,130,246,0.35)] transition hover:bg-blue-600"
          >
            Bắt đầu làm bài
          </router-link>
          <router-link
            to="/learning"
            class="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Khám phá học liệu
          </router-link>
        </div>
      </div>
    </div>

    <div
      class="marketing-strip reveal-up relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(15,23,42,0.07)] sm:p-6"
      style="animation-delay: 140ms"
    >
      <div class="pointer-events-none absolute -right-16 -top-10 h-36 w-36 rounded-full bg-cyan-200/50 blur-3xl"></div>
      <div class="pointer-events-none absolute -left-14 bottom-2 h-32 w-32 rounded-full bg-blue-200/40 blur-3xl"></div>

      <div class="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="m-0 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-emerald-700">
            <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
            Đang tăng trưởng mỗi ngày
          </p>
          <h2 class="m-0 mt-2 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
            {{ formatNumber(heroLead.users) }}+ học sinh đang ôn luyện cùng V-Edu
          </h2>
          <p class="mb-0 mt-2 text-sm text-slate-600 sm:text-base">
            Kho học liệu đã tạo ra {{ formatNumber(heroLead.attempts) }}+ lượt luyện tập và
            {{ formatNumber(heroLead.questions) }}+ câu hỏi sẵn sàng cho bạn bứt tốc.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="statsLoading"
          @click="loadDashboardStats"
        >
          <i :class="['fa-solid fa-rotate-right text-xs', statsLoading ? 'animate-spin' : '']" aria-hidden="true"></i>
          {{ statsLoading ? 'Đang cập nhật...' : 'Cập nhật số liệu' }}
        </button>
      </div>

      <p
        v-if="statsError"
        class="relative z-10 mb-0 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"
      >
        {{ statsError }}
      </p>

      <div class="stats-chip-rail relative z-10 mt-4 flex flex-wrap gap-2">
        <span
          v-for="item in proofChips"
          :key="item.key"
          class="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-[0_6px_14px_rgba(15,23,42,0.06)]"
        >
          <i :class="[item.icon, 'text-[11px] text-sky-500']" aria-hidden="true"></i>
          {{ item.text }}
        </span>
      </div>

      <div class="relative z-10 mt-5 grid gap-3 md:grid-cols-3">
        <article
          v-for="item in heroStats"
          :key="item.key"
          class="stats-hero-card reveal-up group rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 p-4"
          :style="{ animationDelay: `${item.delay}ms` }"
        >
          <p class="m-0 text-xs font-bold uppercase tracking-[0.08em] text-sky-700">{{ item.label }}</p>
          <p class="mb-0 mt-2 text-4xl font-extrabold leading-none text-slate-900">{{ formatNumber(item.value) }}+</p>
          <p class="mb-0 mt-1 text-sm font-medium text-slate-600">{{ item.caption }}</p>
        </article>
      </div>

      <div class="relative z-10 mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <article
          v-for="item in secondaryStats"
          :key="item.key"
          class="stats-card reveal-up group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
          :style="{ animationDelay: `${item.delay}ms` }"
        >
          <div class="relative z-10 flex items-start justify-between gap-2">
            <p class="m-0 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{{ item.label }}</p>
            <i :class="[item.icon, 'text-xs text-slate-500']" aria-hidden="true"></i>
          </div>
          <p class="relative z-10 mb-0 mt-2 text-2xl font-extrabold text-slate-900">{{ formatNumber(item.value) }}</p>
        </article>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <article class="reveal-up rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.1)]" style="animation-delay: 220ms">
        <h2 class="m-0 text-lg font-bold text-slate-900">Lộ trình rõ ràng</h2>
        <p class="mb-0 mt-2 text-sm leading-relaxed text-slate-600">
          Học theo chuyên đề, theo dõi phần đã hoàn thành và tập trung vào phần còn yếu.
        </p>
      </article>
      <article class="reveal-up rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.1)]" style="animation-delay: 280ms">
        <h2 class="m-0 text-lg font-bold text-slate-900">Thi thử sát đề</h2>
        <p class="mb-0 mt-2 text-sm leading-relaxed text-slate-600">
          Kho đề được phân loại theo cấp độ, có chấm điểm và phản hồi tức thì.
        </p>
      </article>
      <article class="reveal-up rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.1)]" style="animation-delay: 340ms">
        <h2 class="m-0 text-lg font-bold text-slate-900">Đồng bộ tiến độ</h2>
        <p class="mb-0 mt-2 text-sm leading-relaxed text-slate-600">
          Lưu lịch sử học tập để bạn có thể tiếp tục ở bất cứ nơi đâu.
        </p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { getDashboardStatistics, type DashboardStatistics } from '@/services/statisticsService';

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

const heroStats = computed(() => [
  {
    key: 'totalUsers',
    label: 'Học sinh đang học',
    value: animatedStats.value.totalUsers,
    caption: 'đã chọn ôn luyện cùng nền tảng',
    delay: 120,
  },
  {
    key: 'totalAttempts',
    label: 'Lượt làm bài',
    value: animatedStats.value.totalAttempts,
    caption: 'được thực hiện để tăng độ tự tin',
    delay: 180,
  },
  {
    key: 'totalQuestions',
    label: 'Câu hỏi luyện tập',
    value: animatedStats.value.totalQuestions,
    caption: 'sẵn sàng luyện tập theo lộ trình',
    delay: 240,
  },
]);

const heroLead = computed(() => ({
  users: heroStats.value[0]?.value ?? 0,
  attempts: heroStats.value[1]?.value ?? 0,
  questions: heroStats.value[2]?.value ?? 0,
}));

const secondaryStats = computed(() => [
  { key: 'totalExams', label: 'Đề thi', value: animatedStats.value.totalExams, icon: 'fa-solid fa-file-pen', delay: 260 },
  { key: 'totalSubjects', label: 'Môn học', value: animatedStats.value.totalSubjects, icon: 'fa-solid fa-book-open', delay: 300 },
  { key: 'totalLevels', label: 'Cấp học', value: animatedStats.value.totalLevels, icon: 'fa-solid fa-layer-group', delay: 340 },
  { key: 'totalTopics', label: 'Chuyên đề', value: animatedStats.value.totalTopics, icon: 'fa-solid fa-lightbulb', delay: 380 },
  { key: 'newUsersToday', label: 'Mới hôm nay', value: animatedStats.value.newUsersToday, icon: 'fa-solid fa-user-plus', delay: 420 },
]);

const proofChips = computed(() => [
  {
    key: 'schools',
    icon: 'fa-solid fa-school',
    text: `${formatNumber(animatedStats.value.totalLevels)} cấp học được hỗ trợ`,
  },
  {
    key: 'subjects',
    icon: 'fa-solid fa-book',
    text: `${formatNumber(animatedStats.value.totalSubjects)} môn học đang hoạt động`,
  },
  {
    key: 'topics',
    icon: 'fa-solid fa-compass-drafting',
    text: `${formatNumber(animatedStats.value.totalTopics)} chuyên đề trọng điểm`,
  },
  {
    key: 'fresh',
    icon: 'fa-solid fa-sparkles',
    text: `${formatNumber(animatedStats.value.newUsersToday)} học sinh mới hôm nay`,
  },
]);

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(Number(value) || 0);
};

const stopCounterAnimations = () => {
  for (const id of animationFrameIds) {
    cancelAnimationFrame(id);
  }
  animationFrameIds.clear();
};

const animateNumber = (key: keyof DashboardStatistics, fromValue: number, toValue: number, delayMs: number) => {
  const startAt = performance.now() + delayMs;
  const duration = 900;

  const step = (now: number) => {
    if (now < startAt) {
      const waitingId = requestAnimationFrame(step);
      animationFrameIds.add(waitingId);
      return;
    }

    const progress = Math.min((now - startAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    animatedStats.value[key] = Math.round(fromValue + (toValue - fromValue) * eased);

    if (progress < 1) {
      const nextId = requestAnimationFrame(step);
      animationFrameIds.add(nextId);
    }
  };

  const frameId = requestAnimationFrame(step);
  animationFrameIds.add(frameId);
};

const animateDashboardStats = (nextStats: DashboardStatistics) => {
  stopCounterAnimations();

  const keys = Object.keys(nextStats) as Array<keyof DashboardStatistics>;
  for (const [index, key] of keys.entries()) {
    const fromValue = Number(animatedStats.value[key]) || 0;
    const toValue = Number(nextStats[key]) || 0;
    animateNumber(key, fromValue, toValue, 70 * index);
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
});

onBeforeUnmount(() => {
  stopCounterAnimations();
});
</script>

<style scoped>
.reveal-up {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
  animation: reveal-up 700ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.stats-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 1rem;
  background: linear-gradient(130deg, rgb(59 130 246 / 0.16), rgb(6 182 212 / 0.12), transparent 58%);
  opacity: 0.5;
  transition: opacity 260ms ease;
}

.stats-card::after {
  content: '';
  position: absolute;
  right: -34px;
  top: -34px;
  width: 88px;
  height: 88px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgb(14 165 233 / 0.24), transparent 70%);
  filter: blur(2px);
  transition: transform 340ms ease;
}

.stats-card:hover::before {
  opacity: 1;
}

.stats-card:hover::after {
  transform: scale(1.15) translate(-8px, 8px);
}

.marketing-strip::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  background: linear-gradient(138deg, rgb(255 255 255 / 0.82), rgb(239 246 255 / 0.72));
  pointer-events: none;
}

.stats-hero-card {
  box-shadow: 0 10px 24px rgb(56 189 248 / 0.15);
  transition: transform 250ms ease, box-shadow 250ms ease;
}

.stats-hero-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgb(59 130 246 / 0.22);
}

.stats-chip-rail {
  animation: proof-fade-in 800ms ease both;
}

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes proof-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal-up {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .stats-card::after,
  .stats-card::before {
    transition: none;
  }
}
</style>

