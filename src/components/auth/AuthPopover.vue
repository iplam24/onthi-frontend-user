<template>
  <div
    class="fixed inset-0 z-[70] flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-fade-in"></div>

    <!-- Modal -->
    <div class="animate-scale-in relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl shadow-indigo-500/10">
      <!-- Gradient accent top -->
      <div class="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"></div>

      <!-- Tab header -->
      <div class="relative flex border-b border-slate-100 bg-slate-50/80">
        <!-- Sliding indicator -->
        <div 
          class="absolute bottom-0 h-[3px] bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500 ease-out"
          :style="{ left: formType === 'login' ? '0%' : '50%', width: '50%' }"
        ></div>
        <button
          :class="[
            'flex-1 px-4 py-4 text-sm font-bold transition-all duration-300',
            formType === 'login'
              ? 'text-indigo-600'
              : 'text-slate-400 hover:text-slate-600',
          ]"
          @click="formType = 'login'"
        >
          <i class="fa-solid fa-right-to-bracket mr-2 text-xs"></i>
          Đăng nhập
        </button>
        <button
          :class="[
            'flex-1 px-4 py-4 text-sm font-bold transition-all duration-300',
            formType === 'register'
              ? 'text-indigo-600'
              : 'text-slate-400 hover:text-slate-600',
          ]"
          @click="formType = 'register'"
        >
          <i class="fa-solid fa-user-plus mr-2 text-xs"></i>
          Đăng ký
        </button>
        
        <button
          class="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-300 hover:bg-rose-50 hover:text-rose-500 hover:rotate-90 active:scale-90"
          @click="$emit('close')"
          aria-label="Đóng"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Form body -->
      <div class="space-y-6 p-8">
        <!-- Login form -->
        <form v-if="formType === 'login'" class="space-y-5" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <label for="login-username" class="text-sm font-bold text-slate-700">Tên đăng nhập</label>
            <div class="relative">
              <i class="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-300"></i>
              <input
                id="login-username"
                v-model="loginForm.username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                required
                class="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/10 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label for="login-password" class="text-sm font-bold text-slate-700">Mật khẩu</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-300"></i>
              <input
                id="login-password"
                v-model="loginForm.password"
                type="password"
                placeholder="Nhập mật khẩu"
                required
                class="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/10 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>
          <p v-if="loginForm.error" class="animate-shake rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-center text-xs font-bold text-rose-600">
            <i class="fa-solid fa-circle-exclamation mr-1.5"></i>{{ loginForm.error }}
          </p>
          <button
            type="submit"
            class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.98]"
          >
            <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full skew-x-12"></span>
            <span class="relative z-10 flex items-center justify-center gap-2">
              Đăng nhập
              <i class="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
            </span>
          </button>
        </form>

        <!-- Register form -->
        <form v-if="formType === 'register'" class="space-y-5" @submit.prevent="handleRegister">
          <div class="space-y-2">
            <label for="reg-username" class="text-sm font-bold text-slate-700">Tên đăng nhập</label>
            <div class="relative">
              <i class="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-300"></i>
              <input
                id="reg-username"
                v-model="registerForm.username"
                type="text"
                placeholder="Chọn tên đăng nhập"
                required
                class="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/10 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label for="reg-email" class="text-sm font-bold text-slate-700">Email</label>
            <div class="relative">
              <i class="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-300"></i>
              <input
                id="reg-email"
                v-model="registerForm.email"
                type="email"
                placeholder="email@example.com"
                required
                class="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/10 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label for="reg-password" class="text-sm font-bold text-slate-700">Mật khẩu</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-300"></i>
              <input
                id="reg-password"
                v-model="registerForm.password"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                required
                class="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/10 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>
          <p v-if="registerForm.error" class="animate-shake rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-center text-xs font-bold text-rose-600">
            <i class="fa-solid fa-circle-exclamation mr-1.5"></i>{{ registerForm.error }}
          </p>
          <p v-if="registerForm.success" class="animate-scale-in rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-center text-xs font-bold text-emerald-600">
            <i class="fa-solid fa-circle-check mr-1.5"></i>{{ registerForm.success }}
          </p>
          <button
            type="submit"
            class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.98]"
          >
            <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full skew-x-12"></span>
            <span class="relative z-10 flex items-center justify-center gap-2">
              Đăng ký tài khoản
              <i class="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
            </span>
          </button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center"><span class="w-full border-t border-slate-100"></span></div>
          <div class="relative flex justify-center text-xs uppercase tracking-wider font-bold text-slate-300">
            <span class="bg-white px-3">Hoặc</span>
          </div>
        </div>

        <button
          @click="handleGoogleLogin"
          class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.98]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="h-5 w-5" />
          Tiếp tục với Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { login, loginWithGoogle, register } from '@/services/authService';

const emit = defineEmits(['close']);
const auth = useAuthStore();
const router = useRouter();
const formType = ref('login');

const loginForm = reactive({ username: '', password: '', error: null });
const registerForm = reactive({ username: '', email: '', password: '', error: null, success: null });

const handleLogin = async () => {
  try {
    const response = await login({ username: loginForm.username, password: loginForm.password });
    if (response.data.status === 200) {
      auth.login(response.data.data);
      emit('close');
      router.push('/').then(() => {
        window.location.reload();
      });
    } else {
      loginForm.error = response.data.message;
    }
  } catch (err) {
    loginForm.error = 'Tên đăng nhập hoặc mật khẩu không đúng.';
  }
};

const handleRegister = async () => {
  registerForm.error = null;
  registerForm.success = null;
  try {
    const response = await register({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
    });
    if (response.data.status === 200) {
      registerForm.success = response.data.message;
      setTimeout(() => {
        formType.value = 'login';
      }, 2000);
    } else {
      registerForm.error = response.data.message;
    }
  } catch (err) {
    console.error('Registration error:', err);
    if (err.response && err.response.data && err.response.data.message) {
      registerForm.error = err.response.data.message;
    } else {
      registerForm.error = 'Đã có lỗi xảy ra trong quá trình đăng ký.';
    }
  }
};

const handleGoogleLogin = () => {
  loginWithGoogle();
};
</script>
