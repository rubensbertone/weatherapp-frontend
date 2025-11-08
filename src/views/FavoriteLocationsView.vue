<script setup lang="ts">
import FavoriteLocationsFetcher from '../components/FavoriteLocationsFetcher.vue'
</script>

<template>
  <div class="favorite-view">
    <FavoriteLocationsFetcher />
  </div>
</template>

<style scoped>
.favorite-view {
  min-height: 80vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
</style>
