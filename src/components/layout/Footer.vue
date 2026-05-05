<template>
  <footer class="relative mt-16 pb-8 sm:pb-12">
    <!-- Decorative top gradient -->
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

    <div class="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

        <!-- Main footer content -->
        <div class="grid gap-10 px-8 py-10 lg:grid-cols-3 lg:gap-8">

          <!-- Brand section -->
          <section class="space-y-5">
            <router-link to="/" class="inline-flex items-center gap-3 group">
              <div class="relative">
                <div class="absolute inset-0 rounded-xl bg-indigo-500/15 blur-md transition-all group-hover:bg-indigo-500/30 group-hover:blur-lg"></div>
                <img
                  src="@/asset/logo.png"
                  alt="V-Edu"
                  class="relative h-11 w-11 rounded-xl"
                />
              </div>
              <div>
                <p class="m-0 text-xl font-extrabold tracking-tight text-slate-900">V-Edu</p>
                <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">Learning Experience</p>
              </div>
            </router-link>

            <p class="m-0 max-w-xs text-sm leading-relaxed text-slate-500">
              Nền tảng học tập và luyện thi trực tuyến với trải nghiệm trực quan, tốc độ cao và theo dõi tiến độ cá nhân hóa.
            </p>

            <div class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Hệ thống đang hoạt động ổn định
            </div>
          </section>

          <!-- Quick links -->
          <section>
            <h3 class="m-0 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Điều hướng nhanh</h3>
            <div class="mt-5 grid grid-cols-2 gap-1">
              <router-link
                v-for="link in quickLinks"
                :key="link.to"
                :to="link.to"
                class="group inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <i :class="['fa-solid text-xs text-slate-300 transition-colors group-hover:text-blue-400', link.icon]"></i>
                {{ link.label }}
              </router-link>
            </div>
          </section>

          <!-- Contact section -->
          <section>
            <h3 class="m-0 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Liên hệ & Kết nối</h3>

            <div class="mt-5 space-y-3">
              <a href="mailto:support@v-edu.vn" class="flex items-center gap-3 group">
                <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all group-hover:bg-blue-100 group-hover:text-blue-600">
                  <i class="fa-solid fa-envelope text-xs"></i>
                </span>
                <span class="text-sm font-medium text-slate-600 transition-colors group-hover:text-blue-600">support@v-edu.vn</span>
              </a>
              <a href="tel:19000000" class="flex items-center gap-3 group">
                <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all group-hover:bg-blue-100 group-hover:text-blue-600">
                  <i class="fa-solid fa-phone text-xs"></i>
                </span>
                <span class="text-sm font-medium text-slate-600 transition-colors group-hover:text-blue-600">1900 0000</span>
              </a>
            </div>

            <div class="mt-6 flex items-center gap-2">
              <a
                v-for="social in socials"
                :key="social.label"
                href="#"
                :aria-label="social.label"
                class="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:scale-110 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:shadow-blue-100"
              >
                <i :class="['fa-brands text-sm', social.icon]"></i>
              </a>
            </div>
          </section>
        </div>

        <!-- Bottom bar -->
        <div class="flex flex-col items-start justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-8 py-4 text-xs font-medium text-slate-400 sm:flex-row sm:items-center">
          <p class="m-0">© {{ year }} V-Edu. All rights reserved.</p>
          <div class="flex items-center gap-1">
            <span>Made with</span>
            <i class="fa-solid fa-heart text-rose-400 mx-0.5 text-[10px]"></i>
            <span>in Vietnam</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear();

const quickLinks = [
  { to: '/', label: 'Trang chủ', icon: 'fa-house' },
  { to: '/exams', label: 'Bài thi', icon: 'fa-file-pen' },
  { to: '/learning', label: 'Học tập', icon: 'fa-book-open-reader' },
  { to: '/attempts', label: 'Lịch sử', icon: 'fa-clock-rotate-left' },
  { to: '/policy', label: 'Chính sách', icon: 'fa-shield-heart' },
  { to: '/contact', label: 'Liên hệ', icon: 'fa-envelope' },
];

const socials = [
  { label: 'Facebook', icon: 'fa-facebook-f' },
  { label: 'Youtube', icon: 'fa-youtube' },
  { label: 'Github', icon: 'fa-github' },
];
</script>