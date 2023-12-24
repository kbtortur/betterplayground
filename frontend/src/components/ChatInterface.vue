<script setup lang="ts">
const props = defineProps({
  messages: {
    type: Array as PropType<ChatInterfaceMessage[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: "send", message: string): void
  (event: "insertLastMessage"): void
}>()

const textContent = ref("")
const onEnter = (event: KeyboardEvent) => {
  if (event.shiftKey) return

  event.preventDefault()
  event.stopPropagation()

  if (textContent.value.trim() === "") return

  emit("send", textContent.value.trim())

  textContent.value = ""
}

const insertLastMessage = () => {
  if (props.messages.length === 0) return
  if (textContent.value.trim() !== "") return

  const lastMessage = props.messages.filter(message => message.isRequest).at(-1)
  console.log(lastMessage)
  if (!lastMessage) return

  textContent.value = lastMessage.text
}
</script>

<template>
  <div class="chat">
    <div class="messages">
      <div
        class="message"
        :class="{ request: message.isRequest }"
        v-for="(message, index) in messages"
        :key="message.text + index"
      >
        <span class="loader" v-if="message.loading"></span>
        <template v-else>
          <img v-if="message.image" :src="message.image" alt="attached image" />
          {{ message.text }}
        </template>
      </div>
    </div>
    <div class="input">
      <TextareaGrower
        class="textarea"
        @keydown.enter="onEnter"
        @insertLastMessage="insertLastMessage"
        v-model="textContent"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  height: 100%;
}

.textarea {
  max-width: 666px;
  margin: 0 auto;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  max-height: 100%;
  overflow-y: auto;
}

.message {
  --background: var(--accent-dim);
  --color: var(--text-on-accent);
  padding: 0.5rem 1rem;
  border-radius: 6.66px;
  margin-bottom: 0.5rem;
  max-width: 666px;
  background: var(--background);
  color: var(--color);
  position: relative;
  align-self: flex-start;

  &:after {
    content: "";
    position: absolute;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    top: 100%;
    right: 100%;
    background: var(--background);
  }

  img {
    margin: 0.5rem 0;
    border-radius: 6.66px;
    transition: border-radius 100ms ease-in-out;

    &:hover {
      border-radius: 0px;
    }
  }
}

.message.request {
  --background: var(--content-backdrop);
  --color: var(--text-on-backdrop);
  align-self: flex-end;

  &:after {
    right: unset;
    left: 100%;
  }
}

.loader {
  --offset: 0.75rem;
  --light-color: #fffa;
  --dark-color: #fff2;

  display: block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: var(--light-color);
  box-shadow:
    var(--offset) 0 var(--light-color),
    calc(var(--offset) / -1) 0 var(--light-color);
  position: relative;
  animation: loading 1s ease-out infinite;
  margin: 0.5em;
}

@keyframes loading {
  0% {
    background-color: var(--dark-color);
    box-shadow:
      var(--offset) 0 var(--dark-color),
      calc(var(--offset) / -1) 0 var(--light-color);
  }
  25% {
    background-color: var(--light-color);
    box-shadow:
      var(--offset) 0 var(--dark-color),
      calc(var(--offset) / -1) 0 var(--dark-color);
  }
  75% {
    background-color: var(--dark-color);
    box-shadow:
      var(--offset) 0 var(--light-color),
      calc(var(--offset) / -1) 0 var(--dark-color);
  }
  100% {
    background-color: var(--dark-color);
    box-shadow:
      var(--offset) 0 var(--dark-color),
      calc(var(--offset) / -1) 0 var(--light-color);
  }
}
</style>
