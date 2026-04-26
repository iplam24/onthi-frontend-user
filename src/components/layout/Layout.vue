<script setup lang="ts">
import Header from './Header.vue'
</script>

<template>
  <div class="min-h-screen text-slate-900">
	<Header />

	<main class="mx-auto flex w-full max-w-7xl flex-1 px-3 pb-8 pt-2 sm:px-4 sm:pb-10 lg:px-8 lg:pt-4">
	  <section class="glass-surface w-full p-3 sm:p-4 lg:p-5">
		<div class="relative overflow-hidden rounded-[1.75rem] border border-white/35 bg-white/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-2xl sm:p-7 lg:p-8">
		  <div class="absolute -right-16 top-0 h-40 w-40 rounded-full bg-sky-300/15 blur-3xl"></div>
		  <div class="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-200/20 blur-3xl"></div>

		  <div class="relative">
			<slot />
		  </div>
		</div>
	  </section>
	</main>
  </div>
</template>

