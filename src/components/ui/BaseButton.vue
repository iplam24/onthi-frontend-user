<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    disabled?: boolean;
    block?: boolean;
    iconLeft?: string;
    iconRight?: string;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
    block: false,
    iconLeft: '',
    iconRight: '',
    ariaLabel: '',
});

defineEmits<{ (e: 'click', ev: MouseEvent): void }>();

const baseClass = 'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed';

const variantClass = computed(() => {
    switch (props.variant) {
        case 'secondary':
            return 'bg-white border border-slate-200 text-slate-700 shadow-sm hover:border-indigo-300 hover:text-indigo-600';
        case 'danger':
            return 'bg-rose-600 text-white shadow-sm hover:bg-rose-700';
        case 'ghost':
            return 'bg-transparent text-slate-600 hover:text-indigo-600 hover:bg-indigo-50';
        case 'primary':
        default:
            return 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02]';
    }
});

const sizeClass = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'px-4 py-2 text-sm';
        case 'lg':
            return 'px-7 py-3.5 text-base';
        case 'md':
        default:
            return 'px-5 py-2.5 text-sm';
    }
});
</script>

<template>
    <button
        :type="type"
        :class="[baseClass, variantClass, sizeClass, block ? 'w-full' : '']"
        :disabled="disabled || loading"
        :aria-busy="loading || undefined"
        :aria-label="ariaLabel || undefined"
        @click="$emit('click', $event)"
    >
        <span v-if="loading" class="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden="true" />
        <i v-else-if="iconLeft" :class="['fa-solid', iconLeft]" aria-hidden="true" />
        <span class="truncate"><slot /></span>
        <i v-if="iconRight && !loading" :class="['fa-solid', iconRight]" aria-hidden="true" />
    </button>
</template>
