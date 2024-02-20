<script setup lang="ts">
import { ref } from "vue"

import { ls } from "@/composables/local-storage"
import { useSettings } from "@/stores/settings"

const settings = useSettings()

const password = ref("")
const decrypted = ref("")
const encrypted = ref(ls("encryptedApiToken") ?? "")

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const arrayBufferToBase64 = (buffer: Uint8Array) => {
  return btoa([...buffer].map(c => String.fromCodePoint(c)).join(""))
}

const base64ToArrayBuffer = (base64: string) => {
  const ascii = atob(base64)
  return new Uint8Array(
    [...ascii].map(c => {
      const codePoint = c.codePointAt(0)
      if (!codePoint) throw new Error("Invalid code point")

      return codePoint
    })
  )
}

const getPasswordKey = (password: string) => {
  return crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveKey",
  ])
}

const deriveKey = (passwordKey: CryptoKey, salt: Uint8Array, keyUsage: KeyUsage[]) => {
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 250000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    keyUsage
  )
}

const encrypt = async () => {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const passwordKey = await getPasswordKey(password.value)
  const aesKey = await deriveKey(passwordKey, salt, ["encrypt"])

  const encryptedContent = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoder.encode(decrypted.value)
  )

  const encryptedContentArray = new Uint8Array(encryptedContent)
  const buffer = new Uint8Array(
    salt.byteLength + iv.byteLength + encryptedContentArray.byteLength
  )
  buffer.set(salt, 0)
  buffer.set(iv, salt.byteLength)
  buffer.set(encryptedContentArray, salt.byteLength + iv.byteLength)

  const base64 = arrayBufferToBase64(buffer)
  encrypted.value = base64

  ls("encryptedApiToken", base64)
}

const decrypt = async () => {
  try {
    const encryptedDataBuffer = base64ToArrayBuffer(encrypted.value)
    const salt = encryptedDataBuffer.slice(0, 16)
    const iv = encryptedDataBuffer.slice(16, 16 + 12)
    const encryptedContent = encryptedDataBuffer.slice(16 + 12)
    const passwordKey = await getPasswordKey(password.value)
    const aesKey = await deriveKey(passwordKey, new Uint8Array(salt), ["decrypt"])

    const decryptedContent = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      aesKey,
      encryptedContent
    )

    decrypted.value = decoder.decode(decryptedContent)
  } catch (error) {
    console.error("Error decrypting", error)
  }
}
</script>

<template>
  <main>
    <h1>Enter your OpenAi API Key please 🥺</h1>
    <input type="text" placeholder="OpenAI API Key" v-model="settings.openaiApiKey" />

    <br />
    <input v-model="password" placeholder="password" type="text" />
    <input v-model="decrypted" placeholder="decrypted" type="text" />
    <input v-model="encrypted" placeholder="encrypted" type="text" />

    <br />
    <button @click="encrypt">encrypt</button>
    <button @click="decrypt">decrypt</button>
  </main>
</template>
