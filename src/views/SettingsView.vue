<script setup lang="ts">
const settings = useSettings()
</script>

<template>
  <input type="text" placeholder="OpenAI API Key" v-model="settings.openaiApiKey">
</template>