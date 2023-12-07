<script setup lang="ts">
import { routeList } from "@/router"
</script>

<template>
  <header>
    <RouterLink v-for="view in routeList" :to="view.path" :key="view.path">{{
      view.name
    }}</RouterLink>
  </header>
</template>

<style scoped>
a {
  margin-right: 1rem;
  font-size: 1.5rem;
}
</style>
