<script setup lang="ts">
import { RouterView, useRouter } from "vue-router"

import MainHeader from "@/components/MainHeader.vue"
import { useSettings } from "@/stores/settings";

const settings = useSettings()
const router = useRouter()

if (settings.openaiApiKey === "") {
  router.replace("/setup")
}

</script>

<template>
  <MainHeader />
  <RouterView />
</template>

<style scoped>
:root {
  --header-height: 1rem;
}

header {
  width: 100%;
  height: var(--header-height);
}

main {
  margin-top: calc(var(--header-height) + 1rem);
}
</style>
