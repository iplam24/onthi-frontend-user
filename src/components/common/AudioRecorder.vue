<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50"
        :disabled="!isSupported"
        @click="isListening ? stopListening() : startListening()"
      >
        <i class="fa-solid" :class="isListening ? 'fa-stop' : 'fa-microphone'"></i>
        {{ isListening ? 'Dừng nói' : 'Bắt đầu nói' }}
      </button>
      <span class="text-xs text-slate-400">
        {{ isSupported ? 'Bấm để nói, hệ thống sẽ tự chuyển thành văn bản' : 'Trình duyệt không hỗ trợ nhận dạng giọng nói' }}
      </span>
    </div>

    <div v-if="isListening" class="flex items-center gap-3 rounded-xl border-2 border-red-300 bg-red-50 p-4 animate-pulse">
      <span class="flex h-3 w-3 rounded-full bg-red-500"></span>
      <span class="text-sm font-bold text-red-600">Đang nghe...</span>
    </div>

    <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p class="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Văn bản nhận dạng</p>
      <textarea
        :value="modelValue"
        class="min-h-[120px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400"
        placeholder="Nội dung bạn nói sẽ hiện ở đây. Bạn có thể chỉnh sửa trước khi nộp."
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      ></textarea>
      <button
        v-if="modelValue"
        type="button"
        class="mt-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-white active:scale-95 transition-all"
        @click="$emit('update:modelValue', '')"
      >
        Xóa nội dung
      </button>
    </div>

    <div v-if="error" class="text-xs text-red-500">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognition = EventTarget & {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEvent = Event & {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

const SpeechRecognitionClass = computed<SpeechRecognitionConstructor | null>(() => {
  if (typeof window === 'undefined') return null;
  return ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null) as SpeechRecognitionConstructor | null;
});

const isSupported = computed(() => !!SpeechRecognitionClass.value);
const isListening = ref(false);
const error = ref('');
let recognition: SpeechRecognition | null = null;
let finalTranscript = '';

function startListening() {
  error.value = '';
  const Recognition = SpeechRecognitionClass.value;
  if (!Recognition) {
    error.value = 'Trình duyệt không hỗ trợ nhận dạng giọng nói. Hãy dùng Chrome hoặc Edge.';
    return;
  }

  finalTranscript = props.modelValue || '';
  recognition = new Recognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const text = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript = `${finalTranscript} ${text}`.trim();
      } else {
        interimTranscript += text;
      }
    }
    emit('update:modelValue', `${finalTranscript} ${interimTranscript}`.trim());
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    error.value = event.error === 'not-allowed'
      ? 'Bạn chưa cấp quyền microphone.'
      : `Lỗi nhận dạng giọng nói: ${event.error}`;
    isListening.value = false;
  };

  recognition.onend = () => {
    isListening.value = false;
  };

  recognition.start();
  isListening.value = true;
}

function stopListening() {
  if (recognition) {
    recognition.stop();
  }
  isListening.value = false;
}

onUnmounted(() => {
  if (recognition) {
    recognition.abort();
  }
});
</script>
