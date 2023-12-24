<script setup lang="ts">
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
    quality: "hd",
  })

  console.log(response)

  outputs.imageURL = response.data[0].url ?? ""
  outputs.revisedPrompt = response.data[0].revised_prompt ?? ""
}

const messages = ref<ChatInterfaceMessage[]>([
  {
    text: "Give Fortnite",
    isRequest: true,
  },
  {
    text: "Amongus",
    isRequest: false,
  },
])

const onSend = (message: string) => {
  messages.value.push({
    text: message,
    isRequest: true,
  })
}
</script>

<template>
  <main class="image-generation">
    <!-- <form @submit.prevent="generate">
    <textarea type="text" v-model="inputs.prompt" placeholder="prompt" />
    <button>generate</button>
  </form>

  <p v-if="outputs.revisedPrompt">revised prompt: {{ outputs.revisedPrompt }}</p>
  <img v-if="outputs.imageURL" :src="outputs.imageURL" alt="generated image" /> -->

    <ChatInterface @send="onSend" :messages="messages" />
  </main>
</template>
