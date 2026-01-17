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
const isAuth = ref(!!localStorage.getItem('token'))

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080'

const addToFavorites = async () => {
  if (isSaved.value || !isAuth.value) return

  loading.value = true
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${BACKEND_URL}/favoriteLocations`, {
      method: 'POST',
      headers: {
        'Authorization': token || '',
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
    v-if="isAuth"
    class="fav-circle-btn"
    @click="addToFavorites"
    :disabled="loading || isSaved"
    :class="{ 'is-saved': isSaved, 'is-loading': loading }"
    :title="isSaved ? 'In Favoriten gespeichert' : 'Zu Favoriten hinzufügen'"
  >
    <span class="icon">
      <template v-if="loading">⏳</template>
      <template v-else-if="isSaved">❤️</template>
      <template v-else>🤍</template>
    </span>
  </button>
</template>

<style scoped>
.fav-circle-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.4rem;
  padding: 0;
  line-height: 0;
}

.fav-circle-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.15) rotate(5deg);
  border-color: rgba(255, 255, 255, 0.8);
}

.fav-circle-btn.is-saved {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 0, 0, 0.3);
  cursor: default;
}

.fav-circle-btn.is-loading {
  cursor: wait;
}

.icon {
  display: inline-block;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.is-saved .icon {
  animation: pulse 0.4s ease-out;
}
</style>
