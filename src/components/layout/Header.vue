<template>
  <!-- 1. HORIZONTAL TOP HEADER (Visible always on mobile, and on desktop only when NOT scrolled) -->
  <header
    class="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 transition-all duration-500 transform"
    :class="[
      { 'pt-2': scrolled },
      scrolled 
        ? 'md:opacity-0 md:pointer-events-none md:-translate-y-10' 
        : 'md:opacity-100 md:translate-y-0'
    ]"
  >
    <div
      class="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-[2rem] px-6 py-2 transition-all duration-500"
      :class="[
        scrolled 
          ? (plan === 'promax' ? 'bg-white/70 backdrop-blur-3xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] mt-2' : 'bg-white/80 backdrop-blur-2xl border-white/60 shadow-lg shadow-indigo-500/5') 
          : (plan === 'promax' ? 'bg-white/40 backdrop-blur-xl border border-white/40 mt-3' : 'bg-white border border-slate-100 shadow-md shadow-slate-200/30')
      ]"
    >
      <!-- Aurora Glow behind Header for ProMax -->
      <div v-if="plan === 'promax'" class="absolute -inset-2 bg-gradient-to-r from-indigo-500/10 via-pink-500/10 to-amber-500/10 blur-2xl opacity-40 -z-10 animate-pulse rounded-[2rem]"></div>

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="relative">
          <div :class="[
            'absolute -inset-2 rounded-full blur-xl transition-all duration-700 opacity-0 group-hover:opacity-100',
            plan === 'promax' ? 'bg-gradient-to-tr from-indigo-400 via-pink-400 to-amber-400 animate-spin-slow' : 'bg-indigo-500/20'
          ]"></div>
          <img
            src="@/asset/logo.png"
            alt="Logo"
            class="relative h-10 w-10 rounded-xl shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-[5deg]"
          />
        </div>
        <div>
          <p :class="['m-0 text-xl font-bold tracking-tight transition-all duration-500', plan === 'promax' ? 'bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-600 bg-clip-text text-transparent' : 'text-slate-900']">{{ appName }}</p>
        </div>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden items-center gap-1 md:flex">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link group relative inline-flex items-center gap-2.5 rounded-xl px-4 py-2 text-[13px] font-bold transition-all duration-500"
          :class="plan === 'promax' ? 'text-slate-500 hover:text-slate-900' : 'text-slate-600 hover:text-indigo-600'"
        >
          <span :class="['absolute inset-0 rounded-xl transition-all duration-500', plan === 'promax' ? 'group-hover:bg-gradient-to-r group-hover:from-indigo-500/5 group-hover:to-pink-500/5 border border-transparent group-hover:border-indigo-500/10' : 'group-hover:bg-indigo-50']"></span>
          <i :class="['fa-solid text-[10px] relative z-10 transition-transform duration-500 group-hover:scale-125', item.icon, plan === 'promax' ? 'text-indigo-500 group-hover:text-pink-500' : 'text-indigo-400']" aria-hidden="true"></i>
          <span class="relative z-10 uppercase tracking-wider">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Desktop Auth -->
      <div class="hidden items-center gap-3 md:flex">
        <template v-if="auth.isAuthenticated">
          <!-- Notification Bell -->
          <NotificationBell />

          <div class="relative" ref="userMenuContainer">
            <button
              @click.stop="userMenuOpen = !userMenuOpen"
              class="group/profile flex items-center gap-3 rounded-xl px-3.5 py-2 transition-all duration-500"
              :class="plan === 'promax' 
                ? 'bg-white/80 backdrop-blur-xl border border-indigo-200 text-slate-800 shadow-xl hover:scale-105' 
                : 'border-indigo-100 bg-indigo-50/50 hover:border-indigo-200 hover:bg-indigo-50'"
            >
              <div class="relative h-8 w-8 rounded-full flex items-center justify-center overflow-hidden border border-white/20">
                <img v-if="auth.user?.avatar" :src="resolveImageUrl(auth.user.avatar)" class="h-full w-full object-cover" />
                <span v-else class="text-xs font-black text-white uppercase">{{ auth.user?.username?.[0] }}</span>
              </div>
              <div class="flex flex-col items-start -gap-1">
                <span :class="['text-[14px] font-bold transition-colors', plan === 'promax' ? 'text-slate-900' : 'text-slate-800']">{{ auth.user?.username || 'Học viên' }}</span>
                <span v-if="auth.user?.planName" :class="[
                  'text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md shadow-sm',
                  getPlanBadgeClass(auth.user.planName)
                ]">
                  {{ auth.user.planName }}
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <!-- ProMax Fire Streak - Always Visible -->
                <div v-if="auth.user?.currentStreak !== undefined" :class="[
                  'flex items-center gap-1.2 px-1.5 py-0.5 rounded-full text-[9px] font-black transition-all shadow-sm',
                  auth.user?.activeToday 
                    ? (plan === 'promax' ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white animate-pulse' : 'bg-orange-500 text-white')
                    : 'bg-slate-100 text-slate-400',
                  getFireColorClass(auth.user?.fireLevel)
                ]">
                  <i :class="['fa-solid fa-fire text-[8px]', auth.user?.activeToday ? 'animate-bounce' : '']"></i>
                  <span>{{ auth.user?.currentStreak || 0 }}</span>
                </div>
              </div>
              <i :class="['fa-solid fa-chevron-down text-[9px] transition-transform duration-500', userMenuOpen ? 'rotate-180' : '', plan === 'promax' ? 'text-indigo-400' : 'text-slate-400']"></i>
            </button>

            <!-- User Dropdown Menu -->
            <transition
              enter-active-class="transition ease-out duration-300"
              enter-from-class="transform opacity-0 scale-95 -translate-y-2"
              enter-to-class="transform opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-200"
              leave-from-class="transform opacity-100 scale-100 translate-y-0"
              leave-to-class="transform opacity-0 scale-95 -translate-y-2"
            >
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-3 w-72 overflow-hidden rounded-[2rem] p-1.5 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 bg-white border border-slate-100"
                :class="plan === 'promax' ? 'bg-white/80 backdrop-blur-3xl border border-white' : 'bg-white border border-slate-100'"
              >
                <!-- Liquid Border for ProMax Menu -->
                <div v-if="plan === 'promax'" class="absolute inset-0 rounded-[2rem] p-[1.5px] -z-10 bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 animate-gradient-shift opacity-30"></div>

                <div class="px-5 py-4 border-b border-slate-100/50">
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Số dư tài khoản</p>
                  <div class="flex items-center gap-2">
                    <div :class="['p-1.5 rounded-lg', plan === 'promax' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-slate-100 text-slate-600']">
                      <i class="fa-solid fa-wallet text-xs"></i>
                    </div>
                    <p :class="['text-lg font-black tracking-tight', plan === 'promax' ? 'bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent' : 'text-slate-900']">
                      {{ formatCurrency(auth.user?.balance) }}
                    </p>
                  </div>
                </div>

                <div class="p-2 space-y-1">
                  <router-link
                    v-for="item in dropdownLinks"
                    :key="item.to"
                    :to="item.to"
                    @click="userMenuOpen = false"
                    class="group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300"
                    :class="plan === 'promax' ? 'hover:bg-white/50' : 'hover:bg-indigo-50/50'"
                  >
                    <!-- Hover Sweep for ProMax -->
                    <div v-if="plan === 'promax'" class="absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100">
                      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-700"></div>
                    </div>

                    <div :class="[
                      'h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm',
                      plan === 'promax' ? 'bg-white border border-slate-100 group-hover:border-indigo-200' : 'bg-slate-50'
                    ]">
                      <i :class="['fa-solid', item.icon, 'text-sm transition-colors', plan === 'promax' ? 'text-indigo-500 group-hover:text-pink-500' : 'text-slate-500 group-hover:text-indigo-600']"></i>
                    </div>
                    <span :class="['text-[13px] font-bold transition-colors', plan === 'promax' ? 'text-slate-600 group-hover:text-slate-900' : 'text-slate-600 group-hover:text-indigo-600']">
                      {{ item.label }}
                    </span>
                  </router-link>
                </div>

                <div class="p-2 mt-1 pt-1 border-t border-slate-100/50">
                  <button
                    @click="logout"
                    class="group w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-rose-50"
                  >
                    <div class="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-rose-100">
                      <i class="fa-solid fa-right-from-bracket text-sm text-rose-500"></i>
                    </div>
                    <span class="text-[13px] font-bold text-rose-500">Đăng xuất hệ thống</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </template>
        <template v-else>
          <button
            @click="showAuthPopover = true"
            class="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.03] active:scale-95"
          >
            <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full skew-x-12"></span>
            <i class="fa-solid fa-right-to-bracket text-xs relative z-10" aria-hidden="true"></i>
            <span class="relative z-10">Đăng nhập</span>
          </button>
        </template>
      </div>

      <!-- Mobile menu toggle -->
      <button
        @click.stop="mobileOpen = !mobileOpen"
        class="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 md:hidden active:scale-90"
        aria-label="Mở menu"
      >
        <i :class="['fa-solid text-sm transition-all duration-500', mobileOpen ? 'fa-xmark rotate-180' : 'fa-bars']" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-3 opacity-0 scale-[0.97]"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-3 opacity-0 scale-[0.97]"
    >
      <div
        v-if="mobileOpen"
        class="relative mx-auto mt-2 w-full max-w-7xl max-h-[calc(100vh-110px)] overflow-y-auto rounded-2xl border border-white/80 bg-white/95 p-3 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl md:hidden custom-scrollbar"
      >
        <nav class="grid gap-1">
          <router-link
            v-for="item in navItems"
            :key="`m-${item.to}`"
            :to="item.to"
            class="inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 [&.router-link-exact-active]:bg-indigo-50 [&.router-link-exact-active]:text-indigo-600"
            @click="mobileOpen = false"
          >
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-colors [.router-link-exact-active_&]:bg-indigo-100">
              <i :class="['fa-solid text-xs', item.icon]" aria-hidden="true"></i>
            </span>
            {{ item.label }}
          </router-link>
        </nav>

        <div class="mt-3 border-t border-slate-100 pt-3">
          <template v-if="auth.isAuthenticated">
            <div class="flex items-center justify-between mb-4 px-2">
              <h3 class="m-0 text-sm font-black text-slate-900">Trung tâm cá nhân</h3>
              <NotificationBell />
            </div>

            <div class="px-4 py-4 mb-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <p class="m-0 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Số dư tài khoản</p>
              <p class="m-0 mt-1 text-xl font-black text-slate-900 flex items-center gap-2">
                <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px]">
                  <i class="fa-solid fa-coins"></i>
                </span>
                {{ formatCurrency(auth.user?.balance || 0) }}
              </p>
            </div>
            
            <div class="px-4 py-3 mb-3 flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div class="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-sm overflow-hidden">
                <img v-if="auth.user?.avatar" :src="resolveImageUrl(auth.user.avatar)" class="h-full w-full object-cover" />
                <span v-else class="text-sm font-bold text-white uppercase">{{ auth.user?.username?.[0] }}</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="m-0 text-sm font-bold text-slate-900">{{ auth.user?.username || 'Học viên' }}</p>
                  <span v-if="auth.user?.planName" :class="['px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider shadow-sm', getPlanBadgeClass(auth.user.planName)]">
                    {{ auth.user.planName }}
                  </span>
                  <div v-if="auth.user?.activeToday" :class="['flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 text-[10px] font-black', getFireColorClass(auth.user?.fireLevel)]">
                    <i class="fa-solid fa-fire animate-pulse"></i>
                    <span>{{ auth.user?.currentStreak || 0 }} ngày</span>
                  </div>
                </div>
                <p class="m-0 text-[10px] text-slate-400 font-medium">Đang trực tuyến</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-1">
              <router-link
                v-for="link in dropdownLinks"
                :key="`mobile-${link.to}`"
                :to="link.to"
                @click="mobileOpen = false"
                class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-indigo-50 transition-colors"
              >
                <div :class="['flex h-8 w-8 items-center justify-center rounded-lg', link.bg]">
                  <i :class="['fa-solid text-xs', link.icon, link.color]"></i>
                </div>
                {{ link.label }}
              </router-link>
            </div>

            <button
              @click="logout"
              class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 active:scale-95"
            >
              <i class="fa-solid fa-right-from-bracket text-xs" aria-hidden="true"></i>
              Đăng xuất
            </button>
          </template>
          <template v-else>
            <button
              @click="openAuthOnMobile"
              class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 active:scale-95"
            >
              <i class="fa-solid fa-right-to-bracket text-xs" aria-hidden="true"></i>
              Đăng nhập
            </button>
          </template>
        </div>
      </div>
    </transition>
  </header>

  <!-- 2. VERTICAL FLOATING SIDEBAR DOCK (Visible ONLY on desktop when scrolled) -->
  <aside
    class="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 w-20 h-[calc(100vh-6rem)] max-h-[680px] transition-all duration-500 transform"
    :class="[
      scrolled 
        ? 'opacity-100 translate-x-0 pointer-events-auto' 
        : 'opacity-0 -translate-x-10 pointer-events-none'
    ]"
  >
    <!-- Dock Content -->
    <div
      class="relative flex flex-col h-full w-full py-6 px-3 justify-between items-center rounded-[2.5rem] border transition-all duration-500 shadow-xl"
      :class="[
        plan === 'promax' ? 'bg-white/70 backdrop-blur-3xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]' : 'bg-white/80 backdrop-blur-2xl border-white/60 shadow-lg shadow-indigo-500/5'
      ]"
    >
      <!-- Aurora Glow behind Dock for ProMax -->
      <div v-if="plan === 'promax'" class="absolute -inset-2 bg-gradient-to-r from-indigo-500/10 via-pink-500/10 to-amber-500/10 blur-2xl opacity-40 -z-10 animate-pulse rounded-[2.5rem]"></div>

      <!-- Dock Logo -->
      <router-link to="/" class="flex flex-col gap-1.5 w-full items-center justify-center group relative">
        <div class="relative">
          <div :class="[
            'absolute -inset-2 rounded-full blur-xl transition-all duration-700 opacity-0 group-hover:opacity-100',
            plan === 'promax' ? 'bg-gradient-to-tr from-indigo-400 via-pink-400 to-amber-400 animate-spin-slow' : 'bg-indigo-500/20'
          ]"></div>
          <img
            src="@/asset/logo.png"
            alt="Logo"
            class="relative h-9 w-9 rounded-xl shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-[5deg]"
          />
        </div>
        <!-- Logo Tooltip -->
        <div class="absolute left-14 z-50 whitespace-nowrap opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pl-4">
          <div class="bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-xl border border-white/10">
            {{ appName }}
          </div>
        </div>
      </router-link>

      <!-- Dock Nav Links -->
      <nav class="flex flex-col w-full gap-2 items-center">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link group relative inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500"
          :class="plan === 'promax' ? 'text-slate-500 hover:text-slate-900' : 'text-slate-600 hover:text-indigo-600'"
        >
          <span :class="['absolute inset-0 rounded-2xl transition-all duration-500', plan === 'promax' ? 'group-hover:bg-gradient-to-r group-hover:from-indigo-500/5 group-hover:to-pink-500/5 border border-transparent group-hover:border-indigo-500/10' : 'group-hover:bg-indigo-50']"></span>
          <i :class="['fa-solid text-[16px] relative z-10 transition-transform duration-500 group-hover:scale-125', item.icon, plan === 'promax' ? 'text-indigo-500 group-hover:text-pink-500' : 'text-indigo-400']" aria-hidden="true"></i>
          
          <!-- Tooltip on hover -->
          <div class="absolute left-14 z-50 whitespace-nowrap opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pl-4">
            <div class="bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-xl border border-white/10 flex items-center gap-2">
              <i :class="['fa-solid text-[9px] text-indigo-400', item.icon]"></i>
              {{ item.label }}
            </div>
          </div>
        </router-link>
      </nav>

      <!-- Dock Auth Section -->
      <div class="flex flex-col w-full gap-3 items-center">
        <template v-if="auth.isAuthenticated">
          <!-- Notification Bell in Dock -->
          <NotificationBell align="left-side" />

          <div class="relative w-full flex justify-center" ref="userMenuContainer">
            <button
              @click.stop="userMenuOpen = !userMenuOpen"
              class="group/profile flex items-center justify-center w-12 h-12 p-0 rounded-2xl transition-all duration-500 relative"
              :class="plan === 'promax' 
                ? 'bg-white/80 backdrop-blur-xl border border-indigo-200 text-slate-800 shadow-xl hover:scale-105' 
                : 'border-indigo-100 bg-indigo-50/50 hover:border-indigo-200 hover:bg-indigo-50'"
            >
              <div class="relative h-8 w-8 rounded-full flex items-center justify-center overflow-hidden border border-white/20 shrink-0">
                <img v-if="auth.user?.avatar" :src="resolveImageUrl(auth.user.avatar)" class="h-full w-full object-cover" />
                <span v-else class="text-xs font-black text-white uppercase">{{ auth.user?.username?.[0] }}</span>
              </div>

              <!-- Profile Tooltip when scrolled -->
              <div 
                v-if="!userMenuOpen"
                class="absolute left-14 z-50 whitespace-nowrap opacity-0 -translate-x-2 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-x-0 transition-all duration-300 pl-4"
              >
                <div class="bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-xl border border-white/10 flex flex-col items-start gap-0.5">
                  <span>{{ auth.user?.username || 'Học viên' }}</span>
                  <span v-if="auth.user?.planName" class="text-[8px] font-black text-indigo-300 tracking-widest">{{ auth.user.planName }}</span>
                </div>
              </div>
            </button>

            <!-- User Dropdown Menu -->
            <transition
              enter-active-class="transition ease-out duration-300"
              enter-from-class="transform opacity-0 scale-95 -translate-y-2"
              enter-to-class="transform opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-200"
              leave-from-class="transform opacity-100 scale-100 translate-y-0"
              leave-to-class="transform opacity-0 scale-95 -translate-y-2"
            >
              <div
                v-if="userMenuOpen"
                class="absolute overflow-hidden rounded-[2rem] p-1.5 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 w-72 left-[calc(100%+0.5rem)] bottom-0 origin-left-bottom"
                :class="plan === 'promax' ? 'bg-white/80 backdrop-blur-3xl border border-white' : 'bg-white border border-slate-100'"
              >
                <!-- Liquid Border for ProMax Menu -->
                <div v-if="plan === 'promax'" class="absolute inset-0 rounded-[2rem] p-[1.5px] -z-10 bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 animate-gradient-shift opacity-30"></div>

                <div class="px-5 py-4 border-b border-slate-100/50">
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Số dư tài khoản</p>
                  <div class="flex items-center gap-2">
                    <div :class="['p-1.5 rounded-lg', plan === 'promax' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-slate-100 text-slate-600']">
                      <i class="fa-solid fa-wallet text-xs"></i>
                    </div>
                    <p :class="['text-lg font-black tracking-tight', plan === 'promax' ? 'bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent' : 'text-slate-900']">
                      {{ formatCurrency(auth.user?.balance) }}
                    </p>
                  </div>
                </div>

                <div class="p-2 space-y-1">
                  <router-link
                    v-for="item in dropdownLinks"
                    :key="item.to"
                    :to="item.to"
                    @click="userMenuOpen = false"
                    class="group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300"
                    :class="plan === 'promax' ? 'hover:bg-white/50' : 'hover:bg-indigo-50/50'"
                  >
                    <!-- Hover Sweep for ProMax -->
                    <div v-if="plan === 'promax'" class="absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100">
                      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-700"></div>
                    </div>

                    <div :class="[
                      'h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm',
                      plan === 'promax' ? 'bg-white border border-slate-100 group-hover:border-indigo-200' : 'bg-slate-50'
                    ]">
                      <i :class="['fa-solid', item.icon, 'text-sm transition-colors', plan === 'promax' ? 'text-indigo-500 group-hover:text-pink-500' : 'text-slate-500 group-hover:text-indigo-600']"></i>
                    </div>
                    <span :class="['text-[13px] font-bold transition-colors', plan === 'promax' ? 'text-slate-600 group-hover:text-slate-900' : 'text-slate-600 group-hover:text-indigo-600']">
                      {{ item.label }}
                    </span>
                  </router-link>
                </div>

                <div class="p-2 mt-1 pt-1 border-t border-slate-100/50">
                  <button
                    @click="logout"
                    class="group w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-rose-50"
                  >
                    <div class="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-rose-100">
                      <i class="fa-solid fa-right-from-bracket text-sm text-rose-500"></i>
                    </div>
                    <span class="text-[13px] font-bold text-rose-500">Đăng xuất hệ thống</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </template>
        <template v-else>
          <button
            @click="showAuthPopover = true"
            class="group relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-500 hover:shadow-xl hover:scale-[1.05] active:scale-95 shrink-0"
          >
            <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full skew-x-12"></span>
            <i class="fa-solid fa-right-to-bracket text-xs relative z-10" aria-hidden="true"></i>

            <!-- Login Tooltip -->
            <div class="absolute left-14 z-50 whitespace-nowrap opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pl-4">
              <div class="bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-xl border border-white/10">
                Đăng nhập
              </div>
            </div>
          </button>
        </template>
      </div>
    </div>
  </aside>

  <AuthPopover v-if="showAuthPopover" @close="showAuthPopover = false" />
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { APP_NAME } from '@/config';
import { getUserStreak, getUserProfile } from '@/services/userService';
import apiClient from '@/services/api';
import AuthPopover from '@/components/auth/AuthPopover.vue';
import NotificationBell from '@/components/social/NotificationBell.vue';

const appName = APP_NAME;
const auth = useAuthStore();
const plan = computed(() => (auth.user?.planName || 'free').toLowerCase());
const router = useRouter();
const route = useRoute();

const showAuthPopover = ref(false);
const mobileOpen = ref(false);
const scrolled = ref(false);
const userMenuContainer = ref(null);

const navItems = [
  { to: '/', label: 'Trang chủ', icon: 'fa-house' },
  { to: '/social', label: 'Cộng đồng', icon: 'fa-rss' },
  { to: '/exams', label: 'Bài thi', icon: 'fa-file-pen' },
  { to: '/attempts', label: 'Lịch sử làm bài', icon: 'fa-clock-rotate-left' },
  { to: '/pricing', label: 'Các gói nâng cấp', icon: 'fa-rocket' },
];

const userMenuOpen = ref(false);

const dropdownLinks = [
  { to: '/profile', label: 'Thông tin cá nhân', icon: 'fa-user-gear', bg: 'bg-indigo-50', color: 'text-indigo-600' },
  { to: '/exams/random', label: 'Tạo đề ngẫu nhiên', icon: 'fa-shuffle', bg: 'bg-violet-50', color: 'text-violet-600' },
  { to: '/pricing', label: 'Nâng cấp tài khoản', icon: 'fa-rocket', bg: 'bg-rose-50', color: 'text-rose-600' },
  { to: '/deposit', label: 'Nạp tiền vào ví', icon: 'fa-wallet', bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { to: '/transactions', label: 'Lịch sử giao dịch', icon: 'fa-receipt', bg: 'bg-amber-50', color: 'text-amber-600' },
  { to: '/attempts', label: 'Lịch sử làm bài', icon: 'fa-clock-rotate-left', bg: 'bg-blue-50', color: 'text-blue-600' },
  { to: '/evaluation', label: 'Đánh giá năng lực', icon: 'fa-chart-pie', bg: 'bg-purple-50', color: 'text-purple-600' },
];

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveImageUrl = (url) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

const getPlanBadgeClass = (name) => {
  switch (name?.toUpperCase()) {
    case 'PRO': return 'bg-sky-500 text-white shadow-sky-200';
    case 'PROMAX': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-200';
    default: return 'bg-slate-100 text-slate-500 border border-slate-200';
  }
};

const getFireColorClass = (level) => {
  if (!level || level === 0) return 'text-slate-400';
  if (level === 1) return 'text-amber-500';
  if (level === 2) return 'text-orange-500';
  if (level === 3) return 'text-rose-500';
  if (level === 4) return 'text-red-500';
  return 'text-red-600';
};

const fetchUserData = async () => {
  if (!auth.isAuthenticated) return;
  try {
    const [streakRes, profileRes, planRes] = await Promise.all([
      getUserStreak(),
      getUserProfile(),
      apiClient.get('/plans/my-plan')
    ]);
    
    const streak = streakRes.data?.data;
    const profile = profileRes.data?.data;
    const plan = planRes.data?.data?.plan;
    
    if (streak || profile || plan) {
      auth.setUser({
        fireLevel: streak?.fireLevel,
        activeToday: streak?.activeToday,
        currentStreak: streak?.currentStreak,
        avatar: profile?.avatar,
        balance: profile?.balance,
        planName: plan?.name || 'FREE'
      });
    }
  } catch (err) {
    console.warn('Failed to fetch user data in header:', err);
  }
};

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

const handleClickOutside = (event) => {
  if (userMenuOpen.value && userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    userMenuOpen.value = false;
  }
  // Also close mobile menu if clicking outside the header
  if (mobileOpen.value && !event.target.closest('header')) {
    mobileOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('click', handleClickOutside);
  handleScroll();
  fetchUserData();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('click', handleClickOutside);
});

watch(
  () => route.fullPath,
  () => { 
    mobileOpen.value = false; 
    userMenuOpen.value = false;
  },
);

const openAuthOnMobile = () => {
  mobileOpen.value = false;
  showAuthPopover.value = true;
};

const logout = () => {
  auth.logout();
  mobileOpen.value = false;
  router.push('/');
};
</script>