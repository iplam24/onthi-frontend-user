<template>
  <div class="fixed bottom-6 right-4 md:right-24 z-[110] font-jakarta">
    <!-- Chat Button -->
    <button 
      @click="toggleChat"
      class="h-14 w-14 rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
    >
      <i class="fa-solid fa-comments text-2xl group-hover:rotate-12 transition-transform"></i>
      <div v-if="unreadCount > 0" class="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-rose-500 border-2 border-white text-[10px] font-black flex items-center justify-center animate-bounce">
        {{ unreadCount }}
      </div>
    </button>

    <!-- Chat Window -->
    <transition name="chat-slide">
      <div v-if="isOpen" class="fixed sm:absolute left-1/2 -translate-x-1/2 sm:translate-x-0 bottom-20 right-0 sm:right-0 w-[92vw] sm:w-[380px] h-[80vh] sm:h-[520px] bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="p-6 bg-indigo-600 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <i class="fa-solid fa-paper-plane"></i>
            </div>
            <div>
              <h3 class="m-0 text-sm font-black tracking-tight">V-Edu Chat</h3>
              <p class="m-0 text-[10px] font-bold opacity-70 uppercase tracking-widest">Realtime Support</p>
            </div>
          </div>
          <button @click="isOpen = false" class="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <!-- Contacts List / Chat View -->
        <div class="flex-1 flex flex-col min-h-0 bg-slate-50/30">
          <template v-if="!currentContact">
            <!-- Contacts List (Friends) -->
            <div class="p-4 border-b border-slate-100 bg-white">
              <input 
                type="text" 
                placeholder="Tìm kiếm bạn bè..." 
                class="w-full h-10 px-4 rounded-xl bg-slate-100 border-none text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-2">
              <div v-if="friends.length === 0" class="text-center py-10">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kết bạn để bắt đầu trò chuyện</p>
              </div>
              <div 
                v-for="friend in friends" 
                :key="friend.id"
                @click="selectContact(friend)"
                class="flex items-center gap-4 p-3 rounded-2xl hover:bg-white hover:shadow-md hover:shadow-slate-100 cursor-pointer transition-all border border-transparent hover:border-slate-100 group"
              >
                <div class="h-11 w-11 rounded-xl bg-indigo-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                  <img v-if="friend.avatar" :src="resolveImageUrl(friend.avatar)" class="h-full w-full object-cover" />
                  <div v-else class="h-full w-full flex items-center justify-center text-indigo-600 font-black">{{ friend.username[0].toUpperCase() }}</div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="m-0 text-sm font-black text-slate-900 truncate">{{ friend.fullName || friend.username }}</p>
                  <p class="m-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">@{{ friend.username }}</p>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <!-- Chat Header -->
            <div class="px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
              <button @click="currentContact = null" class="h-8 w-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400">
                <i class="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <div class="h-8 w-8 rounded-lg bg-indigo-50 overflow-hidden">
                <img v-if="currentContact.avatar" :src="resolveImageUrl(currentContact.avatar)" class="h-full w-full object-cover" />
                <div v-else class="h-full w-full flex items-center justify-center text-indigo-600 text-[10px] font-black">{{ currentContact.username[0].toUpperCase() }}</div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="m-0 text-xs font-black text-slate-900 truncate">{{ currentContact.fullName || currentContact.username }}</h4>
                <div class="flex items-center gap-1.5">
                  <div class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Đang trực tuyến</span>
                </div>
              </div>
            </div>

            <!-- Messages -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4" ref="messageContainer">
              <div v-for="(msg, idx) in messages" :key="idx" 
                class="flex flex-col"
                :class="msg.senderId === auth.user?.id ? 'items-end' : 'items-start'"
              >
                <div 
                  class="max-w-[80%] p-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm"
                  :class="msg.senderId === auth.user?.id 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'"
                >
                  {{ msg.content }}
                </div>
                <span class="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1.5 px-1">
                  {{ formatTime(msg.timestamp) }}
                </span>
              </div>
            </div>

            <!-- Input Area -->
            <div class="p-4 bg-white border-t border-slate-100">
              <form @submit.prevent="handleSendMessage" class="flex items-center gap-2">
                <input 
                  v-model="newMessage"
                  type="text" 
                  placeholder="Nhập tin nhắn..." 
                  class="flex-1 h-11 px-4 rounded-xl bg-slate-50 border-none text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button 
                  type="submit"
                  :disabled="!newMessage.trim()"
                  class="h-11 w-11 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  <i class="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </form>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { socialService } from '@/services/socialService';
import { chatService } from '@/services/chatService';

const auth = useAuthStore();
const isOpen = ref(false);
const friends = ref<any[]>([]);
const currentContact = ref<any>(null);
const messages = ref<any[]>([]);
const newMessage = ref('');
const unreadCount = ref(0);
const messageContainer = ref<HTMLElement | null>(null);

const BACKEND_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');

const resolveImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

const formatTime = (timestamp?: string) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) unreadCount.value = 0;
};

const fetchFriends = async () => {
  if (!auth.user?.id) return;
  try {
    const res = await socialService.getFriends(auth.user.id, 0, 50);
    const data = res.data;
    friends.value = data?.content || data?.items || [];
  } catch (err) {
    console.error('Failed to fetch friends for chat', err);
  }
};

const selectContact = async (contact: any) => {
  currentContact.value = contact;
  try {
    const res = await chatService.getHistory(auth.user?.id!, contact.id);
    const data = Array.isArray(res) ? res : (res?.data ?? res?.items ?? []);
    messages.value = data;
    await scrollToBottom();
  } catch (err) {
    console.error('Failed to fetch chat history', err);
  }
};

const handleSendMessage = () => {
  if (!newMessage.value.trim() || !currentContact.value || !auth.user) return;
  
  const msg = {
    senderId: auth.user.id,
    senderName: auth.user.fullName || auth.user.username,
    receiverId: currentContact.value.id,
    content: newMessage.value,
    timestamp: new Date().toISOString()
  };
  
  // Optimistic update
  messages.value.push(msg);
  chatService.sendMessage(msg);
  newMessage.value = '';
  scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const onMessageReceived = (msg: any) => {
  if (currentContact.value && (msg.senderId === currentContact.value.id || msg.receiverId === currentContact.value.id)) {
    messages.value.push(msg);
    scrollToBottom();
  } else {
    unreadCount.value++;
    // Optional: Show notification toast
  }
};

onMounted(() => {
  if (auth.isAuthenticated && auth.user?.id) {
    fetchFriends();
    chatService.connect(auth.user.id, onMessageReceived, auth.token ?? undefined);
  }
});

onBeforeUnmount(() => {
  chatService.disconnect();
});

watch(() => auth.isAuthenticated, (val) => {
  if (val && auth.user?.id) {
    fetchFriends();
    chatService.connect(auth.user.id, onMessageReceived, auth.token ?? undefined);
  } else {
    chatService.disconnect();
  }
});
</script>

<style scoped>
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
