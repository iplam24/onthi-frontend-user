<template>
  <div class="bg-white border border-slate-100 mb-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 rounded-2xl overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 flex items-center justify-between border-b border-slate-50">
      <div class="flex items-center gap-3">
        <router-link :to="`/profile/${post.user.id}`" class="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
          <img v-if="post.user.avatar" :src="resolveImageUrl(post.user.avatar)" class="h-full w-full object-cover" />
          <span v-else class="text-sm font-black text-slate-400 uppercase">{{ post.user.username[0] }}</span>
        </router-link>
        <div>
          <router-link :to="`/profile/${post.user.id}`" class="m-0 text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">
            {{ getDisplayName(post.user) }}
          </router-link>
          <p class="m-0 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{{ formatTime(post.createdAt) }}</p>
        </div>
      </div>
      <button v-if="isOwner" @click="handleDelete" class="h-8 w-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
        <i class="fa-solid fa-trash-can text-xs"></i>
      </button>
    </div>

    <!-- Content -->
    <div class="p-6 space-y-5">
      <div class="space-y-3">
        <h4 v-if="post.title" class="m-0 text-lg font-extrabold text-slate-900 tracking-tight leading-tight">{{ post.title }}</h4>
        <p class="m-0 text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{{ post.content }}</p>
      </div>

      <!-- Image Gallery -->
      <div v-if="post.images && post.images.length > 0" 
           class="grid gap-2 rounded-xl overflow-hidden border border-slate-50 shadow-sm"
           :class="[
             post.images.length === 1 ? 'grid-cols-1' : 
             post.images.length === 2 ? 'grid-cols-2' : 
             'grid-cols-2 sm:grid-cols-3'
           ]">
        <div v-for="(img, idx) in post.images" :key="idx" 
             @click="openLightbox(idx)"
             class="relative aspect-square bg-slate-50 group/img cursor-pointer"
             :class="{'sm:col-span-2 sm:row-span-2 aspect-auto': post.images.length === 3 && idx === 0}">
          <img :src="resolveImageUrl(img)" class="h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
          <div class="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
            <i class="fa-solid fa-expand text-white opacity-0 group-hover/img:opacity-100 transition-all text-xl drop-shadow-lg"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats / Actions -->
    <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex items-center gap-6">
      <button @click="showComments = !showComments" class="flex items-center gap-2.5 text-xs font-black text-slate-500 hover:text-indigo-600 transition-all">
        <div class="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          <i class="fa-regular fa-comment"></i>
        </div>
        <span>{{ comments.length }} <span class="hidden sm:inline">Bình luận</span></span>
      </button>
      <button @click="handleLike" 
              class="flex items-center gap-2.5 text-xs font-black transition-all"
              :class="isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'">
        <div class="h-8 w-8 rounded-lg bg-white border flex items-center justify-center shadow-sm transition-colors"
             :class="isLiked ? 'border-rose-100 bg-rose-50/30' : 'border-slate-200'">
          <i :class="isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
        </div>
        <span>{{ likeCount }} <span class="hidden sm:inline">Thích</span></span>
      </button>
    </div>

    <!-- Comments Section -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div v-if="showComments" class="px-6 py-6 border-t border-slate-50 space-y-6">
        <!-- Add Comment -->
        <div class="flex gap-4">
          <router-link :to="`/profile/${auth.user?.id}`" class="h-11 w-11 rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm hover:scale-105 transition-all">
            <img v-if="auth.user?.avatar" :src="resolveImageUrl(auth.user.avatar)" class="h-full w-full object-cover" />
            <span v-else class="text-xs font-black text-indigo-600 uppercase">{{ auth.user?.username?.[0] }}</span>
          </router-link>
          <div class="flex-1 space-y-2">
            <div v-if="replyingToId" class="flex items-center justify-between bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 mb-1">
              <p class="m-0 text-[10px] font-bold text-indigo-600">Đang phản hồi {{ replyingToName }}</p>
              <button @click="cancelReply" class="text-indigo-400 hover:text-indigo-600 transition-colors">
                <i class="fa-solid fa-xmark text-[10px]"></i>
              </button>
            </div>
            <div class="relative">
              <input 
                v-model="newComment" 
                :id="`comment-input-${post.id}`"
                @keyup.enter="handleAddComment"
                type="text" 
                :placeholder="replyingToId ? 'Viết phản hồi...' : 'Viết cảm nghĩ của bạn...'" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all"
              />
              <button 
                @click="handleAddComment"
                :disabled="!newComment"
                class="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg flex items-center justify-center text-indigo-500 hover:bg-indigo-50 disabled:text-slate-300 transition-all"
              >
                <i class="fa-solid fa-paper-plane text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Comments List -->
        <div v-if="loadingComments" class="flex justify-center py-6">
          <div class="flex items-center gap-2 text-slate-400 text-xs font-bold">
            <i class="fa-solid fa-circle-notch animate-spin"></i>
            <span>Đang tải bình luận...</span>
          </div>
        </div>
        <div v-else-if="comments.length > 0" class="space-y-5">
          <div v-for="comment in comments" :key="comment.id" class="flex gap-4 group/comment">
            <div class="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img v-if="comment.user.avatar" :src="resolveImageUrl(comment.user.avatar)" class="h-full w-full object-cover" />
              <span v-else class="text-[10px] font-black text-slate-400 uppercase">{{ comment.user.username[0] }}</span>
            </div>
            <div class="flex-1 space-y-1 relative">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-900">{{ getDisplayName(comment.user) }}</span>
                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{{ formatTime(comment.createdAt) }}</span>
              </div>
              <div class="bg-white border border-slate-100 rounded-xl rounded-tl-none p-3 shadow-sm relative group/inner">
                <div v-if="editingCommentId === comment.id" class="space-y-2">
                  <textarea 
                    v-model="editContent" 
                    class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-300 resize-none"
                    rows="2"
                  ></textarea>
                  <div class="flex justify-end gap-2">
                    <button @click="cancelEdit" class="px-3 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-slate-100">Hủy</button>
                    <button @click="handleUpdateComment(comment.id)" class="px-3 py-1 rounded-lg bg-indigo-600 text-[10px] font-bold text-white hover:bg-indigo-700">Lưu</button>
                  </div>
                </div>
                <p v-else class="m-0 text-xs text-slate-600 font-medium leading-relaxed">{{ comment.content }}</p>
              </div>
              
              <div v-if="comment.user.id === auth.user?.id && editingCommentId !== comment.id" class="absolute -right-2 -top-1 flex gap-1 opacity-0 group-hover/comment:opacity-100 transition-all">
                <button 
                  @click="startReply(comment)"
                  class="h-6 w-6 rounded-lg bg-white border border-slate-100 text-indigo-500 shadow-md flex items-center justify-center hover:bg-indigo-50 hover:scale-110"
                  title="Phản hồi"
                >
                  <i class="fa-solid fa-reply text-[9px]"></i>
                </button>
                <button 
                  @click="startEdit(comment)"
                  class="h-6 w-6 rounded-lg bg-white border border-slate-100 text-slate-400 shadow-md flex items-center justify-center hover:bg-slate-50 hover:text-indigo-600 hover:scale-110"
                >
                  <i class="fa-solid fa-pen text-[9px]"></i>
                </button>
                <button 
                  @click="handleDeleteComment(comment.id)"
                  class="h-6 w-6 rounded-lg bg-white border border-slate-100 text-rose-500 shadow-md flex items-center justify-center hover:bg-rose-50 hover:scale-110"
                >
                  <i class="fa-solid fa-xmark text-[10px]"></i>
                </button>
              </div>
              <div v-else-if="editingCommentId !== comment.id" class="absolute -right-2 -top-1 opacity-0 group-hover/comment:opacity-100 transition-all">
                <button 
                  @click="startReply(comment)"
                  class="h-6 w-6 rounded-lg bg-white border border-slate-100 text-indigo-500 shadow-md flex items-center justify-center hover:bg-indigo-50 hover:scale-110"
                  title="Phản hồi"
                >
                  <i class="fa-solid fa-reply text-[9px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="py-10 text-center">
          <div class="inline-flex h-12 w-12 rounded-2xl bg-slate-50 items-center justify-center text-slate-300 mb-3">
            <i class="fa-regular fa-comment-dots text-xl"></i>
          </div>
          <p class="m-0 text-xs font-bold text-slate-400">Hãy là người đầu tiên bình luận!</p>
        </div>
      </div>
    </transition>
  </div>

  <!-- Image Lightbox (Facebook Style) -->
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 backdrop-blur-0"
      enter-to-class="opacity-100 backdrop-blur-2xl"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 backdrop-blur-2xl"
      leave-to-class="opacity-0 backdrop-blur-0"
    >
      <div v-if="showLightbox" class="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 sm:p-10" @click="closeLightbox">
        <!-- Close Button -->
        <button @click="closeLightbox" class="absolute top-6 right-6 z-[1000] h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-md border border-white/10">
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>

        <!-- Navigation Arrows -->
        <div v-if="post.images && post.images.length > 1" class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-10 z-[1000] pointer-events-none">
          <button @click.stop="prevImage" class="h-14 w-14 rounded-2xl bg-white/5 text-white hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-md border border-white/5 pointer-events-auto">
            <i class="fa-solid fa-chevron-left text-xl"></i>
          </button>
          <button @click.stop="nextImage" class="h-14 w-14 rounded-2xl bg-white/5 text-white hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-md border border-white/5 pointer-events-auto">
            <i class="fa-solid fa-chevron-right text-xl"></i>
          </button>
        </div>

        <!-- Main Image Container -->
        <div class="relative w-full h-full flex flex-col items-center justify-center gap-6" @click.stop>
          <div class="relative max-h-[85vh] w-full flex items-center justify-center">
            <img 
              :src="resolveImageUrl(post.images[currentImageIndex])" 
              class="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain border border-white/10 animate-scale-in shadow-indigo-500/10"
            />
          </div>
          
          <!-- Image Footer -->
          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex flex-col items-center gap-2 max-w-lg text-center animate-fade-in">
            <p class="m-0 text-white font-black text-sm tracking-wide">{{ getDisplayName(post.user) }}</p>
            <p class="m-0 text-slate-400 text-[10px] font-bold uppercase tracking-widest">{{ currentImageIndex + 1 }} / {{ post.images.length }}</p>
            <p v-if="post.content && post.content.length < 100" class="m-0 text-slate-300 text-xs font-medium mt-1">{{ post.content }}</p>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { socialService } from '@/services/socialService';

const props = defineProps<{
  post: any;
}>();

const emit = defineEmits(['deleted']);

const auth = useAuthStore();
const showComments = ref(false);
const newComment = ref('');
const comments = ref<any[]>([]);
const loadingComments = ref(false);
const editingCommentId = ref<number | null>(null);
const editContent = ref('');
const replyingToId = ref<number | null>(null);
const replyingToName = ref<string | null>(null);
const isLiked = ref(false);
const likeCount = ref(0);
const showLightbox = ref(false);
const currentImageIndex = ref(0);

const openLightbox = (index: string | number) => {
  currentImageIndex.value = Number(index);
  showLightbox.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  showLightbox.value = false;
  document.body.style.overflow = 'auto';
};

const nextImage = () => {
  if (props.post.images && currentImageIndex.value < props.post.images.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0;
  }
};

const prevImage = () => {
  if (props.post.images && currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else {
    currentImageIndex.value = props.post.images.length - 1;
  }
};

const isOwner = computed(() => auth.user?.id === props.post.user.id);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const getDisplayName = (user: any) => {
  return user.fullName || user.username;
};

const resolveImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'vừa xong';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày trước`;
  
  return date.toLocaleDateString('vi-VN');
};

const fetchComments = async () => {
  loadingComments.value = true;
  try {
    const res = await socialService.getComments(props.post.id);
    comments.value = res.data;
  } catch (err) {
    console.error('Failed to fetch comments:', err);
  } finally {
    loadingComments.value = false;
  }
};

const handleAddComment = async () => {
  if (!newComment.value.trim()) return;
  try {
    await socialService.addComment(props.post.id, newComment.value, replyingToId.value || undefined);
    newComment.value = '';
    replyingToId.value = null;
    replyingToName.value = null;
    fetchComments();
  } catch (err) {
    console.error('Failed to add comment:', err);
  }
};

const startReply = (comment: any) => {
  replyingToId.value = comment.id;
  replyingToName.value = getDisplayName(comment.user);
  // Scroll to input
  const input = document.getElementById(`comment-input-${props.post.id}`);
  input?.focus();
};

const cancelReply = () => {
  replyingToId.value = null;
  replyingToName.value = null;
};

const startEdit = (comment: any) => {
  editingCommentId.value = comment.id;
  editContent.value = comment.content;
};

const cancelEdit = () => {
  editingCommentId.value = null;
  editContent.value = '';
};

const handleUpdateComment = async (id: number) => {
  if (!editContent.value.trim()) return;
  try {
    await socialService.updateComment(id, editContent.value);
    editingCommentId.value = null;
    fetchComments();
  } catch (err) {
    console.error('Failed to update comment:', err);
  }
};

const handleDeleteComment = async (id: number) => {
  try {
    await socialService.deleteComment(id);
    comments.value = comments.value.filter(c => c.id !== id);
  } catch (err) {
    console.error(err);
  }
};

const handleDelete = async () => {
  if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
  try {
    await socialService.deletePost(props.post.id);
    emit('deleted', props.post.id);
  } catch (err) {
    console.error(err);
  }
};

const fetchLikeInfo = async () => {
  try {
    const res = await socialService.getLikeInfo(props.post.id);
    isLiked.value = res.data.liked;
    likeCount.value = res.data.count;
  } catch (err) {
    console.error('Failed to fetch like info:', err);
  }
};

const handleLike = async () => {
  if (!auth.isAuthenticated) return;
  
  // Optimistic update
  const originalStatus = isLiked.value;
  const originalCount = likeCount.value;
  
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
  
  try {
    if (isLiked.value) {
      await socialService.likePost(props.post.id);
    } else {
      await socialService.unlikePost(props.post.id);
    }
  } catch (err) {
    // Rollback on error
    isLiked.value = originalStatus;
    likeCount.value = originalCount;
    console.error('Failed to like/unlike:', err);
  }
};

onMounted(() => {
  fetchLikeInfo();
  fetchComments();
});

watch(showComments, (val) => {
  if (val) {
    fetchComments();
  }
});
</script>
