<script setup lang="ts">
interface Props {
    lines?: number;
    height?: string;
    widthClass?: string;
    rounded?: string;
}

withDefaults(defineProps<Props>(), {
    lines: 3,
    height: 'h-4',
    widthClass: 'w-2/3',
    rounded: 'rounded-md',
});
</script>

<template>
    <div class="flex flex-col gap-2" aria-hidden="true">
        <div
            v-for="n in lines"
            :key="n"
            :class="['animate-pulse bg-slate-200/80', height, widthClass, rounded]"
        />
    </div>
</template>
