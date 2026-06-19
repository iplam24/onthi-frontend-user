<script setup lang="ts">
import { computed } from 'vue';
import { useImageResolver } from '@/composables/useImageResolver';

interface Props {
    src?: string | null;
    alt?: string;
    name?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    rounded?: 'full' | 'xl' | '2xl';
}

const props = withDefaults(defineProps<Props>(), {
    src: '',
    alt: '',
    name: '',
    size: 'md',
    rounded: 'full',
});

const { resolveImageUrl } = useImageResolver();

const initial = computed(() => {
    const trimmed = (props.name || props.alt || '').trim();
    return trimmed ? trimmed[0]?.toUpperCase() : '?';
});

const sizeClass = {
    xs: 'h-7 w-7 text-[10px]',
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-lg',
}[props.size];

const roundedClass = {
    full: 'rounded-full',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
}[props.rounded];
</script>

<template>
    <div
        :class="['relative inline-flex items-center justify-center overflow-hidden border border-white/40 bg-gradient-to-br from-indigo-500 to-violet-600 font-weight-800 text-white shadow-sm', roundedClass, sizeClass]"
    >
        <img
            v-if="src && resolveImageUrl(src)"
            :src="resolveImageUrl(src)"
            :alt="alt || name || 'avatar'"
            class="h-full w-full object-cover"
        />
        <span v-else class="font-extrabold">{{ initial }}</span>
    </div>
</template>
