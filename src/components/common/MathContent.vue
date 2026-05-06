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

  if (props.format === 'LATEX') {
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

    // Replace inline math $ ... $
    text = text.replace(/\$([\s\S]+?)\$/g, (match, formula) => {
      hasDelimiters = true;
      try {
        return katex.renderToString(formula, { displayMode: false, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    // Fallback: If no delimiters were found but format is LATEX, 
    // split the text into non-math and math parts to avoid font errors on leading text.
    if (!hasDelimiters) {
      const firstMathTrigger = text.search(/\\|\^|_/);
      if (firstMathTrigger !== -1) {
        const prefix = text.substring(0, firstMathTrigger);
        const mathPart = text.substring(firstMathTrigger);
        
        // We only attempt this if the math part looks substantial or the whole thing starts with math
        if (firstMathTrigger === 0 || mathPart.length > 3) {
          try {
            // Check for Vietnamese in the math part - if present, maybe don't render as math
            const containsVietnameseInMath = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(mathPart);
            if (!containsVietnameseInMath) {
              text = prefix + katex.renderToString(mathPart, { displayMode: false, throwOnError: false });
            }
          } catch (e) {
            // Keep original
          }
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
