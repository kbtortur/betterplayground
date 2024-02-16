<script setup lang="ts">
import { routeList } from "@/router"
</script>

<template>
  <header>
    <RouterLink v-for="view in routeList" :to="view.path" :key="view.path">
      {{ view.name }}
    </RouterLink>
  </header>
</template>

<style scoped>
a {
  margin-right: 0.5em;
  font-size: 1.5rem;
  text-wrap: nowrap;
}

@media screen and (max-width: 750px) {
  a {
    font-size: 1rem;
  }
}
</style>
