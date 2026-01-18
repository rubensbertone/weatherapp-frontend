<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export interface FavoriteLocation {
  locationName: string
  country: string
  latitude?: number
  longitude?: number
}

const props = defineProps<{
  location: FavoriteLocation
}>()

const router = useRouter()
const temperature = ref<number | null>(null)
const loading = ref(true)

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080'

const fetchTemperature = async () => {
  if (!props.location.latitude || !props.location.longitude) return

  try {
    const response = await fetch(`${BACKEND_URL}/api/weather/details?lat=${props.location.latitude}&lon=${props.location.longitude}`)
    if (response.ok) {
      const data = await response.json()
      temperature.value = Math.round(data.current?.temp ?? data.current?.temperature ?? 0)
    }
  } catch (e) {
    console.error('Fehler beim Laden der Temperatur', e)
  } finally {
    loading.value = false
  }
}

const navigateToDetail = () => {
  router.push({
    name: 'weather',
    params: { city: props.location.locationName },
    query: {
      lat: props.location.latitude?.toString(),
      lon: props.location.longitude?.toString(),
      country: props.location.country,
      city: props.location.locationName
    }
  })
}

onMounted(() => {
  fetchTemperature()
})
</script>

<template>
  <div class="location-item glass-card" @click="navigateToDetail">
    <div class="location-info">
      <h3>{{ location.locationName }}</h3>
      <p class="country">{{ location.country }}</p>
    </div>

    <div class="weather-preview">
      <div v-if="loading" class="loader-mini"></div>
      <div v-else-if="temperature !== null" class="temp-badge">
        {{ temperature }}°
      </div>
      <div v-else class="temp-badge">--</div>
    </div>
  </div>
</template>

<style scoped>
.location-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.glass-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.location-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.8);
}

.location-info h3 {
  margin: 0 0 0.3rem 0;
  color: #fff;
  font-size: 1.4rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.location-info .country {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 1rem;
}

.weather-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.temp-badge {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.loader-mini {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
