<script setup lang="ts">
import Header from './Header.vue';
import Footer from './Footer.vue';
import BaseCard from '@/components/ui/BaseCard.vue';

defineProps<{ hideChrome?: boolean }>();
</script>

<template>
    <div class="relative min-h-screen bg-[#fcfcfd] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
        <!-- Artistic Ambient Background – hidden on small screens to keep mobile performance -->
        <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden hidden md:block" aria-hidden="true">
            <div class="absolute -top-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-100/40 blur-[120px] animate-pulse" />
            <div class="absolute top-[20%] -left-[10%] h-[400px] w-[400px] rounded-full bg-sky-100/30 blur-[100px]" />
            <div class="absolute bottom-[10%] right-[15%] h-[300px] w-[300px] rounded-full bg-blue-100/30 blur-[80px]" />
        </div>

        <Header v-if="!hideChrome" />

        <main class="relative mx-auto flex w-full max-w-7xl flex-1 px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8">
            <section class="w-full animate-slide-up-reveal">
                <BaseCard elevated :padded="false" class="p-6 sm:p-10 lg:p-12">
                    <div class="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl" aria-hidden="true" />
                    <div class="relative">
                        <slot />
                    </div>
                </BaseCard>
            </section>
        </main>

        <Footer v-if="!hideChrome" />
    </div>
</template>
