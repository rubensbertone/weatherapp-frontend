<script setup lang="ts">
import FavoriteLocationsFetcher from './components/FavoriteLocationsFetcher.vue'
</script>

<template>
  <div id="app">
    <header>
      <h1>Weather App</h1>
    </header>
    <main>
      <FavoriteLocationsFetcher />
    </main>
  </div>
</template>

<style scoped>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}
</style>
