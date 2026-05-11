<template>
  <div class="container-narrow pb-20">
    <div>
      <!-- Hero Section -->
      <div class="text-center mb-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
          <i class="fa-solid fa-robot"></i>
          Trợ lý AI Study Buddy
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
          Làm chủ kiến thức với <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">V-Edu AI</span>
        </h1>
        <p class="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
          Khám phá cách sử dụng trí tuệ nhân tạo để tối ưu hóa việc học tập, giải bài tập và chuẩn bị cho các kỳ thi quan trọng một cách thông minh nhất.
        </p>
      </div>

      <!-- Guide Grid (11 Steps) -->
      <div class="grid md:grid-cols-2 gap-6 mb-20">
        <div 
          v-for="(step, i) in guideSteps" 
          :key="i"
          class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group animate-in fade-in slide-in-from-bottom-10 duration-700"
          :style="{ animationDelay: `${i * 100}ms` }"
        >
          <div class="flex items-start gap-5">
            <div class="w-12 h-12 shrink-0 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              {{ i + 1 }}
            </div>
            <div>
              <h3 class="font-black text-slate-800 mb-2">{{ step.title }}</h3>
              <p class="text-sm text-slate-500 font-medium leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Policy Section -->
      <div class="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <!-- Decor -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-500/20 blur-[100px] rounded-full"></div>

        <div class="relative z-10">
          <div class="flex flex-col md:flex-row gap-10 items-center">
            <div class="flex-1">
              <h2 class="text-3xl font-black mb-6 flex items-center gap-3">
                <i class="fa-solid fa-shield-halved text-indigo-400"></i>
                Chính sách & Bảo mật AI
              </h2>
              <div class="space-y-4">
                <div v-for="(p, i) in policies" :key="i" class="flex items-start gap-3">
                  <div class="mt-1 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-check text-[10px] text-indigo-400"></i>
                  </div>
                  <p class="text-slate-300 text-sm font-medium leading-relaxed">{{ p }}</p>
                </div>
              </div>
            </div>
            <div class="w-full md:w-64">
              <div class="aspect-square bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center p-6">
                <i class="fa-solid fa-lock text-4xl text-indigo-400 mb-4"></i>
                <h4 class="font-black text-sm uppercase tracking-widest mb-2">An toàn 100%</h4>
                <p class="text-[10px] text-slate-400 font-medium">Dữ liệu học tập của bạn được mã hóa và bảo vệ nghiêm ngặt.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-16 text-center">
        <router-link 
          to="/" 
          class="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
        >
          Trải nghiệm AI ngay
          <i class="fa-solid fa-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const guideSteps = [
  { title: 'Đặt câu hỏi cụ thể', desc: 'Thay vì nói "Giúp tôi học Toán", hãy hỏi "Giải thích cách tính đạo hàm hàm số hợp". Càng cụ thể, AI càng trả lời đúng trọng tâm.' },
  { title: 'Yêu cầu tóm tắt', desc: 'Dán một đoạn văn dài hoặc nội dung bài học và yêu cầu AI tóm tắt thành các ý chính để dễ học thuộc hơn.' },
  { title: 'Giải bài tập mẫu', desc: 'Yêu cầu AI đưa ra các bước giải chi tiết cho một dạng bài tập thay vì chỉ lấy đáp án cuối cùng.' },
  { title: 'Luyện tập Tiếng Anh', desc: 'Bạn có thể chat bằng tiếng Anh với AI để luyện kỹ năng viết và yêu cầu AI sửa lỗi ngữ pháp.' },
  { title: 'Chuẩn bị kỳ thi', desc: 'Yêu cầu AI liệt kê các trọng tâm kiến thức thường xuất hiện trong các kỳ thi THPT Quốc gia.' },
  { title: 'Tìm kiếm cảm hứng', desc: 'Khi bí ý tưởng cho bài văn, hãy yêu cầu AI đưa ra một vài dàn ý hoặc cách mở bài ấn tượng.' },
  { title: 'Kiểm tra chéo', desc: 'Luôn so sánh câu trả lời của AI với sách giáo khoa để đảm bảo kiến thức chính xác tuyệt đối.' },
  { title: 'Sử dụng Lịch sử', desc: 'Với gói ProMax, bạn có thể xem lại toàn bộ các cuộc thảo luận cũ để ôn tập kiến thức bất cứ lúc nào.' },
  { title: 'Phản hồi nội dung', desc: 'Nếu AI đưa ra thông tin không chính xác hoặc không phù hợp, hãy báo cáo để chúng tôi cải thiện.' },
  { title: 'Tư vấn hướng nghiệp', desc: 'Hỏi AI về các khối thi, ngành học và xu hướng nghề nghiệp để có sự lựa chọn đúng đắn.' },
  { title: 'Học tập chủ động', desc: 'Hãy coi AI là một trợ lý hỗ trợ, không phải là công cụ làm bài hộ. Sự nỗ lực của bạn là quan trọng nhất.' }
];

const policies = [
  'Chúng tôi không thu thập thông tin cá nhân của bạn thông qua các cuộc trò chuyện với AI.',
  'Dữ liệu trò chuyện chỉ được sử dụng để cá nhân hóa trải nghiệm học tập và cải thiện chất lượng phản hồi.',
  'Hệ thống AI được cấu hình để từ chối các yêu cầu vi phạm đạo đức, gian lận trong thi cử nghiêm trọng hoặc nội dung không lành mạnh.',
  'Người dùng gói ProMax có quyền truy cập và quản lý lịch sử trò chuyện cá nhân của mình.',
  'Chúng tôi cam kết tuân thủ các quy định quốc tế về bảo mật dữ liệu và an toàn trí tuệ nhân tạo.'
];
</script>

<style scoped>
.animate-in {
  animation-fill-mode: forwards;
}
</style>
