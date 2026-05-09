<template>
  <div class="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
    <!-- Chat Window -->
    <Transition name="slide-up">
      <div 
        v-if="isOpen" 
        :class="[
          'mb-4 w-[400px] h-[600px] max-sm:w-[calc(100vw-2rem)] max-sm:h-[calc(100vh-140px)] max-sm:right-4 max-sm:bottom-20 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 z-50 transition-all border',
          plan === 'ProMax' ? 'bg-slate-950 border-indigo-500/30 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)]' :
          plan === 'Pro' ? 'bg-white border-slate-100 rounded-[2rem] shadow-2xl shadow-indigo-500/20' :
          'bg-white border-slate-200 rounded-2xl shadow-xl'
        ]"
      >
        <!-- Header -->
        <div :class="[
          'p-6 text-white shrink-0 transition-all',
          plan === 'ProMax' ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-b border-white/5' :
          plan === 'Pro' ? 'bg-gradient-to-r from-indigo-600 to-violet-600' :
          'bg-slate-600'
        ]">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <button v-if="view !== 'sessions' && plan === 'ProMax'" @click="view = 'sessions'" class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors mr-1">
                <i class="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <div :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                plan === 'ProMax' ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/20 backdrop-blur-md'
              ]">
                <i :class="['fa-solid fa-robot text-lg', plan === 'ProMax' ? 'text-white' : '']"></i>
              </div>
              <div>
                <h3 :class="['font-black text-sm uppercase tracking-wider', plan === 'ProMax' ? 'text-indigo-100' : '']">
                  {{ view === 'chat' ? (currentSessionTitle || 'AI Study Buddy') : 'Hội thoại' }}
                </h3>
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <p class="text-[10px] font-bold opacity-80 uppercase tracking-tighter">{{ plan }} Edition</p>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <!-- Info Button -->
              <router-link 
                to="/ai-guide" 
                :class="['p-2 rounded-lg transition-colors', plan === 'ProMax' ? 'hover:bg-white/10 text-indigo-300' : 'hover:bg-white/20']"
                @click="isOpen = false"
              >
                <i class="fa-solid fa-circle-info text-sm"></i>
              </router-link>

              <!-- New Chat Button (ProMax only) -->
              <button 
                v-if="plan === 'ProMax'"
                @click="startNewChat" 
                class="hover:bg-white/10 p-2 rounded-lg transition-colors text-indigo-300"
                title="Đoạn chat mới"
              >
                <i class="fa-solid fa-plus text-sm"></i>
              </button>
              
              <button @click="isOpen = false" :class="['p-2 rounded-lg transition-colors', plan === 'ProMax' ? 'hover:bg-white/10 text-indigo-300' : 'hover:bg-white/20']">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Sessions List View -->
        <div v-if="view === 'sessions'" :class="['flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar', plan === 'ProMax' ? 'bg-slate-900/50' : 'bg-slate-50/50']">
          <div v-if="sessions.length === 0" class="text-center py-10">
            <div :class="['w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed', plan === 'ProMax' ? 'bg-slate-800 text-slate-600 border-slate-700' : 'bg-white text-slate-300 border-slate-200']">
              <i class="fa-solid fa-message text-xl"></i>
            </div>
            <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Chưa có dữ liệu</p>
          </div>
          
          <button 
            v-for="session in sessions" 
            :key="session.id"
            @click="selectSession(session)"
            :class="[
              'w-full text-left p-4 rounded-2xl border transition-all group',
              plan === 'ProMax' ? 'bg-slate-800/40 border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800' : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md'
            ]"
          >
            <div class="flex justify-between items-start mb-1">
              <span :class="['text-sm font-black line-clamp-1 pr-4', plan === 'ProMax' ? 'text-slate-200' : 'text-slate-800']">{{ session.title }}</span>
              <span class="text-[10px] font-bold text-slate-500 whitespace-nowrap">{{ formatDate(session.createdAt) }}</span>
            </div>
            <p class="text-[11px] text-slate-500 line-clamp-1 font-medium">Xem chi tiết cuộc hội thoại này...</p>
          </button>
        </div>

        <!-- Chat View -->
        <template v-else>
          <!-- Messages Area -->
          <div :class="['flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar', plan === 'ProMax' ? 'bg-slate-950' : '']" ref="messagesArea">
            <div v-for="(msg, index) in messages" :key="index" :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
              <div 
                :class="[
                  'max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm',
                  msg.role === 'user' 
                    ? (plan === 'ProMax' ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20' : plan === 'Pro' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-600 text-white rounded-tr-none')
                    : (plan === 'ProMax' ? 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-white/5 backdrop-blur-md' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100')
                ]"
              >
                {{ msg.content }}
                
                <!-- Upgrade Button -->
                <div v-if="msg.role === 'assistant' && msg.content.includes('nâng cấp')" class="mt-3">
                  <router-link 
                    to="/pricing" 
                    @click="isOpen = false"
                    :class="[
                      'inline-flex items-center gap-2 px-4 py-2 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all',
                      plan === 'ProMax' ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20' : 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md'
                    ]"
                  >
                    <i class="fa-solid fa-crown text-[10px]"></i>
                    Nâng cấp tài khoản
                  </router-link>
                </div>
              </div>
            </div>
            <div v-if="loading" class="flex justify-start">
              <div :class="['px-4 py-3 rounded-2xl rounded-tl-none border flex gap-1', plan === 'ProMax' ? 'bg-slate-800/50 border-white/5' : 'bg-slate-50 border-slate-100']">
                <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div :class="['p-4 border-t transition-colors', plan === 'ProMax' ? 'border-white/5 bg-slate-900/50' : 'border-slate-50 bg-white']">
            <form @submit.prevent="sendMessage" class="relative">
              <input 
                v-model="input" 
                type="text" 
                placeholder="Hỏi AI Study Buddy..."
                :class="[
                  'w-full border-none rounded-2xl px-5 py-3.5 pr-12 text-sm font-medium transition-all outline-none',
                  plan === 'ProMax' ? 'bg-slate-800 text-white placeholder:text-slate-500 focus:ring-1 focus:ring-indigo-500/50' : 
                  plan === 'Pro' ? 'bg-slate-50 text-slate-700 focus:ring-2 focus:ring-indigo-500' :
                  'bg-slate-100 text-slate-800 focus:ring-1 focus:ring-slate-400'
                ]"
                :disabled="loading"
              />
              <button 
                type="submit" 
                :disabled="loading || !input.trim()"
                :class="[
                  'absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-50',
                  plan === 'ProMax' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 
                  plan === 'Pro' ? 'bg-indigo-600 text-white shadow-md' :
                  'bg-slate-600 text-white'
                ]"
              >
                <i class="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </form>
            <p :class="['mt-3 text-[10px] text-center font-bold uppercase tracking-[0.2em]', plan === 'ProMax' ? 'text-indigo-400/60' : 'text-slate-400']">
              {{ plan === 'ProMax' ? 'V-Edu AI Intelligence' : 'V-Edu AI Assistant' }}
            </p>
          </div>
        </template>
      </div>
    </Transition>

    <!-- Toggle Button -->
    <button 
      @click="isOpen = !isOpen"
      :class="[
        'w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 active:scale-90',
        isOpen ? 'bg-slate-900 rotate-90' : 'bg-gradient-to-tr from-indigo-600 to-violet-600 hover:scale-110 hover:shadow-indigo-500/30'
      ]"
    >
      <i :class="['fa-solid text-xl', isOpen ? 'fa-xmark' : 'fa-robot']"></i>
      <!-- Badge if unread or something -->
      <span v-if="!isOpen && messages.length === 1" class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black border-2 border-white">1</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { aiService } from '@/services/aiService';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const plan = computed(() => auth.user?.planName || 'Free');

const isOpen = ref(false);
const loading = ref(false);
const input = ref('');
const messagesArea = ref<HTMLElement | null>(null);

const view = ref<'chat' | 'sessions' | 'guide'>('chat');
const sessions = ref<any[]>([]);
const messages = ref<any[]>([]);
const currentSessionId = ref<number | null>(null);
const currentSessionTitle = ref('');

const guideSteps = [
  'Đặt câu hỏi cụ thể để nhận câu trả lời chính xác nhất.',
  'Sử dụng AI để giải thích các khái niệm khó hiểu.',
  'Yêu cầu AI tóm tắt nội dung bài học dài.',
  'Hỏi về phương pháp giải bài tập thay vì chỉ xin đáp án.',
  'Kiểm tra lại thông tin quan trọng từ sách giáo khoa.',
  'Sử dụng AI để luyện tập hội thoại tiếng Anh.',
  'Yêu cầu AI tạo các câu hỏi trắc nghiệm ôn tập.',
  'Không chia sẻ thông tin cá nhân nhạy cảm với AI.',
  'Báo cáo nếu AI đưa ra nội dung không phù hợp.',
  'Tận dụng tính năng lưu lịch sử (ProMax) để xem lại bài.',
  'Luôn giữ tinh thần học tập chủ động và sáng tạo.'
];

const policies = [
  'Dữ liệu trò chuyện được mã hóa bảo mật.',
  'Không sử dụng dữ liệu vào mục đích quảng cáo.',
  'AI tuân thủ các quy tắc đạo đức và giáo dục.',
  'Giới hạn số lượng tin nhắn theo gói cước.'
];

const defaultWelcome = { role: 'assistant', content: 'Chào bạn! 👋 Mình là AI Study Buddy. Hôm nay bạn muốn mình hỗ trợ giải đáp kiến thức nào không?' };

const scrollToBottom = async () => {
  await nextTick();
  if (messagesArea.value) {
    messagesArea.value.scrollTop = messagesArea.value.scrollHeight;
  }
};

const fetchSessions = async () => {
  try {
    const res = await aiService.getSessions();
    sessions.value = res.data || [];
  } catch (err) {
    console.error('Failed to fetch sessions:', err);
  }
};

const selectSession = async (session: any) => {
  currentSessionId.value = session.id;
  currentSessionTitle.value = session.title;
  view.value = 'chat';
  loading.value = true;
  try {
    const res = await aiService.getSessionMessages(session.id);
    messages.value = res.data?.map((m: any) => ({
      role: m.role,
      content: m.content
    })) || [];
    nextTick(scrollToBottom);
  } catch (err) {
    console.error('Failed to fetch session messages:', err);
  } finally {
    loading.value = false;
  }
};

const startNewChat = () => {
  currentSessionId.value = null;
  currentSessionTitle.value = '';
  messages.value = [defaultWelcome];
  view.value = 'chat';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

const sendMessage = async () => {
  if (!input.value.trim() || loading.value) return;

  const userMsg = input.value;
  input.value = '';
  messages.value.push({ role: 'user', content: userMsg });
  await scrollToBottom();

  loading.value = true;
  try {
    const res = await aiService.sendMessage(userMsg, currentSessionId.value);
    
    // Nếu đây là tin nhắn đầu tiên của phiên mới, server sẽ tạo session và trả về có thể cần reload list
    if (currentSessionId.value === null && auth.user?.planName === 'ProMax') {
       fetchSessions();
    }

    messages.value.push({ role: 'assistant', content: res.data });
  } catch (err: any) {
    const errorMsg = err.response?.status === 403 
      ? 'Hic, tính năng này chỉ dành cho gói Pro và ProMax thui ạ. Bạn nâng cấp để cùng mình học bài nhé! ✨'
      : 'Uầy, có chút lỗi kỹ thuật rồi. Bạn thử lại sau ít phút nhé!';
    messages.value.push({ role: 'assistant', content: errorMsg });
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
};

watch(isOpen, (newVal) => {
  if (newVal) {
    if (auth.user?.planName === 'ProMax' && sessions.value.length === 0) {
      fetchSessions();
    }
    if (messages.value.length === 0) {
      messages.value = [defaultWelcome];
    }
    nextTick(scrollToBottom);
  }
});

watch(view, (newVal) => {
  if (newVal === 'sessions') {
    fetchSessions();
  }
});

onMounted(() => {
  if (auth.isAuthenticated) {
    if (auth.user?.planName === 'ProMax') {
       fetchSessions();
    }
    messages.value = [defaultWelcome];
  }
});
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
