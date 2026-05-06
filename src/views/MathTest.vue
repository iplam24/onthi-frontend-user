<template>
  <div class="p-10 space-y-8">
    <h1 class="text-2xl font-bold">Math Rendering Test</h1>
    
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">1. Raw LaTeX (Starts with backslash)</h2>
      <div class="p-4 border rounded bg-slate-50">
        <MathContent content="\frac{(x+3)}{y-1}+x^{2}" format="LATEX" />
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-semibold">2. Mixed Text and Raw LaTeX (The "Smart" Case)</h2>
      <div class="p-4 border rounded bg-slate-50">
        <MathContent content="thử câu hỏi : \frac{(x+3)}{y-1}+x^{2}" format="LATEX" />
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-semibold">3. Inline $...$</h2>
      <div class="p-4 border rounded bg-slate-50">
        <MathContent content="Đây là $x^2 + y^2 = z^2$ trong câu." format="LATEX" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import MathContent from '@/components/common/MathContent.vue';
</script>
