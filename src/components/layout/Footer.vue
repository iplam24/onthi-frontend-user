<template>
  <footer class="relative mt-20 pb-8 sm:pb-12">
    <!-- Decorative top gradient -->
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>

    <div class="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-xl shadow-slate-200/30" style="animation: slide-up-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both">

        <!-- Main footer content -->
        <div class="grid gap-10 px-8 py-12 lg:grid-cols-3 lg:gap-12">

          <!-- Brand section -->
          <section class="space-y-6">
            <router-link to="/" class="inline-flex items-center gap-3 group">
              <div class="relative">
                <div class="absolute -inset-1 rounded-xl bg-indigo-500/20 blur-md transition-all duration-500 group-hover:bg-indigo-500/35 group-hover:blur-lg"></div>
                <img
                  src="@/asset/logo.png"
                  alt="V-Edu"
                  class="relative h-12 w-12 rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                />
              </div>
              <div>
                <p class="m-0 text-xl font-extrabold tracking-tight text-slate-900">V-Edu</p>
                <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">Learning Experience</p>
              </div>
            </router-link>

            <p class="m-0 max-w-xs text-sm leading-relaxed text-slate-500 font-medium">
              Nền tảng học tập và luyện thi trực tuyến với trải nghiệm trực quan, tốc độ cao và theo dõi tiến độ cá nhân hóa.
            </p>

            <div class="inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm shadow-emerald-100">
              <span class="relative flex h-2.5 w-2.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400"></span>
              </span>
              Hệ thống đang hoạt động ổn định
            </div>
          </section>

          <!-- Quick links -->
          <section>
            <h3 class="m-0 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Điều hướng nhanh</h3>
            <div class="mt-6 grid grid-cols-2 gap-1">
              <router-link
                v-for="(link, idx) in quickLinks"
                :key="link.to"
                :to="link.to"
                class="group inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1"
                :style="{ animationDelay: `${idx * 50}ms` }"
              >
                <i :class="['fa-solid text-xs text-slate-300 transition-all duration-300 group-hover:text-indigo-400 group-hover:scale-110', link.icon]"></i>
                {{ link.label }}
              </router-link>
            </div>
          </section>

          <!-- Contact section -->
          <section>
            <h3 class="m-0 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Liên hệ & Kết nối</h3>

            <div class="mt-6 space-y-3">
              <a href="mailto:support@v-edu.vn" class="flex items-center gap-3 group rounded-xl p-2 -ml-2 transition-colors hover:bg-indigo-50">
                <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all duration-300 group-hover:bg-indigo-100 group-hover:text-indigo-600 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-indigo-200">
                  <i class="fa-solid fa-envelope text-xs"></i>
                </span>
                <span class="text-sm font-semibold text-slate-600 transition-colors group-hover:text-indigo-600">support@v-edu.vn</span>
              </a>
              <a href="tel:19000000" class="flex items-center gap-3 group rounded-xl p-2 -ml-2 transition-colors hover:bg-indigo-50">
                <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all duration-300 group-hover:bg-indigo-100 group-hover:text-indigo-600 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-indigo-200">
                  <i class="fa-solid fa-phone text-xs"></i>
                </span>
                <span class="text-sm font-semibold text-slate-600 transition-colors group-hover:text-indigo-600">1900 0000</span>
              </a>
            </div>

            <div class="mt-8 flex items-center gap-3">
              <a
                v-for="social in socials"
                :key="social.label"
                href="#"
                :aria-label="social.label"
                class="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all duration-300 hover:scale-110 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-1 active:scale-95"
              >
                <i :class="['fa-brands text-sm transition-transform duration-300 group-hover:scale-110', social.icon]"></i>
              </a>
            </div>
          </section>
        </div>

        <!-- Bottom bar -->
        <div class="flex flex-col items-start justify-between gap-3 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30 px-8 py-5 text-xs font-semibold text-slate-400 sm:flex-row sm:items-center">
          <p class="m-0">© {{ year }} V-Edu. All rights reserved.</p>
          <div class="flex items-center gap-1.5">
            <span>Made with</span>
            <i class="fa-solid fa-heart text-rose-500 mx-0.5 text-[10px] animate-pulse"></i>
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