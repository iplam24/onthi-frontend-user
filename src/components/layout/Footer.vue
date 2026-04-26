<template>
	<footer class="relative mt-10 pb-8 sm:pb-12">
		<div class="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="pointer-events-none absolute -left-8 top-0 h-24 w-24 rounded-full bg-sky-200/70 blur-2xl"></div>
			<div class="pointer-events-none absolute -bottom-8 right-10 h-28 w-28 rounded-full bg-blue-300/50 blur-3xl"></div>

			<div class="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/72 shadow-[0_20px_45px_rgba(15,23,42,0.14)] backdrop-blur-xl">
				<div class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(239,246,255,0.8),rgba(255,255,255,0.6),rgba(219,234,254,0.65))]"></div>

				<div class="relative grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-3">
					<section class="space-y-4">
						<router-link to="/" class="inline-flex items-center gap-3">
							<img
								src="@/asset/logo.png"
								alt="V-Edu"
								class="h-11 w-11 rounded-xl border border-slate-200 bg-white/90 p-1.5 shadow-[0_8px_18px_rgba(59,130,246,0.2)]"
							/>
							<div>
								<p class="m-0 text-2xl font-extrabold tracking-tight text-slate-900">V-Edu</p>
								<p class="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700/80">Liquid Learning Experience</p>
							</div>
						</router-link>

						<p class="m-0 max-w-sm text-sm leading-relaxed text-slate-600">
							Nền tảng học tập và luyện thi trực tuyến với trải nghiệm trực quan, tốc độ cao và theo dõi tiến độ cá nhân hóa.
						</p>

						<div class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
							<span class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]"></span>
							Hệ thống đang hoạt động ổn định
						</div>
					</section>

					<section>
						<h3 class="m-0 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Điều hướng nhanh</h3>
						<div class="mt-4 grid grid-cols-2 gap-2 text-sm font-semibold">
							<router-link to="/" class="rounded-xl border border-transparent px-3 py-2 text-slate-700 transition hover:border-sky-100 hover:bg-sky-50 hover:text-sky-700">
								Trang chủ
							</router-link>
							<router-link to="/exams" class="rounded-xl border border-transparent px-3 py-2 text-slate-700 transition hover:border-sky-100 hover:bg-sky-50 hover:text-sky-700">
								Bài thi
							</router-link>
							<router-link to="/learning" class="rounded-xl border border-transparent px-3 py-2 text-slate-700 transition hover:border-sky-100 hover:bg-sky-50 hover:text-sky-700">
								Học tập
							</router-link>
							<router-link to="/policy" class="rounded-xl border border-transparent px-3 py-2 text-slate-700 transition hover:border-sky-100 hover:bg-sky-50 hover:text-sky-700">
								Chính sách
							</router-link>
						</div>
					</section>

					<section>
						<h3 class="m-0 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Kết nối</h3>
						<p class="mb-0 mt-4 text-sm text-slate-600">support@v-edu.vn</p>
						<p class="mb-0 mt-1 text-sm text-slate-600">1900 0000</p>

						<div class="mt-4 flex items-center gap-2">
							<a href="#" class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-600 transition hover:border-sky-200 hover:text-sky-700" aria-label="Facebook">
								<i class="fa-brands fa-facebook-f"></i>
							</a>
							<a href="#" class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-600 transition hover:border-sky-200 hover:text-sky-700" aria-label="Youtube">
								<i class="fa-brands fa-youtube"></i>
							</a>
							<a href="#" class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-600 transition hover:border-sky-200 hover:text-sky-700" aria-label="Github">
								<i class="fa-brands fa-github"></i>
							</a>
						</div>
					</section>
				</div>

				<div class="relative border-t border-slate-200/80 bg-white/45 px-6 py-4 text-xs text-slate-500 sm:px-8">
					<p class="m-0">{{ year }} V-Edu. All rights reserved.</p>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
const year = new Date().getFullYear();
</script>
