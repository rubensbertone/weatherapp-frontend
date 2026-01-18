<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface WeatherData {
  current: {
    temp: number
    feelsLike: number
    description: string
    humidity: number | null
    windSpeed: number
    windDirection: string
    pressure: number
    visibility: number
    uvIndex: number | null
    cloudCover: number | null
  }
  hourly: Array<{
    timestamp: number
    temp: number
  }>
  forecast: Array<{
    timestamp: number
    description: string
    tempMax: number
    tempMin: number
  }>
  airQuality: {
    aqi: number
    category?: string
    pm25: number
    pm10: number
    o3: number
    no2: number
  }
  alerts: Array<{
    severity: string
    message?: string
    type?: string
  }>
}

interface FavoriteItem {
  latitude: number
  longitude: number
  locationName?: string
  country?: string
}

const route = useRoute()
const router = useRouter()

const cityName = computed(() => (route.query.city as string) || (route.params.city as string) || 'Unbekannter Ort')
const lat = computed(() => parseFloat(route.query.lat as string) || 0)
const lon = computed(() => parseFloat(route.query.lon as string) || 0)
const country = computed(() => route.query.country as string || '')
const state = computed(() => route.query.state as string || '')

const loading = ref(true)
const favLoading = ref(false)
const error = ref<string | null>(null)
const weatherData = ref<WeatherData | null>(null)
const isFavorite = ref(false)
const isAuth = ref(false)

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080'

const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

const formatDay = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('de-DE', { weekday: 'long' })
}

const getAqiColor = (aqi: number): string => {
  if (aqi <= 50) return '#4caf50'
  if (aqi <= 100) return '#ffeb3b'
  if (aqi <= 150) return '#ff9800'
  if (aqi <= 200) return '#f44336'
  if (aqi <= 300) return '#9c27b0'
  return '#8b0000'
}

const units = ref('m')

const toggleUnits = () => {
  units.value = units.value === 'm' ? 'e' : 'm'
  fetchWeatherData()
}

const fetchWeatherData = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch(`${BACKEND_URL}/api/weather/details?lat=${lat.value}&lon=${lon.value}&units=${units.value}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()

    weatherData.value = {
      ...data,
      current: {
        temp: data.current?.temp ?? data.current?.temperature ?? 0,
        feelsLike: data.current?.feelsLike ?? data.current?.feels_like ?? data.current?.temp ?? 0,
        description: data.current?.description ?? 'Keine Beschreibung',
        humidity: data.current?.humidity ?? 0,
        windSpeed: data.current?.windSpeed ?? data.current?.wind_speed ?? 0,
        windDirection: data.current?.windDirection ?? data.current?.wind_direction ?? '',
        pressure: data.current?.pressure ?? 0,
        visibility: data.current?.visibility ?? 0,
        uvIndex: data.current?.uvIndex ?? data.current?.uv_index ?? 0,
        cloudCover: data.current?.cloudCover ?? data.current?.cloud_cover ?? 0
      }
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Fehler beim Laden'
  } finally {
    loading.value = false
  }
}

const checkIfFavorite = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    isAuth.value = false
    return
  }
  isAuth.value = true
  try {
    const response = await fetch(`${BACKEND_URL}/favoriteLocations`, {
      headers: { 'Authorization': token }
    })
    if (response.ok) {
      const favorites: FavoriteItem[] = await response.json()
      isFavorite.value = favorites.some((fav: FavoriteItem) =>
        Math.abs(fav.latitude - lat.value) < 0.01 &&
        Math.abs(fav.longitude - lon.value) < 0.01
      )
    }
  } catch (e) {
    console.error(e)
  }
}

const toggleFavorite = async () => {
  if (!isAuth.value) { router.push('/login'); return }
  const token = localStorage.getItem('token')
  if (!token) return
  favLoading.value = true
  try {
    if (isFavorite.value) {
      const response = await fetch(`${BACKEND_URL}/favoriteLocations?latitude=${lat.value}&longitude=${lon.value}`, {
        method: 'DELETE', headers: { 'Authorization': token }
      })
      if (response.ok) isFavorite.value = false
    } else {
      const response = await fetch(`${BACKEND_URL}/favoriteLocations`, {
        method: 'POST',
        headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: cityName.value, country: country.value,
          latitude: lat.value, longitude: lon.value
        })
      })
      if (response.ok) isFavorite.value = true
    }
  } catch (e) { console.error(e) } finally { favLoading.value = false }
}

watch([lat, lon], () => { fetchWeatherData(); checkIfFavorite() })
onMounted(() => { fetchWeatherData(); checkIfFavorite() })
</script>

<template>
  <div class="weather-detail">
    <div class="weather-container">
      <button class="back-button" @click="router.push('/')">← Zurück</button>

      <div v-if="loading" class="loading-state">
        <span class="loader"></span>
        <p>Lade Wetterdaten...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button class="btn-retry" @click="fetchWeatherData">Erneut versuchen</button>
      </div>

      <div v-else-if="weatherData" class="weather-content">
        <div class="location-header">
          <div class="unit-toggle">
            <button @click="toggleUnits" class="btn-unit">
              Einheit: {{ units === 'm' ? '°C (Metrisch)' : '°F (Imperial)' }}
            </button>
          </div>
          <div class="header-row">
            <h1>{{ cityName }}</h1>
            <button v-if="isAuth" class="fav-circle-btn" @click="toggleFavorite" :disabled="favLoading" :class="{ 'is-saved': isFavorite }">
              <span v-if="favLoading">⏳</span>
              <span v-else>{{ isFavorite ? '❤️' : '🤍' }}</span>
            </button>
          </div>
          <p class="location-info">{{ state ? `${state}, ` : '' }}{{ country }}</p>
          <p class="coordinates">{{ lat.toFixed(4) }}°, {{ lon.toFixed(4) }}°</p>
        </div>

        <!-- Alerts Section -->
        <div v-if="weatherData.alerts && weatherData.alerts.length > 0" class="alerts-container">
          <div v-for="(alert, index) in weatherData.alerts" :key="index" class="alert-card">
            <div class="alert-header">
              <span class="alert-icon">⚠️</span>
              <h3>{{ alert.type || 'Wetterwarnung' }}</h3>
            </div>
            <p class="alert-message">{{ alert.message }}</p>
            <div class="alert-severity">Stufe: {{ alert.severity }}</div>
          </div>
        </div>

        <div v-if="weatherData.current" class="current-weather glass-card">
          <div class="section-header"><h2>Aktuelle Bedingungen</h2></div>
          <div class="current-main">
            <div class="temp-display">
              <div class="temp-info">
                <div class="temperature">
                  {{ Math.round(weatherData.current.temp) }}{{ units === 'm' ? '°C' : '°F' }}
                </div>
                <div class="feels-like">
                  Gefühlt {{ Math.round(weatherData.current.feelsLike) }}{{ units === 'm' ? '°C' : '°F' }}
                </div>
                <div class="description">{{ weatherData.current.description }}</div>
              </div>
            </div>
          </div>
          <div class="current-details">
            <div class="detail-item">
              <div class="detail-label">Luftfeuchtigkeit</div>
              <div class="detail-value">{{ weatherData.current.humidity }}%</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Wind</div>
              <div class="detail-value">
                {{ Math.round(weatherData.current.windSpeed) }} {{ units === 'm' ? 'km/h' : 'mph' }}
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-label">UV-Index</div>
              <div class="detail-value">{{ weatherData.current.uvIndex }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Luftdruck</div>
              <div class="detail-value">{{ Math.round(weatherData.current.pressure) }} hPa</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Bewölkung</div>
              <div class="detail-value">{{ weatherData.current.cloudCover }}%</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Sichtweite</div>
              <div class="detail-value">
                {{ weatherData.current.visibility }} {{ units === 'm' ? 'km' : 'mi' }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="weatherData.hourly?.length" class="hourly-forecast glass-card">
          <div class="section-header"><h2>Stündliche Vorhersage</h2></div>
          <div class="hourly-scroll">
            <div v-for="hour in weatherData.hourly" :key="hour.timestamp" class="hourly-item">
              <div class="hour-time">{{ formatTime(hour.timestamp) }}</div>
              <div class="hour-temp">
                {{ Math.round(hour.temp) }}{{ units === 'm' ? '°C' : '°F' }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="weatherData.forecast?.length" class="forecast glass-card">
          <div class="section-header"><h2>5-Tage Vorhersage</h2></div>
          <div class="forecast-list">
            <div v-for="day in weatherData.forecast" :key="day.timestamp" class="forecast-item">
              <div class="forecast-day">{{ formatDay(day.timestamp) }}</div>
              <div class="forecast-desc">{{ day.description }}</div>
              <div class="forecast-temps">
                <div class="forecast-temps">
                  <span class="temp-max">{{ Math.round(day.tempMax) }}°</span>
                  <span class="temp-separator">/</span>
                  <span class="temp-min">{{ Math.round(day.tempMin) }}°</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="weatherData.airQuality" class="air-quality glass-card">
          <div class="section-header"><h2>Luftqualität</h2></div>
          <div class="aqi-display">
            <div class="aqi-value" :style="{ backgroundColor: getAqiColor(weatherData.airQuality.aqi) + '40' }">
              <div class="aqi-number" :style="{ color: getAqiColor(weatherData.airQuality.aqi) }">{{ weatherData.airQuality.aqi }}</div>
              <div class="aqi-label">{{ weatherData.airQuality.category || 'AQI' }}</div>
            </div>
            <div class="pollutants">
              <div v-if="weatherData.airQuality.pm25" class="pollutant-item">
                <div class="pollutant-name">PM2.5</div>
                <div class="pollutant-value">{{ weatherData.airQuality.pm25.toFixed(1) }} µg/m³</div>
              </div>
              <div v-if="weatherData.airQuality.pm10" class="pollutant-item">
                <div class="pollutant-name">PM10</div>
                <div class="pollutant-value">{{ weatherData.airQuality.pm10.toFixed(1) }} µg/m³</div>
              </div>
              <div v-if="weatherData.airQuality.o3" class="pollutant-item">
                <div class="pollutant-name">O₃</div>
                <div class="pollutant-value">{{ weatherData.airQuality.o3.toFixed(1) }} µg/m³</div>
              </div>
              <div v-if="weatherData.airQuality.no2" class="pollutant-item">
                <div class="pollutant-name">NO₂</div>
                <div class="pollutant-value">{{ weatherData.airQuality.no2.toFixed(1) }} µg/m³</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-detail { width: 100%; min-height: 100vh; padding: 2rem; display: flex; justify-content: center; }
.weather-container { max-width: 1200px; width: 100%; }
.back-button { background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.5); color: white; padding: 0.75rem 1.5rem; border-radius: 12px; cursor: pointer; margin-bottom: 2rem; font-weight: 600; }
.location-header { text-align: center; margin-bottom: 2rem; color: white; }
.header-row { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 0.5rem; }
.location-header h1 { font-size: 3.5rem; margin: 0; font-weight: 800; text-shadow: 0 4px 10px rgba(0,0,0,0.2); }
.fav-circle-btn { background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 1.5rem; }
.coordinates { color: rgba(255, 255, 255, 0.7); font-size: 0.9rem; font-family: monospace; }

.glass-card {
  background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.5); padding: 2rem;
  border-radius: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem; color: #1a3a4a;
}

.section-header { margin-bottom: 1.5rem; border-bottom: 1px solid rgba(26, 58, 74, 0.2); padding-bottom: 0.5rem; }
.section-header h2 { color: #1a3a4a; font-size: 1.5rem; margin: 0; font-weight: 700; }

.temperature { color: #1a3a4a; font-size: 5rem; font-weight: 800; line-height: 1; }
.feels-like { color: #4a6a7a; font-size: 1.2rem; margin-top: 0.5rem; font-weight: 600; }
.description { color: #1a3a4a; font-size: 1.4rem; text-transform: capitalize; margin-top: 0.5rem; font-weight: 600; }

.current-details, .pollutants { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 2rem; }
.detail-item, .pollutant-item { background: rgba(255, 255, 255, 0.4); padding: 1.25rem; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.5); text-align: center; }
.detail-label, .pollutant-name { color: #4a6a7a; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; margin-bottom: 0.3rem; }
.detail-value, .pollutant-value { color: #1a3a4a; font-size: 1.3rem; font-weight: 700; }

.hourly-scroll { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem; }
.hourly-item { flex-shrink: 0; background: rgba(255, 255, 255, 0.4); padding: 1rem 1.5rem; border-radius: 16px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.5); min-width: 90px; }

.forecast-list { display: flex; flex-direction: column; gap: 0.8rem; }
.forecast-item { display: grid; grid-template-columns: 140px 1fr auto; align-items: center; padding: 1.2rem; background: rgba(255, 255, 255, 0.4); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.5); }

.aqi-display { display: flex; flex-direction: column; gap: 2rem; }
.aqi-value { display: flex; flex-direction: column; align-items: center; padding: 2.5rem; border-radius: 16px; border: 2px solid rgba(255, 255, 255, 0.3); }
.aqi-number { font-size: 4rem; font-weight: 700; line-height: 1; }
.aqi-label { font-size: 1.1rem; color: #1a3a4a; margin-top: 0.75rem; font-weight: 600; text-transform: uppercase; }

.loading-state, .error-state { text-align: center; padding: 4rem; color: white; }
.loader { width: 40px; height: 40px; border: 4px solid #fff; border-bottom-color: transparent; border-radius: 50%; display: inline-block; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.unit-toggle {display: flex; justify-content: flex-end; margin-bottom: 1rem;}

.btn-unit {background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.4); color: white; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;}

.btn-unit:hover {background: rgba(255, 255, 255, 0.4);}

/* Alerts Styles */
.alerts-container {
  margin-bottom: 1.5rem;
}

.alert-card {
  background: rgba(255, 82, 82, 0.9); /* Rötlicher Hintergrund für Warnungen */
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}

.alert-icon {
  font-size: 1.5rem;
}

.alert-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
}

.alert-message {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  line-height: 1.4;
}

.alert-severity {
  font-size: 0.85rem;
  opacity: 0.9;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.2);
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
}
</style>
