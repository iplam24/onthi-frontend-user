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
            <p class="m-0 mt-1 text-xs font-semibold text-slate-500">Player nghe lại dùng bản ghi local, không phụ thuộc upload.</p>
          </div>
        </div>

        <div class="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <span class="relative flex h-2.5 w-2.5">
            <span v-if="isRecording" class="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full" :class="statusDotClass"></span>
          </span>
          <span class="text-xs font-black uppercase tracking-wider" :class="statusTextClass">{{ statusLabel }}</span>
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div class="rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-xl shadow-indigo-500/5 backdrop-blur">
          <div class="flex flex-col items-center gap-4 text-center">
            <button
              type="button"
              class="relative flex h-28 w-28 items-center justify-center rounded-full text-white shadow-2xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              :class="isRecording ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30' : 'bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-indigo-500/30 hover:scale-105'"
              :disabled="!canRecord"
              @click="isRecording ? stopRecording() : startRecording()"
            >
              <span v-if="isRecording" class="absolute inset-3 rounded-full border-4 border-white/30 animate-pulse"></span>
              <i class="fa-solid relative text-4xl" :class="isRecording ? 'fa-stop' : 'fa-microphone'"></i>
            </button>

            <div>
              <p class="m-0 font-mono text-4xl font-black tracking-tight text-slate-950">{{ formattedDuration }}</p>
              <p class="m-0 mt-1 text-xs font-bold text-slate-500">{{ helperText }}</p>
            </div>

            <div class="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition active:scale-95 disabled:opacity-50"
                :class="isRecording ? 'bg-rose-600 shadow-rose-500/20 hover:bg-rose-700' : 'bg-slate-950 shadow-slate-900/20 hover:bg-slate-800'"
                :disabled="!canRecord"
                @click="isRecording ? stopRecording() : startRecording()"
              >
                <i class="fa-solid" :class="isRecording ? 'fa-stop' : 'fa-record-vinyl'"></i>
                {{ isRecording ? 'Dừng ghi âm' : localAudioUrl ? 'Ghi lại' : 'Bắt đầu ghi âm' }}
              </button>
              <button
                v-if="localAudioUrl && !isRecording"
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
          <div v-if="localAudioUrl && !isRecording" class="rounded-[1.5rem] border border-emerald-100 bg-white/90 p-4 shadow-lg shadow-emerald-500/5">
            <div class="mb-3 flex items-center justify-between gap-3">
              <p class="m-0 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600">
                <i class="fa-solid fa-headphones mr-1.5"></i> Nghe lại giọng nói của bạn
              </p>
              <span class="rounded-full px-3 py-1 text-[10px] font-black" :class="audioUrl ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
                {{ audioUrl ? 'Đã lưu server' : uploadStatusLabel }}
              </span>
            </div>
            <audio ref="audioRef" :src="localAudioUrl" controls preload="metadata" class="w-full"></audio>
            <p class="m-0 mt-2 text-xs font-semibold text-slate-500">Nếu player này không phát, trình duyệt chưa tạo được blob audio.</p>
          </div>

          <div v-else-if="!isRecording" class="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/60 p-5 text-center">
            <i class="fa-solid fa-wave-square mb-3 text-3xl text-slate-300"></i>
            <p class="m-0 text-sm font-bold text-slate-500">Chưa có bản ghi. Hãy bấm ghi âm để trả lời câu hỏi.</p>
          </div>

          <div v-if="isUploading" class="rounded-[1.5rem] border border-indigo-100 bg-white/90 p-4 shadow-lg shadow-indigo-500/5">
            <div class="flex items-center gap-3 text-indigo-700">
              <i class="fa-solid fa-circle-notch animate-spin text-lg"></i>
              <div>
                <p class="m-0 text-sm font-black">Đang upload bản ghi</p>
                <p class="m-0 text-xs font-semibold text-indigo-500">Bạn vẫn nghe lại được bằng player local.</p>
              </div>
            </div>
          </div>

          <div class="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-500/5">
            <div class="mb-3 flex items-center justify-between gap-3">
              <p class="m-0 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Transcript nhận diện</p>
              <span class="rounded-full px-3 py-1 text-[10px] font-black" :class="speechSupported ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-700'">
                {{ speechSupported ? recognitionStatus : 'Không hỗ trợ STT' }}
              </span>
            </div>
            <textarea
              :value="modelValue"
              class="min-h-[132px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium leading-relaxed text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              placeholder="Transcript sẽ hiện ở đây nếu trình duyệt hỗ trợ Speech Recognition. Bạn cũng có thể tự nhập/sửa."
              @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
            ></textarea>
            <p class="m-0 mt-2 text-xs font-semibold text-slate-500">Chrome/Edge hỗ trợ transcript tốt nhất. Firefox/Safari thường chỉ ghi âm, không tự chuyển chữ.</p>
          </div>
        </div>
      </div>

      <div v-if="error" class="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
        <i class="fa-solid fa-circle-exclamation mr-2"></i>{{ error }}
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-xs font-semibold text-slate-500">
        Debug: recorder={{ recorderSupported ? 'ok' : 'no' }}, speech={{ speechSupported ? 'ok' : 'no' }}, chunks={{ chunkCount }}, local={{ localAudioUrl ? 'yes' : 'no' }}, server={{ audioUrl ? 'yes' : 'no' }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
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

const audioRef = ref<HTMLAudioElement | null>(null);
const isRecording = ref(false);
const isUploading = ref(false);
const error = ref('');
const localAudioUrl = ref('');
const durationSeconds = ref(0);
const chunkCount = ref(0);
const recognitionStatus = ref('STT sẵn sàng');
const uploadStatusLabel = ref('Chưa lưu server');

let recognition: SpeechRecognition | null = null;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let mediaStream: MediaStream | null = null;
let finalTranscript = '';
let timerId: number | null = null;

const SpeechRecognitionClass = computed<SpeechRecognitionConstructor | null>(() => {
  if (typeof window === 'undefined') return null;
  return ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null) as SpeechRecognitionConstructor | null;
});

const speechSupported = computed(() => !!SpeechRecognitionClass.value);
const recorderSupported = computed(() => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined');
const canRecord = computed(() => recorderSupported.value);

const audioUrl = computed(() => props.audioUrl || '');

const formattedDuration = computed(() => {
  const minutes = Math.floor(durationSeconds.value / 60).toString().padStart(2, '0');
  const seconds = Math.floor(durationSeconds.value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});

const statusLabel = computed(() => {
  if (isRecording.value) return 'Đang ghi';
  if (localAudioUrl.value) return 'Nghe lại được';
  if (!recorderSupported.value) return 'Không hỗ trợ';
  return 'Chưa ghi âm';
});

const helperText = computed(() => {
  if (isRecording.value) return 'Đang ghi âm. Bấm dừng để tạo player nghe lại.';
  if (localAudioUrl.value) return 'Đã có bản ghi local. Hãy bấm play để nghe lại.';
  return 'Bấm ghi âm, nói câu trả lời, rồi bấm dừng.';
});

const statusDotClass = computed(() => {
  if (isRecording.value) return 'bg-rose-500';
  if (localAudioUrl.value) return 'bg-emerald-500';
  if (!recorderSupported.value) return 'bg-amber-500';
  return 'bg-slate-300';
});

const statusTextClass = computed(() => {
  if (isRecording.value) return 'text-rose-600';
  if (localAudioUrl.value) return 'text-emerald-600';
  if (!recorderSupported.value) return 'text-amber-600';
  return 'text-slate-500';
});

watch(() => props.audioUrl, (newVal) => {
  if (newVal && !localAudioUrl.value) localAudioUrl.value = resolveAudioUrl(newVal);
}, { immediate: true });

async function startRecording() {
  error.value = '';
  uploadStatusLabel.value = 'Chưa lưu server';
  if (!recorderSupported.value) {
    error.value = 'Trình duyệt không hỗ trợ ghi âm. Hãy dùng Chrome hoặc Edge và chạy trên localhost/HTTPS.';
    return;
  }

  clearLocalUrl();
  emit('update:audioUrl', '');
  chunkCount.value = 0;
  audioChunks = [];

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = getSupportedMimeType();
    mediaRecorder = mimeType ? new MediaRecorder(mediaStream, { mimeType }) : new MediaRecorder(mediaStream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunks.push(event.data);
        chunkCount.value = audioChunks.length;
      }
    };
    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      error.value = 'MediaRecorder bị lỗi. Hãy thử Chrome/Edge hoặc kiểm tra quyền micro.';
    };
    mediaRecorder.onstop = handleRecordingStop;

    mediaRecorder.start();
    isRecording.value = true;
    startTimer();
    startSpeechRecognition();
  } catch (err) {
    console.error('Microphone recording error:', err);
    error.value = 'Không truy cập được micro. Hãy cấp quyền micro và đảm bảo đang chạy trên localhost hoặc HTTPS.';
    cleanupStream();
  }
}

function stopRecording() {
  isRecording.value = false;
  stopTimer();
  stopSpeechRecognition();
  try {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.requestData();
      mediaRecorder.stop();
    } else {
      cleanupStream();
    }
  } catch (err) {
    console.error('Stop recording error:', err);
    cleanupStream();
    error.value = 'Không dừng được bản ghi. Hãy thử ghi lại.';
  }
}

function handleRecordingStop() {
  cleanupStream();
  const mimeType = mediaRecorder?.mimeType || audioChunks[0]?.type || 'audio/webm';
  const audioBlob = new Blob(audioChunks, { type: mimeType });

  if (!audioBlob.size) {
    error.value = 'Bản ghi rỗng. Debug chunks=0 nghĩa là browser chưa tạo được audio data.';
    return;
  }

  clearLocalUrl();
  localAudioUrl.value = URL.createObjectURL(audioBlob);
  nextTick(() => audioRef.value?.load());
  uploadAudio(audioBlob);
}

async function uploadAudio(audioBlob: Blob) {
  isUploading.value = true;
  uploadStatusLabel.value = 'Đang lưu server';
  try {
    const response = await uploadSpeakingAudio(audioBlob);
    const data = response.data?.data || response.data;
    if (data?.url) {
      emit('update:audioUrl', data.url);
      uploadStatusLabel.value = 'Đã lưu server';
    } else {
      uploadStatusLabel.value = 'Upload thiếu URL';
      error.value = 'Server upload xong nhưng không trả URL audio.';
    }
  } catch (err) {
    console.error('Failed to upload audio:', err);
    uploadStatusLabel.value = 'Upload lỗi';
    error.value = 'Upload audio lỗi, nhưng bạn vẫn phải nghe lại được bằng player local.';
  } finally {
    isUploading.value = false;
  }
}

function startSpeechRecognition() {
  const Recognition = SpeechRecognitionClass.value;
  if (!Recognition) {
    recognitionStatus.value = 'Browser không hỗ trợ STT';
    return;
  }

  finalTranscript = props.modelValue || '';
  recognition = new Recognition();
  recognition.lang = navigator.language || 'vi-VN';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    recognitionStatus.value = 'Đang nhận chữ';
    let interimTranscript = '';
    const results = event.results as any;
    for (let index = event.resultIndex; index < results.length; index += 1) {
      const result = results[index];
      const text = result[0]?.transcript ?? '';
      if (result.isFinal) finalTranscript = `${finalTranscript} ${text}`.trim();
      else interimTranscript = `${interimTranscript} ${text}`.trim();
    }
    const transcript = `${finalTranscript} ${interimTranscript}`.trim();
    if (transcript) emit('update:modelValue', transcript);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    recognitionStatus.value = `STT lỗi: ${event.error}`;
    if (event.error !== 'aborted' && event.error !== 'no-speech') {
      error.value = event.error === 'not-allowed'
        ? 'Bạn chưa cấp quyền microphone cho nhận dạng giọng nói.'
        : `Speech-to-text lỗi: ${event.error}`;
    }
  };

  recognition.onend = () => {
    if (isRecording.value) {
      try { recognition?.start(); } catch { /* ignore restart race */ }
    } else if (speechSupported.value) {
      recognitionStatus.value = 'STT đã dừng';
    }
  };

  try {
    recognition.start();
    recognitionStatus.value = 'Đang nghe STT';
  } catch (err) {
    console.warn('Speech recognition start failed:', err);
    recognitionStatus.value = 'Không start được STT';
  }
}

function stopSpeechRecognition() {
  if (!recognition) return;
  recognition.onend = null;
  try { recognition.stop(); } catch { /* ignore */ }
  recognition = null;
}

function clearRecording() {
  if (isRecording.value) stopRecording();
  clearLocalUrl();
  durationSeconds.value = 0;
  chunkCount.value = 0;
  uploadStatusLabel.value = 'Chưa lưu server';
  emit('update:audioUrl', '');
}

function clearLocalUrl() {
  if (localAudioUrl.value?.startsWith('blob:')) URL.revokeObjectURL(localAudioUrl.value);
  localAudioUrl.value = '';
}

function getSupportedMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

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

function cleanupStream() {
  mediaStream?.getTracks().forEach((track) => track.stop());
  mediaStream = null;
}

function resolveAudioUrl(url: string) {
  if (!url || url.startsWith('blob:') || /^https?:\/\//i.test(url)) return url;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  const origin = baseUrl.replace(/\/api\/?$/, '');
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

onUnmounted(() => {
  stopTimer();
  stopSpeechRecognition();
  try {
    if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
  } catch { /* ignore */ }
  cleanupStream();
  clearLocalUrl();
});
</script>
