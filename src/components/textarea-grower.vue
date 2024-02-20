<script setup lang="ts">
import { ref } from "vue"

defineProps<{
  modelValue: string
}>()
const emit = defineEmits<{
  (event: "update:modelValue", textContent: string): void
  (event: "insertLastMessage"): void
}>()

const textarea = ref<HTMLTextAreaElement>()
const onInput = () => {
  if (textarea.value) emit("update:modelValue", textarea.value.value)
}
</script>

<template>
  <div class="textarea-grower" :data-replicated-value="modelValue">
    <textarea
      v-bind="$attrs"
      ref="textarea"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      autofocus="true"
      rows="1"
      :value="modelValue"
      @input="onInput"
      @keydown.up="emit('insertLastMessage')"
      placeholder="Type a message..."
    />
  </div>
</template>

<style scoped>
/* https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas */

.textarea-grower {
  /* easy way to plop the elements on top of each other and have them both sized based on the tallest one's height */
  display: grid;
}
.textarea-grower::after {
  /* Note the weird space! Needed to preventy jumpy behavior */
  content: attr(data-replicated-value) " ";

  /* This is how textarea text behaves */
  white-space: pre-wrap;

  /* Hidden from view, clicks, and screen readers */
  visibility: hidden;
}
.textarea-grower > textarea {
  /* You could leave this, but after a user resizes, then it ruins the auto sizing */
  resize: none;

  /* Firefox shows scrollbar on growth, you can hide like this. */
  overflow: hidden;
}
.textarea-grower > textarea,
.textarea-grower::after {
  /* Identical styling required!! */
  border: none;
  padding: 0.75rem 1rem;
  font: inherit;
  outline: none;
  border-radius: 6.66px;
  box-shadow: 0 1px 0 0 var(--accent-dim);
  transition: box-shadow 100ms ease-in-out;
  background: var(--backdrop);

  /* Place on top of each other */
  grid-area: 1 / 1 / 2 / 2;
}

.textarea-grower > textarea:focus {
  box-shadow: 0 0 0 2px var(--accent-dim);
}

body {
  margin: 2rem;
  font:
    1rem/1.4 system-ui,
    sans-serif;
}

label {
  display: block;
}
</style>
