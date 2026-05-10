<template>
  <div class="bg-white border border-slate-200 mb-8 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
    <div class="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
      <h3 class="m-0 text-sm font-black text-slate-900 uppercase tracking-widest">Tạo bài viết mới</h3>
      <div class="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
        <i class="fa-solid fa-feather-pointed text-xs"></i>
      </div>
    </div>
    
    <div class="p-6">
      <div class="flex gap-4">
        <div class="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
          <img v-if="auth.user?.avatar" :src="resolveImageUrl(auth.user.avatar)" class="h-full w-full object-cover" />
          <span v-else class="text-sm font-black text-slate-400 uppercase">{{ auth.user?.username?.[0] }}</span>
        </div>
        <div class="flex-1 space-y-4">
          <input 
            v-model="title" 
            type="text" 
            placeholder="Tiêu đề ấn tượng cho bài viết..." 
            class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all"
          />
          <textarea 
            v-model="content" 
            rows="3" 
            placeholder="Hãy chia sẻ điều gì đó thú vị..." 
            class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none resize-none transition-all"
          ></textarea>
          
          <div v-if="previews.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="(p, index) in previews" :key="index" class="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img :src="p" class="h-full w-full object-cover transition-transform group-hover:scale-110" />
              <button @click="removeImage(index)" class="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i class="fa-solid fa-trash-can text-sm"></i>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <button @click="triggerFileInput" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-xs font-bold border border-slate-100">
              <i class="fa-solid fa-images"></i>
              <span>Đính kèm ảnh</span>
            </button>
            <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="handleFileChange" />

            <button 
              @click="handleSubmit" 
              :disabled="loading || (!content && previews.length === 0)" 
              class="relative inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 px-8 py-2.5 rounded-xl text-xs font-black text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:shadow-none active:scale-95"
            >
              <i v-if="loading" class="fa-solid fa-circle-notch animate-spin"></i>
              <i v-else class="fa-solid fa-paper-plane"></i>
              <span>{{ loading ? 'Đang đăng...' : 'Đăng bài ngay' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { socialService } from '@/services/socialService';
import { uploadFile } from '@/services/fileService';
import { computed } from 'vue';

const auth = useAuthStore();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

const title = ref('');
const content = ref('');
const loading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);
const previews = ref<string[]>([]);

const emit = defineEmits(['success']);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  
  const newFiles = Array.from(files);
  selectedFiles.value.push(...newFiles);
  
  newFiles.forEach(file => {
    previews.value.push(URL.createObjectURL(file));
  });
};

const removeImage = (index: number) => {
  URL.revokeObjectURL(previews.value[index]);
  selectedFiles.value.splice(index, 1);
  previews.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (!content.value && selectedFiles.value.length === 0) return;
  loading.value = true;
  try {
    const imageUrls: string[] = [];
    
    // Upload images if any
    if (selectedFiles.value.length > 0) {
      for (const file of selectedFiles.value) {
        const res = await uploadFile(file);
        if (res.data?.data?.url) {
          imageUrls.push(res.data.data.url);
        }
      }
    }

    await socialService.createPost(title.value || 'Bài viết mới', content.value, imageUrls);
    
    title.value = '';
    content.value = '';
    previews.value.forEach(p => URL.revokeObjectURL(p));
    previews.value = [];
    selectedFiles.value = [];
    emit('success');
  } catch (err) {
    console.error('Failed to create post:', err);
  } finally {
    loading.value = false;
  }
};
</script>
