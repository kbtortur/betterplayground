<script setup lang="ts">
import { RouterView } from "vue-router";

import MainHeader from "@/components/main-header.vue";
</script>

<template>
  <MainHeader />
  <RouterView />
</template>

<style scoped>
header {
  width: 100%;
  height: var(--header-height);
  display: flex;
  align-items: center;
}

main {
  height: calc(100% - var(--header-height));
}
</style>
