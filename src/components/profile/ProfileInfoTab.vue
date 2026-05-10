<template>
  <div class="space-y-8">
    <!-- Edit Form (Only for own profile) -->
    <div v-if="!isPublicProfile" class="card-elevated overflow-hidden border border-slate-100 bg-white">
      <div class="bg-slate-50/50 px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="m-0 text-xl font-black text-slate-900 tracking-tight">Cài đặt hồ sơ</h2>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cập nhật thông tin cá nhân của bạn</p>
        </div>
        <div class="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <i class="fa-solid fa-user-gear text-lg"></i>
        </div>
      </div>

      <div class="p-5 sm:p-8">
        <form @submit.prevent="$emit('update')" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Full Name -->
            <div class="space-y-3">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
                <i class="fa-solid fa-signature text-indigo-400"></i> Họ và tên
              </label>
              <input v-model="formData.fullName" type="text" placeholder="Ví dụ: Nguyễn Văn A" class="input-primary w-full py-4 px-5 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all shadow-sm" />
            </div>
            
            <!-- Birthday -->
            <div class="space-y-3">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
                <i class="fa-solid fa-cake-candles text-rose-400"></i> Ngày sinh
              </label>
              <input v-model="formData.dob" type="date" class="input-primary w-full py-4 px-5 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all shadow-sm" />
            </div>

            <!-- School -->
            <div class="space-y-3">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
                <i class="fa-solid fa-school text-emerald-400"></i> Trường học
              </label>
              <input v-model="formData.schoolName" type="text" placeholder="Trường THPT..." class="input-primary w-full py-4 px-5 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all shadow-sm" />
            </div>

            <!-- Class/Level -->
            <div class="space-y-3">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
                <i class="fa-solid fa-graduation-cap text-amber-400"></i> Khối / Lớp học
              </label>
              <div class="relative">
                <select v-model="formData.levelId" class="input-primary w-full py-4 px-5 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer">
                  <option :value="undefined" disabled>Chọn khối/lớp học của bạn</option>
                  <option v-for="l in levels" :key="l.id" :value="l.id">{{ l.name }}</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-xs"></i>
              </div>
            </div>
          </div>

          <transition enter-active-class="transition duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
            <div v-if="updateSuccess" class="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-emerald-700 font-bold text-sm flex items-center gap-3 shadow-sm shadow-emerald-500/5">
              <div class="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                <i class="fa-solid fa-check"></i>
              </div>
              Thông tin của bạn đã được cập nhật thành công!
            </div>
          </transition>

          <div class="pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p class="text-[10px] font-bold text-slate-400 italic">Lưu ý: Thông tin này sẽ hiển thị công khai trên hồ sơ của bạn.</p>
            <button type="submit" :disabled="updating" class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-indigo-600 text-white text-sm font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/25 disabled:opacity-50">
              <i v-if="updating" class="fa-solid fa-circle-notch animate-spin"></i>
              <i v-else class="fa-solid fa-cloud-arrow-up"></i>
              {{ updating ? 'Đang lưu...' : 'Lưu thông tin' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Public Info Display -->
    <div v-else class="card-elevated overflow-hidden border border-slate-100 bg-white">
      <div class="bg-slate-50/50 px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex items-center gap-4">
        <div class="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <i class="fa-solid fa-info text-xl"></i>
        </div>
        <div>
          <h2 class="m-0 text-xl font-black text-slate-900 tracking-tight">Thông tin cá nhân</h2>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Về {{ displayName }}</p>
        </div>
      </div>

      <div class="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
        <div class="group p-5 sm:p-6 rounded-2xl bg-slate-50/50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all duration-300">
          <div class="flex items-center gap-4 mb-4">
            <div class="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-school"></i>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 m-0">Trường học</p>
          </div>
          <p class="text-lg font-black text-slate-800 m-0 leading-tight">{{ profile?.schoolName || 'Thông tin chưa cập nhật' }}</p>
        </div>

        <div class="group p-5 sm:p-6 rounded-2xl bg-slate-50/50 border border-transparent hover:border-amber-100 hover:bg-white transition-all duration-300">
          <div class="flex items-center gap-4 mb-4">
            <div class="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 m-0">Khối / Lớp học</p>
          </div>
          <p class="text-lg font-black text-slate-800 m-0 leading-tight">{{ profile?.levelName || 'Thông tin chưa cập nhật' }}</p>
        </div>

        <div class="sm:col-span-2 group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/50">
          <div class="flex items-center gap-4 mb-6">
            <div class="h-10 w-10 rounded-xl bg-white text-indigo-600 shadow-sm flex items-center justify-center">
              <i class="fa-solid fa-quote-left"></i>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 m-0">Giới thiệu ngắn</p>
          </div>
          <p class="text-base font-medium text-slate-600 italic leading-relaxed m-0">
            "Người dùng này hiện chưa viết lời giới thiệu. Hãy kết bạn và cùng nhau học tập nhé!"
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  profile: any;
  isPublicProfile: boolean;
  displayName: string;
  formData: any;
  levels: any[];
  updating: boolean;
  updateSuccess: boolean;
}>();

defineEmits(['update']);
</script>
