<script setup lang="ts">
const openai = getOpenAI()

const messages = ref<ChatInterfaceMessage[]>([
  {
    isRequest: false,
    text: "Hello! I'm Dall-E, an AI that generates images from text prompts.",
  },
])

onBeforeMount(async () => {
  const history = await pb.collection("image_generation").getList<DatabaseMessage>(1, 30, {
    sort: "+created",
  })

  const transformed = history.items.map(message => {
    if (message.image) {
      message.imageURL = pb.files.getUrl(message, message.image)
    }

    return message
  })

  if (transformed.length <= 0) return
  messages.value = transformed
})

const generate = async (prompt: string) => {
  const response = await openai.images.generate({
    prompt: prompt,
    model: "dall-e-3",
    n: 1,
    size: "1024x1024",
    quality: "hd",
    response_format: "b64_json",
  })
  console.log(response)

  return {
    imageBlob: await imageToBlob(response.data[0].b64_json ?? ""),
    revisedPrompt: response.data[0].revised_prompt ?? "",
  }
}

const onSend = async (message: string) => {
  const requestMessage: ChatInterfaceMessage = {
    text: message,
    isRequest: true,
  }

  messages.value.push(requestMessage)
  await pb.collection("image_generation").create<ChatInterfaceMessage>(requestMessage)

  const loadingUUID = UUIDGeneratorBrowser()
  messages.value.push({
    isRequest: false,
    loadingUUID,
  })

  const { imageBlob, revisedPrompt } = await generate(message)
  const responseMessage = {
    isRequest: false,
    date: new Date(),
    text: `Revised prompt: ${revisedPrompt}`,
  }

  messages.value = messages.value.map(message => {
    if (message.loadingUUID === loadingUUID) {
      return { ...responseMessage, imageURL: URL.createObjectURL(imageBlob) }
    }
    return message
  })

  await pb.collection("image_generation").create<ChatInterfaceMessage>({
    ...responseMessage,
    image: new File([imageBlob], "image.jpg"),
  })
}
</script>

<template>
  <main class="image-generation">
    <ChatInterface @send="onSend" :messages="messages" />
  </main>
</template>
