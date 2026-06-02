<template>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 pb-20 animate-fade-in-up">
    
    <!-- Header Component -->
    <ProfileHeader
      ref="headerRef"
      :profile="profile"
      :stats="stats"
      :display-name="displayName"
      :is-public-profile="isPublicProfile"
      :is-following-user="isFollowingUser"
      :follow-loading="followLoading"
      :preview-url="previewUrl"
      :show-avatar-menu="showAvatarMenu"
      :email="auth.user?.email || ''"
      @toggle-avatar-menu="toggleAvatarMenu"
      @open-preview="openLargePreview"
      @trigger-upload="triggerAvatarUpload"
      @follow="handleFollowAction"
      @show-gift="showGiftModal = true"
      @start-chat="startChat"
    >
      <template #stats>
        <!-- Streak Highlights Component -->
        <ProfileStatsGrid :profile="profile" />
      </template>
    </ProfileHeader>

    <!-- Tabs Navigation -->
    <div class="relative">
      <div class="flex items-center gap-4 sm:gap-10 border-b border-slate-100 px-4 sm:px-12 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth snap-x">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="shrink-0 min-w-fit pb-5 text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all relative snap-center"
          :class="activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'"
        >
          {{ tab.name }}
          <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>
        </button>
      </div>
      <!-- Subtle indicators for scrollable tabs -->
      <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none opacity-0 sm:hidden"></div>
      <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden"></div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
      <div class="relative h-16 w-16">
        <div class="absolute inset-0 rounded-2xl border-4 border-indigo-100"></div>
        <div class="absolute inset-0 rounded-2xl border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
      <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Đang tải hồ sơ...</p>
    </div>
    
    <div v-else-if="error" class="bg-white p-16 text-center rounded-2xl border border-rose-100 shadow-xl">
      <div class="inline-flex h-20 w-20 rounded-3xl bg-rose-50 items-center justify-center text-rose-500 mb-6">
        <i class="fa-solid fa-circle-exclamation text-4xl"></i>
      </div>
      <p class="text-xl font-black text-slate-900 tracking-tight">{{ error }}</p>
      <button @click="fetchProfile" class="mt-6 px-10 py-3 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg">Thử lại</button>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      <!-- Main Content Area -->
      <div class="xl:col-span-2 min-h-[600px] min-w-0">
        <transition 
          name="tab-fade" 
          mode="out-in"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
        >
          <div :key="activeTab" class="space-y-8">
            <!-- Tab 1: Feed -->
            <div v-if="activeTab === 'feed'" class="space-y-6">
              <PostCreator v-if="!isPublicProfile" @success="refreshPostList" />
              <PostList :user-id="targetUserId" ref="postListRef" />
            </div>

            <!-- Tab: Friends -->
            <div v-if="activeTab === 'friends'" class="space-y-6">
              <ProfileSocialTab
                title="Danh sách bạn bè"
                subtitle="Những người bạn cùng học tập"
                icon-class="fa-solid fa-user-group"
                icon-bg-class="bg-indigo-50 text-indigo-600"
                :list="friendsList"
                :loading="friendsLoading"
                :pagination="friendsPagination"
                empty-message="Chưa có bạn bè"
                empty-subtitle="Hãy theo dõi thêm nhiều người để trở thành bạn bè nhé!"
                :can-action="!isPublicProfile"
                action-title="Hủy kết bạn"
                action-icon-class="fa-solid fa-user-minus text-xs"
                @action="(u) => confirmUnfollow(u.id, u.fullName || u.username, 'friends')"
                @change-page="fetchFriends"
              />
            </div>
    
            <!-- Tab: Followers -->
            <div v-if="activeTab === 'followers'" class="space-y-6">
              <ProfileSocialTab
                title="Người theo dõi"
                subtitle="Những người đang theo dõi bạn"
                icon-class="fa-solid fa-users"
                icon-bg-class="bg-rose-50 text-rose-600"
                :list="followersList"
                :loading="socialListLoading"
                :pagination="followersPagination"
                empty-message="Chưa có người theo dõi nào"
                empty-subtitle=""
                :can-action="!isPublicProfile"
                action-title="Xóa người theo dõi"
                action-icon-class="fa-solid fa-user-xmark text-xs"
                @action="(u) => confirmUnfollow(u.id, u.fullName || u.username, 'followers')"
                @change-page="fetchFollowers"
              />
            </div>

            <!-- Tab: Following -->
            <div v-if="activeTab === 'following'" class="space-y-6">
              <ProfileSocialTab
                title="Đang theo dõi"
                subtitle="Những người bạn đang theo dõi"
                icon-class="fa-solid fa-user-plus"
                icon-bg-class="bg-indigo-50 text-indigo-600"
                :list="followingList"
                :loading="socialListLoading"
                :pagination="followingPagination"
                empty-message="Bạn chưa theo dõi ai"
                empty-subtitle=""
                :can-action="true"
                action-title="Bỏ theo dõi"
                action-icon-class="fa-solid fa-user-minus text-xs"
                @action="(u) => confirmUnfollow(u.id, u.fullName || u.username, 'following')"
                @change-page="fetchFollowing"
              />
            </div>
            
            <!-- Tab 2: Info/Edit -->
            <div v-if="activeTab === 'info'" class="space-y-8">
              <ProfileInfoTab
                :profile="profile"
                :is-public-profile="isPublicProfile"
                :display-name="displayName"
                :form-data="formData"
                :levels="levels"
                :updating="updating"
                :update-success="updateSuccess"
                @update="handleUpdate"
              />
            </div>
    
            <!-- Tab 3: Activity -->
            <div v-if="activeTab === 'activity'" class="space-y-6">
              <div class="card-elevated p-4 sm:p-8 border border-slate-100 bg-white">
                <div class="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
                  <div class="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                    <i class="fa-solid fa-chart-line text-xl"></i>
                  </div>
                  <div>
                    <h2 class="m-0 text-xl font-black text-slate-900 tracking-tight">Nhật ký học tập</h2>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Dòng thời gian hoạt động</p>
                  </div>
                </div>
                <ActivityFeed :limit="null" :title="''" />
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Right Sidebar -->
      <ProfileSidebar :profile="profile" :is-public-profile="isPublicProfile" />
    </div>

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
          
          <div class="relative w-full max-w-3xl flex flex-col items-center" @click.stop>
            <img 
              :src="resolveImageUrl(previewUrl || profile?.avatar)" 
              class="max-h-[50vh] sm:max-h-[60vh] w-auto max-w-full rounded-2xl sm:rounded-3xl shadow-2xl object-contain border-4 border-white/10" 
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

    <GiftModal 
      v-if="profile"
      :is-open="showGiftModal"
      :receiver-id="profile.id"
      :receiver-name="profile.fullName || profile.username"
      :balance="auth.user?.balance || 0"
      @close="showGiftModal = false"
      @success="fetchProfile"
    />

    <!-- Hidden Avatar Upload Input -->
    <input 
      ref="avatarInput" 
      type="file" 
      accept="image/*" 
      class="hidden" 
      @change="handleAvatarChange" 
    />
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { uploadFile } from '@/services/fileService';
import { socialService } from '@/services/socialService';
import { getLevels, type LevelItem } from '@/services/learningService';
import { getUserProfile, getUserProfileById, updateUserProfile, type UserProfileResponse, type UserInformationRequest } from '@/services/userService';
import { useToastStore } from '@/stores/toast';

// Shared Components
import GiftModal from '@/components/social/GiftModal.vue';
import PostCreator from '@/components/social/PostCreator.vue';
import PostList from '@/components/social/PostList.vue';
import ActivityFeed from '@/components/social/ActivityFeed.vue';

// Local Extracted Components
import ProfileHeader from '@/components/profile/ProfileHeader.vue';
import ProfileStatsGrid from '@/components/profile/ProfileStatsGrid.vue';
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue';
import ProfileInfoTab from '@/components/profile/ProfileInfoTab.vue';
import ProfileSocialTab from '@/components/profile/ProfileSocialTab.vue';

const props = defineProps<{
  userId?: string;
}>();

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToastStore();

const tabs = computed(() => {
  const base = [
    { id: 'feed', name: 'Bảng tin' },
    { id: 'info', name: 'Giới thiệu' },
  ];
  
  if (!isPublicProfile.value) {
    return [
      ...base,
      { id: 'friends', name: 'Bạn bè' },
      { id: 'followers', name: 'Người theo dõi' },
      { id: 'following', name: 'Đang theo dõi' },
      { id: 'activity', name: 'Hoạt động học tập' }
    ];
  }
  
  return [
    ...base,
    { id: 'activity', name: 'Hoạt động học tập' }
  ];
});

const activeTab = ref('feed');
const isPublicProfile = computed(() => !!props.userId && Number(props.userId) !== auth.user?.id);
const targetUserId = computed(() => props.userId ? Number(props.userId) : auth.user?.id);
const displayName = computed(() => profile.value?.fullName || profile.value?.username || 'Đang tải...');

const stats = reactive({ followers: 0, following: 0, friends: 0 });
const friendsList = ref<any[]>([]);
const followersList = ref<any[]>([]);
const followingList = ref<any[]>([]);
const friendsLoading = ref(false);
const socialListLoading = ref(false);
const friendsPagination = reactive({ page: 0, totalPages: 0 });
const followersPagination = reactive({ page: 0, totalPages: 0 });
const followingPagination = reactive({ page: 0, totalPages: 0 });
const isFollowingUser = ref(false);
const followLoading = ref(false);
const showGiftModal = ref(false);

const loading = ref(true);
const error = ref<string | null>(null);
const profile = ref<UserProfileResponse | null>(null);
const postListRef = ref<any>(null);

const headerRef = ref<any>(null);
const avatarInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const showAvatarMenu = ref(false);
const showLargePreview = ref(false);
const isNewAvatar = ref(false);
const updatingAvatar = ref(false);
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

const refreshPostList = () => {
  postListRef.value?.refresh();
};

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
    toast.warning('Kích thước ảnh không được vượt quá 10MB.');
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
      
      selectedFile.value = null;
      previewUrl.value = null;
      isNewAvatar.value = false;
      showLargePreview.value = false;
      
      toast.success('Lưu ảnh đại diện mới thành công!');
    }
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu ảnh.');
  } finally {
    updatingAvatar.value = false;
  }
};

const fetchProfile = async () => {
  const id = targetUserId.value;
  if (!id && !auth.isAuthenticated) return;
  
  loading.value = true;
  error.value = null;
  try {
    const res = props.userId ? await getUserProfileById(Number(props.userId)) : await getUserProfile();
    profile.value = res.data?.data;
    
    if (!props.userId && profile.value) {
      formData.fullName = profile.value.fullName ?? undefined;
      formData.dob = profile.value.dob ?? undefined;
      formData.schoolName = profile.value.schoolName ?? undefined;
      formData.levelId = profile.value.levelId ?? undefined;
      formData.avatar = profile.value.avatar ?? undefined;
    }

    if (id) {
      const [followRes, statsRes] = await Promise.all([
        isPublicProfile.value ? socialService.isFollowing(id) : Promise.resolve({ data: false }),
        socialService.getFollowStats(id)
      ]);
      isFollowingUser.value = followRes.data;
      stats.followers = statsRes.data.followers;
      stats.following = statsRes.data.following;
      stats.friends = statsRes.data.friends;
    }
  } catch (err) {
    console.error(err);
    error.value = 'Không thể tải thông tin hồ sơ.';
  } finally {
    loading.value = false;
  }
};

const startChat = () => {
  if (profile.value?.id) {
    router.push(`/messages?userId=${profile.value.id}`);
  }
};

const fetchFriends = async (page = 0) => {
  const id = targetUserId.value;
  if (!id || isPublicProfile.value) return; 
  
  friendsLoading.value = true;
  try {
    const res = await socialService.getFriends(id, page, 20);
    const data = res.data;
    if (data) {
      friendsList.value = data.content || data.items || [];
      friendsPagination.page = data.number !== undefined ? data.number : data.page;
      friendsPagination.totalPages = data.totalPages;
    }
  } catch (err) {
    console.error('Failed to fetch friends', err);
  } finally {
    friendsLoading.value = false;
  }
};

const fetchFollowers = async (page = 0) => {
  const id = targetUserId.value;
  if (!id || isPublicProfile.value) return;
  socialListLoading.value = true;
  try {
    const res = await socialService.getFollowers(id, page, 20);
    const data = res.data;
    if (data) {
      followersList.value = data.content || data.items || [];
      followersPagination.page = data.number !== undefined ? data.number : data.page;
      followersPagination.totalPages = data.totalPages;
    }
  } catch (err) {
    console.error('Failed to fetch followers', err);
  } finally {
    socialListLoading.value = false;
  }
};

const fetchFollowing = async (page = 0) => {
  const id = targetUserId.value;
  if (!id || isPublicProfile.value) return;
  socialListLoading.value = true;
  try {
    const res = await socialService.getFollowing(id, page, 20);
    const data = res.data;
    if (data) {
      followingList.value = data.content || data.items || [];
      followingPagination.page = data.number !== undefined ? data.number : data.page;
      followingPagination.totalPages = data.totalPages;
    }
  } catch (err) {
    console.error('Failed to fetch following', err);
  } finally {
    socialListLoading.value = false;
  }
};

watch(activeTab, (newTab) => {
  if (newTab === 'friends' && friendsList.value.length === 0) fetchFriends(0);
  if (newTab === 'followers' && followersList.value.length === 0) fetchFollowers(0);
  if (newTab === 'following' && followingList.value.length === 0) fetchFollowing(0);
});

const confirmUnfollow = (userId: number, name: string, type: 'friends' | 'following' | 'followers') => {
  let message = '';
  let action: () => Promise<any>;
  
  if (type === 'friends') {
    message = `Bạn có chắc chắn muốn hủy kết bạn với ${name}? Hai bạn sẽ không còn theo dõi nhau và không thấy bài viết của nhau.`;
    action = () => socialService.removeFriend(userId);
  } else if (type === 'followers') {
    message = `Bạn có chắc chắn muốn xóa ${name} khỏi danh sách người theo dõi? Họ sẽ không còn theo dõi bạn nữa.`;
    action = () => socialService.removeFollower(userId);
  } else {
    message = `Bạn có chắc chắn muốn bỏ theo dõi ${name}?`;
    action = () => socialService.unfollow(userId);
  }
    
  if (window.confirm(message)) {
    action().then(() => {
      fetchProfile();
      if (type === 'friends') fetchFriends(0);
      if (type === 'following') fetchFollowing(0);
      if (type === 'followers') fetchFollowers(0);
    });
  }
};

const handleFollowAction = async () => {
  if (!targetUserId.value) return;
  followLoading.value = true;
  try {
    if (isFollowingUser.value) {
      await socialService.unfollow(targetUserId.value);
      isFollowingUser.value = false;
      stats.followers--;
    } else {
      await socialService.follow(targetUserId.value);
      isFollowingUser.value = true;
      stats.followers++;
    }
  } catch (err) {
    console.error(err);
  } finally {
    followLoading.value = false;
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
    if (selectedFile.value) {
      const uploadRes = await uploadFile(selectedFile.value);
      formData.avatar = uploadRes.data?.data?.url;
    }

    const res = await updateUserProfile({
      fullName: formData.fullName ?? undefined,
      schoolName: formData.schoolName ?? undefined,
      dob: formData.dob ?? undefined,
      levelId: formData.levelId ?? undefined,
      avatar: formData.avatar ?? undefined,
    });
    profile.value = res.data?.data;
    if (profile.value) {
      auth.setUser({ avatar: profile.value.avatar });
    }
    
    selectedFile.value = null;
    previewUrl.value = null;
    toast.success('Cập nhật hồ sơ thành công!');
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
  } finally {
    updating.value = false;
  }
};

const handleClickOutside = (e: Event) => {
  if (showAvatarMenu.value && headerRef.value?.avatarMenuContainer && !headerRef.value.avatarMenuContainer.contains(e.target as Node)) {
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

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

* {
  min-width: 0;
}

img {
  max-width: 100%;
}
</style>