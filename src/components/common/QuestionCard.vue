<template>
  <article
    :id="`q-${id}`"
    class="animate-slide-up-reveal group flex flex-col h-full overflow-hidden transition-all duration-500"
    :class="[
      uiLayoutHint === 'LITERATURE' 
        ? 'border-x border-amber-100/50 bg-[#fffcf5] font-serif shadow-[0_0_50px_rgba(0,0,0,0.02)] min-h-screen' 
        : 'rounded-[2rem] border',
      uiLayoutHint !== 'LITERATURE' && isReview 
        ? (isCorrect ? 'border-emerald-100 bg-white hover:border-emerald-200 hover:shadow-emerald-500/5' : 'border-rose-100 bg-white hover:border-rose-200 hover:shadow-rose-500/5')
        : (uiLayoutHint !== 'LITERATURE' ? 'border-slate-100/80 bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5' : '')
    ]"
    :style="animationStyle"
  >
    <!-- Header -->
    <div 
      class="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-8 sm:py-5"
      :class="uiLayoutHint === 'LITERATURE' ? 'border-amber-100/30 bg-amber-50/20' : 'border-slate-50 bg-slate-50/50'"
    >
      <div class="flex items-center gap-4">
        <span 
          class="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black shadow-lg transition-all duration-500"
          :class="[
            uiLayoutHint === 'LITERATURE' ? 'bg-amber-900 text-amber-50' :
            isReview 
              ? (isCorrect ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20')
              : 'bg-indigo-600 text-white shadow-indigo-500/20'
          ]"
        >
          {{ index.toString().padStart(2, '0') }}
        </span>
        <span 
          class="text-xs font-black uppercase tracking-[0.25em]"
          :class="[
            uiLayoutHint === 'LITERATURE' ? 'text-amber-900/70 font-serif' : 'text-slate-400'
          ]"
        >
          {{ isReview ? (isCorrect ? 'KẾT QUẢ' : 'KẾT QUẢ') : 'ĐỀ BÀI' }}
        </span>
      </div>
      <div v-if="score !== undefined" class="flex items-center gap-2">
        <span class="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100">{{ score }} điểm</span>
      </div>
    </div>

    <!-- Content Area -->
    <div class="px-5 py-6 sm:px-8 sm:py-10 flex flex-col grow">
      <h2 
        class="m-0 leading-relaxed transition-colors"
        :class="[
          uiLayoutHint === 'LITERATURE' 
            ? 'text-xl sm:text-2xl font-medium text-slate-900 italic' 
            : 'text-lg sm:text-xl font-bold text-slate-800 group-hover:text-indigo-700'
        ]"
      >
        <MathContent :content="content || ''" :format="contentFormat" />
      </h2>

      <!-- Image -->
      <div v-if="imageUrl" class="group/img mt-6 relative overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50/50 p-3">
        <img
          :src="imageUrl"
          class="max-h-[360px] w-full rounded-xl object-contain transition-all duration-500 group-hover/img:scale-[1.02] cursor-zoom-in"
          loading="lazy"
          @click="$emit('zoom', imageUrl)"
        />
        <button 
          type="button"
          @click="$emit('zoom', imageUrl)"
          class="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-slate-600 shadow-xl backdrop-blur-md opacity-0 transition-all duration-300 group-hover/img:opacity-100 hover:bg-indigo-600 hover:text-white"
        >
          <i class="fa-solid fa-magnifying-glass-plus text-sm"></i>
        </button>
      </div>

      <!-- Options (Multiple Choice) -->
      <div v-if="options && options.length" class="mt-8 space-y-4 grow">
        <div
          v-for="(option, oi) in options"
          :key="option.id || oi"
          @click="!isReview && $emit('select', option.value)"
          class="flex items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border-2 px-4 py-3 sm:px-5 sm:py-3.5 transition-all duration-300 relative overflow-hidden"
          :class="[
            isReview ? getReviewOptionClass(option) : getAttemptOptionClass(option),
            !isReview ? 'cursor-pointer' : ''
          ]"
        >
          <span
            class="relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-black shadow-sm transition-all duration-300"
            :class="getOptionBadgeClass(option)"
          >
            {{ String.fromCharCode(65 + oi) }}
          </span>
          <span class="relative z-10 text-sm sm:text-base font-bold leading-relaxed grow transition-colors" :class="getOptionTextClass(option)">
            <MathContent :content="option.label || option.content || ''" :format="contentFormat" />
          </span>
          
          <template v-if="isReview">
            <div v-if="option._isSelected" class="absolute left-1/2 -top-2 -translate-x-1/2 bg-slate-900 text-[8px] font-black text-white px-2 py-0.5 rounded-full z-20 shadow-sm border border-white/20 whitespace-nowrap">
              BẠN CHỌN
            </div>
            <i v-if="option.isCorrect" class="relative z-10 fa-solid fa-circle-check text-emerald-500 text-2xl shrink-0 animate-scale-in"></i>
            <i v-else-if="option._isSelected" class="relative z-10 fa-solid fa-circle-xmark text-rose-500 text-2xl shrink-0 animate-scale-in"></i>
          </template>
        </div>
      </div>

      <!-- Essay Input/Display -->
      <div v-else class="mt-8 grow">
        <template v-if="!isReview">
          <div 
            class="relative group/essay"
            :class="uiLayoutHint === 'LITERATURE' ? 'min-h-[400px]' : 'min-h-[160px]'"
          >
            <textarea
              :value="modelValue"
              @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
              @focus="$emit('focus')"
              :placeholder="uiLayoutHint === 'LITERATURE' ? 'Bắt đầu viết bài làm của bạn tại đây...' : 'Nhập đáp án của bạn tại đây...'"
              class="w-full h-full border-none px-0 py-4 text-xl font-medium text-slate-900 outline-none transition-all duration-300 bg-transparent resize-none leading-loose"
              :class="[
                uiLayoutHint === 'LITERATURE' 
                  ? 'min-h-[800px] font-serif italic' 
                  : 'min-h-[160px] focus:border-indigo-400'
              ]"
            ></textarea>
            
            <!-- Lines for paper effect -->
            <div v-if="uiLayoutHint === 'LITERATURE'" class="absolute inset-0 -z-10 pointer-events-none opacity-20" 
                 style="background-image: linear-gradient(#94a3b8 1px, transparent 1px); background-size: 100% 3rem; margin-top: 2.8rem;"></div>

            <div 
              class="absolute bottom-6 right-0 text-[10px] font-black uppercase tracking-widest pointer-events-none opacity-0 group-focus-within/essay:opacity-100 transition-opacity"
              :class="uiLayoutHint === 'LITERATURE' ? 'text-amber-700/40' : 'text-slate-400'"
            >
              Hệ thống đang tự động lưu nháp...
            </div>
          </div>
        </template>
        <template v-else-if="essayAnswer">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 m-0 mb-4">Bài làm của học sinh:</p>
          <div 
            class="rounded-[2rem] p-8 sm:p-10 text-lg font-medium text-slate-900 border leading-loose shadow-sm"
            :class="uiLayoutHint === 'LITERATURE' ? 'border-amber-100 bg-[#fffefc] font-serif italic' : 'border-slate-100 bg-slate-50'"
          >
            <MathContent :content="essayAnswer || ''" :format="contentFormat" />
          </div>
        </template>
      </div>

      <!-- Review Extra Info (Explanation & AI Feedback) -->
      <template v-if="isReview">
        <!-- Default Explanation from Database -->
        <div v-if="explanation || sampleAnswer" class="mt-8 rounded-[1.5rem] border-2 border-blue-100 bg-blue-50/30 px-6 py-6 shrink-0 shadow-xl shadow-blue-500/5">
          <p class="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 m-0 mb-4 flex items-center">
            <i class="fa-solid fa-lightbulb mr-2 text-blue-400 text-base"></i> 
            {{ sampleAnswer ? 'ĐÁP ÁN MẪU' : 'GIẢI THÍCH CHI TIẾT' }}
          </p>
          <div class="text-sm text-slate-700 leading-relaxed m-0 font-bold whitespace-pre-line">
            <MathContent :content="explanation || sampleAnswer || ''" :format="contentFormat" />
          </div>
        </div>

        <!-- AI Tutor Explanation -->
        <div class="mt-6 relative">
          <div v-if="aiExplaining" class="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-[1.5rem] border border-indigo-100">
            <div class="flex flex-col items-center gap-3">
              <div class="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Gia sư AI đang suy nghĩ...</span>
            </div>
          </div>

          <div v-if="aiExplanation" class="rounded-[1.5rem] border-2 border-indigo-500/20 bg-indigo-50/30 p-6 shadow-xl shadow-indigo-500/5 animate-slide-up-reveal">
             <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 m-0 mb-4 flex items-center gap-2">
               <i class="fa-solid fa-wand-magic-sparkles"></i> 
               Giải thích từ Gia sư AI
             </p>
             <div class="text-sm text-slate-800 leading-relaxed font-medium ai-explanation-content">
                <MathContent :content="aiExplanation" :format="contentFormat" />
             </div>
             <div class="mt-4 flex justify-end">
                <button @click="aiExplanation = ''" class="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                  Đóng giải thích
                </button>
             </div>
          </div>

          <button 
            v-else
            @click="$emit('askAi', id)"
            class="w-full group/ai flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
          >
            <div class="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 group-hover/ai:scale-110 transition-transform">
              <i class="fa-solid fa-robot"></i>
            </div>
            <span class="text-xs font-black uppercase tracking-widest text-indigo-600">Bạn chưa hiểu câu này? Hỏi Gia sư AI ngay</span>
          </button>
        </div>

        <!-- Detailed Feedback -->
        <div v-if="feedback" class="mt-6 overflow-hidden rounded-[1.5rem] border-2 border-indigo-100 bg-indigo-50/50 p-6 relative">
          <div class="absolute -right-4 -top-4 h-20 w-20 bg-indigo-500/10 blur-2xl pointer-events-none"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 m-0 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-pen-nib"></i> 
            Nhận xét của giáo viên
          </p>
          <div class="space-y-4">
            <div v-for="(part, pi) in formattedFeedback" :key="pi" 
                 class="p-4 rounded-2xl transition-all duration-300"
                 :class="[
                   part.type === 'pros' ? 'bg-emerald-50 border border-emerald-100' :
                   part.type === 'cons' ? 'bg-rose-50 border border-rose-100' :
                   part.type === 'tips' ? 'bg-indigo-50 border border-indigo-100' :
                   'bg-slate-50 border border-slate-100'
                 ]"
            >
              <div class="flex items-center gap-3 mb-2">
                <i :class="part.icon" class="text-lg"></i>
                <span class="text-sm font-black uppercase tracking-wider" :class="part.textColor">{{ part.label }}</span>
              </div>
              <div class="text-sm text-slate-800 leading-relaxed font-medium">
                <MathContent :content="part.content" :format="contentFormat" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MathContent from './MathContent.vue';

interface Option {
  id?: number;
  label?: string;
  content?: string;
  value: string;
  isCorrect?: boolean;
  _isSelected?: boolean;
}

const props = defineProps<{
  id: number;
  index: number;
  content?: string;
  contentFormat?: 'PLAIN_TEXT' | 'LATEX';
  imageUrl?: string;
  options?: Option[];
  score?: number;
  // Attempt props
  modelValue?: string;
  // Review props
  isReview?: boolean;
  isCorrect?: boolean;
  essayAnswer?: string | null;
  explanation?: string;
  sampleAnswer?: string;
  feedback?: string;
  gradingMethod?: string;
  uiLayoutHint?: 'STANDARD' | 'LITERATURE' | 'ESSAY' | 'MIXED';
  animationDelay?: number;
  aiExplanation?: string;
  aiExplaining?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'select': [value: string];
  'zoom': [url: string];
  'focus': [];
  'askAi': [id: number];
}>();

const animationStyle = {
  animationDelay: `${props.animationDelay || 0}ms`
};

const getAttemptOptionClass = (option: Option) => {
  if (props.modelValue === option.value) {
    return 'border-indigo-400 bg-indigo-50/40 shadow-md shadow-indigo-500/5';
  }
  return 'border-slate-100 bg-slate-50/20 hover:border-indigo-200 hover:bg-white hover:shadow-sm';
};

const getReviewOptionClass = (option: Option) => {
  if (option.isCorrect) {
    return 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20';
  }
  if (option._isSelected && !option.isCorrect) {
    return 'border-rose-500 bg-rose-50/50 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/20';
  }
  return 'border-slate-100 bg-white';
};

const getOptionBadgeClass = (option: Option) => {
  if (props.isReview) {
    if (option.isCorrect) return 'bg-emerald-500 text-white';
    if (option._isSelected) return 'bg-rose-500 text-white';
    return 'bg-white text-slate-600 border border-slate-100';
  }
  if (props.modelValue === option.value) return 'bg-indigo-600 text-white scale-105';
  return 'bg-white text-slate-400 border border-slate-100';
};

const formattedFeedback = computed(() => {
  if (!props.feedback) return [];
  
  // Unescape literal \n strings if they exist
  const rawFeedback = props.feedback.replace(/\\n/g, '\n');
  
  const sections = rawFeedback.split(/\n\s*\n|\n(?=Ưu điểm:|Nhược điểm:|Thiếu sót:|Gợi ý cải thiện:)/g);
  
  return sections.map(section => {
    const text = section.trim();
    if (text.startsWith('Ưu điểm:')) {
      return { 
        type: 'pros', 
        label: 'Ưu điểm', 
        icon: 'fa-solid fa-circle-check text-emerald-500', 
        textColor: 'text-emerald-700',
        content: text.replace('Ưu điểm:', '').trim() 
      };
    }
    if (text.startsWith('Nhược điểm:') || text.startsWith('Thiếu sót:')) {
      return { 
        type: 'cons', 
        label: 'Cần cải thiện', 
        icon: 'fa-solid fa-circle-exclamation text-rose-500', 
        textColor: 'text-rose-700',
        content: text.replace(/Nhược điểm:|Thiếu sót:/, '').trim() 
      };
    }
    if (text.startsWith('Gợi ý cải thiện:')) {
      return { 
        type: 'tips', 
        label: 'Gợi ý nâng điểm', 
        icon: 'fa-solid fa-lightbulb text-indigo-500', 
        textColor: 'text-indigo-700',
        content: text.replace('Gợi ý cải thiện:', '').trim() 
      };
    }
    return { 
      type: 'default', 
      label: 'Nhận xét', 
      icon: 'fa-solid fa-comment-dots text-slate-500', 
      textColor: 'text-slate-700',
      content: text 
    };
  }).filter(p => p.content.length > 0);
});

const getOptionTextClass = (option: Option) => {
  if (props.isReview) {
    if (option.isCorrect) return 'text-emerald-900';
    if (option._isSelected) return 'text-rose-900';
    return 'text-slate-600';
  }
  if (props.modelValue === option.value) return 'text-indigo-900';
  return 'text-slate-600';
};
</script>
