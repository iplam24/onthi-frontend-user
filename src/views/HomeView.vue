<template>
  <section class="space-y-8 sm:space-y-10">
    <div class="liquid-glass liquid-border relative overflow-hidden px-6 py-8 sm:px-10 sm:py-12">
      <div class="absolute -right-12 top-0 h-36 w-36 rounded-full bg-sky-200/35 blur-3xl"></div>
      <div class="absolute -bottom-10 left-8 h-32 w-32 rounded-full bg-blue-300/30 blur-3xl"></div>

      <div class="relative max-w-3xl space-y-4">
        <p class="inline-flex rounded-full border border-white/30 bg-white/12 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-100">
          V-Edu Platform
        </p>
        <h1 class="m-0 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
          Trải nghiệm học tập kiểu Liquid Glass, sắc nét và đầy cảm hứng.
        </h1>
        <p class="m-0 max-w-2xl text-sm leading-relaxed text-blue-50/85 sm:text-base">
          Ôn thi theo lộ trình cá nhân, làm bài kiểm tra theo thời gian thực và theo dõi tiến bộ bằng giao diện trong trẻo,
          chuyển động mượt và tập trung vào hiệu quả học tập.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <router-link
            to="/subjects"
            class="rounded-xl border border-sky-200/50 bg-gradient-to-r from-sky-400 to-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_16px_30px_rgba(59,130,246,0.45)] transition hover:-translate-y-0.5"
          >
            Bắt đầu làm bài
          </router-link>
          <router-link
            to="/learning"
            class="rounded-xl border border-white/35 bg-white/12 px-5 py-2.5 text-sm font-bold text-blue-50 transition hover:bg-white/20"
          >
            Khám phá học liệu
          </router-link>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <article class="liquid-glass liquid-border p-5">
        <h2 class="m-0 text-lg font-bold text-white">Lộ trình rõ ràng</h2>
        <p class="mb-0 mt-2 text-sm leading-relaxed text-blue-100/80">
          Học theo chuyên đề, theo dõi phần đã hoàn thành và tập trung vào phần còn yếu.
        </p>
      </article>
      <article class="liquid-glass liquid-border p-5">
        <h2 class="m-0 text-lg font-bold text-white">Thi thử sát đề</h2>
        <p class="mb-0 mt-2 text-sm leading-relaxed text-blue-100/80">
          Kho đề được phân loại theo cấp độ, có chấm điểm và phản hồi tức thì.
        </p>
      </article>
      <article class="liquid-glass liquid-border p-5">
        <h2 class="m-0 text-lg font-bold text-white">Đồng bộ tiến độ</h2>
        <p class="mb-0 mt-2 text-sm leading-relaxed text-blue-100/80">
          Lưu lịch sử học tập để bạn có thể tiếp tục ở bất cứ nơi đâu.
        </p>
      </article>
    </div>
  </section>
</template>
