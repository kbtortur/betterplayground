<script setup lang="ts">
import { getOpenAI } from "@/openai"
import { reactive } from "vue"

const openai = getOpenAI()
const generate = async () => {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: inputs.prompt,
  })

  console.log(response)

  const blob = await response.blob()
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
