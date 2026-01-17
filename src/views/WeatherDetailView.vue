<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const cityName = ref(route.params.city as string)
const lat = ref(parseFloat(route.query.lat as string))
const lon = ref(parseFloat(route.query.lon as string))
const country = ref(route.query.country as string)
const state = ref(route.query.state as string)

const loading = ref(true)
const error = ref<string | null>(null)

const weatherData = ref({
  current: {
    temp: 22,
    feelsLike: 20,
    description: 'Teilweise bewölkt',
    icon: '⛅',
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NW',
    pressure: 1013,
    visibility: 10,
    uvIndex: 5,
    cloudCover: 40
  },
  forecast: [
    { day: 'Montag', tempMax: 24, tempMin: 18, icon: '🌤️', description: 'Heiter' },
    { day:  'Dienstag', tempMax: 26, tempMin:  19, icon: '☀️', description: 'Sonnig' },
    { day:  'Mittwoch', tempMax: 23, tempMin: 17, icon: '🌧️', description: 'Regnerisch' },
    { day: 'Donnerstag', tempMax: 21, tempMin: 16, icon: '⛈️', description: 'Gewitter' },
    { day: 'Freitag', tempMax: 25, tempMin: 18, icon: '🌤️', description: 'Heiter' }
  ],
  hourly: [
    { time:  '14:00', temp: 22, icon: '⛅' },
    { time: '15:00', temp: 23, icon: '☀️' },
    { time: '16:00', temp: 24, icon: '☀️' },
    { time: '17:00', temp: 23, icon: '🌤️' },
    { time:  '18:00', temp: 21, icon: '🌤️' },
    { time: '19:00', temp: 20, icon: '🌙' }
  ],
  airQuality: {
    aqi: 45,
    category: 'Gut',
    pm25: 12,
    pm10: 25,
    o3: 35,
    no2: 18
  },
  alerts: [
    { type: 'Warnung', message: 'Starkregen möglich am Mittwoch', severity: 'medium' }
  ]
})

const fetchWeatherData = async () => {
  loading.value = true
  error. value = null

  try {
    await new Promise(resolve => setTimeout(resolve, 800))

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

      <div v-else class="weather-content">
        <div class="location-header">
          <h1>{{ cityName }}</h1>
          <p class="location-info">
            {{ state ? `${state}, ` : '' }}{{ country }}
          </p>
          <p class="coordinates">📍 {{ lat.toFixed(4) }}°, {{ lon.toFixed(4) }}°</p>
        </div>

        <div class="current-weather glass-card">
          <div class="current-main">
            <div class="temp-display">
              <span class="icon-large">{{ weatherData.current.icon }}</span>
              <div class="temp-info">
                <h2 class="temperature">{{ weatherData.current.temp }}°C</h2>
                <p class="feels-like">Gefühlt {{ weatherData.current.feelsLike }}°C</p>
                <p class="description">{{ weatherData.current.description }}</p>
              </div>
            </div>
          </div>

          <div class="current-details">
            <div class="detail-item">
              <span class="detail-icon">💧</span>
              <div>
                <p class="detail-label">Luftfeuchtigkeit</p>
                <p class="detail-value">{{ weatherData.current.humidity }}%</p>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon">💨</span>
              <div>
                <p class="detail-label">Wind</p>
                <p class="detail-value">{{ weatherData.current.windSpeed }} km/h {{ weatherData.current.windDirection }}</p>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🌡️</span>
              <div>
                <p class="detail-label">Luftdruck</p>
                <p class="detail-value">{{ weatherData.current.pressure }} hPa</p>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon">👁️</span>
              <div>
                <p class="detail-label">Sicht</p>
                <p class="detail-value">{{ weatherData. current.visibility }} km</p>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon">☀️</span>
              <div>
                <p class="detail-label">UV-Index</p>
                <p class="detail-value">{{ weatherData.current.uvIndex }}</p>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon">☁️</span>
              <div>
                <p class="detail-label">Bewölkung</p>
                <p class="detail-value">{{ weatherData.current.cloudCover }}%</p>
              </div>
            </div>
          </div>
        </div>

        <div class="hourly-forecast glass-card">
          <h3>Stündliche Vorhersage</h3>
          <div class="hourly-scroll">
            <div v-for="(hour, index) in weatherData.hourly" :key="index" class="hourly-item">
              <p class="hour-time">{{ hour.time }}</p>
              <span class="hour-icon">{{ hour.icon }}</span>
              <p class="hour-temp">{{ hour.temp }}°</p>
            </div>
          </div>
        </div>

        <div class="forecast glass-card">
          <h3>5-Tage Vorhersage</h3>
          <div class="forecast-list">
            <div v-for="(day, index) in weatherData.forecast" :key="index" class="forecast-item">
              <p class="forecast-day">{{ day. day }}</p>
              <span class="forecast-icon">{{ day.icon }}</span>
              <p class="forecast-desc">{{ day.description }}</p>
              <div class="forecast-temps">
                <span class="temp-max">{{ day. tempMax }}°</span>
                <span class="temp-min">{{ day.tempMin }}°</span>
              </div>
            </div>
          </div>
        </div>

        <div class="air-quality glass-card">
          <h3>Luftqualität</h3>
          <div class="aqi-display">
            <div class="aqi-value" :class="`aqi-${weatherData.airQuality.category. toLowerCase()}`">
              <span class="aqi-number">{{ weatherData.airQuality.aqi }}</span>
              <span class="aqi-label">{{ weatherData.airQuality.category }}</span>
            </div>
            <div class="pollutants">
              <div class="pollutant-item">
                <span class="pollutant-name">PM2.5</span>
                <span class="pollutant-value">{{ weatherData.airQuality.pm25 }} µg/m³</span>
              </div>
              <div class="pollutant-item">
                <span class="pollutant-name">PM10</span>
                <span class="pollutant-value">{{ weatherData.airQuality.pm10 }} µg/m³</span>
              </div>
              <div class="pollutant-item">
                <span class="pollutant-name">O₃</span>
                <span class="pollutant-value">{{ weatherData.airQuality. o3 }} µg/m³</span>
              </div>
              <div class="pollutant-item">
                <span class="pollutant-name">NO₂</span>
                <span class="pollutant-value">{{ weatherData.airQuality.no2 }} µg/m³</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="weatherData.alerts.length > 0" class="alerts glass-card">
          <h3>⚠️ Wetterwarnungen</h3>
          <div v-for="(alert, index) in weatherData.alerts" :key="index"
               class="alert-item"
               :class="`alert-${alert.severity}`">
            <p class="alert-type">{{ alert.type }}</p>
            <p class="alert-message">{{ alert.message }}</p>
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
  font-size:  1rem;
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
  border-radius: 50%;
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
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.location-header {
  text-align: center;
  margin-bottom: 1rem;
}

.location-header h1 {
  color: white;
  font-size: 3rem;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.location-info {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.coordinates {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
}

.current-weather {
  display:  flex;
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
  gap: 2rem;
}

.icon-large {
  font-size: 6rem;
}

.temp-info {
  text-align: left;
}

.temperature {
  color: white;
  font-size: 4rem;
  margin: 0;
  font-weight: 700;
}

.feels-like {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 0.5rem 0;
}

.description {
  color: white;
  font-size: 1.2rem;
  margin: 0.5rem 0 0 0;
  font-weight: 500;
}

.current-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap:  1rem;
  padding:  1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.detail-icon {
  font-size: 2rem;
}

.detail-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  margin:  0 0 0.25rem 0;
}

.detail-value {
  color:  white;
  font-size:  1.1rem;
  font-weight: 600;
  margin: 0;
}

.glass-card h3 {
  color: white;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  min-width: 80px;
}

.hour-time {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin: 0;
  font-weight: 600;
}

.hour-icon {
  font-size: 2rem;
}

.hour-temp {
  color: white;
  font-size: 1.1rem;
  font-weight:  600;
  margin: 0;
}

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.forecast-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.forecast-day {
  color: white;
  font-weight: 600;
  margin: 0;
  min-width: 100px;
}

.forecast-icon {
  font-size:  2rem;
}

.forecast-desc {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  flex:  1;
  text-align: center;
}

.forecast-temps {
  display: flex;
  gap: 1rem;
  min-width: 100px;
  justify-content: flex-end;
}

.temp-max {
  color: white;
  font-weight: 600;
}

.temp-min {
  color:  rgba(255, 255, 255, 0.7);
}

.aqi-display {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.aqi-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  border-radius: 16px;
}

.aqi-gut {
  background: rgba(72, 187, 120, 0.3);
}

.aqi-number {
  font-size: 3rem;
  font-weight: 700;
  color: white;
}

.aqi-label {
  font-size: 1.2rem;
  color: white;
  margin-top: 0.5rem;
}

.pollutants {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.pollutant-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.pollutant-name {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.pollutant-value {
  color: white;
  font-weight: 600;
}

.alerts {
  border:  2px solid rgba(255, 193, 7, 0.5);
}

.alert-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  border-left: 4px solid;
}

.alert-medium {
  border-left-color: #ff9800;
}

.alert-type {
  color: white;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.alert-message {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

@media (max-width: 768px) {
  .temp-display {
    flex-direction: column;
    text-align: center;
  }

  .temp-info {
    text-align: center;
  }

  .current-details {
    grid-template-columns: 1fr;
  }

  .forecast-item {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .location-header h1 {
    font-size: 2rem;
  }

  .temperature {
    font-size: 3rem;
  }
}
</style>
