<script setup lang="ts">
const openai = getOpenAI()

const messages = ref<ChatInterfaceMessage[]>([
  {
    from: "robot",
    text: "Hello! I'm Dall-E, an AI that generates images from text prompts.",
  },
])

onBeforeMount(async () => {
  const history: ChatInterfaceMessage[] = []

  const transaction = db.transaction("imageGenerationChat")
  const index = transaction.store.index("by-id")
  let cursor = await index.openCursor(null, "prev")

  while (cursor) {
    history.push(cursor.value)
    cursor = await cursor.continue()
  }

  if (history.length > 1) {
    messages.value = history
  }
})

const generate = async (prompt: string) => {
  // const wait = (t: number): Promise<void> => new Promise(r => setTimeout(r, t))
  // await wait(1000)

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

// todo put loading message in database to prevent wrong order of the index
const onSend = async (message: string) => {
  const requestMessage: ChatInterfaceMessage = {
    text: message,
    from: "human",
  }

  messages.value.unshift(requestMessage)
  await db.add("imageGenerationChat", {
    from: "human",
    text: message,
  })

  const loadingUUID = UUIDGeneratorBrowser()
  messages.value.unshift({
    from: "robot",
    loadingUUID,
  })

  const { imageBlob, revisedPrompt } = await generate(message)
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

  await db.add("imageGenerationChat", responseMessage)
}
</script>

<template>
  <main class="image-generation">
    <ChatInterface @send="onSend" :messages="messages" />
  </main>
</template>
