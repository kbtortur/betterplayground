<script setup lang="ts">
defineProps({
  messages: {
    type: Array as PropType<ChatInterfaceMessage[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: "send", message: string): void
}>()

const textContent = ref("")
const onEnter = (event: KeyboardEvent) => {
  if (event.shiftKey) return

  event.preventDefault()
  event.stopPropagation()
  emit("send", textContent.value)

  textContent.value = ""
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
        {{ message.text }}
      </div>
    </div>
    <div class="input">
      <TextareaGrower class="textarea" @keydown.enter="onEnter" v-model="textContent" />
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
  padding: 0 1rem;
}

.message {
  --color: var(--accent-dim);
  padding: 0.5rem 1rem;
  border-radius: 6.66px;
  margin-bottom: 0.5rem;
  max-width: 666px;
  background: var(--color);
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
    background: var(--color);
  }
}

.message.request {
  --color: var(--backdrop);
  align-self: flex-end;

  &:after {
    right: unset;
    left: 100%;
  }
}
</style>
