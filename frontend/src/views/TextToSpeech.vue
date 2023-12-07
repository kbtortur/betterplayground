<script setup lang="ts">
import { useSettings } from "@/stores/settings"
import OpenAI from "openai"
import { reactive } from "vue"
import { useRouter } from "vue-router"

const settings = useSettings()
const apiKey = settings.openaiApiKey

const router = useRouter()

if (!apiKey) {
  router.replace("/setup")
  throw new Error("OpenAI API key not set")
}

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
const generate = async () => {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: inputs.prompt,
  })

  const blob = await mp3.blob()
  const url = URL.createObjectURL(blob)

  outputs.audioURL = url
}

const inputs = reactive({
  prompt: "",
})

const outputs = reactive({
  audioURL: "",
})
</script>

<template>
  <form @submit.prevent="generate">
    <input type="text" v-model="inputs.prompt" placeholder="prompt" />
    <button>generate</button>
  </form>

  <audio v-if="outputs.audioURL" :src="outputs.audioURL" controls></audio>
</template>
