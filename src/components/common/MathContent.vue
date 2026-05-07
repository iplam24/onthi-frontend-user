<template>
  <span v-html="renderedContent" class="math-content inline-block"></span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import katex from 'katex';

const props = defineProps<{
  content: string;
  format?: 'PLAIN_TEXT' | 'LATEX';
}>();

const renderedContent = computed(() => {
  if (!props.content) return '';

  let text = props.content;
  let hasDelimiters = false;

  // Auto-detect LaTeX if not explicitly provided but contains common math symbols
  const isLatex = props.format === 'LATEX' || /\\frac|\\sqrt|\\int|\\sum|\^|_|\\begin|\\end|\$|\\\(|\\\[/.test(text);

  if (isLatex) {
    // Replace block math $$ ... $$
    text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
      hasDelimiters = true;
      try {
        return katex.renderToString(formula, { displayMode: true, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    // Replace block math \[ ... \]
    text = text.replace(/\\\[([\s\S]+?)\\\]/g, (match, formula) => {
      hasDelimiters = true;
      try {
        return katex.renderToString(formula, { displayMode: true, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    // Replace inline math \( ... \)
    text = text.replace(/\\\(([\s\S]+?)\\\)/g, (match, formula) => {
      hasDelimiters = true;
      try {
        return katex.renderToString(formula, { displayMode: false, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    // Replace inline math $ ... $ (only if it looks like math, e.g. contains backslash, ^, _, or more than 1 char)
    text = text.replace(/\$([\s\S]+?)\$/g, (match, formula) => {
      if (formula.length > 0) {
        hasDelimiters = true;
        try {
          return katex.renderToString(formula, { displayMode: false, throwOnError: false });
        } catch (e) {
          return match;
        }
      }
      return match;
    });

    // Fallback: If no delimiters were found but it's likely LaTeX, 
    // render the whole thing or detect the math part
    if (!hasDelimiters) {
      // Check if it's purely math or starts with a math symbol
      const startsWithMath = /^[\\\$]/.test(text.trim());
      const containsMathCommand = /\\(frac|sqrt|alpha|beta|gamma|theta|pi|infty|int|sum|prod|lim|log|sin|cos|tan)/.test(text);
      
      if (startsWithMath || containsMathCommand) {
        try {
          const containsVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);
          if (!containsVietnamese) {
            return katex.renderToString(text, { displayMode: false, throwOnError: false });
          }
        } catch (e) {
          // Keep original
        }
      }
    }
  }

  // Handle newlines for all formats
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
