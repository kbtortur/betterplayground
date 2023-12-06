<script setup lang="ts">
import { useSettings } from "@/stores/settings"
import { reactive } from "vue"

const settings = useSettings()

const inputs = reactive({
  prompt: "",
  revisedPrompt: "",
})

const outputs = reactive({
  revisedPrompt: "",
  imageURL: "",
})

const generate = async () => {
  const request = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.openaiApiKey}`,
    },
    body: JSON.stringify({
      prompt: inputs.prompt,
      model: "dall-e-3",
      n: 1,
      size: "1024x1024",
    }),
  })

  const response = await request.json()
  console.log(response)

  outputs.imageURL = response.data[0].url
  outputs.revisedPrompt = response.data[0].revised_prompt
}
</script>

<template>
  <form @submit.prevent="generate">
    <input type="text" v-model="inputs.prompt" placeholder="prompt" />
    <button>generate</button>
  </form>

  <p v-if="outputs.revisedPrompt">revised prompt: {{ outputs.revisedPrompt }}</p>
  <img v-if="outputs.imageURL" :src="outputs.imageURL" alt="generated image" />
</template>
