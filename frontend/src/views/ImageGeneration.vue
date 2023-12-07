<script setup lang="ts">
import { getOpenAI } from "@/openai"
import { reactive } from "vue"

const openai = getOpenAI()

const inputs = reactive({
  prompt: "",
})

const outputs = reactive({
  revisedPrompt: "",
  imageURL: "",
})

const generate = async () => {
  const response = await openai.images.generate({
    prompt: inputs.prompt,
    model: "dall-e-3",
    n: 1,
    size: "1024x1024",
  })

  console.log(response)

  outputs.imageURL = response.data[0].url ?? ""
  outputs.revisedPrompt = response.data[0].revised_prompt ?? ""
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
