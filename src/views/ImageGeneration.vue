<script setup lang="ts">
const openai = getOpenAI()

const messages = ref<ChatInterfaceMessage[]>([
  {
    from: "robot",
    text: "Hello! I'm Dall-E, an AI that generates images from text prompts.",
  },
])

onBeforeMount(async () => {
  const history = await loadStoredMessages(["imageGenerationChat"])
  if (history.length > 1) {
    messages.value = history
  }
})

const generate = async (prompt: string) => {
  // const wait = (t: number): Promise<void> => new Promise(r => setTimeout(r, t))
  // await wait(Math.random() * 2000 + 500)

  // return {
  //   imageBlob: await urlImageToBlob("https://picsum.photos/500"),
  //   revisedPrompt: "Lorem Ipsum",
  // }

  // Above is for testing purposes only
  // ----------------------------

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
    imageBlob: await b64ImageToBlob(response.data[0].b64_json ?? ""),
    revisedPrompt: response.data[0].revised_prompt ?? "",
  }
}

const onSend = async (text: string) => {
  const requestMessage: ChatInterfaceMessage = {
    from: "human",
    text,
  }

  messages.value.unshift(requestMessage)
  await db.add("imageGenerationChat", requestMessage)

  const loadingUUID = UUIDGeneratorBrowser()
  const responseLoadingMessage: ChatInterfaceMessage = {
    from: "robot",
    loadingUUID,
  }
  messages.value.unshift(responseLoadingMessage)
  const dbLoadingMessageID = await db.add("imageGenerationChat", responseLoadingMessage)

  const { imageBlob, revisedPrompt } = await generate(text)
  const responseMessage: ChatInterfaceMessage = {
    from: "robot",
    text: `Revised prompt: ${revisedPrompt}`,
    image: imageBlob,
  }

  messages.value = messages.value.map(message => {
    if (message.loadingUUID === loadingUUID) {
      return responseMessage
    } else return message
  })

  await db.put("imageGenerationChat", { ...responseMessage, id: dbLoadingMessageID })
}
</script>

<template>
  <main class="image-generation">
    <ChatInterface @send="onSend" :messages="messages" />
  </main>
</template>
