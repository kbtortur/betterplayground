<script setup lang="ts">
const openai = getOpenAI()

const messages = ref<ChatInterfaceMessage[]>([
  {
    from: "robot",
    text: "Hello! I'm Dall-E, an AI that generates images from text prompts.",
  },
])

onBeforeMount(async () => {
  const history = await loadStoredMessages("imageGenerationChat")

  if (history.length > 0) {
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

  const [data] = response.data
  if (!data) throw new Error("No data returned from OpenAI")

  return {
    imageBlob: await b64ImageToBlob(data.b64_json ?? ""),
    revisedPrompt: data.revised_prompt ?? "",
  }
}

const onSend = async (text: string) => {
  const requestMessage: ChatInterfaceMessage = {
    from: "human",
    text,
  }

  messages.value.unshift(requestMessage)
  await database.add("imageGenerationChat", requestMessage)

  const loadingUUID = crypto.randomUUID()
  const responseLoadingMessage: ChatInterfaceMessage = {
    from: "robot",
    loadingUUID,
  }
  messages.value.unshift(responseLoadingMessage)
  const databaseLoadingMessageID = await database.add(
    "imageGenerationChat",
    responseLoadingMessage
  )

  const { imageBlob, revisedPrompt } = await generate(text)
  const responseMessage: ChatInterfaceMessage = {
    from: "robot",
    text: `Revised prompt: ${revisedPrompt}`,
    image: imageBlob,
  }

  messages.value = messages.value.map(message => {
    return message.loadingUUID === loadingUUID ? responseMessage : message
  })

  await database.put("imageGenerationChat", {
    ...responseMessage,
    id: databaseLoadingMessageID,
  })
}
</script>

<template>
  <main class="image-generation">
    <ChatInterface @send="onSend" :messages="messages" />
  </main>
</template>
