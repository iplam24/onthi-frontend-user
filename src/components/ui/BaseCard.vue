<script setup lang="ts">
interface Props {
    elevated?: boolean;
    interactive?: boolean;
    premium?: boolean;
    padded?: boolean;
    as?: 'div' | 'section' | 'article';
}

withDefaults(defineProps<Props>(), {
    elevated: true,
    interactive: false,
    premium: false,
    padded: true,
    as: 'div',
});

const baseClass = 'relative rounded-2xl transition-all duration-500';
const elevatedClass = 'bg-white border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]';
const interactiveClass = 'hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(99,102,241,0.15)] hover:border-indigo-200 cursor-pointer';
const premiumClass = 'bg-white/70 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-indigo-500/5';
const paddedClass = 'p-6 sm:p-8';
</script>

<template>
    <component
        :is="as"
        :class="[
            baseClass,
            elevated ? elevatedClass : '',
            interactive ? interactiveClass : '',
            premium ? premiumClass : '',
            padded ? paddedClass : '',
        ]"
    >
        <slot />
    </component>
</template>
