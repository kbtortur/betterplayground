<script setup lang="ts">
const settings = useSettings()
</script>

<template>
  <main>
    <h1>Enter your OpenAi API Key please 🥺</h1>
    <input type="text" placeholder="OpenAI API Key" v-model="settings.openaiApiKey" />
  </main>
</template>
