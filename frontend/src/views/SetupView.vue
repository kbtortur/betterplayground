<script setup lang="ts">
import { useSettings } from "@/stores/settings"

const settings = useSettings()
</script>

<template>
  <input type="text" placeholder="OpenAI API Key" v-model="settings.openaiApiKey">
</template>