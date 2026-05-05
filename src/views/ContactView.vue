<template>
  <section class="space-y-8 max-w-4xl mx-auto" style="animation: slide-up 600ms cubic-bezier(0.16,1,0.3,1) both">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-10 sm:p-14 shadow-2xl shadow-indigo-500/20">
      <div class="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-[100px] animate-pulse"></div>
      <div class="pointer-events-none absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-cyan-400/20 blur-[80px]"></div>
      <div class="absolute top-1/3 right-10 h-12 w-12 rounded-xl bg-white/10 rotate-12 animate-float"></div>
      
      <div class="relative z-10">
        <div class="inline-flex items-center gap-2.5 rounded-full bg-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-white border border-white/30 mb-6">
          <i class="fa-solid fa-envelope text-cyan-200"></i>
          Kênh liên lạc
        </div>
        <h1 class="m-0 text-4xl font-black text-white sm:text-5xl tracking-tight">Liên hệ với chúng tôi</h1>
        <p class="mb-0 mt-4 text-base font-medium text-white/90 max-w-lg leading-relaxed">
          Cần hỗ trợ kỹ thuật hoặc tư vấn lộ trình học? Đội ngũ V-Edu luôn sẵn sàng đồng hành cùng bạn.
        </p>
      </div>
    </div>

    <!-- Contact cards -->
    <div class="grid gap-6 md:grid-cols-2">
      <article 
        class="animate-slide-up-reveal stagger-1 group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 shadow-lg shadow-slate-200/30 transition-all duration-500 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
      >
        <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-50 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-150"></div>
        <div class="relative z-10">
          <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
            <i class="fa-solid fa-headset text-2xl"></i>
          </div>
          <h2 class="m-0 text-xl font-black text-slate-900">Kênh hỗ trợ</h2>
          <div class="mt-6 space-y-4">
            <a href="mailto:support@v-edu.vn" class="flex items-center gap-3 rounded-xl p-3 -ml-3 transition-colors hover:bg-indigo-50 group/link">
              <span class="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all group-hover/link:bg-indigo-100 group-hover/link:text-indigo-600">
                <i class="fa-solid fa-envelope text-xs"></i>
              </span>
              <span class="text-sm font-bold text-slate-700">support@v-edu.vn</span>
            </a>
            <a href="tel:19000000" class="flex items-center gap-3 rounded-xl p-3 -ml-3 transition-colors hover:bg-indigo-50 group/link">
              <span class="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all group-hover/link:bg-indigo-100 group-hover/link:text-indigo-600">
                <i class="fa-solid fa-phone text-xs"></i>
              </span>
              <span class="text-sm font-bold text-slate-700">1900 0000</span>
            </a>
          </div>
        </div>
      </article>

      <article 
        class="animate-slide-up-reveal stagger-2 group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 shadow-lg shadow-slate-200/30 transition-all duration-500 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
      >
        <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-50 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-150"></div>
        <div class="relative z-10">
          <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
            <i class="fa-solid fa-clock text-2xl"></i>
          </div>
          <h2 class="m-0 text-xl font-black text-slate-900">Thời gian phản hồi</h2>
          <div class="mt-6 space-y-4">
            <div class="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 border border-emerald-100">
              <span class="relative flex h-3 w-3">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
              </span>
              <span class="text-sm font-bold text-emerald-700">08:00 - 22:00 mỗi ngày</span>
            </div>
            <p class="text-sm font-medium text-slate-500 m-0 leading-relaxed">
              Kể cả cuối tuần và ngày lễ. Thời gian phản hồi trung bình dưới 30 phút.
            </p>
          </div>
        </div>
      </article>
    </div>

    <!-- FAQ hint -->
    <div class="animate-slide-up-reveal stagger-3 rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-lg shadow-slate-200/20">
      <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-4">
        <i class="fa-solid fa-circle-question text-2xl"></i>
      </div>
      <h3 class="m-0 text-lg font-black text-slate-900">Bạn có câu hỏi thường gặp?</h3>
      <p class="mt-3 text-sm font-medium text-slate-500 max-w-md mx-auto leading-relaxed m-0">
        Hãy xem qua trang <router-link to="/policy" class="text-indigo-600 font-bold hover:underline">Chính sách</router-link> để tìm hiểu thêm về cách chúng tôi hoạt động.
      </p>
    </div>
  </section>
</template>
