<template>
  <section class="space-y-8 max-w-4xl mx-auto" style="animation: slide-up 600ms cubic-bezier(0.16,1,0.3,1) both">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 p-10 sm:p-14 shadow-2xl shadow-slate-900/30">
      <div class="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px]"></div>
      <div class="pointer-events-none absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-cyan-400/10 blur-[80px]"></div>
      <div class="absolute top-1/4 right-12 h-10 w-10 rounded-lg bg-white/5 rotate-12 animate-float"></div>
      
      <div class="relative z-10">
        <div class="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/80 border border-white/10 mb-6">
          <i class="fa-solid fa-shield-halved text-indigo-400"></i>
          Minh bạch & Bảo mật
        </div>
        <h1 class="m-0 text-4xl font-black text-white sm:text-5xl tracking-tight">Chính sách sử dụng</h1>
        <p class="mb-0 mt-4 text-base font-medium text-white/70 max-w-lg leading-relaxed">
          V-Edu cam kết bảo mật dữ liệu và minh bạch trong mọi hoạt động trên nền tảng.
        </p>
      </div>
    </div>

    <!-- Policy Cards -->
    <div class="space-y-6">
      <article 
        v-for="(item, idx) in policies" 
        :key="item.title"
        class="animate-slide-up-reveal group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-10 shadow-lg shadow-slate-200/20 transition-all duration-500 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5"
        :style="{ animationDelay: `${0.1 + idx * 0.1}s` }"
      >
        <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-150"
          :class="item.bgGlow"></div>
        
        <div class="relative z-10 flex gap-6">
          <div class="shrink-0">
            <div 
              class="h-14 w-14 flex items-center justify-center rounded-2xl shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
              :class="item.iconBg"
            >
              <i :class="[item.icon, 'text-2xl', item.iconColor]"></i>
            </div>
          </div>
          <div class="min-w-0">
            <h2 class="m-0 text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{{ item.title }}</h2>
            <p class="mt-4 mb-0 text-sm leading-relaxed text-slate-600 font-medium">
              {{ item.description }}
            </p>
          </div>
        </div>
      </article>
    </div>

    <!-- Bottom CTA -->
    <div class="animate-slide-up-reveal stagger-4 rounded-[2rem] border border-indigo-100 bg-indigo-50/50 p-8 text-center">
      <p class="text-sm font-bold text-indigo-700 m-0">
        <i class="fa-solid fa-circle-info mr-2 text-indigo-400"></i>
        Nếu bạn có bất kỳ câu hỏi nào về chính sách, hãy 
        <router-link to="/contact" class="underline hover:text-indigo-900 transition-colors">liên hệ với chúng tôi</router-link>.
      </p>
    </div>
  </section>
</template>

<script setup>
const policies = [
  {
    icon: 'fa-solid fa-user-shield',
    title: 'Bảo mật dữ liệu người dùng',
    description: 'Dữ liệu người dùng được mã hóa và bảo vệ theo tiêu chuẩn bảo mật cao nhất. Chúng tôi cam kết không chia sẻ thông tin cá nhân cho bên thứ ba khi chưa có sự đồng ý của bạn.',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    bgGlow: 'bg-blue-50',
  },
  {
    icon: 'fa-solid fa-chart-line',
    title: 'Theo dõi tiến bộ học tập',
    description: 'Nội dung học tập và kết quả thi được lưu trữ an toàn, phục vụ mục tiêu theo dõi tiến bộ và cải thiện lộ trình ôn luyện cá nhân hóa cho từng học sinh.',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    bgGlow: 'bg-emerald-50',
  },
  {
    icon: 'fa-solid fa-scale-balanced',
    title: 'Nguyên tắc công bằng',
    description: 'Mọi bài thi được chấm điểm tự động và công bằng. Hệ thống phát hiện gian lận đảm bảo tính minh bạch cho tất cả học sinh tham gia.',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    bgGlow: 'bg-amber-50',
  },
  {
    icon: 'fa-solid fa-rotate',
    title: 'Cập nhật liên tục',
    description: 'Chính sách có thể được cập nhật để phù hợp với quy định mới. Người dùng sẽ được thông báo khi có thay đổi quan trọng ảnh hưởng đến quyền lợi.',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    bgGlow: 'bg-purple-50',
  },
];
</script>
