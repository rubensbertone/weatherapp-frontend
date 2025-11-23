<script setup lang="ts">
import { ref, onMounted } from 'vue'
// WICHTIG: Prüfe links in deinen Dateien, ob "LocationItem.vue" wirklich groß geschrieben ist!
import LocationItem, { type FavoriteLocation } from '../components/LocationItem.vue'

const locations = ref<FavoriteLocation[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Debugging: Wir machen die URL reactive, damit wir sie im Template sehen können
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080'

const fetchLocations = async () => {
  try {
    loading.value = true
    error.value = null

    console.log("Starte Fetch von:", `${BACKEND_URL}/favoriteLocations`)

    const response = await fetch(`${BACKEND_URL}/favoriteLocations`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Daten empfangen:", data)
    locations.value = data

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

    <div style="background-color: #ff3333; color: white; padding: 15px; margin-bottom: 20px; border: 3px solid yellow; border-radius: 8px; font-family: monospace;">
      <h3 style="color: white; margin-top: 0;">⚠️ DEBUG INFO</h3>
      <p><strong>Genutzte URL:</strong> {{ BACKEND_URL }}/favoriteLocations</p>
      <p><strong>Lade-Status:</strong> {{ loading }}</p>
      <p><strong>Fehler:</strong> {{ error ?? 'Keine Fehler' }}</p>
      <p><strong>Gefundene Orte (Anzahl):</strong> {{ locations.length }}</p>

      <div v-if="locations.length > 0" style="background: black; padding: 10px; margin-top: 10px; font-size: 0.8rem;">
        <strong>Erster Eintrag Rohdaten:</strong>
        <pre>{{ locations[0] }}</pre>
      </div>
    </div>
    <div v-if="loading" class="loading">
      Lade Locations...
    </div>

    <div v-else-if="error" class="error">
      Fehler: {{ error }}
    </div>

    <div v-else-if="locations.length === 0" class="empty">
      Keine Locations gefunden (Liste ist leer).
    </div>

    <div v-else class="locations-list">
      <LocationItem
        v-for="(location, index) in locations"
        :key="location.locationName + index"
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
  /* Ich habe die Farbe sicherheitshalber auf dunkel gesetzt, falls der Hintergrund hell ist */
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: white;
  border-radius: 8px;
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
  background: white;
  border-radius: 8px;
}

.locations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
