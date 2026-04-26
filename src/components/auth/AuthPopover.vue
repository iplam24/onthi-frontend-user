<template>
  <div
    class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-md"
    @click.self="$emit('close')"
  >
    <div class="liquid-glass liquid-border w-full max-w-md text-blue-50">
      <div class="relative flex border-b border-white/20 bg-white/10 px-2 pt-2">
        <button
          :class="[
            'flex-1 rounded-t-xl px-3 py-2.5 text-sm font-semibold transition',
            formType === 'login' ? 'bg-white/20 text-white' : 'text-blue-100/70 hover:text-blue-50',
          ]"
          @click="formType = 'login'"
        >
          Đăng nhập
        </button>
        <button
          :class="[
            'flex-1 rounded-t-xl px-3 py-2.5 text-sm font-semibold transition',
            formType === 'register' ? 'bg-white/20 text-white' : 'text-blue-100/70 hover:text-blue-50',
          ]"
          @click="formType = 'register'"
        >
          Đăng ký
        </button>
        <button
          class="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 text-blue-100 transition hover:bg-white/25 hover:text-white"
          @click="$emit('close')"
          aria-label="Đóng"
        >
          ×
        </button>
      </div>

      <div class="space-y-5 p-5 sm:p-6">
        <form v-if="formType === 'login'" class="space-y-3" @submit.prevent="handleLogin">
          <div>
            <input
              id="login-username"
              v-model="loginForm.username"
              type="text"
              placeholder="Tên đăng nhập"
              required
              class="w-full rounded-xl border border-white/30 bg-white/12 px-4 py-3 text-sm text-white placeholder:text-blue-100/65 outline-none transition focus:border-sky-300/80 focus:bg-white/18"
            />
          </div>
          <div>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              placeholder="Mật khẩu"
              required
              class="w-full rounded-xl border border-white/30 bg-white/12 px-4 py-3 text-sm text-white placeholder:text-blue-100/65 outline-none transition focus:border-sky-300/80 focus:bg-white/18"
            />
          </div>
          <p v-if="loginForm.error" class="rounded-lg border border-rose-300/40 bg-rose-500/15 px-3 py-2 text-center text-sm text-rose-100">
            {{ loginForm.error }}
          </p>
          <button
            type="submit"
            class="w-full rounded-xl border border-sky-200/60 bg-gradient-to-r from-sky-400 to-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(59,130,246,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_34px_rgba(59,130,246,0.45)]"
          >
            Đăng nhập
          </button>
        </form>

        <form v-if="formType === 'register'" class="space-y-3" @submit.prevent="handleRegister">
          <div>
            <input
              id="reg-username"
              v-model="registerForm.username"
              type="text"
              placeholder="Tên đăng nhập"
              required
              class="w-full rounded-xl border border-white/30 bg-white/12 px-4 py-3 text-sm text-white placeholder:text-blue-100/65 outline-none transition focus:border-sky-300/80 focus:bg-white/18"
            />
          </div>
          <div>
            <input
              id="reg-email"
              v-model="registerForm.email"
              type="email"
              placeholder="Email"
              required
              class="w-full rounded-xl border border-white/30 bg-white/12 px-4 py-3 text-sm text-white placeholder:text-blue-100/65 outline-none transition focus:border-sky-300/80 focus:bg-white/18"
            />
          </div>
          <div>
            <input
              id="reg-password"
              v-model="registerForm.password"
              type="password"
              placeholder="Mật khẩu"
              required
              class="w-full rounded-xl border border-white/30 bg-white/12 px-4 py-3 text-sm text-white placeholder:text-blue-100/65 outline-none transition focus:border-sky-300/80 focus:bg-white/18"
            />
          </div>
          <p
            v-if="registerForm.error"
            class="rounded-lg border border-rose-300/40 bg-rose-500/15 px-3 py-2 text-center text-sm text-rose-100"
          >
            {{ registerForm.error }}
          </p>
          <p
            v-if="registerForm.success"
            class="rounded-lg border border-emerald-300/40 bg-emerald-500/15 px-3 py-2 text-center text-sm text-emerald-100"
          >
            {{ registerForm.success }}
          </p>
          <button
            type="submit"
            class="w-full rounded-xl border border-sky-200/60 bg-gradient-to-r from-sky-400 to-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(59,130,246,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_34px_rgba(59,130,246,0.45)]"
          >
            Đăng ký
          </button>
        </form>

        <div class="space-y-3">
          <div class="flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-blue-100/60">
            <span class="h-px flex-1 bg-white/25"></span>
            <span>hoặc</span>
            <span class="h-px flex-1 bg-white/25"></span>
          </div>
          <button
            @click="handleGoogleLogin"
            class="flex w-full items-center justify-center gap-3 rounded-xl border border-white/35 bg-white/12 px-4 py-2.5 text-sm font-semibold text-blue-50 transition hover:bg-white/20"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              class="h-[18px] w-[18px]"
            />
            Tiếp tục với Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { login, loginWithGoogle, register } from '@/services/authService';

const emit = defineEmits(['close']);
const auth = useAuthStore();
const formType = ref('login');

const loginForm = reactive({ username: '', password: '', error: null });
const registerForm = reactive({ username: '', email: '', password: '', error: null, success: null });

const handleLogin = async () => {
  try {
    const response = await login({ username: loginForm.username, password: loginForm.password });
    if (response.data.status === 200) {
      auth.login(response.data.data);
      emit('close');
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
    registerForm.error = 'Đã có lỗi xảy ra trong quá trình đăng ký.';
  }
};

const handleGoogleLogin = () => {
  loginWithGoogle();
};
</script>
