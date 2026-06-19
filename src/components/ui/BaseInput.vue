<script setup lang="ts">
interface Props {
    modelValue: string | number;
    label?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    hint?: string;
    icon?: string;
    autocomplete?: string;
    id?: string;
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    type: 'text',
    placeholder: '',
    required: false,
    disabled: false,
    error: '',
    hint: '',
    icon: '',
    autocomplete: '',
    id: '',
});

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

function onInput(ev: Event) {
    emit('update:modelValue', (ev.target as HTMLInputElement).value);
}
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <label v-if="label" :for="id" class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {{ label }}<span v-if="required" class="ml-1 text-rose-500">*</span>
        </label>
        <div
            :class="[
                'group flex items-center gap-2 rounded-2xl border bg-white px-4 py-2.5 transition-all',
                error
                    ? 'border-rose-300 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100'
                    : 'border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100',
                disabled ? 'opacity-60' : '',
            ]"
        >
            <i v-if="icon" :class="['fa-solid', icon, 'text-sm text-slate-400']" aria-hidden="true" />
            <input
                :id="id"
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :required="required"
                :disabled="disabled"
                :autocomplete="autocomplete || undefined"
                class="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                @input="onInput"
            />
        </div>
        <p v-if="error" class="text-xs font-medium text-rose-600">{{ error }}</p>
        <p v-else-if="hint" class="text-xs font-medium text-slate-400">{{ hint }}</p>
    </div>
</template>
