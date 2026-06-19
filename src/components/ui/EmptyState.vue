<script setup lang="ts">
interface Props {
    title?: string;
    description?: string;
    icon?: string;
    actionLabel?: string;
}

withDefaults(defineProps<Props>(), {
    title: 'Chưa có dữ liệu',
    description: '',
    icon: 'fa-inbox',
    actionLabel: '',
});

defineEmits<{ (e: 'action'): void }>();
</script>

<template>
    <div class="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white/60 p-10 text-center text-slate-500">
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <i :class="['fa-solid', icon, 'text-lg']" aria-hidden="true" />
        </div>
        <h3 class="m-0 text-base font-extrabold text-slate-700">{{ title }}</h3>
        <p v-if="description" class="m-0 max-w-sm text-sm font-medium text-slate-500">{{ description }}</p>
        <button
            v-if="actionLabel"
            class="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-extrabold text-indigo-600 transition hover:bg-indigo-100"
            type="button"
            @click="$emit('action')"
        >
            {{ actionLabel }}
        </button>
    </div>
</template>
