<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  locationName: string
  country: string
  latitude?: number
  longitude?: number
}>()

const loading = ref(false)
const isSaved = ref(false)

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080'

const addToFavorites = async () => {
  if (isSaved.value) return

  loading.value = true
  const token = localStorage.getItem('token')

  if (!token) {
    alert('Bitte logge dich ein, um Favoriten zu speichern.')
    loading.value = false
    return
  }

  try {
    const response = await fetch(`${BACKEND_URL}/favoriteLocations`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        locationName: props.locationName,
        country: props.country,
        latitude: props.latitude,
        longitude: props.longitude
      })
    })

    if (response.ok) {
      isSaved.value = true
    } else {
      console.error('Fehler beim Speichern:', response.status)
      if (response.status === 401 || response.status === 403) {
        alert('Sitzung abgelaufen. Bitte neu einloggen.')
      }
    }
  } catch (e) {
    console.error('Netzwerkfehler', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button 
    class="fav-btn" 
    @click="addToFavorites" 
    :disabled="loading || isSaved"
    :class="{ 'is-saved': isSaved }"
    title="Zu Favoriten hinzufügen"
  >
    <span v-if="loading">⏳</span>
    <span v-else-if="isSaved">★ Gespeichert</span>
    <span v-else>☆ Favorisieren</span>
  </button>
</template>

<style scoped>
.fav-btn {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.fav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.fav-btn.is-saved {
  background: #ffd700; /* Gold */
  color: #333;
  border-color: #ffd700;
  cursor: default;
}

.fav-btn:disabled {
  opacity: 0.8;
}
</style>