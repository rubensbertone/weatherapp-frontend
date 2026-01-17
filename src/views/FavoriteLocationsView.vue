<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LocationItem, { type FavoriteLocation } from '../components/LocationItem.vue'

const locations = ref<FavoriteLocation[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const router = useRouter()
const BACKEND_URL = import.meta.env. VITE_BACKEND_URL ??  'http://localhost:8080'

const fetchLocations = async () => {
  try {
    loading.value = true
    error.value = null

    const token = localStorage. getItem('token')
    
    if (!token) {
      // Kein Token vorhanden -> direkt zum Login oder Fehler anzeigen
      error.value = "Nicht eingeloggt."
      return
    }

    const response = await fetch(`${BACKEND_URL}/favoriteLocations`, {
      method: 'GET',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 401 || response.status === 403) {
      // Token ungültig -> Logout erzwingen
      localStorage.removeItem('token')
      window.dispatchEvent(new CustomEvent('auth-changed'))
      router.push('/login')
      return
    }

    if (!response.ok) {
      throw new Error(`Status: ${response.status}`)
    }

    locations.value = await response.json()
  } catch (e) {
    error.value = e instanceof Error ?  e.message : 'Ein Fehler ist aufgetreten'
    console.error(e)
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
    <h2 class="page-title">Meine Wetter-Orte</h2>

    <div v-if="loading" class="state-message">
      <span class="loader">⏳</span> Lade Daten...
    </div>

    <div v-else-if="error" class="error-message">
      Entschuldigung, es gab ein Problem: {{ error }}
    </div>

    <div v-else-if="locations.length === 0" class="state-message">
      Keine Orte gefunden.
    </div>

    <div v-else class="locations-grid">
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.locations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.state-message {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  color: #555;
  font-size: 1.1rem;
}

.error-message {
  padding: 1.5rem;
  background-color: #ffebee;
  border-left:  5px solid #ef5350;
  border-radius: 8px;
  color: #c62828;
  margin-bottom: 1rem;
}

.loader {
  display: inline-block;
  animation:  spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
