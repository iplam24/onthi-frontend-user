<template>
  <section class="space-y-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20 pt-6 animate-fade-in-up">
    
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center lg:items-stretch gap-10 min-h-[300px]">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]"></div>
      
      <!-- Avatar Section -->
      <div class="relative flex-shrink-0 flex flex-col items-center justify-center gap-6">
        <div class="relative" ref="avatarMenuContainer">
          <div 
            @click.stop="!isPublicProfile && toggleAvatarMenu()"
            class="group/avatar relative h-36 w-36 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-indigo-500/20 border-4 border-slate-800 relative z-10 overflow-hidden transition-all"
            :class="!isPublicProfile ? 'cursor-pointer hover:scale-105 active:scale-95' : ''"
          >
            <img v-if="previewUrl || profile?.avatar" :src="resolveImageUrl(previewUrl || profile?.avatar)" class="h-full w-full object-cover" />
            <span v-else class="text-6xl font-black text-white uppercase">{{ profile?.username?.[0] || '?' }}</span>
            
            <div v-if="!isPublicProfile" class="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
              <i class="fa-solid fa-camera text-white text-2xl"></i>
            </div>

            <div v-if="profile?.streak?.activeToday" class="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-slate-800 z-20" title="Đã học hôm nay">
              <i class="fa-solid fa-fire text-orange-500 text-xl animate-pulse"></i>
            </div>
          </div>

          <!-- Avatar Menu -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
          >
            <div 
              v-if="showAvatarMenu" 
              class="absolute left-1/2 top-full z-30 mt-3 w-48 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl"
            >
              <button @click="openLargePreview" class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-black text-slate-300 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
                <i class="fa-solid fa-eye w-4"></i> Xem ảnh
              </button>
              <button @click="triggerAvatarUpload" class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-black text-slate-300 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
                <i class="fa-solid fa-image w-4"></i> Đổi ảnh
              </button>
            </div>
          </transition>
        </div>

        <input ref="avatarInput" type="file" class="hidden" accept="image/*" @change="handleAvatarChange" />
        <div class="text-center">
          <div class="flex flex-col items-center gap-2">
            <h1 class="m-0 text-3xl font-black tracking-tight text-white leading-none">{{ displayName }}</h1>
            <div v-if="profile" class="flex items-center gap-4 mt-2">
              <div class="text-center">
                <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] m-0">Bạn bè</p>
                <p class="text-base font-black text-white m-0">{{ stats.friends || 0 }}</p>
              </div>
              <div class="h-6 w-px bg-slate-800"></div>
              <div class="text-center">
                <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] m-0">Người theo dõi</p>
                <p class="text-base font-black text-white m-0">{{ stats.followers }}</p>
              </div>
              <div class="h-6 w-px bg-slate-800"></div>
              <div class="text-center">
                <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] m-0">Đang theo dõi</p>
                <p class="text-base font-black text-white m-0">{{ stats.following }}</p>
              </div>
            </div>
            <p v-else class="m-0 text-xs font-bold text-slate-400 uppercase tracking-widest">{{ auth.user?.email || '' }}</p>
          </div>
          
          <div v-if="isPublicProfile" class="flex items-center gap-3 mt-6 justify-center">
            <button 
              @click="handleFollowAction"
              :disabled="followLoading"
              class="px-8 py-3 rounded-xl text-xs font-black transition-all shadow-xl flex items-center gap-2 uppercase tracking-widest"
              :class="isFollowingUser ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'"
            >
              <i v-if="followLoading" class="fa-solid fa-circle-notch animate-spin"></i>
              <i v-else :class="isFollowingUser ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'"></i>
              {{ isFollowingUser ? 'Đang theo dõi' : 'Theo dõi' }}
            </button>
            <button 
              @click="showGiftModal = true"
              class="px-8 py-3 rounded-xl bg-white/10 text-white text-xs font-black hover:bg-white/20 transition-all border border-white/5 uppercase tracking-widest"
            >
              <i class="fa-solid fa-gift mr-2"></i> Tặng quà
            </button>
            <button 
              @click="startChat"
              class="px-8 py-3 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 border border-indigo-500/30 uppercase tracking-widest"
            >
              <i class="fa-solid fa-comment-dots mr-2"></i> Nhắn tin
            </button>
          </div>
        </div>
      </div>

      <!-- Streak Highlights -->
      <div class="flex-1 w-full grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 content-center self-center">
        <!-- Current Streak -->
        <div class="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all hover:bg-white/10">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 m-0">Chuỗi ngày</p>
          <div class="mt-2 flex items-center gap-3">
            <i class="fa-solid fa-bolt text-amber-400 text-xl"></i>
            <span class="text-3xl font-black text-white tabular-nums leading-none">{{ profile?.streak?.currentStreak || 0 }}</span>
          </div>
        </div>
        <!-- Longest Streak -->
        <div class="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all hover:bg-white/10">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 m-0">Kỷ lục</p>
          <div class="mt-2 flex items-center gap-3">
            <i class="fa-solid fa-crown text-amber-500 text-xl"></i>
            <span class="text-3xl font-black text-white tabular-nums leading-none">{{ profile?.streak?.longestStreak || 0 }}</span>
          </div>
        </div>
        <!-- Fire Level -->
        <div class="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center col-span-2 transition-all hover:bg-white/10">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 m-0">Mức độ giữ lửa</p>
          <div class="mt-4 w-full px-2">
            <div class="flex justify-between mb-2">
              <span class="text-[10px] font-black uppercase tracking-widest" :class="getFireColorClass(profile?.streak?.fireLevel)">{{ getFireLabel(profile?.streak?.fireLevel) }}</span>
              <span class="text-[10px] text-slate-500 font-black uppercase tracking-widest">Lvl {{ profile?.streak?.fireLevel || 0 }}/5</span>
            </div>
            <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-[1px]">
               <div class="h-full rounded-full transition-all duration-1000 shadow-lg" :class="getFireBgClass(profile?.streak?.fireLevel)" :style="{ width: `${((profile?.streak?.fireLevel || 0) / 5) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex items-center gap-10 border-b border-slate-100 px-6 sm:px-12">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative"
        :class="activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'"
      >
        {{ tab.name }}
        <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>
      </button>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
      <div class="relative h-16 w-16">
        <div class="absolute inset-0 rounded-2xl border-4 border-indigo-100"></div>
        <div class="absolute inset-0 rounded-2xl border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
      <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Đang tải hồ sơ...</p>
    </div>
    
    <div v-else-if="error" class="bg-white p-16 text-center rounded-2xl border border-rose-100 shadow-xl">
      <div class="inline-flex h-20 w-20 rounded-3xl bg-rose-50 items-center justify-center text-rose-500 mb-6">
        <i class="fa-solid fa-circle-exclamation text-4xl"></i>
      </div>
      <p class="text-xl font-black text-slate-900 tracking-tight">{{ error }}</p>
      <button @click="fetchProfile" class="mt-6 px-10 py-3 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg">Thử lại</button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content Area -->
      <div class="lg:col-span-2 min-h-[600px]">
        <transition 
          name="tab-fade" 
          mode="out-in"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
        >
          <div :key="activeTab" class="space-y-8">
            <!-- Tab 1: Feed -->
            <div v-if="activeTab === 'feed'" class="space-y-6">
              <PostCreator v-if="!isPublicProfile" @success="refreshPostList" />
              <PostList :user-id="targetUserId" ref="postListRef" />
            </div>

            <!-- Tab: Friends -->
            <div v-if="activeTab === 'friends'" class="space-y-6">
              <div class="card-elevated overflow-hidden border border-slate-100 bg-white">
                <div class="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 class="m-0 text-xl font-black text-slate-900 tracking-tight">Danh sách bạn bè</h2>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Những người bạn cùng học tập</p>
                  </div>
                  <div class="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <i class="fa-solid fa-user-group text-lg"></i>
                  </div>
                </div>

                <div class="p-8">
                  <div v-if="friendsLoading" class="flex flex-col items-center justify-center py-20">
                    <div class="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div v-else-if="friendsList.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
                    <div class="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
                      <i class="fa-solid fa-user-friends text-4xl"></i>
                    </div>
                    <p class="text-lg font-black text-slate-900 m-0">Chưa có bạn bè</p>
                    <p class="text-xs font-bold text-slate-400 mt-2">Hãy theo dõi thêm nhiều người để trở thành bạn bè nhé!</p>
                  </div>
                  <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-for="friend in friendsList" :key="friend.id" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-indigo-100 transition-all group">
                      <router-link :to="`/profile/${friend.id}`" class="flex items-center gap-4 flex-1">
                        <div class="h-12 w-12 rounded-xl bg-indigo-500 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                          <img v-if="friend.avatar" :src="resolveImageUrl(friend.avatar)" class="h-full w-full object-cover" />
                          <div v-else class="h-full w-full flex items-center justify-center text-white font-black text-xl">{{ friend.username[0].toUpperCase() }}</div>
                        </div>
                        <div>
                          <p class="m-0 text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{{ friend.fullName || friend.username }}</p>
                          <p class="m-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">@{{ friend.username }}</p>
                        </div>
                      </router-link>
                      <button v-if="!isPublicProfile" @click="confirmUnfollow(friend.id, friend.fullName || friend.username, 'friends')" class="h-9 w-9 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center shadow-sm" title="Hủy kết bạn (Xóa cả hai phía)">
                        <i class="fa-solid fa-user-minus text-xs"></i>
                      </button>
                    </div>
                  </div>

                  <div v-if="friendsPagination.totalPages > 1" class="mt-8 pt-8 border-t border-slate-50 flex justify-center gap-2">
                    <button 
                      v-for="p in friendsPagination.totalPages" 
                      :key="p"
                      @click="fetchFriends(p-1)"
                      class="h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black transition-all"
                      :class="friendsPagination.page === p-1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'"
                    >
                      {{ p }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
    
            <!-- Tab: Followers -->
            <div v-if="activeTab === 'followers'" class="space-y-6">
              <div class="card-elevated overflow-hidden border border-slate-100 bg-white">
                <div class="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 class="m-0 text-xl font-black text-slate-900 tracking-tight">Người theo dõi</h2>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Những người đang theo dõi bạn</p>
                  </div>
                  <div class="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <i class="fa-solid fa-users text-lg"></i>
                  </div>
                </div>
                <div class="p-8">
                  <div v-if="socialListLoading" class="flex flex-col items-center justify-center py-20">
                    <div class="h-10 w-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div v-else-if="followersList.length === 0" class="text-center py-20">
                    <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chưa có người theo dõi nào</p>
                  </div>
                  <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-for="user in followersList" :key="user.id" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-rose-100 transition-all group">
                      <router-link :to="`/profile/${user.id}`" class="flex items-center gap-4 flex-1">
                        <div class="h-12 w-12 rounded-xl bg-slate-200 overflow-hidden">
                          <img v-if="user.avatar" :src="resolveImageUrl(user.avatar)" class="h-full w-full object-cover" />
                          <div v-else class="h-full w-full flex items-center justify-center text-slate-400 font-black">{{ user.username[0].toUpperCase() }}</div>
                        </div>
                        <div>
                          <p class="m-0 text-sm font-black text-slate-900 group-hover:text-rose-600">{{ user.fullName || user.username }}</p>
                          <p class="m-0 text-[10px] font-bold text-slate-400">@{{ user.username }}</p>
                        </div>
                      </router-link>
                      <button v-if="!isPublicProfile" @click="confirmUnfollow(user.id, user.fullName || user.username, 'followers')" class="h-9 w-9 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-500 flex items-center justify-center shadow-sm" title="Xóa người theo dõi này">
                        <i class="fa-solid fa-user-xmark text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab: Following -->
            <div v-if="activeTab === 'following'" class="space-y-6">
              <div class="card-elevated overflow-hidden border border-slate-100 bg-white">
                <div class="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 class="m-0 text-xl font-black text-slate-900 tracking-tight">Đang theo dõi</h2>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Những người bạn đang theo dõi</p>
                  </div>
                  <div class="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <i class="fa-solid fa-user-plus text-lg"></i>
                  </div>
                </div>
                <div class="p-8">
                  <div v-if="socialListLoading" class="flex flex-col items-center justify-center py-20">
                    <div class="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div v-else-if="followingList.length === 0" class="text-center py-20">
                    <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Bạn chưa theo dõi ai</p>
                  </div>
                  <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-for="user in followingList" :key="user.id" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-indigo-100 transition-all group">
                      <router-link :to="`/profile/${user.id}`" class="flex items-center gap-4 flex-1">
                        <div class="h-12 w-12 rounded-xl bg-slate-200 overflow-hidden">
                          <img v-if="user.avatar" :src="resolveImageUrl(user.avatar)" class="h-full w-full object-cover" />
                          <div v-else class="h-full w-full flex items-center justify-center text-slate-400 font-black">{{ user.username[0].toUpperCase() }}</div>
                        </div>
                        <div>
                          <p class="m-0 text-sm font-black text-slate-900 group-hover:text-indigo-600">{{ user.fullName || user.username }}</p>
                          <p class="m-0 text-[10px] font-bold text-slate-400">@{{ user.username }}</p>
                        </div>
                      </router-link>
                      <button @click="confirmUnfollow(user.id, user.fullName || user.username, 'following')" class="h-9 w-9 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-500 flex items-center justify-center shadow-sm">
                        <i class="fa-solid fa-user-minus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tab 2: Info/Edit -->
            <div v-if="activeTab === 'info'" class="space-y-8">
              <!-- Edit Form (Only for own profile) -->
              <div v-if="!isPublicProfile" class="card-elevated overflow-hidden border border-slate-100 bg-white">
                <div class="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 class="m-0 text-xl font-black text-slate-900 tracking-tight">Cài đặt hồ sơ</h2>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cập nhật thông tin cá nhân của bạn</p>
                  </div>
                  <div class="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <i class="fa-solid fa-user-gear text-lg"></i>
                  </div>
                </div>

                <div class="p-8">
                  <form @submit.prevent="handleUpdate" class="space-y-8">
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
      
                    <div class="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <p class="text-[10px] font-bold text-slate-400 italic">Lưu ý: Thông tin này sẽ hiển thị công khai trên hồ sơ của bạn.</p>
                      <button type="submit" :disabled="updating" class="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-indigo-600 text-white text-sm font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/25 disabled:opacity-50">
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
                <div class="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center gap-4">
                  <div class="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <i class="fa-solid fa-info text-xl"></i>
                  </div>
                  <div>
                    <h2 class="m-0 text-xl font-black text-slate-900 tracking-tight">Thông tin cá nhân</h2>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Về {{ displayName }}</p>
                  </div>
                </div>

                <div class="p-8 grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div class="group p-6 rounded-2xl bg-slate-50/50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all duration-300">
                    <div class="flex items-center gap-4 mb-4">
                      <div class="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-school"></i>
                      </div>
                      <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 m-0">Trường học</p>
                    </div>
                    <p class="text-lg font-black text-slate-800 m-0 leading-tight">{{ profile?.schoolName || 'Thông tin chưa cập nhật' }}</p>
                  </div>

                  <div class="group p-6 rounded-2xl bg-slate-50/50 border border-transparent hover:border-amber-100 hover:bg-white transition-all duration-300">
                    <div class="flex items-center gap-4 mb-4">
                      <div class="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-graduation-cap"></i>
                      </div>
                      <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 m-0">Khối / Lớp học</p>
                    </div>
                    <p class="text-lg font-black text-slate-800 m-0 leading-tight">{{ profile?.levelName || 'Thông tin chưa cập nhật' }}</p>
                  </div>

                  <div class="sm:col-span-2 group p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/50">
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
    
            <!-- Tab 3: Activity -->
            <div v-if="activeTab === 'activity'" class="space-y-6">
              <div class="card-elevated p-8 border border-slate-100 bg-white">
                <div class="flex items-center gap-4 mb-8">
                  <div class="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                    <i class="fa-solid fa-chart-line text-xl"></i>
                  </div>
                  <div>
                    <h2 class="m-0 text-xl font-black text-slate-900 tracking-tight">Nhật ký học tập</h2>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Dòng thời gian hoạt động</p>
                  </div>
                </div>
                <ActivityFeed :limit="null" :title="''" />
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-8">
        <!-- Academic Stats -->
        <div class="card-elevated overflow-hidden border border-slate-100 bg-white shadow-xl shadow-slate-200/20">
          <div class="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
            <h3 class="m-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thống kê học tập</h3>
          </div>
          <div class="p-6 space-y-6">
            <div class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-bolt"></i>
                </div>
                <span class="text-xs font-black text-slate-600 uppercase tracking-wider">Chuỗi ngày học</span>
              </div>
              <span class="text-xl font-black text-slate-900 tabular-nums">{{ profile?.streak?.currentStreak || 0 }}</span>
            </div>

            <div class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-fire-flame-curved"></i>
                </div>
                <span class="text-xs font-black text-slate-600 uppercase tracking-wider">Mức giữ lửa</span>
              </div>
              <span class="text-sm font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-slate-50" :class="getFireColorClass(profile?.streak?.fireLevel)">
                {{ getFireLabel(profile?.streak?.fireLevel) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Financial (Only own profile) -->
        <div v-if="!isPublicProfile" class="card-elevated overflow-hidden border-0 bg-slate-900 text-white relative group shadow-2xl shadow-indigo-900/20">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent pointer-events-none"></div>
          <div class="absolute -right-10 -bottom-10 h-32 w-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
          
          <div class="relative p-8">
            <div class="flex items-center justify-between mb-8">
              <div class="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <i class="fa-solid fa-wallet text-xl text-indigo-300"></i>
              </div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Số dư ví V-Edu</p>
            </div>
            
            <p class="text-3xl font-black mb-1 tabular-nums tracking-tight">{{ formatPrice(profile?.balance || 0) }}đ</p>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Sẵn sàng thanh toán</p>
            
            <router-link to="/deposit" class="flex items-center justify-center gap-2 w-full bg-white py-4 rounded-2xl text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-indigo-50 active:scale-95 transition-all shadow-xl shadow-black/20">
              <i class="fa-solid fa-plus-circle"></i>
              Nạp thêm tiền
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- Large Preview Modal -->
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 backdrop-blur-0"
      enter-to-class="opacity-100 backdrop-blur-xl"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 backdrop-blur-xl"
      leave-to-class="opacity-0 backdrop-blur-0"
    >
      <div v-if="showLargePreview" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" @click="showLargePreview = false">
        <button 
          @click="showLargePreview = false"
          class="absolute top-8 right-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
        
        <div class="relative max-h-[70vh] max-w-[90vw] animate-scale-in" @click.stop>
          <img 
            :src="resolveImageUrl(previewUrl || profile?.avatar)" 
            class="max-h-[60vh] rounded-[2rem] shadow-2xl object-contain border-4 border-white/10" 
          />
          <div class="mt-6 flex flex-col items-center gap-4">
            <div>
              <p class="text-white font-black text-xl m-0">{{ profile?.fullName || profile?.username }}</p>
              <p v-if="isNewAvatar" class="text-indigo-400 text-xs font-bold uppercase tracking-widest mt-1">Bản xem trước ảnh mới</p>
            </div>
            
            <div v-if="isNewAvatar" class="flex items-center gap-3">
              <button 
                @click="cancelAvatarSelection"
                class="px-6 py-2.5 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                @click="handleAvatarSave"
                :disabled="updatingAvatar"
                class="px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <i v-if="updatingAvatar" class="fa-solid fa-circle-notch animate-spin"></i>
                Lưu ảnh mới
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>

  <GiftModal 
    v-if="profile"
    :is-open="showGiftModal"
    :receiver-id="profile.id"
    :receiver-name="profile.fullName || profile.username"
    :balance="auth.user?.balance || 0"
    @close="showGiftModal = false"
    @success="fetchProfile"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { uploadFile } from '@/services/fileService';
import { socialService } from '@/services/socialService';
import { getLevels, type LevelItem } from '@/services/learningService';
import { getUserProfile, getUserProfileById, updateUserProfile, type UserProfileResponse, type UserInformationRequest } from '@/services/userService';
import GiftModal from '@/components/social/GiftModal.vue';
import PostCreator from '@/components/social/PostCreator.vue';
import PostList from '@/components/social/PostList.vue';
import ActivityFeed from '@/components/social/ActivityFeed.vue';

const props = defineProps<{
  userId?: string;
}>();

const route = useRoute();
const router = useRouter();

const auth = useAuthStore();

const tabs = computed(() => {
  const base = [
    { id: 'feed', name: 'Bảng tin' },
    { id: 'info', name: 'Giới thiệu' },
  ];
  
  if (!isPublicProfile.value) {
    return [
      ...base,
      { id: 'friends', name: 'Bạn bè' },
      { id: 'followers', name: 'Người theo dõi' },
      { id: 'following', name: 'Đang theo dõi' },
      { id: 'activity', name: 'Hoạt động học tập' }
    ];
  }
  
  return [
    ...base,
    { id: 'activity', name: 'Hoạt động học tập' }
  ];
});
const activeTab = ref('feed');

const isPublicProfile = computed(() => !!props.userId && Number(props.userId) !== auth.user?.id);
const targetUserId = computed(() => props.userId ? Number(props.userId) : auth.user?.id);
const displayName = computed(() => profile.value?.fullName || profile.value?.username || 'Đang tải...');

const stats = reactive({ followers: 0, following: 0, friends: 0 });
const friendsList = ref<any[]>([]);
const followersList = ref<any[]>([]);
const followingList = ref<any[]>([]);
const friendsLoading = ref(false);
const socialListLoading = ref(false);
const friendsPagination = reactive({ page: 0, totalPages: 0 });
const followersPagination = reactive({ page: 0, totalPages: 0 });
const followingPagination = reactive({ page: 0, totalPages: 0 });
const isFollowingUser = ref(false);
const followLoading = ref(false);
const showGiftModal = ref(false);

const loading = ref(true);
const error = ref<string | null>(null);
const profile = ref<UserProfileResponse | null>(null);
const postListRef = ref<any>(null);

const refreshPostList = () => {
  postListRef.value?.refresh();
};

const updating = ref(false);
const updateSuccess = ref(false);

const levels = ref<LevelItem[]>([]);

const formData = reactive<UserInformationRequest>({
  fullName: undefined,
  dob: undefined,
  schoolName: undefined,
  levelId: undefined,
  avatar: undefined,
});

const avatarInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const showAvatarMenu = ref(false);
const showLargePreview = ref(false);
const isNewAvatar = ref(false);
const updatingAvatar = ref(false);
const avatarMenuContainer = ref<HTMLElement | null>(null);

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:')) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

const toggleAvatarMenu = () => {
  showAvatarMenu.value = !showAvatarMenu.value;
};

const openLargePreview = () => {
  isNewAvatar.value = false;
  showLargePreview.value = true;
  showAvatarMenu.value = false;
};

const triggerAvatarUpload = () => {
  avatarInput.value?.click();
  showAvatarMenu.value = false;
};

const handleAvatarChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    alert('Kích thước ảnh không được vượt quá 10MB');
    return;
  }

  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
  isNewAvatar.value = true;
  showLargePreview.value = true;
};

const cancelAvatarSelection = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  isNewAvatar.value = false;
  showLargePreview.value = false;
};

const handleAvatarSave = async () => {
  if (!selectedFile.value) return;
  updatingAvatar.value = true;
  try {
    const uploadRes = await uploadFile(selectedFile.value);
    const newAvatarUrl = uploadRes.data?.data?.url;
    
    if (newAvatarUrl) {
      const res = await updateUserProfile({
        avatar: newAvatarUrl
      });
      profile.value = res.data?.data;
      if (profile.value) {
        auth.setUser({ avatar: profile.value.avatar });
      }
      
      // Reset states
      selectedFile.value = null;
      previewUrl.value = null;
      isNewAvatar.value = false;
      showLargePreview.value = false;
      
      updateSuccess.value = true;
      setTimeout(() => { updateSuccess.value = false; }, 3000);
    }
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu ảnh.');
  } finally {
    updatingAvatar.value = false;
  }
};



const getFireLabel = (level?: number) => {
  if (!level || level === 0) return 'Chưa có lửa';
  if (level === 1) return 'Mới bắt đầu';
  if (level === 2) return 'Ổn định nhẹ';
  if (level === 3) return 'Khá tốt';
  if (level === 4) return 'Rất tốt';
  return 'Bùng cháy';
};

const getFireColorClass = (level?: number) => {
  if (!level || level === 0) return 'text-slate-400';
  if (level === 1) return 'text-amber-500';
  if (level === 2) return 'text-orange-500';
  if (level === 3) return 'text-rose-500';
  if (level === 4) return 'text-red-500';
  return 'text-red-600 font-black';
};

const getFireBgClass = (level?: number) => {
  if (!level || level === 0) return 'bg-slate-600';
  if (level === 1) return 'bg-amber-500';
  if (level === 2) return 'bg-orange-500';
  if (level === 3) return 'bg-rose-500';
  if (level === 4) return 'bg-red-500';
  return 'bg-gradient-to-r from-red-500 to-orange-400';
};

const fetchProfile = async () => {
  const id = targetUserId.value;
  if (!id && !auth.isAuthenticated) return;
  
  loading.value = true;
  error.value = null;
  try {
    const res = props.userId ? await getUserProfileById(Number(props.userId)) : await getUserProfile();
    profile.value = res.data?.data;
    
    if (!props.userId && profile.value) {
      formData.fullName = profile.value.fullName ?? undefined;
      formData.dob = profile.value.dob ?? undefined;
      formData.schoolName = profile.value.schoolName ?? undefined;
      formData.levelId = profile.value.levelId ?? undefined;
      formData.avatar = profile.value.avatar ?? undefined;
    }

    if (id) {
      const [followRes, statsRes] = await Promise.all([
        isPublicProfile.value ? socialService.isFollowing(id) : Promise.resolve({ data: false }),
        socialService.getFollowStats(id)
      ]);
      isFollowingUser.value = followRes.data;
      stats.followers = statsRes.data.followers;
      stats.following = statsRes.data.following;
      stats.friends = statsRes.data.friends;
      
      if (activeTab.value === 'friends') {
        fetchFriends(0);
      }
    }
  } catch (err) {
    console.error(err);
    error.value = 'Không thể tải thông tin hồ sơ.';
  } finally {
    loading.value = false;
  }
};


const startChat = () => {
  if (profile.value?.id) {
    router.push(`/messages?userId=${profile.value.id}`);
  }
};

const fetchFriends = async (page = 0) => {
  const id = targetUserId.value;
  if (!id || isPublicProfile.value) return; // Only for own profile
  
  friendsLoading.value = true;
  try {
    const res = await socialService.getFriends(id, page, 20);
    const data = res.data; // This is the Page/PageResponse object
    if (data) {
      friendsList.value = data.content || data.items || [];
      friendsPagination.page = data.number !== undefined ? data.number : data.page;
      friendsPagination.totalPages = data.totalPages;
    }
  } catch (err) {
    console.error('Failed to fetch friends', err);
  } finally {
    friendsLoading.value = false;
  }
};

const fetchFollowers = async (page = 0) => {
  const id = targetUserId.value;
  if (!id || isPublicProfile.value) return;
  socialListLoading.value = true;
  try {
    const res = await socialService.getFollowers(id, page, 20);
    const data = res.data;
    if (data) {
      followersList.value = data.content || data.items || [];
      followersPagination.page = data.number !== undefined ? data.number : data.page;
      followersPagination.totalPages = data.totalPages;
    }
  } catch (err) {
    console.error('Failed to fetch followers', err);
  } finally {
    socialListLoading.value = false;
  }
};

const fetchFollowing = async (page = 0) => {
  const id = targetUserId.value;
  if (!id || isPublicProfile.value) return;
  socialListLoading.value = true;
  try {
    const res = await socialService.getFollowing(id, page, 20);
    const data = res.data;
    if (data) {
      followingList.value = data.content || data.items || [];
      followingPagination.page = data.number !== undefined ? data.number : data.page;
      followingPagination.totalPages = data.totalPages;
    }
  } catch (err) {
    console.error('Failed to fetch following', err);
  } finally {
    socialListLoading.value = false;
  }
};

import { watch } from 'vue';
watch(activeTab, (newTab) => {
  if (newTab === 'friends' && friendsList.value.length === 0) fetchFriends(0);
  if (newTab === 'followers' && followersList.value.length === 0) fetchFollowers(0);
  if (newTab === 'following' && followingList.value.length === 0) fetchFollowing(0);
});

const confirmUnfollow = (userId: number, name: string, type: 'friends' | 'following' | 'followers') => {
  let message = '';
  let action: () => Promise<any>;
  
  if (type === 'friends') {
    message = `Bạn có chắc chắn muốn hủy kết bạn với ${name}? Hai bạn sẽ không còn theo dõi nhau và không thấy bài viết của nhau.`;
    action = () => socialService.removeFriend(userId);
  } else if (type === 'followers') {
    message = `Bạn có chắc chắn muốn xóa ${name} khỏi danh sách người theo dõi? Họ sẽ không còn theo dõi bạn nữa.`;
    action = () => socialService.removeFollower(userId);
  } else {
    message = `Bạn có chắc chắn muốn bỏ theo dõi ${name}?`;
    action = () => socialService.unfollow(userId);
  }
    
  if (window.confirm(message)) {
    action().then(() => {
      fetchProfile();
      if (type === 'friends') fetchFriends(0);
      if (type === 'following') fetchFollowing(0);
    });
  }
};

const handleFollowAction = async () => {
  if (!targetUserId.value) return;
  followLoading.value = true;
  try {
    if (isFollowingUser.value) {
      await socialService.unfollow(targetUserId.value);
      isFollowingUser.value = false;
      stats.followers--;
    } else {
      await socialService.follow(targetUserId.value);
      isFollowingUser.value = true;
      stats.followers++;
    }
  } catch (err) {
    console.error(err);
  } finally {
    followLoading.value = false;
  }
};

const fetchLevels = async () => {
  try {
    const res = await getLevels();
    levels.value = res.data?.data || [];
  } catch (err) {
    console.error('Failed to load levels', err);
  }
};

const handleUpdate = async () => {
  if (!auth.isAuthenticated) return;
  updating.value = true;
  updateSuccess.value = false;
  try {
    // 1. If there's a new file selected, upload it first
    if (selectedFile.value) {
      const uploadRes = await uploadFile(selectedFile.value);
      formData.avatar = uploadRes.data?.data?.url; // Use the URL field from the response data
    }

    // 2. Then update profile information
    const res = await updateUserProfile({
      fullName: formData.fullName ?? undefined,
      schoolName: formData.schoolName ?? undefined,
      dob: formData.dob ?? undefined,
      levelId: formData.levelId ?? undefined,
      avatar: formData.avatar ?? undefined,
    });
    profile.value = res.data?.data;
    if (profile.value) {
      auth.setUser({
        avatar: profile.value.avatar
      });
    }
    
    // Clear selection after success
    selectedFile.value = null;
    previewUrl.value = null;

    updateSuccess.value = true;
    setTimeout(() => { updateSuccess.value = false; }, 3000);
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
  } finally {
    updating.value = false;
  }
};

const handleClickOutside = (e: Event) => {
  if (showAvatarMenu.value && avatarMenuContainer.value && !avatarMenuContainer.value.contains(e.target as Node)) {
    showAvatarMenu.value = false;
  }
};

onMounted(() => {
  if (auth.isAuthenticated) {
    fetchLevels();
    fetchProfile();
  }
  window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>
