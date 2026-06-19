 Marian template
<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50"
        :disabled="!isSupported || isUploading"
        @click="isListening ? stopListening() : startListening()"
      >
        <i class="fa-solid" :class="isListening ? 'fa-stop' : 'fa-microphone'"></i>
        {{ isListening ? 'Dừng nói' : 'Bắt đầu nói' }}
      </button>
      <span class="text-xs text-slate-400">
        {{ isSupported ? 'Bấm để nói, hệ thống ghi âm & tự chuyển thành văn bản' : 'Trình duyệt không hỗ trợ nhận dạng giọng nói' }}
      </span>
    </div>

    <div v-if="isListening" class="flex items-center gap-3 rounded-xl border-2 border-red-300 bg-red-50 p-4 animate-pulse">
      <span class="flex h-3 w-3 rounded-full bg-red-500"></span>
      <span class="text-sm font-bold text-red-600">Đang nghe & ghi âm...</span>
    </div>

    <!-- Audio Upload Status -->
    <div v-if="isUploading" class="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs text-indigo-600 font-bold">
      <i class="fa-solid fa-circle-notch animate-spin"></i>
      <span>Đang xử lý và tải tệp ghi âm lên máy chủ...</span>
    </div>

    <!-- Audio Preview Player -->
    <div v-if="audioPreviewUrl && !isListening" class="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
      <p class="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-1.5">
        <i class="fa-solid fa-volume-high"></i> Nghe lại câu trả lời của bạn
      </p>
      <audio :src="audioPreviewUrl" controls class="w-full" />
    </div>

    <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p class="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Văn bản nhận dạng</p>
      <textarea
        :value="modelValue"
        class="min-h-[120px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400"
        placeholder="Nội dung bạn nói sẽ hiện ở đây. Bạn có thể chỉnh sửa trước khi nộp."
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      ></textarea>
      <div class="mt-2 flex gap-2">
        <button
          v-if="modelValue"
          type="button"
          class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-white active:scale-95 transition-all"
          @click="$emit('update:modelValue', '')"
        >
          Xóa nội dung chữ
        </button>
      </div>
    </div>

    <div v-if="error" class="text-xs text-red-500 font-bold">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { uploadSpeakingAudio } from '@/services/fileService';

const props = defineProps<{
  modelValue?: string;
  audioUrl?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:audioUrl', value: string): void;
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
const isUploading = ref(false);
const error = ref('');
const audioPreviewUrl = ref('');

let recognition: SpeechRecognition | null = null;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let mediaStream: MediaStream | null = null;
let finalTranscript = '';

// Watch for initial or updated audioUrl prop (e.g. loaded draft)
watch(() => props.audioUrl, (newVal) => {
  if (newVal) {
    audioPreviewUrl.value = newVal;
  } else {
    audioPreviewUrl.value = '';
  }
}, { immediate: true });

async function startListening() {
  error.value = '';
  const Recognition = SpeechRecognitionClass.value;
  if (!Recognition) {
    error.value = 'Trình duyệt không hỗ trợ nhận dạng giọng nói. Hãy dùng Chrome hoặc Edge.';
    return;
  }

  // Request mic permission and setup MediaRecorder
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    mediaRecorder = new MediaRecorder(mediaStream);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      
      // Revoke old blob URL
      if (audioPreviewUrl.value && audioPreviewUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(audioPreviewUrl.value);
      }
      audioPreviewUrl.value = URL.createObjectURL(audioBlob);

      // Upload to server
      isUploading.value = true;
      try {
        const response = await uploadSpeakingAudio(audioBlob);
        const resData = response.data?.data || response.data;
        if (resData && resData.url) {
          emit('update:audioUrl', resData.url);
        } else {
          error.value = 'Tải file ghi âm lên thất bại: Không nhận được URL.';
        }
      } catch (err: any) {
        console.error('Failed to upload audio:', err);
        error.value = 'Lỗi kết nối khi tải file ghi âm lên server.';
      } finally {
        isUploading.value = false;
      }
    };

    mediaRecorder.start();
  } catch (err: any) {
    console.error('Microphone recording error:', err);
    error.value = 'Không thể truy cập Microphone để ghi âm. Hãy kiểm tra quyền của trình duyệt.';
    return;
  }

  // Start Speech Recognition
  finalTranscript = props.modelValue || '';
  recognition = new Recognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    const results = event.results as any;
    for (let i = event.resultIndex; i < results.length; i++) {
      const result = results[i];
      const text = result[0]?.transcript ?? '';
      if (result.isFinal) {
        finalTranscript = `${finalTranscript} ${text}`.trim();
      } else {
        interimTranscript += text;
      }
    }
    emit('update:modelValue', `${finalTranscript} ${interimTranscript}`.trim());
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('Speech recognition error:', event.error);
    if (event.error !== 'aborted') {
      error.value = event.error === 'not-allowed'
        ? 'Bạn chưa cấp quyền microphone.'
        : `Lỗi nhận dạng giọng nói: ${event.error}`;
    }
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
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }
  isListening.value = false;
}

onUnmounted(() => {
  if (recognition) {
    recognition.abort();
  }
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }
  if (audioPreviewUrl.value && audioPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(audioPreviewUrl.value);
  }
});
</script>
