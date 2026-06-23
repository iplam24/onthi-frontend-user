<template>
  <section class="relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/60 to-cyan-50/70 p-5 shadow-2xl shadow-indigo-500/10">
    <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-indigo-400/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"></div>

    <div class="relative flex flex-col gap-5">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-900/20">
            <span v-if="isRecording" class="absolute inset-0 rounded-2xl bg-rose-500/50 animate-ping"></span>
            <i class="fa-solid fa-microphone-lines relative text-xl"></i>
          </div>
          <div>
            <p class="m-0 text-[10px] font-black uppercase tracking-[0.28em] text-indigo-500">Câu trả lời nói</p>
            <h3 class="m-0 mt-1 text-lg font-black text-slate-950">Ghi âm, nghe lại rồi mới nộp</h3>
            <p class="m-0 mt-1 text-xs font-semibold text-slate-500">Audio là dữ liệu chính; transcript chỉ hỗ trợ chấm điểm.</p>
          </div>
        </div>

        <div class="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <span class="relative flex h-2.5 w-2.5">
            <span v-if="isRecording" class="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full" :class="isRecording ? 'bg-rose-500' : audioPreviewUrl ? 'bg-emerald-500' : 'bg-slate-300'"></span>
          </span>
          <span class="text-xs font-black uppercase tracking-wider" :class="isRecording ? 'text-rose-600' : audioPreviewUrl ? 'text-emerald-600' : 'text-slate-500'">
            {{ statusLabel }}
          </span>
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div class="rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-xl shadow-indigo-500/5 backdrop-blur">
          <div class="flex flex-col items-center gap-4 text-center">
            <div class="relative flex h-28 w-28 items-center justify-center">
              <div class="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 opacity-15"></div>
              <div v-if="isRecording" class="absolute inset-2 rounded-full border-4 border-rose-300/70 animate-pulse"></div>
              <button
                type="button"
                class="relative flex h-24 w-24 items-center justify-center rounded-full text-white shadow-2xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                :class="isRecording ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30' : 'bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-indigo-500/30 hover:scale-105'"
                :disabled="!canRecord || isUploading"
                @click="isRecording ? stopRecording() : startRecording()"
              >
                <i class="fa-solid text-3xl" :class="isRecording ? 'fa-stop' : 'fa-microphone'"></i>
              </button>
            </div>

            <div>
              <p class="m-0 font-mono text-4xl font-black tracking-tight text-slate-950">{{ formattedDuration }}</p>
              <p class="m-0 mt-1 text-xs font-bold text-slate-500">{{ isRecording ? 'Đang ghi âm câu trả lời của bạn' : 'Thời lượng bản ghi hiện tại' }}</p>
            </div>

            <div class="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition active:scale-95 disabled:opacity-50"
                :class="isRecording ? 'bg-rose-600 shadow-rose-500/20 hover:bg-rose-700' : 'bg-slate-950 shadow-slate-900/20 hover:bg-slate-800'"
                :disabled="!canRecord || isUploading"
                @click="isRecording ? stopRecording() : startRecording()"
              >
                <i class="fa-solid" :class="isRecording ? 'fa-stop' : 'fa-record-vinyl'"></i>
                {{ isRecording ? 'Dừng ghi âm' : audioPreviewUrl ? 'Ghi lại' : 'Bắt đầu ghi âm' }}
              </button>
              <button
                v-if="audioPreviewUrl && !isRecording"
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 active:scale-95"
                @click="clearRecording"
              >
                <i class="fa-solid fa-trash-can"></i>
                Xóa bản ghi
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div v-if="isUploading" class="rounded-[1.5rem] border border-indigo-100 bg-white/90 p-4 shadow-lg shadow-indigo-500/5">
            <div class="flex items-center gap-3 text-indigo-700">
              <i class="fa-solid fa-circle-notch animate-spin text-lg"></i>
              <div>
                <p class="m-0 text-sm font-black">Đang tải bản ghi lên hệ thống</p>
                <p class="m-0 text-xs font-semibold text-indigo-500">Vui lòng chờ trước khi nộp bài.</p>
              </div>
            </div>
          </div>

          <div v-if="audioPreviewUrl && !isRecording" class="rounded-[1.5rem] border border-emerald-100 bg-white/90 p-4 shadow-lg shadow-emerald-500/5">
            <div class="mb-3 flex items-center justify-between gap-3">
              <p class="m-0 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600">
                <i class="fa-solid fa-headphones mr-1.5"></i> Nghe lại giọng nói của bạn
              </p>
              <span v-if="audioUrl" class="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black text-emerald-700">Đã lưu</span>
            </div>
            <audio :src="audioPreviewUrl" controls class="w-full" />
          </div>

          <div v-else-if="!isRecording" class="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/60 p-5 text-center">
            <i class="fa-solid fa-wave-square mb-3 text-3xl text-slate-300"></i>
            <p class="m-0 text-sm font-bold text-slate-500">Chưa có bản ghi. Hãy bấm ghi âm để trả lời câu hỏi.</p>
          </div>

          <div class="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-500/5">
            <div class="mb-3 flex items-center justify-between gap-3">
              <p class="m-0 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Transcript nhận diện</p>
              <button
                v-if="modelValue"
                type="button"
                class="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                @click="$emit('update:modelValue', '')"
              >
                Xóa chữ
              </button>
            </div>
            <textarea
              :value="modelValue"
              class="min-h-[132px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium leading-relaxed text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              placeholder="Nội dung hệ thống nghe được sẽ hiện ở đây. Bạn có thể chỉnh lại transcript nếu nhận diện sai."
              @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
            ></textarea>
          </div>
        </div>
      </div>

      <div v-if="error" class="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
        <i class="fa-solid fa-circle-exclamation mr-2"></i>{{ error }}
      </div>

      <div v-if="!speechSupported" class="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-relaxed text-amber-700">
        Trình duyệt không hỗ trợ nhận dạng giọng nói, nhưng vẫn có thể ghi âm và nghe lại. Khuyến nghị dùng Chrome hoặc Edge để có transcript tự động.
      </div>
    </div>
  </section>
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
type SpeechRecognitionEvent = Event & { resultIndex: number; results: SpeechRecognitionResultList };
type SpeechRecognitionErrorEvent = Event & { error: string };

const SpeechRecognitionClass = computed<SpeechRecognitionConstructor | null>(() => {
  if (typeof window === 'undefined') return null;
  return ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null) as SpeechRecognitionConstructor | null;
});

const speechSupported = computed(() => !!SpeechRecognitionClass.value);
const recorderSupported = computed(() => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined');
const canRecord = computed(() => recorderSupported.value);
const isRecording = ref(false);
const isUploading = ref(false);
const error = ref('');
const audioPreviewUrl = ref('');
const durationSeconds = ref(0);

let recognition: SpeechRecognition | null = null;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let mediaStream: MediaStream | null = null;
let finalTranscript = '';
let timerId: number | null = null;

const formattedDuration = computed(() => {
  const minutes = Math.floor(durationSeconds.value / 60).toString().padStart(2, '0');
  const seconds = Math.floor(durationSeconds.value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});

const statusLabel = computed(() => {
  if (isUploading.value) return 'Đang lưu';
  if (isRecording.value) return 'Đang ghi';
  if (props.audioUrl || audioPreviewUrl.value) return 'Sẵn sàng nghe lại';
  return 'Chưa ghi âm';
});

watch(() => props.audioUrl, (newVal) => {
  if (newVal) audioPreviewUrl.value = newVal;
}, { immediate: true });

function startTimer() {
  stopTimer();
  durationSeconds.value = 0;
  timerId = window.setInterval(() => {
    durationSeconds.value += 1;
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

async function startRecording() {
  error.value = '';
  if (!recorderSupported.value) {
    error.value = 'Trình duyệt không hỗ trợ ghi âm. Hãy dùng Chrome hoặc Edge phiên bản mới.';
    return;
  }

  clearLocalBlobUrl();
  emit('update:audioUrl', '');

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    audioChunks = [];
    mediaRecorder = new MediaRecorder(mediaStream, { mimeType: getSupportedMimeType() });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.onstop = handleRecordingStop;
    mediaRecorder.start(250);
    startSpeechRecognition();
    startTimer();
    isRecording.value = true;
  } catch (err) {
    console.error('Microphone recording error:', err);
    error.value = 'Không thể truy cập microphone. Hãy cấp quyền micro rồi thử lại.';
    cleanupStream();
  }
}

function getSupportedMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

function startSpeechRecognition() {
  const Recognition = SpeechRecognitionClass.value;
  if (!Recognition) return;

  finalTranscript = props.modelValue || '';
  recognition = new Recognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    const results = event.results as any;
    for (let index = event.resultIndex; index < results.length; index += 1) {
      const result = results[index];
      const text = result[0]?.transcript ?? '';
      if (result.isFinal) finalTranscript = `${finalTranscript} ${text}`.trim();
      else interimTranscript += text;
    }
    emit('update:modelValue', `${finalTranscript} ${interimTranscript}`.trim());
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (event.error !== 'aborted' && event.error !== 'no-speech') {
      error.value = event.error === 'not-allowed'
        ? 'Bạn chưa cấp quyền microphone cho nhận dạng giọng nói.'
        : `Lỗi nhận dạng giọng nói: ${event.error}`;
    }
  };

  recognition.onend = () => {
    if (isRecording.value) {
      try { recognition?.start(); } catch { /* browser may already be running */ }
    }
  };

  try { recognition.start(); } catch { /* ignore duplicate starts */ }
}

function stopRecording() {
  isRecording.value = false;
  stopTimer();
  if (recognition) {
    recognition.onend = null;
    recognition.stop();
  }
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  else cleanupStream();
}

async function handleRecordingStop() {
  cleanupStream();
  const audioBlob = new Blob(audioChunks, { type: audioChunks[0]?.type || 'audio/webm' });
  if (!audioBlob.size) {
    error.value = 'Bản ghi âm rỗng. Hãy thử ghi lại.';
    return;
  }

  clearLocalBlobUrl();
  audioPreviewUrl.value = URL.createObjectURL(audioBlob);
  isUploading.value = true;

  try {
    const response = await uploadSpeakingAudio(audioBlob);
    const data = response.data?.data || response.data;
    if (data?.url) emit('update:audioUrl', data.url);
    else error.value = 'Tải bản ghi thành công nhưng không nhận được URL từ server.';
  } catch (err) {
    console.error('Failed to upload audio:', err);
    error.value = 'Không tải được bản ghi lên server. Bạn vẫn có thể nghe lại và ghi lại.';
  } finally {
    isUploading.value = false;
  }
}

function clearRecording() {
  if (isRecording.value) stopRecording();
  clearLocalBlobUrl();
  durationSeconds.value = 0;
  emit('update:audioUrl', '');
}

function clearLocalBlobUrl() {
  if (audioPreviewUrl.value && audioPreviewUrl.value.startsWith('blob:')) URL.revokeObjectURL(audioPreviewUrl.value);
  audioPreviewUrl.value = props.audioUrl && !props.audioUrl.startsWith('blob:') ? props.audioUrl : '';
}

function cleanupStream() {
  mediaStream?.getTracks().forEach((track) => track.stop());
  mediaStream = null;
}

onUnmounted(() => {
  stopTimer();
  recognition?.abort();
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  cleanupStream();
  if (audioPreviewUrl.value?.startsWith('blob:')) URL.revokeObjectURL(audioPreviewUrl.value);
});
</script>
