<script setup lang="ts">
interface Props {
    variant?: 'neutral' | 'pro' | 'promax' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md';
    icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'neutral',
    size: 'sm',
    icon: '',
});

const sizeClass = props.size === 'md' ? 'text-[11px] px-2.5 py-1' : 'text-[9px] px-1.5 py-0.5';

const variantClass = {
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
    pro: 'bg-sky-500 text-white shadow-sm shadow-sky-200',
    promax: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-200',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-indigo-100 text-indigo-700',
}[props.variant];
</script>

<template>
    <span :class="['inline-flex items-center gap-1 rounded-md font-black uppercase tracking-wider whitespace-nowrap', sizeClass, variantClass]">
        <i v-if="icon" :class="['fa-solid', icon, 'text-[0.8em]']" aria-hidden="true" />
        <slot />
    </span>
</template>
