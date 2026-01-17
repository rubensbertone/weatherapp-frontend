<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const route = useRoute()
const router = useRouter()

const cityName = ref(route.params.city as string)
const lat = ref(parseFloat(route.query.lat as string))
const lon = ref(parseFloat(route.query.lon as string))
const country = ref(route.query.country as string)
const state = ref(route.query.state as string)

const loading = ref(true)
const error = ref<string | null>(null)
const weatherData = ref<WeatherData | null>(null)

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080'

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

const formatDay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('de-DE', { weekday: 'long' })
}

const getAqiColor = (aqi: number): string => {
  if (aqi <= 50) return '#4caf50'
  if (aqi <= 100) return '#ffeb3b'
  if (aqi <= 150) return '#ff9800'
  if (aqi <= 200) return '#f44336'
  if (aqi <= 300) return '#9c27b0'
  return '#8b0000'
}

const getAlertSeverityLabel = (severity: string): string => {
  const severityMap: Record<string, string> = {
    'extreme': 'Extrem',
    'severe': 'Schwer',
    'moderate': 'Mittel',
    'minor': 'Gering',
    'unknown': 'Unbekannt'
  }
  return severityMap[severity?.toLowerCase()] || severity || 'Warnung'
}

const fetchWeatherData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/weather/details?lat=${lat.value}&lon=${lon.value}`
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    weatherData.value = data
    loading.value = false
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Fehler beim Laden der Wetterdaten'
    loading.value = false
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  fetchWeatherData()
})
</script>

<template>
  <div class="weather-detail">
    <div class="weather-container">
      <button class="back-button" @click="goBack">
        ← Zurück
      </button>

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
          <h1>{{ cityName }}</h1>
          <p class="location-info">
            {{ state ?  `${state}, ` : '' }}{{ country }}
          </p>
          <p class="coordinates">{{ lat.toFixed(4) }}°, {{ lon.toFixed(4) }}°</p>
        </div>

        <div v-if="weatherData.current && Object.keys(weatherData.current).length > 0" class="current-weather glass-card">
          <div class="section-header">
            <h2>Aktuelle Bedingungen</h2>
          </div>

          <div class="current-main">
            <div class="temp-display">
              <div class="temp-info">
                <div class="temperature">{{ Math.round(weatherData.current.temp) }}°C</div>
                <div class="feels-like">Gefühlt {{ Math.round(weatherData.current.feelsLike) }}°C</div>
                <div class="description">{{ weatherData.current.description }}</div>
              </div>
            </div>
          </div>

          <div class="current-details">
            <div class="detail-item" v-if="weatherData.current.humidity !== null">
              <div class="detail-label">Luftfeuchtigkeit</div>
              <div class="detail-value">{{ weatherData. current.humidity }}%</div>
            </div>
            <div class="detail-item" v-if="weatherData.current. windSpeed">
              <div class="detail-label">Wind</div>
              <div class="detail-value">{{ Math.round(weatherData. current.windSpeed) }} km/h {{ weatherData.current.windDirection }}</div>
            </div>
            <div class="detail-item" v-if="weatherData.current.pressure">
              <div class="detail-label">Luftdruck</div>
              <div class="detail-value">{{ Math.round(weatherData.current.pressure) }} hPa</div>
            </div>
            <div class="detail-item" v-if="weatherData.current.visibility">
              <div class="detail-label">Sichtweite</div>
              <div class="detail-value">{{ weatherData.current.visibility }} km</div>
            </div>
            <div class="detail-item" v-if="weatherData.current.uvIndex !== null">
              <div class="detail-label">UV-Index</div>
              <div class="detail-value">{{ weatherData.current. uvIndex }}</div>
            </div>
            <div class="detail-item" v-if="weatherData.current.cloudCover !== null">
              <div class="detail-label">Bewölkung</div>
              <div class="detail-value">{{ weatherData.current.cloudCover }}%</div>
            </div>
          </div>
        </div>

        <div v-if="weatherData.hourly && weatherData.hourly. length > 0" class="hourly-forecast glass-card">
          <div class="section-header">
            <h2>Stündliche Vorhersage</h2>
          </div>
          <div class="hourly-scroll">
            <div v-for="(hour, index) in weatherData.hourly" :key="index" class="hourly-item">
              <div class="hour-time">{{ formatTime(hour.timestamp) }}</div>
              <div class="hour-temp">{{ Math.round(hour. temp) }}°C</div>
            </div>
          </div>
        </div>

        <div v-if="weatherData. forecast && weatherData.forecast.length > 0" class="forecast glass-card">
          <div class="section-header">
            <h2>5-Tage Vorhersage</h2>
          </div>
          <div class="forecast-list">
            <div v-for="(day, index) in weatherData.forecast" :key="index" class="forecast-item">
              <div class="forecast-day">{{ formatDay(day.timestamp) }}</div>
              <div class="forecast-desc">{{ day.description }}</div>
              <div class="forecast-temps">
                <span class="temp-max">{{ Math.round(day.tempMax) }}°</span>
                <span class="temp-separator">/</span>
                <span class="temp-min">{{ Math.round(day.tempMin) }}°</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="weatherData.airQuality && weatherData.airQuality.aqi" class="air-quality glass-card">
          <div class="section-header">
            <h2>Luftqualität</h2>
          </div>
          <div class="aqi-display">
            <div class="aqi-value" :style="{ backgroundColor: getAqiColor(weatherData.airQuality. aqi) + '40' }">
              <div class="aqi-number" :style="{ color: getAqiColor(weatherData.airQuality.aqi) }">
                {{ weatherData.airQuality.aqi }}
              </div>
              <div class="aqi-label">{{ weatherData.airQuality.category || 'AQI' }}</div>
            </div>
            <div class="pollutants">
              <div v-if="weatherData.airQuality.pm25" class="pollutant-item">
                <div class="pollutant-name">PM2.5</div>
                <div class="pollutant-value">{{ weatherData.airQuality.pm25.toFixed(1) }} µg/m³</div>
              </div>
              <div v-if="weatherData.airQuality. pm10" class="pollutant-item">
                <div class="pollutant-name">PM10</div>
                <div class="pollutant-value">{{ weatherData.airQuality. pm10.toFixed(1) }} µg/m³</div>
              </div>
              <div v-if="weatherData.airQuality.o3" class="pollutant-item">
                <div class="pollutant-name">O₃</div>
                <div class="pollutant-value">{{ weatherData.airQuality.o3.toFixed(1) }} µg/m³</div>
              </div>
              <div v-if="weatherData.airQuality.no2" class="pollutant-item">
                <div class="pollutant-name">NO₂</div>
                <div class="pollutant-value">{{ weatherData. airQuality.no2.toFixed(1) }} µg/m³</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="weatherData.alerts && weatherData.alerts.length > 0" class="alerts glass-card">
          <div class="section-header">
            <h2>Wetterwarnungen</h2>
          </div>
          <div v-for="(alert, index) in weatherData.alerts" :key="index"
               class="alert-item"
               :class="`alert-${alert.severity?.toLowerCase() || 'unknown'}`">
            <div class="alert-type">{{ getAlertSeverityLabel(alert.severity) }}</div>
            <div class="alert-message">{{ alert.message || alert.type }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-detail {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.weather-container {
  max-width: 1200px;
  width: 100%;
}

.back-button {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateX(-5px);
}

.loading-state, .error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.loading-state p, .error-state p {
  color: white;
  font-size: 1.2rem;
  margin-top: 1rem;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius:  50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #0b6b8c;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor:  pointer;
  transition: transform 0.2s;
}

.btn-retry:hover {
  transform: translateY(-2px);
}

.weather-content {
  display:  flex;
  flex-direction: column;
  gap: 1.5rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 2rem;
  border-radius:  24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.section-header h2 {
  color:  white;
  font-size:  1.5rem;
  margin:  0;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.location-header {
  text-align: center;
  margin-bottom: 1rem;
}

.location-header h1 {
  color:  white;
  font-size:  3rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.location-info {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin:  0.5rem 0;
  font-weight: 500;
}

.coordinates {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
  font-family: 'Courier New', monospace;
}

.current-weather {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.current-main {
  display: flex;
  justify-content: center;
}

.temp-display {
  display: flex;
  align-items: center;
  justify-content: center;
}

.temp-info {
  text-align: center;
}

.temperature {
  color: white;
  font-size: 5rem;
  font-weight:  700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.feels-like {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin:  0.5rem 0;
  font-weight: 500;
}

.description {
  color: white;
  font-size: 1.3rem;
  margin:  0.8rem 0 0 0;
  font-weight: 500;
  text-transform: capitalize;
}

.current-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  color: white;
  font-size: 1.3rem;
  font-weight:  600;
}

.hourly-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.hourly-scroll::-webkit-scrollbar {
  height: 8px;
}

.hourly-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.hourly-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

.hourly-item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 100px;
}

.hour-time {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  font-weight:  600;
}

.hour-temp {
  color: white;
  font-size: 1.3rem;
  font-weight:  600;
}

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.forecast-item {
  display: grid;
  grid-template-columns: 140px 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.forecast-day {
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.forecast-desc {
  color: rgba(255, 255, 255, 0.9);
  text-transform: capitalize;
  font-size: 0.95rem;
}

.forecast-temps {
  display: flex;
  gap: 0.5rem;
  align-items:  center;
  font-size: 1.1rem;
  font-weight: 600;
}

.temp-max {
  color: white;
}

.temp-separator {
  color: rgba(255, 255, 255, 0.5);
}

.temp-min {
  color: rgba(255, 255, 255, 0.7);
}

.aqi-display {
  display:  flex;
  flex-direction: column;
  gap: 2rem;
}

.aqi-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem;
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.aqi-number {
  font-size: 4rem;
  font-weight:  700;
  line-height: 1;
}

.aqi-label {
  font-size: 1.1rem;
  color: white;
  margin-top: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pollutants {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.pollutant-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pollutant-name {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  font-weight:  600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pollutant-value {
  color:  white;
  font-weight: 600;
  font-size: 1.1rem;
}

.alerts {
  border:  2px solid rgba(255, 152, 0, 0.5);
}

.alert-item {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  border-left: 4px solid;
  margin-bottom: 1rem;
}

.alert-item:last-child {
  margin-bottom: 0;
}

.alert-extreme {
  border-left-color: #8b0000;
  background: rgba(139, 0, 0, 0.15);
}

.alert-severe {
  border-left-color: #f44336;
  background: rgba(244, 67, 54, 0.15);
}

.alert-moderate {
  border-left-color: #ff9800;
  background: rgba(255, 152, 0, 0.15);
}

.alert-minor {
  border-left-color: #ffeb3b;
  background: rgba(255, 235, 59, 0.15);
}

.alert-unknown {
  border-left-color: #9e9e9e;
  background: rgba(158, 158, 158, 0.15);
}

.alert-type {
  color: white;
  font-weight: 700;
  margin:  0 0 0.5rem 0;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.alert-message {
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .weather-detail {
    padding: 1rem;
  }

  .temp-display {
    flex-direction: column;
  }

  .temperature {
    font-size: 3.5rem;
  }

  .location-header h1 {
    font-size: 2rem;
  }

  .current-details {
    grid-template-columns: 1fr;
  }

  .forecast-item {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .forecast-temps {
    justify-content: center;
  }
}
</style>
