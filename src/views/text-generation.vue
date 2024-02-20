<script setup lang="ts">
import { onBeforeMount, ref } from "vue"

import { database, loadStoredMessages } from "@/composables/database"
import { getOpenAI } from "@/composables/openai"

import ChatInterface from "@/components/chat-interface.vue"

const openai = getOpenAI()

const messages = ref<ChatInterfaceMessage[]>([])

onBeforeMount(async () => {
  const history = await loadStoredMessages("textGenerationChat")
  console.log(history)

  if (history.length > 0) {
    messages.value = history
  }
})

const updateMessage = async (uuid: string, message: ChatInterfaceMessage) => {
  const index = messages.value.findIndex(m => m.loadingUUID === uuid)
  if (index === -1) throw new Error("Message not found")

  messages.value[index] = { ...message }
}

const transformSender = (role: ChatInterfaceMessage["from"]): "user" | "assistant" => {
  if (role === "human") return "user"
  if (role === "robot") return "assistant"
  throw new Error("Invalid role")
}

type ChatMessageWithText = ChatInterfaceMessage & { text: string }
const transformMessages = (messages: Array<ChatInterfaceMessage>) => {
  return [...messages]
    .reverse()
    .filter((message): message is ChatMessageWithText => message.text !== "")
    .map(message => {
      return {
        role: transformSender(message.from),
        content: message.text,
      }
    })
}

const clearMessages = async () => {
  await database.clear("textGenerationChat")
  messages.value = []
}

const onSend = async (text: string) => {
  if (text === "/clear") return await clearMessages()

  const requestMessage: ChatInterfaceMessage = {
    from: "human",
    text,
  }

  messages.value.unshift(requestMessage)
  await database.add("textGenerationChat", requestMessage)

  const loadingUUID = crypto.randomUUID()
  const responseMessage: ChatInterfaceMessage = {
    from: "robot",
    loadingUUID,
    text: "",
  }
  messages.value.unshift(responseMessage)
  const databaseLoadingMessageID = await database.add("textGenerationChat", responseMessage)

  //? Mock loading
  // const wait = (t: number): Promise<void> => new Promise(r => setTimeout(r, t))
  // const mockAmount = Math.floor(Math.random() * 10) + 5
  // for (let index = 0; index < mockAmount; index++) {
  //   await wait(Math.floor(Math.random() * 500) + 500)
  //   responseMessage.text += `Mock message ${index + 1} of ${mockAmount} `
  //   updateMessage(loadingUUID, responseMessage)
  // }

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Keep your responses brief and concise. Do not explain basic concepts unless asked.",
      },
      ...transformMessages(messages.value),
    ],
    stream: true,
  })

  for await (const chunk of completion) {
    const [choice] = chunk.choices
    if (!choice) continue

    const { content } = choice.delta
    if (!content) continue

    responseMessage.text += content
    updateMessage(loadingUUID, responseMessage)
  }

  responseMessage.loadingUUID = undefined
  updateMessage(loadingUUID, responseMessage)

  await database.put("textGenerationChat", {
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
