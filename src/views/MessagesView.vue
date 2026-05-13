<template>
  <div class="h-[calc(100dvh-64px)] sm:min-h-[calc(100dvh-160px)] bg-slate-50/50 py-0 sm:py-10 font-jakarta overflow-hidden">
    <div class="max-w-6xl mx-auto px-0 sm:px-4 h-full sm:h-[750px] flex gap-0 sm:gap-6 overflow-hidden relative">
      <!-- Sidebar: Contacts -->
      <div 
        class="w-full sm:w-[320px] lg:w-80 bg-white sm:rounded-3xl shadow-sm sm:border border-slate-100 flex flex-col overflow-hidden transition-[transform,opacity] duration-200"
        :class="selectedContact ? 'hidden sm:flex' : 'flex'"
      >
        <div class="p-4 sm:p-6 border-b border-slate-100">
          <h2 class="m-0 text-lg font-black text-slate-900 tracking-tight">Tin nhắn</h2>
          <p class="m-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">Kết nối & Trò chuyện</p>
          
          <div class="mt-4 sm:mt-6 relative">
            <i class="fa-solid fa-search absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Tìm kiếm..." 
              class="w-full h-10 sm:h-11 pl-9 pr-3 sm:pl-10 sm:pr-4 rounded-xl bg-slate-50 border-none text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-2">
          <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
            <i class="fa-solid fa-circle-notch animate-spin text-indigo-500 text-2xl"></i>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải...</span>
          </div>
          
          <div v-else-if="contacts.length === 0" class="text-center py-20">
            <div class="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-comment-slash text-slate-300 text-2xl"></i>
            </div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-10">Chưa có cuộc trò chuyện nào</p>
          </div>

          <div 
            v-for="contact in filteredContacts" 
            :key="contact.id"
            @click="selectContact(contact)"
            class="flex items-center gap-3 p-3 sm:gap-4 sm:p-4 rounded-2xl cursor-pointer transition-all border border-transparent group"
            :class="selectedContact?.id === contact.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'hover:bg-slate-50 text-slate-600'"
          >
            <div class="h-12 w-12 rounded-xl overflow-hidden shadow-sm relative shrink-0">
              <img v-if="contact.avatar" :src="resolveImageUrl(contact.avatar)" class="h-full w-full object-cover" />
              <div v-else class="h-full w-full flex items-center justify-center text-indigo-600 font-black bg-indigo-50" :class="selectedContact?.id === contact.id ? 'bg-white/20 text-white' : ''">
                {{ contact.username[0].toUpperCase() }}
              </div>
              <div v-if="contact.isOnline" class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center mb-0.5">
                <h3 class="m-0 text-sm font-black truncate" :class="selectedContact?.id === contact.id ? 'text-white' : 'text-slate-900'">{{ contact.fullName || contact.username }}</h3>
                <span class="text-[9px] font-bold opacity-60 shrink-0">{{ contact.lastTime }}</span>
              </div>
              <p class="m-0 text-[11px] font-medium truncate opacity-70" :class="selectedContact?.id === contact.id ? 'text-white' : 'text-slate-400'">{{ contact.lastMessage || '@' + contact.username }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div 
        class="flex-1 bg-white sm:rounded-3xl shadow-sm sm:border border-slate-100 flex flex-col overflow-hidden relative transition-[transform,opacity] duration-200"
        :class="selectedContact ? 'flex absolute inset-0 z-20 sm:relative' : 'hidden sm:flex'"
      >
        <template v-if="selectedContact">
          <!-- Chat Header -->
          <div class="p-4 sm:p-6 bg-white border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2 sm:gap-4 min-w-0">
              <!-- Back Button (Mobile) -->
              <button 
                @click="selectedContact = null" 
                class="sm:hidden h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400"
              >
                <i class="fa-solid fa-chevron-left"></i>
              </button>

              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-indigo-50 overflow-hidden shadow-sm shrink-0">
                <img v-if="selectedContact.avatar" :src="resolveImageUrl(selectedContact.avatar)" class="h-full w-full object-cover" />
                <div v-else class="h-full w-full flex items-center justify-center text-indigo-600 font-black">{{ selectedContact.username[0].toUpperCase() }}</div>
              </div>
              <div class="min-w-0">
                <h2 class="m-0 text-sm sm:text-base font-black text-slate-900 truncate max-w-[150px] sm:max-w-none leading-tight">{{ selectedContact.fullName || selectedContact.username }}</h2>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <div class="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500"></div>
                  <span class="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang trực tuyến</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1 sm:gap-2">
              <button class="hidden sm:flex h-10 w-10 rounded-xl hover:bg-slate-50 items-center justify-center text-slate-400 transition-colors">
                <i class="fa-solid fa-phone-flip text-xs"></i>
              </button>
              <button class="hidden sm:flex h-10 w-10 rounded-xl hover:bg-slate-50 items-center justify-center text-slate-400 transition-colors">
                <i class="fa-solid fa-video text-xs"></i>
              </button>
              <div class="hidden sm:block w-px h-6 bg-slate-100 mx-1"></div>
              <router-link :to="'/profile/' + selectedContact.id" class="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
                <i class="fa-solid fa-user text-xs"></i>
              </router-link>
            </div>
          </div>

          <!-- Messages List -->
          <div class="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-2 sm:space-y-6 bg-slate-50/20" ref="messageContainer">
            <div v-for="(msg, idx) in messages" :key="idx" 
              class="flex flex-col"
              :class="msg.senderId === auth.user?.id ? 'items-end' : 'items-start'"
            >
              <div class="flex gap-2 sm:gap-3" :class="msg.senderId === auth.user?.id ? 'flex-row-reverse' : ''">
                <div 
                  class="max-w-[85%] sm:max-w-[75%] lg:max-w-[500px] px-3 py-2 sm:p-4 rounded-2xl text-xs sm:text-sm font-medium leading-snug sm:leading-relaxed shadow-sm"
                  :class="msg.senderId === auth.user?.id 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'"
                >
                  {{ msg.content }}
                </div>
              </div>
              <span class="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1 px-1">
                {{ formatTime(msg.timestamp) }}
              </span>
            </div>
          </div>

          <!-- Input Area -->
          <div class="p-3 sm:p-6 bg-white border-t border-slate-100 pb-[env(safe-area-inset-bottom)]">
            <form @submit.prevent="handleSendMessage" class="flex items-center gap-2 sm:gap-4">
              <button type="button" class="hidden sm:flex h-11 w-11 rounded-xl bg-slate-50 text-slate-400 items-center justify-center hover:bg-slate-100 transition-colors">
                <i class="fa-solid fa-plus text-xs"></i>
              </button>
              <input 
                v-model="newMessage"
                @input="handleTyping"
                type="text" 
                placeholder="Nhập tin nhắn..." 
                class="flex-1 h-11 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-50 border-none text-base sm:text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
              <button 
                type="submit"
                :disabled="!newMessage.trim()"
                class="h-11 w-11 sm:h-12 sm:px-8 rounded-xl sm:rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <i class="fa-solid fa-paper-plane text-xs"></i> <span class="hidden sm:inline">Gửi đi</span>
              </button>
            </form>
          </div>
        </template>

        <!-- Empty State -->
        <div v-else class="flex-1 flex flex-col items-center justify-center bg-slate-50/20 p-6 sm:p-20 text-center">
          <div class="h-24 w-24 sm:h-32 sm:w-32 rounded-[30px] sm:rounded-[40px] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 sm:mb-10 animate-float">
            <i class="fa-solid fa-comments text-indigo-600 text-4xl sm:text-5xl"></i>
          </div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight mb-4">Trò chuyện Real-time</h2>
          <p class="text-sm font-medium text-slate-500 max-w-md leading-relaxed">
            Chọn một liên hệ từ danh sách bên trái để bắt đầu trò chuyện. 
            Mọi tin nhắn của bạn đều được mã hóa và bảo mật tuyệt đối.
          </p>
          <div class="mt-10 flex gap-4">
            <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              <i class="fa-solid fa-shield-halved"></i> Bảo mật 256-bit
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
              <i class="fa-solid fa-bolt"></i> Real-time Sync
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { chatService } from '@/services/chatService';
import { getUserProfileById } from '@/services/userService';

const route = useRoute();
const auth = useAuthStore();
const loading = ref(true);
const contacts = ref<any[]>([]);
const selectedContact = ref<any>(null);
const messages = ref<any[]>([]);
const newMessage = ref('');
const searchQuery = ref('');
const isContactTyping = ref(false);
const messageContainer = ref<HTMLElement | null>(null);
let typingTimeout: any = null;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.startsWith('http') 
    ? API_BASE_URL.replace(/\/api\/?$/, '') 
    : `${window.location.origin}${API_BASE_URL.replace(/\/api\/?$/, '')}`;

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

const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value;
  return contacts.value.filter(c => 
    (c.fullName || c.username).toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetchContacts = async () => {
  if (!auth.user?.id) return;
  loading.value = true;
  try {
    const contactIds = await chatService.getContacts(auth.user.id) || [];
    
    // Fetch user info for each contact ID
    const contactPromises = contactIds.map((id: number) => getUserProfileById(id));
    const userResponses = await Promise.all(contactPromises);
    contacts.value = userResponses.map(r => r.data.data);
    
    // Check if initial user from query param
    const initialUserId = route.query.userId;
    if (initialUserId) {
      const contact = contacts.value.find(c => c.id === Number(initialUserId));
      if (contact) {
        selectContact(contact);
      } else {
        // Fetch new contact if not in recent list
        const res = await getUserProfileById(Number(initialUserId));
        if (res.data?.data) {
          contacts.value.unshift(res.data.data);
          selectContact(res.data.data);
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch chat contacts', err);
  } finally {
    loading.value = false;
  }
};

const selectContact = async (contact: any) => {
  selectedContact.value = contact;
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
  if (!newMessage.value.trim() || !selectedContact.value || !auth.user) return;
  
  const msg = {
    senderId: auth.user.id,
    senderName: auth.user?.fullName || auth.user?.username || 'Người dùng',
    receiverId: selectedContact.value.id,
    content: newMessage.value,
    timestamp: new Date().toISOString()
  };
  
  messages.value.push(msg);
  chatService.sendMessage(msg);
  newMessage.value = '';

  // Send typing false when message sent
  chatService.sendTyping({
    senderId: auth.user!.id,
    receiverId: selectedContact.value.id,
    isTyping: false
  });

  scrollToBottom();
};

const handleTyping = () => {
  if (!selectedContact.value || !auth.user) return;
  
  chatService.sendTyping({
    senderId: auth.user!.id,
    receiverId: selectedContact.value.id,
    isTyping: true
  });
  
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    chatService.sendTyping({
      senderId: auth.user!.id,
      receiverId: selectedContact.value.id,
      isTyping: false
    });
  }, 3000);
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const onTypingReceived = (typing: any) => {
  if (selectedContact.value && typing.senderId === selectedContact.value.id) {
    isContactTyping.value = typing.isTyping;
  }
};

const onMessageReceived = (msg: any) => {
  if (selectedContact.value && (msg.senderId === selectedContact.value.id || msg.receiverId === selectedContact.value.id)) {
    messages.value.push(msg);
    scrollToBottom();
  } else {
    // Check if sender is in contacts list, if not add them
    if (!contacts.value.find(c => c.id === msg.senderId)) {
      fetchContacts();
    }
  }
};

onMounted(() => {
  if (auth.isAuthenticated && auth.user?.id) {
    fetchContacts();
    chatService.connect(auth.user.id, onMessageReceived, auth.token ?? undefined, false, onTypingReceived);
  }
});

onBeforeUnmount(() => {
  chatService.disconnect(onMessageReceived, onTypingReceived);
});

watch(() => auth.isAuthenticated, (val) => {
  if (val && auth.user?.id) {
    fetchContacts();
    chatService.connect(auth.user.id, onMessageReceived, auth.token ?? undefined, false, onTypingReceived);
  } else {
    chatService.disconnect(onMessageReceived, onTypingReceived);
  }
});

watch(() => route.query.userId, (newVal) => {
  if (newVal) {
    const contact = contacts.value.find(c => c.id === Number(newVal));
    if (contact) {
      selectContact(contact);
    } else {
      fetchContacts();
    }
  }
});
</script>

<style scoped>
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

* {
  min-width: 0;
}

input, textarea {
  font-size: 16px !important;
}

@media (max-width: 640px) {
  html, body {
    overflow: hidden;
    position: fixed;
    width: 100%;
  }
}

::-webkit-scrollbar {
  width: 6px;
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
