<template>
  <div
    class="fixed inset-0 z-[70] flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"></div>

    <!-- Modal -->
    <div class="animate-scale-in relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
      <!-- Tab header -->
      <div class="relative flex border-b border-slate-100 bg-slate-50/50">
        <button
          :class="[
            'flex-1 px-4 py-3.5 text-sm font-bold transition-all',
            formType === 'login'
              ? 'text-blue-600 bg-white border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700',
          ]"
          @click="formType = 'login'"
        >
          Đăng nhập
        </button>
        <button
          :class="[
            'flex-1 px-4 py-3.5 text-sm font-bold transition-all',
            formType === 'register'
              ? 'text-blue-600 bg-white border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700',
          ]"
          @click="formType = 'register'"
        >
          Đăng ký
        </button>
        
        <button
          class="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-rose-500"
          @click="$emit('close')"
          aria-label="Đóng"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Form body -->
      <div class="space-y-6 p-8">
        <!-- Login form -->
        <form v-if="formType === 'login'" class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-1">
            <label for="login-username" class="text-sm font-semibold text-slate-700">Tên đăng nhập</label>
            <input
              id="login-username"
              v-model="loginForm.username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              required
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <div class="space-y-1">
            <label for="login-password" class="text-sm font-semibold text-slate-700">Mật khẩu</label>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              placeholder="Nhập mật khẩu"
              required
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <p v-if="loginForm.error" class="rounded-lg bg-rose-50 px-3 py-2 text-center text-xs font-semibold text-rose-600">
            {{ loginForm.error }}
          </p>
          <button
            type="submit"
            class="w-full rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Đăng nhập
          </button>
        </form>

        <!-- Register form -->
        <form v-if="formType === 'register'" class="space-y-4" @submit.prevent="handleRegister">
          <div class="space-y-1">
            <label for="reg-username" class="text-sm font-semibold text-slate-700">Tên đăng nhập</label>
            <input
              id="reg-username"
              v-model="registerForm.username"
              type="text"
              placeholder="Chọn tên đăng nhập"
              required
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <div class="space-y-1">
            <label for="reg-email" class="text-sm font-semibold text-slate-700">Email</label>
            <input
              id="reg-email"
              v-model="registerForm.email"
              type="email"
              placeholder="email@example.com"
              required
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <div class="space-y-1">
            <label for="reg-password" class="text-sm font-semibold text-slate-700">Mật khẩu</label>
            <input
              id="reg-password"
              v-model="registerForm.password"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              required
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <p v-if="registerForm.error" class="rounded-lg bg-rose-50 px-3 py-2 text-center text-xs font-semibold text-rose-600">
            {{ registerForm.error }}
          </p>
          <p v-if="registerForm.success" class="rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-600">
            {{ registerForm.success }}
          </p>
          <button
            type="submit"
            class="w-full rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Đăng ký tài khoản
          </button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center"><span class="w-full border-t border-slate-100"></span></div>
          <div class="relative flex justify-center text-xs uppercase tracking-wider font-bold text-slate-400">
            <span class="bg-white px-2">Hoặc</span>
          </div>
        </div>

        <button
          @click="handleGoogleLogin"
          class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
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
