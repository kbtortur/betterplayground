<script setup lang="ts">
import markdownit from "markdown-it"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.min.css"

const props = defineProps({
  source: {
    type: String,
    required: true,
  },
})

const md = markdownit({
  html: true,
  linkify: true,
  highlight: (source, language) => {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(source, { language }).value
      } catch (__) {
        // ignore
      }
    }

    return "" // use external default escaping
  },
})

const html = ref("")

watch(
  () => props.source,
  () => {
    html.value = md.render(props.source)
  },
  { immediate: true }
)
</script>
<template>
  <div class="markdown" v-html="html"></div>
</template>

<style lang="scss">
.markdown {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0.75em;
    margin-bottom: 0.25em;
  }

  pre:has(code) {
    background: #1f1f1f;
    padding: 0.75rem 1rem;
    margin: 0.25rem 0;
    border-radius: 6.66px;
    overflow-x: auto;
  }
}
</style>
