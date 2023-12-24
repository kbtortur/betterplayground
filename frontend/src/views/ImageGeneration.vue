<script setup lang="ts">
const openai = getOpenAI()

const messages = ref<ChatInterfaceMessage[]>([])

const generate = async (prompt: string) => {
  const response = await openai.images.generate({
    prompt: prompt,
    model: "dall-e-3",
    n: 1,
    size: "1024x1024",
    quality: "hd",
  })
  console.log(response)

  return {
    imageURL: response.data[0].url ?? "",
    revisedPrompt: response.data[0].revised_prompt ?? "",
  }
}

const onSend = async (message: string) => {
  messages.value.push({
    text: message,
    isRequest: true,
  })

  const id = UUIDGeneratorBrowser()
  messages.value.push({
    text: "",
    isRequest: false,
    loading: true,
    id,
  })

  const { imageURL, revisedPrompt } = await generate(message)
  messages.value = messages.value.map(message => {
    if (message.id === id) {
      return {
        ...message,
        text: `Revised prompt: ${revisedPrompt}`,
        loading: false,
        image: imageURL,
      }
    }
    return message
  })
}
</script>

<template>
  <main class="image-generation">
    <ChatInterface @send="onSend" :messages="messages" />
  </main>
</template>
