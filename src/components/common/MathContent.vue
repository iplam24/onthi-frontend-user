<template>
  <span v-html="renderedContent" class="math-content inline-block"></span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const props = defineProps<{
  content: string;
}>();

const renderedContent = computed(() => {
  if (!props.content) return '';

  let text = props.content;

  // Replace block math $$ ... $$
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: true, throwOnError: false });
    } catch (e) {
      return match;
    }
  });

  // Replace block math \[ ... \]
  text = text.replace(/\\\[([\s\S]+?)\\\]/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: true, throwOnError: false });
    } catch (e) {
      return match;
    }
  });

  // Replace inline math \( ... \)
  text = text.replace(/\\\(([\s\S]+?)\\\)/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: false, throwOnError: false });
    } catch (e) {
      return match;
    }
  });

  // Only handle newlines if NOT in math mode? 
  // Actually, replacing \n with <br/> is generally okay for non-LaTeX parts.
  return text.replace(/\n/g, '<br/>');
});
</script>

<style>
.math-content {
  word-break: break-word;
}
.math-content .katex-display {
  margin: 0.5em 0;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
