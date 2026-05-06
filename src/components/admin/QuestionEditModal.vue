<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 backdrop-blur-0"
      enter-to-class="opacity-100 backdrop-blur-md"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 backdrop-blur-md"
      leave-to-class="opacity-0 backdrop-blur-0"
    >
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 sm:p-6" @click="close">
        <div class="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-scale-in" @click.stop>
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-slate-100 px-8 py-6">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                <i class="fa-solid fa-pen-to-square text-lg"></i>
              </div>
              <div>
                <h3 class="m-0 text-xl font-black text-slate-900">Sửa câu hỏi #{{ question?.id }}</h3>
                <p class="m-0 text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Cập nhật nội dung & đáp án</p>
              </div>
            </div>
            <button @click="close" class="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div class="overflow-y-auto p-8 custom-scrollbar" style="max-height: calc(90vh - 180px)">
            <form @submit.prevent="handleSave" class="space-y-8">
              <!-- Basic Info -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Loại câu hỏi</label>
                  <select v-model="form.type" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all">
                    <option value="MCQ">Trắc nghiệm (MCQ)</option>
                    <option value="ESSAY">Tự luận (ESSAY)</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Độ khó</label>
                  <select v-model="form.difficulty" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all">
                    <option value="EASY">Dễ</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HARD">Khó</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Định dạng</label>
                  <select v-model="form.contentFormat" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all">
                    <option value="PLAIN_TEXT">Văn bản thường</option>
                    <option value="LATEX">Công thức Toán (LaTeX)</option>
                  </select>
                </div>
              </div>

              <!-- Content -->
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Nội dung câu hỏi</label>
                <textarea 
                  v-model="form.content"
                  rows="4"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                  placeholder="Nhập nội dung câu hỏi..."
                ></textarea>
                <div v-if="form.content" class="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Xem trước nội dung:</p>
                  <p class="text-sm font-bold text-slate-700 m-0">
                    <MathContent :content="form.content" />
                  </p>
                </div>
              </div>

              <!-- Media URL -->
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">URL Ảnh (Nếu có)</label>
                <div class="relative">
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <i class="fa-solid fa-image"></i>
                  </span>
                  <input 
                    v-model="form.url"
                    type="text" 
                    class="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 py-3.5 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    placeholder="/uploads/..."
                  />
                </div>
              </div>

              <!-- MCQ Options -->
              <div v-if="form.type === 'MCQ'" class="space-y-4">
                <div class="flex items-center justify-between ml-1">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-500">Danh sách đáp án</label>
                  <button @click="addOption" type="button" class="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700">
                    <i class="fa-solid fa-plus mr-1"></i> Thêm đáp án
                  </button>
                </div>
                <div class="grid gap-4">
                  <div v-for="(opt, oidx) in form.options" :key="oidx" class="group flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 transition-all hover:bg-white hover:border-indigo-100">
                    <div class="mt-2.5">
                      <input 
                        type="checkbox" 
                        v-model="opt.isCorrect"
                        class="h-5 w-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div class="flex-1 space-y-2">
                      <input 
                        v-model="opt.content"
                        type="text" 
                        class="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-700 placeholder-slate-300 outline-none"
                        :placeholder="`Đáp án ${String.fromCharCode(65 + oidx)}...`"
                      />
                      <!-- Mini preview for LaTeX in option -->
                      <div v-if="opt.content" class="mt-1 text-[11px] text-slate-400 italic">
                        <MathContent :content="opt.content" />
                      </div>
                    </div>
                    <button @click="removeOption(oidx)" type="button" class="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-rose-500">
                      <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Essay Sample Answer -->
              <div v-else class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Đáp án mẫu (ESSAY)</label>
                <textarea 
                  v-model="form.sampleAnswer"
                  rows="4"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                  placeholder="Nhập đáp án mẫu cho câu tự luận..."
                ></textarea>
              </div>

              <!-- Explanation -->
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Giải thích lời giải</label>
                <textarea 
                  v-model="form.explanation"
                  rows="3"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                  placeholder="Nhập lời giải thích..."
                ></textarea>
                <div v-if="form.explanation" class="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Xem trước giải thích:</p>
                  <p class="text-sm font-bold text-slate-700 m-0">
                    <MathContent :content="form.explanation" />
                  </p>
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="border-t border-slate-100 px-8 py-6 bg-slate-50/50 flex items-center justify-end gap-4">
            <button @click="close" class="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all">
              Hủy bỏ
            </button>
            <button 
              @click="handleSave"
              :disabled="saving"
              class="relative overflow-hidden px-8 py-3 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-70"
            >
              <span v-if="saving" class="flex items-center gap-2">
                <i class="fa-solid fa-circle-notch animate-spin"></i> Đang lưu...
              </span>
              <span v-else>Lưu thay đổi</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { updateQuestion, type QuestionRequest } from '@/services/questionService';
import MathContent from '@/components/common/MathContent.vue';

const props = defineProps<{
  show: boolean;
  question: any;
}>();

const emit = defineEmits(['close', 'saved']);

const saving = ref(false);
const form = reactive<QuestionRequest>({
  content: '',
  contentFormat: 'PLAIN_TEXT',
  url: '',
  type: 'MCQ',
  difficulty: 'MEDIUM',
  topicId: 0,
  options: [],
  sampleAnswer: '',
  explanation: ''
});

watch(() => props.question, (q) => {
  if (q) {
    Object.assign(form, {
      content: q.content || q.contentSnapshot || q.questionContent || '',
      contentFormat: q.contentFormat || 'PLAIN_TEXT',
      url: q.url || '',
      type: q.type || 'MCQ',
      difficulty: q.difficulty || 'MEDIUM',
      topicId: q.topicId || 0,
      options: q.options ? JSON.parse(JSON.stringify(q.options)) : (q._options ? JSON.parse(JSON.stringify(q._options)) : []),
      sampleAnswer: q.sampleAnswer || '',
      explanation: q.explanation || ''
    });
  }
}, { immediate: true });

const close = () => emit('close');

const addOption = () => {
  if (!form.options) form.options = [];
  form.options.push({ content: '', isCorrect: false });
};

const removeOption = (index: number) => {
  form.options?.splice(index, 1);
};

const handleSave = async () => {
  if (!props.question) return;
  
  // Validation MCQ
  if (form.type === 'MCQ') {
    if (!form.options || form.options.length < 2) {
      alert('Câu hỏi MCQ phải có ít nhất 2 đáp án!');
      return;
    }
    if (!form.options.some(o => o.isCorrect)) {
      alert('Câu hỏi MCQ phải có ít nhất 1 đáp án đúng!');
      return;
    }
  } else if (form.type === 'ESSAY') {
    if (!form.sampleAnswer?.trim()) {
      alert('Câu hỏi ESSAY phải có đáp án mẫu!');
      return;
    }
  }

  saving.value = true;
  try {
    const res = await updateQuestion(props.question.id || props.question.questionId, form);
    if (res.data?.status === 200) {
      emit('saved', { ...form });
      close();
      alert('Cập nhật câu hỏi thành công!');
    }
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật câu hỏi.');
  } finally {
    saving.value = false;
  }
};
</script>
