<template>
  <section class="space-y-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20 pt-6" style="animation: slide-up 650ms cubic-bezier(0.16,1,0.3,1) both">
    
    <!-- Header -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center md:items-stretch gap-8">
      <div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]"></div>
      
      <!-- Avatar Section -->
      <div class="relative flex-shrink-0 flex flex-col items-center justify-center gap-4">
        <div class="relative" ref="avatarMenuContainer">
          <div 
            @click.stop="toggleAvatarMenu"
            class="group/avatar relative h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 border-4 border-slate-800 relative z-10 cursor-pointer overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <img v-if="previewUrl || profile?.avatar" :src="resolveImageUrl(previewUrl || profile?.avatar)" class="h-full w-full object-cover" />
            <span v-else class="text-5xl font-extrabold text-white uppercase">{{ profile?.username?.[0] || '?' }}</span>
            
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
              <i class="fa-solid fa-camera text-white text-2xl"></i>
            </div>

            <div v-if="profile?.streak?.activeToday" class="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-800 z-20" title="Đã học hôm nay">
              <i class="fa-solid fa-fire text-orange-500 text-xl animate-pulse"></i>
            </div>
          </div>

          <!-- Avatar Menu -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-95 opacity-0"
          >
            <div 
              v-if="showAvatarMenu" 
              class="absolute left-1/2 top-full z-30 mt-3 w-44 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl"
            >
              <button @click="openLargePreview" class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                <i class="fa-solid fa-eye text-xs w-4"></i> Xem ảnh
              </button>
              <button @click="triggerAvatarUpload" class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                <i class="fa-solid fa-image text-xs w-4"></i> Đổi ảnh
              </button>
            </div>
          </transition>
        </div>

        <input ref="avatarInput" type="file" class="hidden" accept="image/*" @change="handleAvatarChange" />
        <div class="text-center">
          <h1 class="m-0 text-2xl font-extrabold tracking-tight text-white">{{ profile?.fullName || profile?.username || 'Học viên' }}</h1>
          <p class="m-0 text-sm font-medium text-slate-400 mt-1">{{ profile?.email }}</p>
        </div>
      </div>

      <!-- Streak Highlights -->
      <div class="flex-1 w-full grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 content-center">
        <!-- Current Streak -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <p class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 m-0">Chuỗi hiện tại</p>
          <div class="mt-2 flex items-center gap-2">
            <i class="fa-solid fa-bolt text-amber-400"></i>
            <span class="text-2xl font-black text-white tabular-nums">{{ profile?.streak?.currentStreak || 0 }}</span>
          </div>
        </div>
        <!-- Longest Streak -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <p class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 m-0">Kỷ lục dài nhất</p>
          <div class="mt-2 flex items-center gap-2">
            <i class="fa-solid fa-crown text-amber-500"></i>
            <span class="text-2xl font-black text-white tabular-nums">{{ profile?.streak?.longestStreak || 0 }}</span>
          </div>
        </div>
        <!-- Fire Level -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center col-span-2 lg:col-span-2">
          <p class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 m-0">Mức độ giữ lửa</p>
          <div class="mt-3 w-full max-w-[200px]">
            <div class="flex justify-between mb-1">
              <span class="text-xs font-bold" :class="getFireColorClass(profile?.streak?.fireLevel)">{{ getFireLabel(profile?.streak?.fireLevel) }}</span>
              <span class="text-xs text-slate-400 font-bold">Level {{ profile?.streak?.fireLevel || 0 }}/5</span>
            </div>
            <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
               <div class="h-full rounded-full transition-all duration-1000" :class="getFireBgClass(profile?.streak?.fireLevel)" :style="{ width: `${((profile?.streak?.fireLevel || 0) / 5) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error/Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="card-elevated p-10 text-center border border-rose-100 bg-rose-50/50">
      <i class="fa-solid fa-circle-exclamation text-4xl text-rose-500 mb-4"></i>
      <p class="text-lg font-bold text-slate-900">{{ error }}</p>
      <button @click="fetchProfile" class="mt-4 text-rose-600 font-bold hover:underline">Thử lại</button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left Column: Form -->
      <div class="lg:col-span-2 card-elevated p-8 border border-slate-100">
        <div class="flex items-center justify-between mb-8">
          <h2 class="m-0 text-xl font-extrabold text-slate-900 flex items-center gap-3">
            <i class="fa-solid fa-user-pen text-indigo-500"></i> Thông tin cá nhân
          </h2>
          <span v-if="!profile?.levelId" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-100">
            <i class="fa-solid fa-circle-exclamation"></i> Cần cập nhật
          </span>
        </div>

        <form @submit.prevent="handleUpdate" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-extrabold uppercase tracking-widest text-slate-500">Họ và tên</label>
              <input v-model="formData.fullName" type="text" placeholder="Nhập họ và tên..." class="input-primary w-full" />
            </div>
            
            <div class="space-y-2">
              <label class="text-xs font-extrabold uppercase tracking-widest text-slate-500">Ngày sinh</label>
              <input v-model="formData.dob" type="date" class="input-primary w-full" />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-extrabold uppercase tracking-widest text-slate-500">Trường học</label>
              <input v-model="formData.schoolName" type="text" placeholder="Trường THPT..." class="input-primary w-full" />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-extrabold uppercase tracking-widest text-slate-500">Khối/Lớp</label>
              <select v-model="formData.levelId" class="input-primary w-full appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTRhM2I4Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10">
                <option :value="undefined" disabled>Chọn khối/lớp</option>
                <option v-for="l in levels" :key="l.id" :value="l.id">{{ l.name }}</option>
              </select>
            </div>
          </div>

          <div v-if="updateSuccess" class="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-700 font-medium text-sm flex items-center gap-2">
            <i class="fa-solid fa-circle-check"></i> Cập nhật hồ sơ thành công!
          </div>

          <div class="pt-4 border-t border-slate-50 flex justify-end">
            <button type="submit" :disabled="updating" class="btn-primary bg-indigo-600 px-8">
              <i class="fa-solid fa-floppy-disk mr-2" :class="{'animate-spin fa-circle-notch': updating}"></i>
              {{ updating ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Right Column: Shortcuts -->
      <div class="space-y-6">
         <div class="card-elevated p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
            <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
            <h3 class="m-0 text-xl font-extrabold mb-3">Phân tích năng lực</h3>
            <p class="text-indigo-100 text-sm font-medium mb-6 leading-relaxed">
              Xem báo cáo chi tiết về tiến độ học tập, điểm mạnh, điểm yếu và các gợi ý ôn tập dành riêng cho bạn.
            </p>
            <router-link to="/evaluation" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-50 hover:scale-[1.02] active:scale-95">
              <i class="fa-solid fa-chart-pie"></i> Xem báo cáo ngay
            </router-link>
         </div>

         <div class="card-elevated p-8 border border-slate-100">
           <h3 class="m-0 text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-clock-rotate-left text-slate-400"></i> Lịch sử gần đây
           </h3>
           <p class="text-sm text-slate-500 font-medium mb-5 leading-relaxed">
             Xem lại toàn bộ lịch sử làm bài, ôn tập lại các lỗi sai.
           </p>
           <router-link to="/attempts" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-95">
              Tới lịch sử làm bài
           </router-link>
         </div>
      </div>
    </div>
  </section>

  <!-- Large Preview Modal -->
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 backdrop-blur-0"
      enter-to-class="opacity-100 backdrop-blur-xl"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 backdrop-blur-xl"
      leave-to-class="opacity-0 backdrop-blur-0"
    >
      <div v-if="showLargePreview" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" @click="showLargePreview = false">
        <button 
          @click="showLargePreview = false"
          class="absolute top-8 right-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
        
        <div class="relative max-h-[70vh] max-w-[90vw] animate-scale-in" @click.stop>
          <img 
            :src="resolveImageUrl(previewUrl || profile?.avatar)" 
            class="max-h-[60vh] rounded-[2rem] shadow-2xl object-contain border-4 border-white/10" 
          />
          <div class="mt-6 flex flex-col items-center gap-4">
            <div>
              <p class="text-white font-black text-xl m-0">{{ profile?.fullName || profile?.username }}</p>
              <p v-if="isNewAvatar" class="text-indigo-400 text-xs font-bold uppercase tracking-widest mt-1">Bản xem trước ảnh mới</p>
            </div>
            
            <div v-if="isNewAvatar" class="flex items-center gap-3">
              <button 
                @click="cancelAvatarSelection"
                class="px-6 py-2.5 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                @click="handleAvatarSave"
                :disabled="updatingAvatar"
                class="px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <i v-if="updatingAvatar" class="fa-solid fa-circle-notch animate-spin"></i>
                Lưu ảnh mới
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getUserProfile, updateUserProfile, type UserProfileResponse, type UserInformationRequest } from '@/services/userService';
import { getLevels, type LevelItem } from '@/services/learningService';
import { uploadFile } from '@/services/fileService';

const auth = useAuthStore();
const loading = ref(true);
const error = ref<string | null>(null);
const profile = ref<UserProfileResponse | null>(null);

const updating = ref(false);
const updateSuccess = ref(false);

const levels = ref<LevelItem[]>([]);

const formData = reactive<UserInformationRequest>({
  fullName: undefined,
  dob: undefined,
  schoolName: undefined,
  levelId: undefined,
  avatar: undefined,
});

const avatarInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const showAvatarMenu = ref(false);
const showLargePreview = ref(false);
const isNewAvatar = ref(false);
const updatingAvatar = ref(false);
const avatarMenuContainer = ref<HTMLElement | null>(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

const toggleAvatarMenu = () => {
  showAvatarMenu.value = !showAvatarMenu.value;
};

const openLargePreview = () => {
  isNewAvatar.value = false;
  showLargePreview.value = true;
  showAvatarMenu.value = false;
};

const triggerAvatarUpload = () => {
  avatarInput.value?.click();
  showAvatarMenu.value = false;
};

const handleAvatarChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    alert('Kích thước ảnh không được vượt quá 10MB');
    return;
  }

  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
  isNewAvatar.value = true;
  showLargePreview.value = true;
};

const cancelAvatarSelection = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  isNewAvatar.value = false;
  showLargePreview.value = false;
};

const handleAvatarSave = async () => {
  if (!selectedFile.value) return;
  updatingAvatar.value = true;
  try {
    const uploadRes = await uploadFile(selectedFile.value);
    const newAvatarUrl = uploadRes.data?.data?.url;
    
    if (newAvatarUrl) {
      const res = await updateUserProfile({
        avatar: newAvatarUrl
      });
      profile.value = res.data?.data;
      if (profile.value) {
        auth.setUser({ avatar: profile.value.avatar });
      }
      
      // Reset states
      selectedFile.value = null;
      previewUrl.value = null;
      isNewAvatar.value = false;
      showLargePreview.value = false;
      
      updateSuccess.value = true;
      setTimeout(() => { updateSuccess.value = false; }, 3000);
    }
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu ảnh.');
  } finally {
    updatingAvatar.value = false;
  }
};



const getFireLabel = (level?: number) => {
  if (!level || level === 0) return 'Chưa có lửa';
  if (level === 1) return 'Mới bắt đầu';
  if (level === 2) return 'Ổn định nhẹ';
  if (level === 3) return 'Khá tốt';
  if (level === 4) return 'Rất tốt';
  return 'Bùng cháy';
};

const getFireColorClass = (level?: number) => {
  if (!level || level === 0) return 'text-slate-400';
  if (level === 1) return 'text-amber-500';
  if (level === 2) return 'text-orange-500';
  if (level === 3) return 'text-rose-500';
  if (level === 4) return 'text-red-500';
  return 'text-red-600 font-black';
};

const getFireBgClass = (level?: number) => {
  if (!level || level === 0) return 'bg-slate-600';
  if (level === 1) return 'bg-amber-500';
  if (level === 2) return 'bg-orange-500';
  if (level === 3) return 'bg-rose-500';
  if (level === 4) return 'bg-red-500';
  return 'bg-gradient-to-r from-red-500 to-orange-400';
};

const fetchProfile = async () => {
  if (!auth.isAuthenticated) return;
  loading.value = true;
  error.value = null;
  try {
    const res = await getUserProfile();
    profile.value = res.data?.data;
    if (profile.value) {
      formData.fullName = profile.value.fullName ?? undefined;
      formData.dob = profile.value.dob ?? undefined;
      formData.schoolName = profile.value.schoolName ?? undefined;
      formData.levelId = profile.value.levelId ?? undefined;
      formData.avatar = profile.value.avatar ?? undefined;
    }
  } catch (err) {
    console.error(err);
    error.value = 'Không thể tải thông tin hồ sơ.';
  } finally {
    loading.value = false;
  }
};

const fetchLevels = async () => {
  try {
    const res = await getLevels();
    levels.value = res.data?.data || [];
  } catch (err) {
    console.error('Failed to load levels', err);
  }
};

const handleUpdate = async () => {
  if (!auth.isAuthenticated) return;
  updating.value = true;
  updateSuccess.value = false;
  try {
    // 1. If there's a new file selected, upload it first
    if (selectedFile.value) {
      const uploadRes = await uploadFile(selectedFile.value);
      formData.avatar = uploadRes.data?.data?.url; // Use the URL field from the response data
    }

    // 2. Then update profile information
    const res = await updateUserProfile({
      fullName: formData.fullName ?? undefined,
      schoolName: formData.schoolName ?? undefined,
      dob: formData.dob ?? undefined,
      levelId: formData.levelId ?? undefined,
      avatar: formData.avatar ?? undefined,
    });
    profile.value = res.data?.data;
    if (profile.value) {
      auth.setUser({
        avatar: profile.value.avatar
      });
    }
    
    // Clear selection after success
    selectedFile.value = null;
    previewUrl.value = null;

    updateSuccess.value = true;
    setTimeout(() => { updateSuccess.value = false; }, 3000);
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
  } finally {
    updating.value = false;
  }
};

const handleClickOutside = (e: Event) => {
  if (showAvatarMenu.value && avatarMenuContainer.value && !avatarMenuContainer.value.contains(e.target as Node)) {
    showAvatarMenu.value = false;
  }
};

onMounted(() => {
  if (auth.isAuthenticated) {
    fetchLevels();
    fetchProfile();
  }
  window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>
