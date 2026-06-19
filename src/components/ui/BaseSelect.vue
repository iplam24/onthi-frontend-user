<script setup lang="ts">
interface Option {
    value: string | number;
    label: string;
}

interface Props {
    modelValue: string | number | null;
    options: Option[];
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    id?: string;
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    placeholder: 'Chọn…',
    required: false,
    disabled: false,
    id: '',
});

const emit = defineEmits<{ (e: 'update:modelValue', value: string | number | null): void }>();

function onChange(ev: Event) {
    const value = (ev.target as HTMLSelectElement).value;
    emit('update:modelValue', value === '' ? null : value);
}
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <label v-if="label" :for="id" class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {{ label }}<span v-if="required" class="ml-1 text-rose-500">*</span>
        </label>
        <div class="relative">
            <select
                :id="id"
                :value="modelValue ?? ''"
                :required="required"
                :disabled="disabled"
                class="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-800 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
                @change="onChange"
            >
                <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
                <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <i class="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" aria-hidden="true" />
        </div>
    </div>
</template>
