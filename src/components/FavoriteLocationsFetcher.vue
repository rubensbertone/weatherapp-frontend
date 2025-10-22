<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LocationItem, { type FavoriteLocation } from './LocationItem.vue'

const locations = ref<FavoriteLocation[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const BACKEND_URL = 'http://localhost:8080/favoriteLocations'

const fetchLocations = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await fetch(BACKEND_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    locations.value = await response.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ein Fehler ist aufgetreten'
    console.error('Fehler beim Laden der Locations:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLocations()
})
</script>

<template>
  <div class="favorite-locations">
    <h2>Favorite Locations</h2>

    <div v-if="loading" class="loading">
      Lade Locations...
    </div>

    <div v-else-if="error" class="error">
      Fehler: {{ error }}
    </div>

    <div v-else-if="locations.length === 0" class="empty">
      Keine Locations gefunden
    </div>

    <div v-else class="locations-list">
      <LocationItem
        v-for="location in locations"
        :key="location.locationName"
        :location="location"
      />
    </div>
  </div>
</template>

<style scoped>
.favorite-locations {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  color: #42b983;
  margin-bottom: 1.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  padding: 1rem;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c00;
}

.empty {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.locations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
